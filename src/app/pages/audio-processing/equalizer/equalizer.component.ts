import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface EqBand {
  label: string;
  freq: number;
  type: BiquadFilterType;
  gain: number; // -12 to +12 dB
}

@Component({
  selector: 'app-equalizer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './equalizer.component.html',
  styleUrls: ['./equalizer.component.css']
})
export class EqualizerComponent implements OnInit, OnDestroy {
  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;
  filterNodes: BiquadFilterNode[] = [];

  fileName: string = '';
  isPlaying: boolean = false;
  isProcessing: boolean = false;

  bands: EqBand[] = [
    { label: 'Bass (60Hz)', freq: 60, type: 'lowshelf', gain: 0 },
    { label: 'Low-Mid (250Hz)', freq: 250, type: 'peaking', gain: 0 },
    { label: 'Mid (1kHz)', freq: 1000, type: 'peaking', gain: 0 },
    { label: 'High-Mid (4kHz)', freq: 4000, type: 'peaking', gain: 0 },
    { label: 'Treble (12kHz)', freq: 12000, type: 'highshelf', gain: 0 }
  ];

  selectedPreset: string = 'flat';

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

  applyPreset(preset: string): void {
    this.selectedPreset = preset;
    if (preset === 'bass') {
      this.bands = [
        { label: 'Bass (60Hz)', freq: 60, type: 'lowshelf', gain: 9 },
        { label: 'Low-Mid (250Hz)', freq: 250, type: 'peaking', gain: 5 },
        { label: 'Mid (1kHz)', freq: 1000, type: 'peaking', gain: -1 },
        { label: 'High-Mid (4kHz)', freq: 4000, type: 'peaking', gain: 2 },
        { label: 'Treble (12kHz)', freq: 12000, type: 'highshelf', gain: 3 }
      ];
    } else if (preset === 'treble') {
      this.bands = [
        { label: 'Bass (60Hz)', freq: 60, type: 'lowshelf', gain: -3 },
        { label: 'Low-Mid (250Hz)', freq: 250, type: 'peaking', gain: 0 },
        { label: 'Mid (1kHz)', freq: 1000, type: 'peaking', gain: 2 },
        { label: 'High-Mid (4kHz)', freq: 4000, type: 'peaking', gain: 6 },
        { label: 'Treble (12kHz)', freq: 12000, type: 'highshelf', gain: 10 }
      ];
    } else if (preset === 'vocal') {
      this.bands = [
        { label: 'Bass (60Hz)', freq: 60, type: 'lowshelf', gain: -4 },
        { label: 'Low-Mid (250Hz)', freq: 250, type: 'peaking', gain: 2 },
        { label: 'Mid (1kHz)', freq: 1000, type: 'peaking', gain: 6 },
        { label: 'High-Mid (4kHz)', freq: 4000, type: 'peaking', gain: 4 },
        { label: 'Treble (12kHz)', freq: 12000, type: 'highshelf', gain: 1 }
      ];
    } else if (preset === 'edm') {
      this.bands = [
        { label: 'Bass (60Hz)', freq: 60, type: 'lowshelf', gain: 10 },
        { label: 'Low-Mid (250Hz)', freq: 250, type: 'peaking', gain: 3 },
        { label: 'Mid (1kHz)', freq: 1000, type: 'peaking', gain: -2 },
        { label: 'High-Mid (4kHz)', freq: 4000, type: 'peaking', gain: 4 },
        { label: 'Treble (12kHz)', freq: 12000, type: 'highshelf', gain: 8 }
      ];
    } else {
      this.bands = [
        { label: 'Bass (60Hz)', freq: 60, type: 'lowshelf', gain: 0 },
        { label: 'Low-Mid (250Hz)', freq: 250, type: 'peaking', gain: 0 },
        { label: 'Mid (1kHz)', freq: 1000, type: 'peaking', gain: 0 },
        { label: 'High-Mid (4kHz)', freq: 4000, type: 'peaking', gain: 0 },
        { label: 'Treble (12kHz)', freq: 12000, type: 'highshelf', gain: 0 }
      ];
    }
    this.updateFilterGains();
  }

  updateFilterGains(): void {
    if (this.filterNodes.length === this.bands.length) {
      this.filterNodes.forEach((node, idx) => {
        node.gain.value = this.bands[idx].gain;
      });
    }
  }

  playAudio(): void {
    if (!this.audioBuffer || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    this.stopPlayback();

    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;

    this.filterNodes = this.bands.map(b => {
      const node = this.audioCtx!.createBiquadFilter();
      node.type = b.type;
      node.frequency.value = b.freq;
      node.gain.value = b.gain;
      return node;
    });

    // Connect source -> filter1 -> filter2 -> ... -> destination
    let current: AudioNode = this.sourceNode;
    this.filterNodes.forEach(f => {
      current.connect(f);
      current = f;
    });
    current.connect(this.audioCtx.destination);

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

  async exportEqualizedAudio(): Promise<void> {
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

      const filters = this.bands.map(b => {
        const node = offlineCtx.createBiquadFilter();
        node.type = b.type;
        node.frequency.value = b.freq;
        node.gain.value = b.gain;
        return node;
      });

      let current: AudioNode = src;
      filters.forEach(f => {
        current.connect(f);
        current = f;
      });
      current.connect(offlineCtx.destination);

      src.start(0);
      const renderedBuffer = await offlineCtx.startRendering();

      const wavBlob = this.bufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `equalized-${this.selectedPreset}-${this.fileName || 'audio'}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Equalizer export failed.');
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
