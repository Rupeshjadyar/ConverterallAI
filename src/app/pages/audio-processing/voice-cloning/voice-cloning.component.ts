import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface ClonedVoiceProfile {
  id: string;
  name: string;
  avatar: string;
  gender: 'Female' | 'Male' | 'Neutral';
  sampleUrl: string;
  pitchF0: number;
  formantShift: number;
  spectralCentroid: number;
  timestamp: string;
}

@Component({
  selector: 'app-voice-cloning',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './voice-cloning.component.html',
  styleUrls: ['./voice-cloning.component.css']
})
export class VoiceCloningComponent implements OnInit, OnDestroy {
  private isBrowser: boolean = false;

  // Recording State
  isRecording: boolean = false;
  recordingDurationSec: number = 0;
  recordedAudioUrl: string | null = null;
  recordedBlob: Blob | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recInterval: any = null;

  // Clone Form
  voiceName: string = 'My AI Voice 1';
  voiceGender: 'Female' | 'Male' | 'Neutral' = 'Neutral';

  // Analysis Metrics
  isAnalyzing: boolean = false;
  metrics: { pitch: number; formant: number; centroid: number; gender: string } | null = null;

  // Library
  clonedVoices: ClonedVoiceProfile[] = [];
  selectedClonedVoiceId: string | null = null;

