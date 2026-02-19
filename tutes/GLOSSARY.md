# 📖 Technical Glossary

A comprehensive guide to all technical terms used in this project.

---

## A

### **API (Application Programming Interface)**
A set of rules that allows different software applications to communicate with each other. Example: OpenAI API lets you access GPT models.

### **Async/Await**
JavaScript keywords for handling asynchronous operations. Makes code easier to read than callbacks or promises alone.
```javascript
async function getData() {
  const result = await fetch('api/data');
  return result;
}
```

### **Authentication**
The process of verifying who a user is (usually via login). Different from **Authorization** (what they can access).

### **Avatar**
A visual representation of a user or character. In this app, the AI interviewer's image/animation.

### **Axios**
A JavaScript library for making HTTP requests. Easier to use than the built-in `fetch()`.

---

## B

### **Backend**
The server-side part of an application that handles logic, databases, and APIs. Users don't see it directly.

### **bcrypt**
A library for hashing passwords. Makes passwords secure by converting them to random strings.

### **Blob (Binary Large Object)**
A data type representing raw data (like audio files). Used for handling media in the browser.

### **Bootstrap / Tailwind CSS**
CSS frameworks that provide pre-built styles and components to make styling easier.

---

## C

### **CORS (Cross-Origin Resource Sharing)**
A security feature that controls which websites can access your API. Common error when frontend and backend are on different domains.

### **CRUD (Create, Read, Update, Delete)**
The four basic operations for managing data in a database.

### **Component (React)**
A reusable piece of UI. Example: A button, a form, a navbar. React apps are built from components.

### **Context API (React)**
A way to share state across multiple components without passing props down manually.

### **Controller**
A function that handles requests to specific routes. Contains the business logic.
```javascript
exports.login = async (req, res) => {
  // Controller logic here
}
```

---

## D

### **Database**
A structured system for storing data. MongoDB is a NoSQL database.

### **Deployment**
The process of making your application available on the internet (production).

### **Destructuring**
ES6 syntax for extracting values from objects or arrays.
```javascript
const { name, age } = user;
const [first, second] = array;
```

### **dotenv**
A library that loads environment variables from a `.env` file.

---

## E

### **Environment Variables**
Configuration values stored outside your code (like API keys, database URLs). Kept in `.env` files.

### **Express.js**
A minimal Node.js web framework for building APIs and web servers.

### **ES6+ (ECMAScript 2015+)**
Modern JavaScript features: arrow functions, template literals, destructuring, async/await, etc.

### **Endpoint**
A specific URL on your API where requests are sent. Example: `/api/auth/login`

---

## F

### **Frontend**
The client-side part of an application that users interact with (UI). Built with React in this project.

### **Fetch API**
Built-in JavaScript method for making HTTP requests. Alternative to Axios.

### **Framer Motion**
A React library for creating animations and transitions.

---

## G

### **Git**
A version control system for tracking code changes and collaborating with others.

### **GitHub**
A platform for hosting Git repositories online. Allows for collaboration and code sharing.

### **GPT (Generative Pre-trained Transformer)**
OpenAI's AI model for generating text. Used in this project for questions and analysis.

---

## H

### **Hook (React)**
Special functions that let you use state and other React features in functional components. Examples: `useState`, `useEffect`, `useContext`.

### **HTTP Methods**
- **GET**: Retrieve data
- **POST**: Create new data
- **PUT/PATCH**: Update existing data
- **DELETE**: Remove data

### **Heroku**
A cloud platform for deploying web applications. Popular for Node.js apps.

---

## I

### **IDE (Integrated Development Environment)**
Software for writing code. Examples: VS Code, WebStorm, Sublime Text.

---

## J

### **JSON (JavaScript Object Notation)**
A format for structuring data. Looks like JavaScript objects.
```json
{
  "name": "John",
  "age": 30
}
```

### **JSX (JavaScript XML)**
Syntax extension for React that looks like HTML but is JavaScript.
```jsx
const element = <h1>Hello, World!</h1>;
```

### **JWT (JSON Web Token)**
A compact way to securely transmit information between parties. Used for authentication.
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## L

### **Localhost**
Your own computer acting as a server. Access via `http://localhost:PORT`

