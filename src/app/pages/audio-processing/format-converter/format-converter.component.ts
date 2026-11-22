import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { encodeMp3 } from '../../../services/encode-mp3';

export interface ConvertItem {
  id: string;
  file: File;
  name: string;
  sizeMb: string;
  status: 'pending' | 'converting' | 'done' | 'error';
  progress: number;
  convertedBlob?: Blob;
  convertedName?: string;
}

@Component({
  selector: 'app-audio-format-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './format-converter.component.html',
  styleUrls: ['./format-converter.component.css']
})
export class FormatConverterComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;

  items: ConvertItem[] = [];
  isProcessingBatch: boolean = false;
  uploadError = '';
  outputFormat: 'wav' | 'mp3' = 'wav';
  private batchAbort?: AbortController;

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
    this.batchAbort?.abort();
    void this.audioCtx?.close();
    this.audioCtx = null;
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.addFiles(Array.from(input.files));
    input.value = '';
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  }

  onDragOver(e: DragEvent): void { e.preventDefault(); }

  addFiles(files: File[]): void {
    if (this.isProcessingBatch) return;
    this.uploadError = '';
    files.forEach(f => {
      if (f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
        this.items.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          sizeMb: (f.size / (1024 * 1024)).toFixed(2),
          status: 'pending',
          progress: 0
        });
      } else {
        this.uploadError = 'Choose audio files supported by your browser.';
      }
    });
    this.cdr.detectChanges();
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.cdr.detectChanges();
  }

  clearAll(): void {
    this.items = [];
    this.cdr.detectChanges();
  }

  changeOutput(format: 'wav' | 'mp3'): void {
    if (this.isProcessingBatch || this.outputFormat === format) return;
    this.outputFormat = format;
    for (const item of this.items) {
      item.status = 'pending';
      item.progress = 0;
      item.convertedBlob = undefined;
      item.convertedName = undefined;
    }
  }

  async convertAll(): Promise<void> {
    const audioCtx = this.audioCtx;
    if (!this.isBrowser || !audioCtx || !this.items.length || this.isProcessingBatch) return;
    const format = this.outputFormat;
    const batch = new AbortController();
    this.batchAbort = batch;
    this.isProcessingBatch = true;
    this.cdr.detectChanges();

    for (const item of this.items) {
      if (item.status === 'done') continue;
      this.ngZone.run(() => {
        item.status = 'converting';
        item.progress = 20;
        this.cdr.detectChanges();
      });

      try {
        const arrayBuf = await item.file.arrayBuffer();
        if (this.audioCtx !== audioCtx) return;
        this.ngZone.run(() => {
          item.progress = 50;
          this.cdr.detectChanges();
        });

        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuf);
        if (this.audioCtx !== audioCtx) return;
        item.progress = 80;
        this.cdr.detectChanges();
        const output = format === 'mp3'
          ? await encodeMp3(decodedBuffer, batch.signal)
          : this.bufferToWav(decodedBuffer);
        if (this.audioCtx !== audioCtx) return;
        this.ngZone.run(() => {
          item.convertedBlob = output;
          const baseName = item.name.replace(/\.[^/.]+$/, '');
          item.convertedName = `${baseName}.${format}`;
          item.status = 'done';
          item.progress = 100;
          this.cdr.detectChanges();
        });
      } catch (e) {
        if (this.audioCtx !== audioCtx) return;
        this.ngZone.run(() => {
          item.status = 'error';
          this.cdr.detectChanges();
        });
      }
    }

    this.ngZone.run(() => {
      this.batchAbort = undefined;
      this.isProcessingBatch = false;
      this.cdr.detectChanges();
    });
  }

  downloadItem(item: ConvertItem): void {
    if (!item.convertedBlob || !item.convertedName) return;
    const url = URL.createObjectURL(item.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.convertedName;
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
        sample = (sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([out], { type: 'audio/wav' });
  }
}
