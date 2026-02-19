 const Interview = require('../models/Interview');
const User = require('../models/User');
const { analyzeAnswer } = require('../services/openaiService');
const Score = require('../models/Score');
const interviewAnalyzer = require('../services/interviewAnalyser');
const fs = require('fs-extra');

// Helper function to update user ranking
const updateUserRanking = async (userId) => {
  try {
    const interviews = await Interview.find({ userId });
    const totalInterviews = interviews.length;
    
    if (totalInterviews === 0) {
      await User.findByIdAndUpdate(userId, {
        averageScore: 0,
        totalInterviews: 0,
      });
      return;
    }

    const totalCombinedScore = interviews.reduce((sum, interview) => {
      return sum + (interview.combinedScore || 0);
    }, 0);

    const averageScore = Math.round(totalCombinedScore / totalInterviews);

    await User.findByIdAndUpdate(userId, {
      averageScore,
      totalInterviews,
    });

    // Update all user rankings
    await updateAllUserRankings();
  } catch (error) {
    console.error('Error updating user ranking:', error);
  }
};

// Update rankings for all users
const updateAllUserRankings = async () => {
  try {
    const users = await User.find({ totalInterviews: { $gt: 0 } })
      .sort({ averageScore: -1 });

    for (let i = 0; i < users.length; i++) {
      await User.findByIdAndUpdate(users[i]._id, { rank: i + 1 });
    }
  } catch (error) {
    console.error('Error updating all user rankings:', error);
  }
};

