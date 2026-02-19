# Competition Feature Documentation

## Overview
The Competition Feature enables real-time multiplayer interview practice sessions where up to 4 users compete simultaneously. The feature includes Socket.io for real-time communication, a competition lobby, real-time scoring, and a live leaderboard.

## Deliverables

### 1. Socket.io Setup ✅

**Server-side (`server/services/socketService.js`)**:
- Socket.io server initialized and integrated with Express
- Real-time event handlers for:
  - `join-room`: Users join competition rooms
  - `submit-answer`: Submit interview answers
  - `get-leaderboard`: Fetch real-time leaderboard
  - `leave-room`: Leave competition room
  - `disconnect`: Handle user disconnections

**Client-side (`client/src/services/socket.js`)**:
- Socket.io client connection with authentication
- Automatic reconnection handling
- Token-based authentication for secure connections

**Key Features**:
- Real-time bidirectional communication
- Room-based message broadcasting
- Automatic cleanup on disconnect
- Error handling and recovery

### 2. Competition Lobby ✅

**Component**: `client/src/components/competition/RoomLobby.jsx`

**Features**:
- **Room ID Display**: Shows unique room identifier for sharing
- **Player List**: Real-time display of joined players (up to 4)
- **Status Indicator**: 
  - Waiting state with spinner animation
  - Active state when competition starts
- **Player Cards**: Visual representation of each player
- **Empty Slots**: Shows available slots for remaining players
- **Real-time Updates**: Automatically updates when players join/leave

**User Flow**:
1. User enters or generates a Room ID
2. User joins the room via Socket.io
3. Lobby displays current players (1-4)
4. When 4 players join, competition automatically starts
5. All users receive real-time updates

### 3. Real-time Scoring ✅

**Implementation**:
- **Answer Submission**: When a user submits an answer:
  1. Answer is analyzed using GPT-4
  2. Scores calculated: Clarity, Confidence, Applicability
  3. Combined score calculated: (Clarity × 0.4) + (Confidence × 0.3) + (Applicability × 0.3)
  4. Score saved to database
  5. Real-time broadcast to all room participants

**Socket Events**:
- `answer-submitted`: Broadcasts when a user submits an answer
- `leaderboard-refresh`: Triggers leaderboard update for all users
- `competition-completed`: Fired when all users have submitted

**Real-time Updates**:
- Scores appear immediately in leaderboard
- All users see updates as they happen
- No page refresh required

### 4. Leaderboard ✅

**Component**: `client/src/components/competition/Leaderboard.jsx`

**Features**:
- **Real-time Updates**: Automatically refreshes when scores are submitted
- **Ranking Display**: Shows current rankings (1st, 2nd, 3rd, etc.)
- **Score Breakdown**: Displays combined score and individual metrics
- **Visual Indicators**:
  - 🥇 Gold for 1st place
  - 🥈 Silver for 2nd place
  - 🥉 Bronze for 3rd place
  - 👑 Crown for winner
- **Score Details**: Shows Clarity, Confidence, and Applicability scores

**Data Displayed**:
- User name
- Combined score (0-100)
- Individual scores (C: Clarity, Co: Confidence, A: Applicability)
- Current rank

## Technical Architecture

### Socket.io Events

#### Client → Server:
- `join-room`: Join a competition room
- `submit-answer`: Submit interview answer with scores
- `get-leaderboard`: Request current leaderboard
- `leave-room`: Leave the competition room

#### Server → Client:
- `joined-room`: Confirmation of room join
- `room-updated`: Real-time room state updates
- `competition-started`: Competition has begun
- `answer-submitted`: User submitted an answer
- `leaderboard-updated`: Updated leaderboard data
- `leaderboard-refresh`: Request to refresh leaderboard
- `competition-completed`: All users have submitted

### Database Models

**Room Model** (`server/models/Room.js`):
- `roomId`: Unique room identifier
- `users`: Array of user objects (max 4)
- `status`: waiting | active | completed
- `questions`: Array of interview questions
- `startedAt`: Competition start timestamp
- `completedAt`: Competition end timestamp

**Score Model** (`server/models/Score.js`):
- `roomId`: Room identifier
- `userId`: User identifier
- `totalScore`: Combined score (0-100)
- `clarity`: Clarity score (0-100)
- `confidence`: Confidence score (0-100)
- `applicability`: Applicability score (0-100)
- `rank`: Final ranking position

## User Experience Flow

1. **Lobby Phase**:
   - User navigates to Competition page
   - Enters or generates Room ID
   - Joins room via Socket.io
   - Sees other players joining in real-time
   - Waits for 4 players

2. **Competition Phase**:
   - When 4 players join, competition starts automatically
   - All users see the same interview question
   - Users record their answers via voice
   - Answers are analyzed by GPT-4
   - Scores calculated and displayed

3. **Scoring Phase**:
   - Real-time leaderboard updates as users submit
   - Each user sees their position change
   - Score breakdowns visible to all participants

4. **Completion Phase**:
   - When all 4 users submit, competition completes
   - Final rankings displayed
   - Users can return to dashboard

## Error Handling

- **Connection Loss**: Automatic reconnection via Socket.io
- **Room Full**: Prevents more than 4 users
- **Invalid Room**: Error message displayed
- **API Failures**: Fallback scores provided
- **Disconnection**: User removed from room, others notified

## Security Features

- JWT token authentication for Socket.io connections
- User validation on room join
- Room access control
- Score validation and normalization

## Performance Optimizations

- Efficient room state management
- Minimal database queries
- Real-time updates without polling
- Optimized Socket.io event handling
- Client-side state caching


