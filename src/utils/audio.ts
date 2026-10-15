// Web Audio API Ambient Synthesizer & Speech Synthesis Utility

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let oscillators: OscillatorNode[] = [];
let isPlayingAmbient = false;

/**
 * Starts a gentle, soothing cyber-ambient background soundscape
 * Designed for study and concentration using harmonic sine waves with soft low-pass filter
 */
export function startAmbientSound(): boolean {
  try {
    if (isPlayingAmbient) return true;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return false;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Master gain node with smooth fade-in
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    // Very gentle ambient volume (max 0.04)
    masterGain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 3);

    // Warm Low-pass filter to keep it calm and non-intrusive
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    masterGain.connect(filter);
    filter.connect(audioCtx.destination);

    // Frequencies: 108Hz, 216Hz, 324Hz (subtle harmonic study chord)
    const frequencies = [108, 162, 216];
    oscillators = frequencies.map((freq) => {
      const osc = audioCtx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx!.currentTime);

      // Subtle LFO modulation for breathing drone effect
      const oscGain = audioCtx!.createGain();
      oscGain.gain.value = 0.33;
      osc.connect(oscGain);
      oscGain.connect(masterGain!);

      osc.start();
      return osc;
    });

    isPlayingAmbient = true;
    return true;
  } catch (err) {
    console.warn('Ambient sound could not start:', err);
    return false;
  }
}

/**
 * Stops ambient background sound with smooth fade-out
 */
export function stopAmbientSound(): void {
  try {
    if (!isPlayingAmbient || !audioCtx || !masterGain) return;

    // Smooth fade out
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    setTimeout(() => {
      oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      oscillators = [];
      isPlayingAmbient = false;
    }, 1300);
  } catch (err) {
    console.warn('Error stopping ambient sound:', err);
    isPlayingAmbient = false;
  }
}

export function getAmbientStatus(): boolean {
  return isPlayingAmbient;
}

/**
 * Text-to-speech reader for educational responses using Web Speech API
 */
export function speakText(
  text: string,
  lang: 'id' | 'en' = 'id',
  onEnd?: () => void
): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean markdown syntax from speech text
  const cleanText = text
    .replace(/```[\s\S]*?```/g, ' Bagian kode terlampir. ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*#_~]/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang === 'en' ? 'en-US' : 'id-ID';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
