import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-sign-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './sign-pdf.component.html', styleUrls: ['./sign-pdf.component.css'] })
export class SignPdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0;
  convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  signatureDataUrl: string | null = null;
  isDrawing = false;
  showSignPad = false;

  private signCanvas: HTMLCanvasElement | null = null;
  private signCtx: CanvasRenderingContext2D | null = null;

  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() { this.title.setTitle('Sign PDF – Add Digital Signature | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Draw your signature and add it to any PDF document. Free electronic signature tool.' }); }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; } onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }
  addFiles(files: FileList) { this.selectedFiles = [Array.from(files)[0]]; this.resetState(false); this.showSignPad = true; }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); this.showSignPad = false; if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return false; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; this.signatureDataUrl = null; if (clearFiles) { this.selectedFiles = []; this.showSignPad = false; } }

  initCanvas(canvas: HTMLCanvasElement) {
    this.signCanvas = canvas;
    this.signCtx = canvas.getContext('2d');
    if (this.signCtx) {
      this.signCtx.strokeStyle = '#1a1a2e'; this.signCtx.lineWidth = 2.5;
      this.signCtx.lineCap = 'round'; this.signCtx.lineJoin = 'round';
    }
  }

  startDraw(e: MouseEvent) {
    this.isDrawing = true;
    if (this.signCtx) { this.signCtx.beginPath(); this.signCtx.moveTo(e.offsetX, e.offsetY); }
  }
  draw(e: MouseEvent) {
    if (!this.isDrawing || !this.signCtx) return;
    this.signCtx.lineTo(e.offsetX, e.offsetY); this.signCtx.stroke();
  }
  endDraw() { this.isDrawing = false; if (this.signCanvas) this.signatureDataUrl = this.signCanvas.toDataURL('image/png'); }
  clearSignature() { if (this.signCtx && this.signCanvas) { this.signCtx.clearRect(0, 0, this.signCanvas.width, this.signCanvas.height); this.signatureDataUrl = null; } }

  async processFiles() {
    if (!this.selectedFiles.length || !this.signatureDataUrl) { alert('Please upload a PDF and draw your signature.'); return; }
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      this.progress = 40;
      // Convert signature data URL to bytes
      const sigResponse = await fetch(this.signatureDataUrl);
      const sigBytes = await sigResponse.arrayBuffer();
      const sigImage = await pdf.embedPng(sigBytes);
      this.progress = 60;
      const lastPage = pdf.getPages()[pdf.getPageCount() - 1];
      const { width } = lastPage.getSize();
      const sigW = 180; const sigH = (sigImage.height / sigImage.width) * sigW;
      lastPage.drawImage(sigImage, { x: width - sigW - 50, y: 50, width: sigW, height: sigH });
      this.progress = 85;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) { console.error(err); alert('Failed to add signature.'); }
    this.isConverting = false;
  }

  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = (this.selectedFiles[0]?.name.split('.')[0] || 'signed') + '-signed.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
