import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import api from '../../services/api';

const FlashcardDeck = ({ category }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlashcards();
  }, [category]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const url = category
        ? `/flashcards?category=${category}`
        : '/flashcards';
      const response = await api.get(url);
      setFlashcards(response.data.flashcards);
      setCurrentIndex(0);
    } catch (err) {
      setError('Failed to load flashcards');
      console.error('Error fetching flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (flashcards.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No flashcards available for this category.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {category
            ? category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
            : 'All Flashcards'}
        </h2>
        <p style={styles.counter}>
          {currentIndex + 1} / {flashcards.length}
        </p>
      </div>

      <Flashcard
        flashcard={flashcards[currentIndex]}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirst={currentIndex === 0}
        isLast={currentIndex === flashcards.length - 1}
      />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: 'clamp(16px, 4vw, 20px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    color: 'white',
    gap: '12px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 'clamp(20px, 5vw, 28px)',
    margin: 0,
  },
  counter: {
    fontSize: 'clamp(14px, 4vw, 18px)',
    opacity: 0.9,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    color: 'white',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(255,255,255,0.3)',
    borderTop: '5px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    textAlign: 'center',
    color: '#e74c3c',
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px',
  },
  empty: {
    textAlign: 'center',
    color: 'white',
    padding: '40px',
    fontSize: '18px',
  },
};

export default FlashcardDeck;





