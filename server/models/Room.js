const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: String,
      socketId: String,
    },
  ],
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting',
  },
  /** How many players must join before the interview starts (2 or 4). */
  requiredPlayers: {
    type: Number,
    enum: [2, 4],
    default: 4,
  },
  questions: [
    {
      question: String,
      order: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Room', roomSchema);





