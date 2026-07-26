import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-word-to-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './word-to-pdf.component.html', styleUrls: ['./word-to-pdf.component.css'] })
export class WordToPdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0;
  convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() { this.title.setTitle('Word to PDF – Convert DOCX to PDF | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Convert Word documents to PDF format.' }); }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; } onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }
  addFiles(files: FileList) { this.selectedFiles = [Array.from(files)[0]]; this.resetState(false); }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return false; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; if (clearFiles) this.selectedFiles = []; }

  async processFiles() {
    if (!this.selectedFiles.length) return;
    this.isConverting = true; this.progress = 0;
    try {
      this.progress = 20;
      const text = await this.selectedFiles[0].text();
      this.progress = 40;
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      this.progress = 60;
      const margin = 72; const pageW = 595.28; const pageH = 841.89;
      const maxW = pageW - margin*2; const fontSize = 11; const lineH = fontSize * 1.5;
      const lines: string[] = [];
      for (const raw of text.split('\n')) {
        if (!raw.trim()) { lines.push(''); continue; }
        const words = raw.split(' '); let cur = '';
        for (const w of words) { const t = cur ? cur+' '+w : w; if (font.widthOfTextAtSize(t, fontSize) > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
        if (cur) lines.push(cur);
      }
      const lpp = Math.floor((pageH - margin*2) / lineH);
      for (let i = 0; i < lines.length; i += lpp) {
        const page = pdf.addPage([pageW, pageH]); let y = pageH - margin;
        for (const line of lines.slice(i, i+lpp)) { if (line) page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0,0,0) }); y -= lineH; }
      }
      this.progress = 90;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) { console.error(err); alert('Conversion failed. For best results, use .txt or plain text files.'); }
    this.isConverting = false;
  }

  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = (this.selectedFiles[0]?.name.split('.')[0] || 'document') + '.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