### **Loading State**
A UI state showing that data is being fetched. Usually displays a spinner or skeleton.

---

## M

### **MERN Stack**
MongoDB, Express.js, React, Node.js - the technologies used in this project.

### **Middleware**
Functions that run between receiving a request and sending a response. Used for authentication, logging, etc.
```javascript
app.use(authMiddleware);
```

### **MongoDB**
A NoSQL database that stores data in flexible, JSON-like documents.

### **Mongoose**
An ODM (Object Data Modeling) library for MongoDB. Makes working with MongoDB easier.

### **Multer**
Node.js middleware for handling file uploads.

---

## N

### **NLP (Natural Language Processing)**
AI technology for understanding and analyzing human language. Used to analyze interview answers.

### **Node.js**
JavaScript runtime that lets you run JavaScript on the server (outside the browser).

### **npm (Node Package Manager)**
Tool for installing and managing JavaScript packages/libraries.

### **NoSQL**
A type of database that doesn't use tables (like MongoDB). More flexible than SQL databases.

---

## O

### **OAuth**
An authentication protocol. Example: "Sign in with Google" buttons.

### **ODM (Object Data Modeling)**
A library that maps JavaScript objects to database documents. Mongoose is an ODM for MongoDB.

### **OpenAI**
An AI research company. Provides GPT models via API.

---

## P

### **Package.json**
A file listing your project's dependencies and scripts. Every Node.js project has one.

### **Props (React)**
Data passed from parent component to child component.
```jsx
<Button text="Click me" color="blue" />
```

### **Promise**
JavaScript object representing the eventual completion (or failure) of an asynchronous operation.

### **PostCSS**
A tool for transforming CSS. Required for Tailwind CSS.

### **Postman**
A tool for testing APIs by sending requests and viewing responses.

---

## R

### **React**
A JavaScript library for building user interfaces with components.

### **React Router**
A library for handling navigation in React apps.

### **REST API (Representational State Transfer)**
An architectural style for designing APIs. Uses HTTP methods (GET, POST, PUT, DELETE).

### **Redis**
An in-memory data store used for caching and sessions. Optional for this project.

---

## S

### **Schema**
The structure/blueprint of data in a database. Defines what fields exist and their types.
```javascript
{
  username: String,
  email: String,
  age: Number
}
```

### **Socket.io**
A library for real-time, bidirectional communication between client and server. Used for competition mode.

### **Speech-to-Text (STT)**
Technology that converts spoken words into written text. Google Cloud Speech API provides this.

### **State (React)**
Data that changes over time in a component. Managed with `useState` hook.
```javascript
const [count, setCount] = useState(0);
```

### **SSL/TLS (HTTPS)**
Security protocols for encrypting data sent over the internet. Production apps should use HTTPS.

---

## T

### **Tailwind CSS**
A utility-first CSS framework. Provides classes like `bg-blue-500`, `text-center`, etc.

### **Token**
A string used for authentication. JWT tokens prove you're logged in.

### **Try-Catch**
Error handling in JavaScript.
```javascript
try {
  // Code that might fail
} catch (error) {
  // Handle the error
}
```

---

## U

### **UI (User Interface)**
The visual part of an application that users interact with.

### **UX (User Experience)**
How easy and pleasant it is to use an application.

### **URL (Uniform Resource Locator)**
The address of a resource on the internet. Example: `https://api.example.com/users`

---

## V

### **Vercel**
A cloud platform for deploying frontend applications. Great for React apps.

### **Virtual DOM**
React's optimization technique. It updates only changed parts of the page, not the entire page.

---

## W

### **Web Audio API**
Browser API for recording and processing audio. Used for voice recording.

### **WebSocket**
A protocol for real-time communication. Socket.io is built on top of WebSockets.

### **Webhook**
A way for apps to send automated messages when something happens. Example: "User signed up" notification.

---

## Common Acronyms

| Acronym | Full Form | Meaning |
|---------|-----------|---------|
| **API** | Application Programming Interface | Way for apps to communicate |
| **CRUD** | Create, Read, Update, Delete | Basic database operations |
| **CORS** | Cross-Origin Resource Sharing | Security feature for APIs |
| **JWT** | JSON Web Token | Authentication token format |
| **NLP** | Natural Language Processing | AI for understanding language |
| **ODM** | Object Data Modeling | Maps objects to database |
| **REST** | Representational State Transfer | API design style |
| **STT** | Speech-to-Text | Converts speech to text |
| **UI** | User Interface | What users see and interact with |
| **UX** | User Experience | How users feel using the app |

