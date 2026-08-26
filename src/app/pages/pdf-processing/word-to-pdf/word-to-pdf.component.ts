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
      const file = this.selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      
      this.progress = 40;
      // @ts-ignore
      const mammoth = await import('mammoth');
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      const html = result.value || '<p>No content</p>';
      
      this.progress = 60;
      // @ts-ignore
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      
      const opt: any = {
        margin:       10,
        filename:     'converted.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      const element = document.createElement('div');
      element.innerHTML = html;
      element.style.padding = '20px';
      element.style.color = '#000';
      element.style.background = '#fff';
      
      this.progress = 80;
      const pdfBlob = await html2pdf().from(element).set(opt).output('blob');
      
      this.convertedBlob = pdfBlob;
      this.convertedUrl = URL.createObjectURL(this.convertedBlob!);
      this.progress = 100;
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Please ensure you uploaded a valid .docx file.');
    }
    this.isConverting = false;
  }

  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = (this.selectedFiles[0]?.name.split('.')[0] || 'document') + '.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
