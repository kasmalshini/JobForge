# 📁 Complete Project Structure

This document shows the complete file and folder structure for the AI Interview Coach application.

## 🌳 Full Project Tree

```
ai-interview-coach/
│
├── backend/                                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                         # Configuration files
│   │   │   ├── database.js                # MongoDB connection
│   │   │   ├── cloudinary.js              # Media storage config
│   │   │   └── redis.js                   # Cache config (optional)
│   │   │
│   │   ├── controllers/                    # Request handlers
│   │   │   ├── auth.controller.js         # Authentication logic
│   │   │   ├── interview.controller.js    # Interview operations
│   │   │   ├── flashcard.controller.js    # Flashcard operations
│   │   │   ├── competition.controller.js  # Competition logic
│   │   │   └── ranking.controller.js      # Leaderboard & rankings
│   │   │
│   │   ├── models/                         # Database schemas
│   │   │   ├── User.model.js              # User schema
│   │   │   ├── Interview.model.js         # Interview schema
│   │   │   ├── Flashcard.model.js         # Flashcard schema
│   │   │   ├── Competition.model.js       # Competition schema
│   │   │   └── Question.model.js          # Question bank schema
│   │   │
│   │   ├── routes/                         # API routes
│   │   │   ├── auth.routes.js             # /api/auth routes
│   │   │   ├── interview.routes.js        # /api/interview routes
│   │   │   ├── flashcard.routes.js        # /api/flashcards routes
│   │   │   ├── competition.routes.js      # /api/competition routes
│   │   │   └── ranking.routes.js          # /api/rankings routes
│   │   │
│   │   ├── middleware/                     # Custom middleware
│   │   │   ├── auth.middleware.js         # JWT verification
│   │   │   ├── upload.middleware.js       # File upload (multer)
│   │   │   ├── validation.middleware.js   # Input validation
│   │   │   ├── errorHandler.middleware.js # Global error handler
│   │   │   └── rateLimiter.middleware.js  # Rate limiting
│   │   │
│   │   ├── services/                       # Business logic & external APIs
│   │   │   ├── ai.service.js              # OpenAI integration
│   │   │   ├── speech.service.js          # Speech-to-Text
│   │   │   ├── nlp.service.js             # NLP analysis
│   │   │   └── email.service.js           # Email notifications (optional)
│   │   │
│   │   ├── utils/                          # Helper functions
│   │   │   ├── logger.js                  # Logging utility
│   │   │   ├── validators.js              # Input validators
│   │   │   ├── tokenGenerator.js          # JWT helpers
│   │   │   └── constants.js               # App constants
│   │   │
│   │   ├── sockets/                        # Socket.io handlers
│   │   │   ├── competition.socket.js      # Competition events
│   │   │   └── index.js                   # Socket setup
│   │   │
│   │   └── server.js                       # Main application entry
│   │
│   ├── uploads/                            # Temporary file storage
│   │   └── audio/                         # Voice recordings
│   │
│   ├── tests/                              # Test files
│   │   ├── auth.test.js
│   │   ├── interview.test.js
│   │   └── ...
│   │
│   ├── .env                                # Environment variables
│   ├── .env.example                        # Environment template
│   ├── .gitignore                          # Git ignore rules
│   ├── package.json                        # Dependencies & scripts
│   ├── package-lock.json                   # Lock file
│   └── README.md                           # Backend documentation
│
│
├── frontend/                               # Frontend (React)
│   ├── public/
│   │   ├── index.html                     # Main HTML file
│   │   ├── favicon.ico                    # App icon
│   │   ├── manifest.json                  # PWA manifest
│   │   └── assets/                        # Static assets
│   │       ├── images/
│   │       │   ├── logo.png
│   │       │   ├── avatar-default.png
│   │       │   └── background.jpg
│   │       └── sounds/
│   │           ├── notification.mp3
│   │           └── success.mp3
│   │
│   ├── src/
│   │   ├── components/                     # React components
│   │   │   │
│   │   │   ├── Auth/                      # Authentication components
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   ├── ForgotPassword.js
│   │   │   │   └── PrivateRoute.js
│   │   │   │
│   │   │   ├── Interview/                 # Interview components
│   │   │   │   ├── InterviewScreen.js     # Main interview UI
│   │   │   │   ├── Avatar.js              # AI interviewer avatar
│   │   │   │   ├── QuestionBubble.js      # Question display
│   │   │   │   ├── RecordButton.js        # Voice recording button
│   │   │   │   ├── AnalysisDisplay.js     # Score/feedback display
│   │   │   │   └── InterviewHistory.js    # Past interviews
│   │   │   │
│   │   │   ├── Flashcards/                # Flashcard components
│   │   │   │   ├── FlashcardList.js       # List of flashcards
│   │   │   │   ├── FlashCard.js           # Single card (flip animation)
│   │   │   │   ├── FlashcardFilters.js    # Category/difficulty filters
│   │   │   │   └── FlashcardGame.js       # Gamified mode
│   │   │   │
│   │   │   ├── Competition/               # Competition components
│   │   │   │   ├── CompetitionLobby.js    # Waiting room
│   │   │   │   ├── LiveCompetition.js     # Active competition
│   │   │   │   ├── ParticipantCard.js     # User in competition
│   │   │   │   ├── CompetitionResults.js  # Final results
│   │   │   │   └── Scoreboard.js          # Real-time scores
│   │   │   │
│   │   │   ├── Dashboard/                 # Dashboard components
│   │   │   │   ├── Dashboard.js           # Main dashboard
│   │   │   │   ├── StatsCard.js           # Statistics card
│   │   │   │   ├── ProgressChart.js       # Progress visualization
│   │   │   │   └── RecentActivity.js      # Activity feed
│   │   │   │
│   │   │   ├── Leaderboard/               # Ranking components
│   │   │   │   ├── Leaderboard.js         # Main leaderboard
│   │   │   │   ├── RankCard.js            # User rank display
│   │   │   │   └── UserSearch.js          # Search users
│   │   │   │
│   │   │   ├── Profile/                   # User profile
│   │   │   │   ├── Profile.js             # Profile page
│   │   │   │   ├── EditProfile.js         # Edit profile
│   │   │   │   └── AvatarUpload.js        # Avatar upload
│   │   │   │
│   │   │   ├── Common/                    # Shared components
│   │   │   │   ├── Navbar.js              # Navigation bar
│   │   │   │   ├── Sidebar.js             # Sidebar menu
│   │   │   │   ├── Footer.js              # Footer
│   │   │   │   ├── Button.js              # Custom button
│   │   │   │   ├── Modal.js               # Modal popup
│   │   │   │   ├── Loader.js              # Loading spinner
│   │   │   │   ├── Toast.js               # Notification toast
│   │   │   │   └── ProgressBar.js         # Progress indicator
│   │   │   │
│   │   │   └── Layout/                    # Layout components
│   │   │       ├── MainLayout.js          # Main app layout
│   │   │       ├── AuthLayout.js          # Auth pages layout
│   │   │       └── EmptyLayout.js         # Minimal layout
│   │   │
│   │   ├── pages/                          # Page components
│   │   │   ├── HomePage.js                # Landing page
│   │   │   ├── LoginPage.js               # Login page
│   │   │   ├── RegisterPage.js            # Register page
│   │   │   ├── DashboardPage.js           # Dashboard page
│   │   │   ├── InterviewPage.js           # Interview page
│   │   │   ├── FlashcardsPage.js          # Flashcards page
│   │   │   ├── CompetitionPage.js         # Competition page
│   │   │   ├── LeaderboardPage.js         # Leaderboard page
│   │   │   ├── ProfilePage.js             # Profile page
│   │   │   └── NotFoundPage.js            # 404 page
│   │   │
│   │   ├── context/                        # React Context
│   │   │   ├── AuthContext.js             # Authentication state
│   │   │   ├── InterviewContext.js        # Interview state
│   │   │   ├── CompetitionContext.js      # Competition state
│   │   │   ├── SocketContext.js           # Socket.io connection
│   │   │   └── ThemeContext.js            # Theme (light/dark)
│   │   │
│   │   ├── hooks/                          # Custom React hooks
│   │   │   ├── useAuth.js                 # Authentication hook
│   │   │   ├── useVoiceRecorder.js        # Voice recording hook
│   │   │   ├── useSocket.js               # Socket.io hook
│   │   │   ├── useDebounce.js             # Debounce hook
│   │   │   └── useLocalStorage.js         # LocalStorage hook
│   │   │
│   │   ├── services/                       # API service layer
│   │   │   ├── api.js                     # Axios instance
│   │   │   ├── authService.js             # Auth API calls
│   │   │   ├── interviewService.js        # Interview API calls
│   │   │   ├── flashcardService.js        # Flashcard API calls
│   │   │   ├── competitionService.js      # Competition API calls
│   │   │   └── rankingService.js          # Ranking API calls
│   │   │
│   │   ├── utils/                          # Helper functions
│   │   │   ├── formatters.js              # Data formatters
│   │   │   ├── validators.js              # Form validators
│   │   │   ├── constants.js               # Constants
│   │   │   └── helpers.js                 # General helpers
│   │   │
│   │   ├── styles/                         # Global styles
│   │   │   ├── index.css                  # Main CSS (Tailwind)
│   │   │   ├── animations.css             # Custom animations
│   │   │   └── variables.css              # CSS variables
│   │   │
│   │   ├── App.js                          # Main App component
│   │   ├── App.test.js                     # App tests
│   │   ├── index.js                        # Entry point
│   │   └── reportWebVitals.js              # Performance metrics
│   │
│   ├── .env                                # Environment variables
│   ├── .env.example                        # Environment template
│   ├── .gitignore                          # Git ignore rules
│   ├── package.json                        # Dependencies & scripts
│   ├── package-lock.json                   # Lock file
│   ├── tailwind.config.js                  # Tailwind configuration
│   ├── postcss.config.js                   # PostCSS configuration
│   └── README.md                           # Frontend documentation
│
│
├── docs/                                   # Additional documentation
│   ├── api-documentation.md               # API endpoints reference
│   ├── database-schema.md                 # Database design
│   ├── architecture.md                    # System architecture
│   └── deployment.md                      # Deployment guide
│
├── .gitignore                              # Root gitignore
├── README.md                               # Main project README
├── PROJECT_DOCUMENTATION.md                # Complete development guide
├── DEVELOPMENT_CHECKLIST.md                # Step-by-step checklist
├── QUICK_START_GUIDE.md                    # Quick setup guide
├── LEARNING_ROADMAP.md                     # Learning path
└── LICENSE                                 # License file

```

