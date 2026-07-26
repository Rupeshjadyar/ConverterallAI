import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-split-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './split-pdf.component.html',
  styleUrls: ['./split-pdf.component.css']
})
export class SplitPdfComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  splitRange = '1';
  totalPages = 0;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Split PDF – Extract Pages from PDF | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Extract specific pages or split a PDF into multiple documents. Select page ranges and download instantly.' });
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }

  onDrop(e: DragEvent) {
    e.preventDefault(); this.isDragging = false;
    if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files);
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.addFiles(input.files);
  }

  async addFiles(files: FileList) {
    this.selectedFiles = [Array.from(files)[0]];
    this.resetState(false);
    // Get page count
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      this.totalPages = pdf.getPageCount();
      this.splitRange = `1-${this.totalPages}`;
    } catch { this.totalPages = 0; }
  }

  removeFile(i: number) {
    this.selectedFiles.splice(i, 1);
    this.totalPages = 0;
    if (!this.selectedFiles.length) this.resetState(true);
  }

  hasSettings() { return true; }

  resetState(clearFiles = true) {
    this.convertedUrl = null; this.convertedBlob = null;
    this.progress = 0; this.isConverting = false;
    if (clearFiles) { this.selectedFiles = []; this.totalPages = 0; }
  }

  parsePageRange(range: string, maxPages: number): number[] {
    const pages: Set<number> = new Set();
    const parts = range.split(',').map(s => s.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
            pages.add(i - 1); // 0-indexed
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num >= 1 && num <= maxPages) pages.add(num - 1);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }

  async processFiles() {
    if (!this.selectedFiles.length) return;
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pageIndices = this.parsePageRange(this.splitRange, pdf.getPageCount());

      if (pageIndices.length === 0) {
        alert('No valid pages selected. Please enter a valid page range.');
        this.isConverting = false; return;
      }

      this.progress = 40;
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach(p => newPdf.addPage(p));

      this.progress = 80;
      const pdfBytes = await newPdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('Split failed:', err);
      alert('Failed to split PDF. Please check the file is valid.');
    }
    this.isConverting = false;
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    const name = this.selectedFiles[0]?.name.split('.')[0] || 'split';
    a.download = name + '-split.pdf';
    a.click();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
