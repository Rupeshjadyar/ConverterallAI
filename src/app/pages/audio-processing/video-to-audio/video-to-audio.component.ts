import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-video-to-audio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video-to-audio.component.html',
  styleUrls: ['./video-to-audio.component.css']
})
export class VideoToAudioComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  videoSrcUrl: string | null = null;

  fileName: string = '';
  fileSizeMb: string = '';
  isExtracting: boolean = false;
  statusMessage: string = '';
  errorMessage = '';

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
    this.resetVideo();
    void this.audioCtx?.close();
    this.audioCtx = null;
  }

  resetVideo(): void {
    if (this.videoSrcUrl) URL.revokeObjectURL(this.videoSrcUrl);
    this.videoSrcUrl = null;
    this.audioBuffer = null;
    this.errorMessage = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) this.processVideoFile(file);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) this.processVideoFile(file);
  }

  onDragOver(e: DragEvent): void { e.preventDefault(); }

  async processVideoFile(file: File): Promise<void> {
    const audioCtx = this.audioCtx;
    if (!this.isBrowser || !audioCtx || this.isExtracting) return;
    this.resetVideo();
    this.isExtracting = true;
    this.statusMessage = 'Reading Video Container & Extracting Audio Track...';
    this.fileName = file.name;
    this.fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);

    this.videoSrcUrl = URL.createObjectURL(file);
    this.cdr.detectChanges();

    try {
      const arrayBuf = await file.arrayBuffer();
      const decoded = await audioCtx.decodeAudioData(arrayBuf);
      if (this.audioCtx !== audioCtx) return;
      this.ngZone.run(() => {
        this.audioBuffer = decoded;
      });
    } catch {
      if (this.audioCtx !== audioCtx) return;
      this.ngZone.run(() => {
        this.resetVideo();
        this.errorMessage = 'Could not read an audio track. Try a video with audio in a format your browser supports.';
      });
    } finally {
      if (this.audioCtx === audioCtx) {
        this.ngZone.run(() => {
          this.isExtracting = false;
          this.cdr.detectChanges();
        });
      }
    }
  }

  downloadExtractedAudio(): void {
    if (!this.audioBuffer) return;
    const wavBlob = this.bufferToWav(this.audioBuffer);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = this.fileName.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}-audio.wav`;
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

  formatDuration(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
