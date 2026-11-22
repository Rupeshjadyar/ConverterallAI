import {
  Component, OnInit, OnDestroy, NgZone,
  Inject, PLATFORM_ID, ChangeDetectorRef, inject
} from '@angular/core';
import { ToolExecutionService } from '../../../services/tool-execution.service';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { canvasImage, downloadPdfToolOutput, openPdf, renderPdfPage } from '../pdf-browser';
import { processPdfInWorker } from '../pdf-engine';

type State = 'idle' | 'compressing' | 'done';

interface Level {
  id: string; label: string; desc: string; icon: string; badge?: string;
  quality: number; scale: number; dpi: string; savings: string;
}

@Component({
  selector: 'app-compress-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './compress-pdf.component.html',
  styleUrls: ['./compress-pdf.component.css'],
})
export class CompressPdfComponent implements OnInit, OnDestroy {

  state: State = 'idle';
  isDragging  = false;
  error       = '';

  file:     File | null = null;
  origSize  = 0;
  outName   = 'compressed.pdf';

  progress  = 0;
  progMsg   = '';

  resultBlob: Blob   | null = null;
  resultUrl:  string | null = null;
  newSize   = 0;

  selectedLevel = 'lossless';
  private job = 0;

  levels: Level[] = [
    { id: 'lossless', label: 'Lossless', icon: '✓', desc: 'Preserve selectable text and form fields', quality: 1, scale: 1, dpi: 'Original', savings: 'Varies', badge: 'Recommended' },
    { id: 'low', label: 'Low', icon: '🟢', desc: 'Flatten pages into high-quality images', quality: 0.90, scale: 1.5, dpi: '108', savings: 'Varies' },
    { id: 'medium', label: 'Medium', icon: '🟡', desc: 'Flatten pages into medium-quality images', quality: 0.75, scale: 1.2, dpi: '86', savings: 'Varies' },
    { id: 'high', label: 'High', icon: '🟠', desc: 'Flatten pages into lower-quality images', quality: 0.55, scale: 1.0, dpi: '72', savings: 'Varies' },
    { id: 'maximum', label: 'Maximum', icon: '🔴', desc: 'Flatten pages into low-resolution images', quality: 0.32, scale: 0.75, dpi: '54', savings: 'Varies' },
  ];

  private readonly isBrowser: boolean;

  constructor(
    private title: Title,
    private meta:  Meta,
    private zone:  NgZone,
    private cdr:   ChangeDetectorRef,
    @Inject(PLATFORM_ID) pid: object,
  ) { this.isBrowser = isPlatformBrowser(pid); }

  private toolExec = inject(ToolExecutionService);

  ngOnInit() {
    this.title.setTitle('Compress PDF – Reduce PDF File Size Online | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Compress PDF files instantly in your browser. No uploads, 100% private.' });

