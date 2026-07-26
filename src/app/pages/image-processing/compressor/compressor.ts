import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compressor.html',
  styleUrls: ['./compressor.css']
})
export class CompressorComponent {
  selectedFile: File | null = null;
  originalSize: number = 0;
  previewUrl: string | null = null;

  targetSizeKB: number = 100;
  quality: number | null = null;
  isCompressing: boolean = false;

  compressedFile: File | null = null;
  compressedSize: number = 0;
  compressedUrl: string | null = null;
  savedPercentage: number = 0;

  compressionLevel: string = 'smart';

  private _outputFormat: string = 'original';
  get outputFormat(): string { return this._outputFormat; }
  set outputFormat(val: string) {
    this._outputFormat = val;
    this.compressedUrl = null;
    this.compressedFile = null;
    this.compressedSize = 0;
    this.savedPercentage = 0;
    this.cdr.detectChanges();
  }

  customWidth: number | null = null;
  customHeight: number | null = null;
  maintainAspectRatio: boolean = true;
  isDragging: boolean = false;

  constructor(
    private title: Title,
    private meta: Meta,
    private cdr: ChangeDetectorRef
  ) {
    this.title.setTitle('Image Compressor - Reduce Photo Size');
    this.meta.updateTag({ name: 'description', content: 'Compress images to exact target size.' });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) this.handleFile(input.files[0]);
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.isDragging = true; }
  onDragLeave(event: DragEvent) { event.preventDefault(); this.isDragging = false; }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) this.handleFile(files[0]);
  }

  handleFile(file: File) {
    this.selectedFile = file;
    this.originalSize = file.size;
    this.previewUrl = URL.createObjectURL(file);
    this.compressedUrl = null;
    this.compressedFile = null;
    this.compressedSize = 0;
    this.savedPercentage = 0;
    this.cdr.detectChanges();
  }

  async compressImage() {
    if (!this.selectedFile) return;

    this.isCompressing = true;
    this.compressedUrl = null;
    this.compressedFile = null;
    this.cdr.detectChanges();

    try {
      const targetFormat = this._outputFormat === 'original' ? null : this._outputFormat;
      const targetMime = this.getOutputMime(targetFormat, this.selectedFile.type || 'image/jpeg');
      let targetBytes = this.targetSizeKB * 1024;
      if (this.compressionLevel === 'high') {
        targetBytes = targetBytes * 0.7;
      } else if (this.compressionLevel === 'low') {
        targetBytes = targetBytes * 1.3;
      }

      // Decode image
      const imageBitmap = await createImageBitmap(this.selectedFile);
      
      // Auto-downscale original canvas to a max resolution (e.g., 3840px max width/height)
      // to prevent GPU memory choke on giant camera source images
      let { outW, outH } = this.calcDimensions(imageBitmap);
      const maxDim = 3840;
      if (outW > maxDim || outH > maxDim) {
        const scale = maxDim / Math.max(outW, outH);
        outW = Math.round(outW * scale);
        outH = Math.round(outH * scale);
      }

      const makeCanvas = (w: number, h: number, src: CanvasImageSource) => {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d')!;
        if (targetMime === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(src, 0, 0, w, h);
        return c;
      };

      let canvas = makeCanvas(outW, outH, imageBitmap);
      imageBitmap.close();

      let finalBlob: Blob;

      if (targetMime === 'image/png') {
        // PNG doesn't support quality adjustment. We just downscale the canvas once if the image is too big.
        let blob = await this.toBlob(canvas, targetMime, 1);
        if (blob.size > targetBytes) {
          const scale = Math.sqrt(targetBytes / blob.size) * 0.95;
          const w = Math.max(1, Math.round(outW * scale));
          const h = Math.max(1, Math.round(outH * scale));
          const smallerCanvas = makeCanvas(w, h, canvas);
          finalBlob = await this.toBlob(smallerCanvas, targetMime, 1);
        } else {
          finalBlob = blob;
        }
      } else {
        // JPEG / WebP
        if (this.quality != null) {
          const q = Math.min(1, Math.max(0.01, this.quality));
          finalBlob = await this.toBlob(canvas, targetMime, q);
        } else {
          // Fast estimation algorithm (max 2 steps)
          // Step 1: Compress with estimated quality
          let estQuality = Math.min(0.92, Math.max(0.05, (targetBytes / this.selectedFile.size) * 0.85));
          let blob = await this.toBlob(canvas, targetMime, estQuality);

          if (blob.size > targetBytes) {
            // Step 2: If still too large, reduce quality
            const ratio = targetBytes / blob.size;
            if (estQuality > 0.15) {
              estQuality = Math.max(0.05, estQuality * ratio * 0.9);
              blob = await this.toBlob(canvas, targetMime, estQuality);
            }
            
            // If still too large, downscale resolution by ratio
            if (blob.size > targetBytes) {
              const scale = Math.sqrt(targetBytes / blob.size) * 0.95;
              const w = Math.max(1, Math.round(outW * scale));
              const h = Math.max(1, Math.round(outH * scale));
              const smallerCanvas = makeCanvas(w, h, canvas);
              blob = await this.toBlob(smallerCanvas, targetMime, 0.15);
            }
          }
          finalBlob = blob;
        }
      }

      this.setResult(new File([finalBlob], this.buildOutputName(this.selectedFile.name, targetFormat), { type: targetMime }));

    } catch (error) {
      console.error('Compression error:', error);
      alert('Error compressing image. Please try again.');
    } finally {
      this.isCompressing = false;
      this.cdr.detectChanges();
    }
  }

  private calcDimensions(bmp: ImageBitmap): { outW: number; outH: number } {
    let outW = bmp.width;
    let outH = bmp.height;

    if (this.customWidth || this.customHeight) {
      if (this.maintainAspectRatio) {
        const ratio = bmp.width / bmp.height;
        if (this.customWidth && !this.customHeight) {
          outW = this.customWidth;
          outH = Math.round(this.customWidth / ratio);
        } else if (this.customHeight && !this.customWidth) {
          outH = this.customHeight;
          outW = Math.round(this.customHeight * ratio);
        } else if (this.customWidth && this.customHeight) {
          const scale = Math.min(this.customWidth / bmp.width, this.customHeight / bmp.height);
          outW = Math.round(bmp.width * scale);
          outH = Math.round(bmp.height * scale);
        }
      } else {
        if (this.customWidth) outW = this.customWidth;
        if (this.customHeight) outH = this.customHeight;
      }
    }

    return { outW, outH };
  }

  private toBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('toBlob null')),
        mime,
        quality
      );
    });
  }

  private setResult(file: File) {
    if (file.size >= this.originalSize && (!this._outputFormat || this._outputFormat === 'original')) {
      // Use original file if compressed is larger or equal and same format
      this.compressedFile = this.selectedFile;
      this.compressedSize = this.originalSize;
      this.compressedUrl = this.previewUrl;
      this.savedPercentage = 0;
    } else {
      this.compressedFile = file;
      this.compressedSize = file.size;
      this.compressedUrl = URL.createObjectURL(file);
      const percent = ((this.originalSize - file.size) / this.originalSize) * 100;
      this.savedPercentage = Math.max(0, percent);
    }
    this.cdr.detectChanges();
  }

  private getOutputMime(format: string | null, fallback: string): string {
    const map: Record<string, string> = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg',
      png: 'image/png', webp: 'image/webp',
    };
    return format ? (map[format] || fallback) : (fallback || 'image/jpeg');
  }

  private buildOutputName(originalName: string, format: string | null): string {
    const parts = originalName.split('.');
    const base = parts.slice(0, -1).join('.');
    const origExt = parts.pop() || 'jpg';
    const ext = format ? (format === 'jpeg' ? 'jpg' : format) : origExt;
    return `compressed-${base}.${ext}`;
  }

  downloadImage() {
    if (this.compressedUrl && this.compressedFile && this.selectedFile) {
      const link = document.createElement('a');
      link.href = this.compressedUrl;
      link.download = this.buildOutputName(this.selectedFile.name, this._outputFormat === 'original' ? null : this._outputFormat);
      link.click();
    }
  }

  async downloadAllAsZip() {
    if (!this.compressedFile) { this.downloadImage(); return; }
    try {
      const JSZip = await this.loadJSZip();
      const zip = new JSZip();
      const name = this.buildOutputName(this.selectedFile!.name, this._outputFormat === 'original' ? null : this._outputFormat);
      zip.file(name, await this.compressedFile.arrayBuffer());
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'compressed-images.zip'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch { this.downloadImage(); }
  }

  private loadJSZip(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ((window as any).JSZip) { resolve((window as any).JSZip); return; }
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      s.onload = () => resolve((window as any).JSZip);
      s.onerror = () => reject(new Error('JSZip load failed'));
      document.head.appendChild(s);
    });
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(Math.max(0, decimals))) + ' ' + sizes[i];
  }

  resetAll() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.compressedUrl = null;
    this.compressedFile = null;
    this.originalSize = 0;
    this.compressedSize = 0;
    this.savedPercentage = 0;
    this.customWidth = null;
    this.customHeight = null;
    this.cdr.detectChanges();
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop() || 'jpg';
  }
}