const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flashcard = require('../models/Flashcard');

dotenv.config();

const interviewTipsQuestions = [
  ['What should you do before an interview?', 'Research the company, review the job description, practice likely questions, and prepare examples that match the role.'],
  ['How should you answer "Tell me about yourself"?', 'Use a short present-past-future structure focused on your relevant experience and goals for the role.'],
  ['What is the STAR method?', 'STAR means Situation, Task, Action, Result and helps you answer behavioral questions with clear outcomes.'],
  ['How do you handle salary discussions?', 'Share a researched range, explain your value, and stay collaborative while considering total compensation.'],
  ['What questions should you ask the interviewer?', 'Ask about team goals, success metrics, onboarding plans, and key challenges in the first months.'],
  ['How do you answer "What is your greatest weakness"?', 'Choose a real but non-critical weakness and show concrete steps you are taking to improve it.'],
  ['How should you describe a conflict at work?', 'Explain the context, how you listened and resolved it professionally, and what improved afterward.'],
  ['What is a good way to discuss a failure?', 'Pick a real failure, own your part, explain what changed, and show measurable learning.'],
  ['How can you make your answers more credible?', 'Use specific examples, numbers, and outcomes instead of generic claims.'],
  ['How should you prepare for behavioral interviews?', 'List role-relevant competencies and prepare 2-3 STAR stories for each competency.'],
  ['How do you show enthusiasm without sounding rehearsed?', 'Connect your interest to real company work, mission, or product impact with authentic examples.'],
  ['What is the best way to end an interview?', 'Thank the interviewer, restate fit briefly, and ask for next steps and timeline.'],
  ['How should you follow up after an interview?', 'Send a concise thank-you note within 24 hours highlighting one key discussion point.'],
  ['How do you handle technical questions you cannot answer?', 'Be honest, explain your reasoning process, and discuss how you would find the answer.'],
  ['How can you manage interview anxiety?', 'Prepare deeply, practice aloud, use breathing techniques, and focus on conversation over perfection.'],
  ['What should you include in stories about leadership?', 'Show initiative, alignment of stakeholders, decisions made, and measurable impact.'],
  ['How do you tailor interview preparation by company type?', 'For startups focus on ownership and speed; for enterprises focus on process, scale, and collaboration.'],
  ['How should you discuss career gaps?', 'Be direct, frame what you learned during the gap, and connect readiness to the current role.'],
  ['What makes a strong answer to "Why this company?"', 'Demonstrate research on product, values, and strategy, then connect it to your background.'],
  ['How do you evaluate if a role is right for you?', 'Assess growth potential, manager style, scope clarity, and alignment with your goals and values.'],
];

const softwareDevelopmentQuestions = [
  ['What is the difference between let, const, and var?', 'var is function-scoped; let and const are block-scoped, and const cannot be reassigned.'],
  ['What is a closure in JavaScript?', 'A closure is a function that retains access to variables from its lexical scope after outer execution ends.'],
  ['What is REST and why is it useful?', 'REST is a resource-oriented API style using HTTP methods and stateless interactions for interoperability.'],
  ['What is the difference between SQL and NoSQL databases?', 'SQL uses relational schemas and joins; NoSQL favors flexible models and horizontal scaling patterns.'],
  ['What is MVC architecture?', 'MVC separates data logic, user interface, and request handling to improve maintainability.'],
  ['How is Git different from GitHub?', 'Git is version control software; GitHub is a platform for hosting and collaborating on Git repositories.'],
  ['What does async/await do?', 'It lets asynchronous Promise-based code be written in sequential style with clearer control flow.'],
  ['What is dependency injection?', 'Dependencies are provided externally to reduce coupling and improve testability and flexibility.'],
  ['Difference between == and === in JavaScript?', '== allows type coercion while === compares value and type strictly.'],
  ['What are microservices?', 'Microservices split systems into independently deployable services communicating over APIs.'],
  ['What is time complexity and why does it matter?', 'Time complexity describes growth of runtime with input size and guides performance-aware design.'],
  ['What is normalization in relational databases?', 'Normalization organizes data to reduce redundancy and improve data integrity.'],
  ['What is indexing in databases?', 'Indexes speed read queries by creating lookup structures but can increase write overhead.'],
  ['What is CI/CD?', 'CI/CD automates build, test, and deployment pipelines for faster and safer delivery.'],
  ['What is unit testing?', 'Unit tests validate small isolated pieces of logic and catch regressions early.'],
  ['What is integration testing?', 'Integration tests verify that multiple modules or services work correctly together.'],
  ['What is memoization?', 'Memoization caches computed results to avoid repeated expensive operations.'],
  ['What is idempotency in APIs?', 'An idempotent operation produces the same result when repeated with identical input.'],
  ['What is optimistic locking?', 'Optimistic locking prevents lost updates by checking a version before writing data.'],
  ['What is the purpose of code reviews?', 'Code reviews improve quality, share knowledge, and catch defects before production.'],
  ['How do pull requests improve team collaboration on GitHub?', 'Pull requests centralize discussion, enforce review, and document why changes were made before merge.'],
  ['What is the difference between merge, squash, and rebase strategies on GitHub?', 'Merge preserves all commits, squash combines them into one, and rebase rewrites commit history linearly.'],
  ['How do GitHub Actions help software delivery?', 'GitHub Actions automate testing, linting, builds, and deployments on every push or pull request.'],
  ['Why are branch protection rules important in GitHub?', 'They prevent direct risky changes by requiring reviews, status checks, and up-to-date branches before merge.'],
  ['What should a good GitHub issue template include?', 'A clear problem statement, reproduction steps, expected behavior, environment details, and acceptance criteria.'],
];

