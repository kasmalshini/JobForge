const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateRoleAndSkills,
  deleteAccount,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', authLimiter, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', protect, getMe);
router.post('/resend-verification', protect, authLimiter, resendVerificationEmail);
router.put('/role-skills', protect, authLimiter, updateRoleAndSkills);
router.delete('/account', protect, authLimiter, deleteAccount);

module.exports = router;




