import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-audio-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './audio-compressor.component.html',
  styleUrls: ['./audio-compressor.component.css']
})
export class AudioCompressorComponent implements OnInit, OnDestroy {
  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;
  compressorNode: DynamicsCompressorNode | null = null;

  fileName: string = '';
  isPlaying: boolean = false;
  isProcessing: boolean = false;

  threshold: number = -24; // -100 to 0 dB
  knee: number = 30; // 0 to 40 dB
  ratio: number = 4; // 1 to 20
  attack: number = 0.003; // 0 to 1 sec
  release: number = 0.25; // 0 to 1 sec

  selectedPreset: string = 'vocal';

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
      alert('Could not decode audio.');
    } finally {
      this.isProcessing = false;
    }
  }

  applyPreset(p: string): void {
    this.selectedPreset = p;
    if (p === 'vocal') {
      this.threshold = -24; this.knee = 30; this.ratio = 4; this.attack = 0.003; this.release = 0.25;
    } else if (p === 'punch') {
      this.threshold = -18; this.knee = 12; this.ratio = 8; this.attack = 0.01; this.release = 0.1;
    } else if (p === 'radio') {
      this.threshold = -32; this.knee = 40; this.ratio = 12; this.attack = 0.001; this.release = 0.4;
    } else if (p === 'subtle') {
      this.threshold = -12; this.knee = 20; this.ratio = 2; this.attack = 0.05; this.release = 0.3;
    }
    this.updateCompressorValues();
  }

  updateCompressorValues(): void {
    if (this.compressorNode) {
      this.compressorNode.threshold.value = this.threshold;
      this.compressorNode.knee.value = this.knee;
      this.compressorNode.ratio.value = this.ratio;
      this.compressorNode.attack.value = this.attack;
      this.compressorNode.release.value = this.release;
    }
  }

  playAudio(): void {
    if (!this.audioBuffer || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    this.stopPlayback();

    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;

    this.compressorNode = this.audioCtx.createDynamicsCompressor();
    this.updateCompressorValues();

    this.sourceNode.connect(this.compressorNode);
    this.compressorNode.connect(this.audioCtx.destination);

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

  async exportCompressedAudio(): Promise<void> {
    if (!this.audioBuffer || !this.audioCtx) return;
    this.isProcessing = true;

    try {
      const offlineCtx = new OfflineAudioContext(
        this.audioBuffer.numberOfChannels,
        this.audioBuffer.length,
        this.audioBuffer.sampleRate
      );

      const src = offlineCtx.createBufferSource();
      src.buffer = this.audioBuffer;

      const comp = offlineCtx.createDynamicsCompressor();
      comp.threshold.value = this.threshold;
      comp.knee.value = this.knee;
      comp.ratio.value = this.ratio;
      comp.attack.value = this.attack;
      comp.release.value = this.release;

      src.connect(comp);
      comp.connect(offlineCtx.destination);

      src.start(0);
      const renderedBuffer = await offlineCtx.startRendering();

      const wavBlob = this.bufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${this.selectedPreset}-${this.fileName || 'audio'}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Compressor export failed.');
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
