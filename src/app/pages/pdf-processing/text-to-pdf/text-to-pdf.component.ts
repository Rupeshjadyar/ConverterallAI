import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-text-to-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './text-to-pdf.component.html',
  styleUrls: ['./text-to-pdf.component.css']
})
export class TextToPdfComponent implements OnInit {
  selectedFiles: File[] = []; // kept for template compat
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  textInput = '';
  fontSize = 12;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Text to PDF – Convert Text to PDF | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Convert plain text into a professionally formatted PDF document. Type or paste your text and generate a PDF instantly.' });
  }

  hasSettings() { return false; }

  resetState(clearFiles = true) {
    this.convertedUrl = null; this.convertedBlob = null;
    this.progress = 0; this.isConverting = false;
    if (clearFiles) { this.textInput = ''; this.selectedFiles = []; }
  }

  // Also support file upload (.txt files)
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault(); this.isDragging = false;
    if (e.dataTransfer?.files.length) this.loadTextFile(e.dataTransfer.files[0]);
  }
  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.loadTextFile(input.files[0]);
  }

  async loadTextFile(file: File) {
    this.selectedFiles = [file];
    this.textInput = await file.text();
  }

  removeFile(i: number) { this.selectedFiles = []; this.textInput = ''; }

  async processFiles() {
    if (!this.textInput.trim()) { alert('Please enter or paste some text first.'); return; }
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      this.progress = 20;
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      this.progress = 40;

      const margin = 72; // 1 inch
      const pageWidth = 595.28; // A4
      const pageHeight = 841.89;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = this.fontSize * 1.5;

      // Word wrap
      const lines: string[] = [];
      const rawLines = this.textInput.split('\n');
      for (const rawLine of rawLines) {
        if (!rawLine.trim()) { lines.push(''); continue; }
        const words = rawLine.split(' ');
        let current = '';
        for (const word of words) {
          const test = current ? current + ' ' + word : word;
          const w = font.widthOfTextAtSize(test, this.fontSize);
          if (w > maxWidth && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);
      }

      this.progress = 60;

      // Paginate
      const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
      for (let i = 0; i < lines.length; i += linesPerPage) {
        const page = pdf.addPage([pageWidth, pageHeight]);
        const pageLines = lines.slice(i, i + linesPerPage);
        let y = pageHeight - margin;
        for (const line of pageLines) {
          if (line) {
            page.drawText(line, { x: margin, y, size: this.fontSize, font, color: rgb(0, 0, 0) });
          }
          y -= lineHeight;
        }
      }

      this.progress = 90;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('Text to PDF failed:', err);
      alert('Failed to generate PDF from text.');
    }
    this.isConverting = false;
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    a.download = 'text-document.pdf';
    a.click();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
