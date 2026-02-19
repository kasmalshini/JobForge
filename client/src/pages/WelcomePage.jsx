import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoContainer}>
          <div style={styles.logoCircle}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Person 1 (Left) */}
              <circle cx="20" cy="25" r="6" fill="white" />
              <path
                d="M14 35C14 32 16 30 20 30C24 30 26 32 26 35"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Person 2 (Right) with document */}
              <circle cx="40" cy="25" r="6" fill="white" />
              <path
                d="M34 35C34 32 36 30 40 30C44 30 46 32 46 35"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Document */}
              <rect x="38" y="32" width="8" height="10" rx="1" fill="white" opacity="0.8" />
              <line x1="40" y1="35" x2="44" y2="35" stroke="#238845" strokeWidth="0.5" />
              <line x1="40" y1="37" x2="44" y2="37" stroke="#238845" strokeWidth="0.5" />
            </svg>
          </div>
        </div>
        
        <h1 style={styles.title}>JobForge</h1>
        <p style={styles.tagline}>Master your interview skills</p>
        
        <button onClick={handleGetStarted} style={styles.getStartedButton}>
          Get Started
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    color: 'white',
    maxWidth: '420px',
    width: '100%',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  logoCircle: {
    width: 'clamp(80px, 18vw, 100px)',
    height: 'clamp(80px, 18vw, 100px)',
    borderRadius: '50%',
    background: '#238845',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    margin: '0 auto',
  },
  title: {
    fontSize: 'clamp(34px, 8vw, 48px)',
    fontWeight: 'bold',
    marginBottom: '15px',
    letterSpacing: '1px',
  },
  tagline: {
    fontSize: 'clamp(16px, 4.5vw, 20px)',
    marginBottom: '50px',
    opacity: 0.95,
    fontWeight: '300',
  },
  getStartedButton: {
    padding: 'clamp(12px, 3vw, 16px) clamp(28px, 8vw, 48px)',
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '30px',
    color: 'white',
    fontSize: 'clamp(16px, 4vw, 18px)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
};

export default WelcomePage;

