# AI Analysis Algorithm Documentation

## Overview
The AI Analysis Algorithm uses OpenAI GPT-4 to analyze interview answers and provide structured feedback with normalized scores.

## Process Flow

### 1. Transcribed Text Sent to OpenAI GPT-4 API
- The user's transcribed answer (from voice input) is sent to the GPT-4 API
- The request includes the original question and the transcribed answer text

### 2. Structured Prompt with Evaluation Rubric
The prompt sent to GPT-4 includes:
- **Original Question**: The interview question that was asked
- **Transcribed Answer**: The user's answer as transcribed from voice input
- **Evaluation Rubric**: Detailed criteria for scoring three dimensions:
  - **Clarity** (0-100): Measures how clear, well-structured, and easy to understand the answer is
  - **Confidence** (0-100): Measures how confident and assured the speaker sounds
  - **Applicability** (0-100): Measures how relevant and applicable the answer is to the question

### 3. GPT-4 Returns JSON with Three Scores
GPT-4 responds with a structured JSON object containing:
```json
{
  "clarity": <integer 0-100>,
  "confidence": <integer 0-100>,
  "applicability": <integer 0-100>,
  "feedback": "<constructive feedback>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}
```

### 4. Scores Normalized and Stored in Database
- All scores are normalized to ensure they are within the 0-100 range
- Invalid or out-of-range scores are clamped to valid values
- Normalized scores are stored in the database along with:
  - Original question
  - Transcribed answer text
  - Individual scores (clarity, confidence, applicability)
  - Combined score (calculated as: Clarity × 0.4 + Confidence × 0.3 + Applicability × 0.3)
  - Feedback, strengths, and improvements

## Technical Details

### API Configuration
- **Model**: GPT-4
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 600
- **Response Format**: JSON object (enforced)

### Score Normalization
The `normalizeScore` function ensures:
- Scores are valid numbers
- Scores are within 0-100 range
- Invalid scores default to 50
- Scores are rounded to integers

### Error Handling
- If GPT-4 API fails, returns default scores (50 for each dimension)
- If JSON parsing fails, logs error and returns fallback
- All errors are logged for debugging

## Usage

```javascript
const { analyzeAnswer } = require('./services/openaiService');

const result = await analyzeAnswer(question, transcribedAnswer);
// Returns normalized scores and feedback
```


