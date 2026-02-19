// Interview Questions with Categories and Difficulty Levels

export const GENERAL_QUESTIONS = [
  {
    question: "Tell me about yourself.",
    category: "behavioral",
    difficulty: "beginner",
    relatedSkills: ["Agile", "Pair Programming", "Code Review"]
  },
  {
    question: "What are your greatest strengths?",
    category: "behavioral",
    difficulty: "beginner",
    relatedSkills: ["Code Review", "SOLID Principles"]
  },
  {
    question: "Why do you want to work here?",
    category: "motivation",
    difficulty: "beginner",
    relatedSkills: ["Agile", "Kanban"]
  },
  {
    question: "Where do you see yourself in 5 years?",
    category: "career-goals",
    difficulty: "beginner",
    relatedSkills: ["Design Patterns", "SOLID Principles"]
  },
  {
    question: "What is your biggest weakness?",
    category: "self-awareness",
    difficulty: "intermediate",
    relatedSkills: ["Agile", "Code Review"]
  },
  {
    question: "Tell me about a challenging project you worked on.",
    category: "behavioral",
    difficulty: "intermediate",
    relatedSkills: ["SOLID Principles", "Design Patterns", "Code Review"]
  },
  {
    question: "How do you handle stress and pressure?",
    category: "behavioral",
    difficulty: "intermediate",
    relatedSkills: ["Agile", "Pair Programming"]
  },
  {
    question: "Why should we hire you?",
    category: "motivation",
    difficulty: "intermediate",
    relatedSkills: ["Code Review", "Design Patterns"]
  },
  {
    question: "Describe a time you failed and what you learned from it.",
    category: "behavioral",
    difficulty: "advanced",
    relatedSkills: ["Test-Driven Development", "Code Review"]
  },
  {
    question: "How do you handle conflict with a coworker?",
    category: "behavioral",
    difficulty: "advanced",
    relatedSkills: ["Pair Programming", "Agile"]
  },
];

