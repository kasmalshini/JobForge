const OpenAI = require('openai');
const axios = require('axios');

const getApiKey = () => (process.env.OPENAI_API_KEY || '').trim();
const getModel = () => (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
const getGeminiApiKey = () => (process.env.GEMINI_API_KEY || '').trim();
const getGeminiModel = () => (process.env.GEMINI_MODEL || 'gemini-1.5-flash').trim();

const openai = new OpenAI({
  apiKey: getApiKey(),
});

/**
 * Evaluation Rubric for Interview Answer Analysis
 * This rubric is used to consistently evaluate interview answers across three dimensions
 */
const EVALUATION_RUBRIC = {
  clarity: {
    description: "Measures how clear, well-structured, and easy to understand the answer is",
    criteria: [
      "Logical flow and organization (beginning, middle, end)",
      "Clarity of expression without ambiguity",
      "Appropriate use of technical terms with explanations when needed",
      "Coherence and structure of ideas"
    ],
    scoring: {
      "80-100": "Exceptionally clear, well-structured, easy to follow",
      "60-79": "Good clarity with minor organizational issues",
      "40-59": "Moderate clarity, needs better structure",
      "0-39": "Confusing, disorganized, difficult to follow"
    }
  },
  confidence: {
    description: "Measures how confident and assured the speaker sounds",
    criteria: [
      "Tone and delivery (assertive, professional)",
      "Absence of hesitations and filler words",
      "Self-assurance and conviction in statements",
      "Professional presence and composure"
    ],
    scoring: {
      "80-100": "Very confident, assertive, professional delivery",
      "60-79": "Good confidence with minor hesitations",
      "40-59": "Moderate confidence, noticeable uncertainty",
      "0-39": "Lacks confidence, hesitant, uncertain"
    }
  },
  applicability: {
    description: "Measures how relevant and applicable the answer is to the question",
    criteria: [
      "Directly addresses the question asked",
      "Relevance of content to the question topic",
      "Appropriateness of examples and details",
      "Completeness in answering the question"
    ],
    scoring: {
      "80-100": "Highly relevant, directly addresses question with appropriate examples",
      "60-79": "Mostly relevant, could be more focused",
      "40-59": "Partially relevant, some off-topic content",
      "0-39": "Off-topic or does not address the question"
    }
  }
};

/**
 * Normalize score to ensure it's within 0-100 range
 * @param {number} score - The score to normalize
 * @returns {number} - Normalized score between 0 and 100
 */
const normalizeScore = (score) => {
  const num = typeof score === 'number' ? score : Number(score);
  if (isNaN(num)) {
    return 50; // Default to 50 if invalid
  }
  return Math.max(0, Math.min(100, Math.round(num)));
};

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'this', 'that', 'it', 'as', 'at', 'by', 'from', 'if', 'then', 'than', 'so',
  'we', 'you', 'i', 'they', 'he', 'she', 'them', 'our', 'your', 'my', 'their', 'but', 'about', 'into',
]);

const IMPORTANT_SHORT_TOKENS = new Set([
  'ai', 'ml', 'ui', 'ux', 'qa', 'db', 'ci', 'cd', 'js', 'ts', 'uxr', 'api',
]);

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => {
      if (!token) return false;
      const isImportantShortToken = IMPORTANT_SHORT_TOKENS.has(token);
      const hasValidLength = token.length > 2 || isImportantShortToken;
      return hasValidLength && !STOPWORDS.has(token);
    });

const isMeaninglessAnswer = (answer) => {
  const raw = String(answer || '').trim();
  if (!raw) return true;

  // Very short content like "a", "ok", "hh" is not a meaningful interview answer.
  if (raw.length < 6) return true;

  const words = raw.split(/\s+/).filter(Boolean);
  if (words.length < 2) return true;

  const alphaMatches = raw.match(/[a-z]/gi) || [];
  const alphaRatio = alphaMatches.length / Math.max(raw.length, 1);
  if (alphaRatio < 0.4) return true;

  const tokens = tokenize(raw);
  const uniqueTokenCount = new Set(tokens).size;

  // Repeated same token/character patterns are treated as gibberish.
  if (uniqueTokenCount <= 1 && tokens.length <= 3) return true;
  if (/^(.)\1{4,}$/i.test(raw.replace(/\s+/g, ''))) return true;

  return false;
};

