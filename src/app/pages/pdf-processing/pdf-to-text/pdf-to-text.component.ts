import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pdf-to-text',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pdf-to-text.component.html',
  styleUrls: ['./pdf-to-text.component.css']
})
export class PdfToTextComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  extractedText = '';

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('PDF to Text – Extract Text from PDF | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Extract plain text from PDF files. Copy text directly or download as TXT — processed entirely in your browser.' });
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
    this.progress = 0; this.isConverting = false; this.extractedText = '';
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
      this.progress = 30;

      let fullText = '';
      const totalPages = pdfDoc.numPages;
      const step = 60 / totalPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        this.progress = 30 + Math.round(step * i);
      }

      this.extractedText = fullText.trim();
      this.progress = 95;
      this.convertedBlob = new Blob([this.extractedText], { type: 'text/plain' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('PDF text extraction failed:', err);
      alert('Failed to extract text. The PDF may be image-based (scanned). Try OCR instead.');
    }
    this.isConverting = false;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.extractedText).then(() => {
      alert('Text copied to clipboard!');
    });
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    const name = this.selectedFiles[0]?.name.split('.')[0] || 'extracted';
    a.download = name + '-text.txt';
    a.click();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
