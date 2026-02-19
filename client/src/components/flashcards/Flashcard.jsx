import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const Flashcard = ({ flashcard, onNext, onPrevious, isFirst, isLast }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(1000px) rotateY(${isFlipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardWrapper} onClick={handleFlip}>
        <animated.div
          style={{
            ...styles.card,
            opacity: opacity.to((o) => 1 - o),
            transform,
          }}
        >
          <div style={styles.cardContent}>
            <div style={styles.category}>{flashcard.category.replace('-', ' ')}</div>
            <h3 style={styles.question}>{flashcard.question}</h3>
            <p style={styles.hint}>Click to reveal answer</p>
          </div>
        </animated.div>

        <animated.div
          style={{
            ...styles.card,
            ...styles.cardBack,
            opacity,
            transform: transform.to((t) => `${t} rotateY(180deg)`),
          }}
        >
          <div style={styles.cardContent}>
            <div style={styles.answerLabel}>Answer:</div>
            <p style={styles.answer}>{flashcard.answer}</p>
            <p style={styles.hint}>Click to see question again</p>
          </div>
        </animated.div>
      </div>

      <div style={styles.navigation}>
        <button
          onClick={onPrevious}
          disabled={isFirst}
          style={{
            ...styles.navButton,
            ...(isFirst ? styles.navButtonDisabled : {}),
          }}
        >
          ← Previous
        </button>
        <button onClick={handleFlip} style={styles.flipButton}>
          {isFlipped ? 'Show Question' : 'Show Answer'}
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          style={{
            ...styles.navButton,
            ...(isLast ? styles.navButtonDisabled : {}),
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px',
  },
  cardWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    height: 'min(400px, 65vh)',
    minHeight: '320px',
    cursor: 'pointer',
    perspective: '1000px',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '20px',
    background: 'white',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    backfaceVisibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
  },
  cardContent: {
    padding: 'clamp(16px, 4vw, 40px)',
    textAlign: 'center',
    width: '100%',
  },
  category: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: '#238845',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  question: {
    fontSize: 'clamp(16px, 4.5vw, 24px)',
    color: '#333',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  answerLabel: {
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '20px',
    opacity: 0.9,
  },
  answer: {
    fontSize: 'clamp(14px, 3.8vw, 18px)',
    lineHeight: '1.8',
    marginBottom: '20px',
  },
  hint: {
    fontSize: '14px',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  navigation: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  navButton: {
    padding: '12px 24px',
    background: 'white',
    color: '#238845',
    border: '2px solid #238845',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  flipButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};

export default Flashcard;





