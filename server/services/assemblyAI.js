// services/assemblyAI.service.js
const axios = require('axios');
const fs = require('fs-extra');
require('dotenv').config();

const baseUrl = "https://api.assemblyai.com";
const headers = {
  authorization: process.env.ASSEMBLYAI_API_KEY,
};

async function uploadLocalFile(filePath) {
  try {
    const audioData = await fs.readFile(filePath);
    const uploadResponse = await axios.post(`${baseUrl}/v2/upload`, audioData, {
      headers,
    });
    return uploadResponse.data.upload_url;
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
}

async function transcribeAudio(audioUrl, options = {}) {
  try {
    const data = {
      audio_url: audioUrl,
      language_detection: true,
      speech_model: "best",
      sentiment_analysis: true,
      auto_highlights: true,
      entity_detection: true,
      speaker_labels: true,
      punctuate: true,
      format_text: true,
      ...options,
    };

    const response = await axios.post(`${baseUrl}/v2/transcript`, data, {
      headers,
    });
    const transcriptId = response.data.id;

    return await pollTranscription(transcriptId);
  } catch (error) {
    throw new Error(`Transcription request failed: ${error.message}`);
  }
}

async function pollTranscription(transcriptId) {
  const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

  while (true) {
    try {
      const pollingResponse = await axios.get(pollingEndpoint, { headers });
      const transcriptionResult = pollingResponse.data;

      if (transcriptionResult.status === "completed") {
        return transcriptionResult;
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        console.log(`AssemblyAI Status: ${transcriptionResult.status}... waiting`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      throw new Error(`Polling failed: ${error.message}`);
    }
  }
}

module.exports = {
  uploadLocalFile,
  transcribeAudio,
  pollTranscription,
};