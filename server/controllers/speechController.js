/**
 * Google Cloud Speech-to-Text integration (PID Section 5.3)
 * Pipeline: MediaRecorder (client) → base64 audio → this API → Google Cloud Speech-to-Text
 */

let speechClient = null;

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const speech = require('@google-cloud/speech');
    speechClient = new speech.SpeechClient();
  }
} catch (e) {
  console.warn('Google Cloud Speech-to-Text not loaded:', e.message);
}

/**
 * Check if Google Cloud Speech-to-Text is available
 * GET /api/speech/available
 */
const checkAvailable = (req, res) => {
  res.json({ available: !!speechClient });
};

/**
 * Transcribe audio using Google Cloud Speech-to-Text
 * POST /api/speech/transcribe
 * Body: { audio: base64String, encoding?: 'WEBM_OPUS'|'LINEAR16', sampleRateHertz?: number }
 */
const transcribe = async (req, res) => {
  if (!speechClient) {
    return res.status(503).json({
      message: 'Google Cloud Speech-to-Text is not configured. Set GOOGLE_APPLICATION_CREDENTIALS.',
      useFallback: true,
    });
  }

  try {
    const { audio, encoding = 'WEBM_OPUS', sampleRateHertz = 48000 } = req.body;

    if (!audio || typeof audio !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid audio (base64 string)' });
    }

    const config = {
      encoding: encoding === 'LINEAR16' ? 'LINEAR16' : 'WEBM_OPUS',
      sampleRateHertz: Number(sampleRateHertz) || 48000,
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
    };

    const audioBuffer = Buffer.from(audio, 'base64');
    const [response] = await speechClient.recognize({
      config,
      audio: { content: audioBuffer },
    });

    const transcript =
      response.results
        ?.map((r) => r.alternatives?.[0]?.transcript)
        .filter(Boolean)
        .join(' ')
        .trim() || '';

    res.json({ success: true, transcript });
  } catch (error) {
    console.error('Speech-to-Text error:', error);
    res.status(500).json({
      message: error.message || 'Transcription failed',
      useFallback: true,
    });
  }
};

module.exports = { checkAvailable, transcribe };
