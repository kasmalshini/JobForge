import React, { useEffect, useState } from 'react';
import { getSocket } from '../../services/socket';

const Leaderboard = ({ roomId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = getSocket();
    
    if (socket) {
      // Initial leaderboard fetch
      const fetchLeaderboard = () => {
        socket.emit('get-leaderboard', { roomId });
      };

      fetchLeaderboard();

      // Listen for leaderboard updates
      socket.on('leaderboard-updated', (data) => {
        setLeaderboard(data.leaderboard);
        setLoading(false);
      });

      // Real-time updates when answers are submitted
      socket.on('answer-submitted', () => {
        // Refresh leaderboard when someone submits
        fetchLeaderboard();
      });

      // Listen for refresh requests
      socket.on('leaderboard-refresh', () => {
        fetchLeaderboard();
      });

      return () => {
        socket.off('leaderboard-updated');
        socket.off('answer-submitted');
        socket.off('leaderboard-refresh');
      };
    }
  }, [roomId]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No scores yet. Be the first to submit your answer!</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Leaderboard</h3>
      <div style={styles.list}>
        {leaderboard.map((entry, index) => (
          <div
            key={entry.userId}
            style={{
              ...styles.entry,
              ...(index === 0 ? styles.firstPlace : {}),
              ...(index === 1 ? styles.secondPlace : {}),
              ...(index === 2 ? styles.thirdPlace : {}),
            }}
          >
            <div style={styles.rank}>
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${entry.rank}`}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{entry.userName}</div>
              <div style={styles.score}>Score: {entry.totalScore}/100</div>
              {entry.clarity && entry.confidence && entry.applicability && (
                <div style={styles.scoreBreakdown}>
                  C: {entry.clarity} | Co: {entry.confidence} | A: {entry.applicability}
                </div>
              )}
            </div>
            <div style={styles.rankBadge}>
              {entry.rank === 1 && '👑'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(18px, 4vw, 30px)',
    marginTop: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '30px auto 0',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  entry: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    flexWrap: 'wrap',
  },
  firstPlace: {
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
  },
  secondPlace: {
    background: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)',
    transform: 'scale(1.02)',
  },
  thirdPlace: {
    background: 'linear-gradient(135deg, #cd7f32 0%, #e6a857 100%)',
    transform: 'scale(1.01)',
  },
  rank: {
    fontSize: '24px',
    fontWeight: 'bold',
    minWidth: '50px',
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  score: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '3px',
  },
  scoreBreakdown: {
    fontSize: '11px',
    color: '#999',
    fontStyle: 'italic',
  },
  rankBadge: {
    fontSize: '32px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'white',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
};

export default Leaderboard;

