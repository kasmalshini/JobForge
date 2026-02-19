import React, { useState, useEffect } from 'react';
import { connectSocket, getSocket } from '../../services/socket';
import { getToken } from '../../utils/token';

const RoomLobby = ({ roomId, userId, userName, onCompetitionStart }) => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('waiting');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = getToken();
    const sock = connectSocket(token);
    setSocket(sock);

    sock.on('connect', () => {
      sock.emit('join-room', { userId, userName, roomId });
    });

    sock.on('joined-room', (data) => {
      setUsers(data.users);
      setStatus(data.status);
    });

    sock.on('room-updated', (data) => {
      setUsers(data.users || []);
      setStatus(data.status || 'waiting');
      // Real-time user count updates
    });

    sock.on('competition-started', (data) => {
      setStatus('active');
      if (onCompetitionStart) {
        onCompetitionStart(data);
      }
    });

    sock.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      sock.off('connect');
      sock.off('joined-room');
      sock.off('room-updated');
      sock.off('competition-started');
      sock.off('error');
    };
  }, [roomId, userId, userName, onCompetitionStart]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Waiting Room</h2>
      <p style={styles.roomId}>Room ID: {roomId}</p>
      
      <div style={styles.status}>
        <div style={styles.statusIndicator}>
          {status === 'waiting' && (
            <>
              <div style={styles.spinner} />
              <span>Waiting for players... ({users.length}/4)</span>
            </>
          )}
          {status === 'active' && (
            <>
              <span style={styles.activeIcon}>🚀</span>
              <span>Competition Started!</span>
            </>
          )}
        </div>
      </div>

      <div style={styles.usersList}>
        <h3 style={styles.usersTitle}>Players:</h3>
        <div style={styles.usersGrid}>
          {users.map((user, index) => (
            <div key={index} style={styles.userCard}>
              <div style={styles.userAvatar}>
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={styles.userName}>{user.name || 'Unknown'}</div>
            </div>
          ))}
          {Array.from({ length: 4 - users.length }).map((_, index) => (
            <div key={`empty-${index}`} style={styles.userCardEmpty}>
              <div style={styles.userAvatarEmpty}>?</div>
              <div style={styles.userNameEmpty}>Waiting...</div>
            </div>
          ))}
        </div>
      </div>

      {status === 'waiting' && (
        <p style={styles.waitingText}>
          Need {4 - users.length} more {4 - users.length === 1 ? 'player' : 'players'} to start
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(20px, 5vw, 40px)',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: 'clamp(24px, 6vw, 32px)',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333',
  },
  roomId: {
    textAlign: 'center',
    color: '#666',
    fontSize: 'clamp(14px, 4vw, 18px)',
    marginBottom: '30px',
    fontFamily: 'monospace',
    background: '#f0f0f0',
    padding: '10px',
    borderRadius: '8px',
    wordBreak: 'break-all',
  },
  status: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: 'clamp(14px, 4vw, 18px)',
    color: '#238845',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '3px solid #e0e0e0',
    borderTop: '3px solid #238845',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  usersList: {
    marginBottom: '20px',
  },
  usersTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#333',
  },
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  userCard: {
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    color: 'white',
  },
  userCardEmpty: {
    background: '#f0f0f0',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
  },
  userAvatar: {
    width: 'clamp(48px, 12vw, 60px)',
    height: 'clamp(48px, 12vw, 60px)',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 10px',
  },
  userAvatarEmpty: {
    width: 'clamp(48px, 12vw, 60px)',
    height: 'clamp(48px, 12vw, 60px)',
    borderRadius: '50%',
    background: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 10px',
    color: '#999',
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  userNameEmpty: {
    fontSize: '16px',
    color: '#999',
  },
  waitingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
    marginTop: '20px',
  },
  activeIcon: {
    fontSize: '24px',
    marginRight: '5px',
  },
};

export default RoomLobby;




