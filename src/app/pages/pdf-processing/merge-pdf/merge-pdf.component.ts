import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pages: number;
  bytes: ArrayBuffer;
}

interface PdfPageItem {
  id: string;
  fileId: string;
  fileName: string;
  pageIndex: number;
  thumbnailUrl: string;
  selected: boolean;
}

@Component({
  selector: 'app-merge-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './merge-pdf.component.html',
  styleUrls: ['./merge-pdf.component.css']
})
export class MergePdfComponent implements OnInit {
  activeStep: number = 1;

  files: PdfFileItem[] = [];
  pages: PdfPageItem[] = [];

  isDragging = false;
  isProcessing = false;
  processingMsg = '';
  progress = 0;

  // Settings
  combineInOrder = true;
  removeBlankPages = false;
  pageOrientation = 'Auto';
  compression = 'High (Recommended)';
  outputFilename = 'merged_document.pdf';

  draggedPageIndex: number | null = null;
  errorMsg: string | null = null;

  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;

  private pdfjsLib: any = null;
  private isBrowser: boolean;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.title.setTitle('Merge PDF – Arrange Pages & Combine | ConverterAllAI');
    this.meta.updateTag({
      name: 'description',
      content: 'Combine multiple PDF files into one document. Reorder individual pages visually.'
    });
  }

  // Lazy-load pdfjs only in browser
  private async getPdfJs(): Promise<any> {
    if (!this.isBrowser) return null;
    if (this.pdfjsLib) return this.pdfjsLib;

    // Dynamic import — only runs in browser, never on server
    const lib = await import('pdfjs-dist');
    (lib as any).GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
    this.pdfjsLib = lib;
    return lib;
  }

  // --- File Upload ---

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { this.isDragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault(); this.isDragging = false;
    if (e.dataTransfer?.files.length) this.addFiles(e.dataTransfer.files);
  }
  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.addFiles(input.files);
    input.value = '';
  }

  async addFiles(fileList: FileList) {
    if (!this.isBrowser) return;

    this.isProcessing = true;
    this.progress = 0;
    this.errorMsg = null;
    this.processingMsg = 'Loading pdfjs...';

    try {
      const pdfjs = await this.getPdfJs();
      if (!pdfjs) throw new Error('PDF library not available in this environment.');

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.type !== 'application/pdf') continue;

        const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).slice(2);
        const arrayBuffer = await file.arrayBuffer();

        this.processingMsg = `Reading: "${file.name}"`;

        let pdfDoc: any;
        try {
          pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        } catch (pdfErr: any) {
          this.errorMsg = `Could not read "${file.name}": ${pdfErr?.message || pdfErr}`;
          continue;
        }

        const numPages = pdfDoc.numPages;

        this.files.push({
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          pages: numPages,
          bytes: arrayBuffer
        });

        this.activeStep = 2;

        // Render thumbnails page by page
        for (let p = 1; p <= numPages; p++) {
          this.processingMsg = `Generating preview: "${file.name}" — ${p}/${numPages}`;
          this.progress = Math.round(((i + p / numPages) / fileList.length) * 100);

          try {
            const page = await pdfDoc.getPage(p);
            const viewport = page.getViewport({ scale: 0.6 });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: ctx as any, canvas, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

            this.pages.push({
              id: `page_${fileId}_${p}`,
              fileId,
              fileName: file.name,
              pageIndex: p - 1,
              thumbnailUrl: dataUrl,
              selected: true
            });

            page.cleanup();
          } catch (pgErr: any) {
            console.error('Page render error:', pgErr);
          }

          // Let the browser breathe & update UI
          await new Promise(r => setTimeout(r, 0));
        }
      }
    } catch (err: any) {
      console.error('addFiles error:', err);
      this.errorMsg = 'Error: ' + (err?.message || String(err));
    } finally {
      this.isProcessing = false;
      this.progress = 0;
      this.processingMsg = '';
      if (this.files.length > 0) {
        this.outputFilename = `merged_${this.files[0].name.replace(/\.pdf$/i, '')}.pdf`;
      }
    }
  }

  removeFile(fileId: string) {
    this.files = this.files.filter(f => f.id !== fileId);
    this.pages = this.pages.filter(p => p.fileId !== fileId);
  }

  clearAllFiles() {
    this.files = [];
    this.pages = [];
    this.convertedUrl = null;
    this.convertedBlob = null;
    this.activeStep = 1;
    this.errorMsg = null;
    this.outputFilename = 'merged_document.pdf';
  }

  togglePageSelection(page: PdfPageItem) {
    page.selected = !page.selected;
  }

  selectAll() { this.pages.forEach(p => p.selected = true); }
  deselectAll() { this.pages.forEach(p => p.selected = false); }

  get selectedPagesCount(): number { return this.selectedPages.length; }

  get selectedPages(): PdfPageItem[] { return this.pages.filter(p => p.selected); }

  get estimatedTotalSize(): number {
    if (!this.files.length) return 0;
    return this.files.reduce((total, f) => {
      const sel = this.pages.filter(p => p.fileId === f.id && p.selected).length;
      return total + f.size * (sel / f.pages);
    }, 0);
  }

  // --- Page Drag & Drop ---

  onPageDragStart(index: number) { this.draggedPageIndex = index; }
  onPageDragOver(e: DragEvent) { e.preventDefault(); }
  onPageDrop(e: DragEvent, dropIndex: number) {
    e.preventDefault();
    if (this.draggedPageIndex !== null && this.draggedPageIndex !== dropIndex) {
      const [moved] = this.pages.splice(this.draggedPageIndex, 1);
      this.pages.splice(dropIndex, 0, moved);
    }
    this.draggedPageIndex = null;
  }

  // --- Merge ---

  async mergeFiles() {
    if (!this.isBrowser) return;

    const pagesToMerge = this.selectedPages;
    if (pagesToMerge.length === 0) { alert('No pages selected.'); return; }

    this.isProcessing = true;
    this.processingMsg = 'Merging pages...';
    this.progress = 5;
    this.errorMsg = null;

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();
      const docsMap = new Map<string, any>();

      for (let i = 0; i < pagesToMerge.length; i++) {
        const item = pagesToMerge[i];

        if (!docsMap.has(item.fileId)) {
          const fileItem = this.files.find(f => f.id === item.fileId);
          if (!fileItem) continue;
          docsMap.set(item.fileId, await PDFDocument.load(fileItem.bytes, { ignoreEncryption: true }));
        }

        const srcDoc = docsMap.get(item.fileId);
        const [copiedPage] = await mergedPdf.copyPages(srcDoc, [item.pageIndex]);
        mergedPdf.addPage(copiedPage);

        this.progress = 5 + Math.round(((i + 1) / pagesToMerge.length) * 85);
        await new Promise(r => setTimeout(r, 0));
      }

      this.processingMsg = 'Saving...';
      this.progress = 95;

      const pdfBytes = await mergedPdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
      this.activeStep = 4;

    } catch (err: any) {
      console.error('Merge error:', err);
      this.errorMsg = 'Merge failed: ' + (err?.message || String(err));
    } finally {
      this.isProcessing = false;
      this.processingMsg = '';
    }
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    a.download = this.outputFilename || 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  formatBytes(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + s[i];
  }
}
