import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-audio-cutter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './audio-cutter.component.html',
  styleUrls: ['./audio-cutter.component.css']
})
export class AudioCutterComponent implements OnInit, OnDestroy {
  @ViewChild('waveformCanvas', { static: false }) waveformCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;

  fileName: string = '';
  duration: number = 0;
  currentTime: number = 0;
  startTime: number = 0;
  endTime: number = 0;

  isPlaying: boolean = false;
  isProcessing: boolean = false;
  processingMessage: string = '';
  fadeTransition: 'none' | 'in' | 'out' | 'both' = 'none';

  private playStartTime: number = 0;
  private animFrame: number | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
  }

  ngOnDestroy(): void {
    this.stopPlayback();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.loadAudio(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.loadAudio(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  async loadAudio(file: File): Promise<void> {
    if (!this.isBrowser || !this.audioCtx) return;
    this.isProcessing = true;
    this.processingMessage = 'Decoding audio file...';
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      this.fileName = file.name;
      this.duration = Number(this.audioBuffer.duration.toFixed(2));
      this.startTime = 0;
      this.endTime = this.duration;
      this.currentTime = 0;
      setTimeout(() => this.drawWaveform(), 50);
    } catch (e) {
      alert('Could not decode audio file. Please select a valid MP3, WAV, or AAC file.');
    } finally {
      this.isProcessing = false;
    }
  }

  drawWaveform(): void {
    if (!this.waveformCanvas || !this.audioBuffer) return;
    const canvas = this.waveformCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.height = 200;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const pcm = this.audioBuffer.getChannelData(0);
    const step = Math.ceil(pcm.length / width);
    const centerY = height / 2;

    ctx.fillStyle = '#6366f1';
    for (let i = 0; i < width; i++) {
      let min = 1.0, max = -1.0;
      for (let j = 0; j < step; j += 4) {
        const val = pcm[i * step + j] || 0;
        if (val < min) min = val;
        if (val > max) max = val;
      }
      const h = Math.max(2, (max - min) * (height / 2 - 10));
      ctx.fillRect(i, centerY - h / 2, 1, h);
    }

    // Cut Selection Highlight Range
    const startX = (this.startTime / this.duration) * width;
    const endX = (this.endTime / this.duration) * width;

    ctx.fillStyle = 'rgba(139, 92, 246, 0.35)';
    ctx.fillRect(startX, 0, Math.max(2, endX - startX), height);

    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(startX, 0); ctx.lineTo(startX, height); ctx.stroke();

    ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(endX, 0); ctx.lineTo(endX, height); ctx.stroke();

    // Playhead Line
    const playheadX = (this.currentTime / this.duration) * width;
    ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(playheadX, 0); ctx.lineTo(playheadX, height); ctx.stroke();
  }

  playSelection(): void {
    if (!this.audioBuffer || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    this.stopPlayback();

    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.audioCtx.destination);

    const durationToPlay = Math.max(0, this.endTime - this.startTime);
    this.sourceNode.start(0, this.startTime, durationToPlay);
    this.playStartTime = this.audioCtx.currentTime - this.startTime;
    this.isPlaying = true;

    this.sourceNode.onended = () => {
      this.isPlaying = false;
      this.currentTime = this.startTime;
      this.drawWaveform();
    };

    this.updateProgress();
  }

  stopPlayback(): void {
    if (this.sourceNode) {
      try { this.sourceNode.stop(); } catch (e) {}
      this.sourceNode = null;
    }
    this.isPlaying = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  updateProgress(): void {
    if (!this.isPlaying || !this.audioCtx) return;
    this.currentTime = this.audioCtx.currentTime - this.playStartTime;
    if (this.currentTime >= this.endTime) {
      this.stopPlayback();
      this.currentTime = this.startTime;
    }
    this.drawWaveform();
    this.animFrame = requestAnimationFrame(() => this.updateProgress());
  }

  onRangeChange(): void {
    if (this.startTime >= this.endTime) this.startTime = Math.max(0, this.endTime - 0.5);
    this.currentTime = this.startTime;
    this.drawWaveform();
  }

  async exportTrimmedAudio(): Promise<void> {
    if (!this.audioBuffer || !this.audioCtx) return;
    this.isProcessing = true;
    this.processingMessage = 'Slicing & Rendering Trimmed Track...';

    try {
      const sampleRate = this.audioBuffer.sampleRate;
      const startSample = Math.floor(this.startTime * sampleRate);
      const endSample = Math.floor(this.endTime * sampleRate);
      const trimmedLen = Math.max(1, endSample - startSample);

      const trimmedBuffer = this.audioCtx.createBuffer(
        this.audioBuffer.numberOfChannels,
        trimmedLen,
        sampleRate
      );

      for (let c = 0; c < this.audioBuffer.numberOfChannels; c++) {
        const srcData = this.audioBuffer.getChannelData(c);
        const dstData = trimmedBuffer.getChannelData(c);
        for (let i = 0; i < trimmedLen; i++) {
          dstData[i] = srcData[startSample + i];
        }

        // Apply Fade In / Fade Out if requested
        if (this.fadeTransition === 'in' || this.fadeTransition === 'both') {
          const fadeLen = Math.min(sampleRate * 1.5, trimmedLen);
          for (let i = 0; i < fadeLen; i++) dstData[i] *= (i / fadeLen);
        }
        if (this.fadeTransition === 'out' || this.fadeTransition === 'both') {
          const fadeLen = Math.min(sampleRate * 1.5, trimmedLen);
          for (let i = 0; i < fadeLen; i++) dstData[trimmedLen - 1 - i] *= (i / fadeLen);
        }
      }

      const wavBlob = this.bufferToWav(trimmedBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trimmed-${this.fileName || 'audio'}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error trimming audio.');
    } finally {
      this.isProcessing = false;
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

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
}
