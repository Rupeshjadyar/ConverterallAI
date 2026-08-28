import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ToolExecutionService } from '../../../services/tool-execution.service';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// ─── Domain models ────────────────────────────────────────────────────────────

interface PdfSource {
  /** Unique id for this uploaded file */
  id: string;
  name: string;
  /** Raw bytes – kept so pdf-lib can re-load during merge */
  bytes: ArrayBuffer;
}

interface PageItem {
  /** Unique id for this page slot */
  id: string;
  /** Which source file this page belongs to */
  sourceId: string;
  /** 0-based page index inside the source PDF */
  pageIndex: number;
  /** JPEG data-URL rendered by PDF.js */
  thumbnail: string;
}

// ─── Component states ─────────────────────────────────────────────────────────

type AppState = 'idle' | 'loading' | 'ready' | 'merging' | 'done';

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-merge-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './merge-pdf.component.html',
  styleUrls: ['./merge-pdf.component.css'],
})
export class MergePdfComponent implements OnInit, OnDestroy {
  // ── public state (bound in template) ──────────────────────────────────────
  state: AppState = 'idle';

  sources: PdfSource[] = [];  // uploaded files meta
  pages: PageItem[] = [];     // ordered list of all (remaining) pages

  loadingMessage = '';
  loadingPercent = 0;

  mergingMessage = '';
  mergingPercent = 0;

  downloadUrl: string | null = null;
  downloadName = 'merged.pdf';

  errorMessage = '';
  isDragging = false;

  // Preview modal
  previewPage: PageItem | null = null;
  draggedIdx: number | null = null;

  // ── private ───────────────────────────────────────────────────────────────
  private pdfjs: any = null;
  private readonly isBrowser: boolean;

  constructor(
    private readonly titleSvc: Title,
    private readonly metaSvc: Meta,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ── lifecycle ─────────────────────────────────────────────────────────────

  private toolExec = inject(ToolExecutionService);

  ngOnInit(): void {
    this.titleSvc.setTitle('Merge PDF – Preview Pages & Combine | ConverterAllAI');
    this.metaSvc.updateTag({
      name: 'description',
      content:
        'Upload one or more PDFs, preview every page as a thumbnail, remove unwanted pages, then merge and download as a single PDF – entirely in your browser.',
    });

    // Check if AI Agent passed a file to process!
    const task = this.toolExec.pendingTask();
    if (task && task.toolId === 'merge-pdf' && task.file) {
      this._ingestFiles([task.file]);
      this.toolExec.clearTask();
      // Merge doesn't autoStart immediately usually because they need to upload MORE than 1 file, 
      // but we load it into the workspace!
    }
  }

  ngOnDestroy(): void {
    this._revokeDownload();
  }

  // ── drag & drop ───────────────────────────────────────────────────────────

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const fileList = event.dataTransfer?.files;
    if (fileList?.length) {
      // Convert to plain array immediately — FileList is a live DOM object
      this._ingestFiles(Array.from(fileList));
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    // CRITICAL: Convert FileList → File[] synchronously BEFORE clearing input.value.
    // FileList is a live object tied to the <input> element — setting input.value=''
    // empties it instantly, which would make fileList appear empty inside the async
    // _ingestFiles function even though the user selected real files.
    const files = Array.from(input.files);
    input.value = ''; // reset so the same file can be re-selected later
    this._ingestFiles(files);
  }

  // ── page management ───────────────────────────────────────────────────────

  /**
   * Permanently removes a page from the working list.
   * The original ArrayBuffer is untouched, so pdf-lib can still
   * copy the remaining pages from the source during merge.
   */
  deletePage(page: PageItem): void {
    this.pages = this.pages.filter((p) => p.id !== page.id);
    if (this.previewPage?.id === page.id) this.previewPage = null;
  }

  /** Reorder pages via drag-and-drop */
  onDrop2(event: DragEvent, toIndex: number): void {
    event.preventDefault();
    if (this.draggedIdx == null || this.draggedIdx === toIndex) {
      this.draggedIdx = null;
      return;
    }
    const moved = this.pages.splice(this.draggedIdx, 1)[0];
    this.pages.splice(toIndex, 0, moved);
    this.pages = [...this.pages];
    this.draggedIdx = null;
  }

  openPreview(page: PageItem): void {
    this.previewPage = page;
  }

  closePreview(): void {
    this.previewPage = null;
  }

  // ── merge ─────────────────────────────────────────────────────────────────

  get canMerge(): boolean {
    return this.pages.length > 0 && this.state === 'ready';
  }

  async mergePdf(): Promise<void> {
    if (!this.canMerge || !this.isBrowser) return;

    this.state = 'merging';
    this.mergingPercent = 0;
    this.mergingMessage = 'Preparing…';
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const { PDFDocument } = await import('pdf-lib');

      // Load every source file into pdf-lib (cache by sourceId)
      const docCache = new Map<string, Awaited<ReturnType<typeof PDFDocument.load>>>();
      for (const src of this.sources) {
        const doc = await PDFDocument.load(src.bytes, { ignoreEncryption: true });
        docCache.set(src.id, doc);
      }

      const output = await PDFDocument.create();
      const total = this.pages.length;

      for (let i = 0; i < total; i++) {
        const pg = this.pages[i];
        const src = docCache.get(pg.sourceId);
        if (!src) continue;

        const [copiedPage] = await output.copyPages(src, [pg.pageIndex]);
        output.addPage(copiedPage);

        this.mergingPercent = Math.round(((i + 1) / total) * 90);
        this.mergingMessage = `Adding page ${i + 1} of ${total}…`;
        this.cdr.detectChanges();
        await this._tick();
      }

      this.mergingMessage = 'Saving PDF…';
      this.mergingPercent = 95;
      this.cdr.detectChanges();

      const bytes = await output.save();

      this._revokeDownload();
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      this.downloadUrl = URL.createObjectURL(blob);
      this.mergingPercent = 100;
      this.state = 'done';
    } catch (err: unknown) {
      this.errorMessage = `Merge failed: ${err instanceof Error ? err.message : String(err)}`;
      this.state = 'ready';
    }

    this.cdr.detectChanges();
  }

