import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface TrackItem {
  id: string;
  name: string;
  duration: number;
  buffer: AudioBuffer;
}

@Component({
  selector: 'app-audio-joiner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './audio-joiner.component.html',
  styleUrls: ['./audio-joiner.component.css']
})
export class AudioJoinerComponent implements OnInit, OnDestroy {
  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  mergedBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;

  tracks: TrackItem[] = [];
  crossfadeSec: number = 0; // 0s to 5s
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

  onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.loadTracks(Array.from(files));
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      this.loadTracks(Array.from(e.dataTransfer.files));
    }
  }

  onDragOver(e: DragEvent): void { e.preventDefault(); }

  async loadTracks(files: File[]): Promise<void> {
    if (!this.isBrowser || !this.audioCtx) return;
    this.isProcessing = true;

    for (const file of files) {
      try {
        const buf = await file.arrayBuffer();
        const decoded = await this.audioCtx.decodeAudioData(buf);
        this.tracks.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          duration: decoded.duration,
          buffer: decoded
        });
      } catch (e) {
        console.error(e);
      }
    }

    this.isProcessing = false;
    this.rebuildMergedBuffer();
  }

  moveTrack(index: number, dir: -1 | 1): void {
    const targetIdx = index + dir;
    if (targetIdx >= 0 && targetIdx < this.tracks.length) {
      const temp = this.tracks[index];
      this.tracks[index] = this.tracks[targetIdx];
      this.tracks[targetIdx] = temp;
      this.rebuildMergedBuffer();
    }
  }

  removeTrack(index: number): void {
    this.tracks.splice(index, 1);
    this.rebuildMergedBuffer();
  }

  rebuildMergedBuffer(): void {
    if (!this.audioCtx || this.tracks.length === 0) {
      this.mergedBuffer = null;
      return;
    }

    const sampleRate = this.tracks[0].buffer.sampleRate;
    const numChan = 2;

    // Calculate total samples considering crossfade overlap
    let totalSamples = 0;
    const fadeSamples = Math.floor(this.crossfadeSec * sampleRate);

    this.tracks.forEach((t, i) => {
      totalSamples += t.buffer.length;
      if (i > 0) totalSamples -= fadeSamples;
    });

    totalSamples = Math.max(1, totalSamples);
    const result = this.audioCtx.createBuffer(numChan, totalSamples, sampleRate);
    const dstLeft = result.getChannelData(0);
    const dstRight = result.getChannelData(1);

    let offset = 0;
    this.tracks.forEach((track, trkIdx) => {
      const trkLeft = track.buffer.getChannelData(0);
      const trkRight = track.buffer.numberOfChannels > 1 ? track.buffer.getChannelData(1) : trkLeft;
      const len = trkLeft.length;

      for (let i = 0; i < len; i++) {
        const writeIdx = offset + i;
        if (writeIdx < totalSamples) {
          let gain = 1.0;

          // Fade In if crossfading from previous track
          if (trkIdx > 0 && i < fadeSamples) {
            gain *= (i / fadeSamples);
          }
          // Fade Out if crossfading to next track
          if (trkIdx < this.tracks.length - 1 && i >= len - fadeSamples) {
            const rem = len - 1 - i;
            gain *= (rem / fadeSamples);
          }

          dstLeft[writeIdx] += trkLeft[i] * gain;
          dstRight[writeIdx] += trkRight[i] * gain;
        }
      }

      offset += (len - fadeSamples);
    });

    this.mergedBuffer = result;
  }

  playMerged(): void {
    if (!this.mergedBuffer || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    this.stopPlayback();

    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.buffer = this.mergedBuffer;
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

  downloadMergedAudio(): void {
    if (!this.mergedBuffer) return;
    const wavBlob = this.bufferToWav(this.mergedBuffer);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joined-${this.tracks.length}-tracks.wav`;
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

  formatDuration(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  }
}
