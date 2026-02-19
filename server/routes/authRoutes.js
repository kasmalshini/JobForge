const express = require('express');
const router = express.Router();
const { register, login, getMe, updateRoleAndSkills, deleteAccount, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', authLimiter, resetPassword);
router.get('/me', protect, getMe);
router.put('/role-skills', protect, authLimiter, updateRoleAndSkills);
router.delete('/account', protect, authLimiter, deleteAccount);

module.exports = router;




