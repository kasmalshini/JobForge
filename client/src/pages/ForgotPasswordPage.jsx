import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgotpassword', { email });
      if (response.data.success) {
        setSuccess(response.data.message);
        // In development, show the token (remove in production)
        if (response.data.resetToken) {
          setResetToken(response.data.resetToken);
        }
      }
    } catch (err) {
      let msg = 'Error processing request. Please try again.';
      if (err.response?.data?.message) msg = err.response.data.message;
      else if (!err.response) msg = 'Cannot reach server. Make sure the server is running (port 5000).';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Forgot Password</h1>
        <p style={styles.subtitle}>Enter your email to receive a password reset token</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          {resetToken && (
            <div style={styles.tokenContainer}>
              <p style={styles.tokenLabel}>Your Reset Token (copy this):</p>
              <div style={styles.tokenBox}>
                <code style={styles.token}>{resetToken}</code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(resetToken);
                    alert('Token copied to clipboard!');
                  }}
                  style={styles.copyButton}
                >
                  Copy
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/reset-password/${resetToken}`)}
                style={styles.resetButton}
              >
                Go to Reset Password Page
              </button>
            </div>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            style={styles.backButton}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: 'clamp(16px, 4vw, 20px)',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(20px, 5vw, 40px)',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: 'clamp(24px, 6vw, 32px)',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '30px',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  backButton: {
    padding: '12px',
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px',
    background: '#fee',
    borderRadius: '6px',
  },
  success: {
    color: '#2ecc71',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px',
    background: '#efe',
    borderRadius: '6px',
  },
  tokenContainer: {
    marginTop: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px',
  },
  tokenLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  tokenBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
    flexWrap: 'wrap',
  },
  token: {
    flex: 1,
    padding: '10px',
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '12px',
    wordBreak: 'break-all',
  },
  copyButton: {
    padding: '10px 20px',
    background: '#238845',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  resetButton: {
    width: '100%',
    padding: '12px',
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default ForgotPasswordPage;