const heuristicFallbackAnalysis = (question, answer) => {
  const answerText = String(answer || '').trim();
  const questionTokens = tokenize(question);
  const answerTokens = tokenize(answerText);
  const answerTokenSet = new Set(answerTokens);

  const overlap = questionTokens.filter((token) => answerTokenSet.has(token)).length;
  const relevanceRatio = questionTokens.length > 0 ? overlap / questionTokens.length : 0;
  const uniqueWords = new Set(answerTokens).size;
  const sentenceCount = answerText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
  const avgSentenceLength = answerTokens.length / sentenceCount;

  // Clarity: reward structure and readable sentence length
  const structureBonus = sentenceCount >= 2 ? 8 : 0;
  const sentenceLengthPenalty = avgSentenceLength > 30 ? -8 : avgSentenceLength < 5 ? -10 : 0;
  let clarity = normalizeScore(45 + Math.min(30, uniqueWords * 0.9) + structureBonus + sentenceLengthPenalty);

  // Confidence: reduce for hedging language; improve for decisive wording
  const lowerAnswer = answerText.toLowerCase();
  const hedgeMatches = (lowerAnswer.match(/\b(maybe|might|perhaps|i think|not sure|possibly|guess)\b/g) || []).length;
  const assertiveMatches = (lowerAnswer.match(/\b(will|must|can|deliver|implemented|built|solved|improved|led)\b/g) || []).length;
  let confidence = normalizeScore(55 + assertiveMatches * 4 - hedgeMatches * 6 + Math.min(10, sentenceCount * 2));

  // Applicability: mainly based on semantic overlap with the question and adequate detail
  const detailBonus = answerTokens.length >= 20 ? 10 : answerTokens.length >= 10 ? 5 : 0;
  let applicability = normalizeScore(20 + relevanceRatio * 65 + detailBonus);

  // If response is likely off-topic, force stricter low scoring.
  const hasQuestionTermMatch = overlap > 0;
  const isLikelyOffTopic = (relevanceRatio < 0.12 && !hasQuestionTermMatch) || answerTokens.length < 4;
  if (isLikelyOffTopic) {
    applicability = Math.min(applicability, 20);
    clarity = Math.min(clarity, 35);
    confidence = Math.min(confidence, 35);
  }

  return {
    clarity,
    confidence,
    applicability,
    strengths: isLikelyOffTopic
      ? ['You attempted an answer and can improve with better question focus.']
      : [
          sentenceCount >= 2 ? 'Your answer has a clear multi-sentence structure.' : 'Your answer is concise and direct.',
          relevanceRatio >= 0.35 ? 'You addressed key parts of the question.' : 'You attempted to respond to the core question.',
        ],
    improvements: isLikelyOffTopic
      ? [
          'Your response appears off-topic for this question.',
          'Address the exact topic asked and include one relevant technical example.',
        ]
      : [
          'Your answer is partially correct; add more depth to fully explain the concept.',
          'Add one concrete example or metric to strengthen credibility.',
          'Use explicit, decisive phrasing and avoid vague language.',
        ],
  };
};

const parseModelJson = (responseText) => {
  if (typeof responseText !== 'string') {
    throw new Error('Invalid model response format');
  }

  let text = responseText.trim();
  if (text.includes('```')) {
    text = text.replace(/```json\n?|\n?```/g, '').trim();
  }
  return JSON.parse(text);
};

