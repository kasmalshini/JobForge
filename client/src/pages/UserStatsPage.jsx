import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserStatsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/rankings/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading statistics...</div>
      </div>
    );
  }

  if (!stats || stats.totalInterviews === 0) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ← Back to Dashboard
          </button>
        </nav>
        <div style={styles.empty}>
          <h2 style={styles.emptyTitle}>No Statistics Yet</h2>
          <p style={styles.emptyText}>
            Start practicing interviews to see your statistics and track your progress!
          </p>
          <button
            onClick={() => navigate('/interview')}
            style={styles.startButton}
          >
            Start Practice Interview
          </button>
        </div>
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
        <h2 style={styles.title}>Your Statistics</h2>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statValue}>{stats.totalInterviews}</div>
            <div style={styles.statLabel}>Total Interviews</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statValue}>{stats.averageScore}/100</div>
            <div style={styles.statLabel}>Average Combined Score</div>
            <div style={styles.statFormula}>
              (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏆</div>
            <div style={styles.statValue}>
              {stats.rank ? `#${stats.rank}` : 'N/A'}
            </div>
            <div style={styles.statLabel}>Global Rank</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div style={styles.statValue}>{stats.bestScore}/100</div>
            <div style={styles.statLabel}>Best Score</div>
          </div>
        </div>

        <div style={styles.detailedStats}>
          <h3 style={styles.sectionTitle}>Average Scores by Category</h3>
          <div style={styles.categoryGrid}>
            <div style={styles.categoryCard}>
              <div style={styles.categoryLabel}>Clarity</div>
              <div style={styles.categoryValue}>{stats.averageClarity}/100</div>
              <div style={styles.categoryBar}>
                <div
                  style={{
                    ...styles.categoryBarFill,
                    width: `${stats.averageClarity}%`,
                    background: stats.averageClarity >= 70 ? '#2ecc71' : stats.averageClarity >= 50 ? '#f39c12' : '#e74c3c',
                  }}
                />
              </div>
            </div>

            <div style={styles.categoryCard}>
              <div style={styles.categoryLabel}>Confidence</div>
              <div style={styles.categoryValue}>{stats.averageConfidence}/100</div>
              <div style={styles.categoryBar}>
                <div
                  style={{
                    ...styles.categoryBarFill,
                    width: `${stats.averageConfidence}%`,
                    background: stats.averageConfidence >= 70 ? '#2ecc71' : stats.averageConfidence >= 50 ? '#f39c12' : '#e74c3c',
                  }}
                />
              </div>
            </div>

            <div style={styles.categoryCard}>
              <div style={styles.categoryLabel}>Applicability</div>
              <div style={styles.categoryValue}>{stats.averageApplicability}/100</div>
              <div style={styles.categoryBar}>
                <div
                  style={{
                    ...styles.categoryBarFill,
                    width: `${stats.averageApplicability}%`,
                    background: stats.averageApplicability >= 70 ? '#2ecc71' : stats.averageApplicability >= 50 ? '#f39c12' : '#e74c3c',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {stats.recentScores && stats.recentScores.length > 0 && (
          <div style={styles.recentScores}>
            <h3 style={styles.sectionTitle}>Recent Performance</h3>
            <div style={styles.scoresList}>
              {stats.recentScores.map((score, index) => (
                <div key={index} style={styles.scoreItem}>
                  <div style={styles.scoreDate}>
                    {new Date(score.timestamp).toLocaleDateString()}
                  </div>
                  <div style={styles.scoreDetails}>
                    <span>Combined: <strong>{score.combinedScore}/100</strong></span>
                    <span>C: {score.clarity} | Co: {score.confidence} | A: {score.applicability}</span>
                  </div>
                </div>
              ))}
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
    marginBottom: '30px',
    textAlign: 'center',
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
    margin: 'clamp(16px, 4vw, 40px) auto',
    maxWidth: '600px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  emptyTitle: {
    fontSize: '28px',
    marginBottom: '15px',
    color: '#333',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
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
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  statLabel: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '5px',
  },
  statFormula: {
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  detailedStats: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(18px, 4vw, 30px)',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  categoryCard: {
    textAlign: 'center',
  },
  categoryLabel: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  categoryValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  categoryBar: {
    width: '100%',
    height: '12px',
    background: '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    transition: 'width 0.5s ease',
    borderRadius: '6px',
  },
  recentScores: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(18px, 4vw, 30px)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  scoresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  scoreItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '10px',
    gap: '10px',
    flexWrap: 'wrap',
  },
  scoreDate: {
    fontSize: '14px',
    color: '#666',
  },
  scoreDetails: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    color: '#333',
    flexWrap: 'wrap',
  },
};

export default UserStatsPage;


