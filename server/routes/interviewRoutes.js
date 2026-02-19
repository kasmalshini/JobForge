const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  analyzeInterviewAnswer,
  getInterviews,
  getInterview,
  analyzeVoiceAnswer,
  analyzeTextAnswer,
  getInterviewStats,
  getInterviewHistory,
  getSkillAnalytics,
  getPerformanceTrends,
  getCategoryAnalytics,
  getFeedbackHistory,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const { openaiLimiter } = require('../middleware/rateLimiter');

// Configure multer for audio uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/webm', 'audio/ogg'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|webm|ogg)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Existing routes
router.post('/analyze', protect, openaiLimiter, analyzeInterviewAnswer);

// New routes for voice and text analysis
router.post('/analyze-voice', protect, openaiLimiter, upload.single('audio'), analyzeVoiceAnswer);
router.post('/analyze-text', protect, openaiLimiter, analyzeTextAnswer);

// Stats and history endpoints (before analytics to avoid route collision)
router.get('/stats', protect, getInterviewStats);
router.get('/history', protect, getInterviewHistory);

// NEW: Analytics routes (must come BEFORE the :id route)
router.get('/analytics/skills', protect, getSkillAnalytics);
router.get('/analytics/trends', protect, getPerformanceTrends);
router.get('/analytics/categories', protect, getCategoryAnalytics);
router.get('/analytics/feedback', protect, getFeedbackHistory);

// Generic routes (must come LAST)
router.get('/', protect, getInterviews);
router.get('/:id', protect, getInterview);

module.exports = router;