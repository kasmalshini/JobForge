import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

const Avatar = ({ isSpeaking }) => {
  const [springs, api] = useSpring(() => ({
    from: { scale: 1, y: 0 },
  }));

  useEffect(() => {
    if (isSpeaking) {
      api.start({
        to: [
          { scale: 1.05, y: -5 },
          { scale: 1, y: 0 },
        ],
        config: { duration: 500 },
        loop: true,
      });
    } else {
      api.start({
        to: { scale: 1, y: 0 },
        config: { duration: 300 },
      });
    }
  }, [isSpeaking, api]);

  return (
    <animated.div
      style={{
        ...styles.container,
        transform: springs.y.to((y) => `translateY(${y}px) scale(${springs.scale.get()})`),
      }}
    >
      <div style={styles.avatar}>
        {/* Professional interviewer: head */}
        <div style={styles.head}>
          <div style={styles.face}>
            <div style={styles.eye}>
              <div style={styles.pupil} />
            </div>
            <div style={{ ...styles.eye, left: 'auto', right: '22px' }}>
              <div style={styles.pupil} />
            </div>
            <div
              style={{
                ...styles.mouth,
                ...(isSpeaking ? styles.mouthSpeaking : {}),
              }}
            />
            <div style={styles.hair} />
          </div>
        </div>
        {/* Suit: collar */}
        <div style={styles.collar} />
        {/* Suit jacket */}
        <div style={styles.suitJacket}>
          <div style={styles.shirtFront} />
          <div style={styles.tie} />
        </div>
        <div style={styles.interviewerLabel}>Your Interviewer</div>
      </div>
      {isSpeaking && (
        <div style={styles.speechIndicator}>
          <div style={styles.soundWave} />
          <div style={{ ...styles.soundWave, animationDelay: '0.2s' }} />
          <div style={{ ...styles.soundWave, animationDelay: '0.4s' }} />
        </div>
      )}
    </animated.div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  avatar: {
    width: '200px',
    height: '280px',
    position: 'relative',
  },
  head: {
    width: '100px',
    height: '100px',
    background: 'linear-gradient(160deg, #e8c49a 0%, #d4a574 100%)',
    borderRadius: '50%',
    margin: '0 auto',
    position: 'relative',
    boxShadow: 'inset -2px -4px 8px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)',
  },
  face: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
  },
  eye: {
    position: 'absolute',
    top: '32px',
    left: '18px',
    width: '14px',
    height: '14px',
    background: 'white',
    borderRadius: '50%',
    animation: 'blink 3s infinite',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
  pupil: {
    width: '7px',
    height: '7px',
    background: '#2c3e50',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  mouth: {
    position: 'absolute',
    bottom: '22px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '24px',
    height: '10px',
    border: '2px solid #2c3e50',
    borderTop: 'none',
    borderRadius: '0 0 20px 20px',
  },
  mouthSpeaking: {
    animation: 'mouthTalk 0.2s ease-in-out infinite',
  },
  hair: {
    position: 'absolute',
    top: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70px',
    height: '38px',
    background: 'linear-gradient(180deg, #3d2914 0%, #2c1f0f 100%)',
    borderRadius: '50% 50% 0 0',
    borderTop: 'none',
  },
  collar: {
    width: 0,
    height: 0,
    margin: '-2px auto 0',
    borderLeft: '25px solid transparent',
    borderRight: '25px solid transparent',
    borderTop: '18px solid #1a1a2e',
  },
  suitJacket: {
    width: '130px',
    height: '110px',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%)',
    margin: '0 auto',
    position: 'relative',
    borderRadius: '8px 8px 20px 20px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  shirtFront: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '32px',
    height: '75px',
    background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '0 0 4px 4px',
  },
  tie: {
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '14px',
    height: '60px',
    background: 'linear-gradient(180deg, #9b1b30 0%, #6b1020 100%)',
    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  interviewerLabel: {
    marginTop: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '0.5px',
  },
  speechIndicator: {
    display: 'flex',
    gap: '4px',
    marginTop: '16px',
  },
  soundWave: {
    width: '4px',
    height: '20px',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '2px',
    animation: 'soundWave 0.6s ease-in-out infinite',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes blink {
    0%, 90%, 100% { height: 15px; }
    95% { height: 2px; }
  }
  @keyframes soundWave {
    0%, 100% { transform: scaleY(0.5); }
    50% { transform: scaleY(1); }
  }
  @keyframes mouthTalk {
    0%, 100% { height: 10px; border-radius: 0 0 20px 20px; }
    50% { height: 16px; border-radius: 0 0 12px 12px; }
  }
`;
if (!document.head.querySelector('style[data-avatar]')) {
  styleSheet.setAttribute('data-avatar', 'true');
  document.head.appendChild(styleSheet);
}

export default Avatar;