---

## 📝 File Descriptions

### Backend Key Files

#### **server.js**
Main entry point for the backend. Initializes Express, connects to MongoDB, sets up middleware, and starts the server.

#### **config/database.js**
Handles MongoDB connection using Mongoose.

#### **models/*.model.js**
Mongoose schemas defining the structure of database documents (Users, Interviews, etc.).

#### **controllers/*.controller.js**
Handle business logic for each feature. Process requests, interact with models, and send responses.

#### **routes/*.routes.js**
Define API endpoints and connect them to controller functions.

#### **middleware/auth.middleware.js**
Verifies JWT tokens and protects routes requiring authentication.

#### **services/ai.service.js**
Integrates with OpenAI API for question generation and answer analysis.

#### **services/speech.service.js**
Integrates with Speech-to-Text APIs for voice transcription.

---

### Frontend Key Files

#### **App.js**
Main component that sets up routing and wraps the app with context providers.

#### **index.js**
Entry point that renders the React app to the DOM.

#### **components/Interview/InterviewScreen.js**
Main interview interface where users answer questions.

#### **hooks/useVoiceRecorder.js**
Custom hook for recording audio using Web Audio API.

#### **context/AuthContext.js**
Manages authentication state across the application.

#### **services/api.js**
Axios instance with base configuration for API calls.

