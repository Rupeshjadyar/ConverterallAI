import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface StudioTrack {
  id: string;
  name: string;
  duration: number;
  buffer: AudioBuffer;
  volume: number; // 0 to 100
  pan: number; // -100 (L) to +100 (R)
  isMuted: boolean;
  isSolo: boolean;
  color: string;
  peaksMin: Float32Array;
  peaksMax: Float32Array;
}

export interface AudioHistoryState {
  buffer: AudioBuffer;
  name: string;
}

@Component({
  selector: 'app-audio-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './audio-editor.component.html',
  styleUrls: ['./audio-editor.component.css']
})
export class AudioEditorComponent implements OnInit, OnDestroy {
  @ViewChild('waveformCanvas', { static: false }) waveformCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  private isBrowser: boolean = false;
  private audioCtx: AudioContext | null = null;
  public activeBuffer: AudioBuffer | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;

  // Clipboard State
  private clipboardBuffer: AudioBuffer | null = null;

  // Cached Peaks for 60FPS Silky Smooth Rendering (No Main-Thread Hanging!)
  private cachedPeaksMin: Float32Array | null = null;
  private cachedPeaksMax: Float32Array | null = null;
  private readonly CACHE_BINS: number = 1400;

  // Track & File State
  loadedFileName: string = 'No Audio Loaded';
  totalDuration: number = 0;
  currentTime: number = 0;
  isPlaying: boolean = false;
  isPaused: boolean = false;
  isLooping: boolean = false;

  // Zoom & Viewport Controls
  zoomLevel: number = 1;

  // Trimming Selection (in seconds)
  startTime: number = 0;
  endTime: number = 0;

  // Audio FX Controls
  playbackSpeed: number = 1.0;
  volumeGain: number = 100;
  isReversed: boolean = false;
  eqPreset: 'flat' | 'bass' | 'treble' | 'vocal' | 'lowpass' | 'highpass' = 'flat';
  
  // Advanced DSP Effects
  noiseGateThresholdDb: number = -60;

  // Multi-Track Studio Tracks
  tracks: StudioTrack[] = [];
  masterVolume: number = 100;

  // Recording State
  isRecording: boolean = false;
  recordingTimeSec: number = 0;
  private mediaRecorder: MediaRecorder | null = null;
  private recChunks: Blob[] = [];
  private recTimer: any = null;

  // History (Undo / Redo Stack)
  undoStack: AudioHistoryState[] = [];
  redoStack: AudioHistoryState[] = [];

  // Export State
  exportFormat: 'mp3' | 'wav' | 'ogg' | 'aac' = 'mp3';
  exportBitrate: string = '320kbps';
  isProcessing: boolean = false;
  processingMessage: string = '';

  private playStartTime: number = 0;
  private pauseOffset: number = 0;
  private animationFrameId: number | null = null;