// @desc    Analyze interview answer (existing - text-based)
// @route   POST /api/interviews/analyze
// @access  Private
const analyzeInterviewAnswer = async (req, res) => {
  try {
    const { question, answer, category, difficulty, roomId, relatedSkills } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    // Validate field types are strings
    if (typeof question !== 'string' || typeof answer !== 'string') {
      return res.status(400).json({ message: 'Question and answer must be strings' });
    }

    // Trim whitespace and validate length
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (trimmedQuestion.length === 0 || trimmedAnswer.length === 0) {
      return res.status(400).json({ message: 'Question and answer cannot be empty' });
    }

    if (trimmedQuestion.length > 5000) {
      return res.status(400).json({ message: 'Question cannot exceed 5000 characters' });
    }

    if (trimmedAnswer.length > 10000) {
      return res.status(400).json({ message: 'Answer cannot exceed 10000 characters' });
    }

    // Validate optional fields
    if (category && typeof category !== 'string') {
      return res.status(400).json({ message: 'Category must be a string' });
    }

    if (difficulty && !['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return res.status(400).json({ message: 'Difficulty must be beginner, intermediate, or advanced' });
    }

    // Step 1: Send transcribed text to OpenAI GPT-4 API with structured prompt
    const analysis = await analyzeAnswer(trimmedQuestion, trimmedAnswer);

    // Step 2: Calculate combined score using normalized scores
    const combinedScore = Math.round(
      (analysis.clarity * 0.4) + 
      (analysis.confidence * 0.3) + 
      (analysis.applicability * 0.3)
    );

    // Step 3: Store normalized scores in database
    const interview = await Interview.create({
      userId,
      question: trimmedQuestion,
      answer: trimmedAnswer,
      answerType: 'text',
      category: category || 'general',
      difficulty: difficulty || 'intermediate',
      clarity: analysis.clarity,
      confidence: analysis.confidence,
      applicability: analysis.applicability,
      feedback: analysis.feedback,
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
      combinedScore,
      roomId: roomId || null,
      relatedSkills: Array.isArray(relatedSkills) ? relatedSkills : [],
    });

    // Update user's average score and total interviews
    await updateUserRanking(userId);

    // If part of a room/competition, save score
    if (roomId) {
      await Score.create({
        roomId,
        userId,
        interviewId: interview._id,
        totalScore: combinedScore,
      });
    }

    res.json({
      success: true,
      interviewId: interview._id,
      clarity: analysis.clarity,
      confidence: analysis.confidence,
      applicability: analysis.applicability,
      combinedScore,
      feedback: analysis.feedback,
      strengths: analysis.strengths || '',
      improvements: analysis.improvements || '',
    });
  } catch (error) {
    console.error('Error analyzing interview:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error analyzing answer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Analyze voice interview answer (NEW)
// @route   POST /api/interviews/analyze-voice
// @access  Private
const analyzeVoiceAnswer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded'
      });
    }

    const { question, category, difficulty, roomId, relatedSkills } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!question) {
      await fs.remove(req.file.path);
      return res.status(400).json({ message: 'Question is required' });
    }

    const trimmedQuestion = question.trim();

    if (trimmedQuestion.length === 0) {
      await fs.remove(req.file.path);
      return res.status(400).json({ message: 'Question cannot be empty' });
    }

    if (trimmedQuestion.length > 5000) {
      await fs.remove(req.file.path);
      return res.status(400).json({ message: 'Question cannot exceed 5000 characters' });
    }

    // Validate optional fields
    if (difficulty && !['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      await fs.remove(req.file.path);
      return res.status(400).json({ message: 'Difficulty must be beginner, intermediate, or advanced' });
    }

    console.log('🎤 Analyzing voice interview for user:', userId);
    
    // Step 1: Analyze the voice answer using AssemblyAI + OpenAI
    let result;
    try {
      result = await interviewAnalyzer.analyzeVoiceAnswer(req.file.path, trimmedQuestion);
    } catch (analysisError) {
      await fs.remove(req.file.path).catch(err => console.error('Cleanup error:', err));
      return res.status(500).json({ 
        success: false,
        message: analysisError.message || 'Error analyzing voice answer'
      });
    }
    
    // Clean up uploaded file
    await fs.remove(req.file.path);

    // Step 2: Map new scores to your existing schema
    // Using 'compliance' from new system as 'applicability' in your system
    const clarity = result.clarity;
    const confidence = result.confidence;
    const applicability = result.compliance; // Map compliance -> applicability

    // Step 3: Calculate combined score using your formula
    const combinedScore = Math.round(
      (clarity * 0.4) + 
      (confidence * 0.3) + 
      (applicability * 0.3)
    );

    // Step 4: Store in database with transcription
    const interview = await Interview.create({
      userId,
      question: trimmedQuestion,
      answer: result.metrics.transcription, // Store transcribed text
      answerType: 'voice',
      category: category || 'general',
      difficulty: difficulty || 'intermediate',
      clarity,
      confidence,
      applicability,
      feedback: result.contentAnalysis?.feedback || 'Voice answer analyzed successfully',
      strengths: result.contentAnalysis?.strengths || [],
      improvements: result.contentAnalysis?.improvements || [],
      combinedScore,
      voiceMetrics: {
        duration: result.metrics.duration,
        wordCount: result.metrics.wordCount,
        wordsPerMinute: result.metrics.wordsPerMinute,
        fillerWords: result.metrics.fillerWords,
        sentiment: result.metrics.sentiment,
      },
      roomId: roomId || null,
      relatedSkills: Array.isArray(relatedSkills) ? relatedSkills : [],
    });

    // Update user's average score and total interviews
    await updateUserRanking(userId);

    // If part of a room/competition, save score
    if (roomId) {
      await Score.create({
        roomId,
        userId,
        interviewId: interview._id,
        totalScore: combinedScore,
      });
    }

    res.json({
      success: true,
      interviewId: interview._id,
      clarity,
      confidence,
      applicability,
      combinedScore,
      feedback: interview.feedback,
      strengths: interview.strengths,
      improvements: interview.improvements,
      transcription: result.metrics.transcription,
      voiceMetrics: {
        duration: result.metrics.duration,
        wordCount: result.metrics.wordCount,
        wordsPerMinute: result.metrics.wordsPerMinute,
        fillerWords: result.metrics.fillerWords,
      },
    });

  } catch (error) {
    console.error('Voice analysis error:', error);
    
    // Clean up file on error
    if (req.file?.path) {
      await fs.remove(req.file.path).catch(() => {});
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Voice analysis failed',
      error: error.message 
    });
  }
};

