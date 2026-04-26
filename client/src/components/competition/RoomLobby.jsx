import React, { useState, useEffect } from 'react';
import { connectSocket } from '../../services/socket';
import { getToken } from '../../utils/token';
import api from '../../services/api';

const RoomLobby = ({ roomId, userId, userName, requiredPlayers = 4, onCompetitionStart, onBackToJoin }) => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('waiting');
  const [, setSocket] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(requiredPlayers);
  const [socketError, setSocketError] = useState('');
  const [inviteTarget, setInviteTarget] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');
  const [inviting, setInviting] = useState(false);

  const currentUserName = userName || 'You';
  const ensureCurrentUserInList = (incomingUsers = []) => {
    const normalized = Array.isArray(incomingUsers) ? incomingUsers : [];
    const hasCurrentUser = normalized.some(
      (u) => String(u.userId) === String(userId)
    );
    if (hasCurrentUser) return normalized;
    return [{ userId, name: currentUserName, socketId: null }, ...normalized];
  };

  useEffect(() => {
    setMaxPlayers(requiredPlayers);
  }, [requiredPlayers]);

  useEffect(() => {
    // Optimistically render current user while socket events are in flight.
    setUsers((prev) => ensureCurrentUserInList(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentUserName]);

  useEffect(() => {
    const token = getToken();
    const sock = connectSocket(token);
    setSocket(sock);
    setSocketError('');

    const emitJoinRoom = () => {
      setSocketError('');
      sock.emit('join-room', { userId, userName, roomId, requiredPlayers });
    };

    sock.on('connect', emitJoinRoom);
    if (sock.connected) {
      emitJoinRoom();
    }

    sock.on('joined-room', (data) => {
      setUsers(ensureCurrentUserInList(data.users));
      setStatus(data.status);
      if (data.requiredPlayers) setMaxPlayers(data.requiredPlayers);
    });

    sock.on('room-updated', (data) => {
      setUsers(ensureCurrentUserInList(data.users || []));
      setStatus(data.status || 'waiting');
      if (data.requiredPlayers != null) setMaxPlayers(data.requiredPlayers);
      if (data.maxUsers != null) setMaxPlayers(data.maxUsers);
    });

    sock.on('competition-started', (data) => {
      setStatus('active');
      if (onCompetitionStart) {
        onCompetitionStart(data);
      }
    });

    sock.on('error', (error) => {
      console.error('Socket error:', error);
      const message = error?.message || 'Failed to join room. Check connection and room settings.';
      setSocketError(message);
    });

    return () => {
      sock.off('connect', emitJoinRoom);
      sock.off('joined-room');
      sock.off('room-updated');
      sock.off('competition-started');
      sock.off('error');
    };
  }, [roomId, userId, userName, requiredPlayers, onCompetitionStart]);

  const handleInvite = async () => {
    const rawTarget = inviteTarget.trim();
    if (!rawTarget) {
      setInviteStatus('Enter an email or user ID to send invite.');
      return;
    }

    try {
      setInviting(true);
      setInviteStatus('');
      const looksLikeEmail = rawTarget.includes('@');
      const response = await api.post(`/rooms/${roomId}/invite`, {
        ...(looksLikeEmail ? { email: rawTarget } : { userId: rawTarget }),
      });
      setInviteStatus(response.data?.message || 'Invite sent successfully.');
      setInviteTarget('');
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setInviteStatus(apiMessage || 'Unable to send invite right now.');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topActions}>
        <button
          type="button"
          onClick={onBackToJoin}
          style={styles.backButton}
        >
          ← Back to Join Competition
        </button>
      </div>
      <h2 style={styles.title}>Waiting Room</h2>
      <p style={styles.roomId}>Room ID: {roomId}</p>
      
      <div style={styles.status}>
        <div style={styles.statusIndicator}>
          {status === 'waiting' && (
            <>
              <div style={styles.spinner} />
              <span>
                Waiting for players... ({users.length}/{maxPlayers})
              </span>
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
          {Array.from({ length: Math.max(0, maxPlayers - users.length) }).map((_, index) => (
            <div key={`empty-${index}`} style={styles.userCardEmpty}>
              <div style={styles.userAvatarEmpty}>?</div>
              <div style={styles.userNameEmpty}>Waiting...</div>
            </div>
          ))}
        </div>
      </div>

      {status === 'waiting' && (
        <p style={styles.waitingText}>
          Need {Math.max(0, maxPlayers - users.length)} more{' '}
          {Math.max(0, maxPlayers - users.length) === 1 ? 'player' : 'players'} to start
        </p>
      )}
      {!!socketError && (
        <p style={styles.socketError}>{socketError}</p>
      )}

      {status === 'waiting' && (
        <div style={styles.inviteSection}>
          <h4 style={styles.inviteTitle}>Invite a player</h4>
          <div style={styles.inviteRow}>
            <input
              type="text"
              value={inviteTarget}
              onChange={(e) => setInviteTarget(e.target.value)}
              placeholder="Enter player's email or user ID"
              style={styles.inviteInput}
            />
            <button
              type="button"
              onClick={handleInvite}
              disabled={inviting}
              style={styles.inviteButton}
            >
              {inviting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
          {!!inviteStatus && <p style={styles.inviteStatus}>{inviteStatus}</p>}
        </div>
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
  topActions: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '8px',
  },
  backButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    background: '#f1f5f9',
    color: '#1f2937',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
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
  socketError: {
    textAlign: 'center',
    color: '#c0392b',
    fontSize: '14px',
    marginTop: '8px',
    background: '#fdecea',
    borderRadius: '8px',
    padding: '8px 10px',
  },
  activeIcon: {
    fontSize: '24px',
    marginRight: '5px',
  },
  inviteSection: {
    marginTop: '24px',
    borderTop: '1px solid #e7e7e7',
    paddingTop: '16px',
  },
  inviteTitle: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '16px',
  },
  inviteRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  inviteInput: {
    flex: 1,
    minWidth: '220px',
    border: '1px solid #d5d5d5',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '14px',
  },
  inviteButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  inviteStatus: {
    marginTop: '10px',
    fontSize: '13px',
    color: '#444',
  },
};

export default RoomLobby;




