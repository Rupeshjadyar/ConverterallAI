type PdfEngineOperation = 'protect' | 'unlock' | 'optimize';

export function processPdfInWorker(file: File, operation: PdfEngineOperation, password = ''): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('assets/qpdf/worker.js', document.baseURI));
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('PDF processing took too long. Try a smaller PDF.'));
    }, 120_000);

    const finish = () => {
      clearTimeout(timeout);
      worker.terminate();
    };
    worker.onmessage = ({ data }: MessageEvent<{ bytes?: Uint8Array<ArrayBuffer> }>) => {
      finish();
      if (data.bytes?.byteLength) resolve(new Blob([data.bytes], { type: 'application/pdf' }));
      else reject(new Error(operation === 'unlock'
        ? 'Could not unlock the PDF. Check the current password and try again.'
        : 'Could not process the PDF. Use a readable, unlocked PDF.'));
    };
    worker.onerror = () => {
      finish();
      reject(new Error('Could not load the PDF engine. Reload the page and try again.'));
    };
    worker.postMessage({ file, operation, password });
  });
}
