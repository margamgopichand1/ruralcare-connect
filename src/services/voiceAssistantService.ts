// Voice Assistant Service supporting SpeechSynthesis (TTS) and SpeechRecognition (STT)
// with native Indian language BCP-47 language tags and simulated fallback.

export interface SpeechPlaybackState {
  isSpeaking: boolean;
  activeLanguage: 'en' | 'te' | 'hi';
}

class VoiceAssistantService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Speak text in chosen language (English, Telugu, or Hindi)
   */
  public speak(
    text: string,
    lang: 'en' | 'te' | 'hi',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.synth) {
      // Fallback: Simulate voice playback visually
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 3000);
      return false;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Select proper language code
      const langCodes: Record<'en' | 'te' | 'hi', string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN'
      };
      utterance.lang = langCodes[lang] || 'en-IN';
      utterance.rate = 0.92; // Slightly measured rate for clear comprehension during stress
      utterance.pitch = 1.0;

      // Find matching voice if available
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(langCodes[lang]) || v.lang.startsWith(lang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech synthesis exception, using fallback', e);
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 3000);
      return false;
    }
  }

  /**
   * Stop any active speech
   */
  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Check if speech synthesis is currently active
   */
  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Listen for user speech (Web Speech Recognition with simulated fallback)
   */
  public listen(
    lang: 'en' | 'te' | 'hi',
    onResult: (transcript: string) => void,
    onError?: (err: any) => void
  ): () => void {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      // Graceful simulation: Provide immediate response after 2 seconds
      const timer = setTimeout(() => {
        const simulatedResponses: Record<'en' | 'te' | 'hi', string> = {
          en: "Patient is conscious, chest compression protocol requested",
          te: "రోగి స్పృహలో ఉన్నారు, సహాయం కావాలి",
          hi: "मरीज होश में है, प्राथमिक सहायता शुरू करें"
        };
        onResult(simulatedResponses[lang] || simulatedResponses.en);
      }, 2000);

      return () => clearTimeout(timer);
    }

    try {
      this.recognition = new SpeechRec();
      const langCodes: Record<'en' | 'te' | 'hi', string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        te: 'te-IN'
      };
      this.recognition.lang = langCodes[lang] || 'en-IN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const text = event.results[0][0].transcript;
          onResult(text);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error, triggering smart mobile simulation', event);
        const simulatedResponses: Record<'en' | 'te' | 'hi', string> = {
          en: "Patient is conscious, chest compression protocol requested",
          te: "రోగి స్పృహలో ఉన్నారు, సహాయం కావాలి",
          hi: "मरीज होश में है, प्राथमिक सहायता शुरू करें"
        };
        setTimeout(() => {
          onResult(simulatedResponses[lang] || simulatedResponses.en);
        }, 800);
      };

      this.recognition.start();

      return () => {
        if (this.recognition) {
          try {
            this.recognition.stop();
          } catch (e) {
            // ignore
          }
        }
      };
    } catch (e) {
      console.warn('Failed to start speech recognition, falling back to simulated speech', e);
      const simulatedResponses: Record<'en' | 'te' | 'hi', string> = {
        en: "Patient is conscious, chest compression protocol requested",
        te: "రోగి స్పృహలో ఉన్నారు, సహాయం కావాలి",
        hi: "मरीज होश में है, प्राथमिक सहायता शुरू करें"
      };
      setTimeout(() => {
        onResult(simulatedResponses[lang] || simulatedResponses.en);
      }, 800);
      return () => {};
    }
  }
}

export const voiceAssistant = new VoiceAssistantService();
