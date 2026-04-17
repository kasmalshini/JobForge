const Room = require('../models/Room');
const Score = require('../models/Score');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "Why do you want to work here?",
  "Where do you see yourself in 5 years?",
  "What is your biggest weakness?",
  "Tell me about a challenging project you worked on.",
  "How do you handle stress and pressure?",
  "Why should we hire you?",
  "Describe a time you failed and what you learned from it.",
  "How do you handle conflict with a coworker?",
];

const TOTAL_COMPETITION_QUESTIONS = INTERVIEW_QUESTIONS.length;

let activeRooms = new Map(); // roomId -> { users: [], status: 'waiting'|'active'|'completed' }
let ioInstance = null;

const normalizeRequiredPlayers = (value) => {
  const n = Number(value);
  if (n === 2 || n === 4) return n;
  return 4;
};

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
  ioInstance = io;

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
    socket.join(`user:${socket.user._id.toString()}`);

    // Join room
    socket.on('join-room', async (data) => {
      try {
        // Verify user ID matches authenticated user
        if (data.userId !== socket.user._id.toString()) {
          socket.emit('error', { message: 'User ID mismatch' });
          return;
        }

        const { userId, userName, roomId, requiredPlayers: requiredPlayersRaw } = data;
        const requestedPlayers = normalizeRequiredPlayers(requiredPlayersRaw);

        // Find or create room
        let room = await Room.findOne({ roomId, status: { $in: ['waiting', 'active'] } });

        if (!room) {
          room = await Room.create({
            roomId,
            users: [{ userId, name: userName, socketId: socket.id }],
            status: 'waiting',
            requiredPlayers: requestedPlayers,
            questions: INTERVIEW_QUESTIONS.map((q, i) => ({ question: q, order: i })),
          });
        } else {
          const rp = room.requiredPlayers ?? 4;
          if (
            requiredPlayersRaw != null &&
            normalizeRequiredPlayers(requiredPlayersRaw) !== rp
          ) {
            socket.emit('error', {
              message:
                'This room was created for a different match size. Use the same 2- or 4-player setting.',
            });
            return;
          }
          if (room.users.length < rp && !room.users.find((u) => u.userId.toString() === userId)) {
            room.users.push({ userId, name: userName, socketId: socket.id });
            await room.save();
          }
        }

        const maxUsers = room.requiredPlayers ?? 4;

        socket.join(roomId);
        activeRooms.set(roomId, {
          users: room.users,
          status: room.status,
          currentQuestionIndex: 0,
          requiredPlayers: maxUsers,
        });

        // Real-time room updates: Notify all users in room
        io.to(roomId).emit('room-updated', {
          users: room.users,
          status: room.status,
          roomId,
          userCount: room.users.length,
          maxUsers,
          requiredPlayers: maxUsers,
        });

        // When enough players join, start the interview
        if (room.users.length === maxUsers && room.status === 'waiting') {
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
          requiredPlayers: maxUsers,
        });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Submit answer (one event per question; total score is the sum of correct answers)
    socket.on('submit-answer', async (data) => {
      try {
        const {
          roomId,
          userId,
          answer,
          scores,
          interviewId,
          questionIndex,
          totalQuestions,
          questionPoint,
          isCorrect,
        } = data;

        const dbRoom = await Room.findOne({ roomId });
        if (!dbRoom || dbRoom.status !== 'active') {
          socket.emit('error', { message: 'Room not found or not active' });
          return;
        }

        if (userId !== socket.user._id.toString()) {
          socket.emit('error', { message: 'User ID mismatch' });
          return;
        }

        if (!dbRoom.users.some((u) => u.userId.toString() === userId)) {
          socket.emit('error', { message: 'You are not in this room' });
          return;
        }

        const qIndex = typeof questionIndex === 'number' ? questionIndex : 0;
        const qTotal =
          typeof totalQuestions === 'number' ? totalQuestions : TOTAL_COMPETITION_QUESTIONS;
        if (qIndex < 0 || qIndex >= qTotal || qTotal !== TOTAL_COMPETITION_QUESTIONS) {
          socket.emit('error', { message: 'Invalid question index' });
          return;
        }

        const normalizedPoint =
          typeof questionPoint === 'number'
            ? questionPoint
            : (isCorrect ? 1 : 0);
        if (normalizedPoint !== 0 && normalizedPoint !== 1) {
          socket.emit('error', { message: 'Invalid question score' });
          return;
        }

        const clarity = Number(scores.clarity) || 0;
        const confidence = Number(scores.confidence) || 0;
        const applicability = Number(scores.applicability) || 0;

        const answerEntry = {
          questionIndex: qIndex,
          answer: String(answer || '').slice(0, 10000),
          score: normalizedPoint,
          timestamp: new Date(),
        };

        let userScore = await Score.findOne({ roomId, userId });

        if (!userScore) {
          userScore = new Score({
            roomId,
            userId,
            interviewId: interviewId || null,
            totalScore: normalizedPoint,
            clarity,
            confidence,
            applicability,
            answers: [answerEntry],
          });
        } else {
          const existingIdx = userScore.answers.findIndex((a) => a.questionIndex === qIndex);
          if (existingIdx !== -1) {
            userScore.answers[existingIdx] = answerEntry;
          } else {
            userScore.answers.push(answerEntry);
          }
          userScore.answers.sort((a, b) => a.questionIndex - b.questionIndex);
          userScore.totalScore = userScore.answers.reduce((sum, a) => sum + a.score, 0);
          userScore.clarity = clarity;
          userScore.confidence = confidence;
          userScore.applicability = applicability;
          if (interviewId) userScore.interviewId = interviewId;
        }

        await userScore.save();

        io.to(roomId).emit('answer-submitted', {
          userId,
          scores: { clarity, confidence, applicability },
          questionPoint: normalizedPoint,
          totalScore: userScore.totalScore,
          questionIndex: qIndex,
        });

        io.to(roomId).emit('leaderboard-refresh', { roomId });

        const allScores = await Score.find({ roomId }).populate('userId', 'fullName name email');
        const roomUserIds = new Set(dbRoom.users.map((u) => u.userId.toString()));
        const scoresInRoom = allScores.filter(
          (s) => s.userId && roomUserIds.has(s.userId._id.toString())
        );

        const everyoneAnsweredAll =
          scoresInRoom.length === dbRoom.users.length &&
          scoresInRoom.every(
            (s) =>
              s.answers &&
              s.answers.length === TOTAL_COMPETITION_QUESTIONS
          );

        if (everyoneAnsweredAll) {
          const rankedScores = scoresInRoom
            .sort((a, b) => b.totalScore - a.totalScore)
            .map((score, index) => ({
              ...score.toObject(),
              rank: index + 1,
              userName: score.userId?.fullName || score.userId?.name || 'Unknown User',
            }));

          for (const rs of rankedScores) {
            await Score.findByIdAndUpdate(rs._id, { rank: rs.rank });
          }

          const roomDoc = await Room.findOne({ roomId });
          if (roomDoc) {
            roomDoc.status = 'completed';
            roomDoc.completedAt = new Date();
            await roomDoc.save();
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
        const roomDoc = await Room.findOne({ roomId });
        const allowedUserIds = roomDoc
          ? new Set(roomDoc.users.map((u) => u.userId.toString()))
          : null;

        let scores = await Score.find({ roomId })
          .populate('userId', 'fullName name')
          .sort({ totalScore: -1 });

        if (allowedUserIds) {
          scores = scores.filter(
            (s) => s.userId && allowedUserIds.has(s.userId._id.toString())
          );
        }

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

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      for (const [roomId, roomData] of activeRooms.entries()) {
        const userIndex = roomData.users.findIndex((u) => u.socketId === socket.id);
        if (userIndex === -1) continue;

        roomData.users.splice(userIndex, 1);
        const maxUsers = roomData.requiredPlayers ?? 4;

        if (roomData.users.length === 0) {
          activeRooms.delete(roomId);
          Room.findOneAndUpdate(
            { roomId },
            { status: 'completed', completedAt: new Date() }
          ).catch((err) => console.error('Error closing room on disconnect:', err));
        } else {
          io.to(roomId).emit('room-updated', {
            users: roomData.users,
            status: roomData.status,
            roomId,
            userCount: roomData.users.length,
            maxUsers,
            requiredPlayers: maxUsers,
          });
        }
      }
    });
  });
};

const emitToUser = (userId, event, payload) => {
  if (!ioInstance || !userId || !event) {
    return;
  }
  ioInstance.to(`user:${String(userId)}`).emit(event, payload);
};

module.exports = socketService;
module.exports.emitToUser = emitToUser;

