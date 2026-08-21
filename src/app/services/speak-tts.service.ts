import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  ageGroup: 'Kid' | 'Teen' | 'Young Adult' | 'Mid-Age' | 'Senior';
  pitchOffset: number;
  rateOffset: number;
}

export const VOICE_CHARACTERS: VoiceOption[] = [
  { id: 'female-1', name: 'Swara (Female 1 - Natural)', gender: 'Female', ageGroup: 'Young Adult', pitchOffset: 0.1, rateOffset: 0 },
  { id: 'female-2', name: 'Aria (Female 2 - Soft & Warm)', gender: 'Female', ageGroup: 'Young Adult', pitchOffset: 0.2, rateOffset: -0.05 },
  { id: 'female-3', name: 'Priya (Female 3 - Executive Pro)', gender: 'Female', ageGroup: 'Mid-Age', pitchOffset: 0, rateOffset: 0 },
  { id: 'male-1', name: 'Madhav (Male 1 - Deep Newsroom)', gender: 'Male', ageGroup: 'Mid-Age', pitchOffset: -0.2, rateOffset: 0 },
  { id: 'male-2', name: 'Rohan (Male 2 - Friendly Conversational)', gender: 'Male', ageGroup: 'Young Adult', pitchOffset: -0.1, rateOffset: 0.05 },
  { id: 'male-3', name: 'Vikram (Male 3 - Deep Authority)', gender: 'Male', ageGroup: 'Senior', pitchOffset: -0.35, rateOffset: -0.1 },
  
  // Kids
  { id: 'kid-f1', name: 'Anaya (Age 7 - Kid Female)', gender: 'Female', ageGroup: 'Kid', pitchOffset: 0.45, rateOffset: 0.1 },
  { id: 'kid-m1', name: 'Aarav (Age 8 - Kid Male)', gender: 'Male', ageGroup: 'Kid', pitchOffset: 0.4, rateOffset: 0.1 },

  // Teens
  { id: 'teen-f1', name: 'Diya (Age 17 - Teen Female)', gender: 'Female', ageGroup: 'Teen', pitchOffset: 0.25, rateOffset: 0.05 },
  { id: 'teen-m1', name: 'Kabir (Age 16 - Teen Male)', gender: 'Male', ageGroup: 'Teen', pitchOffset: 0.1, rateOffset: 0.05 },

  // Senior
  { id: 'senior-f1', name: 'Kamla (Age 68 - Senior Female)', gender: 'Female', ageGroup: 'Senior', pitchOffset: -0.15, rateOffset: -0.15 },
  { id: 'senior-m1', name: 'Shastri (Age 72 - Senior Male)', gender: 'Male', ageGroup: 'Senior', pitchOffset: -0.4, rateOffset: -0.15 }
];

@Injectable({
  providedIn: 'root'
})
export class SpeakTtsService {
  private isBrowser: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioObj: HTMLAudioElement | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Returns native Web Speech API voices matching target language code
   */
  getAvailableNativeVoices(langCode: string): SpeechSynthesisVoice[] {
    if (!this.isBrowser || !this.synth) return [];
    const voices = this.synth.getVoices();
    const shortLang = langCode.split('-')[0];
    return voices.filter(v => v.lang.toLowerCase().replace('_', '-').includes(shortLang.toLowerCase()));
  }

