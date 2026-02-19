const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'general',
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  answer: {
    type: String,
    required: true,
  },
  // NEW: Track answer type
  answerType: {
    type: String,
    enum: ['text', 'voice'],
    default: 'text',
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
  feedback: {
    type: String,
    default: '',
  },
  strengths: {
    type: [String],
    default: [],
  },
  improvements: {
    type: [String],
    default: [],
  },
  combinedScore: {
    type: Number,
    default: 0,
    // Calculated as: (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
  },
  // NEW: Voice-specific metrics (only populated for voice answers)
  voiceMetrics: {
    duration: {
      type: Number,
      default: null,
    },
    wordCount: {
      type: Number,
      default: null,
    },
    wordsPerMinute: {
      type: Number,
      default: null,
    },
    fillerWords: {
      type: Number,
      default: null,
    },
    sentiment: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  // NEW: Text-specific metrics (only populated for text answers)
  textMetrics: {
    wordCount: {
      type: Number,
      default: null,
    },
    sentenceCount: {
      type: Number,
      default: null,
    },
    avgWordsPerSentence: {
      type: Number,
      default: null,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  roomId: {
    type: String,
    default: null,
  },
  // NEW: Track which skills this question is related to
  relatedSkills: {
    type: [String],
    default: [],
  },
});

// Index for better query performance
interviewSchema.index({ userId: 1, timestamp: -1 });
interviewSchema.index({ roomId: 1 });
interviewSchema.index({ category: 1, difficulty: 1 });
interviewSchema.index({ userId: 1, 'relatedSkills': 1 }); // For skill analytics queries

module.exports = mongoose.model('Interview', interviewSchema);