const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flashcard = require('../models/Flashcard');

dotenv.config();

const flashcards = [
  // Interview Tips
  {
    category: 'interview-tips',
    question: 'What should you do before an interview?',
    answer: 'Research the company, review the job description, prepare questions to ask, practice common interview questions, and plan your route to arrive 10-15 minutes early.',
    difficulty: 'easy',
  },
  {
    category: 'interview-tips',
    question: 'How should you answer "Tell me about yourself"?',
    answer: 'Provide a brief overview of your professional background, highlight relevant experience and skills, and connect your story to the role you\'re applying for. Keep it concise (2-3 minutes).',
    difficulty: 'medium',
  },
  {
    category: 'interview-tips',
    question: 'What is the STAR method?',
    answer: 'STAR stands for Situation, Task, Action, Result. It\'s a structured approach to answering behavioral interview questions by describing a specific situation, the task you faced, actions you took, and the results you achieved.',
    difficulty: 'medium',
  },
  {
    category: 'interview-tips',
    question: 'How do you handle salary negotiations?',
    answer: 'Research market rates, wait for the employer to make the first offer, be prepared to justify your requested salary, consider the entire compensation package, and maintain a professional, collaborative tone.',
    difficulty: 'hard',
  },
  {
    category: 'interview-tips',
    question: 'What questions should you ask the interviewer?',
    answer: 'Ask about company culture, team dynamics, growth opportunities, challenges the team faces, expectations for the role, and what success looks like in the position.',
    difficulty: 'easy',
  },
  
  // Software Development Questions
  {
    category: 'software-development',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: 'var is function-scoped and can be redeclared. let is block-scoped and can be reassigned but not redeclared. const is block-scoped and cannot be reassigned or redeclared. Both let and const are hoisted but not initialized (temporal dead zone).',
    difficulty: 'medium',
  },
  {
    category: 'software-development',
    question: 'Explain the concept of closures in JavaScript.',
    answer: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. Closures are created every time a function is created, at function creation time.',
    difficulty: 'hard',
  },
  {
    category: 'software-development',
    question: 'What is REST API?',
    answer: 'REST (Representational State Transfer) is an architectural style for designing networked applications. REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs. They are stateless and return data in JSON or XML format.',
    difficulty: 'medium',
  },
  {
    category: 'software-development',
    question: 'What is the difference between SQL and NoSQL databases?',
    answer: 'SQL databases are relational, use structured schemas, support ACID properties, and are best for complex queries. NoSQL databases are non-relational, use flexible schemas, scale horizontally, and are best for large-scale data and rapid development.',
    difficulty: 'medium',
  },
  {
    category: 'software-development',
    question: 'Explain the MVC (Model-View-Controller) pattern.',
    answer: 'MVC separates application logic into three components: Model (data and business logic), View (user interface), and Controller (handles user input and coordinates Model and View). This separation improves maintainability and testability.',
    difficulty: 'medium',
  },
  {
    category: 'software-development',
    question: 'What is Git and how does it differ from GitHub?',
    answer: 'Git is a distributed version control system that tracks changes in files. GitHub is a cloud-based hosting service for Git repositories. Git is the tool, GitHub is a platform that uses Git for collaboration and code sharing.',
    difficulty: 'easy',
  },
  {
    category: 'software-development',
    question: 'What is async/await in JavaScript?',
    answer: 'async/await is syntactic sugar for Promises that makes asynchronous code look synchronous. The async keyword makes a function return a Promise, and await pauses execution until the Promise resolves, making code more readable than promise chains.',
    difficulty: 'medium',
  },
  {
    category: 'software-development',
    question: 'Explain the concept of dependency injection.',
    answer: 'Dependency injection is a design pattern where an object receives its dependencies from external sources rather than creating them internally. This improves testability, modularity, and makes code more maintainable by reducing coupling.',
    difficulty: 'hard',
  },
  {
    category: 'software-development',
    question: 'What is the difference between == and === in JavaScript?',
    answer: '== performs type coercion before comparison (converts types to match), while === performs strict equality check without type coercion. === is generally preferred as it\'s more predictable and prevents unexpected type conversions.',
    difficulty: 'easy',
  },
  {
    category: 'software-development',
    question: 'What is a microservices architecture?',
    answer: 'Microservices is an architectural approach where applications are built as a collection of small, independent services that communicate over well-defined APIs. Each service is deployable independently and focuses on a specific business capability.',
    difficulty: 'hard',
  },
];

const seedFlashcards = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing flashcards
    await Flashcard.deleteMany({});
    console.log('Cleared existing flashcards');

    // Insert new flashcards
    await Flashcard.insertMany(flashcards);
    console.log(`Seeded ${flashcards.length} flashcards`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding flashcards:', error);
    process.exit(1);
  }
};

seedFlashcards();





