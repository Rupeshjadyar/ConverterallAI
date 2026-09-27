import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-audio-reverser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './audio-reverser.component.html',
  styleUrls: ['./audio-reverser.component.css']
})
export class AudioReverserComponent implements OnInit, OnDestroy {
  @ViewChild('waveformCanvas', { static: false }) waveformCanvas!: ElementRef<HTMLCanvasElement>;

  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  originalBuffer: AudioBuffer | null = null;
  reversedBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;

  fileName: string = '';
  isPlaying: boolean = false;
  isProcessing: boolean = false;

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

  onDrop(e: DragEvent): void {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) this.loadAudio(file);
  }

  onDragOver(e: DragEvent): void { e.preventDefault(); }

  async loadAudio(file: File): Promise<void> {
    if (!this.isBrowser || !this.audioCtx) return;
    this.isProcessing = true;

    try {
      const arrayBuf = await file.arrayBuffer();
      this.originalBuffer = await this.audioCtx.decodeAudioData(arrayBuf);
      this.fileName = file.name;
      this.processReverse();
    } catch (e) {
      alert('Failed to load audio file.');
    } finally {
      this.isProcessing = false;
    }
  }

  private processReverse(): void {
    if (!this.originalBuffer || !this.audioCtx) return;

    const numChan = this.originalBuffer.numberOfChannels;
    const length = this.originalBuffer.length;
    const sampleRate = this.originalBuffer.sampleRate;

    this.reversedBuffer = this.audioCtx.createBuffer(numChan, length, sampleRate);

    for (let c = 0; c < numChan; c++) {
      const src = this.originalBuffer.getChannelData(c);
      const dst = this.reversedBuffer.getChannelData(c);
      for (let i = 0; i < length; i++) {
        dst[i] = src[length - 1 - i];
      }
    }

    setTimeout(() => this.drawWaveform(), 50);
  }

  drawWaveform(): void {
    if (!this.waveformCanvas || !this.reversedBuffer) return;
    const canvas = this.waveformCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.parentElement?.clientWidth || 750;
    const height = canvas.height = 180;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    const pcm = this.reversedBuffer.getChannelData(0);
    const step = Math.ceil(pcm.length / width);
    const centerY = height / 2;

    ctx.fillStyle = '#ec4899';
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
  }

  playReversedAudio(): void {
    if (!this.reversedBuffer || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    this.stopPlayback();

    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.buffer = this.reversedBuffer;
    this.sourceNode.connect(this.audioCtx.destination);
    this.sourceNode.start(0);
    this.isPlaying = true;

    this.sourceNode.onended = () => { this.isPlaying = false; };
  }

  stopPlayback(): void {
    if (this.sourceNode) {
      try { this.sourceNode.stop(); } catch (e) {}
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  downloadReversedAudio(): void {
    if (!this.reversedBuffer) return;
    const wavBlob = this.bufferToWav(this.reversedBuffer);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reversed-${this.fileName || 'audio'}.wav`;
    a.click();
    URL.revokeObjectURL(url);
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
}