---

## 🎯 File Creation Order

### Phase 1: Foundation

```bash
1. backend/src/server.js
2. backend/src/config/database.js
3. backend/.env
4. frontend/src/App.js
5. frontend/.env
```

### Phase 2: Authentication

```bash
6. backend/src/models/User.model.js
7. backend/src/controllers/auth.controller.js
8. backend/src/middleware/auth.middleware.js
9. backend/src/routes/auth.routes.js
10. frontend/src/context/AuthContext.js
11. frontend/src/components/Auth/Login.js
12. frontend/src/components/Auth/Register.js
```

### Phase 3: Interview Feature

```bash
13. backend/src/models/Interview.model.js
14. backend/src/services/ai.service.js
15. backend/src/services/speech.service.js
16. backend/src/controllers/interview.controller.js
17. backend/src/routes/interview.routes.js
18. frontend/src/hooks/useVoiceRecorder.js
19. frontend/src/components/Interview/InterviewScreen.js
20. frontend/src/components/Interview/Avatar.js
21. frontend/src/components/Interview/QuestionBubble.js
```

### Phase 4: Additional Features

```bash
22. backend/src/models/Flashcard.model.js
23. backend/src/models/Competition.model.js
24. backend/src/controllers/flashcard.controller.js
25. backend/src/controllers/competition.controller.js
26. frontend/src/components/Flashcards/FlashCard.js
27. frontend/src/components/Competition/CompetitionLobby.js
```

---

## 🔑 Key Patterns

### Backend Pattern
```
Request → Route → Controller → Service → Model → Database
                           ↓
Response ← Controller ← Service ← Model ← Database
```

### Frontend Pattern
```
User Interaction → Component → Service/Hook → API Call → Backend
                                    ↓
UI Update ← Component ← Context/State ← Response ← Backend
```

---

## 📦 Important Files to Create First

### Must Create Before Coding

1. **backend/.env** - Environment variables
2. **frontend/.env** - Frontend environment variables
3. **backend/src/server.js** - Server entry point
4. **backend/src/config/database.js** - Database connection
5. **frontend/src/App.js** - Main React component

### Must Create for Authentication

6. **backend/src/models/User.model.js**
7. **backend/src/middleware/auth.middleware.js**
8. **frontend/src/context/AuthContext.js**

### Must Create for Interview Feature

9. **backend/src/services/ai.service.js**
10. **frontend/src/hooks/useVoiceRecorder.js**

---

## 🚫 .gitignore Examples

### Backend .gitignore
```
node_modules/
.env
uploads/
*.log
.DS_Store
```

### Frontend .gitignore
```
node_modules/
build/
.env
.env.local
.DS_Store
```

---

## 💡 Folder Naming Conventions

- **Lowercase** for folders: `components/`, `services/`, `utils/`
- **PascalCase** for component files: `Login.js`, `InterviewScreen.js`
- **camelCase** for utility files: `authService.js`, `validators.js`
- **kebab-case** for CSS files: `interview-screen.css`

---

## 📚 Additional Resources

- [README.md](./README.md) - Project overview
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - Complete guide
- [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) - Task tracker
- [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) - Setup instructions
- [LEARNING_ROADMAP.md](./LEARNING_ROADMAP.md) - Learning path

---

**Note**: This is the complete structure. You don't need to create all files at once. Follow the development checklist and create files as needed!

**Happy Coding! 🚀**

