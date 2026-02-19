class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.onTranscriptUpdate = null;
    this.onError = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        this.transcript = finalTranscript + interimTranscript;
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(this.transcript);
        }
      };

      this.recognition.onerror = (event) => {
        if (this.onError) {
          this.onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  start() {
    if (!this.recognition) {
      if (this.onError) {
        this.onError('Speech recognition not supported in this browser');
      }
      return false;
    }

    if (this.isListening) {
      return true; // Already running, no need to start again
    }

    try {
      this.transcript = '';
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      // recognition.start() throws InvalidStateError if already started (browser can lag behind onend)
      if (e.name === 'InvalidStateError' || e.message?.includes('already started')) {
        this.isListening = true;
        return true;
      }
      if (this.onError) this.onError(e.message || 'Failed to start speech recognition');
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return true;
    }
    return false;
  }

  getTranscript() {
    return this.transcript;
  }

  clearTranscript() {
    this.transcript = '';
  }
}

export default SpeechRecognitionService;





