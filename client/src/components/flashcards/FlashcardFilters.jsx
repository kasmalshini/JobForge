import React, { useState } from 'react';

const FlashcardFilters = ({ selectedDifficulty, onDifficultyChange }) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const difficulties = [
    { value: null, label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.label}>Filter by Difficulty:</h3>
      <div style={styles.filterButtons}>
        {difficulties.map((difficulty) => {
          const isActive = selectedDifficulty === difficulty.value;
          const isHovered = hoveredButton === difficulty.value;

          return (
            <button
              key={difficulty.value}
              onClick={() => onDifficultyChange(difficulty.value)}
              onMouseEnter={() => setHoveredButton(difficulty.value)}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                ...styles.button,
                ...(isActive ? styles.buttonActive : styles.buttonInactive),
                ...(isHovered && !isActive && styles.buttonHover),
                ...(isHovered && isActive && styles.buttonActiveHover),
              }}
            >
              {difficulty.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '30px',
    padding: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  label: {
    color: 'white',
    marginBottom: '15px',
    fontSize: 'clamp(14px, 3vw, 16px)',
    margin: '0 0 15px 0',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  filterButtons: {
    display: 'flex',
    gap: 'clamp(10px, 2vw, 15px)',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '25px',
    border: '2px solid white',
    cursor: 'pointer',
    fontSize: 'clamp(13px, 2.8vw, 15px)',
    fontWeight: '600',
    transition: 'all 0.25s ease',
    textTransform: 'capitalize',
    letterSpacing: '0.3px',
  },
  buttonActive: {
    background: 'white',
    color: '#238845',
    boxShadow: '0 4px 12px rgba(255,255,255,0.3)',
  },
  buttonActiveHover: {
    background: '#f0f0f0',
    color: '#1a6633',
    boxShadow: '0 6px 16px rgba(255,255,255,0.4)',
  },
  buttonInactive: {
    background: 'transparent',
    color: '#FFD700',
    fontWeight: '500',
    border: '2px solid #FFD700',
  },
  buttonHover: {
    background: 'rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    border: '2px solid #FFD700',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
    transform: 'translateY(-2px)',
  },
};

export default FlashcardFilters;
