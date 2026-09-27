import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-volume-booster',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './volume-booster.component.html',
  styleUrls: ['./volume-booster.component.css']
})
export class VolumeBoosterComponent implements OnInit, OnDestroy {
  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;
  gainNode: GainNode | null = null;

  fileName: string = '';
  volumeLevel: number = 200; // 100% to 500%
  enableLimiter: boolean = true;
  isPlaying: boolean = false;
  isProcessing: boolean = false;
  Math = Math;

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

  onDragOver(e: DragEvent): void { e.preventDefault(); }

  async loadAudio(file: File): Promise<void> {
    if (!this.isBrowser || !this.audioCtx) return;
    this.isProcessing = true;
    try {
      const buf = await file.arrayBuffer();
      this.audioBuffer = await this.audioCtx.decodeAudioData(buf);
      this.fileName = file.name;
    } catch (e) {
      alert('Could not load audio file.');
    } finally {
      this.isProcessing = false;
    }
  }

  playAudio(): void {
    if (!this.audioBuffer || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    this.stopPlayback();

    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;

    this.gainNode = this.audioCtx.createGain();
    this.updateGainValue();

    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.sourceNode.start(0);
    this.isPlaying = true;

    this.sourceNode.onended = () => { this.isPlaying = false; };
  }

  updateGainValue(): void {
    if (this.gainNode) {
      this.gainNode.gain.value = this.volumeLevel / 100;
    }
  }

  stopPlayback(): void {
    if (this.sourceNode) {
      try { this.sourceNode.stop(); } catch (e) {}
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  async exportBoostedAudio(): Promise<void> {
    if (!this.audioBuffer || !this.audioCtx) return;
    this.isProcessing = true;

    try {
      const factor = this.volumeLevel / 100;
      const numChannels = this.audioBuffer.numberOfChannels;
      const length = this.audioBuffer.length;
      const sampleRate = this.audioBuffer.sampleRate;

      const boostedBuffer = this.audioCtx.createBuffer(numChannels, length, sampleRate);

      for (let c = 0; c < numChannels; c++) {
        const src = this.audioBuffer.getChannelData(c);
        const dst = boostedBuffer.getChannelData(c);
        for (let i = 0; i < length; i++) {
          let val = src[i] * factor;
          if (this.enableLimiter) {
            // Soft-knee limiter compression to prevent harsh digital clipping
            val = Math.tanh(val);
          } else {
            val = Math.max(-1, Math.min(1, val));
          }
          dst[i] = val;
        }
      }

      const wavBlob = this.bufferToWav(boostedBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boosted-${this.volumeLevel}pct-${this.fileName || 'audio'}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to export audio.');
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
}
