import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-text-to-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './text-to-pdf.component.html',
  styleUrls: ['./text-to-pdf.component.css']
})
export class TextToPdfComponent implements OnInit {
  selectedFiles: File[] = [];
  isDragging = false;
  isConverting = false;
  progress = 0;
  convertedUrl: string | null = null;
  convertedBlob: Blob | null = null;

  // Editor Options & Content
  textInput = '';
  docTitle = '';
  fontFamily = 'Helvetica'; // 'Helvetica', 'TimesRoman', 'Courier'
  fontSize = 12;
  alignment: 'left' | 'center' | 'right' = 'left';
  margin = 54; // 0.75 inch in points
  lineSpacing = 1.5;
  textColor = '#0f172a';
  orientation: 'portrait' | 'landscape' = 'portrait';
  addPageNumbers = true;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle('Text to PDF – MS Word Style Document Studio | ConverterAllAI');
    this.meta.updateTag({
      name: 'description',
      content: 'Create, format, and convert plain text into professional PDF documents with MS Word style editing controls.'
    });
  }

  hasSettings() { return true; }

  resetState(clearFiles = true) {
    this.convertedUrl = null;
    this.convertedBlob = null;
    this.progress = 0;
    this.isConverting = false;
    if (clearFiles) {
      this.textInput = '';
      this.docTitle = '';
      this.selectedFiles = [];
    }
  }

  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  onDragLeave(e: DragEvent) { e.preventDefault(); this.isDragging = false; }
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files.length) this.loadTextFile(e.dataTransfer.files[0]);
  }
  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) this.loadTextFile(input.files[0]);
  }

  async loadTextFile(file: File) {
    this.selectedFiles = [file];
    this.textInput = await file.text();
    if (!this.docTitle) {
      this.docTitle = file.name.replace(/\.[^/.]+$/, '');
    }
  }

  removeFile(i: number) {
    this.selectedFiles = [];
    this.textInput = '';
  }

  get wordCount(): number {
    if (!this.textInput.trim()) return 0;
    return this.textInput.trim().split(/\s+/).length;
  }

  get charCount(): number {
    return this.textInput.length;
  }

  async processFiles() {
    if (!this.textInput.trim()) {
      alert('Please enter or paste some text first.');
      return;
    }
    this.isConverting = true;
    this.progress = 0;

    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      this.progress = 15;
      const pdf = await PDFDocument.create();

      // Embed Font
      let fontType = StandardFonts.Helvetica;
      let fontBoldType = StandardFonts.HelveticaBold;
      if (this.fontFamily === 'TimesRoman') {
        fontType = StandardFonts.TimesRoman;
        fontBoldType = StandardFonts.TimesRomanBold;
      } else if (this.fontFamily === 'Courier') {
        fontType = StandardFonts.Courier;
        fontBoldType = StandardFonts.CourierBold;
      }

      const font = await pdf.embedFont(fontType);
      const fontBold = await pdf.embedFont(fontBoldType);
      this.progress = 30;

      // Page dimensions
      const isLandscape = this.orientation === 'landscape';
      const pageWidth = isLandscape ? 841.89 : 595.28;
      const pageHeight = isLandscape ? 595.28 : 841.89;
      const margin = Number(this.margin);
      const maxWidth = pageWidth - margin * 2;
      const fontSz = Number(this.fontSize);
      const lineH = fontSz * Number(this.lineSpacing);

      // Parse text color
      const colorRgb = this.hexToRgb(this.textColor, rgb);

      this.progress = 50;

      // Word wrapping lines
      const lines: { text: string; isTitle?: boolean }[] = [];

      // If document title is set
      if (this.docTitle.trim()) {
        lines.push({ text: this.docTitle.trim(), isTitle: true });
        lines.push({ text: '' }); // empty line spacing after title
      }

      const rawLines = this.textInput.split('\n');
      for (const rawLine of rawLines) {
        if (!rawLine.trim()) {
          lines.push({ text: '' });
          continue;
        }
        const words = rawLine.split(' ');
        let current = '';
        for (const word of words) {
          const test = current ? current + ' ' + word : word;
          const w = font.widthOfTextAtSize(test, fontSz);
          if (w > maxWidth && current) {
            lines.push({ text: current });
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push({ text: current });
      }

      this.progress = 70;

      // Paginate and draw lines
      let currentPage = pdf.addPage([pageWidth, pageHeight]);
      let currentY = pageHeight - margin;

      for (let i = 0; i < lines.length; i++) {
        const item = lines[i];
        const currentFont = item.isTitle ? fontBold : font;
        const currentSize = item.isTitle ? fontSz * 1.6 : fontSz;
        const currentLineH = item.isTitle ? currentSize * 1.4 : lineH;

        // Check if page overflow
        if (currentY - currentLineH < margin) {
          currentPage = pdf.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }

        if (item.text) {
          const textWidth = currentFont.widthOfTextAtSize(item.text, currentSize);
          let x = margin;
          if (this.alignment === 'center') {
            x = margin + (maxWidth - textWidth) / 2;
          } else if (this.alignment === 'right') {
            x = pageWidth - margin - textWidth;
          }

          currentPage.drawText(item.text, {
            x,
            y: currentY - currentSize,
            size: currentSize,
            font: currentFont,
            color: item.isTitle ? rgb(0.06, 0.09, 0.16) : colorRgb
          });
        }

        currentY -= currentLineH;
      }

      // Add Page Numbers footer if enabled
      if (this.addPageNumbers) {
        const pageCount = pdf.getPageCount();
        const pages = pdf.getPages();
        const footerFont = await pdf.embedFont(StandardFonts.Helvetica);
        for (let idx = 0; idx < pageCount; idx++) {
          const p = pages[idx];
          const footerText = `Page ${idx + 1} of ${pageCount}`;
          const fw = footerFont.widthOfTextAtSize(footerText, 9);
          p.drawText(footerText, {
            x: (p.getWidth() - fw) / 2,
            y: 22,
            size: 9,
            font: footerFont,
            color: rgb(0.4, 0.45, 0.55)
          });
        }
      }

      this.progress = 90;
      const pdfBytes = await pdf.save();
      this.convertedBlob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      this.convertedUrl = URL.createObjectURL(this.convertedBlob);
      this.progress = 100;
    } catch (err) {
      console.error('Text to PDF failed:', err);
      alert('Failed to generate PDF from text.');
    }
    this.isConverting = false;
  }

  private hexToRgb(hex: string, rgbFn: any) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
    return rgbFn(r, g, b);
  }

  download() {
    if (!this.convertedBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(this.convertedBlob);
    a.download = (this.docTitle.trim() || 'text-document').replace(/[^a-z0-9_-]/gi, '_') + '.pdf';
    a.click();
  }
}
