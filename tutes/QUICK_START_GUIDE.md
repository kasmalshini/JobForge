# 🚀 Quick Start Guide

Get your AI Interview Coach application running in 30 minutes!

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js installed (v18+): `node --version`
- ✅ npm installed: `npm --version`
- ✅ MongoDB installed OR MongoDB Atlas account
- ✅ OpenAI API key (sign up at https://platform.openai.com/)

## Step 1: Create Project Structure (5 minutes)

```bash
# Create main project directory
mkdir ai-interview-coach
cd ai-interview-coach

# Create backend and frontend folders
mkdir backend frontend

# Initialize Git
git init
```

## Step 2: Setup Backend (10 minutes)

```bash
# Navigate to backend
cd backend

# Initialize Node.js project
npm init -y

# Install all dependencies in one go
npm install express mongoose dotenv cors jsonwebtoken bcryptjs multer axios openai socket.io

# Install dev dependencies
npm install nodemon --save-dev

# Create folder structure
mkdir -p src/config src/controllers src/models src/routes src/middleware src/services src/utils
```

### Create Basic Files

**Create `backend/src/server.js`:**
```bash
# Create the main server file (you'll paste the code from documentation)
touch src/server.js
```

**Create `backend/.env`:**
```bash
# Copy the example env file
touch .env
```

Paste this into `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-interview-coach
JWT_SECRET=my_super_secret_key_12345
OPENAI_API_KEY=your_openai_key_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Update `backend/package.json` scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

## Step 3: Setup Frontend (10 minutes)

```bash
# Go back to main directory
cd ..

# Navigate to frontend
cd frontend

# Create React app
npx create-react-app .

# Install dependencies
npm install react-router-dom axios tailwindcss postcss autoprefixer framer-motion

# Initialize Tailwind
npx tailwindcss init -p
```

**Create `frontend/.env`:**
```bash
touch .env
```

Paste this:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Update `frontend/tailwind.config.js`:**
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

**Update `frontend/src/index.css`:**
Add to the top:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 4: Start Development Servers (5 minutes)

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

You should see: "Server running on port 5000"

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

Browser should open automatically to http://localhost:3000

### Terminal 3 - MongoDB (if running locally):
```bash
mongod
```

## Step 5: Test the Setup

1. **Backend Health Check:**
   - Open http://localhost:5000 in browser
   - You should see: `{"message": "AI Interview Coach API"}`

2. **Frontend Check:**
   - Open http://localhost:3000
   - You should see the React default page

## 🎉 Success!

Your development environment is now ready! 

## Next Steps

Now follow the [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) to build features step by step.

Start with:
1. ✅ Setup complete (you just did this!)
2. 📝 Create database connection file
3. 🔐 Build authentication system
4. 🎤 Build interview features

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Solution:**
```bash
# If using MongoDB Atlas
1. Replace MONGODB_URI in .env with your Atlas connection string
2. Whitelist your IP address in Atlas dashboard
3. Check username and password are correct

# If using local MongoDB
1. Make sure MongoDB is running: `mongod`
2. Check if port 27017 is available
```

### Issue: Port 5000 Already in Use

**Solution:**
```bash
# Change PORT in backend/.env to a different number
PORT=5001
```

### Issue: CORS Error

**Solution:**
```bash
# Make sure CLIENT_URL in backend/.env matches your frontend URL
CLIENT_URL=http://localhost:3000
```

### Issue: OpenAI API Key Invalid

**Solution:**
```bash
# Get your API key from: https://platform.openai.com/api-keys
# Make sure you have credits in your OpenAI account
# Update OPENAI_API_KEY in backend/.env
```

## Useful Commands

```bash
# Stop servers: Press Ctrl+C in terminal

# Clear npm cache (if installation fails)
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for updates
npm outdated

# View running processes on port
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

## Development Tips

1. **Keep Both Terminals Open**: You need backend and frontend running simultaneously

2. **Use Postman**: Download Postman to test your API endpoints

3. **Browser DevTools**: Open Chrome DevTools (F12) to see console errors

4. **VS Code Extensions**: Install these helpful extensions:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - MongoDB for VS Code
   - Thunder Client (Postman alternative)

5. **Git Commits**: Commit your code frequently
   ```bash
   git add .
   git commit -m "Setup complete"
   ```

## Resources

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Need Help?

- Check [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for detailed guides
- Use [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md) to track progress
- Search Stack Overflow for specific errors
- Ask in developer communities (Reddit, Discord)

---

**Happy Coding! 💻✨**

