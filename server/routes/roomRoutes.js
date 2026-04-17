const express = require('express');
const router = express.Router();
const {
  createRoom,
  joinRoom,
  startRoom,
  submitAnswer,
  completeRoom,
  getRoom,
  getLeaderboard,
  getUserRooms,
  inviteUserToRoom,
  getNotifications,
  markNotificationRead,
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRoom);
router.get('/', protect, getUserRooms);
router.get('/notifications/list', protect, getNotifications);
router.put('/notifications/:notificationId/read', protect, markNotificationRead);
router.post('/:roomId/join', protect, joinRoom);
router.post('/:roomId/invite', protect, inviteUserToRoom);
router.put('/:roomId/start', protect, startRoom);
router.post('/:roomId/answer', protect, submitAnswer);
router.put('/:roomId/complete', protect, completeRoom);
router.get('/:roomId', protect, getRoom);
router.get('/:roomId/leaderboard', protect, getLeaderboard);

module.exports = router;





