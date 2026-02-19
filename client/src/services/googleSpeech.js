/**
 * Google Cloud Speech-to-Text (PID Section 5.3)
 * Pipeline: MediaRecorder → base64 → POST /api/speech/transcribe
 */
import api from './api';

export async function isGoogleSpeechAvailable() {
  try {
    const { data } = await api.get('/speech/available');
    return !!data?.available;
  } catch {
    return false;
  }
}

/**
 * Convert Blob to base64
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Transcribe audio blob using Google Cloud Speech-to-Text API
 * @param {Blob} audioBlob - Recorded audio (e.g. webm/opus from MediaRecorder)
 * @returns {Promise<string>} - Transcript text
 */
export async function transcribeAudio(audioBlob) {
  const audioBase64 = await blobToBase64(audioBlob);
  const { data } = await api.post('/speech/transcribe', {
    audio: audioBase64,
    encoding: 'WEBM_OPUS',
    sampleRateHertz: 48000,
  });
  if (data?.success && typeof data.transcript === 'string') {
    return data.transcript.trim();
  }
  throw new Error(data?.message || 'Transcription failed');
}
