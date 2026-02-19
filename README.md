# JobForge - AI Personal Interview Coach

A MERN stack application for practicing interviews with AI-powered analysis, flashcards, and competitive ranking.

## Features

- 🎤 Voice-based interview practice with AI avatar
- 📊 Real-time analysis of clarity, confidence, and answer applicability
- 📚 Educational flashcards (Interview Tips & Software Development)
- 🏆 Competitive ranking system (4-user sessions)
- 🔐 JWT-based authentication

## Tech Stack

- **Frontend**: React, React Router, Socket.io-client, Lottie React, Web Speech API
- **Backend**: Node.js, Express, MongoDB, Socket.io, OpenAI API
- **Authentication**: JWT

## Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository
2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Configure environment variables:
```bash
cd ../server
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
```

5. Start the development servers:

Server (port 5000):
```bash
cd server
npm run dev
```

Client (port 3000):
```bash
cd client
npm start
```

## Project Structure

```
JobForge/
├── client/          # React frontend
├── server/          # Express backend
└── README.md
```

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `OPENAI_API_KEY`: OpenAI API key for answer analysis
- `CLIENT_URL`: Frontend URL for CORS
- `GOOGLE_APPLICATION_CREDENTIALS`: (Optional) Path to Google Cloud service account JSON for Speech-to-Text (e.g. `./google-credentials.json`)





