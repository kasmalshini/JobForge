import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognitionService from '../../services/speechRecognition';
import { isGoogleSpeechAvailable, transcribeAudio } from '../../services/googleSpeech';

const VoiceRecorder = ({ onTranscriptChange, onAnswerSubmit, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [useGoogleSpeech, setUseGoogleSpeech] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const speechService = useRef(new SpeechRecognitionService());
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    isGoogleSpeechAvailable().then(setUseGoogleSpeech);
  }, []);

  useEffect(() => {
    speechService.current.onTranscriptUpdate = (newTranscript) => {
      setTranscript(newTranscript);
      if (onTranscriptChange) {
        onTranscriptChange(newTranscript);
      }
    };

    speechService.current.onError = (error) => {
      console.error('Speech recognition error:', error);
      if (error === 'no-speech' || error === 'audio-capture') {
        // Handle silently or show user-friendly message
      }
    };

    return () => {
      speechService.current.stop();
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [onTranscriptChange]);

  const handleStartRecording = async () => {
    if (isRecording) return;
    if (useGoogleSpeech) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';
        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];
        recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
        recorder.onstop = () => stream.getTracks().forEach((t) => t.stop());
        recorder.start(200);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        setTranscript('');
      } catch (e) {
        console.error('MediaRecorder start failed:', e);
        if (speechService.current.start()) {
          setIsRecording(true);
          setTranscript('');
        }
      }
      return;
    }
    if (speechService.current.start()) {
      setIsRecording(true);
      setTranscript('');
    }
  };

  const handleStopRecording = async () => {
    if (useGoogleSpeech && mediaRecorderRef.current?.state === 'recording') {
      const recorder = mediaRecorderRef.current;
      recorder.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setTranscribing(true);
      try {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const text = await transcribeAudio(blob);
        setTranscript(text);
        if (onTranscriptChange) onTranscriptChange(text);
      } catch (e) {
        console.error('Google Speech transcribe failed, falling back:', e);
        if (speechService.current.start()) {
          setIsRecording(true);
        }
      }
      setTranscribing(false);
      return;
    }
    speechService.current.stop();
    setIsRecording(false);
  };

  const handleClear = () => {
    speechService.current.clearTranscript();
    setTranscript('');
    if (onTranscriptChange) onTranscriptChange('');
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      speechService.current.stop();
      setIsRecording(false);
      if (onAnswerSubmit) {
        onAnswerSubmit(transcript.trim());
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.transcriptContainer}>
        <textarea
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (onTranscriptChange) {
              onTranscriptChange(e.target.value);
            }
          }}
          placeholder="Your answer will appear here... (or type manually)"
          style={styles.transcript}
          disabled={disabled}
        />
      </div>

      <div style={styles.controls}>
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            style={{ ...styles.button, ...styles.recordButton }}
            disabled={disabled}
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            style={{ ...styles.button, ...styles.stopButton }}
          >
            ⏹ Stop Recording
          </button>
        )}

        {transcript && (
          <>
            <button
              onClick={handleClear}
              style={{ ...styles.button, ...styles.clearButton }}
              disabled={disabled || isRecording}
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              style={{ ...styles.button, ...styles.submitButton }}
              disabled={disabled || isRecording || !transcript.trim()}
            >
              Submit Answer
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <div style={styles.recordingIndicator}>
          <div style={styles.recordingDot} />
          <span>Recording...</span>
        </div>
      )}
      {transcribing && (
        <div style={styles.recordingIndicator}>
          <span>Transcribing with Google Cloud...</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
  transcriptContainer: {
    marginBottom: '20px',
  },
  transcript: {
    width: '100%',
    minHeight: '150px',
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
    minWidth: '150px',
  },
  recordButton: {
    background: '#e74c3c',
    color: 'white',
  },
  stopButton: {
    background: '#95a5a6',
    color: 'white',
  },
  clearButton: {
    background: '#95a5a6',
    color: 'white',
  },
  submitButton: {
    background: 'linear-gradient(135deg, #238845 0%, #000 100%)',
    color: 'white',
  },
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '15px',
    color: '#e74c3c',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  recordingDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#e74c3c',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

// Add pulse animation
const styleSheet = document.createElement('style');
styleSheet.textContent += `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
`;
if (!document.head.querySelector('style[data-voice-recorder]')) {
  styleSheet.setAttribute('data-voice-recorder', 'true');
  document.head.appendChild(styleSheet);
}

export default VoiceRecorder;





