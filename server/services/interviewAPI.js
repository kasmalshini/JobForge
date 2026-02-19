// client/src/services/interviewAPI.js
import api from './api';

/**
 * Analyze voice interview answer
 */
export async function analyzeVoiceInterview(audioBlob, question, options = {}) {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'interview-answer.webm');
    formData.append('question', question);
    
    if (options.category) formData.append('category', options.category);
    if (options.difficulty) formData.append('difficulty', options.difficulty);
    if (options.roomId) formData.append('roomId', options.roomId);

    const { data } = await api.post('/interviews/analyze-voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  } catch (error) {
    console.error('Voice analysis error:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze voice interview');
  }
}

/**
 * Analyze text interview answer
 */
export async function analyzeTextInterview(question, answer, options = {}) {
  try {
    const { data } = await api.post('/interviews/analyze-text', {
      question,
      answer,
      category: options.category,
      difficulty: options.difficulty,
      roomId: options.roomId,
    });

    return data;
  } catch (error) {
    console.error('Text analysis error:', error);
    throw new Error(error.response?.data?.message || 'Failed to analyze text interview');
  }
}

/**
 * Get interview history
 */
export async function getInterviewHistory(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const { data } = await api.get(`/interviews?${params}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch interviews');
  }
}

/**
 * Get single interview
 */
export async function getInterviewById(interviewId) {
  try {
    const { data } = await api.get(`/interviews/${interviewId}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch interview');
  }
}