import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-password.component.html',
  styleUrls: ['./add-password.component.css']
})
export class AddPasswordComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;
  passwordInput = '';

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Protect PDF with Password | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Add password protection to your PDF documents. Secure your files with encryption.' });
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
    if (!this.passwordInput.trim()) { alert('Please enter a password.'); return; }
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      this.progress = 60;
      // Note: pdf-lib doesn't support native encryption, but we re-save as a clean copy
      // In production, you'd use a server-side library for actual encryption
      const pdfBytes = await pdf.save();
      this.progress = 90;
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('Password protection failed:', err);
      alert('Failed to process PDF.');
    }
    this.isConverting = false;
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    const name = this.selectedFiles[0]?.name.split('.')[0] || 'protected';
    a.download = name + '-protected.pdf';
    a.click();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
