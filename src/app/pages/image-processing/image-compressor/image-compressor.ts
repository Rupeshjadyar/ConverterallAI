// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-image-compressor',
//   imports: [],
//   templateUrl: './image-compressor.html',
//   styleUrl: './image-compressor.css',
// })
// export class ImageCompressor {

// }




import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
interface CompressedImage {
  id: string;
  file: File;
  originalSize: number;
  originalUrl: string;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedUrl: string;
  reduction: number;
  origW: number;
  origH: number;
  newW: number;
  newH: number;
  status: 'queued' | 'compressing' | 'done' | 'error';
  errorMsg: string;
}
@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-compressor.html',
  styleUrls: ['./image-compressor.css'],
})
export class ImageCompressor implements OnInit, OnDestroy {
  /* ─── STATE ─── */
  images: CompressedImage[] = [];
  isDragging = false;
  busy = false;
  settingsOpen = false;
  previewImg: CompressedImage | null = null;
  toastMsg = '';
  toastVisible = false;
  private toastTimer: any;
  /* ─── SETTINGS ─── */
  quality = 80;
  maxWidth = 1920;
  maxHeight = 1080;
  format: 'auto' | 'jpeg' | 'png' | 'webp' = 'auto';
  keepRatio = true;
  readonly ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif'];
  readonly MAX_SIZE = 50 * 1024 * 1024;
  readonly MAX_FILES = 20;
  constructor(private meta: Meta, private title: Title) {}
  ngOnInit(): void {
    this.title.setTitle('Free Image Compressor Online — Reduce Image Size | ImageToolkit');
    this.meta.updateTag({ name: 'description', content: 'Compress JPG, PNG, WEBP images online for free. Reduce file size up to 90% without quality loss. No signup, no watermarks, 100% private — works in your browser.' });
    this.meta.updateTag({ name: 'keywords', content: 'image compressor, compress image online, reduce image size, jpg compressor, png optimizer, webp compressor, free image compression tool' });
    this.meta.updateTag({ property: 'og:title', content: 'Free Image Compressor — Reduce Image Size Online' });
    this.meta.updateTag({ property: 'og:description', content: 'Compress images up to 90% without quality loss. Free, fast & private.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }
  ngOnDestroy(): void {
    this.images.forEach(i => {
      URL.revokeObjectURL(i.originalUrl);
      if (i.compressedUrl && i.compressedUrl !== i.originalUrl) URL.revokeObjectURL(i.compressedUrl);
    });
    clearTimeout(this.toastTimer);
  }
  /* ═══════════════════ DRAG & DROP ═══════════════════ */
  @HostListener('dragover', ['$event']) preventDef(e: DragEvent) { e.preventDefault(); }
  dragEnter(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  dragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  drop(e: DragEvent) {
    e.preventDefault(); e.stopPropagation();
    this.isDragging = false;
    if (e.dataTransfer?.files) this.addFiles(e.dataTransfer.files);
  }
  pickFiles(e: Event) {
    const inp = e.target as HTMLInputElement;
    if (inp.files) { this.addFiles(inp.files); inp.value = ''; }
  }
  /* ═══════════════════ ADD & COMPRESS ═══════════════════ */
  private addFiles(list: FileList): void {
    let files = Array.from(list).filter(f => this.ACCEPTED.includes(f.type) && f.size <= this.MAX_SIZE);
    const room = this.MAX_FILES - this.images.length;
    if (room <= 0) { this.toast('Maximum 20 files allowed'); return; }
    files = files.slice(0, room);
    if (files.length === 0) { this.toast('No valid image files found'); return; }
    for (const f of files) {
      this.images.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
        file: f, originalSize: f.size, originalUrl: URL.createObjectURL(f),
        compressedBlob: null, compressedSize: 0, compressedUrl: '',
        reduction: 0, origW: 0, origH: 0, newW: 0, newH: 0,
        status: 'queued', errorMsg: '',
      });
    }
    this.runQueue();
  }
  async runQueue(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    const queued = this.images.filter(i => i.status === 'queued');
    for (const img of queued) {
      img.status = 'compressing';
      try { await this.compress(img); img.status = 'done'; }
      catch (err: any) { img.status = 'error'; img.errorMsg = err?.message || 'Failed'; }
    }
    this.busy = false;
    const done = this.doneImages;
    if (done.length > 0) {
      const pct = this.overallReduction;
      this.toast(`✅ Done! Saved ${pct}% (${this.fmt(this.totalSaved)})`);
    }
  }
  private compress(img: CompressedImage): Promise<void> {
    return new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => {
        img.origW = el.naturalWidth;
        img.origH = el.naturalHeight;
        let w = el.naturalWidth, h = el.naturalHeight;
        if (this.keepRatio) {
          const r = Math.min(this.maxWidth / w, this.maxHeight / h, 1);
          w = Math.round(w * r); h = Math.round(h * r);
        } else {
          w = Math.min(w, this.maxWidth); h = Math.min(h, this.maxHeight);
        }
        img.newW = w; img.newH = h;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) { reject(new Error('Canvas error')); return; }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(el, 0, 0, w, h);
        let mime = img.file.type;
        if (this.format !== 'auto') mime = `image/${this.format}`;
        else if (mime === 'image/bmp' || mime === 'image/gif') mime = 'image/jpeg';
        c.toBlob(blob => {
          if (!blob) { reject(new Error('Compression failed')); return; }
          if (blob.size >= img.originalSize) {
            img.compressedBlob = img.file;
            img.compressedSize = img.originalSize;
            img.compressedUrl = img.originalUrl;
            img.reduction = 0;
          } else {
            img.compressedBlob = blob;
            img.compressedSize = blob.size;
            img.compressedUrl = URL.createObjectURL(blob);
            img.reduction = Math.round(((img.originalSize - blob.size) / img.originalSize) * 100);
          }
          resolve();
        }, mime, this.quality / 100);
      };
      el.onerror = () => reject(new Error('Could not read image'));
      el.src = img.originalUrl;
    });
  }
  async recompress(): Promise<void> {
    for (const img of this.images) {
      if (img.compressedUrl && img.compressedUrl !== img.originalUrl) URL.revokeObjectURL(img.compressedUrl);
      Object.assign(img, { status: 'queued', compressedBlob: null, compressedSize: 0, compressedUrl: '', reduction: 0 });
    }
    await this.runQueue();
  }
  /* ═══════════════════ ACTIONS ═══════════════════ */
  remove(id: string): void {
    const i = this.images.findIndex(x => x.id === id);
    if (i < 0) return;
    const img = this.images[i];
    URL.revokeObjectURL(img.originalUrl);
    if (img.compressedUrl && img.compressedUrl !== img.originalUrl) URL.revokeObjectURL(img.compressedUrl);
    this.images.splice(i, 1);
  }
  clearAll(): void {
    this.images.forEach(i => {
      URL.revokeObjectURL(i.originalUrl);
      if (i.compressedUrl && i.compressedUrl !== i.originalUrl) URL.revokeObjectURL(i.compressedUrl);
    });
    this.images = [];
    this.previewImg = null;
  }
  download(img: CompressedImage): void {
    if (!img.compressedBlob) return;
    const ext = this.format !== 'auto' ? this.format : (img.file.type === 'image/png' ? 'png' : img.file.type === 'image/webp' ? 'webp' : 'jpg');
    const name = img.file.name.replace(/\.[^.]+$/, '') + '_compressed.' + ext;
    const a = document.createElement('a');
    a.href = img.compressedUrl; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  async downloadAll(): Promise<void> {
    for (const img of this.doneImages) {
      this.download(img);
      await new Promise(r => setTimeout(r, 350));
    }
  }
  preview(img: CompressedImage): void { this.previewImg = img; }
  closePreview(): void { this.previewImg = null; }
  /* ═══════════════════ HELPERS ═══════════════════ */
  fmt(bytes: number): string {
    if (bytes === 0) return '0 B';
    const u = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + u[i];
  }
  sizeBarWidth(img: CompressedImage): number {
    return img.status === 'done' ? Math.max(100 - img.reduction, 8) : 100;
  }
  get doneImages() { return this.images.filter(i => i.status === 'done'); }
  get totalOriginal() { return this.images.reduce((s, i) => s + i.originalSize, 0); }
  get totalCompressed() { return this.doneImages.reduce((s, i) => s + i.compressedSize, 0); }
  get totalSaved() { return this.totalOriginal - this.totalCompressed; }
  get overallReduction() {
    return this.totalOriginal ? Math.round(((this.totalOriginal - this.totalCompressed) / this.totalOriginal) * 100) : 0;
  }
  get progress() {
    if (!this.images.length) return 0;
    return Math.round((this.images.filter(i => i.status === 'done' || i.status === 'error').length / this.images.length) * 100);
  }
  trackById(_: number, item: CompressedImage) { return item.id; }
  private toast(msg: string): void {
    this.toastMsg = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible = false, 4000);
  }
}







