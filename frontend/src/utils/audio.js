// Web Audio API DTMF Tone Generator and Speech Utilities

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const DTMF_FREQS = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

/** Plays authentic dual-tone multi-frequency phone keypad sound */
export function playDtmfTone(key, durationMs = 120) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = DTMF_FREQS[key] || [800, 1200];
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = freqs[0];
    osc2.frequency.value = freqs[1];

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + durationMs / 1000);
    osc2.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    console.debug('Audio context not allowed yet:', e);
  }
}

/** Plays classic phone ringing tone */
export function playRingtone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return null;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.value = 400;
    osc2.frequency.value = 450;

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime + 1.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);
  } catch (e) {
    console.debug('Ringtone error:', e);
  }
}

/** Plays hangup busy tone */
export function playHangupTone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 480;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.debug('Hangup tone error:', e);
  }
}

/** Speaks text using Web Speech API with Punjabi voice preference */
export function speakPunjabiText(text, onStart, onEnd) {
  if (!window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Look for Punjabi or Indian English/Hindi voice
  const voices = window.speechSynthesis.getVoices();
  const paVoice = voices.find(v => v.lang.includes('pa') || v.name.toLowerCase().includes('punjabi'));
  const hiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
  
  if (paVoice) {
    utterance.voice = paVoice;
    utterance.lang = 'pa-IN';
  } else if (hiVoice) {
    utterance.voice = hiVoice;
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

/** Stops any active speech */
export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
