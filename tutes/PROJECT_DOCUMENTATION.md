# AI Personal Interview Coach - Complete Development Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites & Knowledge Required](#prerequisites--knowledge-required)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Development Environment Setup](#development-environment-setup)
6. [Database Design](#database-design)
7. [Step-by-Step Development Plan](#step-by-step-development-plan)
8. [Feature Implementation Guide](#feature-implementation-guide)
9. [AI/ML Integration](#aiml-integration)
10. [Deployment Guide](#deployment-guide)
11. [Testing Strategy](#testing-strategy)

---

## 🎯 Project Overview

### Application Purpose
An AI-powered interview coaching platform that helps users practice interviews through:
- Interactive voice-based interviews with an AI avatar
- Real-time analysis of answer quality (clarity, confidence, applicability)
- Gamification through flashcards and competitive rankings
- Multi-user competition mode

### Core Features
1. **User Authentication** - Login/Signup system
2. **Interview Practice** - AI avatar asks questions via bubble messages
3. **Voice Response** - Users answer questions using voice
4. **AI Analysis** - Measures clarity, confidence, and applicability of answers
5. **Flashcards** - Entertainment/learning feature
6. **Ranking System** - Competitive mode for 4 users
7. **User Comparison** - Performance metrics and leaderboard

---

## 📚 Prerequisites & Knowledge Required

### Before You Start - Essential Knowledge

#### 1. **JavaScript/TypeScript Fundamentals**
- ES6+ features (arrow functions, destructuring, promises, async/await)
- Understanding of closures, prototypes, and event loop
- **Time to Learn**: 2-3 weeks if beginner

#### 2. **Frontend (React.js)**
- Component lifecycle and hooks (useState, useEffect, useContext, useRef)
- State management (Context API or Redux)
- React Router for navigation
- CSS/Styling (Tailwind CSS recommended)
- **Time to Learn**: 3-4 weeks

#### 3. **Backend (Node.js & Express)**
- RESTful API design principles
- Middleware concepts
- Authentication (JWT tokens)
- File handling and uploads
- **Time to Learn**: 2-3 weeks

#### 4. **Database (MongoDB)**
- NoSQL database concepts
- Mongoose ODM (Object Data Modeling)
- Schema design and relationships
- Queries and aggregation
- **Time to Learn**: 1-2 weeks

#### 5. **AI/ML Basics**
- Understanding of APIs (OpenAI, Google Cloud Speech-to-Text)
- Natural Language Processing (NLP) concepts
- Sentiment analysis basics
- **Time to Learn**: 1-2 weeks for integration (not building from scratch)

#### 6. **Web Audio APIs**
- Recording audio from browser
- Converting audio formats
- Working with MediaRecorder API
- **Time to Learn**: 1 week

#### 7. **Real-time Communication**
- WebSockets basics (optional, for live competitions)
- Socket.io (if implementing real-time features)
- **Time to Learn**: 1 week

### Development Tools You Must Install
- Node.js (v18+ recommended)
- npm or yarn package manager
- MongoDB (local or MongoDB Atlas)
- Git for version control
- VS Code or preferred IDE
- Postman for API testing

### Recommended Skills (Can Learn Along the Way)
- Docker for containerization
- AWS/Heroku for deployment
- GitHub Actions for CI/CD

---

## 🛠️ Technology Stack

### Frontend
```
- React.js (v18+)
- React Router DOM (v6+)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Speech Recognition
- Web Audio API
- Chart.js or Recharts (for analytics)
- React Avatar (for AI avatar display)
```

### Backend
```
- Node.js (v18+)
- Express.js (v4+)
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- multer (file uploads)
- cors (cross-origin requests)
- dotenv (environment variables)
```

### AI/ML Services
```
- OpenAI API (GPT-4 for question generation & answer evaluation)
- Google Cloud Speech-to-Text API (voice recognition)
- Azure Cognitive Services (alternative for speech)
- Natural Language Toolkit integration
```

### Additional Tools
```
- Socket.io (real-time features)
- Redis (optional, for caching and sessions)
- Cloudinary (media storage)
- Stripe/PayPal (if monetization needed)
```

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                       │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Login    │  │  Interview   │  │   Flashcards     │   │
│  │   Page     │  │    Screen    │  │   & Rankings     │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                     (HTTP/WebSocket)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │   Auth   │  │Interview │  │  Voice   │  │  Ranking  │  │
│  │   APIs   │  │   APIs   │  │   APIs   │  │    APIs   │  │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
         ┌────▼───┐   ┌────▼────┐   ┌───▼────────┐
         │MongoDB │   │  Redis  │   │ AI Services│
         │Database│   │ (Cache) │   │ (OpenAI/   │
         │        │   │         │   │  Google)   │
         └────────┘   └─────────┘   └────────────┘
```

### Data Flow

1. **User Login** → JWT Token → Authenticated Session
2. **Start Interview** → Fetch Question from AI → Display in Bubble
3. **User Speaks** → Capture Audio → Convert to Text (Speech-to-Text)
4. **Analyze Answer** → Send to NLP Model → Get Scores (Clarity, Confidence, Applicability)
5. **Store Results** → Database → Update Rankings
6. **Competition Mode** → Fetch Multiple User Scores → Real-time Comparison

---

## ⚙️ Development Environment Setup

### Step 1: Install Required Software

#### Install Node.js
```bash
# Download from https://nodejs.org/
# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show v9.x.x or higher
```

#### Install MongoDB
```bash
# Option 1: Local Installation
# Download from https://www.mongodb.com/try/download/community

# Option 2: Use MongoDB Atlas (Cloud - Recommended for Beginners)
# Sign up at https://www.mongodb.com/cloud/atlas
# Create a free cluster
# Get connection string
```

#### Install Git
```bash
# Download from https://git-scm.com/
git --version
```

### Step 2: Create Project Structure

```bash
# Create main project folder
mkdir ai-interview-coach
cd ai-interview-coach

# Initialize Git
git init

# Create folder structure
mkdir backend frontend
```

### Step 3: Backend Setup

```bash
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
npm install multer axios openai socket.io
npm install nodemon --save-dev

# Create folder structure
mkdir src
cd src
mkdir config controllers models routes middleware utils services
cd ..
```

**Create backend/.env file:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_change_this
OPENAI_API_KEY=your_openai_api_key
GOOGLE_SPEECH_API_KEY=your_google_speech_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Update backend/package.json scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Step 4: Frontend Setup

```bash
cd ../frontend

# Create React app
npx create-react-app . --template=cra-template

# OR use Vite (faster alternative)
npm create vite@latest . -- --template react

# Install dependencies
npm install react-router-dom axios
npm install tailwindcss postcss autoprefixer
npm install framer-motion react-speech-recognition
npm install chart.js react-chartjs-2
npm install socket.io-client

# Initialize Tailwind CSS
npx tailwindcss init -p
```

**Configure Tailwind CSS (frontend/tailwind.config.js):**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Add to frontend/src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Create frontend/.env file:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🗄️ Database Design

### MongoDB Collections Schema

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String,
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date,
  stats: {
    totalInterviews: Number,
    averageClarity: Number,
    averageConfidence: Number,
    averageApplicability: Number,
    overallScore: Number,
    rank: Number
  }
}
```

#### 2. Interviews Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  competitionId: ObjectId (ref: 'Competition', optional),
  questions: [{
    questionText: String,
    category: String,
    difficulty: String,
    askedAt: Date,
    audioResponse: String (URL),
    textResponse: String (transcribed),
    analysis: {
      clarity: Number (0-100),
      confidence: Number (0-100),
      applicability: Number (0-100),
      overallScore: Number,
      feedback: String,
      keywords: [String],
      sentimentScore: Number
    },
    timeToAnswer: Number (seconds)
  }],
  startedAt: Date,
  completedAt: Date,
  totalScore: Number,
  status: String (enum: ['in-progress', 'completed', 'abandoned'])
}
```

#### 3. Flashcards Collection
```javascript
{
  _id: ObjectId,
  category: String,
  question: String,
  answer: String,
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  tags: [String],
  timesViewed: Number,
  createdAt: Date
}
```

#### 4. Competitions Collection
```javascript
{
  _id: ObjectId,
  participants: [{
    userId: ObjectId (ref: 'User'),
    username: String,
    score: Number,
    rank: Number,
    joinedAt: Date
  }],
  status: String (enum: ['waiting', 'in-progress', 'completed']),
  questions: [{
    questionText: String,
    category: String
  }],
  maxParticipants: Number (default: 4),
  startedAt: Date,
  completedAt: Date,
  winner: ObjectId (ref: 'User')
}
```

#### 5. Questions Bank Collection
```javascript
{
  _id: ObjectId,
  questionText: String,
  category: String (enum: ['technical', 'behavioral', 'situational', 'general']),
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  industry: String,
  keywords: [String],
  expectedAnswerPoints: [String],
  createdAt: Date
}
```

---

## 📅 Step-by-Step Development Plan

### Phase 1: Foundation (Week 1-2)

#### Task 1.1: Setup Project Structure ✅
- Initialize backend and frontend
- Setup Git repository
- Configure environment variables
- Install all dependencies

#### Task 1.2: Database Connection
```javascript
// backend/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### Task 1.3: Create Express Server
```javascript
// backend/src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Coach API' });
});

// Import routes (we'll create these)
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/interview', require('./routes/interview.routes'));
// app.use('/api/flashcards', require('./routes/flashcard.routes'));
// app.use('/api/competition', require('./routes/competition.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Phase 2: Authentication System (Week 2)

#### Task 2.1: User Model
```javascript
// backend/src/models/User.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  stats: {
    totalInterviews: { type: Number, default: 0 },
    averageClarity: { type: Number, default: 0 },
    averageConfidence: { type: Number, default: 0 },
    averageApplicability: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

#### Task 2.2: Auth Controller
```javascript
// backend/src/controllers/auth.controller.js
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({ username, email, password, fullName });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        stats: user.stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

#### Task 2.3: Auth Middleware
```javascript
// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
```

#### Task 2.4: Auth Routes
```javascript
// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
```

### Phase 3: Frontend Authentication (Week 3)

#### Task 3.1: Auth Context
```javascript
// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Task 3.2: Login Component
```javascript
// frontend/src/components/Auth/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Welcome Back
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <span 
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

### Phase 4: Interview Feature (Week 4-5)

#### Task 4.1: AI Service for Questions
```javascript
// backend/src/services/ai.service.js
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Generate interview question
exports.generateQuestion = async (category, difficulty, previousQuestions = []) => {
  try {
    const prompt = `Generate a ${difficulty} ${category} interview question. 
    Avoid these previously asked questions: ${previousQuestions.join(', ')}.
    Return only the question text, nothing else.`;

    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question');
  }
};

// Analyze answer
exports.analyzeAnswer = async (question, answer) => {
  try {
    const prompt = `
    Interview Question: "${question}"
    Candidate's Answer: "${answer}"
    
    Analyze this interview answer and provide:
    1. Clarity score (0-100): How clear and well-structured is the answer?
    2. Confidence score (0-100): How confident does the candidate sound?
    3. Applicability score (0-100): How relevant and applicable is the answer?
    4. Key strengths (2-3 points)
    5. Areas for improvement (2-3 points)
    
    Return response as JSON with keys: clarity, confidence, applicability, strengths, improvements, feedback
    `;

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert interview coach.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const analysis = JSON.parse(response.data.choices[0].message.content);
    
    return {
      clarity: analysis.clarity,
      confidence: analysis.confidence,
      applicability: analysis.applicability,
      overallScore: (analysis.clarity + analysis.confidence + analysis.applicability) / 3,
      feedback: analysis.feedback,
      keywords: extractKeywords(answer),
      sentimentScore: await analyzeSentiment(answer)
    };
  } catch (error) {
    console.error('Error analyzing answer:', error);
    // Return default scores if AI fails
    return {
      clarity: 50,
      confidence: 50,
      applicability: 50,
      overallScore: 50,
      feedback: 'Analysis unavailable at this time.',
      keywords: [],
      sentimentScore: 0
    };
  }
};

// Extract keywords from text
const extractKeywords = (text) => {
  // Simple keyword extraction (you can use more sophisticated NLP libraries)
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];
  return words
    .filter(word => word.length > 4 && !stopWords.includes(word))
    .slice(0, 10);
};

// Analyze sentiment
const analyzeSentiment = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Analyze the sentiment of this text and return only a number from -1 (very negative) to 1 (very positive):\n\n"${text}"`,
      max_tokens: 10,
      temperature: 0,
    });
    
    return parseFloat(response.data.choices[0].text.trim()) || 0;
  } catch (error) {
    return 0;
  }
};
```

#### Task 4.2: Speech-to-Text Service
```javascript
// backend/src/services/speech.service.js
const speech = require('@google-cloud/speech');
const fs = require('fs');

// Initialize Google Cloud Speech client
const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

exports.transcribeAudio = async (audioFilePath) => {
  try {
    // Read audio file
    const audioBytes = fs.readFileSync(audioFilePath).toString('base64');

    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
      },
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Calculate confidence
    const confidence = response.results.reduce((acc, result) => {
      return acc + result.alternatives[0].confidence;
    }, 0) / response.results.length;

    return {
      text: transcription,
      confidence: confidence * 100
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};
```

#### Task 4.3: Interview Controller
```javascript
// backend/src/controllers/interview.controller.js
const Interview = require('../models/Interview.model');
const aiService = require('../services/ai.service');
const speechService = require('../services/speech.service');

// Start new interview
exports.startInterview = async (req, res) => {
  try {
    const { category = 'general', difficulty = 'medium' } = req.body;
    
    const interview = new Interview({
      userId: req.userId,
      questions: [],
      status: 'in-progress'
    });

    await interview.save();

    res.json({
      message: 'Interview started',
      interviewId: interview._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get next question
exports.getNextQuestion = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { category = 'general', difficulty = 'medium' } = req.body;

    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Get previously asked questions
    const previousQuestions = interview.questions.map(q => q.questionText);

    // Generate new question
    const questionText = await aiService.generateQuestion(
      category, 
      difficulty, 
      previousQuestions
    );

    // Add question to interview
    interview.questions.push({
      questionText,
      category,
      difficulty,
      askedAt: new Date()
    });

    await interview.save();

    res.json({
      question: questionText,
      questionIndex: interview.questions.length - 1
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit answer (with audio)
exports.submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex } = req.params;
    const audioFile = req.file; // Uploaded via multer

    if (!audioFile) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Transcribe audio
    const transcription = await speechService.transcribeAudio(audioFile.path);

    // Get the question
    const question = interview.questions[questionIndex];
    
    // Analyze answer
    const analysis = await aiService.analyzeAnswer(
      question.questionText,
      transcription.text
    );

    // Update question with response and analysis
    question.textResponse = transcription.text;
    question.audioResponse = audioFile.path; // Save audio file path
    question.analysis = analysis;

    await interview.save();

    res.json({
      message: 'Answer submitted successfully',
      transcription: transcription.text,
      analysis: analysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete interview
exports.completeInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Calculate total score
    const totalScore = interview.questions.reduce((sum, q) => {
      return sum + (q.analysis?.overallScore || 0);
    }, 0) / interview.questions.length;

    interview.totalScore = totalScore;
    interview.status = 'completed';
    interview.completedAt = new Date();

    await interview.save();

    // Update user stats
    const User = require('../models/User.model');
    const user = await User.findById(req.userId);
    
    const avgClarity = interview.questions.reduce((sum, q) => sum + (q.analysis?.clarity || 0), 0) / interview.questions.length;
    const avgConfidence = interview.questions.reduce((sum, q) => sum + (q.analysis?.confidence || 0), 0) / interview.questions.length;
    const avgApplicability = interview.questions.reduce((sum, q) => sum + (q.analysis?.applicability || 0), 0) / interview.questions.length;

    user.stats.totalInterviews += 1;
    user.stats.averageClarity = ((user.stats.averageClarity * (user.stats.totalInterviews - 1)) + avgClarity) / user.stats.totalInterviews;
    user.stats.averageConfidence = ((user.stats.averageConfidence * (user.stats.totalInterviews - 1)) + avgConfidence) / user.stats.totalInterviews;
    user.stats.averageApplicability = ((user.stats.averageApplicability * (user.stats.totalInterviews - 1)) + avgApplicability) / user.stats.totalInterviews;
    user.stats.overallScore = (user.stats.averageClarity + user.stats.averageConfidence + user.stats.averageApplicability) / 3;

    await user.save();

    res.json({
      message: 'Interview completed',
      totalScore: totalScore,
      stats: user.stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

### Phase 5: Frontend Interview Screen (Week 5-6)

#### Task 5.1: Voice Recording Hook
```javascript
// frontend/src/hooks/useVoiceRecorder.js
import { useState, useRef } from 'react';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    audioChunksRef.current = [];
  };

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  };
};
```

#### Task 5.2: Interview Screen Component
```javascript
// frontend/src/components/Interview/InterviewScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import Avatar from './Avatar';
import QuestionBubble from './QuestionBubble';
import RecordButton from './RecordButton';
import AnalysisDisplay from './AnalysisDisplay';

const InterviewScreen = () => {
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  } = useVoiceRecorder();

  // Start interview
  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    try {
      const response = await axios.post('/interview/start');
      setInterviewId(response.data.interviewId);
      getNextQuestion(response.data.interviewId);
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const getNextQuestion = async (id = interviewId) => {
    setLoading(true);
    try {
      const response = await axios.post(`/interview/${id}/next-question`);
      setCurrentQuestion(response.data.question);
      setQuestionIndex(response.data.questionIndex);
      setAnalysis(null);
      resetRecording();
    } catch (error) {
      console.error('Failed to get question:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!audioBlob) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'answer.webm');

      const response = await axios.post(
        `/interview/${interviewId}/answer/${questionIndex}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <Avatar isListening={isRecording} />
        </div>

        {/* Question Bubble */}
        <QuestionBubble question={currentQuestion} loading={loading} />

        {/* Recording Controls */}
        <div className="mt-8 flex justify-center">
          <RecordButton
            isRecording={isRecording}
            hasRecording={!!audioBlob}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSubmit={submitAnswer}
            disabled={loading}
          />
        </div>

        {/* Analysis Display */}
        {analysis && (
          <div className="mt-8">
            <AnalysisDisplay analysis={analysis} />
            <button
              onClick={() => getNextQuestion()}
              className="mt-4 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewScreen;
```

### Phase 6: Flashcards Feature (Week 6)

#### Task 6.1: Flashcard Model & Routes
```javascript
// backend/src/models/Flashcard.model.js
const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['technical', 'behavioral', 'situational', 'general', 'fun']
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  timesViewed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
```

### Phase 7: Competition Feature (Week 7)

#### Task 7.1: Competition with Socket.io
```javascript
// backend/src/controllers/competition.controller.js
const Competition = require('../models/Competition.model');
const aiService = require('../services/ai.service');

// Create/Join competition
exports.joinCompetition = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    // Find waiting competition
    let competition = await Competition.findOne({
      status: 'waiting',
      'participants': { $size: { $lt: 4 } }
    });

    if (!competition) {
      // Create new competition
      competition = new Competition({
        participants: [],
        status: 'waiting',
        maxParticipants: 4
      });
    }

    // Add user to competition
    competition.participants.push({
      userId: userId,
      username: user.username,
      score: 0,
      rank: 0
    });

    await competition.save();

    // If 4 users, start competition
    if (competition.participants.length === 4) {
      competition.status = 'in-progress';
      competition.startedAt = new Date();
      
      // Generate questions for competition
      for (let i = 0; i < 5; i++) {
        const question = await aiService.generateQuestion('general', 'medium');
        competition.questions.push({
          questionText: question,
          category: 'general'
        });
      }
      
      await competition.save();
    }

    res.json({
      message: 'Joined competition',
      competition: competition
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
```

### Phase 8: Ranking System (Week 8)

#### Task 8.1: Leaderboard
```javascript
// backend/src/controllers/ranking.controller.js
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ 'stats.overallScore': -1 })
      .limit(100)
      .select('username fullName avatar stats');

    res.json({ leaderboard: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

---

## 🤖 AI/ML Integration

### OpenAI API Setup

1. **Get API Key**: Sign up at https://platform.openai.com/
2. **Install SDK**: `npm install openai`
3. **Configure**: Add `OPENAI_API_KEY` to `.env`

### Google Cloud Speech-to-Text Setup

1. **Create Project**: Go to https://console.cloud.google.com/
2. **Enable API**: Enable Speech-to-Text API
3. **Create Service Account**: Download JSON credentials
4. **Install SDK**: `npm install @google-cloud/speech`
5. **Configure**: Set `GOOGLE_APPLICATION_CREDENTIALS` path

### Alternative: Web Speech API (No Backend Required)

```javascript
// Frontend-only solution
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log('User said:', transcript);
};

recognition.start();
```

---

## 🚀 Deployment Guide

### Deploy Backend (Heroku)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create ai-interview-coach-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
```

---

## 🧪 Testing Strategy

### Backend Testing
```bash
npm install --save-dev jest supertest

# Create test file: backend/tests/auth.test.js
```

### Frontend Testing
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Create test file: frontend/src/components/__tests__/Login.test.js
```

---

## 📝 Summary & Next Steps

### Development Timeline (Estimated: 8-10 weeks)

1. **Weeks 1-2**: Setup & Authentication
2. **Weeks 3-4**: Interview Feature (Backend)
3. **Weeks 5-6**: Interview Feature (Frontend) + Voice
4. **Week 7**: Flashcards & Competition
5. **Week 8**: Ranking & Polish
6. **Weeks 9-10**: Testing & Deployment

### Key Learning Resources

- **MERN Stack**: freeCodeCamp, Traversy Media (YouTube)
- **React**: Official React Docs (https://react.dev)
- **Node.js**: Node.js Official Guide
- **MongoDB**: MongoDB University (free courses)
- **AI Integration**: OpenAI Documentation
- **Speech APIs**: Google Cloud Docs

### Important Tips

1. **Start Small**: Build MVP first (login + basic interview)
2. **Test Continuously**: Don't wait until the end
3. **Use Git**: Commit frequently with clear messages
4. **Ask for Help**: Stack Overflow, Discord communities
5. **Stay Organized**: Follow the folder structure strictly

### Common Pitfalls to Avoid

- ❌ Don't store API keys in code (use .env)
- ❌ Don't skip error handling
- ❌ Don't neglect security (CORS, validation, sanitization)
- ❌ Don't optimize too early (make it work first)
- ❌ Don't forget to handle loading states

---

## 🎓 Conclusion

This is an ambitious project that combines multiple technologies. Take it step by step, following the phases outlined. Each phase builds on the previous one. Don't rush - understanding is more important than speed.

**Good luck with your development! 🚀**

