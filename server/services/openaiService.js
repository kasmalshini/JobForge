const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
  const apiKey = process.env.OPENAI_API_KEY;
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

    // Step 1: Send to GPT-4 API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Using GPT-4 for better analysis
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach. Analyze interview answers according to the provided rubric. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
      response_format: { type: "json_object" }, // Ensure JSON output
    });

    // Step 3: Parse GPT-4 JSON response
    let responseText = completion.choices[0].message.content;
    
    if (typeof responseText !== 'string') {
      throw new Error('Invalid response format from OpenAI');
    }
    
    responseText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (responseText.includes('```')) {
      responseText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    }

    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse GPT-4 response as JSON:', responseText, jsonError);
      throw new Error('Failed to parse AI response');
    }

    // Step 4: Normalize scores (ensure 0-100 range); handle different key casing from API
    const getScore = (obj, key) => obj[key] ?? obj[key.charAt(0).toUpperCase() + key.slice(1)];
    const normalizedScores = {
      clarity: normalizeScore(getScore(analysis, 'clarity')),
      confidence: normalizeScore(getScore(analysis, 'confidence')),
      applicability: normalizeScore(getScore(analysis, 'applicability')),
    };

    // Validate feedback fields
    const feedback = typeof analysis.feedback === 'string' && analysis.feedback.trim()
      ? analysis.feedback.trim()
      : 'Good effort. Keep practicing!';

    // Validate arrays
    const strengths = Array.isArray(analysis.strengths) && analysis.strengths.length > 0
      ? analysis.strengths.filter(s => typeof s === 'string' && s.trim()).slice(0, 3)
      : [];

    const improvements = Array.isArray(analysis.improvements) && analysis.improvements.length > 0
      ? analysis.improvements.filter(i => typeof i === 'string' && i.trim()).slice(0, 3)
      : [];

    return {
      ...normalizedScores,
      feedback,
      strengths,
      improvements,
    };
  } catch (error) {
    console.error('OpenAI GPT-4 API Error:', error?.message || error);

    // Fallback scores if API fails (e.g. network, rate limit, invalid key)
    const reason = error?.message || '';
    const isAuth = reason.includes('401') || reason.includes('Incorrect API key') || reason.includes('invalid_api_key');
    const feedback = isAuth
      ? 'OpenAI API key is invalid or missing. Add a valid key to server/.env (OPENAI_API_KEY=sk-...) to enable analysis.'
      : 'Unable to analyze answer at this time. Please try again. Check the server console for details.';

    return {
      clarity: normalizeScore(50),
      confidence: normalizeScore(50),
      applicability: normalizeScore(50),
      feedback,
      strengths: [],
      improvements: [],
    };
  }
};

module.exports = { analyzeAnswer };
