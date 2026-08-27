// Speech synthesis narrator for luxury agent experience

let voiceEnabled = false;

export const isVoiceEnabled = () => voiceEnabled;

export const setVoiceEnabled = (enabled: boolean) => {
  voiceEnabled = enabled;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    if (!enabled) {
      window.speechSynthesis.cancel();
    } else {
      speakAgentMessage('AgentPay Voice Narrator is now active.');
    }
  }
};

export const speakAgentMessage = (text: string) => {
  if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/₹/g, 'Rupees ').replace(/HMAC/g, 'H-MAC');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang.includes('en-GB') || v.lang.includes('en-US')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
};