const normalizeAnalysis = (analysis, question = '', answer = '') => {
  const getScore = (obj, key) => obj[key] ?? obj[key.charAt(0).toUpperCase() + key.slice(1)];

  const feedback = typeof analysis.feedback === 'string' && analysis.feedback.trim()
    ? analysis.feedback.trim()
    : 'Good effort. Keep practicing!';

  const strengths = Array.isArray(analysis.strengths) && analysis.strengths.length > 0
    ? analysis.strengths.filter((s) => typeof s === 'string' && s.trim()).slice(0, 3)
    : [];

  const improvements = Array.isArray(analysis.improvements) && analysis.improvements.length > 0
    ? analysis.improvements.filter((i) => typeof i === 'string' && i.trim()).slice(0, 3)
    : [];

  const questionTokens = tokenize(question);
  const answerTokens = tokenize(answer);
  const answerTokenSet = new Set(answerTokens);
  const overlap = questionTokens.filter((token) => answerTokenSet.has(token)).length;
  const relevanceRatio = questionTokens.length > 0 ? overlap / questionTokens.length : 0;
  const hasQuestionTermMatch = overlap > 0;
  const likelyOffTopic = (relevanceRatio < 0.12 && !hasQuestionTermMatch) || answerTokens.length < 4;

  let clarity = normalizeScore(getScore(analysis, 'clarity'));
  let confidence = normalizeScore(getScore(analysis, 'confidence'));
  let applicability = normalizeScore(getScore(analysis, 'applicability'));

  if (likelyOffTopic) {
    applicability = Math.min(applicability, 25);
    clarity = Math.min(clarity, 45);
    confidence = Math.min(confidence, 45);
  }

  return {
    clarity,
    confidence,
    applicability,
    feedback,
    strengths,
    improvements,
  };
};

const analyzeWithGemini = async (prompt, question, answer) => {
  const geminiApiKey = getGeminiApiKey();
  if (!geminiApiKey) {
    throw new Error('Gemini API key is missing');
  }

  const model = getGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(geminiApiKey)}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    },
    {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const text =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    response?.data?.candidates?.[0]?.content?.parts?.find((p) => typeof p?.text === 'string')?.text;

  if (!text) {
    throw new Error('Gemini returned empty response');
  }

  const analysis = parseModelJson(text);
  return normalizeAnalysis(analysis, question, answer);
};

/**
 * Analyze interview answer using GPT-4
 * Process:
 * 1. Transcribed text sent to OpenAI GPT-4 API with structured prompt
 * 2. Analysis request includes: original question, user's transcribed answer, evaluation rubric
 * 3. GPT-4 returns JSON with three scores
 * 4. Scores normalized and returned
 * 
 * @param {string} question - The original interview question
 * @param {string} answer - The user's transcribed answer
 * @returns {Promise<Object>} - Analysis results with normalized scores and feedback
 */
