import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const FeedbackHistoryPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const normalizeFeedbackItems = (value) => {
    if (Array.isArray(value)) {
      return value.filter((item) => typeof item === 'string' && item.trim().length > 0);
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      return [value.trim()];
    }
    return [];
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get('/interviews');
      setInterviews(response.data.interviews || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const question = String(interview.question || '').toLowerCase();
    const feedback = String(interview.feedback || '').toLowerCase();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return question.includes(query) || feedback.includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedInterviews = filteredInterviews.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading feedback history...</div>
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
        <h2 style={styles.title}>Feedback History</h2>
        <p style={styles.subtitle}>Review your past interview performances</p>

        {interviews.length === 0 ? (
          <div style={styles.empty}>
            <p>No interview history yet. Start practicing to see your feedback!</p>
            <button
              onClick={() => navigate('/interview')}
              style={styles.startButton}
            >
              Start Practice Interview
            </button>
          </div>
        ) : (
          <div style={styles.listingContainer}>
            <div style={styles.searchRow}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by question or feedback..."
                style={styles.searchInput}
              />
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Question</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Combined</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedInterviews.map((interview) => {
                    const combined = Math.round(
                      ((interview.clarity || 0) * 0.4) +
                      ((interview.confidence || 0) * 0.3) +
                      ((interview.applicability || 0) * 0.3)
                    );
                    return (
                      <tr key={interview._id} style={styles.tr}>
                        <td style={styles.tdQuestion}>
                          {interview.question || 'Question unavailable'}
                        </td>
                        <td style={styles.td}>
                          {new Date(interview.timestamp).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.scoreBadge,
                              background:
                                combined >= 70 ? '#ecfdf3' : combined >= 50 ? '#fff7ed' : '#fef2f2',
                              color:
                                combined >= 70 ? '#166534' : combined >= 50 ? '#b45309' : '#b91c1c',
                            }}
                          >
                            {combined}/100
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            type="button"
                            style={styles.viewButton}
                            onClick={() => setSelectedInterview(interview)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {pagedInterviews.length === 0 && (
                    <tr>
                      <td colSpan={4} style={styles.emptyTableText}>
                        No feedback matches your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={styles.paginationRow}>
              <span style={styles.paginationText}>
                Page {safeCurrentPage} of {totalPages}
              </span>
              <div style={styles.paginationControls}>
                <div style={styles.rowsPerPage}>
                  <label htmlFor="rows-per-page" style={styles.rowsLabel}>Rows per page:</label>
                  <select
                    id="rows-per-page"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={styles.rowsSelect}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                <div style={styles.paginationButtons}>
                <button
                  type="button"
                  style={styles.pageButton}
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  style={styles.pageButton}
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedInterview && (
          <div style={styles.modal} onClick={() => setSelectedInterview(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button
                style={styles.closeButton}
                onClick={() => setSelectedInterview(null)}
              >
                ×
              </button>
              <h3 style={styles.modalTitle}>Interview Feedback</h3>
              <div style={styles.modalQuestion}>
                <strong>Question:</strong> {selectedInterview.question}
              </div>
              <div style={styles.modalAnswer}>
                <strong>Your Answer:</strong> {selectedInterview.answer}
              </div>
              <div style={styles.modalScores}>
                <div style={styles.modalScoreCard}>
                  <div style={styles.modalScoreLabel}>Clarity</div>
                  <div style={styles.modalScoreValue}>{selectedInterview.clarity}/100</div>
                </div>
                <div style={styles.modalScoreCard}>
                  <div style={styles.modalScoreLabel}>Confidence</div>
                  <div style={styles.modalScoreValue}>{selectedInterview.confidence}/100</div>
                </div>
                <div style={styles.modalScoreCard}>
                  <div style={styles.modalScoreLabel}>Applicability</div>
                  <div style={styles.modalScoreValue}>{selectedInterview.applicability}/100</div>
                </div>
              </div>
              {selectedInterview.feedback && (
                <div style={styles.modalFeedback}>
                  <h4>Overall Feedback</h4>
                  <p>{selectedInterview.feedback}</p>
                </div>
              )}
              {normalizeFeedbackItems(selectedInterview.strengths).length > 0 && (
                <div style={styles.modalStrengths}>
                  <h4>✅ Strengths</h4>
                  <ul style={styles.feedbackList}>
                    {normalizeFeedbackItems(selectedInterview.strengths).map((item, index) => (
                      <li key={`history-strength-${index}`} style={styles.feedbackListItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {normalizeFeedbackItems(selectedInterview.improvements).length > 0 && (
                <div style={styles.modalImprovements}>
                  <h4>💡 Areas for Improvement</h4>
                  <ul style={styles.feedbackList}>
                    {normalizeFeedbackItems(selectedInterview.improvements).map((item, index) => (
                      <li key={`history-improvement-${index}`} style={styles.feedbackListItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
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
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 'clamp(14px, 3.8vw, 18px)',
    textAlign: 'center',
    marginBottom: '40px',
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
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
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
    marginTop: '20px',
  },
  listingContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
  },
  searchRow: {
    marginBottom: '12px',
  },
  searchInput: {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
  },
  tableWrap: {
    overflowX: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '680px',
  },
  th: {
    textAlign: 'left',
    fontSize: '13px',
    color: '#4b5563',
    background: '#f9fafb',
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 700,
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#1f2937',
    verticalAlign: 'middle',
  },
  tdQuestion: {
    padding: '12px',
    fontSize: '14px',
    color: '#111827',
    maxWidth: '420px',
    lineHeight: 1.5,
  },
  scoreBadge: {
    display: 'inline-block',
    borderRadius: '999px',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: 700,
  },
  viewButton: {
    border: '1px solid #238845',
    background: 'white',
    color: '#238845',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  emptyTableText: {
    padding: '18px',
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
  },
  paginationRow: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  paginationText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  paginationButtons: {
    display: 'flex',
    gap: '8px',
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginLeft: 'auto',
  },
  rowsPerPage: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rowsLabel: {
    fontSize: '13px',
    color: '#6b7280',
  },
  rowsSelect: {
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '5px 8px',
    fontSize: '13px',
    background: '#fff',
    color: '#1f2937',
  },
  pageButton: {
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#1f2937',
    borderRadius: '8px',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  interviewsList: {
    display: 'grid',
    gap: '20px',
  },
  interviewCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  interviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '15px',
    gap: '10px',
    flexWrap: 'wrap',
  },
  question: {
    fontSize: '18px',
    color: '#333',
    flex: 1,
    marginRight: '15px',
  },
  date: {
    fontSize: '14px',
    color: '#999',
  },
  scoresRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  scoreItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: '14px',
    color: '#666',
  },
  scoreValue: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  feedbackPreview: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(18px, 5vw, 40px)',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  modalQuestion: {
    fontSize: '16px',
    marginBottom: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  modalAnswer: {
    fontSize: '16px',
    marginBottom: '20px',
    padding: '15px',
    background: '#f0f7ff',
    borderRadius: '8px',
  },
  modalScores: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  modalScoreCard: {
    flex: 1,
    textAlign: 'center',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  modalScoreLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  modalScoreValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  modalFeedback: {
    marginTop: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  modalStrengths: {
    marginTop: '15px',
    padding: '20px',
    background: '#f0fdf4',
    borderRadius: '8px',
  },
  modalImprovements: {
    marginTop: '15px',
    padding: '20px',
    background: '#fff7ed',
    borderRadius: '8px',
  },
  feedbackList: {
    margin: 0,
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  feedbackListItem: {
    color: '#333',
    lineHeight: '1.6',
  },
};

export default FeedbackHistoryPage;


