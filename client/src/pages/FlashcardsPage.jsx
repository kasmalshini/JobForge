import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardDeck from '../components/flashcards/FlashcardDeck';

const FlashcardsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </nav>

      {!selectedCategory ? (
        <div style={styles.categorySelection}>
          <h2 style={styles.title}>Choose a Category</h2>
          <div style={styles.categories}>
            <div
              style={styles.categoryCard}
              onClick={() => setSelectedCategory('interview-tips')}
            >
              <div style={styles.categoryIcon}>💼</div>
              <h3 style={styles.categoryTitle}>Interview Tips</h3>
              <p style={styles.categoryDescription}>
                Learn best practices and strategies for interviews
              </p>
            </div>

            <div
              style={styles.categoryCard}
              onClick={() => setSelectedCategory('software-development')}
            >
              <div style={styles.categoryIcon}>💻</div>
              <h3 style={styles.categoryTitle}>Software Development</h3>
              <p style={styles.categoryDescription}>
                Technical questions and concepts for developers
              </p>
            </div>

            <div
              style={styles.categoryCard}
              onClick={() => setSelectedCategory(null)}
            >
              <div style={styles.categoryIcon}>📚</div>
              <h3 style={styles.categoryTitle}>All Flashcards</h3>
              <p style={styles.categoryDescription}>
                View all flashcards from all categories
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.deckContainer}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={styles.backToCategories}
          >
            ← Back to Categories
          </button>
          <FlashcardDeck category={selectedCategory} />
        </div>
      )}
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
  categorySelection: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 20px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: 'white',
    fontSize: 'clamp(24px, 5vw, 36px)',
    textAlign: 'center',
    marginBottom: '40px',
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
  deckContainer: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 20px)',
  },
  backToCategories: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
};

export default FlashcardsPage;





