# AI Personal Interview Coach 🎤

An intelligent interview coaching platform powered by AI that helps users practice interviews, receive real-time feedback, and compete with others.

## ✨ Key Features

- 🎭 **AI Avatar Interviewer** - Interactive interview sessions with an AI-powered avatar
- 🎙️ **Voice Recognition** - Answer questions using your voice
- 📊 **Smart Analysis** - Get feedback on clarity, confidence, and applicability
- 🃏 **Flashcards** - Practice with entertaining flashcards
- 🏆 **Competition Mode** - Compete with up to 4 users simultaneously
- 📈 **Rankings & Leaderboard** - Track your progress and compete globally

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- OpenAI API Key
- Google Cloud Speech API Key (optional)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai-interview-coach
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm start
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Documentation

For complete development guide, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router
- Web Audio API

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API
- Google Speech-to-Text

## 📂 Project Structure

```
ai-interview-coach/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
GOOGLE_SPEECH_API_KEY=your_google_key
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend (Heroku)
```bash
heroku create ai-interview-coach-api
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
vercel
```

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please open an issue or contact the development team.

## 🎯 Roadmap

- [ ] Phase 1: Authentication System
- [ ] Phase 2: Basic Interview Feature
- [ ] Phase 3: Voice Integration
- [ ] Phase 4: AI Analysis
- [ ] Phase 5: Flashcards
- [ ] Phase 6: Competition Mode
- [ ] Phase 7: Rankings & Leaderboard
- [ ] Phase 8: Mobile App (Future)

## 👨‍💻 Development Team

Built with ❤️ by [Your Team Name]

---

**Note**: This is a learning project. Some features may be under development.

