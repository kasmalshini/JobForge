const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getUserStats,
  getTopUsers,
} = require('../controllers/rankingController');
const { protect } = require('../middleware/auth');

router.get('/leaderboard', protect, getLeaderboard);
router.get('/stats', protect, getUserStats);
router.get('/top', protect, getTopUsers);

module.exports = router;


