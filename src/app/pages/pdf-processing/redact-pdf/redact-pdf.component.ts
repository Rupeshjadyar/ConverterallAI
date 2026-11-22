import { Component, ElementRef, OnDestroy, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { canvasImage, downloadPdfToolOutput, openPdf, renderPdfPage } from '../pdf-browser';
import type { OpenedPdf } from '../pdf-browser';

interface Point { x: number; y: number }
interface RedactionArea { x: number; y: number; width: number; height: number }

@Component({
  selector: 'app-redact-pdf',
  imports: [RouterLink],
  templateUrl: './redact-pdf.component.html',
  styleUrl: './redact-pdf.component.css',
})
export class RedactPdfComponent implements OnDestroy {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('preview');
  private source?: OpenedPdf;
  private file?: File;
  private disposed = false;
  private drag?: { pointerId: number; start: Point };
  private readonly areas = signal<ReadonlyMap<number, readonly RedactionArea[]>>(new Map());

  readonly pageNumber = signal(1);
  readonly pageCount = signal(0);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly status = signal('');
  readonly draft = signal<RedactionArea | null>(null);
  readonly result = signal<Blob | null>(null);
  readonly pageAreas = computed(() => this.areas().get(this.pageNumber()) ?? []);
  readonly totalAreas = computed(() =>
    Array.from(this.areas().values()).reduce((count, areas) => count + areas.length, 0)
  );

  async selectFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.busy()) return;
    if (file.size > 100 * 1024 * 1024) {
      this.error.set('Choose a PDF smaller than 100 MB.');
      return;
    }

    this.busy.set(true);
    this.pageCount.set(0);
    this.areas.set(new Map());
    this.resetSelection();
    this.result.set(null);
    this.error.set('');
    this.status.set('Opening PDF…');
    try {
      await this.source?.close();
      this.source = undefined;
      const source = await openPdf(file);
      if (this.disposed || source.pdf.numPages > 75) {
        await source.close();
        if (!this.disposed) this.error.set('Choose a PDF with up to 75 pages.');
        return;
      }
      this.source = source;
      this.file = file;
      await this.showPage(1);
      this.pageCount.set(source.pdf.numPages);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Could not load the PDF.');
    } finally {
      this.status.set('');
      this.busy.set(false);
    }
  }

  async navigate(delta: number): Promise<void> {
    const page = this.pageNumber() + delta;
    if (this.busy() || page < 1 || page > this.pageCount()) return;
    this.busy.set(true);
    this.resetSelection();
    try {
      await this.showPage(page);
      this.error.set('');
    } catch {
      this.pageCount.set(0);
      this.error.set('Could not render this page. Reopen the PDF to try again.');
    } finally {
      this.busy.set(false);
    }
  }

  private async showPage(pageNumber: number): Promise<void> {
    const page = await this.source!.pdf.getPage(pageNumber);
    try {
      await renderPdfPage(page, this.canvas().nativeElement, 1.5);
      this.pageNumber.set(pageNumber);
    } finally {
      page.cleanup();
    }
  }

  startSelection(event: PointerEvent): void {
    if (this.busy() || this.drag || event.button !== 0) return;
    const surface = event.currentTarget as HTMLElement;
    surface.setPointerCapture(event.pointerId);
    const start = this.position(event, surface);
    this.drag = { pointerId: event.pointerId, start };
    this.draft.set({ ...start, width: 0, height: 0 });
  }

  moveSelection(event: PointerEvent): void {
    if (this.drag?.pointerId !== event.pointerId) return;
    const end = this.position(event, event.currentTarget as HTMLElement);
    const { start } = this.drag;
    this.draft.set({
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(start.x - end.x),
      height: Math.abs(start.y - end.y),
    });
  }

  finishSelection(event: PointerEvent): void {
    if (this.drag?.pointerId !== event.pointerId) return;
    this.moveSelection(event);
    const area = this.draft();
    this.resetSelection();
    if (!area || area.width < 0.003 || area.height < 0.003) return;
    this.updatePageAreas([...this.pageAreas(), area]);
  }

  resetSelection(): void {
    this.drag = undefined;
    this.draft.set(null);
  }

  undo(): void {
    this.updatePageAreas(this.pageAreas().slice(0, -1));
  }

  private updatePageAreas(areas: readonly RedactionArea[]): void {
    const next = new Map(this.areas());
    if (areas.length) next.set(this.pageNumber(), areas);
    else next.delete(this.pageNumber());
    this.areas.set(next);
    this.result.set(null);
  }

  private position(event: PointerEvent, surface: HTMLElement): Point {
    const bounds = surface.getBoundingClientRect();
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    return {
      x: clamp((event.clientX - bounds.left) / bounds.width),
      y: clamp((event.clientY - bounds.top) / bounds.height),
    };
  }

  async exportPdf(): Promise<void> {
    const source = this.source?.pdf;
    if (!source || this.busy() || !this.totalAreas()) return;
    this.busy.set(true);
    this.status.set('Preparing redacted PDF…');
    this.error.set('');
    this.result.set(null);
    const canvas = document.createElement('canvas');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const output = await PDFDocument.create({ updateMetadata: false });
      for (let number = 1; number <= source.numPages; number++) {
        if (this.disposed) return;
        this.status.set(`Rendering page ${number} of ${source.numPages}…`);
        const page = await source.getPage(number);
        try {
          const { width, height } = await renderPdfPage(page, canvas, 2);
          const ctx = canvas.getContext('2d')!;
          ctx.fillStyle = '#000000';
          for (const area of this.areas().get(number) ?? []) {
            const left = Math.floor(area.x * canvas.width);
            const top = Math.floor(area.y * canvas.height);
            const right = Math.ceil((area.x + area.width) * canvas.width);
            const bottom = Math.ceil((area.y + area.height) * canvas.height);
            ctx.fillRect(left, top, right - left, bottom - top);
          }
          // Embed only the rendered pixels, so the original page objects and text never enter the output.
          const pixels = await canvasImage(canvas, 'image/png');
          const image = await output.embedPng(await pixels.arrayBuffer());
          output.addPage([width, height]).drawImage(image, { x: 0, y: 0, width, height });
        } finally {
          page.cleanup();
        }
      }
      const bytes = Uint8Array.from(await output.save());
      if (!this.disposed) this.result.set(new Blob([bytes], { type: 'application/pdf' }));
    } catch {
      this.error.set('Could not export the redacted PDF. Try splitting the PDF into smaller files.');
    } finally {
      canvas.width = canvas.height = 0;
      this.status.set('');
      this.busy.set(false);
    }
  }

  download(): void {
    const output = this.result();
    if (output && this.file) {
      downloadPdfToolOutput(output, this.file.name.replace(/\.pdf$/i, '') + '-redacted.pdf');
    }
  }

  ngOnDestroy(): void {
    this.disposed = true;
    void this.source?.close().catch(() => {});
  }
}
