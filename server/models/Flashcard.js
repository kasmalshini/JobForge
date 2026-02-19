const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['interview-tips', 'software-development'],
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Flashcard', flashcardSchema);