---

## Common Commands

### npm Commands
```bash
npm init              # Create package.json
npm install          # Install all dependencies
npm install <package> # Install specific package
npm start            # Run the application
npm run dev          # Run in development mode
npm test             # Run tests
npm run build        # Build for production
```

### Git Commands
```bash
git init             # Initialize Git repository
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to remote repository
git pull             # Pull from remote repository
git status           # Check status
git log              # View commit history
```

### MongoDB Commands
```bash
mongod               # Start MongoDB server
mongo                # Open MongoDB shell
show dbs             # List databases
use <dbname>         # Switch to database
show collections     # List collections
db.users.find()      # Query users collection
```

---

## Code Syntax Examples

### JavaScript ES6+

**Arrow Function:**
```javascript
const add = (a, b) => a + b;
```

**Template Literals:**
```javascript
const greeting = `Hello, ${name}!`;
```

**Destructuring:**
```javascript
const { name, age } = user;
const [first, second] = array;
```

**Spread Operator:**
```javascript
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newKey: value };
```

**Async/Await:**
```javascript
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

### React Syntax

**Component:**
```javascript
function MyComponent() {
  return <div>Hello</div>;
}
```

**useState:**
```javascript
const [count, setCount] = useState(0);
```

**useEffect:**
```javascript
useEffect(() => {
  // Code runs on mount and when dependencies change
}, [dependencies]);
```

**Props:**
```javascript
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}
```

### Express Syntax

**Basic Route:**
```javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
```

**Middleware:**
```javascript
app.use(express.json());
app.use(authMiddleware);
```

### MongoDB/Mongoose Syntax

**Schema:**
```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true }
});
```

**Query:**
```javascript
const users = await User.find({ age: { $gt: 18 } });
const user = await User.findById(id);
await user.save();
await User.deleteOne({ _id: id });
```

---

## File Extensions

| Extension | Type | Example |
|-----------|------|---------|
| `.js` | JavaScript | `app.js`, `utils.js` |
| `.jsx` | React JavaScript | `Button.jsx` |
| `.json` | JSON data | `package.json` |
| `.css` | Stylesheet | `styles.css` |
| `.env` | Environment variables | `.env` |
| `.md` | Markdown (documentation) | `README.md` |
| `.gitignore` | Git ignore rules | `.gitignore` |

---

## HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| **200** | OK | Successful GET request |
| **201** | Created | Successful POST (created new resource) |
| **400** | Bad Request | Invalid user input |
| **401** | Unauthorized | Not logged in or invalid token |
| **403** | Forbidden | Logged in but no permission |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Something broke on the server |

---

## Common Patterns

### Request-Response Cycle
```
User → Frontend → API Call → Backend → Database
                                  ↓
User ← Frontend ← Response ← Backend ← Database
```

### React Data Flow
```
Parent Component
    ↓ (props)
Child Component
    ↑ (callbacks)
Parent Component
```

### Authentication Flow
```
1. User enters credentials
2. Backend verifies credentials
3. Backend generates JWT token
4. Frontend stores token
5. Frontend sends token with each request
6. Backend verifies token
7. Backend sends protected data
```

---

## Useful Resources

- **MDN Web Docs**: https://developer.mozilla.org/
- **React Docs**: https://react.dev/
- **Node.js Docs**: https://nodejs.org/docs/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **Stack Overflow**: https://stackoverflow.com/

---

## Quick Tips

💡 **When you see unfamiliar code**, search: "what is [term] in JavaScript/React"

💡 **When you get an error**, copy the error message and search it

💡 **When learning a new concept**, build a small project using it

💡 **When stuck**, check:
1. Console for errors
2. Network tab for API calls
3. Database for data
4. Documentation

---

**Remember**: You don't need to memorize everything! This glossary is a reference. Look things up as you need them.

**Happy Learning! 📚✨**

---

*Last Updated: October 2025*

