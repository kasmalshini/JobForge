import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const ScoreDisplay = ({ scores, feedback, strengths, improvements, isVisible }) => {
  const springs = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 200, friction: 20 },
  });

  if (!isVisible || !scores) return null;

  // Calculate combined score: (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
  const combinedScore = Math.round(
    (scores.clarity * 0.4) + 
    (scores.confidence * 0.3) + 
    (scores.applicability * 0.3)
  );

  return (
    <animated.div style={{ ...styles.container, ...springs }}>
      <h3 style={styles.title}>Your Performance</h3>
      
      <div style={styles.scoresGrid}>
        <div style={styles.scoreCard}>
          <div style={styles.scoreLabel}>
            Clarity
            <span style={styles.infoIcon} title="Measures how clear, well-structured, and easy to understand your answer is. Considers organization, logical flow, and clarity of expression.">
              ℹ️
            </span>
          </div>
          <div style={styles.scoreValue}>{scores.clarity}/100</div>
          <div style={styles.scoreBar}>
            <div
              style={{
                ...styles.scoreBarFill,
                width: `${scores.clarity}%`,
                background: scores.clarity >= 70 ? '#2ecc71' : scores.clarity >= 50 ? '#f39c12' : '#e74c3c',
              }}
            />
          </div>
          <div style={styles.scoreDescription}>
            {scores.clarity >= 70 
              ? 'Excellent clarity and structure' 
              : scores.clarity >= 50 
              ? 'Good clarity, room for improvement' 
              : 'Work on organizing your thoughts clearly'}
          </div>
        </div>

        <div style={styles.scoreCard}>
          <div style={styles.scoreLabel}>
            Confidence
            <span style={styles.infoIcon} title="Measures how confident and assured you sound. Considers tone, hesitations, and self-assurance in delivery.">
              ℹ️
            </span>
          </div>
          <div style={styles.scoreValue}>{scores.confidence}/100</div>
          <div style={styles.scoreBar}>
            <div
              style={{
                ...styles.scoreBarFill,
                width: `${scores.confidence}%`,
                background: scores.confidence >= 70 ? '#2ecc71' : scores.confidence >= 50 ? '#f39c12' : '#e74c3c',
              }}
            />
          </div>
          <div style={styles.scoreDescription}>
            {scores.confidence >= 70 
              ? 'Very confident delivery' 
              : scores.confidence >= 50 
              ? 'Moderate confidence' 
              : 'Work on speaking with more assurance'}
          </div>
        </div>

        <div style={styles.scoreCard}>
          <div style={styles.scoreLabel}>
            Applicability
            <span style={styles.infoIcon} title="Measures how relevant and applicable your answer is to the question. Considers if you directly addressed the question with appropriate examples.">
              ℹ️
            </span>
          </div>
          <div style={styles.scoreValue}>{scores.applicability}/100</div>
          <div style={styles.scoreBar}>
            <div
              style={{
                ...styles.scoreBarFill,
                width: `${scores.applicability}%`,
                background: scores.applicability >= 70 ? '#2ecc71' : scores.applicability >= 50 ? '#f39c12' : '#e74c3c',
              }}
            />
          </div>
          <div style={styles.scoreDescription}>
            {scores.applicability >= 70 
              ? 'Highly relevant to the question' 
              : scores.applicability >= 50 
              ? 'Somewhat relevant' 
              : 'Focus on directly answering the question'}
          </div>
        </div>
      </div>

      <div style={styles.totalScore}>
        <div style={styles.totalLabel}>Combined Score</div>
        <div style={styles.totalValue}>{combinedScore}/100</div>
        <div style={styles.totalFormula}>
          (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
        </div>
      </div>

      {feedback && (
        <div style={styles.feedback}>
          <h4 style={styles.feedbackTitle}>📝 Overall Feedback</h4>
          <p style={styles.feedbackText}>{feedback}</p>
          
          {(strengths || improvements) && (
            <div style={styles.detailedFeedback}>
              {strengths && (
                <div style={styles.feedbackSection}>
                  <h5 style={styles.feedbackSectionTitle}>✅ Strengths</h5>
                  <p style={styles.feedbackSectionText}>{strengths}</p>
                </div>
              )}
              {improvements && (
                <div style={styles.feedbackSection}>
                  <h5 style={styles.feedbackSectionTitle}>💡 Areas for Improvement</h5>
                  <p style={styles.feedbackSectionText}>{improvements}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </animated.div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    marginTop: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '30px auto 0',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  scoresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  scoreCard: {
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoIcon: {
    fontSize: '14px',
    cursor: 'help',
    opacity: 0.7,
  },
  scoreDescription: {
    fontSize: '12px',
    color: '#999',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  scoreBar: {
    width: '100%',
    height: '10px',
    background: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    transition: 'width 0.5s ease',
    borderRadius: '5px',
  },
  totalScore: {
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  totalLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '5px',
  },
  totalValue: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: 'white',
  },
  totalFormula: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.8)',
    marginTop: '10px',
    fontStyle: 'italic',
  },
  feedback: {
    marginTop: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '12px',
  },
  feedbackTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333',
  },
  feedbackText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.6',
    margin: 0,
  },
  detailedFeedback: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  feedbackSection: {
    padding: '15px',
    borderRadius: '8px',
  },
  feedbackSectionTitle: {
    fontSize: '16px',
    marginBottom: '8px',
    color: '#333',
    fontWeight: 'bold',
  },
  feedbackSectionText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default ScoreDisplay;




