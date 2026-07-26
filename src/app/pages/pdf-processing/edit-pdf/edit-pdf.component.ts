import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-edit-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './edit-pdf.component.html', styleUrls: ['./edit-pdf.component.css'] })
export class EditPdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0;
  convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  annotationText = ''; textX = 100; textY = 700; textSize = 14; textColor = 'black';
  constructor(private title: Title, private meta: Meta) {}
  ngOnInit() { this.title.setTitle('Edit PDF – Add Text Annotations | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Add text annotations to your PDF documents. Simple in-browser PDF editing.' }); }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; } onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }
  addFiles(files: FileList) { this.selectedFiles = [Array.from(files)[0]]; this.resetState(false); }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); }
  hasSettings() { return true; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; if (clearFiles) this.selectedFiles = []; }

  async processFiles() {
    if (!this.selectedFiles.length) return;
    if (!this.annotationText.trim()) { alert('Please enter text to add.'); return; }
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      this.progress = 20;
      const bytes = await this.selectedFiles[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      this.progress = 50;
      const firstPage = pdf.getPages()[0];
      let color = rgb(0, 0, 0);
      if (this.textColor === 'red') color = rgb(0.9, 0.1, 0.1);
      else if (this.textColor === 'blue') color = rgb(0.1, 0.1, 0.9);
      firstPage.drawText(this.annotationText, {
        x: this.textX, y: this.textY, size: this.textSize,
        font, color
      });
      this.progress = 80;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) { console.error(err); alert('Edit failed.'); }
    this.isConverting = false;
  }

  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = (this.selectedFiles[0]?.name.split('.')[0] || 'edited') + '-edited.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
