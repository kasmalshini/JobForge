import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const QuestionBubble = ({ question, category, difficulty, isVisible }) => {
  const springs = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 200, friction: 20 },
  });

  if (!question) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '#2ecc71'; // Green
      case 'intermediate':
        return '#f39c12'; // Orange
      case 'advanced':
        return '#e74c3c'; // Red
      default:
        return '#238845';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Intermediate';
    }
  };

  return (
    <animated.div style={{ ...styles.container, ...springs }}>
      <div style={styles.bubble}>
        <div style={styles.tail} />
        <div style={styles.content}>
          {(category || difficulty) && (
            <div style={styles.metadata}>
              {category && (
                <span style={styles.categoryBadge}>{category}</span>
              )}
              {difficulty && (
                <span 
                  style={{
                    ...styles.difficultyBadge,
                    background: getDifficultyColor(difficulty),
                  }}
                >
                  {getDifficultyLabel(difficulty)}
                </span>
              )}
            </div>
          )}
          <p style={styles.question}>{question}</p>
        </div>
      </div>
    </animated.div>
  );
};

const styles = {
  container: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  bubble: {
    position: 'relative',
    background: 'white',
    borderRadius: '20px',
    padding: '20px 25px',
    maxWidth: '600px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  tail: {
    position: 'absolute',
    bottom: '-10px',
    left: '30px',
    width: '0',
    height: '0',
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderTop: '15px solid white',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  question: {
    fontSize: '18px',
    color: '#333',
    lineHeight: '1.6',
    margin: 0,
  },
  metadata: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    padding: '6px 12px',
    background: '#238845',
    color: 'white',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    padding: '6px 12px',
    color: 'white',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
};

export default QuestionBubble;




