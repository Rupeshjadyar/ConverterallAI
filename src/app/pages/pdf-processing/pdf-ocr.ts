import { openPdf, renderPdfPage } from './pdf-browser';

export async function makeSearchablePdf(file: File, progress: (label: string) => void): Promise<Blob> {
  const { pdf: source, close } = await openPdf(file);
  const canvas = document.createElement('canvas');
  let worker: Awaited<ReturnType<typeof import('tesseract.js')['createWorker']>> | undefined;
  try {
    if (source.numPages > 25) throw new Error('Choose a PDF with up to 25 pages for OCR.');
    progress('Loading the English text recognition model…');
    const [tesseract, { PDFDocument }] = await Promise.all([
      import('tesseract.js'),
      import('pdf-lib'),
    ]);
    const assets = new URL('assets/ocr/', document.baseURI);
    const createWorker = (tesseract.default ?? tesseract).createWorker;
    worker = await createWorker('eng', 1, {
      workerPath: new URL('worker.min.js', assets).href,
      corePath: assets.href,
      langPath: assets.href,
      workerBlobURL: false,
    });
    const output = await PDFDocument.create();
    let recognizedText = false;

    for (let number = 1; number <= source.numPages; number++) {
      progress(`Recognizing page ${number} of ${source.numPages}…`);
      const page = await source.getPage(number);
      try {
        const { width } = await renderPdfPage(page, canvas, 2.5);
        const dpi = Math.round(canvas.width / width * 72);
        await worker.setParameters({ user_defined_dpi: String(dpi) });
        const { data } = await worker.recognize(canvas, {}, { text: true, pdf: true });
        if (!data.pdf?.length) throw new Error('Could not write the OCR page.');
        if (data.text.trim()) recognizedText = true;
        const recognized = await PDFDocument.load(Uint8Array.from(data.pdf));
        const [recognizedPage] = await output.copyPages(recognized, [0]);
        output.addPage(recognizedPage);
      } finally {
        page.cleanup();
      }
    }
    if (!recognizedText) throw new Error('No English text could be recognized. Try a clearer scan.');
    progress('Saving your searchable PDF…');
    return new Blob([Uint8Array.from(await output.save())], { type: 'application/pdf' });
  } finally {
    canvas.width = canvas.height = 0;
    await Promise.allSettled([worker?.terminate(), close()]);
  }
}