// @desc    Analyze text answer with enhanced AI (NEW)
// @route   POST /api/interviews/analyze-text
// @access  Private
const analyzeTextAnswer = async (req, res) => {
  try {
    const { question, answer, category, difficulty, roomId, relatedSkills } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    if (typeof question !== 'string' || typeof answer !== 'string') {
      return res.status(400).json({ message: 'Question and answer must be strings' });
    }

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (trimmedQuestion.length === 0 || trimmedAnswer.length === 0) {
      return res.status(400).json({ message: 'Question and answer cannot be empty' });
    }

    if (trimmedQuestion.length > 5000) {
      return res.status(400).json({ message: 'Question cannot exceed 5000 characters' });
    }

    if (trimmedAnswer.length > 10000) {
      return res.status(400).json({ message: 'Answer cannot exceed 10000 characters' });
    }

    if (difficulty && !['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      return res.status(400).json({ message: 'Difficulty must be beginner, intermediate, or advanced' });
    }

    console.log('✍️ Analyzing text answer for user:', userId);
    
    // Step 1: Analyze using enhanced text analyzer
    const result = await interviewAnalyzer.analyzeWrittenAnswer(trimmedAnswer, trimmedQuestion);

    // Step 2: Map scores
    const clarity = result.clarity;
    const confidence = result.confidence;
    const applicability = result.compliance;

    // Step 3: Calculate combined score
    const combinedScore = Math.round(
      (clarity * 0.4) + 
      (confidence * 0.3) + 
      (applicability * 0.3)
    );

    // Step 4: Store in database
    const interview = await Interview.create({
      userId,
      question: trimmedQuestion,
      answer: trimmedAnswer,
      answerType: 'text',
      category: category || 'general',
      difficulty: difficulty || 'intermediate',
      clarity,
      confidence,
      applicability,
      feedback: result.contentAnalysis?.feedback || 'Answer analyzed successfully',
      strengths: result.contentAnalysis?.strengths || [],
      improvements: result.contentAnalysis?.improvements || [],
      combinedScore,
      textMetrics: {
        wordCount: result.metrics.wordCount,
        sentenceCount: result.metrics.sentenceCount,
        avgWordsPerSentence: result.metrics.avgWordsPerSentence,
      },
      roomId: roomId || null,
      relatedSkills: Array.isArray(relatedSkills) ? relatedSkills : [],
    });

    // Update user's average score and total interviews
    await updateUserRanking(userId);

    // If part of a room/competition, save score
    if (roomId) {
      await Score.create({
        roomId,
        userId,
        interviewId: interview._id,
        totalScore: combinedScore,
      });
    }

    res.json({
      success: true,
      interviewId: interview._id,
      clarity,
      confidence,
      applicability,
      combinedScore,
      feedback: interview.feedback,
      strengths: interview.strengths,
      improvements: interview.improvements,
      textMetrics: result.metrics,
    });

  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Text analysis failed',
      error: error.message 
    });
  }
};

// @desc    Get user interview statistics
// @route   GET /api/interviews/stats
// @access  Private
const getInterviewStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const interviews = await Interview.find({ userId });

    if (interviews.length === 0) {
      return res.json({
        success: true,
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestions: 0,
        avgClarity: 0,
        avgConfidence: 0,
        avgApplicability: 0,
      });
    }

    const totalInterviews = interviews.length;
    const scores = interviews.map(i => i.combinedScore);
    const clarities = interviews.map(i => i.clarity || 0);
    const confidences = interviews.map(i => i.confidence || 0);
    const applicabilities = interviews.map(i => i.applicability || 0);

    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);
    const avgClarity = Math.round(clarities.reduce((a, b) => a + b, 0) / clarities.length);
    const avgConfidence = Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length);
    const avgApplicability = Math.round(applicabilities.reduce((a, b) => a + b, 0) / applicabilities.length);

    res.json({
      success: true,
      totalInterviews,
      averageScore,
      bestScore,
      totalQuestions: totalInterviews,
      avgClarity,
      avgConfidence,
      avgApplicability,
    });
  } catch (error) {
    console.error('Error fetching interview stats:', error);
    res.status(500).json({ message: 'Error fetching interview stats', error: error.message });
  }
};