  triggerDownload(): void {
    if (!this.downloadUrl || !this.isBrowser) return;
    const a = document.createElement('a');
    a.href = this.downloadUrl;
    a.download = this.downloadName || 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── reset ─────────────────────────────────────────────────────────────────

  reset(): void {
    this._revokeDownload();
    this.state = 'idle';
    this.sources = [];
    this.pages = [];
    this.errorMessage = '';
    this.loadingMessage = '';
    this.loadingPercent = 0;
    this.downloadUrl = null;
    this.downloadName = 'merged.pdf';
    this.previewPage = null;
  }

  // ── private helpers ───────────────────────────────────────────────────────

  private async _ingestFiles(files: File[]): Promise<void> {
    this.state = 'loading';
    this.errorMessage = '';
    this.sources = [];
    this.pages = [];
    this.loadingPercent = 0;
    this.loadingMessage = 'Initialising…';
    this.cdr.detectChanges();

    const pdfjs = await this._getPdfJs();
    const { PDFDocument } = await import('pdf-lib');

    // files is already a plain File[] array — no FileList liveness issues
    const validFiles = files;

    if (validFiles.length === 0) {
      this.errorMessage = 'No files were selected. Please choose one or more PDF files.';
      this.state = 'idle';
      this.cdr.detectChanges();
      return;
    }

    let globalPagesDone = 0;
    let totalPages = 0;

    // First pass – count total pages so we can show accurate progress
    const fileMeta: { file: File; bytes: ArrayBuffer; pageCount: number }[] = [];
    for (const file of validFiles) {
      try {
        this.loadingMessage = `Reading "${file.name}"…`;
        this.cdr.detectChanges();
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pageCount = doc.getPageCount();
        totalPages += pageCount;
        fileMeta.push({ file, bytes, pageCount });
      } catch (e) {
        // Only show error for files that look like PDFs; silently skip others
        const looksLikePdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
        if (looksLikePdf) {
          this.errorMessage = `"${file.name}" could not be read — it may be corrupt or password-protected.`;
        } else {
          // Skip silently — user accidentally added a non-PDF
        }
      }
    }

    if (fileMeta.length === 0) {
      this.errorMessage = 'None of the selected files could be read as PDFs. Please select valid PDF files.';
      this.state = 'idle';
      this.cdr.detectChanges();
      return;
    }

    // Second pass – render thumbnails page by page
    for (const { file, bytes, pageCount } of fileMeta) {
      const sourceId = `src_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      this.sources.push({ id: sourceId, name: file.name, bytes });

      // Determine output filename from the first file
      if (this.sources.length === 1) {
        this.downloadName = file.name.replace(/\.pdf$/i, '') + '_merged.pdf';
      }

      let pjsDoc: any = null;
      if (pdfjs) {
        try {
          pjsDoc = await pdfjs.getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise;
        } catch (e) {
          console.warn('[PDF.js] Failed to open document – thumbnails will be placeholders.', e);
        }
      }

      for (let pg = 0; pg < pageCount; pg++) {
        this.loadingMessage = `"${file.name}" — rendering page ${pg + 1} of ${pageCount}`;
        this.loadingPercent = totalPages
          ? Math.round(((globalPagesDone + pg) / totalPages) * 96) + 2
          : 50;
        this.cdr.detectChanges();

        let thumbnail = '';

        if (pjsDoc) {
          try {
            const pdfPage = await pjsDoc.getPage(pg + 1); // 1-based in PDF.js
            const scale = 1.4;
            const viewport = pdfPage.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d')!;
            await pdfPage.render({ canvasContext: ctx, viewport }).promise;
            thumbnail = canvas.toDataURL('image/jpeg', 0.82);
            pdfPage.cleanup();
          } catch (e) {
            console.warn(`[PDF.js] Page ${pg + 1} render error:`, e);
          }
        }

        if (!thumbnail) {
          thumbnail = this._svgPlaceholder(pg + 1, file.name);
        }

        this.pages.push({
          id: `${sourceId}_p${pg}`,
          sourceId,
          pageIndex: pg,
          thumbnail,
        });

        await this._tick(); // yield to the browser so the UI updates
      }

      if (pjsDoc) {
        try { pjsDoc.destroy(); } catch { /* noop */ }
      }

      globalPagesDone += pageCount;
    }

    this.loadingPercent = 100;
    this.loadingMessage = 'Done!';
    this.cdr.detectChanges();
    await this._delay(200);

    this.state = 'ready';
    this.cdr.detectChanges();
  }

  /** Lazy-load PDF.js and configure its worker (worker file is copied to /assets by angular.json) */
  private async _getPdfJs(): Promise<any> {
    if (!this.isBrowser) return null;
    if (this.pdfjs) return this.pdfjs;

    try {
      const lib: any = await import('pdfjs-dist');
      if (lib?.GlobalWorkerOptions) {
        lib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';
      }
      this.pdfjs = lib;
      return lib;
    } catch (e) {
      console.warn('[PDF.js] Library could not be loaded – falling back to SVG placeholders.', e);
      return null;
    }
  }

  /** Minimal SVG thumbnail used when PDF.js rendering is unavailable */
  private _svgPlaceholder(pageNum: number, fileName: string): string {
    const label = fileName.length > 20 ? fileName.slice(0, 18) + '…' : fileName;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="210">
      <rect width="160" height="210" rx="8" fill="#1a2744" stroke="#253657" stroke-width="1.5"/>
      <rect x="16" y="16" width="128" height="8" rx="3" fill="#253657"/>
      <rect x="16" y="32" width="96"  height="5" rx="2" fill="#1e304e"/>
      <rect x="16" y="44" width="112" height="5" rx="2" fill="#1e304e"/>
      <rect x="16" y="56" width="72"  height="5" rx="2" fill="#1e304e"/>
      <rect x="16" y="80" width="128" height="84" rx="6" fill="#0d1b31" stroke="#253657"/>
      <text x="80" y="130" font-family="system-ui,sans-serif" font-size="20" font-weight="700"
            fill="#38bdf8" text-anchor="middle">${pageNum}</text>
      <text x="80" y="152" font-family="system-ui,sans-serif" font-size="9"
            fill="#4b6080" text-anchor="middle">${label}</text>
      <text x="80" y="185" font-family="system-ui,sans-serif" font-size="8"
            fill="#2a3f5a" text-anchor="middle">No preview available</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  private _revokeDownload(): void {
    if (this.downloadUrl) {
      URL.revokeObjectURL(this.downloadUrl);
      this.downloadUrl = null;
    }
  }

  /** Yield to the browser event loop */
  private _tick(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  private _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}