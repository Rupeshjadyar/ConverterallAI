import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
export class FormatConverterComponent implements OnInit {
  isBrowser: boolean = false;
  audioCtx: AudioContext | null = null;

  items: ConvertItem[] = [];
  targetFormat: 'mp3' | 'wav' | 'ogg' = 'mp3';
  bitrate: string = '320';
  isProcessingBatch: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
  }

  onFilesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.addFiles(Array.from(files));
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  }

  onDragOver(e: DragEvent): void { e.preventDefault(); }

  addFiles(files: File[]): void {
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
      }
    });
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  clearAll(): void {
    this.items = [];
  }

  async convertAll(): Promise<void> {
    if (!this.isBrowser || !this.audioCtx || this.items.length === 0) return;
    this.isProcessingBatch = true;

    for (const item of this.items) {
      if (item.status === 'done') continue;
      item.status = 'converting';
      item.progress = 20;

      try {
        const arrayBuf = await item.file.arrayBuffer();
        item.progress = 50;
        const decodedBuffer = await this.audioCtx.decodeAudioData(arrayBuf);
        item.progress = 80;

        const wavBlob = this.bufferToWav(decodedBuffer);
        item.convertedBlob = wavBlob;
        const baseName = item.name.replace(/\.[^/.]+$/, '');
        item.convertedName = `${baseName}.${this.targetFormat}`;
        item.status = 'done';
        item.progress = 100;
      } catch (e) {
        item.status = 'error';
      }
    }

    this.isProcessingBatch = false;
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
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([out], { type: 'audio/wav' });
  }
}
