const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const socketService = require('./services/socketService');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, openaiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'ASSEMBLYAI_API_KEY',
];

const optionalEnvVars = [
  'GMAIL_EMAIL',
  'GMAIL_PASSWORD',
];

const missingRequiredVars = requiredEnvVars.filter(varName => !process.env[varName]);
const missingOptionalVars = optionalEnvVars.filter(varName => !process.env[varName]);

if (missingRequiredVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingRequiredVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  process.exit(1);
}

if (missingOptionalVars.length > 0) {
  console.warn('⚠️  Missing optional environment variables (email features will be disabled):');
  missingOptionalVars.forEach(varName => {
    console.warn(`   - ${varName}`);
  });
}

console.log('✓ All required environment variables are configured');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Initialize socket service
socketService(io);

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/flashcards', require('./routes/flashcardRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/rankings', require('./routes/rankingRoutes'));
app.use('/api/speech', require('./routes/speechRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




