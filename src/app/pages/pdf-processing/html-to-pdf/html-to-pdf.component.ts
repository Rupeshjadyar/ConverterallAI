import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-html-to-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './html-to-pdf.component.html', styleUrls: ['./html-to-pdf.component.css'] })
export class HtmlToPdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0;
  convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  htmlInput = '';
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() { this.title.setTitle('HTML to PDF – Convert Web Content to PDF | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Convert HTML content into PDF documents.' }); }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; } onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.loadFile(e.dataTransfer.files[0]); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.loadFile(input.files[0]); }
  async loadFile(f: File) { this.selectedFiles = [f]; this.htmlInput = await f.text(); this.resetState(false); }
  removeFile(i: number) { this.selectedFiles = []; this.htmlInput = ''; }
  hasSettings() { return false; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; if (clearFiles) { this.selectedFiles = []; this.htmlInput = ''; } }

  async processFiles() {
    if (!this.htmlInput.trim()) { alert('Please enter or upload HTML content.'); return; }
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      this.progress = 30;
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      // Strip HTML tags for text content
      const text = this.htmlInput.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      const margin = 72; const pageW = 595.28; const pageH = 841.89;
      const maxW = pageW - margin*2; const fontSize = 11; const lineH = fontSize * 1.5;
      const lines: string[] = [];
      for (const word of text.split(' ')) { const last = lines[lines.length-1] || ''; const t = last ? last+' '+word : word; if (font.widthOfTextAtSize(t, fontSize) > maxW) { lines.push(word); } else { lines[lines.length ? lines.length-1 : 0] = t; } }
      this.progress = 60;
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
    } catch (err) { console.error(err); alert('Conversion failed.'); }
    this.isConverting = false;
  }

  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = 'html-to-pdf.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
