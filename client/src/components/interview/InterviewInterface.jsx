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

const InterviewInterface = ({ onComplete, roomId = null, category = 'mixed', difficulty = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Select questions based on category, user role, and difficulty
  const getQuestions = () => {
    let selectedQuestions = [];
    
    // If category is null and user has a role, use role-specific questions
    if (category === null && user?.role && ROLE_QUESTIONS[user.role]) {
      selectedQuestions = ROLE_QUESTIONS[user.role];
    } else if (category === 'general') {
      selectedQuestions = GENERAL_QUESTIONS;
    } else if (category === 'software') {
      selectedQuestions = ROLE_QUESTIONS["Software Developer"] || GENERAL_QUESTIONS;
    } else {
      selectedQuestions = INTERVIEW_QUESTIONS; // mixed
    }
    
    // Filter by difficulty if specified
    if (difficulty && difficulty !== 'all') {
      selectedQuestions = selectedQuestions.filter(q => {
        const qDifficulty = getQuestionDifficulty(q);
        return qDifficulty === difficulty;
      });
    }
    
    return selectedQuestions;
  };

  const questions = getQuestions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestionObj = questions[currentQuestionIndex] || questions[0];
  const currentQuestion = getQuestionText(currentQuestionObj);
  const currentCategory = getQuestionCategory(currentQuestionObj);
  const currentDifficulty = getQuestionDifficulty(currentQuestionObj);
  const [scores, setScores] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
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
        setStrengths(data.strengths || '');
        setImprovements(data.improvements || '');

        // Track this score for final calculation
        const combinedScore = Math.round(
          (data.clarity * 0.4) + 
          (data.confidence * 0.3) + 
          (data.applicability * 0.3)
        );
        setAllScores((prevScores) => [...prevScores, {
          clarity: data.clarity,
          confidence: data.confidence,
          applicability: data.applicability,
          combinedScore,
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
    // In competition mode, only one question
    if (roomId) {
      setInterviewComplete(true);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    // Regular interview mode - multiple questions
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setScores(null);
      setFeedback('');
      setStrengths('');
      setImprovements('');
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
            </div>
            <p style={styles.summaryNote}>
              Your ranking is based on your average combined score: (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
            </p>
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

