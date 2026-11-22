import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export interface OpenedPdf {
  pdf: PDFDocumentProxy;
  close: () => Promise<void>;
}

export async function openPdf(file: File): Promise<OpenedPdf> {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  GlobalWorkerOptions.workerSrc = new URL('assets/pdf.worker.min.mjs', document.baseURI).href;
  const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  try {
    return { pdf: await task.promise, close: () => task.destroy() };
  } catch (error) {
    await task.destroy().catch(() => {});
    if (error instanceof Error && error.name === 'PasswordException') {
      throw new Error('Unlock this PDF with its current password before continuing.');
    }
    throw new Error('Could not open this PDF. Choose a readable PDF file.');
  }
}

export async function renderPdfPage(page: PDFPageProxy, canvas: HTMLCanvasElement, scale: number) {
  const size = page.getViewport({ scale: 1 });
  const boundedScale = Math.min(scale, 4_096 / size.width, 4_096 / size.height,
    Math.sqrt(8_000_000 / (size.width * size.height)));
  const viewport = page.getViewport({ scale: boundedScale });
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  await page.render({ canvas, viewport, background: '#ffffff' }).promise;
  return size;
}

export function canvasImage(canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg', quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('This page could not be rendered as an image.'));
    }, type, quality);
  });
}

export function downloadPdfToolOutput(blob: Blob, filename: string): void {
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(href), 1_000);
}
