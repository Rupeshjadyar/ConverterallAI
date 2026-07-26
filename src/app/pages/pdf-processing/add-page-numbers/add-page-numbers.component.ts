import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-page-numbers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-page-numbers.component.html',
  styleUrls: ['./add-page-numbers.component.css']
})
export class AddPageNumbersComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  numberPosition = 'bottom-center';
  startingNumber = 1;
  fontSize = 11;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Add Page Numbers to PDF | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Add page numbers to your PDF documents. Choose position, starting number. 100% client-side processing.' });
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }

  addFiles(files: FileList) { this.selectedFiles = [Array.from(files)[0]]; this.resetState(false); }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return true; }

  resetState(clearFiles = true) {
    this.convertedUrl = null; this.convertedBlob = null;
    this.progress = 0; this.isConverting = false;
    if (clearFiles) this.selectedFiles = [];
  }

  async processFiles() {
    if (!this.selectedFiles.length) return;
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      this.progress = 40;
      const pages = pdf.getPages();

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const num = String(idx + this.startingNumber);
        const textWidth = font.widthOfTextAtSize(num, this.fontSize);
        let x = 0, y = 0;

        switch (this.numberPosition) {
          case 'bottom-center': x = (width - textWidth) / 2; y = 30; break;
          case 'bottom-right': x = width - textWidth - 40; y = 30; break;
          case 'bottom-left': x = 40; y = 30; break;
          case 'top-center': x = (width - textWidth) / 2; y = height - 30; break;
          case 'top-right': x = width - textWidth - 40; y = height - 30; break;
          default: x = (width - textWidth) / 2; y = 30;
        }

        page.drawText(num, { x, y, size: this.fontSize, font, color: rgb(0.3, 0.3, 0.3) });
      });

      this.progress = 80;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('Page numbering failed:', err);
      alert('Failed to add page numbers.');
    }
    this.isConverting = false;
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    const name = this.selectedFiles[0]?.name.split('.')[0] || 'numbered';
    a.download = name + '-numbered.pdf';
    a.click();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
