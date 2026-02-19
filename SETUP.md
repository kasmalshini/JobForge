# JobForge Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- OpenAI API key

## Installation Steps

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Install Client Dependencies

```bash
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd ../server
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobforge
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Seed Database with Flashcards

```bash
cd server
npm run seed
```

This will populate the database with sample flashcards for:
- Interview Tips
- Software Development Questions

### 5. Start the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features

### Authentication
- Register/Login with JWT tokens
- Protected routes

### Interview Practice
- Voice-based interview with AI avatar
- Real-time transcription using Web Speech API
- AI-powered analysis (clarity, confidence, applicability)
- Score visualization

### Flashcards
- Interview tips and strategies
- Software development questions
- Flip animation for learning

### Competition Mode
- Join rooms with up to 4 players
- Real-time leaderboard
- Competitive ranking system

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally, or
- Update `MONGODB_URI` in `.env` to your MongoDB Atlas connection string

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has available credits

### Socket.io Connection Issues
- Ensure both server and client are running
- Check CORS settings in `server.js`

### Voice Recognition Not Working
- Use Chrome or Edge browser (best Web Speech API support)
- Allow microphone permissions when prompted

### Google Cloud Speech-to-Text (optional, PID Section 5.3)
- Create a Google Cloud project and enable the Speech-to-Text API
- Create a service account and download its JSON key file
- Save the key as `server/google-credentials.json` (or set `GOOGLE_APPLICATION_CREDENTIALS` to its path)
- Restart the server; the app will use Google Cloud for transcription when available, otherwise the browser Web Speech API

## Development Notes

- Server uses nodemon for auto-reload in development
- Client uses React Scripts with hot-reload
- Socket.io handles real-time features
- All API calls use JWT authentication





