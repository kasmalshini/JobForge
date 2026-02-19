const Room = require('../models/Room');
const Score = require('../models/Score');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "Why do you want to work here?",
  "Where do you see yourself in 5 years?",
];

let activeRooms = new Map(); // roomId -> { users: [], status: 'waiting'|'active'|'completed' }

// Verify JWT token from socket handshake
const verifyToken = async (socket) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    return { valid: true, user };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

const socketService = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    const verification = await verifyToken(socket);

    if (!verification.valid) {
      return next(new Error(verification.error));
    }

    socket.user = verification.user;
    next();
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id, 'User ID:', socket.user._id);

    // Join room
    socket.on('join-room', async (data) => {
      try {
        // Verify user ID matches authenticated user
        if (data.userId !== socket.user._id.toString()) {
          socket.emit('error', { message: 'User ID mismatch' });
          return;
        }

        const { userId, userName, roomId } = data;

        // Find or create room
        let room = await Room.findOne({ roomId, status: { $in: ['waiting', 'active'] } });

        if (!room) {
          // Create new room
          room = await Room.create({
            roomId,
            users: [{ userId, name: userName, socketId: socket.id }],
            status: 'waiting',
            questions: INTERVIEW_QUESTIONS.map((q, i) => ({ question: q, order: i })),
          });
        } else {
          // Add user to existing room
          if (room.users.length < 4 && !room.users.find((u) => u.userId.toString() === userId)) {
            room.users.push({ userId, name: userName, socketId: socket.id });
            await room.save();
          }
        }

        socket.join(roomId);
        activeRooms.set(roomId, {
          users: room.users,
          status: room.status,
          currentQuestionIndex: 0,
        });

        // Real-time room updates: Notify all users in room
        io.to(roomId).emit('room-updated', {
          users: room.users,
          status: room.status,
          roomId,
          userCount: room.users.length,
          maxUsers: 4,
        });

        // If 4 users joined, start the competition
        if (room.users.length === 4 && room.status === 'waiting') {
          room.status = 'active';
          room.startedAt = new Date();
          await room.save();

          activeRooms.set(roomId, {
            ...activeRooms.get(roomId),
            status: 'active',
          });

          // Broadcast competition start to all users
          io.to(roomId).emit('competition-started', {
            roomId,
            question: INTERVIEW_QUESTIONS[0],
            questionIndex: 0,
            totalQuestions: INTERVIEW_QUESTIONS.length,
            users: room.users,
          });
        }

        socket.emit('joined-room', {
          roomId,
          users: room.users,
          status: room.status,
        });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Submit answer
    socket.on('submit-answer', async (data) => {
      try {
        const { roomId, userId, question, answer, scores, interviewId } = data;
        const room = activeRooms.get(roomId);

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Verify userId matches authenticated user
        if (userId !== socket.user._id.toString()) {
          socket.emit('error', { message: 'User ID mismatch' });
          return;
        }

        // Check if user already submitted (prevent duplicates)
        const existingScore = await Score.findOne({ roomId, userId });
        if (existingScore) {
          socket.emit('error', { message: 'You have already submitted for this question' });
          return;
        }

        // Calculate combined score: (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
        const combinedScore = Math.round(
          (scores.clarity * 0.4) + 
          (scores.confidence * 0.3) + 
          (scores.applicability * 0.3)
        );

        // Save score with detailed breakdown for real-time leaderboard
        await Score.create({
          roomId,
          userId,
          interviewId: interviewId || null,
          totalScore: combinedScore,
          clarity: scores.clarity || 0,
          confidence: scores.confidence || 0,
          applicability: scores.applicability || 0,
        });

        // Real-time scoring: Notify all users in room
        io.to(roomId).emit('answer-submitted', {
          userId,
          scores,
          combinedScore,
          totalScore: combinedScore,
        });

        // Trigger leaderboard refresh for all users
        io.to(roomId).emit('leaderboard-refresh', { roomId });

        // Check if all users have submitted
        const allScores = await Score.find({ roomId }).populate('userId', 'fullName name email');
        
        // Verify all users actually exist and submitted
        if (allScores.length === room.users.length && allScores.every(s => s.userId)) {
          // Calculate rankings based on combined score
          const rankedScores = allScores
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((score, index) => ({
              ...score.toObject(),
              rank: index + 1,
              userName: score.userId?.fullName || score.userId?.name || 'Unknown User',
            }));

          // Update ranks in database
          for (const score of rankedScores) {
            await Score.findByIdAndUpdate(score._id, { rank: score.rank });
          }

          // Complete the room
          const dbRoom = await Room.findOne({ roomId });
          if (dbRoom) {
            dbRoom.status = 'completed';
            dbRoom.completedAt = new Date();
            await dbRoom.save();
          }

          activeRooms.delete(roomId);

          io.to(roomId).emit('competition-completed', {
            rankings: rankedScores,
          });
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
        socket.emit('error', { message: 'Failed to submit answer' });
      }
    });

    // Get leaderboard (real-time updates)
    socket.on('get-leaderboard', async (data) => {
      try {
        const { roomId } = data;
        const scores = await Score.find({ roomId })
          .populate('userId', 'fullName name')
          .sort({ totalScore: -1 });

        const leaderboard = scores.map((score, index) => ({
          userId: score.userId._id.toString(),
          userName: score.userId?.fullName || score.userId?.name || 'User',
          totalScore: score.totalScore,
          rank: index + 1,
          clarity: score.clarity || 0,
          confidence: score.confidence || 0,
          applicability: score.applicability || 0,
        }));

        socket.emit('leaderboard-updated', { leaderboard });
      } catch (error) {
        console.error('Error getting leaderboard:', error);
        socket.emit('error', { message: 'Failed to get leaderboard' });
      }
    });

    // Real-time score update broadcast
    socket.on('score-update', async (data) => {
      try {
        const { roomId } = data;
        // Broadcast to all users in room to refresh leaderboard
        io.to(roomId).emit('leaderboard-refresh', { roomId });
      } catch (error) {
        console.error('Error broadcasting score update:', error);
      }
    });

    // Leave room
    socket.on('leave-room', (data) => {
      const { roomId } = data;
      socket.leave(roomId);
      socket.emit('left-room', { roomId });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      for (const [roomId, roomData] of activeRooms.entries()) {
        const userIndex = roomData.users.findIndex(u => u.socketId === socket.id);
        if (userIndex !== -1) {
          roomData.users.splice(userIndex, 1);
          if (roomData.users.length === 0) {
            activeRooms.delete(roomId);
            Room.findOneAndUpdate({ roomId }, { status: 'abandoned' }).catch(err => 
              console.error('Error updating abandoned room:', err)
            );
          } else {
            io.to(roomId).emit('room-updated', {
              users: roomData.users,
              status: roomData.status,
              roomId,
              userCount: roomData.users.length,
              maxUsers: 4,
            });
          }
        }
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove user from active rooms
      for (const [roomId, room] of activeRooms.entries()) {
        const userIndex = room.users.findIndex((u) => u.socketId === socket.id);
        if (userIndex !== -1) {
          room.users.splice(userIndex, 1);
          io.to(roomId).emit('room-updated', {
            users: room.users,
            status: room.status,
            roomId,
          });
        }
      }
    });
  });
};

module.exports = socketService;

