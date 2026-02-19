const Room = require('../models/Room');
const Score = require('../models/Score');
const User = require('../models/User');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
const createRoom = async (req, res) => {
  try {
    const { questions = [] } = req.body;
    const userId = req.user._id;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate unique room ID
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create room with current user as first participant
    const newRoom = new Room({
      roomId,
      users: [
        {
          userId: user._id,
          name: user.fullName || user.name,
          socketId: null, // Will be set when user connects via socket
        },
      ],
      questions: questions.map((q, idx) => ({
        question: q,
        order: idx,
      })),
      status: 'waiting',
    });

    await newRoom.save();

    res.status(201).json({
      success: true,
      room: newRoom,
      roomId: newRoom.roomId,
    });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({
      message: 'Error creating room',
      error: error.message,
    });
  }
};

// @desc    Get room details
// @route   GET /api/rooms/:roomId
// @access  Private
const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

// @desc    Get room leaderboard
// @route   GET /api/rooms/:roomId/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find({ roomId: req.params.roomId })
      .populate('userId', 'fullName name')
      .sort({ totalScore: -1 });

    const leaderboard = scores.map((score, index) => ({
      userId: score.userId._id,
      userName: score.userId?.fullName || score.userId?.name || 'User',
      totalScore: score.totalScore,
      rank: index + 1,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
};

// @desc    Join an existing room
// @route   POST /api/rooms/:roomId/join
// @access  Private
const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user already in room
    const userExists = room.users.some(u => u.userId.toString() === userId.toString());
    if (userExists) {
      return res.status(400).json({ message: 'User already in room' });
    }

    // Check room status (must be waiting)
    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Room is not accepting new users' });
    }

    // Add user to room
    room.users.push({
      userId: user._id,
      name: user.fullName || user.name,
      socketId: null,
    });

    await room.save();

    res.json({
      success: true,
      message: 'Joined room successfully',
      room,
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      message: 'Error joining room',
      error: error.message,
    });
  }
};

// @desc    Start the room competition
// @route   PUT /api/rooms/:roomId/start
// @access  Private
const startRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.users.length < 1) {
      return res.status(400).json({ message: 'Room must have at least 1 user' });
    }

    room.status = 'active';
    room.startedAt = new Date();
    await room.save();

    res.json({
      success: true,
      message: 'Room started',
      room,
      startTime: room.startedAt,
      endTime: new Date(room.startedAt.getTime() + 30 * 60 * 1000),
    });
  } catch (error) {
    console.error('Start room error:', error);
    res.status(500).json({
      message: 'Error starting room',
      error: error.message,
    });
  }
};

// @desc    Submit answer to a question in room
// @route   POST /api/rooms/:roomId/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { questionIndex, answer, score } = req.body;
    const userId = req.user._id;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.status !== 'active') {
      return res.status(400).json({ message: 'Room is not active' });
    }

    // Check if room time has expired (30 minutes)
    const endTime = new Date(room.startedAt.getTime() + 30 * 60 * 1000);
    if (new Date() > endTime) {
      room.status = 'completed';
      room.completedAt = new Date();
      await room.save();
      return res.status(400).json({ message: 'Room time has expired' });
    }

    // Validate score
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({ message: 'Invalid score' });
    }

    // Find or create score record for this user in this room
    let userScore = await Score.findOne({ userId, roomId });
    if (!userScore) {
      userScore = new Score({
        userId,
        roomId,
        totalScore: 0,
        answers: [],
      });
    }

    // Add or update answer
    userScore.answers.push({
      questionIndex,
      answer,
      score,
      timestamp: new Date(),
    });

    // Recalculate total score (average of all answers)
    const avgScore = userScore.answers.reduce((sum, a) => sum + a.score, 0) / userScore.answers.length;
    userScore.totalScore = Math.round(avgScore);

    await userScore.save();

    res.json({
      success: true,
      message: 'Answer submitted',
      currentScore: userScore.totalScore,
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      message: 'Error submitting answer',
      error: error.message,
    });
  }
};

// @desc    Complete room session
// @route   PUT /api/rooms/:roomId/complete
// @access  Private
const completeRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.status = 'completed';
    room.completedAt = new Date();
    await room.save();

    // Get final leaderboard
    const scores = await Score.find({ roomId })
      .populate('userId', 'fullName name')
      .sort({ totalScore: -1 });

    const leaderboard = scores.map((score, index) => ({
      userId: score.userId._id,
      userName: score.userId?.fullName || score.userId?.name || 'User',
      totalScore: score.totalScore,
      rank: index + 1,
    }));

    res.json({
      success: true,
      message: 'Room completed',
      leaderboard,
    });
  } catch (error) {
    console.error('Complete room error:', error);
    res.status(500).json({
      message: 'Error completing room',
      error: error.message,
    });
  }
};

// @desc    Get all rooms for a user
// @route   GET /api/rooms
// @access  Private
const getUserRooms = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all rooms where user is a participant
    const rooms = await Room.find({
      'users.userId': userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    res.status(500).json({
      message: 'Error fetching rooms',
      error: error.message,
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  startRoom,
  submitAnswer,
  completeRoom,
  getRoom,
  getLeaderboard,
  getUserRooms,
};





