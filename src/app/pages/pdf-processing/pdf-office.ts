import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { openPdf, renderPdfPage } from './pdf-browser';

type OfficeFormat = 'docx' | 'xlsx' | 'pptx';

export async function exportPdfToOffice(
  file: File,
  format: OfficeFormat,
  progress: (label: string) => void,
): Promise<Blob> {
  const { pdf, close } = await openPdf(file);
  try {
    if (pdf.numPages > 75) throw new Error('Choose a PDF with up to 75 pages.');
    if (format === 'pptx') return await writeSlides(pdf, progress);

    const pages: string[][][] = [];
    for (let number = 1; number <= pdf.numPages; number++) {
      progress(`Reading page ${number} of ${pdf.numPages}…`);
      const page = await pdf.getPage(number);
      try {
        pages.push(await textRows(page));
      } finally {
        page.cleanup();
      }
    }
    if (pages.every(page => page.length === 0)) {
      throw new Error('This PDF has no selectable text. Run OCR on scanned pages and try again.');
    }
    progress('Building the download…');

    if (format === 'xlsx') {
      const { default: writeXlsx } = await import('write-excel-file/browser');
      return await writeXlsx(pages.map((rows, index) => ({
        sheet: `Page ${index + 1}`,
        data: rows.map(row => row.map(value => ({ value, type: String }))),
      }))).toBlob();
    }

    const { Document, Packer, Paragraph } = await import('docx');
    return await Packer.toBlob(new Document({
      sections: pages.map(rows => ({ children: rows.map(cells => new Paragraph(cells.join(' '))) })),
    }));
  } finally {
    await close();
  }
}

async function textRows(page: PDFPageProxy): Promise<string[][]> {
  const content = await page.getTextContent();
  const items = content.items.flatMap(item => {
    if (!('str' in item) || !item.str.trim()) return [];
    return [{
      text: item.str.trim(),
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
      height: item.height,
    }];
  }).sort((a, b) => b.y - a.y || a.x - b.x);

  const rows: (typeof items)[] = [];
  for (const item of items) {
    const row = rows.at(-1);
    if (row && Math.abs(row[0].y - item.y) <= Math.max(2, Math.min(row[0].height, item.height) * 0.35)) {
      row.push(item);
    } else {
      rows.push([item]);
    }
  }

  return rows.map(row => {
    const cells: string[] = [];
    let right = -Infinity;
    for (const item of row.sort((a, b) => a.x - b.x)) {
      if (item.x - right > Math.max(5, item.height * 0.8)) cells.push(item.text);
      else cells[cells.length - 1] += ' ' + item.text;
      right = Math.max(right, item.x + item.width);
    }
    return cells;
  });
}

async function writeSlides(pdf: PDFDocumentProxy, progress: (label: string) => void): Promise<Blob> {
  const { default: PowerPoint } = await import('pptxgenjs');
  const deck = new PowerPoint();
  const slideWidth = 13.333;
  const slideHeight = 7.5;
  deck.defineLayout({ name: 'PDF slides', width: slideWidth, height: slideHeight });
  deck.layout = 'PDF slides';
  const canvas = document.createElement('canvas');
  try {
    for (let number = 1; number <= pdf.numPages; number++) {
      progress(`Rendering slide ${number} of ${pdf.numPages}…`);
      const page = await pdf.getPage(number);
      try {
        const { width, height } = await renderPdfPage(page, canvas, 1.75);
        const scale = Math.min(slideWidth / width, slideHeight / height);
        const w = width * scale;
        const h = height * scale;
        deck.addSlide().addImage({
          data: canvas.toDataURL('image/jpeg', 0.94),
          x: (slideWidth - w) / 2,
          y: (slideHeight - h) / 2,
          w,
          h,
        });
      } finally {
        page.cleanup();
      }
    }
    progress('Building the download…');
    const output = await deck.write({ outputType: 'blob' });
    if (!(output instanceof Blob)) throw new Error('Could not create the PPTX file.');
    return output;
  } finally {
    canvas.width = canvas.height = 0;
  }
}
