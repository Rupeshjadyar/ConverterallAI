import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-organize-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './organize-pdf.component.html', styleUrls: ['./organize-pdf.component.css'] })
export class OrganizePdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0;
  convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  totalPages = 0; pageOrder: number[] = [];
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() { this.title.setTitle('Organize PDF Pages | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Rearrange PDF pages in any order.' }); }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; } onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }
  async addFiles(files: FileList) {
    this.selectedFiles = [Array.from(files)[0]]; this.resetState(false);
    try { const { PDFDocument } = await import('pdf-lib'); const b = await this.selectedFiles[0].arrayBuffer(); const p = await PDFDocument.load(b, { ignoreEncryption: true }); this.totalPages = p.getPageCount(); this.pageOrder = Array.from({ length: this.totalPages }, (_, i) => i); } catch { this.totalPages = 0; }
  }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return this.totalPages > 0; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; if (clearFiles) { this.selectedFiles = []; this.totalPages = 0; this.pageOrder = []; } }
  moveUp(idx: number) { if (idx > 0) { [this.pageOrder[idx], this.pageOrder[idx - 1]] = [this.pageOrder[idx - 1], this.pageOrder[idx]]; } }
  moveDown(idx: number) { if (idx < this.pageOrder.length - 1) { [this.pageOrder[idx], this.pageOrder[idx + 1]] = [this.pageOrder[idx + 1], this.pageOrder[idx]]; } }
  removePage(idx: number) { this.pageOrder.splice(idx, 1); }

  async processFiles() {
    if (!this.selectedFiles.length || !this.pageOrder.length) return;
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();
      this.progress = 50;
      const copiedPages = await newPdf.copyPages(srcPdf, this.pageOrder);
      copiedPages.forEach(p => newPdf.addPage(p));
      this.progress = 85;
      const pdfBytes = await newPdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) { console.error(err); alert('Organization failed.'); }
    this.isConverting = false;
  }

  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = (this.selectedFiles[0]?.name.split('.')[0] || 'organized') + '-organized.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
