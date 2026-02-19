import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { setToken } from '../utils/token';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { resettoken } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!resettoken) {
      navigate('/forgot-password');
    }
  }, [resettoken, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.put(`/auth/resetpassword/${resettoken}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.success) {
        setSuccess('Password reset successful! Redirecting to dashboard...');
        // Auto-login with the new token
        if (response.data.token) {
          setToken(response.data.token);
          setTimeout(() => {
            navigate('/dashboard');
            window.location.reload(); // Reload to update auth state
          }, 2000);
        }
      }
    } catch (err) {
      let msg = 'Error resetting password. Please try again.';
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
        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>Enter your new password</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
            minLength={6}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
            minLength={6}
          />

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
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
};

export default ResetPasswordPage;