const difficultyForPosition = (index, total) => {
  const easyCutoff = Math.floor(total / 3);
  const mediumCutoff = Math.floor((2 * total) / 3);
  if (index < easyCutoff) return 'easy';
  if (index < mediumCutoff) return 'medium';
  return 'hard';
};

const baseFlashcards = [
  ...interviewTipsQuestions.map(([question, answer], index) => ({
    category: 'interview-tips',
    question,
    answer,
    difficulty: difficultyForPosition(index, interviewTipsQuestions.length),
  })),
  ...softwareDevelopmentQuestions.map(([question, answer], index) => ({
    category: 'software-development',
    question,
    answer,
    difficulty: difficultyForPosition(index, softwareDevelopmentQuestions.length),
  })),
];

const roles = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer',
  'QA Engineer',
  'Project Manager',
];

const roleTopicTemplates = [
  {
    category: 'interview-tips',
    competency: 'problem solving',
    focus: 'breaking down ambiguous tasks',
  },
  {
    category: 'interview-tips',
    competency: 'communication',
    focus: 'explaining trade-offs to stakeholders',
  },
  {
    category: 'interview-tips',
    competency: 'collaboration',
    focus: 'working with cross-functional teams',
  },
  {
    category: 'interview-tips',
    competency: 'ownership',
    focus: 'taking accountability for outcomes',
  },
  {
    category: 'interview-tips',
    competency: 'prioritization',
    focus: 'deciding what to do first under constraints',
  },
  {
    category: 'interview-tips',
    competency: 'delivery',
    focus: 'shipping incrementally while managing risk',
  },
  {
    category: 'interview-tips',
    competency: 'decision making',
    focus: 'balancing short-term and long-term goals',
  },
  {
    category: 'interview-tips',
    competency: 'leadership',
    focus: 'influencing without direct authority',
  },
  {
    category: 'interview-tips',
    competency: 'adaptability',
    focus: 'responding to changing requirements',
  },
  {
    category: 'interview-tips',
    competency: 'feedback culture',
    focus: 'giving and receiving constructive feedback',
  },
  {
    category: 'software-development',
    competency: 'system design',
    focus: 'designing scalable and reliable solutions',
  },
  {
    category: 'software-development',
    competency: 'performance',
    focus: 'improving latency, throughput, or UX responsiveness',
  },
  {
    category: 'software-development',
    competency: 'quality',
    focus: 'test strategy and defect prevention',
  },
  {
    category: 'software-development',
    competency: 'debugging',
    focus: 'isolating root causes efficiently',
  },
  {
    category: 'software-development',
    competency: 'security',
    focus: 'preventing common vulnerabilities',
  },
  {
    category: 'software-development',
    competency: 'data handling',
    focus: 'making data-driven decisions',
  },
  {
    category: 'software-development',
    competency: 'automation',
    focus: 'reducing manual work and operational toil',
  },
  {
    category: 'software-development',
    competency: 'monitoring',
    focus: 'tracking health and defining useful alerts',
  },
  {
    category: 'software-development',
    competency: 'documentation',
    focus: 'creating clear, maintainable team knowledge',
  },
  {
    category: 'software-development',
    competency: 'continuous improvement',
    focus: 'retrospectives and measurable process improvements',
  },
];

const levels = [
  {
    difficulty: 'easy',
    label: 'Foundational',
    guidance: 'Give a straightforward example from your recent work.',
  },
  {
    difficulty: 'medium',
    label: 'Applied',
    guidance: 'Use a concrete situation with clear actions, metrics, and lessons learned.',
  },
  {
    difficulty: 'hard',
    label: 'Advanced',
    guidance:
      'Show high-impact decisions, alternatives considered, trade-offs, and measurable business outcomes.',
  },
];

const generateRoleSpecificFlashcards = () => {
  const generated = [];

  for (const role of roles) {
    roleTopicTemplates.forEach((template) => {
      levels.forEach((level) => {
        generated.push({
          role,
          category: template.category,
          question: `[${level.label}] ${role}: How would you demonstrate ${template.competency} when ${template.focus}?`,
          answer: `For a ${role} interview, structure your response with STAR (Situation, Task, Action, Result). Focus on ${template.focus}. ${level.guidance} Highlight the impact of your decisions, how you collaborated, and what you would improve in your next iteration.`,
          difficulty: level.difficulty,
        });
      });
    });
  }

  return generated;
};

const flashcards = [
  ...baseFlashcards,
  ...generateRoleSpecificFlashcards(),
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
    const roleCountPerRole = roleTopicTemplates.length * levels.length;
    console.log(
      `Seeded ${flashcards.length} flashcards (${roleCountPerRole} role-specific per role)`
    );

    process.exit(0);
  } catch (error) {
    console.error('Error seeding flashcards:', error);
    process.exit(1);
  }
};

seedFlashcards();





