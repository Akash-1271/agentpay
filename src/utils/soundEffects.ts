// Synthesized fintech audio soundbox chime using Web Audio API (zero external assets)

export const playPaymentSuccessChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic dual chime notes (A5: 880Hz, E6: 1318.5Hz)
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth envelope attack and decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playNote(880, now, 0.35);         // First note
    playNote(1318.5, now + 0.12, 0.45); // Higher cheerful note
  } catch (err) {
    // Audio context may be blocked by browser autoplay policy if no interaction
  }
};
