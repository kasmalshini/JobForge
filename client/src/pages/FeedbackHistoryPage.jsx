import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FeedbackHistoryPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get('/interviews');
      setInterviews(response.data.interviews || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading feedback history...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.title}>Feedback History</h2>
        <p style={styles.subtitle}>Review your past interview performances</p>

        {interviews.length === 0 ? (
          <div style={styles.empty}>
            <p>No interview history yet. Start practicing to see your feedback!</p>
            <button
              onClick={() => navigate('/interview')}
              style={styles.startButton}
            >
              Start Practice Interview
            </button>
          </div>
        ) : (
          <div style={styles.interviewsList}>
            {interviews.map((interview) => (
              <div
                key={interview._id}
                style={styles.interviewCard}
                onClick={() => setSelectedInterview(interview)}
              >
                <div style={styles.interviewHeader}>
                  <h3 style={styles.question}>{interview.question}</h3>
                  <div style={styles.date}>
                    {new Date(interview.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div style={styles.scoresRow}>
                  <div style={styles.scoreItem}>
                    <span style={styles.scoreLabel}>Clarity:</span>
                    <span style={{
                      ...styles.scoreValue,
                      color: interview.clarity >= 70 ? '#2ecc71' : interview.clarity >= 50 ? '#f39c12' : '#e74c3c'
                    }}>
                      {interview.clarity}/100
                    </span>
                  </div>
                  <div style={styles.scoreItem}>
                    <span style={styles.scoreLabel}>Confidence:</span>
                    <span style={{
                      ...styles.scoreValue,
                      color: interview.confidence >= 70 ? '#2ecc71' : interview.confidence >= 50 ? '#f39c12' : '#e74c3c'
                    }}>
                      {interview.confidence}/100
                    </span>
                  </div>
                  <div style={styles.scoreItem}>
                    <span style={styles.scoreLabel}>Applicability:</span>
                    <span style={{
                      ...styles.scoreValue,
                      color: interview.applicability >= 70 ? '#2ecc71' : interview.applicability >= 50 ? '#f39c12' : '#e74c3c'
                    }}>
                      {interview.applicability}/100
                    </span>
                  </div>
                </div>
                {interview.feedback && (
                  <p style={styles.feedbackPreview}>
                    {interview.feedback.substring(0, 100)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedInterview && (
          <div style={styles.modal} onClick={() => setSelectedInterview(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedInterview(null)}
              >
                ×
              </button>
              <h3 style={styles.modalTitle}>Interview Feedback</h3>
              <div style={styles.modalQuestion}>
                <strong>Question:</strong> {selectedInterview.question}
              </div>
              <div style={styles.modalAnswer}>
                <strong>Your Answer:</strong> {selectedInterview.answer}
              </div>
              <div style={styles.modalScores}>
                <div style={styles.modalScoreCard}>
                  <div style={styles.modalScoreLabel}>Clarity</div>
                  <div style={styles.modalScoreValue}>{selectedInterview.clarity}/100</div>
                </div>
                <div style={styles.modalScoreCard}>
                  <div style={styles.modalScoreLabel}>Confidence</div>
                  <div style={styles.modalScoreValue}>{selectedInterview.confidence}/100</div>
                </div>
                <div style={styles.modalScoreCard}>
                  <div style={styles.modalScoreLabel}>Applicability</div>
                  <div style={styles.modalScoreValue}>{selectedInterview.applicability}/100</div>
                </div>
              </div>
              {selectedInterview.feedback && (
                <div style={styles.modalFeedback}>
                  <h4>Overall Feedback</h4>
                  <p>{selectedInterview.feedback}</p>
                </div>
              )}
              {selectedInterview.strengths && (
                <div style={styles.modalStrengths}>
                  <h4>✅ Strengths</h4>
                  <p>{selectedInterview.strengths}</p>
                </div>
              )}
              {selectedInterview.improvements && (
                <div style={styles.modalImprovements}>
                  <h4>💡 Areas for Improvement</h4>
                  <p>{selectedInterview.improvements}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
  },
  nav: {
    padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 40px)',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  },
  backButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    fontWeight: 'bold',
  },
  content: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 20px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: 'white',
    fontSize: 'clamp(24px, 5vw, 36px)',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'clamp(14px, 3.8vw, 18px)',
    textAlign: 'center',
    marginBottom: '40px',
  },
  loading: {
    textAlign: 'center',
    color: 'white',
    padding: '60px 20px',
    fontSize: '20px',
  },
  empty: {
    textAlign: 'center',
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(28px, 6vw, 60px) clamp(18px, 4vw, 40px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  startButton: {
    padding: '15px 40px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
  },
  interviewsList: {
    display: 'grid',
    gap: '20px',
  },
  interviewCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  interviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '15px',
    gap: '10px',
    flexWrap: 'wrap',
  },
  question: {
    fontSize: '18px',
    color: '#333',
    flex: 1,
    marginRight: '15px',
  },
  date: {
    fontSize: '14px',
    color: '#999',
  },
  scoresRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  scoreItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: '14px',
    color: '#666',
  },
  scoreValue: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  feedbackPreview: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(18px, 5vw, 40px)',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  modalQuestion: {
    fontSize: '16px',
    marginBottom: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  modalAnswer: {
    fontSize: '16px',
    marginBottom: '20px',
    padding: '15px',
    background: '#f0f7ff',
    borderRadius: '8px',
  },
  modalScores: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  modalScoreCard: {
    flex: 1,
    textAlign: 'center',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  modalScoreLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  modalScoreValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  modalFeedback: {
    marginTop: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  modalStrengths: {
    marginTop: '15px',
    padding: '20px',
    background: '#f0fdf4',
    borderRadius: '8px',
  },
  modalImprovements: {
    marginTop: '15px',
    padding: '20px',
    background: '#fff7ed',
    borderRadius: '8px',
  },
};

export default FeedbackHistoryPage;