    // Check if AI Agent passed a file to process!
    const task = this.toolExec.pendingTask();
    if (task && task.toolId === 'compress-pdf' && task.file) {
      this._pick([task.file]);
      this.toolExec.clearTask();
      
      if (task.autoStart) {
        setTimeout(() => this.compress(), 800);
      }
    }
  }

  ngOnDestroy() { this.job++; this._revoke(); }

  get lvl():        Level   { return this.levels.find(l => l.id === this.selectedLevel)!; }
  get savedPct():   number  { return this.origSize && this.newSize ? Math.max(0, Math.round((1 - this.newSize / this.origSize) * 100)) : 0; }
  get savedBytes(): number  { return Math.max(0, this.origSize - this.newSize); }
  get bigger():     boolean { return this.newSize > 0 && this.newSize >= this.origSize; }
  get downloadName(): string { return this.bigger && this.file ? this.file.name : this.outName; }

  // ── Drag & Drop ─────────────────────────────────────────────────────────
  onDragOver(e: DragEvent)  { e.preventDefault(); this.isDragging = true; }
  onDragLeave()             { this.isDragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault(); this.isDragging = false;
    if (e.dataTransfer?.files.length) this._pick(Array.from(e.dataTransfer.files));
  }
  onFileInput(e: Event) {
    const inp = e.target as HTMLInputElement;
    if (!inp.files?.length) return;
    const files = Array.from(inp.files);
    inp.value = '';
    this._pick(files);
  }
  private _pick(files: File[]) {
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (!pdf || !pdf.size || pdf.size > 100 * 1024 * 1024) {
      this.error = 'Choose a nonempty PDF no larger than 100 MB.';
      return;
    }
    this.job++;
    this.error = ''; this.state = 'idle'; this.file = pdf;
    this.origSize = pdf.size;
    this.outName  = pdf.name.replace(/\.pdf$/i, '') + '_compressed.pdf';
    this._revoke(); this.resultBlob = null; this.newSize = 0;
  }

  // ── Compress ─────────────────────────────────────────────────────────────
  compress() {
    if (!this.file || !this.isBrowser || this.state === 'compressing') return;

    if (typeof WebAssembly === 'undefined') {
      this.error = 'PDF compression needs WebAssembly. Open this page in a current browser with WebAssembly enabled.';
      return;
    }

    const file = this.file;
    const job = ++this.job;
    const level = this.lvl;
    this.state    = 'compressing';
    this.progress = 0;
    this.progMsg  = 'Starting…';
    this.error    = '';

    // Run all the heavy work OUTSIDE Angular's zone. This stops zone.js from
    // trying to run change detection on every internal microtask of pdfjs /
    // pdf-lib (which is expensive and pointless). We re-enter the zone
    // ourselves, only when we actually have a UI update to push.
    this.zone.runOutsideAngular(() => {
      // Let the 'compressing' template render one frame before starting.
      setTimeout(() => this._doCompress(file, level, job), 0);
    });
  }

  /**
   * Updates progress/message inside Angular's zone (so bindings refresh),
   * then yields control back to the browser for one full frame so the
   * repaint actually happens before we resume heavy synchronous work.
   */
  private _setProgress(job: number, progress: number, msg: string): Promise<void> {
    if (job !== this.job) return Promise.reject(new Error('PDF selection changed'));
    this.zone.run(() => {
      this.progress = progress;
      this.progMsg  = msg;
      this.cdr.detectChanges();
    });
    return new Promise<void>(resolve => setTimeout(resolve, 0));
  }

private async _doCompress(file: File, level: Level, job: number) {
    try {
      await this._setProgress(job, 10, 'Opening PDF…');
      const candidate = level.id === 'lossless'
        ? await processPdfInWorker(file, 'optimize')
        : await this._compressImages(file, level, job);
      if (job !== this.job) return;

      this._revoke();
      this.resultBlob = candidate.size < file.size ? candidate : file;
      this.newSize = this.resultBlob.size;
      this.resultUrl = URL.createObjectURL(this.resultBlob);
      this.zone.run(() => {
        this.progress = 100;
        this.progMsg = 'Done!';
        this.state = 'done';
        this.cdr.detectChanges();
      });
    } catch {
      if (job !== this.job) return;
      this.zone.run(() => {
        this.error = 'This PDF could not be compressed. Try a smaller, unlocked PDF.';
        this.state = 'idle';
        this.cdr.detectChanges();
      });
    }
  }

  private async _compressImages(file: File, level: Level, job: number): Promise<Blob> {
    const { pdf, close } = await openPdf(file);
    const canvas = document.createElement('canvas');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const output = await PDFDocument.create();
      for (let number = 1; number <= pdf.numPages; number++) {
        await this._setProgress(job, 20 + Math.round((number - 1) / pdf.numPages * 70),
          'Compressing page ' + number + ' of ' + pdf.numPages + '…');
        const page = await pdf.getPage(number);
        try {
          const { width, height } = await renderPdfPage(page, canvas, level.scale);
          const jpeg = await canvasImage(canvas, 'image/jpeg', level.quality);
          const image = await output.embedJpg(await jpeg.arrayBuffer());
          output.addPage([width, height]).drawImage(image, { x: 0, y: 0, width, height });
        } finally {
          page.cleanup();
        }
      }
      return new Blob([Uint8Array.from(await output.save())], { type: 'application/pdf' });
    } finally {
      canvas.width = canvas.height = 0;
      await close();
    }
  }

  // ── Download ─────────────────────────────────────────────────────────────
  download() {
    if (!this.resultBlob) return;
    downloadPdfToolOutput(this.resultBlob, this.downloadName);
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  reset() {
    this.job++;
    this._revoke();
    this.state = 'idle'; this.file = null; this.origSize = 0;
    this.resultBlob = null; this.newSize = 0; this.error = '';
    this.progress = 0; this.outName = 'compressed.pdf';
  }

  fmt(b: number): string {
    if (!b) return '0 B';
    const k = 1024, u = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return (b / k ** i).toFixed(1) + ' ' + u[i];
  }

  private _revoke() {
    if (this.resultUrl) { URL.revokeObjectURL(this.resultUrl); this.resultUrl = null; }
  }
}
