const User = require('../models/User');
const Interview = require('../models/Interview');

const MIN_INTERVIEWS_FOR_GLOBAL_RANK = 5;
const BAYESIAN_PRIOR_WEIGHT = 10;

// Helper function to get user display name
const getDisplayName = (user) => {
  return user.fullName || user.name || 'User';
};

const sortByRankingRules = (a, b) => {
  if (b.adjustedScore !== a.adjustedScore) {
    return b.adjustedScore - a.adjustedScore;
  }
  if (b.averageScore !== a.averageScore) {
    return b.averageScore - a.averageScore;
  }
  if (b.totalInterviews !== a.totalInterviews) {
    return b.totalInterviews - a.totalInterviews;
  }
  const timeA = new Date(a.createdAt || 0).getTime();
  const timeB = new Date(b.createdAt || 0).getTime();
  if (timeA !== timeB) {
    return timeA - timeB;
  }
  return String(a.userId).localeCompare(String(b.userId));
};

const buildRankedEntries = (users) => {
  const globalMean = users.length > 0
    ? users.reduce((sum, user) => sum + (Number(user.averageScore) || 0), 0) / users.length
    : 0;

  const ranked = users.map((user) => {
    const averageScore = Number(user.averageScore) || 0;
    const totalInterviews = Number(user.totalInterviews) || 0;
    const adjustedScore = Math.round(
      ((averageScore * totalInterviews) + (globalMean * BAYESIAN_PRIOR_WEIGHT))
      / (totalInterviews + BAYESIAN_PRIOR_WEIGHT)
    );

    return {
      userId: user._id,
      name: getDisplayName(user),
      email: user.email,
      role: user.role,
      averageScore,
      adjustedScore,
      totalInterviews,
      createdAt: user.createdAt,
      rankReason: 'Bayesian-adjusted global score',
    };
  });

  ranked.sort(sortByRankingRules);
  return {
    globalMean: Math.round(globalMean),
    ranked: ranked.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    })),
  };
};

// @desc    Get global leaderboard
// @route   GET /api/rankings/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ totalInterviews: { $gte: MIN_INTERVIEWS_FOR_GLOBAL_RANK } })
      .select('fullName name email role averageScore totalInterviews createdAt')
      .limit(100);

    const { ranked, globalMean } = buildRankedEntries(users);

    res.json({
      success: true,
      leaderboard: ranked,
      rankingMeta: {
        method: 'bayesian_adjusted_score',
        minInterviews: MIN_INTERVIEWS_FOR_GLOBAL_RANK,
        priorWeight: BAYESIAN_PRIOR_WEIGHT,
        globalMean,
      },
    });
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
    const users = await User.find({ totalInterviews: { $gte: MIN_INTERVIEWS_FOR_GLOBAL_RANK } })
      .select('fullName name email role averageScore totalInterviews createdAt')
      .limit(Math.max(limit, 20));

    const { ranked } = buildRankedEntries(users);
    const topUsers = ranked.slice(0, limit);

    res.json({
      success: true,
      topUsers,
      rankingMeta: {
        method: 'bayesian_adjusted_score',
        minInterviews: MIN_INTERVIEWS_FOR_GLOBAL_RANK,
        priorWeight: BAYESIAN_PRIOR_WEIGHT,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top users', error: error.message });
  }
};

module.exports = {
  getLeaderboard,
  getUserStats,
  getTopUsers,
};