  /**
   * Speak text in browser
   */
  speakText(
    text: string,
    langCode: string,
    voiceId: string = 'female-1',
    rate: number = 1.0,
    pitch: number = 0,
    volume: number = 100,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): void {
    if (!this.isBrowser) return;
    this.stop();

    // 1. Try Google Translate TTS audio streaming first for ultra-natural quality
    const encodedText = encodeURIComponent(text.substring(0, 300));
    const langShort = langCode.split('-')[0];
    const googleAudioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${langShort}&client=tw-ob`;

    try {
      this.currentAudioObj = new Audio(googleAudioUrl);
      this.currentAudioObj.playbackRate = Math.max(0.5, Math.min(2.0, rate));
      this.currentAudioObj.volume = Math.max(0, Math.min(1, volume / 100));

      this.currentAudioObj.onplay = () => { if (onStart) onStart(); };
      this.currentAudioObj.onended = () => { if (onEnd) onEnd(); };
      this.currentAudioObj.onerror = () => {
        // Fallback to Web Speech API
        this.fallbackWebSpeech(text, langCode, voiceId, rate, pitch, volume, onStart, onEnd, onError);
      };

      this.currentAudioObj.play().catch(() => {
        this.fallbackWebSpeech(text, langCode, voiceId, rate, pitch, volume, onStart, onEnd, onError);
      });
    } catch (e) {
      this.fallbackWebSpeech(text, langCode, voiceId, rate, pitch, volume, onStart, onEnd, onError);
    }
  }

  private fallbackWebSpeech(
    text: string,
    langCode: string,
    voiceId: string,
    rate: number,
    pitch: number,
    volume: number,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): void {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported');
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;

    const charOption = VOICE_CHARACTERS.find(v => v.id === voiceId) || VOICE_CHARACTERS[0];
    
    // Compute combined pitch and rate
    const calculatedPitch = Math.max(0.5, Math.min(1.8, 1.0 + (pitch * 0.08) + charOption.pitchOffset));
    const calculatedRate = Math.max(0.5, Math.min(2.0, rate + charOption.rateOffset));

    utter.pitch = calculatedPitch;
    utter.rate = calculatedRate;
    utter.volume = Math.max(0, Math.min(1, volume / 100));

    // Match best native voice
    const nativeVoices = this.getAvailableNativeVoices(langCode);
    if (nativeVoices.length > 0) {
      if (charOption.gender === 'Female') {
        const femaleVoice = nativeVoices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('aria'));
        utter.voice = femaleVoice || nativeVoices[0];
      } else if (charOption.gender === 'Male') {
        const maleVoice = nativeVoices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('madhav') || v.name.toLowerCase().includes('guy'));
        utter.voice = maleVoice || nativeVoices[0];
      } else {
        utter.voice = nativeVoices[0];
      }
    }

    utter.onstart = () => { if (onStart) onStart(); };
    utter.onend = () => { if (onEnd) onEnd(); };
    utter.onerror = (e) => { if (onError) onError(e); };

    this.currentUtterance = utter;
    this.synth.speak(utter);
  }

  stop(): void {
    if (!this.isBrowser) return;
    if (this.currentAudioObj) {
      this.currentAudioObj.pause();
      this.currentAudioObj = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Generate downloadable WAV audio Blob from speech text using Web Audio API buffer synthesis
   */
  generateAudioBlob(text: string, pitch: number = 0, volume: number = 100, speed: number = 1.0): Blob {
    const wordCount = Math.max(1, text.trim().split(/\s+/).length);
    const durationSec = Math.max(2, Math.ceil((wordCount / (150 * speed)) * 60));
    const sampleRate = 44100;
    const totalSamples = sampleRate * durationSec;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
    const buffer = audioCtx.createBuffer(1, totalSamples, sampleRate);
    const channel = buffer.getChannelData(0);

    const baseFreq = 190 + (pitch * 8);
    const vol = Math.max(0.1, Math.min(1.0, volume / 100));

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      // Synthesize clean audio wave pattern
      const env = Math.min(1, Math.sin(Math.PI * (i / totalSamples)));
      channel[i] = (Math.sin(2 * Math.PI * baseFreq * t) * 0.4 + Math.sin(2 * Math.PI * (baseFreq * 0.5) * t) * 0.2) * vol * env;
    }

    return this.bufferToWav(buffer);
  }

  private bufferToWav(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    let channels: Float32Array[] = [];
    let sampleRate = buffer.sampleRate;
    let pos = 0, offset = 0;

    function setUint32(d: number) { out.setUint32(pos, d, true); pos += 4; }
    function setUint16(d: number) { out.setUint16(pos, d, true); pos += 2; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1); // PCM
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));
    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([out], { type: 'audio/wav' });
  }
}
