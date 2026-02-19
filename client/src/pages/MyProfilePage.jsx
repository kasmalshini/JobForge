import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [skillAnalytics, setSkillAnalytics] = useState([]);
  const [categoryAnalytics, setCategoryAnalytics] = useState([]);
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch basic statistics
      const statsResponse = await api.get('/interviews/stats');
      setStats(statsResponse.data);

      // Fetch recent interviews
      const interviewsResponse = await api.get('/interviews/history?limit=5');
      setInterviews(interviewsResponse.data?.data || interviewsResponse.data?.interviews || []);

      // NEW: Fetch skill analytics
      const skillResponse = await api.get('/interviews/analytics/skills');
      setSkillAnalytics(skillResponse.data?.skillAnalytics || []);

      // NEW: Fetch category analytics
      const categoryResponse = await api.get('/interviews/analytics/categories');
      setCategoryAnalytics(categoryResponse.data?.categoryAnalytics || []);

      // NEW: Fetch performance trends
      const trendsResponse = await api.get('/interviews/analytics/trends?days=30');
      setPerformanceTrends(trendsResponse.data?.trends || []);

      // NEW: Fetch feedback history
      const feedbackResponse = await api.get('/interviews/analytics/feedback?limit=10');
      setFeedbackHistory(feedbackResponse.data?.feedbackHistory || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Unable to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60'; // Green
    if (score >= 60) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>JobForge</h1>
        <div style={styles.navRight}>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            Dashboard
          </button>
          <button onClick={() => navigate('/settings')} style={styles.settingsButton}>
            Settings
          </button>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              {user?.fullName?.charAt(0).toUpperCase() || '?'}
            </div>
          </div>
          <div style={styles.profileInfo}>
            <h1 style={styles.userName}>{user?.fullName || 'User'}</h1>
            <p style={styles.email}>{user?.email}</p>
            <div style={styles.roleSkillsContainer}>
              {user?.role && (
                <span style={styles.roleBadge}>{user.role}</span>
              )}
              {user?.skills && user.skills.length > 0 && (
                <div style={styles.skillsContainer}>
                  {user.skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} style={styles.skillBadge}>
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 4 && (
                    <span style={styles.skillBadge}>
                      +{user.skills.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabNav}>
          <button
            style={{...styles.tabButton, ...(activeTab === 'overview' ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            style={{...styles.tabButton, ...(activeTab === 'skills' ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab('skills')}
          >
            Skill Performance
          </button>
          <button
            style={{...styles.tabButton, ...(activeTab === 'categories' ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            style={{...styles.tabButton, ...(activeTab === 'trends' ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button
            style={{...styles.tabButton, ...(activeTab === 'feedback' ? styles.tabButtonActive : {})}}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Statistics Grid */}
            {stats && (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Total Interviews</div>
                  <div style={styles.statValue}>{stats.totalInterviews || 0}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Average Score</div>
                  <div
                    style={{
                      ...styles.statValue,
                      color: getScoreColor(stats.averageScore || 0),
                    }}
                  >
                    {stats.averageScore ? Math.round(stats.averageScore) : 0}/100
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Best Score</div>
                  <div
                    style={{
                      ...styles.statValue,
                      color: getScoreColor(stats.bestScore || 0),
                    }}
                  >
                    {stats.bestScore ? Math.round(stats.bestScore) : 0}/100
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Questions Answered</div>
                  <div style={styles.statValue}>{stats.totalQuestions || 0}</div>
                </div>
              </div>
            )}

            {/* Performance Breakdown */}
            {stats && (
              <div style={styles.performanceCard}>
                <h3 style={styles.cardTitle}>Performance Metrics</h3>

                <div style={styles.metricRow}>
                  <div style={styles.metricLabel}>Clarity</div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${stats.avgClarity || 0}%`,
                        backgroundColor: getScoreColor(stats.avgClarity || 0),
                      }}
                    />
                  </div>
                  <div style={styles.metricValue}>
                    {stats.avgClarity ? Math.round(stats.avgClarity) : 0}%
                  </div>
                </div>

                <div style={styles.metricRow}>
                  <div style={styles.metricLabel}>Confidence</div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${stats.avgConfidence || 0}%`,
                        backgroundColor: getScoreColor(stats.avgConfidence || 0),
                      }}
                    />
                  </div>
                  <div style={styles.metricValue}>
                    {stats.avgConfidence ? Math.round(stats.avgConfidence) : 0}%
                  </div>
                </div>

                <div style={styles.metricRow}>
                  <div style={styles.metricLabel}>Applicability</div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${stats.avgApplicability || 0}%`,
                        backgroundColor: getScoreColor(stats.avgApplicability || 0),
                      }}
                    />
                  </div>
                  <div style={styles.metricValue}>
                    {stats.avgApplicability ? Math.round(stats.avgApplicability) : 0}%
                  </div>
                </div>
              </div>
            )}

            {/* Recent Interviews */}
            {interviews.length > 0 && (
              <div style={styles.interviewsCard}>
                <h3 style={styles.cardTitle}>Recent Interviews</h3>
                <div style={styles.interviewsList}>
                  {interviews.map((interview, idx) => (
                    <div key={idx} style={styles.interviewItem}>
                      <div style={styles.interviewLeft}>
                        <h4 style={styles.interviewQuestion}>{interview.role || 'Interview'}</h4>
                        <p style={styles.interviewDate}>
                          {formatDate(interview.createdAt || new Date())}
                        </p>
                      </div>
                      <div style={styles.interviewRight}>
                        <div
                          style={{
                            ...styles.interviewScore,
                            backgroundColor: getScoreColor(interview.score || 0),
                          }}
                        >
                          {interview.score ? Math.round(interview.score) : 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div style={styles.analyticsCard}>
            <h3 style={styles.cardTitle}>Performance by Skill</h3>
            {skillAnalytics.length > 0 ? (
              <div style={styles.analyticsList}>
                {skillAnalytics.map((skill, idx) => (
                  <div key={idx} style={styles.analyticsItem}>
                    <div style={styles.analyticsLeft}>
                      <h4 style={styles.analyticsItemTitle}>{skill.skill || 'Unknown Skill'}</h4>
                      <p style={styles.analyticsItemSubtitle}>
                        {skill.totalInterviews || 0} interview{(skill.totalInterviews || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div style={styles.analyticsScore}>
                      <div
                        style={{
                          ...styles.scoreCircle,
                          backgroundColor: getScoreColor(skill.averageScore || 0),
                        }}
                      >
                        {Math.round(skill.averageScore || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>No skill analytics available. Complete some interviews first!</p>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div style={styles.analyticsCard}>
            <h3 style={styles.cardTitle}>Performance by Category</h3>
            {categoryAnalytics.length > 0 ? (
              <div style={styles.analyticsList}>
                {categoryAnalytics.map((category, idx) => (
                  <div key={idx} style={styles.analyticsItem}>
                    <div style={styles.analyticsLeft}>
                      <h4 style={styles.analyticsItemTitle}>{category.category || 'Unknown Category'}</h4>
                      <p style={styles.analyticsItemSubtitle}>
                        {category.totalInterviews || 0} interview{(category.totalInterviews || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div style={styles.analyticsScore}>
                      <div
                        style={{
                          ...styles.scoreCircle,
                          backgroundColor: getScoreColor(category.averageScore || 0),
                        }}
                      >
                        {Math.round(category.averageScore || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>No category analytics available. Complete some interviews first!</p>
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div style={styles.analyticsCard}>
            <h3 style={styles.cardTitle}>Performance Trends (Last 30 Days)</h3>
            {performanceTrends.length > 0 ? (
              <div style={styles.trendsList}>
                {performanceTrends.map((trend, idx) => (
                  <div key={idx} style={styles.trendItem}>
                    <div style={styles.trendDate}>{trend.date || 'Unknown Date'}</div>
                    <div style={styles.trendBar}>
                      <div
                        style={{
                          ...styles.trendFill,
                          width: `${trend.averageScore || 0}%`,
                          backgroundColor: getScoreColor(trend.averageScore || 0),
                        }}
                      />
                    </div>
                    <div style={styles.trendScore}>{Math.round(trend.averageScore || 0)}</div>
                    <div style={styles.trendCount}>{trend.interviewCount || 0} interview{(trend.interviewCount || 0) !== 1 ? 's' : ''}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>No trend data available. Complete interviews in the next 30 days!</p>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div style={styles.analyticsCard}>
            <h3 style={styles.cardTitle}>Detailed Feedback History</h3>
            {feedbackHistory.length > 0 ? (
              <div style={styles.feedbackList}>
                {feedbackHistory.map((item, idx) => (
                  <div key={idx} style={styles.feedbackItem}>
                    <div style={styles.feedbackTop}>
                      <div>
                        <h4 style={styles.feedbackQuestion}>
                          {item.question ? item.question.substring(0, 80) + '...' : 'Question not available'}
                        </h4>
                        <div style={styles.feedbackMeta}>
                          <span style={styles.feedbackMetaItem}>{item.category || 'general'}</span>
                          <span style={styles.feedbackMetaItem}>{item.difficulty || 'intermediate'}</span>
                          <span style={styles.feedbackMetaItem}>{item.timestamp ? formatDate(item.timestamp) : 'N/A'}</span>
                        </div>
                      </div>
                      <div
                        style={{
                          ...styles.feedbackScore,
                          backgroundColor: getScoreColor(item.score || 0),
                        }}
                      >
                        {Math.round(item.score || 0)}
                      </div>
                    </div>
                    <button
                      style={styles.feedbackExpandBtn}
                      onClick={() => setSelectedFeedback(selectedFeedback === idx ? null : idx)}
                    >
                      {selectedFeedback === idx ? '▼ Hide Details' : '▶ View Details'}
                    </button>
                    {selectedFeedback === idx && (
                      <div style={styles.feedbackDetails}>
                        <p style={styles.feedbackText}><strong>Feedback:</strong> {item.feedback || 'No feedback available'}</p>
                        {item.strengths && item.strengths.length > 0 && (
                          <p style={styles.feedbackText}>
                            <strong>Strengths:</strong> {item.strengths.join(', ')}
                          </p>
                        )}
                        {item.improvements && item.improvements.length > 0 && (
                          <p style={styles.feedbackText}>
                            <strong>Areas to Improve:</strong> {item.improvements.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={styles.emptyText}>No feedback history available. Complete some interviews first!</p>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && activeTab === 'overview' && (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No Interviews Yet</p>
            <p style={styles.emptyDescription}>
              Start your first interview to see your progress here!
            </p>
            <button
              onClick={() => navigate('/interview')}
              style={styles.startButton}
            >
              Start Practice Interview
            </button>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            {error}
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
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  backButton: {
    padding: '8px 16px',
    background: 'rgba(52, 152, 219, 0.8)',
    color: 'white',
    border: '2px solid #3498db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  settingsButton: {
    padding: '8px 16px',
    background: 'rgba(155, 89, 182, 0.8)',
    color: 'white',
    border: '2px solid #9b59b6',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  logoutButton: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  content: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 40px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  profileHeader: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(35, 136, 69, 0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  email: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 20px 0',
  },
  roleSkillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#238845',
    color: 'white',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  skillBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid #ddd',
  },
  // NEW: Tab Navigation Styles
  tabNav: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    overflowX: 'auto',
    background: 'white',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  tabButton: {
    padding: '10px 20px',
    background: 'transparent',
    color: '#666',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
  },
  tabButtonActive: {
    background: '#238845',
    color: 'white',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '2px solid #f0f0f0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#238845',
  },
  performanceCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  analyticsCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px',
  },
  metricRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 80px',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '25px',
  },
  metricLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  progressBar: {
    height: '12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '6px',
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  // NEW: Analytics List Styles
  analyticsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  analyticsItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    transition: 'all 0.3s',
  },
  analyticsLeft: {
    flex: 1,
  },
  analyticsItemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 6px 0',
  },
  analyticsItemSubtitle: {
    fontSize: '13px',
    color: '#999',
    margin: '0',
  },
  analyticsScore: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
  },
  scoreCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  // NEW: Trends Styles
  trendsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  trendItem: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 60px 120px',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  trendDate: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  trendBar: {
    height: '12px',
    backgroundColor: '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  trendFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    borderRadius: '6px',
  },
  trendScore: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  trendCount: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'right',
  },
  // NEW: Feedback Styles
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  feedbackItem: {
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
  },
  feedbackTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '20px',
  },
  feedbackQuestion: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  feedbackMeta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  feedbackMetaItem: {
    fontSize: '12px',
    color: '#999',
    backgroundColor: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  feedbackScore: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  feedbackExpandBtn: {
    background: 'transparent',
    border: 'none',
    color: '#238845',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    padding: '0',
    marginBottom: '12px',
    transition: 'color 0.3s',
  },
  feedbackDetails: {
    paddingTop: '12px',
    borderTop: '1px solid #e0e0e0',
  },
  feedbackText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 12px 0',
  },
  interviewsCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  interviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  interviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    transition: 'all 0.3s',
  },
  interviewLeft: {
    flex: 1,
  },
  interviewQuestion: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 6px 0',
  },
  interviewDate: {
    fontSize: '13px',
    color: '#999',
    margin: '0',
  },
  interviewRight: {
    display: 'flex',
    alignItems: 'center',
  },
  interviewScore: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  emptyState: {
    background: 'white',
    borderRadius: '16px',
    padding: '60px 30px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  emptyDescription: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 30px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#999',
    textAlign: 'center',
    padding: '20px',
    margin: '0',
  },
  startButton: {
    padding: '12px 40px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  errorMessage: {
    background: '#fee',
    color: '#e74c3c',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #fcc',
  },
};

export default MyProfilePage;
