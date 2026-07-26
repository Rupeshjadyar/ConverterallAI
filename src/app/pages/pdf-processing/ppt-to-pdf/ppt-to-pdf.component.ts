import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-ppt-to-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './ppt-to-pdf.component.html', styleUrls: ['./ppt-to-pdf.component.css'] })
export class PptToPdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0;
  convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() { this.title.setTitle('PPT to PDF – Convert Presentations to PDF | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Convert PowerPoint presentations to PDF format.' }); }
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
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      this.progress = 50;
      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      // Create slide-sized pages (16:9)
      const pageW = 960; const pageH = 540; const margin = 60;
      const slides = text.split('\n\n').filter(s => s.trim());
      for (const slide of (slides.length ? slides : [text])) {
        const page = pdf.addPage([pageW, pageH]);
        const lines = slide.split('\n');
        let y = pageH - margin;
        for (const line of lines.slice(0, 15)) {
          if (line.trim()) page.drawText(line.trim().substring(0, 80), { x: margin, y, size: 14, font, color: rgb(0.1, 0.1, 0.1) });
          y -= 28;
        }
      }
      this.progress = 90;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) { console.error(err); alert('Conversion failed.'); }
    this.isConverting = false;
  }

  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = (this.selectedFiles[0]?.name.split('.')[0] || 'presentation') + '.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
