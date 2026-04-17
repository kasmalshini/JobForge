import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { connectSocket } from '../services/socket';
import { getToken } from '../utils/token';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notice, setNotice] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const storedNotice = sessionStorage.getItem('postRegisterNotice');
    if (storedNotice) {
      setNotice(storedNotice);
      sessionStorage.removeItem('postRegisterNotice');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/rooms/notifications/list');
        if (isMounted) {
          setNotifications(response.data?.notifications || []);
        }
      } catch (error) {
        // Keep dashboard usable even if notifications fail to load.
      }
    };

    fetchNotifications();

    const token = getToken();
    const socket = connectSocket(token);
    socket.on('notification:new', (notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    });

    return () => {
      isMounted = false;
      socket.off('notification:new');
    };
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleJoinFromNotification = async (notification) => {
    try {
      if (!notification.read && notification._id) {
        await api.put(`/rooms/notifications/${notification._id}/read`);
      }
    } catch (error) {
      // Continue navigation even when mark-as-read fails.
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notification._id ? { ...item, read: true } : item
      )
    );
    setShowNotifications(false);
    localStorage.setItem('competitionRoomId', notification.roomId);
    navigate(`/competition?roomId=${encodeURIComponent(notification.roomId)}&autoJoin=1`);
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>JobForge</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>Welcome, {user?.name}</span>
          <div style={styles.notificationWrapper}>
            <button
              type="button"
              style={styles.notificationButton}
              onClick={() => setShowNotifications((prev) => !prev)}
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div style={styles.notificationDropdown}>
                {notifications.length === 0 ? (
                  <p style={styles.emptyNotification}>No notifications</p>
                ) : (
                  notifications.slice(0, 8).map((notification) => (
                    <div
                      key={notification._id}
                      style={{
                        ...styles.notificationItem,
                        ...(notification.read ? styles.notificationRead : {}),
                      }}
                    >
                      <div style={styles.notificationTitle}>{notification.title}</div>
                      <div style={styles.notificationMessage}>{notification.message}</div>
                      <button
                        type="button"
                        style={styles.notificationAction}
                        onClick={() => handleJoinFromNotification(notification)}
                      >
                        Join Room
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <button onClick={() => navigate('/profile')} style={styles.profileButton}>
            Profile
          </button>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.title}>Dashboard</h2>
        {notice && <div style={styles.notice}>{notice}</div>}
        <div style={styles.roleSection}>
          <div>
            <h3 style={styles.roleTitle}>Role Selection</h3>
            <p style={styles.roleText}>
              Current role: {user?.role || 'Not selected yet'}
            </p>
          </div>
          <button
            type="button"
            style={styles.roleButton}
            onClick={() => navigate('/role-setup')}
          >
            {user?.role ? 'Update Role & Skills' : 'Choose Role & Skills'}
          </button>
        </div>
        <div style={styles.cards}>
          <div
            style={styles.card}
            onClick={() => navigate('/interview')}
          >
            <div style={styles.cardIcon}>🎤</div>
            <h3 style={styles.cardTitle}>Practice Interview</h3>
            <p style={styles.cardDescription}>
              Start a practice interview with AI avatar
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/flashcards')}
          >
            <div style={styles.cardIcon}>📚</div>
            <h3 style={styles.cardTitle}>Flashcards</h3>
            <p style={styles.cardDescription}>
              Learn interview tips and software dev questions
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/competition')}
          >
            <div style={styles.cardIcon}>🏆</div>
            <h3 style={styles.cardTitle}>Competition</h3>
            <p style={styles.cardDescription}>
              Compete with other users in real-time
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/feedback-history')}
          >
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Feedback History</h3>
            <p style={styles.cardDescription}>
              Review your past interview performances and feedback
            </p>
          </div>

          <div
            style={styles.card}
            onClick={() => navigate('/leaderboard')}
          >
            <div style={styles.cardIcon}>🏅</div>
            <h3 style={styles.cardTitle}>Leaderboard</h3>
            <p style={styles.cardDescription}>
              See global rankings and compete with other users
            </p>
          </div>

        </div>
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
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  userName: {
    color: 'white',
    fontSize: 'clamp(13px, 2.5vw, 16px)',
  },
  notificationWrapper: {
    position: 'relative',
  },
  notificationButton: {
    border: '2px solid white',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '18px',
    cursor: 'pointer',
    position: 'relative',
    minWidth: '48px',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#e53935',
    color: 'white',
    borderRadius: '50%',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '0 4px',
  },
  notificationDropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    width: '320px',
    maxHeight: '360px',
    overflowY: 'auto',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
    padding: '10px',
    zIndex: 30,
  },
  emptyNotification: {
    margin: '8px',
    fontSize: '14px',
    color: '#666',
  },
  notificationItem: {
    border: '1px solid #e5e5e5',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '8px',
    background: '#f6fbf7',
  },
  notificationRead: {
    opacity: 0.75,
    background: '#fafafa',
  },
  notificationTitle: {
    fontWeight: '700',
    color: '#1f6f38',
    fontSize: '13px',
    marginBottom: '6px',
  },
  notificationMessage: {
    fontSize: '13px',
    color: '#333',
    marginBottom: '8px',
    lineHeight: '1.4',
  },
  notificationAction: {
    border: 'none',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    cursor: 'pointer',
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
    padding: '8px 20px',
    background: 'rgba(52, 152, 219, 0.85)',
    color: 'white',
    border: '2px solid #3498db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  content: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 40px)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    color: 'white',
    fontSize: 'clamp(24px, 5vw, 36px)',
    marginBottom: '30px',
    textAlign: 'center',
  },
  notice: {
    background: 'rgba(255,255,255,0.95)',
    color: '#1f6f38',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '12px',
    fontSize: '14px',
    fontWeight: '600',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'clamp(16px, 3vw, 30px)',
  },
  roleSection: {
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '16px',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  roleTitle: {
    color: 'white',
    fontSize: '18px',
    marginBottom: '4px',
  },
  roleText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
  },
  roleButton: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: '2px solid white',
    background: 'white',
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(18px, 3.5vw, 30px)',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  cardIcon: {
    fontSize: 'clamp(32px, 6vw, 48px)',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: 'clamp(18px, 3.2vw, 24px)',
    marginBottom: '10px',
    color: '#000',
  },
  cardDescription: {
    color: '#000',
    fontSize: 'clamp(14px, 2.2vw, 16px)',
    lineHeight: '1.6',
  },
};

export default Dashboard;




