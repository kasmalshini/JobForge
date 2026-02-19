const User = require('../models/User');
const Interview = require('../models/Interview');

// Helper function to get user display name
const getDisplayName = (user) => {
  return user.fullName || user.name || 'User';
};

// @desc    Get global leaderboard
// @route   GET /api/rankings/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ totalInterviews: { $gt: 0 } })
      .select('fullName name email role averageScore totalInterviews rank')
      .sort({ averageScore: -1 })
      .limit(100);

    const leaderboard = users.map((user, index) => ({
      userId: user._id,
      name: getDisplayName(user),
      email: user.email,
      role: user.role,
      averageScore: user.averageScore,
      totalInterviews: user.totalInterviews,
      rank: index + 1,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/rankings/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's interviews
    const interviews = await Interview.find({ userId })
      .sort({ timestamp: -1 });

    const totalInterviews = interviews.length;
    
    if (totalInterviews === 0) {
      return res.json({
        success: true,
        stats: {
          totalInterviews: 0,
          averageScore: 0,
          averageClarity: 0,
          averageConfidence: 0,
          averageApplicability: 0,
          bestScore: 0,
          recentScores: [],
          rank: null,
        },
      });
    }

    // Calculate averages
    const totalScores = interviews.reduce((acc, interview) => {
      return {
        combined: acc.combined + (interview.combinedScore || 0),
        clarity: acc.clarity + interview.clarity,
        confidence: acc.confidence + interview.confidence,
        applicability: acc.applicability + interview.applicability,
      };
    }, { combined: 0, clarity: 0, confidence: 0, applicability: 0 });

    const averageScore = Math.round(totalScores.combined / totalInterviews);
    const averageClarity = Math.round(totalScores.clarity / totalInterviews);
    const averageConfidence = Math.round(totalScores.confidence / totalInterviews);
    const averageApplicability = Math.round(totalScores.applicability / totalInterviews);

    // Get best score
    const bestScore = Math.max(...interviews.map(i => i.combinedScore || 0));

    // Get recent scores (last 10)
    const recentScores = interviews.slice(0, 10).map(interview => ({
      combinedScore: interview.combinedScore || 0,
      clarity: interview.clarity,
      confidence: interview.confidence,
      applicability: interview.applicability,
      timestamp: interview.timestamp,
    }));

    // Get user's rank
    const user = await User.findById(userId);
    const rank = user.rank || null;

    res.json({
      success: true,
      stats: {
        totalInterviews,
        averageScore,
        averageClarity,
        averageConfidence,
        averageApplicability,
        bestScore,
        recentScores,
        rank,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
};

// @desc    Get top users
// @route   GET /api/rankings/top
// @access  Private
const getTopUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await User.find({ totalInterviews: { $gt: 0 } })
      .select('fullName name email role averageScore totalInterviews')
      .sort({ averageScore: -1 })
      .limit(limit);

    const topUsers = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: getDisplayName(user),
      email: user.email,
      role: user.role,
      averageScore: user.averageScore,
      totalInterviews: user.totalInterviews,
    }));

    res.json({ success: true, topUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top users', error: error.message });
  }
};

module.exports = {
  getLeaderboard,
  getUserStats,
  getTopUsers,
};


