import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

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
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Please provide email and password');
          setLoading(false);
          return;
        }
        result = await login(formData.email, formData.password);
      } else {
        // Validate registration fields
        if (!formData.fullName) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        if (!formData.email) {
          setError('Email is required');
          setLoading(false);
          return;
        }
        if (!formData.password) {
          setError('Password is required');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!formData.role) {
          setError('Please select a role');
          setLoading(false);
          return;
        }
        result = await register(
          formData.fullName,
          formData.email,
          formData.password,
          formData.confirmPassword,
          formData.role
        );
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>JobForge</h1>
        <p style={styles.subtitle}>AI Personal Interview Coach</p>
        
        <div style={styles.toggle}>
          <button
            style={{
              ...styles.toggleButton,
              ...(isLogin ? styles.toggleButtonActive : {}),
            }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            style={{
              ...styles.toggleButton,
              ...(!isLogin ? styles.toggleButtonActive : {}),
            }}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Role (Interview For)</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="QA Engineer">QA Engineer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="Other">Other</option>
              </select>
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
            minLength={6}
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
              minLength={6}
            />
          )}
          {error && <div style={styles.error}>{error}</div>}
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
          {isLogin && (
            <div style={styles.forgotPassword}>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={styles.forgotPasswordLink}
              >
                Forgot Password?
              </button>
            </div>
          )}
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
    maxWidth: '400px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: 'clamp(26px, 6vw, 32px)',
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
  toggle: {
    display: 'flex',
    marginBottom: '20px',
    borderRadius: '8px',
    background: '#f0f0f0',
    padding: '4px',
  },
  toggleButton: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s',
    minWidth: 0,
  },
  toggleButtonActive: {
    background: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px',
    background: '#fee',
    borderRadius: '6px',
  },
  forgotPassword: {
    textAlign: 'center',
    marginTop: '15px',
  },
  forgotPasswordLink: {
    background: 'none',
    border: 'none',
    color: '#238845',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
    padding: '5px',
  },
};

export default Login;




