import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoomLobby from '../components/competition/RoomLobby';
import InterviewInterface from '../components/interview/InterviewInterface';
import Leaderboard from '../components/competition/Leaderboard';
import { getSocket } from '../services/socket';
import api from '../services/api';

const createRoomId = () => `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const CompetitionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [requiredPlayers, setRequiredPlayers] = useState(4);
  const [status, setStatus] = useState('lobby'); // lobby, waiting, active, completed
  const [competitionComplete, setCompetitionComplete] = useState(false);
  const [rankings, setRankings] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeRoom = async () => {
    const params = new URLSearchParams(location.search);
    const invitedRoomId = params.get('roomId');
    const autoJoin = params.get('autoJoin') === '1';

    if (invitedRoomId) {
      if (!isMounted) return;
      setRoomId(invitedRoomId);
      localStorage.setItem('competitionRoomId', invitedRoomId);
      if (autoJoin) setStatus('waiting');
      return;
    }

    const storedRoomId = localStorage.getItem('competitionRoomId');
    if (!storedRoomId) {
      const newRoomId = createRoomId();
      if (!isMounted) return;
      setRoomId(newRoomId);
      localStorage.setItem('competitionRoomId', newRoomId);
      return;
    }

    let roomIdToUse = storedRoomId;
    try {
      const response = await api.get(`/rooms/${storedRoomId}`);
      const roomStatus = response?.data?.room?.status;
      if (roomStatus && roomStatus !== 'waiting') {
        roomIdToUse = createRoomId();
        localStorage.setItem('competitionRoomId', roomIdToUse);
      }
    } catch (error) {
      // Missing/invalid room IDs are treated as stale and replaced.
      roomIdToUse = createRoomId();
      localStorage.setItem('competitionRoomId', roomIdToUse);
    }

    if (!isMounted) return;
    setRoomId(roomIdToUse);
    if (autoJoin) setStatus('waiting');
  };

    initializeRoom();

    const socket = getSocket();
    if (socket) {
      // Listen for competition completion
      socket.on('competition-completed', (data) => {
        setRankings(data.rankings);
        setCompetitionComplete(true);
        setStatus('completed');
      });

      // Listen for competition start
      socket.on('competition-started', (data) => {
        setStatus('active');
      });

      // Listen for room updates
      socket.on('room-updated', (data) => {
        if (data.status === 'active') {
          setStatus('active');
        }
      });
    }

    return () => {
      isMounted = false;
      if (socket) {
        socket.off('competition-completed');
        socket.off('competition-started');
        socket.off('room-updated');
      }
    };
  }, [location.search]);

  const handleJoinRoom = () => {
    if (roomId) {
      setStatus('waiting');
    }
  };

  const handleCompetitionStart = () => {
    setStatus('active');
  };

  const handleBackToJoin = () => {
    setStatus('lobby');
  };

  if (competitionComplete && rankings) {
    return (
      <div style={styles.container}>
        <div style={styles.completeContainer}>
          <h2 style={styles.completeTitle}>Competition Complete! 🎉</h2>
          <div style={styles.rankings}>
            <h3 style={styles.rankingsTitle}>Final Rankings</h3>
            {rankings.map((entry, index) => {
              const entryUserId =
                entry.userId && typeof entry.userId === 'object'
                  ? entry.userId._id
                  : entry.userId;
              const isYou = String(entryUserId) === String(user._id);
              return (
              <div
                key={String(entryUserId ?? index)}
                style={{
                  ...styles.rankingEntry,
                  ...(index === 0 ? styles.firstPlace : {}),
                }}
              >
                <div style={styles.rankNumber}>
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${entry.rank}`}
                </div>
                <div style={styles.rankingInfo}>
                  <div style={styles.rankingName}>
                    {isYou ? 'You' : (entry.userName || 'Player')}
                  </div>
                  <div style={styles.rankingScore}>Score: {entry.totalScore}/10</div>
                  {isYou && (
                    <div style={styles.youBadge}>Your Result</div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('competitionRoomId');
              navigate('/dashboard');
            }}
            style={styles.backButton}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back to Dashboard
        </button>
      </nav>

      {status === 'lobby' && (
        <div style={styles.lobbyContainer}>
          <h2 style={styles.lobbyTitle}>Join Competition</h2>
          <p style={styles.lobbyDescription}>
            Compete in real time. Choose a 2- or 4-player match; when the room is full, everyone
            enters the interview and answers the same questions. There are 10 questions total:
            each correct answer gives 1 point, and each wrong answer gives 0 points.
          </p>
          <div style={styles.sizeRow} role="group" aria-label="Match size">
            <span style={styles.sizeLabel}>Match size:</span>
            <label style={styles.sizeOption}>
              <input
                type="radio"
                name="matchSize"
                checked={requiredPlayers === 2}
                onChange={() => setRequiredPlayers(2)}
              />
              2 players
            </label>
            <label style={styles.sizeOption}>
              <input
                type="radio"
                name="matchSize"
                checked={requiredPlayers === 4}
                onChange={() => setRequiredPlayers(4)}
              />
              4 players
            </label>
          </div>
          <div style={styles.roomInputContainer}>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              style={styles.roomInput}
            />
            <button onClick={handleJoinRoom} style={styles.joinButton}>
              Join Room
            </button>
          </div>
          <p style={styles.shareText}>
            Share this Room ID with friends: <strong>{roomId}</strong>
          </p>
        </div>
      )}

      {status === 'waiting' && (
        <div style={styles.waitingContainer}>
          <RoomLobby
            roomId={roomId}
            userId={user._id}
            userName={user.name}
            requiredPlayers={requiredPlayers}
            onCompetitionStart={handleCompetitionStart}
            onBackToJoin={handleBackToJoin}
          />
        </div>
      )}

      {status === 'active' && (
        <div style={styles.activeContainer}>
          <div style={styles.competitionLayout}>
            <div style={styles.leaderboardSection}>
              <Leaderboard roomId={roomId} />
            </div>
            <div style={styles.interviewSection}>
              <InterviewInterface
                onComplete={() => {
                  // Wait for competition to complete via socket
                }}
                roomId={roomId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
  },
  nav: {
    padding: 'clamp(12px, 3vw, 20px) clamp(16px, 4vw, 40px)',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
  },
  backButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(14px, 3.5vw, 16px)',
    fontWeight: 'bold',
  },
  lobbyContainer: {
    maxWidth: '600px',
    margin: 'clamp(16px, 4vw, 40px) auto',
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(20px, 5vw, 40px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  lobbyTitle: {
    fontSize: 'clamp(24px, 6vw, 32px)',
    marginBottom: '15px',
    color: '#333',
  },
  lobbyDescription: {
    fontSize: 'clamp(14px, 2.2vw, 16px)',
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.6',
    textAlign: 'left',
  },
  sizeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    justifyContent: 'center',
  },
  sizeLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '15px',
  },
  sizeOption: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#444',
  },
  roomInputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  roomInput: {
    flex: 1,
    minWidth: '220px',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
  },
  joinButton: {
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  shareText: {
    color: '#666',
    fontSize: '14px',
  },
  waitingContainer: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 20px)',
  },
  activeContainer: {
    padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 20px)',
  },
  competitionLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(16px, 3vw, 30px)',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  leaderboardSection: {
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
  },
  interviewSection: {
    minHeight: '100vh',
  },
  completeContainer: {
    maxWidth: '600px',
    margin: 'clamp(16px, 4vw, 40px) auto',
    background: 'white',
    borderRadius: '20px',
    padding: 'clamp(20px, 5vw, 40px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  completeTitle: {
    fontSize: 'clamp(24px, 6vw, 32px)',
    marginBottom: '30px',
    color: '#333',
  },
  rankings: {
    marginBottom: '30px',
  },
  rankingsTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  rankingEntry: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '10px',
  },
  firstPlace: {
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
  },
  rankNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    minWidth: '50px',
  },
  rankingInfo: {
    flex: 1,
    textAlign: 'left',
  },
  rankingName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  rankingScore: {
    fontSize: '14px',
    color: '#666',
  },
  youBadge: {
    fontSize: '12px',
    color: '#238845',
    fontWeight: 'bold',
    marginTop: '5px',
  },
};

export default CompetitionPage;

