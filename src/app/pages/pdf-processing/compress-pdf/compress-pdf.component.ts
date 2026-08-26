import {
  Component, OnInit, OnDestroy, NgZone,
  Inject, PLATFORM_ID, ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

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

  selectedLevel = 'medium';

  levels: Level[] = [
    { id:'low',     label:'Low',     icon:'🟢', desc:'Best quality, gentle compression',   quality:0.90, scale:1.5,  dpi:'144', savings:'~20–40%' },
    { id:'medium',  label:'Medium',  icon:'🟡', desc:'Balanced — best for most files',     quality:0.75, scale:1.2,  dpi:'115', savings:'~40–60%', badge:'Recommended' },
    { id:'high',    label:'High',    icon:'🟠', desc:'Smaller file, slight quality loss',  quality:0.55, scale:1.0,  dpi:'96',  savings:'~60–75%' },
    { id:'maximum', label:'Maximum', icon:'🔴', desc:'Smallest possible, aggressive',      quality:0.32, scale:0.75, dpi:'72',  savings:'~75–90%' },
  ];

  private readonly isBrowser: boolean;

  constructor(
    private title: Title,
    private meta:  Meta,
    private zone:  NgZone,
    private cdr:   ChangeDetectorRef,
    @Inject(PLATFORM_ID) pid: object,
  ) { this.isBrowser = isPlatformBrowser(pid); }

  ngOnInit() {
    this.title.setTitle('Compress PDF – Reduce PDF File Size Online | ConverterAllAI');
    this.meta.updateTag({ name: 'description', content: 'Compress PDF files instantly in your browser. No uploads, 100% private.' });
  }

  ngOnDestroy() { this._revoke(); }

  get lvl():        Level   { return this.levels.find(l => l.id === this.selectedLevel)!; }
  get savedPct():   number  { return this.origSize && this.newSize ? Math.max(0, Math.round((1 - this.newSize / this.origSize) * 100)) : 0; }
  get savedBytes(): number  { return Math.max(0, this.origSize - this.newSize); }
  get bigger():     boolean { return this.newSize > 0 && this.newSize >= this.origSize; }

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
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) ?? files[0];
    if (!pdf) return;
    this.error = ''; this.state = 'idle'; this.file = pdf;
    this.origSize = pdf.size;
    this.outName  = pdf.name.replace(/\.pdf$/i, '') + '_compressed.pdf';
    this._revoke(); this.resultBlob = null; this.newSize = 0;
  }

  // ── Compress ─────────────────────────────────────────────────────────────
  compress() {
    if (!this.file || !this.isBrowser) return;

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
      setTimeout(() => this._doCompress(), 0);
    });
  }

  /**
   * Updates progress/message inside Angular's zone (so bindings refresh),
   * then yields control back to the browser for one full frame so the
   * repaint actually happens before we resume heavy synchronous work.
   */
  private _setProgress(progress: number, msg: string): Promise<void> {
    this.zone.run(() => {
      this.progress = progress;
      this.progMsg  = msg;
      this.cdr.detectChanges();
    });
    return new Promise<void>(resolve =>
      requestAnimationFrame(() => setTimeout(resolve, 0))
    );
  }

  private async _doCompress() {
    const lvl = this.lvl;
    try {

      // 1. Read bytes
      await this._setProgress(5, 'Reading file…');
      const bytes = await this.file!.arrayBuffer();

      // 2. Load PDF.js
      await this._setProgress(10, 'Loading PDF engine…');
      const pdfjsLib = await import('pdfjs-dist');
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.mjs';

      // 3. Load pdf-lib
      await this._setProgress(15, 'Preparing tools…');
      const { PDFDocument } = await import('pdf-lib');

      // 4. Parse document
      await this._setProgress(20, 'Parsing document…');
      const pdfDoc      = await (pdfjsLib as any).getDocument({ data: new Uint8Array(bytes) }).promise;
      const totalPages: number = pdfDoc.numPages;
      const outDoc      = await PDFDocument.create();

      // 5. Render each page → JPEG → embed
      const canvas = document.createElement('canvas');
      const ctx    = canvas.getContext('2d')!;

      for (let i = 1; i <= totalPages; i++) {
        const pct = 20 + Math.round(((i - 1) / totalPages) * 68);
        await this._setProgress(pct, `Compressing page ${i} of ${totalPages}…`);

        const page     = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: lvl.scale });

        canvas.width  = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const jpegBlob: Blob = await new Promise(res =>
          canvas.toBlob(b => res(b!), 'image/jpeg', lvl.quality)
        );
        const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());

        const img = await outDoc.embedJpg(jpegBytes);
        const pg  = outDoc.addPage([viewport.width, viewport.height]);
        pg.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
      }

      // 6. Save
      await this._setProgress(92, 'Saving PDF…');
      const out = await outDoc.save({ useObjectStreams: true });

      // 7. Done
      this._revoke();
      this.resultBlob = new Blob([out as any], { type: 'application/pdf' });
      this.newSize    = this.resultBlob.size;
      this.resultUrl  = URL.createObjectURL(this.resultBlob);

      this.zone.run(() => {
        this.progress = 100;
        this.progMsg  = 'Done!';
        this.state    = 'done';
        this.cdr.detectChanges();
      });

    } catch (err: any) {
      console.error('[CompressPDF]', err);
      this.zone.run(() => {
        this.error = 'Compression failed: ' + (err?.message ?? String(err));
        this.state = 'idle';
        this.cdr.detectChanges();
      });
    }
  }

  // ── Download ─────────────────────────────────────────────────────────────
  download() {
    if (!this.resultBlob) return;
    const url = URL.createObjectURL(this.resultBlob);
    const a = Object.assign(document.createElement('a'), { href: url, download: this.outName });
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  reset() {
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