import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, role

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rankings/leaderboard');
      let data = response.data.leaderboard || [];

      // Filter by role if selected
      if (filter === 'role' && user?.role) {
        data = data.filter((entry) => entry.role === user.role);
      }

      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading leaderboard...</div>
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
        <h2 style={styles.title}>Global Leaderboard</h2>
        <p style={styles.subtitle}>Rankings based on average combined score</p>

        <div style={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            style={{
              ...styles.filterButton,
              ...(filter === 'all' ? styles.filterButtonActive : {}),
            }}
          >
            All Users
          </button>
          {user?.role && (
            <button
              onClick={() => setFilter('role')}
              style={{
                ...styles.filterButton,
                ...(filter === 'role' ? styles.filterButtonActive : {}),
              }}
            >
              {user.role} Only
            </button>
          )}
        </div>

        <div style={styles.leaderboard}>
          {leaderboard.length === 0 ? (
            <div style={styles.empty}>
              <p>No rankings available yet. Start practicing to appear on the leaderboard!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                style={{
                  ...styles.leaderboardEntry,
                  ...(entry.userId === user?._id ? styles.currentUser : {}),
                  ...(index === 0 ? styles.firstPlace : {}),
                  ...(index === 1 ? styles.secondPlace : {}),
                  ...(index === 2 ? styles.thirdPlace : {}),
                }}
              >
                <div style={styles.rank}>
                  {getRankIcon(entry.rank)}
                </div>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>
                    {entry.name}
                    {entry.userId === user?._id && <span style={styles.youBadge}> (You)</span>}
                  </div>
                  <div style={styles.userDetails}>
                    <span style={styles.role}>{entry.role}</span>
                    <span style={styles.interviews}>• {entry.totalInterviews} interviews</span>
                  </div>
                </div>
                <div style={styles.scoreSection}>
                  <div style={styles.scoreLabel}>Average Score</div>
                  <div style={styles.scoreValue}>{entry.averageScore}/100</div>
                </div>
              </div>
            ))
          )}
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
    maxWidth: '1000px',
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
    marginBottom: '30px',
  },
  filters: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  filterButtonActive: {
    background: 'white',
    color: '#238845',
  },
  loading: {
    textAlign: 'center',
    color: 'white',
    padding: '60px 20px',
    fontSize: '20px',
  },
  leaderboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  leaderboardEntry: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'white',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    flexWrap: 'wrap',
  },
  firstPlace: {
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 6px 20px rgba(255,215,0,0.3)',
  },
  secondPlace: {
    background: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)',
    transform: 'scale(1.01)',
  },
  thirdPlace: {
    background: 'linear-gradient(135deg, #cd7f32 0%, #e6a857 100%)',
  },
  currentUser: {
    border: '3px solid #238845',
    boxShadow: '0 4px 15px rgba(35,136,69,0.3)',
  },
  rank: {
    fontSize: '32px',
    fontWeight: 'bold',
    minWidth: '52px',
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  youBadge: {
    color: '#238845',
    fontSize: '16px',
  },
  userDetails: {
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  role: {
    fontWeight: '500',
  },
  interviews: {
    color: '#999',
  },
  scoreSection: {
    textAlign: 'right',
    marginLeft: 'auto',
  },
  scoreLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px',
  },
  scoreValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    background: 'white',
    borderRadius: '15px',
    padding: '60px 40px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};

export default LeaderboardPage;

