const express = require('express');
const { checkAvailable, transcribe } = require('../controllers/speechController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/available', checkAvailable);
router.post('/transcribe', protect, transcribe);

module.exports = router;
