const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: false,
  },
  totalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  clarity: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  applicability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  answers: [
    {
      questionIndex: Number,
      answer: String,
      score: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  rank: {
    type: Number,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Score', scoreSchema);