// @desc    Get user's interview history
// @route   GET /api/interviews/history
// @access  Private
const getInterviewHistory = async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;
    const userId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const interviews = await Interview.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCount = await Interview.countDocuments({ userId });

    const history = interviews.map(interview => ({
      _id: interview._id,
      role: interview.category,
      score: interview.combinedScore,
      createdAt: interview.timestamp,
      question: interview.question.substring(0, 100),
    }));

    res.json({
      success: true,
      data: history,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).json({ message: 'Error fetching interview history', error: error.message });
  }
};


// @desc    Get all user interviews with filters
// @route   GET /api/interviews?difficulty=X&category=Y
// @access  Private
const getInterviews = async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    const query = { userId: req.user._id };

    if (difficulty) {
      if (!['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
        return res.status(400).json({ message: 'Difficulty must be beginner, intermediate, or advanced' });
      }
      query.difficulty = difficulty;
    }

    if (category) {
      query.category = category;
    }

    const interviews = await Interview.find(query)
      .sort({ timestamp: -1 })
      .limit(50);

    res.json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
};

// @desc    Get single interview
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview', error: error.message });
  }
};

// @desc    Get analytics by skill
// @route   GET /api/interviews/analytics/skills
// @access  Private
const getSkillAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all interviews for this user
    const interviews = await Interview.find({ userId });

    // Aggregate performance by skill
    const skillAnalytics = {};

    interviews.forEach(interview => {
      if (interview.relatedSkills && Array.isArray(interview.relatedSkills)) {
        interview.relatedSkills.forEach(skill => {
          if (!skillAnalytics[skill]) {
            skillAnalytics[skill] = {
              skill,
              totalInterviews: 0,
              averageScore: 0,
              totalClarity: 0,
              totalConfidence: 0,
              totalApplicability: 0,
              scores: []
            };
          }
          skillAnalytics[skill].totalInterviews++;
          skillAnalytics[skill].totalClarity += interview.clarity || 0;
          skillAnalytics[skill].totalConfidence += interview.confidence || 0;
          skillAnalytics[skill].totalApplicability += interview.applicability || 0;
          skillAnalytics[skill].scores.push(interview.combinedScore);
        });
      }
    });

    // Calculate averages
    const skillBreakdown = Object.values(skillAnalytics).map(skill => ({
      skill: skill.skill,
      totalInterviews: skill.totalInterviews,
      averageScore: Math.round(skill.totalInterviews > 0 ? skill.scores.reduce((a, b) => a + b, 0) / skill.totalInterviews : 0),
      averageClarity: Math.round(skill.totalClarity / skill.totalInterviews),
      averageConfidence: Math.round(skill.totalConfidence / skill.totalInterviews),
      averageApplicability: Math.round(skill.totalApplicability / skill.totalInterviews),
    })).sort((a, b) => b.totalInterviews - a.totalInterviews);

    res.json({ success: true, skillAnalytics: skillBreakdown });
  } catch (error) {
    console.error('Error fetching skill analytics:', error);
    res.status(500).json({ message: 'Error fetching skill analytics', error: error.message });
  }
};

