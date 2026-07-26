import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-text-to-mp3',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './text-to-mp3.component.html',
  styleUrls: ['./text-to-mp3.component.css']
})
export class TextToMp3Component implements OnInit, OnDestroy {
  textInput: string = 'Welcome to ConverterallAI! Paste your text here and convert it into realistic studio-grade speech and audio instantly.';
  voices: SpeechSynthesisVoice[] = [];
  selectedVoiceIndex: number = 0;
  rate: number = 1.0;
  pitch: number = 1.0;
  volume: number = 1.0;

  isPlaying: boolean = false;
  isPaused: boolean = false;

  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  loadVoices(): void {
    if (!this.synthesis) return;
    this.voices = this.synthesis.getVoices();
    const preferredIndex = this.voices.findIndex(v => v.lang.includes('en-IN') || v.lang.includes('hi-IN') || v.lang.includes('en-US'));
    if (preferredIndex !== -1) {
      this.selectedVoiceIndex = preferredIndex;
    }
  }

  speak(): void {
    if (!this.synthesis || !this.textInput.trim()) return;

    if (this.isPaused) {
      this.synthesis.resume();
      this.isPlaying = true;
      this.isPaused = false;
      return;
    }

    this.synthesis.cancel();
    this.currentUtterance = new SpeechSynthesisUtterance(this.textInput);
    if (this.voices[this.selectedVoiceIndex]) {
      this.currentUtterance.voice = this.voices[this.selectedVoiceIndex];
    }
    this.currentUtterance.rate = this.rate;
    this.currentUtterance.pitch = this.pitch;
    this.currentUtterance.volume = this.volume;

    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
    };

    this.currentUtterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
    };

    this.currentUtterance.onerror = () => {
      this.isPlaying = false;
      this.isPaused = false;
    };

    this.synthesis.speak(this.currentUtterance);
  }

  pause(): void {
    if (!this.synthesis) return;
    if (this.isPlaying && !this.isPaused) {
      this.synthesis.pause();
      this.isPaused = true;
      this.isPlaying = false;
    }
  }

  stop(): void {
    if (!this.synthesis) return;
    this.synthesis.cancel();
    this.isPlaying = false;
    this.isPaused = false;
  }

  downloadSpeechAsAudio(): void {
    this.speak();
    const blob = new Blob([this.textInput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converterallai-speech-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  loadPreset(text: string): void {
    this.textInput = text;
  }
}
