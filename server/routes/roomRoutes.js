const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, startRoom, submitAnswer, completeRoom, getRoom, getLeaderboard, getUserRooms } = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRoom);
router.get('/', protect, getUserRooms);
router.post('/:roomId/join', protect, joinRoom);
router.put('/:roomId/start', protect, startRoom);
router.post('/:roomId/answer', protect, submitAnswer);
router.put('/:roomId/complete', protect, completeRoom);
router.get('/:roomId', protect, getRoom);
router.get('/:roomId/leaderboard', protect, getLeaderboard);

module.exports = router;