// @desc    Get performance trends over time
// @route   GET /api/interviews/analytics/trends
// @access  Private
const getPerformanceTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get interviews from last N days
    const interviews = await Interview.find({
      userId,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: 1 });

    // Group by date and calculate daily average
    const trendData = {};
    interviews.forEach(interview => {
      const dateKey = interview.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!trendData[dateKey]) {
        trendData[dateKey] = {
          date: dateKey,
          interviews: [],
          averageScore: 0,
          count: 0
        };
      }
      trendData[dateKey].interviews.push(interview.combinedScore);
      trendData[dateKey].count++;
    });

    // Calculate daily averages
    const trends = Object.values(trendData).map(day => ({
      date: day.date,
      averageScore: Math.round(day.interviews.reduce((a, b) => a + b, 0) / day.count),
      interviewCount: day.count
    }));

    res.json({ success: true, trends });
  } catch (error) {
    console.error('Error fetching performance trends:', error);
    res.status(500).json({ message: 'Error fetching performance trends', error: error.message });
  }
};

// @desc    Get category-wise breakdown
// @route   GET /api/interviews/analytics/categories
// @access  Private
const getCategoryAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all interviews for this user
    const interviews = await Interview.find({ userId });

    // Aggregate performance by category
    const categoryAnalytics = {};

    interviews.forEach(interview => {
      const category = interview.category || 'general';
      if (!categoryAnalytics[category]) {
        categoryAnalytics[category] = {
          category,
          totalInterviews: 0,
          averageScore: 0,
          totalClarity: 0,
          totalConfidence: 0,
          totalApplicability: 0,
          scores: []
        };
      }
      categoryAnalytics[category].totalInterviews++;
      categoryAnalytics[category].totalClarity += interview.clarity || 0;
      categoryAnalytics[category].totalConfidence += interview.confidence || 0;
      categoryAnalytics[category].totalApplicability += interview.applicability || 0;
      categoryAnalytics[category].scores.push(interview.combinedScore);
    });

    // Calculate averages
    const categoryBreakdown = Object.values(categoryAnalytics).map(cat => ({
      category: cat.category,
      totalInterviews: cat.totalInterviews,
      averageScore: Math.round(cat.totalInterviews > 0 ? cat.scores.reduce((a, b) => a + b, 0) / cat.totalInterviews : 0),
      averageClarity: Math.round(cat.totalClarity / cat.totalInterviews),
      averageConfidence: Math.round(cat.totalConfidence / cat.totalInterviews),
      averageApplicability: Math.round(cat.totalApplicability / cat.totalInterviews),
    })).sort((a, b) => b.totalInterviews - a.totalInterviews);

    res.json({ success: true, categoryAnalytics: categoryBreakdown });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    res.status(500).json({ message: 'Error fetching category analytics', error: error.message });
  }
};

// @desc    Get detailed feedback history
// @route   GET /api/interviews/analytics/feedback
// @access  Private
const getFeedbackHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get interviews with feedback, sorted by newest first
    const interviews = await Interview.find({ userId })
      .select('question category difficulty combinedScore feedback strengths improvements timestamp answerType relatedSkills')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await Interview.countDocuments({ userId });

    const feedbackHistory = interviews.map(interview => ({
      interviewId: interview._id,
      question: interview.question,
      category: interview.category,
      difficulty: interview.difficulty,
      score: interview.combinedScore,
      feedback: interview.feedback,
      strengths: interview.strengths,
      improvements: interview.improvements,
      answerType: interview.answerType,
      relatedSkills: interview.relatedSkills,
      timestamp: interview.timestamp
    }));

    res.json({
      success: true,
      feedbackHistory,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalInterviews: totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching feedback history:', error);
    res.status(500).json({ message: 'Error fetching feedback history', error: error.message });
  }
};

module.exports = {
  analyzeInterviewAnswer,
  analyzeVoiceAnswer,
  analyzeTextAnswer,
  getInterviews,
  getInterview,
  getInterviewStats,     // NEW
  getInterviewHistory,   // NEW
  getSkillAnalytics,
  getPerformanceTrends,
  getCategoryAnalytics,
  getFeedbackHistory,
};