  private trackColors: string[] = ['#8b5cf6', '#38bdf8', '#f43f5e', '#34d399', '#fbbf24', '#c084fc'];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initAudioContext();
    }
  }

  ngOnDestroy(): void {
    this.stopPlayback();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (!this.isBrowser) return;
    const targetEl = event.target as HTMLElement;
    if (targetEl && (targetEl.tagName === 'INPUT' || targetEl.tagName === 'TEXTAREA' || targetEl.tagName === 'SELECT')) {
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      this.isPlaying ? this.pauseAudio() : this.playAudio();
    } else if (event.code === 'KeyZ' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (event.shiftKey) this.redo();
      else this.undo();
    } else if (event.code === 'KeyC' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.copySelection();
    } else if (event.code === 'KeyV' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.pasteClipboard();
    } else if (event.code === 'Delete') {
      event.preventDefault();
      this.cutSelection();
    }
  }

  private initAudioContext(): void {
    if (!this.isBrowser) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      this.audioCtx = new AudioCtxClass();
    }
  }

  // --- FAST PEAK CACHING (PREVENTS HANGING / FREEZING) ---
  private buildPeakCache(buffer: AudioBuffer, numBins: number = 1400): { min: Float32Array; max: Float32Array } {
    const pcm = buffer.getChannelData(0);
    const step = Math.ceil(pcm.length / numBins);
    const min = new Float32Array(numBins);
    const max = new Float32Array(numBins);

    for (let i = 0; i < numBins; i++) {
      let minVal = 1.0;
      let maxVal = -1.0;
      const start = i * step;
      const end = Math.min(start + step, pcm.length);
      for (let j = start; j < end; j += 4) {
        const val = pcm[j];
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
      }
      min[i] = minVal;
      max[i] = maxVal;
    }
    return { min, max };
  }

  // --- FILE LOADING & RECORDING ---
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loadAudioFile(file);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.loadAudioFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  async loadAudioFile(file: File): Promise<void> {
    if (!this.isBrowser || !this.audioCtx) return;
    this.isProcessing = true;
    this.processingMessage = 'Decoding & Rendering Waveforms...';
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      
      this.pushHistoryState(decodedBuffer, file.name);
      this.setActiveBuffer(decodedBuffer, file.name);
      
      const trackColor = this.trackColors[this.tracks.length % this.trackColors.length];
      const peaks = this.buildPeakCache(decodedBuffer, 600);

      this.tracks.push({
        id: 'trk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        name: file.name.substring(0, 25),
        duration: decodedBuffer.duration,
        buffer: decodedBuffer,
        volume: 100,
        pan: 0,
        isMuted: false,
        isSolo: false,
        color: trackColor,
        peaksMin: peaks.min,
        peaksMax: peaks.max
      });

    } catch (e) {
      console.error('Audio load error:', e);
      alert('Failed to load audio file. Please try a valid MP3, WAV, or AAC file.');
    } finally {
      this.isProcessing = false;
      this.processingMessage = '';
    }
  }

  async loadPresetSample(preset: 'synth' | 'podcast' | 'beats' | 'noise'): Promise<void> {
    if (!this.isBrowser || !this.audioCtx) return;
    this.isProcessing = true;
    this.processingMessage = `Generating Demo Tone...`;

    try {
      const sampleRate = 44100;
      let duration = 10;
      const buffer = this.audioCtx.createBuffer(2, sampleRate * duration, sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          const t = i / sampleRate;
          if (preset === 'synth') {
            data[i] = (Math.sin(2 * Math.PI * 440 * t) + 0.5 * Math.sin(2 * Math.PI * 660 * t)) * Math.exp(-t / 4) * 0.35;
          } else if (preset === 'podcast') {
            data[i] = (Math.sin(2 * Math.PI * 220 * t) + 0.3 * Math.sin(2 * Math.PI * 330 * t)) * 0.3 * (1 + 0.4 * Math.sin(2 * Math.PI * 3 * t));
          } else if (preset === 'beats') {
            const beatEnv = Math.exp(-((t * 2) % 1) * 8);
            data[i] = (Math.sin(2 * Math.PI * 90 * t) * beatEnv + (Math.random() - 0.5) * 0.1 * (1 - beatEnv)) * 0.4;
          } else {
            data[i] = (Math.random() * 2 - 1) * 0.15;
          }
        }
      }

      this.pushHistoryState(buffer, `Demo Tone – ${preset.toUpperCase()}`);
      this.setActiveBuffer(buffer, `Demo Tone – ${preset.toUpperCase()}`);
    } catch (e) {
      console.error(e);
    } finally {
      this.isProcessing = false;
      this.processingMessage = '';
    }
  }

  async startMicRecord(): Promise<void> {
    if (!this.isBrowser || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.recChunks = [];
      this.recordingTimeSec = 0;

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recChunks.push(e.data);
      };

      this.mediaRecorder.onstop = async () => {
        const blob = new Blob(this.recChunks, { type: 'audio/wav' });
        const arrayBuf = await blob.arrayBuffer();
        if (this.audioCtx) {
          const buffer = await this.audioCtx.decodeAudioData(arrayBuf);
          const name = `Mic Rec (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
          this.pushHistoryState(buffer, name);
          this.setActiveBuffer(buffer, name);
        }
        stream.getTracks().forEach(t => t.stop());
      };

      this.mediaRecorder.start(100);
      this.isRecording = true;
      this.recTimer = setInterval(() => { this.recordingTimeSec++; }, 1000);
    } catch (e) {
      alert('Microphone access is required for recording.');
    }
  }

  stopMicRecord(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      if (this.recTimer) {
        clearInterval(this.recTimer);
        this.recTimer = null;
      }
    }
  }

  public setActiveBuffer(buffer: AudioBuffer, name: string): void {
    this.stopPlayback();
    this.activeBuffer = buffer;
    this.loadedFileName = name;
    this.totalDuration = buffer.duration;
    this.startTime = 0;
    this.endTime = Number(buffer.duration.toFixed(2));
    this.currentTime = 0;
    this.pauseOffset = 0;

    const cache = this.buildPeakCache(buffer, this.CACHE_BINS);
    this.cachedPeaksMin = cache.min;
    this.cachedPeaksMax = cache.max;

    this.drawWaveform();
  }

  // --- SILKY SMOOTH 60FPS CANVAS TIMELINE WAVEFORM RENDERING ---
  public drawWaveform(): void {
    if (!this.isBrowser || !this.waveformCanvas || !this.activeBuffer || !this.cachedPeaksMin || !this.cachedPeaksMax) return;
    const canvas = this.waveformCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.clientWidth || 900;
    const height = canvas.height = 320;

    ctx.clearRect(0, 0, width, height);

    // 1. Dark AudioLab DAW Timeline Background (#0d0f17)
    ctx.fillStyle = '#0d0f17';
    ctx.fillRect(0, 0, width, height);

    // 2. Top Time Ruler Bar (28px height)
    ctx.fillStyle = '#141724';
    ctx.fillRect(0, 0, width, 28);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 28); ctx.lineTo(width, 28); ctx.stroke();

    // Time Ruler Tick Labels (0s, 1s, 2s, 3s...)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    const totalSecs = Math.max(1, Math.ceil(this.totalDuration));
    const secWidth = width / totalSecs;

    for (let s = 0; s <= totalSecs; s++) {
      const x = s * secWidth;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath(); ctx.moveTo(x, 16); ctx.lineTo(x, 28); ctx.stroke();
      if (s % 1 === 0) {
        ctx.fillText(`${s}s`, x + 3, 14);
      }
    }

    // 3. Render Waveform (Fast Cached Peaks)
    const waveformAreaHeight = height - 28;
    const centerY = 28 + waveformAreaHeight / 2;
    const numBins = this.cachedPeaksMin.length;
    const binStep = width / numBins;

    const waveGrad = ctx.createLinearGradient(0, 28, 0, height);
    waveGrad.addColorStop(0, '#a78bfa');
    waveGrad.addColorStop(0.5, '#8b5cf6');
    waveGrad.addColorStop(1, '#6366f1');
    ctx.fillStyle = waveGrad;

    for (let i = 0; i < numBins; i++) {
      const minVal = this.cachedPeaksMin[i];
      const maxVal = this.cachedPeaksMax[i];
      const x = i * binStep;
      const yMin = centerY + minVal * (waveformAreaHeight / 2 - 15);
      const yMax = centerY + maxVal * (waveformAreaHeight / 2 - 15);
      const barHeight = Math.max(2, yMax - yMin);
      ctx.fillRect(x, yMin, Math.max(1, binStep), barHeight);
    }

    // Center Zero dB Axis Line
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke();

    // 4. Selection Range Overlay (Transparent Purple Highlight)
    if (this.totalDuration > 0) {
      const startX = (this.startTime / this.totalDuration) * width;
      const endX = (this.endTime / this.totalDuration) * width;

      ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
      ctx.fillRect(startX, 28, Math.max(2, endX - startX), waveformAreaHeight);

      // Start Marker Line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(startX, 28); ctx.lineTo(startX, height); ctx.stroke();

      // End Marker Line
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(endX, 28); ctx.lineTo(endX, height); ctx.stroke();

      // 5. Glowing Playhead Line (Purple Cursor)
      const playheadX = (this.currentTime / this.totalDuration) * width;
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(playheadX, 0); ctx.lineTo(playheadX, height); ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  onCanvasClick(event: MouseEvent): void {
    if (!this.waveformCanvas || !this.activeBuffer) return;
    const rect = this.waveformCanvas.nativeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    this.currentTime = ratio * this.totalDuration;
    this.pauseOffset = this.currentTime;
    if (this.isPlaying) {
      this.playAudio();
    } else {
      this.drawWaveform();
    }
  }

  // --- AUDIO PLAYBACK CONTROLS ---
  playAudio(): void {
    if (!this.isBrowser || !this.activeBuffer) return;
    if (!this.audioCtx) this.initAudioContext();
    if (this.audioCtx?.state === 'suspended') this.audioCtx.resume();

    this.stopPlayback();

    this.currentSourceNode = this.audioCtx!.createBufferSource();
    this.currentSourceNode.buffer = this.activeBuffer;
    this.currentSourceNode.playbackRate.value = this.playbackSpeed;
    this.currentSourceNode.loop = this.isLooping;
    if (this.isLooping) {
      this.currentSourceNode.loopStart = this.startTime;
      this.currentSourceNode.loopEnd = this.endTime;
    }

    const gainNode = this.audioCtx!.createGain();
    gainNode.gain.value = (this.volumeGain / 100) * (this.masterVolume / 100);

    const eqNode = this.audioCtx!.createBiquadFilter();
    if (this.eqPreset === 'bass') {
      eqNode.type = 'lowshelf'; eqNode.frequency.value = 250; eqNode.gain.value = 9;
    } else if (this.eqPreset === 'treble') {
      eqNode.type = 'highshelf'; eqNode.frequency.value = 4000; eqNode.gain.value = 9;
    } else if (this.eqPreset === 'vocal') {
      eqNode.type = 'peaking'; eqNode.frequency.value = 1800; eqNode.gain.value = 6;
    } else if (this.eqPreset === 'lowpass') {
      eqNode.type = 'lowpass'; eqNode.frequency.value = 1200;
    } else if (this.eqPreset === 'highpass') {
      eqNode.type = 'highpass'; eqNode.frequency.value = 800;
    } else {
      eqNode.type = 'peaking'; eqNode.frequency.value = 1000; eqNode.gain.value = 0;
    }

    this.currentSourceNode.connect(gainNode);
    gainNode.connect(eqNode);
    eqNode.connect(this.audioCtx!.destination);

    const startOffset = Math.max(this.startTime, this.pauseOffset);
    const durationToPlay = Math.max(0, this.endTime - startOffset);

    this.currentSourceNode.start(0, startOffset, this.isLooping ? undefined : durationToPlay);
    this.playStartTime = this.audioCtx!.currentTime - startOffset;
    this.isPlaying = true;
    this.isPaused = false;

    this.currentSourceNode.onended = () => {
      if (this.isPlaying && !this.isLooping) {
        this.isPlaying = false;
        this.currentTime = this.startTime;
        this.pauseOffset = this.startTime;
        this.drawWaveform();
      }
    };

    this.updatePlayheadProgress();
  }

  pauseAudio(): void {
    if (this.currentSourceNode && this.isPlaying) {
      this.pauseOffset = this.currentTime;
      this.stopPlayback();
      this.isPaused = true;
    }
  }

  stopPlayback(): void {
    if (this.currentSourceNode) {
      try { this.currentSourceNode.stop(); } catch (e) {}
      this.currentSourceNode = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updatePlayheadProgress(): void {
    if (!this.isPlaying || !this.audioCtx) return;
    this.currentTime = (this.audioCtx.currentTime - this.playStartTime) * this.playbackSpeed;
    
    if (!this.isLooping && this.currentTime >= this.endTime) {
      this.currentTime = this.endTime;
      this.stopPlayback();
      this.drawWaveform();
      return;
    }

    this.drawWaveform();
    this.animationFrameId = requestAnimationFrame(() => this.updatePlayheadProgress());
  }

  // --- TOOLBAR OPERATIONS (CUT, COPY, PASTE, TRIM, SPLIT, FADE IN/OUT, REVERSE) ---
  copySelection(): void {
    if (!this.activeBuffer || !this.audioCtx) return;
    const startSample = Math.floor(this.startTime * this.activeBuffer.sampleRate);
    const endSample = Math.floor(this.endTime * this.activeBuffer.sampleRate);
    const length = Math.max(1, endSample - startSample);

    this.clipboardBuffer = this.audioCtx.createBuffer(
      this.activeBuffer.numberOfChannels,
      length,
      this.activeBuffer.sampleRate
    );

    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const srcData = this.activeBuffer.getChannelData(c);
      const clipData = this.clipboardBuffer.getChannelData(c);
      for (let i = 0; i < length; i++) clipData[i] = srcData[startSample + i];
    }
  }

  pasteClipboard(): void {
    if (!this.activeBuffer || !this.clipboardBuffer || !this.audioCtx) return;
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-Paste)`);

    const pasteStartSample = Math.floor(this.currentTime * this.activeBuffer.sampleRate);
    const newLength = this.activeBuffer.length + this.clipboardBuffer.length;

    const newBuffer = this.audioCtx.createBuffer(
      this.activeBuffer.numberOfChannels,
      newLength,
      this.activeBuffer.sampleRate
    );

    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const oldData = this.activeBuffer.getChannelData(c);
      const clipData = this.clipboardBuffer.getChannelData(c);
      const newData = newBuffer.getChannelData(c);

      // Copy before paste pos
      for (let i = 0; i < pasteStartSample; i++) newData[i] = oldData[i];
      // Copy clipboard
      for (let i = 0; i < clipData.length; i++) newData[pasteStartSample + i] = clipData[i];
      // Copy after paste pos
      for (let i = pasteStartSample; i < oldData.length; i++) {
        newData[i + clipData.length] = oldData[i];
      }
    }

    this.setActiveBuffer(newBuffer, `${this.loadedFileName} (Pasted Clip)`);
  }

  cutSelection(): void {
    if (!this.activeBuffer || !this.audioCtx) return;
    this.copySelection();
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-Cut)`);

    const startSample = Math.floor(this.startTime * this.activeBuffer.sampleRate);
    const endSample = Math.floor(this.endTime * this.activeBuffer.sampleRate);
    const cutLength = endSample - startSample;
    const newLength = Math.max(1, this.activeBuffer.length - cutLength);

    const newBuffer = this.audioCtx.createBuffer(
      this.activeBuffer.numberOfChannels,
      newLength,
      this.activeBuffer.sampleRate
    );

    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const oldChan = this.activeBuffer.getChannelData(c);
      const newChan = newBuffer.getChannelData(c);
      for (let i = 0; i < startSample; i++) newChan[i] = oldChan[i];
      for (let i = endSample; i < oldChan.length; i++) newChan[i - cutLength] = oldChan[i];
    }

    this.setActiveBuffer(newBuffer, `${this.loadedFileName} (Cut)`);
  }

  trimToSelection(): void {
    if (!this.activeBuffer || !this.audioCtx) return;
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-Trim)`);

    const startSample = Math.floor(this.startTime * this.activeBuffer.sampleRate);
    const endSample = Math.floor(this.endTime * this.activeBuffer.sampleRate);
    const length = Math.max(1, endSample - startSample);

    const newBuffer = this.audioCtx.createBuffer(
      this.activeBuffer.numberOfChannels,
      length,
      this.activeBuffer.sampleRate
    );

    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const oldChan = this.activeBuffer.getChannelData(c);
      const newChan = newBuffer.getChannelData(c);
      for (let i = 0; i < length; i++) newChan[i] = oldChan[startSample + i];
    }

    this.setActiveBuffer(newBuffer, `${this.loadedFileName} (Trimmed)`);
  }

  splitAtPlayhead(): void {
    if (!this.activeBuffer || !this.audioCtx) return;
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-Split)`);

    const splitSample = Math.floor(this.currentTime * this.activeBuffer.sampleRate);
    if (splitSample <= 0 || splitSample >= this.activeBuffer.length) return;

    // Split into Part 1 and Part 2
    const part1 = this.audioCtx.createBuffer(this.activeBuffer.numberOfChannels, splitSample, this.activeBuffer.sampleRate);
    const part2 = this.audioCtx.createBuffer(this.activeBuffer.numberOfChannels, this.activeBuffer.length - splitSample, this.activeBuffer.sampleRate);

    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const oldData = this.activeBuffer.getChannelData(c);
      part1.getChannelData(c).set(oldData.subarray(0, splitSample));
      part2.getChannelData(c).set(oldData.subarray(splitSample));
    }

    const peaks1 = this.buildPeakCache(part1, 400);
    const peaks2 = this.buildPeakCache(part2, 400);

    this.tracks.push({
      id: 'trk-' + Date.now() + '-1',
      name: `${this.loadedFileName} (Part 1)`,
      duration: part1.duration,
      buffer: part1,
      volume: 100, pan: 0, isMuted: false, isSolo: false, color: '#38bdf8',
      peaksMin: peaks1.min, peaksMax: peaks1.max
    });

    this.tracks.push({
      id: 'trk-' + Date.now() + '-2',
      name: `${this.loadedFileName} (Part 2)`,
      duration: part2.duration,
      buffer: part2,
      volume: 100, pan: 0, isMuted: false, isSolo: false, color: '#a78bfa',
      peaksMin: peaks2.min, peaksMax: peaks2.max
    });

    this.setActiveBuffer(part1, `${this.loadedFileName} (Part 1)`);
  }

  applyFadeIn(): void {
    if (!this.activeBuffer) return;
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-FadeIn)`);

    const fadeSamples = Math.floor(1.5 * this.activeBuffer.sampleRate); // 1.5s Fade In
    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const data = this.activeBuffer.getChannelData(c);
      for (let i = 0; i < Math.min(fadeSamples, data.length); i++) {
        data[i] *= (i / fadeSamples);
      }
    }
    this.setActiveBuffer(this.activeBuffer, `${this.loadedFileName} (Fade In)`);
  }

  applyFadeOut(): void {
    if (!this.activeBuffer) return;
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-FadeOut)`);

    const fadeSamples = Math.floor(1.5 * this.activeBuffer.sampleRate);
    const total = this.activeBuffer.length;
    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const data = this.activeBuffer.getChannelData(c);
      for (let i = 0; i < Math.min(fadeSamples, total); i++) {
        data[total - 1 - i] *= (i / fadeSamples);
      }
    }
    this.setActiveBuffer(this.activeBuffer, `${this.loadedFileName} (Fade Out)`);
  }

  reverseAudio(): void {
    if (!this.activeBuffer || !this.audioCtx) return;
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-Reverse)`);

    const newBuffer = this.audioCtx.createBuffer(
      this.activeBuffer.numberOfChannels,
      this.activeBuffer.length,
      this.activeBuffer.sampleRate
    );

    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const oldChan = this.activeBuffer.getChannelData(c);
      const newChan = newBuffer.getChannelData(c);
      const len = oldChan.length;
      for (let i = 0; i < len; i++) newChan[i] = oldChan[len - 1 - i];
    }

    this.isReversed = !this.isReversed;
    this.setActiveBuffer(newBuffer, `${this.loadedFileName} (Reversed)`);
  }

  applySpeedToRender(): void {
    if (!this.activeBuffer || !this.audioCtx || this.playbackSpeed === 1.0) return;
    this.pushHistoryState(this.activeBuffer, `${this.loadedFileName} (Pre-Speed)`);

    const newLength = Math.floor(this.activeBuffer.length / this.playbackSpeed);
    const newBuffer = this.audioCtx.createBuffer(this.activeBuffer.numberOfChannels, newLength, this.activeBuffer.sampleRate);

    for (let c = 0; c < this.activeBuffer.numberOfChannels; c++) {
      const src = this.activeBuffer.getChannelData(c);
      const dst = newBuffer.getChannelData(c);
      for (let i = 0; i < newLength; i++) {
        const srcIdx = Math.floor(i * this.playbackSpeed);
        if (srcIdx < src.length) dst[i] = src[srcIdx];
      }
    }

    this.playbackSpeed = 1.0;
    this.setActiveBuffer(newBuffer, `${this.loadedFileName} (Resampled)`);
  }

  // --- MULTI-TRACK MIXER OPERATIONS ---
  mergeStudioTracks(): void {
    if (this.tracks.length === 0 || !this.audioCtx) return;
    let maxSamples = 0;
    const sampleRate = this.tracks[0].buffer.sampleRate;

    this.tracks.forEach(t => {
      if (t.buffer.length > maxSamples) maxSamples = t.buffer.length;
    });

    const masterBuf = this.audioCtx.createBuffer(2, maxSamples, sampleRate);
    const masterLeft = masterBuf.getChannelData(0);
    const masterRight = masterBuf.getChannelData(1);

    this.tracks.forEach(track => {
      if (track.isMuted) return;
      const vol = (track.volume / 100);
      const panL = Math.min(1, 1 - (track.pan / 100));
      const panR = Math.min(1, 1 + (track.pan / 100));

      const trkLeft = track.buffer.getChannelData(0);
      const trkRight = track.buffer.numberOfChannels > 1 ? track.buffer.getChannelData(1) : trkLeft;

      for (let i = 0; i < trkLeft.length; i++) {
        masterLeft[i] += trkLeft[i] * vol * panL * 0.5;
        masterRight[i] += trkRight[i] * vol * panR * 0.5;
      }
    });

    const name = `Merged Mix (${this.tracks.length} Tracks)`;
    this.pushHistoryState(masterBuf, name);
    this.setActiveBuffer(masterBuf, name);
  }

  toggleTrackMute(track: StudioTrack): void {
    track.isMuted = !track.isMuted;
  }

  removeTrack(index: number): void {
    this.tracks.splice(index, 1);
  }

  // --- UNDO / REDO HISTORY ---
  private pushHistoryState(buffer: AudioBuffer, name: string): void {
    const clone = this.cloneBuffer(buffer);
    this.undoStack.push({ buffer: clone, name: name });
    if (this.undoStack.length > 20) this.undoStack.shift();
    this.redoStack = [];
  }

  undo(): void {
    if (this.undoStack.length < 2) return;
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    const previous = this.undoStack[this.undoStack.length - 1];
    if (previous) {
      this.setActiveBuffer(this.cloneBuffer(previous.buffer), previous.name);
    }
  }

  redo(): void {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    this.setActiveBuffer(this.cloneBuffer(next.buffer), next.name);
  }

  private cloneBuffer(src: AudioBuffer): AudioBuffer {
    if (!this.audioCtx) this.initAudioContext();
    const dst = this.audioCtx!.createBuffer(src.numberOfChannels, src.length, src.sampleRate);
    for (let c = 0; c < src.numberOfChannels; c++) {
      dst.getChannelData(c).set(src.getChannelData(c));
    }
    return dst;
  }

  // --- EXPORT & DOWNLOAD ---
  async exportAudioFile(): Promise<void> {
    if (!this.activeBuffer || !this.isBrowser) return;
    this.isProcessing = true;
    this.processingMessage = `Encoding & Exporting ${this.exportFormat.toUpperCase()} Audio...`;

    try {
      const wavBlob = this.bufferToWav(this.activeBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `edited-audio-${Date.now()}.${this.exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      this.isProcessing = false;
      this.processingMessage = '';
    }
  }

  private bufferToWav(abuffer: AudioBuffer): Blob {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    let channels: Float32Array[] = [];
    let sampleRate = abuffer.sampleRate;
    let pos = 0, offset = 0;

    function setUint32(d: number) { out.setUint32(pos, d, true); pos += 4; }
    function setUint16(d: number) { out.setUint16(pos, d, true); pos += 2; }

    setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
    setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
    setUint32(sampleRate); setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([out], { type: 'audio/wav' });
  }

  formatTime(sec: number): string {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}s`;
  }
}