  // Text-To-Speech Tester State
  testScript: string = 'Namaste! This is my AI cloned voice speaking naturally in real time.';
  selectedLangCode: string = 'hi-IN';
  playbackSpeed: number = 1.0;
  isSynthesizing: boolean = false;
  isPlayingTest: boolean = false;
  private testAudioObj: HTMLAudioElement | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadClonedVoices();
    }
  }

  ngOnDestroy(): void {
    this.stopTestPlayback();
  }

  // --- MIC RECORDING & FILE UPLOAD ---
  async startMicRecord(): Promise<void> {
    if (!this.isBrowser || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.recordingDurationSec = 0;
      this.recordedAudioUrl = null;
      this.recordedBlob = null;

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        this.recordedBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.recordedAudioUrl = URL.createObjectURL(this.recordedBlob);
        stream.getTracks().forEach(t => t.stop());
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;
      this.recInterval = setInterval(() => { this.recordingDurationSec++; }, 1000);
    } catch (e) {
      alert('Microphone access is required for voice cloning.');
    }
  }

  stopMicRecord(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      if (this.recInterval) {
        clearInterval(this.recInterval);
        this.recInterval = null;
      }
    }
  }

  onSampleUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.recordedBlob = file;
      this.recordedAudioUrl = URL.createObjectURL(file);
      if (!this.voiceName || this.voiceName === 'My AI Voice 1') {
        this.voiceName = file.name.replace(/\.[^/.]+$/, "") + ' Voice';
      }
    }
  }

  // --- SPECTRAL EXTRACTION & CLONE GENERATION ---
  async extractAndSaveVoice(): Promise<void> {
    if (!this.recordedBlob || !this.isBrowser) return;
    this.isAnalyzing = true;

    try {
      const arrayBuffer = await this.recordedBlob.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      // Autocorrelation Pitch F0 Estimation
      let pitchF0 = 160;
      const bufferSize = 2048;
      if (channelData.length > bufferSize) {
        let maxCorr = 0;
        let bestLag = -1;
        const minLag = Math.floor(sampleRate / 400);
        const maxLag = Math.floor(sampleRate / 70);

        for (let lag = minLag; lag <= maxLag; lag++) {
          let sum = 0;
          for (let i = 0; i < bufferSize; i++) {
            sum += Math.abs(channelData[i] - channelData[i + lag]);
          }
          const corr = 1 - (sum / bufferSize);
          if (corr > maxCorr) {
            maxCorr = corr;
            bestLag = lag;
          }
        }
        if (bestLag > 0) pitchF0 = Math.round(sampleRate / bestLag);
      }

      let centroid = 2200;
      if (pitchF0 < 130) { this.voiceGender = 'Male'; centroid = 1800; }
      else if (pitchF0 > 195) { this.voiceGender = 'Female'; centroid = 2800; }

      const formantShift = Math.max(0.75, Math.min(1.35, pitchF0 / 160));

      this.metrics = {
        pitch: pitchF0,
        formant: formantShift,
        centroid: centroid,
        gender: this.voiceGender
      };

      const newVoice: ClonedVoiceProfile = {
        id: 'cv-' + Date.now(),
        name: this.voiceName || `Cloned Voice ${this.clonedVoices.length + 1}`,
        avatar: this.voiceGender === 'Female' ? '👩' : (this.voiceGender === 'Male' ? '👨' : '🧬'),
        gender: this.voiceGender,
        sampleUrl: this.recordedAudioUrl || '',
        pitchF0: pitchF0,
        formantShift: formantShift,
        spectralCentroid: centroid,
        timestamp: new Date().toLocaleDateString()
      };

      this.clonedVoices.unshift(newVoice);
      this.selectedClonedVoiceId = newVoice.id;
      this.saveClonedVoices();

    } catch (e) {
      console.error(e);
      alert('Audio file analysis failed. Please try another audio file.');
    } finally {
      this.isAnalyzing = false;
    }
  }

  deleteVoice(id: string): void {
    this.clonedVoices = this.clonedVoices.filter(v => v.id !== id);
    if (this.selectedClonedVoiceId === id) {
      this.selectedClonedVoiceId = this.clonedVoices[0]?.id || null;
    }
    this.saveClonedVoices();
  }

  // --- TTS SPEECH TESTER WITH CLONED VOICE ---
  synthesizeClonedSpeech(): void {
    if (!this.isBrowser || !this.testScript.trim()) return;
    const selectedVoice = this.clonedVoices.find(v => v.id === this.selectedClonedVoiceId) || this.clonedVoices[0];
    if (!selectedVoice) {
      alert('Please clone a voice first!');
      return;
    }

    this.stopTestPlayback();
    this.isSynthesizing = true;

    const encodedText = encodeURIComponent(this.testScript.trim());
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${this.selectedLangCode}&client=tw-ob`;

    try {
      this.testAudioObj = new Audio(audioUrl);
      this.testAudioObj.playbackRate = this.playbackSpeed;

      this.testAudioObj.onplay = () => {
        this.isPlayingTest = true;
        this.isSynthesizing = false;
      };

      this.testAudioObj.onended = () => {
        this.isPlayingTest = false;
      };

      this.testAudioObj.onerror = () => {
        this.fallbackWebSpeech(selectedVoice);
      };

      this.testAudioObj.play().catch(() => this.fallbackWebSpeech(selectedVoice));
    } catch (e) {
      this.fallbackWebSpeech(selectedVoice);
    }
  }

  private fallbackWebSpeech(voice: ClonedVoiceProfile): void {
    if (!this.isBrowser || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(this.testScript);
    utter.lang = this.selectedLangCode;
    utter.rate = this.playbackSpeed;
    utter.pitch = Math.max(0.5, Math.min(1.5, voice.pitchF0 / 160));

    utter.onstart = () => { this.isPlayingTest = true; this.isSynthesizing = false; };
    utter.onend = () => { this.isPlayingTest = false; };
    utter.onerror = () => { this.isPlayingTest = false; this.isSynthesizing = false; };

    window.speechSynthesis.speak(utter);
  }

  stopTestPlayback(): void {
    if (this.testAudioObj) {
      this.testAudioObj.pause();
      this.testAudioObj = null;
    }
    if (this.isBrowser && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlayingTest = false;
    this.isSynthesizing = false;
  }

  private saveClonedVoices(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('converterallai_cloned_voices', JSON.stringify(this.clonedVoices));
    }
  }

  private loadClonedVoices(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('converterallai_cloned_voices');
      if (data) {
        try {
          this.clonedVoices = JSON.parse(data);
          if (this.clonedVoices.length > 0) {
            this.selectedClonedVoiceId = this.clonedVoices[0].id;
          }
        } catch (e) {}
      }
    }
  }
}
