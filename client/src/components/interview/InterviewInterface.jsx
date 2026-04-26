import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import QuestionBubble from './QuestionBubble';
import VoiceRecorder from './VoiceRecorder';
import ScoreDisplay from './ScoreDisplay';
import { useQuestionSpeech } from '../../hooks/useQuestionSpeech';
import { getSocket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  GENERAL_QUESTIONS,
  ROLE_QUESTIONS,
  getQuestionText,
  getQuestionCategory,
  getQuestionDifficulty,
} from '../../data/interviewQuestions';

// Combine both question types for mixed/general
const INTERVIEW_QUESTIONS = [...GENERAL_QUESTIONS, ...(ROLE_QUESTIONS["Software Developer"] || [])];

/** Must match server `TOTAL_COMPETITION_QUESTIONS` (first N general questions). */
const COMPETITION_QUESTION_COUNT = 10;
const COMPETITION_QUESTIONS = GENERAL_QUESTIONS.slice(0, COMPETITION_QUESTION_COUNT);
const MIN_QUESTION_COUNT = 10;

const InterviewInterface = ({ onComplete, roomId = null, category = 'mixed', difficulty = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getSelectedLabel = () => {
    if (roomId) return 'Competition';
    if (category === null) return 'Role-Specific';
    if (category === 'general') return 'General';
    if (category === 'software') return 'Software';
    return 'Mixed';
  };

  const getDifficultyLabel = () => {
    if (!difficulty || difficulty === 'all') return 'All';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const dedupeQuestions = (questionList) => {
    const seen = new Set();
    return questionList.filter((q) => {
      const text = getQuestionText(q);
      if (!text || seen.has(text)) return false;
      seen.add(text);
      return true;
    });
  };

  const filterQuestionsByDifficulty = (questionList, level) => {
    return questionList.filter((q) => getQuestionDifficulty(q) === level);
  };

  const pickQuestionsForDifficulty = (primaryPool, fallbackPool = []) => {
    const normalizedPrimary = dedupeQuestions(primaryPool);
    const normalizedFallback = dedupeQuestions(fallbackPool);
    const mergedPool = dedupeQuestions([...normalizedPrimary, ...normalizedFallback]);

    if (!difficulty || difficulty === 'all') {
      if (normalizedPrimary.length >= MIN_QUESTION_COUNT) return normalizedPrimary;
      return dedupeQuestions([...normalizedPrimary, ...mergedPool]);
    }

    const fromPrimary = filterQuestionsByDifficulty(normalizedPrimary, difficulty);
    const fromFallback = filterQuestionsByDifficulty(normalizedFallback, difficulty);
    let selected = dedupeQuestions([...fromPrimary, ...fromFallback]);

    // Ensure each difficulty selection has at least 10 questions when enough data exists.
    if (selected.length < MIN_QUESTION_COUNT) {
      const fillPool = mergedPool.filter((q) => !selected.includes(q));
      selected = dedupeQuestions([...selected, ...fillPool]);
    }

    // Last fallback: keep interview running even if the chosen level has no items in this type.
    if (selected.length === 0) {
      return normalizedPrimary.length > 0 ? normalizedPrimary : normalizedFallback;
    }

    return selected;
  };
  
  // Select questions based on category, user role, and difficulty
  const getQuestions = () => {
    const userRolePool = user?.role && ROLE_QUESTIONS[user.role] ? ROLE_QUESTIONS[user.role] : [];
    const softwarePool = ROLE_QUESTIONS["Software Developer"] || [];

    // Role-specific
    if (category === null) {
      return pickQuestionsForDifficulty(
        userRolePool,
        [...userRolePool, ...GENERAL_QUESTIONS]
      );
    }

    // General interview
    if (category === 'general') {
      return pickQuestionsForDifficulty(
        GENERAL_QUESTIONS,
        [...GENERAL_QUESTIONS, ...INTERVIEW_QUESTIONS]
      );
    }

    // Software development interview
    if (category === 'software') {
      return pickQuestionsForDifficulty(
        softwarePool,
        [...softwarePool, ...GENERAL_QUESTIONS]
      );
    }

    // Mixed interview
    return pickQuestionsForDifficulty(
      INTERVIEW_QUESTIONS,
      [...INTERVIEW_QUESTIONS, ...userRolePool]
    );
  };

  const questions = roomId ? COMPETITION_QUESTIONS : getQuestions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionObj = questions[currentQuestionIndex] || questions[0];
  const currentQuestion = getQuestionText(currentQuestionObj);
  const currentCategory = getQuestionCategory(currentQuestionObj);
  const currentDifficulty = getQuestionDifficulty(currentQuestionObj);
  const [scores, setScores] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [strengths, setStrengths] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [currentSubmittedAnswer, setCurrentSubmittedAnswer] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [allScores, setAllScores] = useState([]); // Track all question scores

  useEffect(() => {
    // Animate question appearance
    setIsQuestionVisible(false);
    setTimeout(() => setIsQuestionVisible(true), 300);
  }, [currentQuestionIndex]);

  // Text-to-speech: avatar speaks the question when it pops up; isSpeaking drives lip-sync
  const isAvatarSpeaking = useQuestionSpeech(currentQuestion, isQuestionVisible && !scores);

  const handleAnswerSubmit = async (submittedAnswer) => {
    setIsAnalyzing(true);
    setCurrentSubmittedAnswer(submittedAnswer || '');

      try {
        const response = await api.post('/interviews/analyze', {
          question: currentQuestion,
          answer: submittedAnswer,
          category: currentCategory,
          difficulty: currentDifficulty,
          roomId,
        });

      const data = response.data;
      
      if (data.success) {
        const answerScores = {
          clarity: data.clarity,
          confidence: data.confidence,
          applicability: data.applicability,
        };
        setScores(answerScores);
        setFeedback(data.feedback || '');
        setStrengths(
          Array.isArray(data.strengths)
            ? data.strengths
            : (data.strengths ? [data.strengths] : [])
        );
        setImprovements(
          Array.isArray(data.improvements)
            ? data.improvements
            : (data.improvements ? [data.improvements] : [])
        );

        // Track this score for final calculation
        const combinedScore = Math.round(
          (data.clarity * 0.4) + 
          (data.confidence * 0.3) + 
          (data.applicability * 0.3)
        );
        const questionPoint = combinedScore >= 60 && data.applicability >= 50 ? 1 : 0;
        setAllScores((prevScores) => [...prevScores, {
          question: currentQuestion,
          submittedAnswer,
          clarity: data.clarity,
          confidence: data.confidence,
          applicability: data.applicability,
          combinedScore,
          questionPoint,
        }]);

        // If in competition mode, emit socket event
        if (roomId) {
          const socket = getSocket();
          if (socket) {
            socket.emit('submit-answer', {
              roomId,
              userId: user._id,
              question: currentQuestion,
              answer: submittedAnswer,
              scores: answerScores,
              interviewId: data.interviewId,
              questionIndex: currentQuestionIndex,
              totalQuestions: COMPETITION_QUESTION_COUNT,
              questionPoint,
              isCorrect: questionPoint === 1,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing answer:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextQuestion = () => {
    if (roomId) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setScores(null);
        setFeedback('');
        setStrengths([]);
        setImprovements([]);
        setCurrentSubmittedAnswer('');
        setIsQuestionVisible(false);
        setTimeout(() => setIsQuestionVisible(true), 300);
        return;
      }
      setInterviewComplete(true);
      if (onComplete) onComplete();
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setScores(null);
      setFeedback('');
      setStrengths([]);
      setImprovements([]);
      setCurrentSubmittedAnswer('');
      setIsQuestionVisible(false);
      // Keep allScores for final calculation
      setTimeout(() => setIsQuestionVisible(true), 300);
    } else {
      // After 20 questions (or all questions), show final summary
      setInterviewComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Calculate final average if we have 20+ questions
  const finalAverage = allScores.length > 0
    ? Math.round(allScores.reduce((sum, s) => sum + s.combinedScore, 0) / allScores.length)
    : null;
  const totalPoints = allScores.reduce((sum, s) => sum + (s.questionPoint || 0), 0);

  if (!currentQuestionObj || !currentQuestion) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <h3 style={styles.emptyStateTitle}>No questions available</h3>
          <p style={styles.emptyStateText}>
            Try a different difficulty or interview type.
          </p>
        </div>
      </div>
    );
  }

  if (interviewComplete) {
    return (
      <div style={styles.completeContainer}>
        <h2 style={styles.completeTitle}>Interview Complete! 🎉</h2>
        {finalAverage !== null && (
          <div style={styles.finalSummary}>
            <h3 style={styles.summaryTitle}>Final Results</h3>
            <div style={styles.summaryStats}>
              <div style={styles.summaryStat}>
                <div style={styles.summaryLabel}>Questions Answered</div>
                <div style={styles.summaryValue}>{allScores.length}</div>
              </div>
              <div style={styles.summaryStat}>
                <div style={styles.summaryLabel}>Average Combined Score</div>
                <div style={styles.summaryValue}>{finalAverage}/100</div>
              </div>
              {roomId && (
                <div style={styles.summaryStat}>
                  <div style={styles.summaryLabel}>Competition Points</div>
                  <div style={styles.summaryValue}>{totalPoints}/{COMPETITION_QUESTION_COUNT}</div>
                </div>
              )}
            </div>
            <p style={styles.summaryNote}>
              Your ranking is based on your average combined score: (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
            </p>
          </div>
        )}
        {allScores.length > 0 && (
          <div style={styles.answerReviewSection}>
            <h3 style={styles.answerReviewTitle}>Your Submitted Answers</h3>
            <div style={styles.answerReviewList}>
              {allScores.map((entry, index) => (
                <div key={`review-${index}`} style={styles.answerReviewCard}>
                  <div style={styles.answerReviewMeta}>
                    <span style={styles.answerReviewIndex}>Question {index + 1}</span>
                    <span style={styles.answerReviewScore}>Score: {entry.combinedScore}/100</span>
                  </div>
                  <p style={styles.answerReviewQuestion}>{entry.question}</p>
                  <div style={styles.answerReviewAnswerBlock}>
                    <div style={styles.answerReviewAnswerLabel}>Your exact answer:</div>
                    <p style={styles.answerReviewAnswer}>
                      {entry.submittedAnswer || 'No answer submitted.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <p style={styles.completeText}>
          Great job completing the interview. Check your dashboard for your results.
        </p>
        <button
          onClick={() => navigate('/stats')}
          style={styles.viewStatsButton}
        >
          View My Statistics
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.interviewArea}>
        <div style={styles.sessionSummary}>
          Selected: {getSelectedLabel()} | Difficulty: {getDifficultyLabel()} | Questions: {questions.length}
        </div>
        <Avatar isSpeaking={isAvatarSpeaking} />
        
        <QuestionBubble 
          question={currentQuestion} 
          category={currentCategory}
          difficulty={currentDifficulty}
          isVisible={isQuestionVisible} 
        />

        <VoiceRecorder
          onTranscriptChange={() => {}}
          onAnswerSubmit={handleAnswerSubmit}
          disabled={isAnalyzing || !!scores}
          resetKey={currentQuestionIndex}
        />

        {isAnalyzing && (
          <div style={styles.analyzing}>
            <div style={styles.spinner} />
            <p>Analyzing your answer...</p>
          </div>
        )}

        {scores && (
          <>
            <ScoreDisplay
              scores={scores}
              submittedAnswer={currentSubmittedAnswer}
              feedback={feedback}
              strengths={strengths}
              improvements={improvements}
              isVisible={true}
            />
            <button onClick={handleNextQuestion} style={styles.nextButton}>
              {currentQuestionIndex < questions.length - 1
                ? 'Next Question'
                : 'Complete Interview'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 20px)',
  },
  interviewArea: {
    maxWidth: '1000px',
    width: '100%',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: 'clamp(18px, 4vw, 40px)',
  },
  sessionSummary: {
    textAlign: 'center',
    color: 'white',
    fontSize: 'clamp(13px, 3.5vw, 16px)',
    fontWeight: 'bold',
    marginBottom: '18px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: '10px',
    padding: '10px 12px',
  },
  analyzing: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    marginTop: '30px',
    color: 'white',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  nextButton: {
    padding: '15px 40px',
    background: 'white',
    color: '#238845',
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(16px, 4vw, 18px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'transform 0.2s',
    display: 'block',
    margin: '20px auto 0',
  },
  completeContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'white',
  },
  completeTitle: {
    fontSize: 'clamp(26px, 6vw, 36px)',
    marginBottom: '20px',
  },
  completeText: {
    fontSize: 'clamp(16px, 4.5vw, 20px)',
  },
  finalSummary: {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: 'clamp(18px, 4vw, 30px)',
    marginBottom: '20px',
    maxWidth: '600px',
    margin: '20px auto',
  },
  summaryTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: 'white',
  },
  summaryStats: {
    display: 'flex',
    gap: 'clamp(12px, 4vw, 30px)',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  summaryStat: {
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '10px',
  },
  summaryValue: {
    fontSize: 'clamp(26px, 6vw, 36px)',
    fontWeight: 'bold',
    color: 'white',
  },
  summaryNote: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  answerReviewSection: {
    maxWidth: '900px',
    margin: '20px auto 0',
    textAlign: 'left',
  },
  answerReviewTitle: {
    fontSize: '24px',
    marginBottom: '16px',
    color: 'white',
    textAlign: 'center',
  },
  answerReviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  answerReviewCard: {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '12px',
    padding: '14px',
  },
  answerReviewMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  answerReviewIndex: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  answerReviewScore: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
  },
  answerReviewQuestion: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    color: 'white',
    fontWeight: 'bold',
    lineHeight: 1.5,
  },
  answerReviewAnswerBlock: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    padding: '10px',
  },
  answerReviewAnswerLabel: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '6px',
  },
  answerReviewAnswer: {
    margin: 0,
    fontSize: '14px',
    color: 'white',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  viewStatsButton: {
    padding: '15px 40px',
    background: 'white',
    color: '#238845',
    border: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(16px, 4vw, 18px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'transform 0.2s',
  },
  emptyState: {
    maxWidth: '700px',
    margin: '60px auto',
    padding: '30px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    textAlign: 'center',
  },
  emptyStateTitle: {
    margin: '0 0 10px 0',
    fontSize: '28px',
  },
  emptyStateText: {
    margin: 0,
    fontSize: '16px',
    color: 'rgba(255,255,255,0.9)',
  },
};

// Add spin animation
const styleSheet = document.createElement('style');
styleSheet.textContent += `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-interview]')) {
  styleSheet.setAttribute('data-interview', 'true');
  document.head.appendChild(styleSheet);
}

export default InterviewInterface;

