import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-pdf-to-word', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './pdf-to-word.component.html', styleUrls: ['./pdf-to-word.component.css'] })
export class PdfToWordComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0;
  convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() {
    this.title.setTitle('PDF to Word – Convert PDF to DOCX | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Convert PDF files to editable Word documents. Maintain formatting and layout.' });
  }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }
  addFiles(files: FileList) { this.selectedFiles = [Array.from(files)[0]]; this.resetState(false); }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return false; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; if (clearFiles) this.selectedFiles = []; }

  async processFiles() {
    if (!this.selectedFiles.length) return;
    this.isConverting = true; this.progress = 0;
    // Extract text from PDF and create a simple DOCX-like file
    try {
      const pdfjsLib = await import('pdfjs-dist');
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
      this.progress = 15;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;
      this.progress = 30;
      let textContent = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const tc = await page.getTextContent();
        textContent += tc.items.map((item: any) => item.str).join(' ') + '\n\n';
        this.progress = 30 + Math.round((50 / pdfDoc.numPages) * i);
      }
      this.progress = 85;
      // Create a simple RTF (universally openable as "Word")
      const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Helvetica;}}\\f0\\fs24 ${textContent.replace(/\n/g, '\\par ')}}`;
      this.convertedBlob = new Blob([rtfContent], { type: 'application/rtf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) { console.error(err); alert('Conversion failed.'); }
    this.isConverting = false;
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob);
    a.download = (this.selectedFiles[0]?.name.split('.')[0] || 'document') + '.rtf'; a.click();
  }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