const analyzeAnswer = async (question, answer) => {
  const apiKey = getApiKey();

  if (isMeaninglessAnswer(answer)) {
    return {
      clarity: 0,
      confidence: 0,
      applicability: 0,
      feedback: 'Your answer appears meaningless or too short. Provide a clear, relevant response to receive a score.',
      strengths: [],
      improvements: [
        'Write a complete answer with meaningful words and at least one clear idea.',
        'Address the question directly instead of random letters or filler text.',
      ],
    };
  }

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_openai_api_key_here') {
    console.error('OpenAI API key not set. Add OPENAI_API_KEY to server/.env');
    return {
      clarity: 50,
      confidence: 50,
      applicability: 50,
      feedback: 'OpenAI API key is not set. Add OPENAI_API_KEY to server/.env with your key (get one at platform.openai.com) to get real scores and feedback.',
      strengths: [],
      improvements: [],
    };
  }

  try {
    // Step 1 & 2: Structured prompt with evaluation rubric
    const prompt = `You are an expert interview coach analyzing a candidate's interview answer.

**ORIGINAL QUESTION:**
"${question}"

**CANDIDATE'S ANSWER (Transcribed Text):**
"${answer}"

**EVALUATION RUBRIC:**

1. **CLARITY (0-100)**: ${EVALUATION_RUBRIC.clarity.description}
   - Criteria: ${EVALUATION_RUBRIC.clarity.criteria.join(', ')}
   - Scoring Guide:
     * 80-100: ${EVALUATION_RUBRIC.clarity.scoring["80-100"]}
     * 60-79: ${EVALUATION_RUBRIC.clarity.scoring["60-79"]}
     * 40-59: ${EVALUATION_RUBRIC.clarity.scoring["40-59"]}
     * 0-39: ${EVALUATION_RUBRIC.clarity.scoring["0-39"]}

2. **CONFIDENCE (0-100)**: ${EVALUATION_RUBRIC.confidence.description}
   - Criteria: ${EVALUATION_RUBRIC.confidence.criteria.join(', ')}
   - Scoring Guide:
     * 80-100: ${EVALUATION_RUBRIC.confidence.scoring["80-100"]}
     * 60-79: ${EVALUATION_RUBRIC.confidence.scoring["60-79"]}
     * 40-59: ${EVALUATION_RUBRIC.confidence.scoring["40-59"]}
     * 0-39: ${EVALUATION_RUBRIC.confidence.scoring["0-39"]}

3. **APPLICABILITY (0-100)**: ${EVALUATION_RUBRIC.applicability.description}
   - Criteria: ${EVALUATION_RUBRIC.applicability.criteria.join(', ')}
   - Scoring Guide:
     * 80-100: ${EVALUATION_RUBRIC.applicability.scoring["80-100"]}
     * 60-79: ${EVALUATION_RUBRIC.applicability.scoring["60-79"]}
     * 40-59: ${EVALUATION_RUBRIC.applicability.scoring["40-59"]}
     * 0-39: ${EVALUATION_RUBRIC.applicability.scoring["0-39"]}

**INSTRUCTIONS:**
1. Evaluate the candidate's answer against each dimension (Clarity, Confidence, Applicability)
2. Assign scores from 0-100 based on the rubric above
3. Provide constructive feedback (2-3 sentences)
4. Identify 2-3 specific strengths
5. Identify 2-3 specific areas for improvement
6. Grade by semantic meaning, not exact keyword match:
   - Treat paraphrases, synonyms, and equivalent phrasing as correct when intent matches.
   - Do NOT unfairly penalize answers that use different wording from common textbook responses.
7. Applicability should reflect answer correctness + relevance:
   - High score when the response directly answers the question with accurate, job-relevant content.
   - Lower score when the response is vague, partially correct, or off-topic.
8. Confidence scoring rule for text answers:
   - Infer confidence from language quality (decisive wording, clear rationale, ownership, and consistency).
   - Do not over-penalize for missing vocal cues (tone/volume are unavailable in plain text).
9. Keep scores calibrated:
   - 85-100 = excellent and complete
   - 70-84 = strong but missing minor depth/detail
   - 50-69 = partially correct or somewhat unclear
   - 0-49 = mostly incorrect, unclear, or off-topic
10. Ensure all scores are integers from 0 to 100.

**REQUIRED JSON FORMAT:**
{
  "clarity": <integer 0-100>,
  "confidence": <integer 0-100>,
  "applicability": <integer 0-100>,
  "feedback": "<2-3 sentences of constructive overall feedback>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
}

Return ONLY the JSON object, no additional text or explanation.`;

    // Prefer Gemini if key exists, otherwise use OpenAI.
    if (getGeminiApiKey()) {
      return await analyzeWithGemini(prompt, question, answer);
    }

    const completion = await openai.chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach. Score answers fairly by semantic meaning (including paraphrases and similar answers), not exact wording. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content;
    const analysis = parseModelJson(responseText);
    return normalizeAnalysis(analysis, question, answer);
  } catch (error) {
    console.error('OpenAI GPT-4 API Error:', error?.message || error);

    // Fallback scores if API fails (e.g. network, rate limit, invalid key)
    const reason = error?.message || '';
    const isAuth = reason.includes('401') || reason.includes('Incorrect API key') || reason.includes('invalid_api_key');
    const isQuota = reason.includes('429') || reason.toLowerCase().includes('quota');
    const fallback = heuristicFallbackAnalysis(question, answer);
    const feedback = isAuth
      ? 'Good effort. Keep practicing and keep your answers focused on the question.'
      : isQuota
        ? 'Good effort. Keep practicing and add one concrete example to strengthen your answer.'
        : 'Good effort. Keep practicing and aim for clear structure with relevant examples.';

    return {
      clarity: fallback.clarity,
      confidence: fallback.confidence,
      applicability: fallback.applicability,
      feedback,
      strengths: fallback.strengths,
      improvements: fallback.improvements,
    };
  }
};

module.exports = { analyzeAnswer };
