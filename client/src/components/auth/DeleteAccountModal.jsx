import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password to confirm deletion');
      return;
    }

    if (!confirmed) {
      setError('Please confirm that you want to delete your account');
      return;
    }

    setLoading(true);
    const result = await deleteAccount(password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Delete Account</h2>
        <p style={styles.warning}>
          ⚠️ This action is permanent and cannot be undone. All your data including interviews, statistics, and feedback will be deleted.
        </p>

        <form onSubmit={handleDeleteAccount} style={styles.form}>
          <div style={styles.section}>
            <label style={styles.label}>Enter Your Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password to confirm"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.checkboxSection}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                setError('');
              }}
              style={styles.checkbox}
              id="confirm-delete"
            />
            <label htmlFor="confirm-delete" style={styles.checkboxLabel}>
              I understand this will permanently delete my account and all associated data
            </label>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.deleteButton}
              disabled={loading || !confirmed}
            >
              {loading ? 'Deleting...' : 'Delete Account Permanently'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#e74c3c',
  },
  warning: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '25px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    border: '1px solid #ffc107',
    lineHeight: '1.6',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  },
  checkboxSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
  },
  checkbox: {
    marginTop: '4px',
    cursor: 'pointer',
    width: '18px',
    height: '18px',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#555',
    cursor: 'pointer',
    lineHeight: '1.5',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#fee',
    borderRadius: '6px',
    border: '1px solid #fcc',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default DeleteAccountModal;
