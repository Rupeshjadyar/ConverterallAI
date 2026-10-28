/**
 * Typing Speed Test - Web Audio Synthesizer (Zero External Dependencies)
 * Generates mechanical clicks, typewriter sounds, soft beeps, error buzzes, and fanfare
 * Namespace: window.TypeApp.Sound
 */

window.TypeApp = window.TypeApp || {};

(function() {
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const Sound = {
    playKey(isError = false) {
      const settings = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : { soundEnabled: true, soundVolume: 0.5, soundType: 'mechanical' };
      if (!settings.soundEnabled) return;

      const ctx = getAudioContext();
      if (!ctx) return;

      const volume = Math.max(0.01, Math.min(1, settings.soundVolume || 0.5));

      if (isError) {
        this.playErrorBuzz(ctx, volume);
        return;
      }

      switch (settings.soundType) {
        case 'typewriter':
          this.playTypewriterClick(ctx, volume);
          break;
        case 'softbeep':
          this.playSoftBeep(ctx, volume);
          break;
        case 'errorbuzz':
          // subtle tick for normal key
          this.playMechanicalClick(ctx, volume * 0.7);
          break;
        case 'mechanical':
        default:
          this.playMechanicalClick(ctx, volume);
          break;
      }
    },

    /**
     * Mechanical Keyboard Click (Cherry MX Blue / Brown inspired dual-transient click)
     */
    playMechanicalClick(ctx, vol) {
      const t = ctx.currentTime;
      // High frequency click transient
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Pitch variation slightly per keypress for realism
      const pitchVar = 0.9 + Math.random() * 0.2;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 * pitchVar, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.035);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, t);
      filter.Q.setValueAtTime(3.0, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.45, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.045);

      // Low tactile thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(160, t);
      thud.frequency.exponentialRampToValueAtTime(40, t + 0.03);

      thudGain.gain.setValueAtTime(vol * 0.35, t);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      thud.connect(thudGain);
      thudGain.connect(ctx.destination);

      thud.start(t);
      thud.stop(t + 0.035);
    },

    /**
     * Vintage Typewriter Strike (Crisp metal on ribbon impact)
     */
    playTypewriterClick(ctx, vol) {
      const t = ctx.currentTime;
      // Synthesized noise burst for mechanical clatter
      const bufferSize = ctx.sampleRate * 0.025;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, t);
      filter.Q.setValueAtTime(4, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol * 0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t);
    },

    /**
     * Soft Minimalist Beep (Modern subtle tone)
     */
    playSoftBeep(ctx, vol) {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freqs = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5 major pentatonic
      const f = freqs[Math.floor(Math.random() * freqs.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(vol * 0.25, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.07);
    },

    /**
     * Low Error Buzz
     */
    playErrorBuzz(ctx, vol) {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.08);

      gain.gain.setValueAtTime(vol * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.085);
    },

    /**
     * Celebration Chime for Completion or PB
     */
    playFanfare() {
      const settings = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : { soundEnabled: true, soundVolume: 0.5 };
      if (!settings.soundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const vol = Math.max(0.01, Math.min(1, settings.soundVolume || 0.5)) * 0.4;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const t = now + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.26);
      });
    }
  };

  window.TypeApp.Sound = Sound;
})();