// Role-specific questions with categories and difficulty
export const ROLE_QUESTIONS = {
  "Software Developer": [
    {
      question: "Explain the difference between let, const, and var in JavaScript.",
      category: "javascript",
      difficulty: "beginner",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "What is the difference between SQL and NoSQL databases?",
      category: "databases",
      difficulty: "beginner",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL", "SQL"]
    },
    {
      question: "Explain the concept of closures in JavaScript.",
      category: "javascript",
      difficulty: "intermediate",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "What is REST API and how does it work?",
      category: "api",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "Express", "GraphQL"]
    },
    {
      question: "Describe the MVC (Model-View-Controller) pattern.",
      category: "architecture",
      difficulty: "intermediate",
      relatedSkills: ["Design Patterns", "SOLID Principles"]
    },
    {
      question: "What is Git and how does it differ from GitHub?",
      category: "version-control",
      difficulty: "beginner",
      relatedSkills: ["Git", "GitHub"]
    },
    {
      question: "Explain async/await in JavaScript.",
      category: "javascript",
      difficulty: "intermediate",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "What is dependency injection?",
      category: "architecture",
      difficulty: "intermediate",
      relatedSkills: ["Design Patterns", "SOLID Principles"]
    },
    {
      question: "What is a microservices architecture?",
      category: "architecture",
      difficulty: "advanced",
      relatedSkills: ["Docker", "Kubernetes"]
    },
    {
      question: "Explain the difference between == and === in JavaScript.",
      category: "javascript",
      difficulty: "beginner",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "What is the event loop in JavaScript?",
      category: "javascript",
      difficulty: "advanced",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "How do you optimize database queries?",
      category: "databases",
      difficulty: "intermediate",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL"]
    },
    {
      question: "Explain the concept of promises in JavaScript.",
      category: "javascript",
      difficulty: "intermediate",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "What is the difference between authentication and authorization?",
      category: "security",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "Express"]
    },
    {
      question: "How does React's virtual DOM work?",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "What are design patterns? Give examples.",
      category: "architecture",
      difficulty: "advanced",
      relatedSkills: ["Design Patterns", "SOLID Principles"]
    },
    {
      question: "How do you handle errors in your code?",
      category: "best-practices",
      difficulty: "intermediate",
      relatedSkills: ["Test-Driven Development", "Code Review"]
    },
    {
      question: "Explain the concept of API versioning.",
      category: "api",
      difficulty: "advanced",
      relatedSkills: ["Node.js", "Express", "GraphQL"]
    },
  ],
  "Frontend Developer": [
    {
      question: "Explain the difference between let, const, and var in JavaScript.",
      category: "javascript",
      difficulty: "beginner",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "How does React's virtual DOM work?",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "Explain the concept of state management in React.",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "What is the difference between state and props in React?",
      category: "react",
      difficulty: "beginner",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "How do you optimize React application performance?",
      category: "performance",
      difficulty: "intermediate",
      relatedSkills: ["React", "Webpack"]
    },
    {
      question: "Explain CSS Grid and Flexbox. When would you use each?",
      category: "css",
      difficulty: "intermediate",
      relatedSkills: ["HTML/CSS"]
    },
    {
      question: "What is the difference between client-side and server-side rendering?",
      category: "architecture",
      difficulty: "intermediate",
      relatedSkills: ["React", "Next.js"]
    },
    {
      question: "How do you handle responsive design?",
      category: "css",
      difficulty: "beginner",
      relatedSkills: ["HTML/CSS"]
    },
    {
      question: "Explain the concept of component lifecycle in React.",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "What are React Hooks? Give examples.",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "How do you manage global state in a React application?",
      category: "react",
      difficulty: "advanced",
      relatedSkills: ["React", "TypeScript"]
    },
    {
      question: "Explain the concept of virtual DOM and why it's beneficial.",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "What is the difference between controlled and uncontrolled components?",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "How do you handle forms in React?",
      category: "react",
      difficulty: "beginner",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "Explain CSS-in-JS and its advantages.",
      category: "css",
      difficulty: "intermediate",
      relatedSkills: ["React", "Material-UI"]
    },
    {
      question: "What is Webpack and why is it used?",
      category: "build-tools",
      difficulty: "intermediate",
      relatedSkills: ["Webpack", "Babel"]
    },
    {
      question: "How do you ensure accessibility in web applications?",
      category: "accessibility",
      difficulty: "intermediate",
      relatedSkills: ["HTML/CSS", "Material-UI"]
    },
    {
      question: "Explain the concept of progressive web apps (PWA).",
      category: "web-standards",
      difficulty: "advanced",
      relatedSkills: ["React", "Webpack"]
    },
  ],
  "Backend Developer": [
    {
      question: "What is the difference between SQL and NoSQL databases?",
      category: "databases",
      difficulty: "beginner",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL", "SQL"]
    },
    {
      question: "Explain REST API and how it works.",
      category: "api",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "Express", "GraphQL"]
    },
    {
      question: "What is the difference between authentication and authorization?",
      category: "security",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "Express"]
    },
    {
      question: "How do you optimize database queries?",
      category: "databases",
      difficulty: "intermediate",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL"]
    },
    {
      question: "Explain the concept of API versioning.",
      category: "api",
      difficulty: "advanced",
      relatedSkills: ["Express", "GraphQL"]
    },
    {
      question: "What is a microservices architecture?",
      category: "architecture",
      difficulty: "advanced",
      relatedSkills: ["Docker", "Kubernetes"]
    },
    {
      question: "Explain the concept of load balancing.",
      category: "infrastructure",
      difficulty: "intermediate",
      relatedSkills: ["Docker", "Kubernetes", "Linux"]
    },
    {
      question: "How do you handle database transactions?",
      category: "databases",
      difficulty: "intermediate",
      relatedSkills: ["PostgreSQL", "MySQL", "SQL"]
    },
    {
      question: "What is the difference between synchronous and asynchronous programming?",
      category: "programming-concepts",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "JavaScript"]
    },
    {
      question: "Explain the concept of caching and its benefits.",
      category: "performance",
      difficulty: "intermediate",
      relatedSkills: ["Redis", "MongoDB"]
    },
    {
      question: "How do you ensure API security?",
      category: "security",
      difficulty: "advanced",
      relatedSkills: ["Node.js", "Express", "GraphQL"]
    },
    {
      question: "What is the difference between PUT and PATCH HTTP methods?",
      category: "api",
      difficulty: "intermediate",
      relatedSkills: ["Express", "GraphQL"]
    },
    {
      question: "Explain the concept of database indexing.",
      category: "databases",
      difficulty: "intermediate",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL"]
    },
    {
      question: "How do you handle file uploads in a backend system?",
      category: "file-handling",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "Express"]
    },
    {
      question: "What is the difference between stateless and stateful APIs?",
      category: "api",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "GraphQL"]
    },
    {
      question: "Explain the concept of message queues.",
      category: "architecture",
      difficulty: "advanced",
      relatedSkills: ["Node.js", "Docker"]
    },
    {
      question: "How do you implement rate limiting?",
      category: "security",
      difficulty: "advanced",
      relatedSkills: ["Express", "Node.js"]
    },
    {
      question: "What is the difference between horizontal and vertical scaling?",
      category: "infrastructure",
      difficulty: "intermediate",
      relatedSkills: ["Kubernetes", "AWS"]
    },
  ],
  "Full Stack Developer": [
    {
      question: "Explain the difference between SQL and NoSQL databases.",
      category: "databases",
      difficulty: "beginner",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL", "SQL"]
    },
    {
      question: "How does React's virtual DOM work?",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "What is REST API and how does it work?",
      category: "api",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "Express", "GraphQL"]
    },
    {
      question: "Explain the concept of state management in React.",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "How do you optimize database queries?",
      category: "databases",
      difficulty: "intermediate",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL"]
    },
    {
      question: "What is the difference between authentication and authorization?",
      category: "security",
      difficulty: "intermediate",
      relatedSkills: ["Node.js", "Express"]
    },
    {
      question: "Explain the concept of API versioning.",
      category: "api",
      difficulty: "advanced",
      relatedSkills: ["Express", "GraphQL"]
    },
    {
      question: "How do you handle errors in both frontend and backend?",
      category: "best-practices",
      difficulty: "intermediate",
      relatedSkills: ["Test-Driven Development", "Code Review"]
    },
    {
      question: "What is the difference between client-side and server-side rendering?",
      category: "architecture",
      difficulty: "intermediate",
      relatedSkills: ["React", "Node.js"]
    },
    {
      question: "Explain the concept of microservices architecture.",
      category: "architecture",
      difficulty: "advanced",
      relatedSkills: ["Docker", "Kubernetes"]
    },
    {
      question: "How do you ensure security in a full stack application?",
      category: "security",
      difficulty: "advanced",
      relatedSkills: ["Node.js", "React", "Express"]
    },
    {
      question: "What is the difference between state and props in React?",
      category: "react",
      difficulty: "beginner",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "How do you optimize application performance end-to-end?",
      category: "performance",
      difficulty: "advanced",
      relatedSkills: ["React", "Node.js", "Webpack"]
    },
    {
      question: "Explain the concept of database transactions.",
      category: "databases",
      difficulty: "intermediate",
      relatedSkills: ["PostgreSQL", "MySQL", "SQL"]
    },
    {
      question: "What are React Hooks? Give examples.",
      category: "react",
      difficulty: "intermediate",
      relatedSkills: ["React", "JavaScript"]
    },
    {
      question: "How do you implement real-time features in a web application?",
      category: "real-time",
      difficulty: "advanced",
      relatedSkills: ["Node.js", "GraphQL"]
    },
  ],
  "DevOps Engineer": [
    {
      question: "Explain the principles of CI/CD.",
      category: "ci-cd",
      difficulty: "intermediate",
      relatedSkills: ["CI/CD", "Jenkins", "Git"]
    },
    {
      question: "What is Docker and how do you use it?",
      category: "containerization",
      difficulty: "intermediate",
      relatedSkills: ["Docker", "Kubernetes", "Linux"]
    },
    {
      question: "Describe Kubernetes and its core components.",
      category: "orchestration",
      difficulty: "advanced",
      relatedSkills: ["Kubernetes", "Docker", "Linux"]
    },
    {
      question: "How do you monitor infrastructure and applications?",
      category: "monitoring",
      difficulty: "intermediate",
      relatedSkills: ["AWS", "Docker"]
    },
    {
      question: "What is infrastructure as code (IaC) and name some tools?",
      category: "infrastructure",
      difficulty: "intermediate",
      relatedSkills: ["Terraform", "Ansible", "AWS"]
    },
    {
      question: "Explain the difference between IaaS, PaaS, and SaaS.",
      category: "cloud",
      difficulty: "beginner",
      relatedSkills: ["AWS", "Google Cloud", "Microsoft Azure"]
    },
    {
      question: "How do you ensure high availability and disaster recovery?",
      category: "reliability",
      difficulty: "advanced",
      relatedSkills: ["Kubernetes", "AWS"]
    },
    {
      question: "What is a blue/green deployment strategy?",
      category: "deployment",
      difficulty: "advanced",
      relatedSkills: ["Docker", "Kubernetes"]
    },
    {
      question: "Describe your experience with cloud providers (AWS, Azure, GCP).",
      category: "cloud",
      difficulty: "intermediate",
      relatedSkills: ["AWS", "Google Cloud", "Microsoft Azure"]
    },
    {
      question: "What is GitOps?",
      category: "ci-cd",
      difficulty: "advanced",
      relatedSkills: ["Git", "Kubernetes", "CI/CD"]
    },
  ],
  "Data Scientist": [
    {
      question: "Explain the difference between supervised and unsupervised learning.",
      category: "machine-learning",
      difficulty: "beginner",
      relatedSkills: ["TensorFlow", "Scikit-learn", "PyTorch"]
    },
    {
      question: "What is overfitting and how do you prevent it?",
      category: "machine-learning",
      difficulty: "intermediate",
      relatedSkills: ["TensorFlow", "Scikit-learn", "PyTorch"]
    },
    {
      question: "Describe different types of machine learning models.",
      category: "machine-learning",
      difficulty: "intermediate",
      relatedSkills: ["TensorFlow", "Scikit-learn", "PyTorch", "Keras"]
    },
    {
      question: "How do you evaluate a machine learning model?",
      category: "machine-learning",
      difficulty: "intermediate",
      relatedSkills: ["TensorFlow", "Scikit-learn", "NumPy", "Pandas"]
    },
    {
      question: "What is feature engineering?",
      category: "data-preprocessing",
      difficulty: "intermediate",
      relatedSkills: ["Pandas", "NumPy", "Scikit-learn"]
    },
    {
      question: "Explain the bias-variance tradeoff.",
      category: "machine-learning",
      difficulty: "advanced",
      relatedSkills: ["TensorFlow", "PyTorch", "Scikit-learn"]
    },
    {
      question: "How do you handle missing data?",
      category: "data-preprocessing",
      difficulty: "intermediate",
      relatedSkills: ["Pandas", "NumPy"]
    },
    {
      question: "What are common data visualization techniques?",
      category: "data-visualization",
      difficulty: "beginner",
      relatedSkills: ["Pandas", "NumPy", "Data Analysis"]
    },
    {
      question: "Describe your experience with Python libraries for data science.",
      category: "tools",
      difficulty: "intermediate",
      relatedSkills: ["Python", "Pandas", "NumPy", "Scikit-learn"]
    },
    {
      question: "What is A/B testing?",
      category: "statistics",
      difficulty: "intermediate",
      relatedSkills: ["Python", "Pandas", "Data Analysis"]
    },
  ],
  "Product Manager": [
    {
      question: "What is your approach to product discovery?",
      category: "product-strategy",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "JIRA"]
    },
    {
      question: "How do you prioritize features for a product roadmap?",
      category: "prioritization",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Kanban", "JIRA"]
    },
    {
      question: "Describe a time you had to say 'no' to a stakeholder.",
      category: "stakeholder-management",
      difficulty: "advanced",
      relatedSkills: ["Agile", "Scrum"]
    },
    {
      question: "How do you define and measure product success?",
      category: "metrics",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Data Analysis"]
    },
    {
      question: "What is the difference between a product manager and a project manager?",
      category: "role-definition",
      difficulty: "beginner",
      relatedSkills: ["Agile", "Scrum"]
    },
    {
      question: "Explain the concept of MVP (Minimum Viable Product).",
      category: "product-strategy",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Scrum"]
    },
    {
      question: "How do you gather and analyze user feedback?",
      category: "user-research",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Data Analysis"]
    },
    {
      question: "What is your experience with agile methodologies?",
      category: "methodology",
      difficulty: "beginner",
      relatedSkills: ["Agile", "Kanban", "Scrum"]
    },
  ],
  "UI/UX Designer": [
    {
      question: "Explain the difference between UI and UX design.",
      category: "design-fundamentals",
      difficulty: "beginner",
      relatedSkills: ["Figma", "Design Patterns"]
    },
    {
      question: "What is your design process?",
      category: "design-process",
      difficulty: "intermediate",
      relatedSkills: ["Figma"]
    },
    {
      question: "How do you conduct user research?",
      category: "user-research",
      difficulty: "intermediate",
      relatedSkills: ["Figma"]
    },
    {
      question: "Describe your experience with design tools (Figma, Sketch, Adobe XD).",
      category: "tools",
      difficulty: "beginner",
      relatedSkills: ["Figma", "VS Code"]
    },
    {
      question: "What is responsive design and why is it important?",
      category: "design-fundamentals",
      difficulty: "beginner",
      relatedSkills: ["Figma", "HTML/CSS"]
    },
    {
      question: "How do you ensure accessibility in your designs?",
      category: "accessibility",
      difficulty: "intermediate",
      relatedSkills: ["HTML/CSS", "Figma"]
    },
    {
      question: "Explain the concept of information architecture.",
      category: "design-fundamentals",
      difficulty: "intermediate",
      relatedSkills: ["Figma", "Design Patterns"]
    },
    {
      question: "What are design systems and why are they useful?",
      category: "design-systems",
      difficulty: "intermediate",
      relatedSkills: ["Figma", "Design Patterns"]
    },
  ],
  "QA Engineer": [
    {
      question: "What is the difference between QA, QC, and testing?",
      category: "testing-fundamentals",
      difficulty: "beginner",
      relatedSkills: ["Test-Driven Development", "Code Review"]
    },
    {
      question: "Describe different types of software testing.",
      category: "testing-types",
      difficulty: "intermediate",
      relatedSkills: ["Test-Driven Development"]
    },
    {
      question: "How do you write a good test case?",
      category: "test-design",
      difficulty: "intermediate",
      relatedSkills: ["Test-Driven Development", "Code Review"]
    },
    {
      question: "What is test automation and what tools do you use?",
      category: "automation",
      difficulty: "intermediate",
      relatedSkills: ["Test-Driven Development", "CI/CD"]
    },
    {
      question: "Explain the software development life cycle (SDLC) and where QA fits in.",
      category: "process",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Test-Driven Development"]
    },
    {
      question: "How do you handle a bug that is difficult to reproduce?",
      category: "debugging",
      difficulty: "advanced",
      relatedSkills: ["Code Review", "Git"]
    },
    {
      question: "What is regression testing?",
      category: "testing-types",
      difficulty: "beginner",
      relatedSkills: ["Test-Driven Development"]
    },
    {
      question: "Describe your experience with performance testing.",
      category: "testing-types",
      difficulty: "intermediate",
      relatedSkills: ["Test-Driven Development"]
    },
  ],
  "Project Manager": [
    {
      question: "How do you plan and schedule a project?",
      category: "planning",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "JIRA"]
    },
    {
      question: "Explain the concept of agile methodology.",
      category: "methodology",
      difficulty: "beginner",
      relatedSkills: ["Agile", "Kanban", "Scrum"]
    },
    {
      question: "What is the difference between a project manager and a product manager?",
      category: "role-definition",
      difficulty: "beginner",
      relatedSkills: ["Agile", "Scrum"]
    },
    {
      question: "How do you handle project risks?",
      category: "risk-management",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Kanban"]
    },
    {
      question: "Explain the concept of stakeholder management.",
      category: "stakeholder-management",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "JIRA"]
    },
    {
      question: "How do you track project progress?",
      category: "tracking",
      difficulty: "beginner",
      relatedSkills: ["JIRA", "Agile"]
    },
    {
      question: "What is the difference between waterfall and agile methodologies?",
      category: "methodology",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Scrum"]
    },
    {
      question: "How do you handle scope creep?",
      category: "scope-management",
      difficulty: "intermediate",
      relatedSkills: ["Agile", "Kanban"]
    },
  ],
  "Other": [
    {
      question: "Tell me about yourself.",
      category: "behavioral",
      difficulty: "beginner",
      relatedSkills: ["Agile", "Communication"]
    },
    {
      question: "What are your greatest strengths?",
      category: "behavioral",
      difficulty: "beginner",
      relatedSkills: ["Code Review", "SOLID Principles"]
    },
    {
      question: "Why do you want to work here?",
      category: "motivation",
      difficulty: "beginner",
      relatedSkills: ["Agile", "Communication"]
    },
    {
      question: "Explain the difference between let, const, and var in JavaScript.",
      category: "javascript",
      difficulty: "beginner",
      relatedSkills: ["JavaScript"]
    },
    {
      question: "What is the difference between SQL and NoSQL databases?",
      category: "databases",
      difficulty: "beginner",
      relatedSkills: ["MongoDB", "PostgreSQL", "MySQL", "SQL"]
    },
  ],
};

// Helper function to get question text from question object
export const getQuestionText = (questionObj) => {
  return typeof questionObj === 'string' ? questionObj : questionObj.question;
};

// Helper function to get category from question object
export const getQuestionCategory = (questionObj) => {
  return typeof questionObj === 'string' ? 'general' : (questionObj.category || 'general');
};

// Helper function to get difficulty from question object
export const getQuestionDifficulty = (questionObj) => {
  return typeof questionObj === 'string' ? 'intermediate' : (questionObj.difficulty || 'intermediate');
};


