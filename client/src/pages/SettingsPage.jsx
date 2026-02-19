import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DeleteAccountModal from '../components/auth/DeleteAccountModal';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>JobForge</h1>
        <div style={styles.navRight}>
          <button onClick={() => navigate('/profile')} style={styles.profileButton}>
            My Profile
          </button>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            Back to Dashboard
          </button>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.title}>Settings</h2>

          {/* Account Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Account</h3>

            <div style={styles.settingItem}>
              <div style={styles.settingInfo}>
                <h4 style={styles.settingName}>User Information</h4>
                <p style={styles.settingDescription}>
                  Email: <strong>{user?.email}</strong>
                </p>
                <p style={styles.settingDescription}>
                  Role: <strong>{user?.role || 'Not set'}</strong>
                </p>
                {user?.skills && user.skills.length > 0 && (
                  <p style={styles.settingDescription}>
                    Skills: <strong>{user.skills.join(', ')}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={styles.dangerZone}>
            <h3 style={styles.dangerTitle}>⚠️ Danger Zone</h3>

            <div style={styles.dangerItem}>
              <div style={styles.dangerInfo}>
                <h4 style={styles.dangerName}>Delete Account</h4>
                <p style={styles.dangerDescription}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={styles.deleteButton}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
    gap: '15px',
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
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  logoutButton: {
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  profileButton: {
    padding: '8px 16px',
    background: 'rgba(155, 89, 182, 0.8)',
    color: 'white',
    border: '2px solid #9b59b6',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  content: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 40px)',
    maxWidth: '700px',
    margin: '0 auto',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: 'clamp(24px, 5vw, 40px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#238845',
    marginBottom: '20px',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  settingDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '6px',
    lineHeight: '1.5',
  },
  dangerZone: {
    borderTop: '2px solid #fcc',
    paddingTop: '30px',
    marginTop: '30px',
  },
  dangerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: '20px',
  },
  dangerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#fff5f5',
    borderRadius: '10px',
    border: '1px solid #fcc',
    gap: '16px',
  },
  dangerInfo: {
    flex: 1,
  },
  dangerName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: '8px',
  },
  dangerDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  deleteButton: {
    padding: '10px 24px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
  },
};

export default SettingsPage;
