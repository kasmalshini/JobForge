import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>JobForge</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>Welcome, {user?.name}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.title}>Dashboard</h2>
        <div style={styles.cards}>
          <div
            style={styles.card}
            onClick={() => navigate('/interview')}
          >
            <div style={styles.cardIcon}>🎤</div>
            <h3 style={styles.cardTitle}>Practice Interview</h3>
            <p style={styles.cardDescription}>
              Start a practice interview with AI avatar
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/flashcards')}
          >
            <div style={styles.cardIcon}>📚</div>
            <h3 style={styles.cardTitle}>Flashcards</h3>
            <p style={styles.cardDescription}>
              Learn interview tips and software dev questions
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/competition')}
          >
            <div style={styles.cardIcon}>🏆</div>
            <h3 style={styles.cardTitle}>Competition</h3>
            <p style={styles.cardDescription}>
              Compete with other users in real-time
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/feedback-history')}
          >
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Feedback History</h3>
            <p style={styles.cardDescription}>
              Review your past interview performances and feedback
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/leaderboard')}
          >
            <div style={styles.cardIcon}>🏅</div>
            <h3 style={styles.cardTitle}>Leaderboard</h3>
            <p style={styles.cardDescription}>
              See global rankings and compete with other users
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/stats')}
          >
            <div style={styles.cardIcon}>📈</div>
            <h3 style={styles.cardTitle}>My Statistics</h3>
            <p style={styles.cardDescription}>
              View your performance statistics and progress
            </p>
          </div>
        </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 40px)',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    gap: '12px',
    flexWrap: 'wrap',
  },
  logo: {
    color: 'white',
    fontSize: 'clamp(20px, 4vw, 28px)',
    fontWeight: 'bold',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  userName: {
    color: 'white',
    fontSize: 'clamp(13px, 2.5vw, 16px)',
  },
  logoutButton: {
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  content: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 40px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: 'white',
    fontSize: 'clamp(24px, 5vw, 36px)',
    marginBottom: '30px',
    textAlign: 'center',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'clamp(16px, 3vw, 30px)',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(18px, 3.5vw, 30px)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  cardIcon: {
    fontSize: 'clamp(32px, 6vw, 48px)',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: 'clamp(18px, 3.2vw, 24px)',
    marginBottom: '10px',
    color: '#000',
  },
  cardDescription: {
    color: '#000',
    fontSize: 'clamp(14px, 2.2vw, 16px)',
    lineHeight: '1.6',
  },
};

export default Dashboard;




