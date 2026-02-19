import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InterviewInterface from '../components/interview/InterviewInterface';

const InterviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const handleComplete = () => {
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (!selectedCategory) {
    return (
      <div style={styles.container}>
        <nav style={styles.nav}>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ← Back to Dashboard
          </button>
        </nav>
        <div style={styles.selectionContainer}>
          <h2 style={styles.title}>Choose Interview Type</h2>
          {user?.role && (
            <div style={styles.roleBadge}>
              <span style={styles.roleLabel}>Your Role:</span>
              <span style={styles.roleValue}>{user.role}</span>
            </div>
          )}
          
          <div style={styles.difficultyFilter}>
            <label style={styles.filterLabel}>Difficulty Level:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={styles.difficultySelect}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div style={styles.categories}>
            {user?.role ? (
              <div
                style={styles.categoryCard}
                onClick={() => setSelectedCategory('role-based')}
              >
                <div style={styles.categoryIcon}>🎯</div>
                <h3 style={styles.categoryTitle}>Role-Specific Questions</h3>
                <p style={styles.categoryDescription}>
                  Questions tailored for {user.role} position
                </p>
              </div>
            ) : null}
            <div
              style={styles.categoryCard}
              onClick={() => setSelectedCategory('general')}
            >
              <div style={styles.categoryIcon}>💼</div>
              <h3 style={styles.categoryTitle}>General Interview</h3>
              <p style={styles.categoryDescription}>
                Practice common interview questions and behavioral questions
              </p>
            </div>

            <div
              style={styles.categoryCard}
              onClick={() => setSelectedCategory('software')}
            >
              <div style={styles.categoryIcon}>💻</div>
              <h3 style={styles.categoryTitle}>Software Development</h3>
              <p style={styles.categoryDescription}>
                Technical questions about programming, databases, and software engineering
              </p>
            </div>

            <div
              style={styles.categoryCard}
              onClick={() => setSelectedCategory('mixed')}
            >
              <div style={styles.categoryIcon}>🔄</div>
              <h3 style={styles.categoryTitle}>Mixed Questions</h3>
              <p style={styles.categoryDescription}>
                Combination of general and software development questions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav style={styles.nav}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </nav>
      <InterviewInterface 
        onComplete={handleComplete} 
        category={selectedCategory === 'role-based' ? null : selectedCategory}
        difficulty={selectedDifficulty}
      />
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
  selectionContainer: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 20px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: 'white',
    fontSize: 'clamp(24px, 5vw, 36px)',
    textAlign: 'center',
    marginBottom: '20px',
  },
  roleBadge: {
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    padding: '15px 30px',
    borderRadius: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '30px',
    color: 'white',
  },
  roleLabel: {
    fontSize: '14px',
    opacity: 0.9,
  },
  roleValue: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  categories: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'clamp(16px, 3vw, 30px)',
  },
  categoryCard: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(20px, 5vw, 40px)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  categoryIcon: {
    fontSize: 'clamp(40px, 10vw, 64px)',
    marginBottom: '20px',
  },
  categoryTitle: {
    fontSize: 'clamp(18px, 3.2vw, 24px)',
    marginBottom: '15px',
    color: '#333',
  },
  categoryDescription: {
    color: '#666',
    fontSize: 'clamp(14px, 2.2vw, 16px)',
    lineHeight: '1.6',
  },
  difficultyFilter: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  filterLabel: {
    color: 'white',
    fontSize: 'clamp(14px, 3.8vw, 18px)',
    marginRight: '12px',
    fontWeight: 'bold',
  },
  difficultySelect: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '2px solid white',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default InterviewPage;




