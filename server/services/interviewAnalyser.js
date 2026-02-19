// services/interviewAnalyzer.service.js
const { uploadLocalFile, transcribeAudio } = require('./assemblyAI');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class InterviewAnalyzer {
  // Analyze voice answer
  async analyzeVoiceAnswer(audioFilePath, question = null) {
    try {
      console.log('📤 Uploading audio file...');
      const audioUrl = await uploadLocalFile(audioFilePath);
      
      console.log('🎙️ Analyzing speech...');
      const result = await transcribeAudio(audioUrl);
      
      // Calculate voice metrics
      const voiceMetrics = this.calculateVoiceMetrics(result);
      
      // Use OpenAI to analyze content if question provided
      let contentAnalysis = null;
      if (question) {
        contentAnalysis = await this.analyzeContent(result.text, question);
      }
      
      return {
        ...voiceMetrics,
        contentAnalysis,
      };
    } catch (error) {
      throw new Error(`Voice analysis failed: ${error.message}`);
    }
  }

  // Analyze written answer
  async analyzeWrittenAnswer(text, question) {
    try {
      const analysis = await this.analyzeContent(text, question);
      
      return {
        clarity: this.calculateTextClarity(text),
        confidence: analysis.confidence,
        compliance: analysis.compliance,
        contentAnalysis: analysis,
        metrics: {
          wordCount: text.split(/\s+/).length,
          sentenceCount: text.split(/[.!?]+/).length - 1,
          avgWordsPerSentence: this.getAvgWordsPerSentence(text),
        },
      };
    } catch (error) {
      throw new Error(`Written analysis failed: ${error.message}`);
    }
  }

  // Calculate voice-specific metrics
  calculateVoiceMetrics(result) {
    const words = result.words || [];
    const duration = result.audio_duration || 1;
    const wordsPerMinute = (words.length / duration) * 60;
    
    // Clarity based on confidence
    const clarity = Math.round(result.confidence * 100);
    
    // IMPROVED Confidence calculation
    const confidence = this.calculateSpeechConfidence(result, wordsPerMinute);
    
    // Compliance based on content depth
    const compliance = this.calculateSpeechCompliance(result);
    
    return {
      clarity,
      confidence,
      compliance,
      metrics: {
        transcription: result.text,
        duration: Math.round(duration),
        wordCount: words.length,
        wordsPerMinute: Math.round(wordsPerMinute),
        fillerWords: this.countFillerWords(result.text),
        pauseCount: this.detectPauses(result),
        sentiment: result.sentiment_analysis_results,
        highlights: result.auto_highlights_result?.results || [],
      },
      rawResult: result,
    };
  }

  // IMPROVED: Calculate speech confidence with multiple factors
  calculateSpeechConfidence(result, wpm) {
    let score = 50;
    
    // Speaking pace (weight: 30%)
    if (wpm >= 120 && wpm <= 150) {
      score += 30; // Ideal pace
    } else if (wpm >= 100 && wpm <= 170) {
      score += 20; // Good pace
    } else if (wpm >= 80 && wpm <= 190) {
      score += 10; // Acceptable pace
    } else {
      score += 5; // Too slow or too fast
    }
    
    // Filler words (weight: 20%)
    const wordCount = result.words?.length || 1;
    const fillerWords = this.countFillerWords(result.text);
    const fillerRatio = fillerWords / wordCount;
    
    if (fillerRatio < 0.02) {
      score += 20; // < 2% is excellent (e.g., 2 fillers in 100 words)
    } else if (fillerRatio < 0.05) {
      score += 15; // < 5% is good (e.g., 5 fillers in 100 words)
    } else if (fillerRatio < 0.10) {
      score += 10; // < 10% is acceptable
    } else {
      score += 5; // Too many filler words
    }
    
    // Sentiment (weight: 20%)
    const sentiments = result.sentiment_analysis_results || [];
    if (sentiments.length > 0) {
      const positiveCount = sentiments.filter(s => s.sentiment === 'POSITIVE').length;
      const neutralCount = sentiments.filter(s => s.sentiment === 'NEUTRAL').length;
      const negativeCount = sentiments.filter(s => s.sentiment === 'NEGATIVE').length;
      
      const positiveRatio = positiveCount / sentiments.length;
      const neutralRatio = neutralCount / sentiments.length;
      
      // Confident speakers have more positive/neutral sentiment
      score += (positiveRatio * 15) + (neutralRatio * 5);
    } else {
      score += 10; // Default if no sentiment data
    }
    
    // Pauses/hesitations (weight: 10%)
    const pauseCount = this.detectPauses(result);
    if (pauseCount < 3) {
      score += 10; // Very few pauses - confident
    } else if (pauseCount < 6) {
      score += 7; // Some pauses - normal
    } else if (pauseCount < 10) {
      score += 5; // More pauses - less confident
    } else {
      score += 2; // Many pauses - uncertain
    }
    
    // Speech confidence from AssemblyAI (weight: 10%)
    const transcriptionConfidence = result.confidence || 0;
    score += transcriptionConfidence * 10;
    
    return Math.min(Math.round(score), 100);
  }

  // NEW: Detect pauses in speech
  detectPauses(result) {
    if (!result.words || result.words.length === 0) return 0;
    
    let pauseCount = 0;
    const words = result.words;
    
    // Detect significant gaps between words (> 1 second)
    for (let i = 1; i < words.length; i++) {
      const previousWordEnd = words[i - 1].end;
      const currentWordStart = words[i].start;
      const gap = currentWordStart - previousWordEnd;
      
      // Gap > 1000ms indicates a pause/hesitation
      if (gap > 1000) {
        pauseCount++;
      }
    }
    
    return pauseCount;
  }

  // Calculate speech compliance
  calculateSpeechCompliance(result) {
    let score = 40;
    
    const wordCount = result.words?.length || 0;
    const entities = result.entities?.length || 0;
    const highlights = result.auto_highlights_result?.results?.length || 0;
    
    if (wordCount > 50) score += 15;
    if (wordCount > 100) score += 15;
    if (entities > 0) score += 15;
    if (highlights > 0) score += 15;
    
    return Math.min(score, 100);
  }

  // Count filler words
  countFillerWords(text) {
    const fillers = [
      'um', 'uh', 'like', 'you know', 'basically', 'actually', 
      'literally', 'so', 'well', 'kind of', 'sort of', 'i mean',
      'right', 'okay', 'yeah'
    ];
    
    const lowerText = text.toLowerCase();
    return fillers.reduce((count, filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, 'g');
      const matches = lowerText.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  // Analyze content using OpenAI
  async analyzeContent(answer, question) {
    try {
      const prompt = `You are an expert interview coach with 20 years of experience.

Analyze this interview answer on THREE dimensions:

1. CLARITY (0-100): 
   - Structure and organization
   - Grammar and articulation
   - Logical flow
   
2. CONFIDENCE (0-100):
   - Assertive language vs hedging ("I will" vs "I might")
   - Specific examples vs vague statements
   - Active voice vs passive voice
   - Definitive statements vs qualifiers
   
3. COMPLIANCE (0-100):
   - Direct answer to the question
   - Relevant examples and evidence
   - Completeness of response

Question: ${question}
Answer: ${answer}

Respond with ONLY this JSON format (no markdown, no backticks):
{
  "clarity_score": <number 0-100>,
  "confidence_score": <number 0-100>,
  "compliance_score": <number 0-100>,
  "feedback": "<2-3 constructive sentences>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert interview coach. Respond only with valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '');
      
      const analysis = JSON.parse(cleanContent);
      
      return {
        clarity: analysis.clarity_score,
        confidence: analysis.confidence_score,
        compliance: analysis.compliance_score,
        feedback: analysis.feedback,
        strengths: analysis.strengths,
        improvements: analysis.improvements,
      };
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      // Fallback to basic analysis
      return {
        clarity: 70,
        confidence: 70,
        compliance: 70,
        feedback: "Unable to generate detailed feedback at this time.",
        strengths: ["Response provided"],
        improvements: ["Consider adding more specific examples"],
      };
    }
  }

  // Calculate text clarity
  calculateTextClarity(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length - 1;
    const avgWordsPerSentence = words / (sentences || 1);
    
    let score = 50;
    
    // Ideal: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
      score += 30;
    } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
      score += 20;
    } else {
      score += 10;
    }
    
    // Word count
    if (words > 50) score += 20;
    
    return Math.min(score, 100);
  }

  getAvgWordsPerSentence(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length - 1;
    return Math.round(words / (sentences || 1));
  }
}

module.exports = new InterviewAnalyzer();