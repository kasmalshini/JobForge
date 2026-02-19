import { useState, useEffect, useRef } from 'react';

/**
 * Speaks the question text when it appears (avatar "distributes" the sound).
 * Returns isSpeaking so the avatar can lip-sync.
 */
export function useQuestionSpeech(questionText, isQuestionVisible) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    if (!synth || !questionText || !isQuestionVisible) {
      setIsSpeaking(false);
      return;
    }

    // Cancel any previous utterance
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    // Prefer a natural-sounding voice
    const voices = synth.getVoices();
    const preferred = voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en'))
      || voices.find((v) => v.lang.startsWith('en-US'))
      || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synth.speak(utterance);

    return () => {
      synth.cancel();
      setIsSpeaking(false);
    };
  }, [questionText, isQuestionVisible, synth]);

  // Load voices if not yet available (Chrome)
  useEffect(() => {
    if (synth && synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => {};
    }
  }, [synth]);

  return isSpeaking;
}
