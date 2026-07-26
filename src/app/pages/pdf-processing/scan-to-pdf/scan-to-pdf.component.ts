import { Component, OnInit } from '@angular/core'; import { CommonModule } from '@angular/common'; import { FormsModule } from '@angular/forms'; import { Title, Meta } from '@angular/platform-browser'; import { RouterModule } from '@angular/router';
@Component({ selector: 'app-scan-to-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './scan-to-pdf.component.html', styleUrls: ['./scan-to-pdf.component.css'] })
export class ScanToPdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0; convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  constructor(private title: Title, private meta: Meta) {} ngOnInit() { this.title.setTitle('Scan to PDF – Convert Scanned Images to PDF | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Convert scanned images or photos to PDF documents.' }); }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; } onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }
  addFiles(files: FileList) { this.selectedFiles.push(...Array.from(files)); this.resetState(false); } removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); } hasSettings() { return false; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; if (clearFiles) this.selectedFiles = []; }
  async processFiles() { if (!this.selectedFiles.length) return; this.isConverting = true; this.progress = 0;
    try { const { PDFDocument } = await import('pdf-lib'); this.progress = 10; const pdf = await PDFDocument.create();
      for (const file of this.selectedFiles) { const imgBytes = await file.arrayBuffer(); let img; try { img = await pdf.embedPng(imgBytes); } catch { img = await pdf.embedJpg(imgBytes); }
        const page = pdf.addPage([img.width, img.height]); page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height }); this.progress += 70 / this.selectedFiles.length; }
      this.progress = 90; const pdfBytes = await pdf.save(); this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' }); this.convertedUrl = URL.createObjectURL(this.convertedBlob); this.progress = 100;
    } catch (err) { console.error(err); alert('Scan to PDF failed.'); } this.isConverting = false; }
  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = 'scanned-document.pdf'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
