import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-speed-changer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './speed-changer.component.html',
  styleUrls: ['./speed-changer.component.css']
})
export class SpeedChangerComponent implements OnInit, OnDestroy {
  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;

  fileName: string = '';
  speed: number = 1.25; // 0.25x to 3.0x
  isPlaying: boolean = false;
  isProcessing: boolean = false;

  presets = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5];

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
      const buf = await file.arrayBuffer();
      this.audioBuffer = await this.audioCtx.decodeAudioData(buf);
      this.fileName = file.name;
    } catch (e) {
      alert('Error loading audio file.');
    } finally {
      this.isProcessing = false;
    }
  }

  setSpeed(s: number): void {
    this.speed = s;
    if (this.sourceNode) {
      this.sourceNode.playbackRate.value = this.speed;
    }
  }

  playAudio(): void {
    if (!this.audioBuffer || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    this.stopPlayback();

    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.playbackRate.value = this.speed;

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

  async exportSpeedChangedAudio(): Promise<void> {
    if (!this.audioBuffer || !this.audioCtx) return;
    this.isProcessing = true;

    try {
      const srcLen = this.audioBuffer.length;
      const numChan = this.audioBuffer.numberOfChannels;
      const sampleRate = this.audioBuffer.sampleRate;
      const newLen = Math.floor(srcLen / this.speed);

      const newBuffer = this.audioCtx.createBuffer(numChan, newLen, sampleRate);

      for (let c = 0; c < numChan; c++) {
        const srcData = this.audioBuffer.getChannelData(c);
        const dstData = newBuffer.getChannelData(c);

        for (let i = 0; i < newLen; i++) {
          const srcIdx = i * this.speed;
          const idxFloor = Math.floor(srcIdx);
          const idxCeil = Math.min(srcLen - 1, idxFloor + 1);
          const frac = srcIdx - idxFloor;

          if (idxFloor < srcLen) {
            // Linear interpolation resampling
            dstData[i] = srcData[idxFloor] * (1 - frac) + srcData[idxCeil] * frac;
          }
        }
      }

      const wavBlob = this.bufferToWav(newBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `speed-${this.speed}x-${this.fileName || 'audio'}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed.');
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
