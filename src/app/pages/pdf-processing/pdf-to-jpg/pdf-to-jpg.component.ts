import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pdf-to-jpg',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pdf-to-jpg.component.html',
  styleUrls: ['./pdf-to-jpg.component.css']
})
export class PdfToJpgComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  pageImages: { url: string; blob: Blob; name: string }[] = [];

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('PDF to JPG – Convert PDF Pages to Images | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Convert each PDF page to high-quality JPG images. Fast browser-based conversion with no file uploads.' });
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }

  addFiles(files: FileList) { this.selectedFiles = [Array.from(files)[0]]; this.resetState(false); }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return false; }

  resetState(clearFiles = true) {
    this.convertedUrl = null; this.convertedBlob = null;
    this.progress = 0; this.isConverting = false; this.pageImages = [];
    if (clearFiles) this.selectedFiles = [];
  }

  async processFiles() {
    if (!this.selectedFiles.length) return;
    this.isConverting = true; this.progress = 0;
    try {
      const pdfjsLib = await import('pdfjs-dist');
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
      this.progress = 10;

      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;
      this.progress = 20;

      const totalPages = pdfDoc.numPages;
      const step = 70 / totalPages;
      this.pageImages = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const scale = 2; // High quality
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.92);
        });
        
        const name = this.selectedFiles[0].name.split('.')[0] || 'page';
        this.pageImages.push({
          url: URL.createObjectURL(blob),
          blob,
          name: `${name}-page-${i}.jpg`
        });
        this.progress = 20 + Math.round(step * i);
      }

      this.progress = 95;
      // Set first image as the main download
      if (this.pageImages.length > 0) {
        this.convertedBlob = this.pageImages[0].blob;
        this.convertedUrl = this.pageImages[0].url;
      }
      this.progress = 100;
    } catch (err) {
      console.error('PDF to JPG failed:', err);
      alert('Failed to convert PDF to images.');
    }
    this.isConverting = false;
  }

  downloadPage(idx: number) {
    const img = this.pageImages[idx];
    if (!img) return;
    const a = document.createElement('a');
    a.href = img.url; a.download = img.name; a.click();
  }

  downloadAll() {
    this.pageImages.forEach((img, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = img.url; a.download = img.name; a.click();
      }, i * 300);
    });
  }

  download() { this.downloadAll(); }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
