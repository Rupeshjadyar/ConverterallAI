import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rotate-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './rotate-pdf.component.html',
  styleUrls: ['./rotate-pdf.component.css']
})
export class RotatePdfComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  rotationAngle = 90;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Rotate PDF Pages – Flip & Turn PDF | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Rotate PDF pages 90°, 180° or 270°. Fix page orientation instantly in your browser.' });
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
      const { PDFDocument, degrees } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      this.progress = 50;
      pdf.getPages().forEach(page => page.setRotation(degrees(Number(this.rotationAngle))));
      this.progress = 80;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('Rotate failed:', err);
      alert('Failed to rotate PDF.');
    }
    this.isConverting = false;
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    const name = this.selectedFiles[0]?.name.split('.')[0] || 'rotated';
    a.download = name + '-rotated.pdf';
    a.click();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
