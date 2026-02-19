const express = require('express');
const router = express.Router();
const {
  getFlashcards,
  getFlashcard,
  createFlashcard,
} = require('../controllers/flashcardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getFlashcards);
router.get('/:id', getFlashcard);
router.post('/', protect, authorize(['admin']), createFlashcard);

module.exports = router;





