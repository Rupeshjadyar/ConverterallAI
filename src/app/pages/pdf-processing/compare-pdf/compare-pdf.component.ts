import { Component, OnInit } from '@angular/core'; import { CommonModule } from '@angular/common'; import { FormsModule } from '@angular/forms'; import { Title, Meta } from '@angular/platform-browser'; import { RouterModule } from '@angular/router';
@Component({ selector: 'app-compare-pdf', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './compare-pdf.component.html', styleUrls: ['./compare-pdf.component.css'] })
export class ComparePdfComponent implements OnInit {
  selectedFiles: File[] = []; isDragging = false; isConverting = false; progress = 0; convertedUrl: string | null = null; convertedBlob: Blob | null = null;
  comparisonResult = '';
  constructor(private title: Title, private meta: Meta) {} ngOnInit() { this.title.setTitle('Compare PDFs – Side by Side Comparison | ConverterAllAI'); this.meta.updateTag({ name: 'description', content: 'Compare two PDF files side by side.' }); }
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; } onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) { e.preventDefault(); this.isDragging = false; if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files); }
  onFileSelected(e: Event) { const input = e.target as HTMLInputElement; if (input.files?.length) this.addFiles(input.files); }
  addFiles(files: FileList) { this.selectedFiles.push(...Array.from(files).slice(0, 2 - this.selectedFiles.length)); this.resetState(false); }
  removeFile(i: number) { this.selectedFiles.splice(i, 1); if (!this.selectedFiles.length) this.resetState(true); } hasSettings() { return false; }
  resetState(clearFiles = true) { this.convertedUrl = null; this.convertedBlob = null; this.progress = 0; this.isConverting = false; this.comparisonResult = ''; if (clearFiles) this.selectedFiles = []; }
  async processFiles() {
    if (this.selectedFiles.length < 2) { alert('Please select 2 PDF files to compare.'); return; }
    this.isConverting = true; this.progress = 0;
    try {
      const { PDFDocument } = await import('pdf-lib'); this.progress = 20;
      const b1 = await this.selectedFiles[0].arrayBuffer(); const p1 = await PDFDocument.load(b1, { ignoreEncryption: true }); this.progress = 40;
      const b2 = await this.selectedFiles[1].arrayBuffer(); const p2 = await PDFDocument.load(b2, { ignoreEncryption: true }); this.progress = 60;
      this.comparisonResult = `📄 File 1: ${this.selectedFiles[0].name}\n   Pages: ${p1.getPageCount()}, Size: ${this.formatBytes(this.selectedFiles[0].size)}\n\n📄 File 2: ${this.selectedFiles[1].name}\n   Pages: ${p2.getPageCount()}, Size: ${this.formatBytes(this.selectedFiles[1].size)}\n\n📊 Comparison:\n   Page difference: ${Math.abs(p1.getPageCount() - p2.getPageCount())} pages\n   Size difference: ${this.formatBytes(Math.abs(this.selectedFiles[0].size - this.selectedFiles[1].size))}`;
      this.progress = 90;
      this.convertedBlob = new Blob([this.comparisonResult], { type: 'text/plain' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) { console.error(err); alert('Comparison failed.'); } this.isConverting = false;
  }
  download() { if (!this.convertedBlob) return; const a = document.createElement('a'); a.href = URL.createObjectURL(this.convertedBlob); a.download = 'comparison-report.txt'; a.click(); }
  formatBytes(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024, s = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes)/Math.log(k)); return parseFloat((bytes/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
}
