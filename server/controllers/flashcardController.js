const Flashcard = require('../models/Flashcard');

// @desc    Get all flashcards
// @route   GET /api/flashcards?category=X&difficulty=Y
// @access  Public (or Private if needed)
const getFlashcards = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        return res.status(400).json({ message: 'Difficulty must be easy, medium, or hard' });
      }
      query.difficulty = difficulty;
    }

    const flashcards = await Flashcard.find(query).sort({ createdAt: -1 });
    res.json({ success: true, flashcards });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flashcards', error: error.message });
  }
};

// @desc    Get single flashcard
// @route   GET /api/flashcards/:id
// @access  Public
const getFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    res.json({ success: true, flashcard });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flashcard', error: error.message });
  }
};

// @desc    Create flashcard (admin only - for seeding)
// @route   POST /api/flashcards
// @access  Private
const createFlashcard = async (req, res) => {
  try {
    const { category, question, answer, difficulty } = req.body;
    
    const flashcard = await Flashcard.create({
      category,
      question,
      answer,
      difficulty: difficulty || 'medium',
    });
    
    res.status(201).json({ success: true, flashcard });
  } catch (error) {
    res.status(500).json({ message: 'Error creating flashcard', error: error.message });
  }
};

module.exports = {
  getFlashcards,
  getFlashcard,
  createFlashcard,
};





