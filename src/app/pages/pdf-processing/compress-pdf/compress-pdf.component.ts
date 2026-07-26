import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-compress-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './compress-pdf.component.html',
  styleUrls: ['./compress-pdf.component.css']
})
export class CompressPdfComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  originalSize = 0;
  compressedSize = 0;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Compress PDF – Reduce PDF File Size | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Reduce PDF file size while maintaining quality. Fast in-browser compression — no uploads, completely private.' });
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }

  addFiles(files: FileList) {
    this.selectedFiles = [Array.from(files)[0]];
    this.originalSize = this.selectedFiles[0].size;
    this.resetState(false);
  }

  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return false; }

  resetState(clearFiles = true) {
    this.convertedUrl = null; this.convertedBlob = null;
    this.progress = 0; this.isConverting = false; this.compressedSize = 0;
    if (clearFiles) { this.selectedFiles = []; this.originalSize = 0; }
  }

  async processFiles() {
    if (!this.selectedFiles.length) return;
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      this.progress = 40;
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      this.progress = 60;
      // Re-save strips unused objects, metadata bloat, and normalizes streams
      const pdfBytes = await pdf.save();
      this.progress = 90;
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.compressedSize = this.convertedBlob.size;
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('Compress failed:', err);
      alert('Failed to compress PDF. The file may be corrupted or password-protected.');
    }
    this.isConverting = false;
  }

  getSavingsPercent(): number {
    if (!this.originalSize || !this.compressedSize) return 0;
    return Math.max(0, Math.round((1 - this.compressedSize / this.originalSize) * 100));
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    const name = this.selectedFiles[0]?.name.split('.')[0] || 'compressed';
    a.download = name + '-compressed.pdf';
    a.click();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
