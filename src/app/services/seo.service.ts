import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const ROUTE_SEO_MAP: Record<string, SeoData> = {
  '/': {
    title: 'ConverterAllAI – Free Online PDF, Image & Audio Tools | 100% In-Browser',
    description: 'Process PDFs, images, audio and more directly in your browser. No uploads, no servers — 100% private, blazing-fast WebAssembly tools. Merge, split, compress, convert and edit files for free.',
    keywords: 'PDF tools, image converter, audio tools, online converter, free PDF editor, merge PDF, compress PDF, image to PDF, background remover'
  },
  '/home': {
    title: 'ConverterAllAI – Free Online PDF, Image & Audio Tools | 100% In-Browser',
    description: 'Process PDFs, images, audio and more directly in your browser. No uploads, no servers — 100% private, blazing-fast WebAssembly tools. Merge, split, compress, convert and edit files for free.',
    keywords: 'PDF tools, image converter, audio tools, online converter, free PDF editor, merge PDF, compress PDF, image to PDF, background remover'
  },
  '/pdf-processing': {
    title: 'PDF Tools – Merge, Split, Compress, Convert & Edit PDFs Free | ConverterAllAI',
    description: 'All-in-one free PDF toolkit. Merge, split, compress, rotate, watermark, convert PDF to Word/Excel/PPT, add page numbers, sign PDFs and more — directly in your browser.',
    keywords: 'merge PDF, split PDF, compress PDF, PDF to Word, PDF to Excel, rotate PDF, watermark PDF, sign PDF'
  },
  '/pdf-processing/merge-pdf': {
    title: 'Merge PDF Files – Combine Multiple PDFs into One | ConverterAllAI',
    description: 'Combine multiple PDF documents into a single file. Drag and drop, reorder pages, and download instantly — 100% free, no upload required.'
  },
  '/pdf-processing/split-pdf': {
    title: 'Split PDF – Extract Pages from PDF Files | ConverterAllAI',
    description: 'Extract specific pages or split a PDF into multiple documents. Select page ranges and download instantly — free and private.'
  },
  '/pdf-processing/compress-pdf': {
    title: 'Compress PDF – Reduce PDF File Size Online | ConverterAllAI',
    description: 'Shrink PDF file size while maintaining quality. Fast in-browser compression — no uploads, completely private.'
  },
  '/pdf-processing/rotate-pdf': {
    title: 'Rotate PDF Pages – Flip & Turn PDF Pages | ConverterAllAI',
    description: 'Rotate PDF pages 90°, 180° or 270°. Fix page orientation instantly in your browser.'
  },
  '/pdf-processing/add-watermark': {
    title: 'Add Watermark to PDF – Free PDF Watermark Tool | ConverterAllAI',
    description: 'Add custom text watermarks to your PDF documents. Set opacity, position, and rotation — all processed locally.'
  },
  '/pdf-processing/pdf-to-jpg': {
    title: 'PDF to JPG – Convert PDF Pages to Images | ConverterAllAI',
    description: 'Convert each PDF page to high-quality JPG images. Fast browser-based conversion with no file uploads.'
  },
  '/pdf-processing/jpg-to-pdf': {
    title: 'JPG to PDF – Convert Images to PDF | ConverterAllAI',
    description: 'Convert JPG, PNG, and WebP images into a PDF document. Arrange multiple images into one PDF file.'
  },
  '/pdf-processing/pdf-to-text': {
    title: 'PDF to Text – Extract Text from PDF | ConverterAllAI',
    description: 'Extract plain text from PDF files. Copy text directly or download as a TXT file — processed entirely in your browser.'
  },
  '/pdf-processing/text-to-pdf': {
    title: 'Text to PDF – Convert Text to PDF | ConverterAllAI',
    description: 'Convert plain text into a professionally formatted PDF document. Type or paste your text and generate a PDF instantly.'
  },
  '/pdf-processing/add-password': {
    title: 'Protect PDF with Password – Encrypt PDF Files | ConverterAllAI',
    description: 'Add password protection to your PDF documents. Secure your files with encryption — fast and reliable.'
  },
  '/pdf-processing/remove-password': {
    title: 'Remove PDF Password – Unlock PDF Files | ConverterAllAI',
    description: 'Remove password protection from PDF files. Enter the current password to unlock and download an unprotected copy.'
  },
  '/pdf-processing/edit-pdf': {
    title: 'Edit PDF – Add Text & Annotations | ConverterAllAI',
    description: 'Add text annotations to your PDF documents. Simple in-browser PDF editing — free and private.'
  },
  '/pdf-processing/sign-pdf': {
    title: 'Sign PDF – Add Digital Signature to PDF | ConverterAllAI',
    description: 'Draw your signature and add it to any PDF document. Free electronic signature tool — works directly in your browser.'
  },
  '/pdf-processing/add-page-numbers': {
    title: 'Add Page Numbers to PDF – Free PDF Numbering Tool | ConverterAllAI',
    description: 'Add page numbers to your PDF documents. Choose position, starting number, and font size. 100% client-side processing.'
  },
  '/pdf-processing/organize-pdf': {
    title: 'Organize PDF Pages – Reorder & Rearrange | ConverterAllAI',
    description: 'Rearrange PDF pages in any order. Move pages up/down and rebuild your document — processed locally.'
  },
  '/pdf-processing/crop-pdf': {
    title: 'Crop PDF Pages – Trim PDF Margins | ConverterAllAI',
    description: 'Crop and trim margins from PDF pages. Set custom margins for top, bottom, left, and right sides.'
  },
  '/pdf-processing/html-to-pdf': {
    title: 'HTML to PDF – Convert Web Pages to PDF | ConverterAllAI',
    description: 'Convert HTML content or web page URLs into PDF documents. Professional web-to-PDF conversion.'
  },
  '/pdf-processing/pdf-to-word': {
    title: 'PDF to Word – Convert PDF to DOCX | ConverterAllAI',
    description: 'Convert PDF files to editable Word documents (DOCX). Maintain formatting and layout.'
  },
  '/pdf-processing/pdf-to-excel': {
    title: 'PDF to Excel – Convert PDF to XLSX | ConverterAllAI',
    description: 'Extract tables from PDFs and convert to Excel spreadsheets. Fast and accurate conversion.'
  },
  '/pdf-processing/pdf-to-ppt': {
    title: 'PDF to PowerPoint – Convert PDF to PPTX | ConverterAllAI',
    description: 'Convert PDF presentations to editable PowerPoint files. Maintain slides and formatting.'
  },
  '/pdf-processing/word-to-pdf': {
    title: 'Word to PDF – Convert DOCX to PDF | ConverterAllAI',
    description: 'Convert Word documents to PDF format. Professional document conversion with preserved layout.'
  },
  '/pdf-processing/excel-to-pdf': {
    title: 'Excel to PDF – Convert XLSX to PDF | ConverterAllAI',
    description: 'Convert Excel spreadsheets to PDF. Maintain table formatting and data layout.'
  },
  '/pdf-processing/ppt-to-pdf': {
    title: 'PowerPoint to PDF – Convert PPTX to PDF | ConverterAllAI',
    description: 'Convert PowerPoint presentations to PDF. Preserve slides, images, and formatting.'
  },
  '/image-processing': {
    title: 'Image Tools – Compress, Convert, Crop & Edit Images Free | ConverterAllAI',
    description: 'Free online image processing tools. Compress, resize, crop, convert formats, remove backgrounds, and edit photos — all in your browser.',
    keywords: 'image compressor, image converter, background remover, image cropper, photo editor, image to PDF'
  },
  '/audio-processing/text-to-mp3': {
    title: 'Text to Speech – Convert Text to MP3 Audio | ConverterAllAI',
    description: 'Convert text to natural sounding speech. Choose voice, speed, and pitch. Download as MP3 — free text-to-speech tool.',
    keywords: 'text to speech, TTS, text to mp3, speech synthesis, voice generator'
  },
  '/calculators': {
    title: 'Online Calculators – BMI, EMI, GST, SIP, Percentage & More | ConverterAllAI',
    description: 'Free online calculators for BMI, EMI, loan, GST, SIP, percentage, age, CGPA, discount and more. Fast, accurate, and easy to use.',
    keywords: 'BMI calculator, EMI calculator, GST calculator, SIP calculator, percentage calculator, loan calculator'
  },
  '/dashboard': {
    title: 'Live Analytics Matrix & Global Telemetry | ConverterAllAI',
    description: 'Real-time telemetry, visitor geo-distribution, most executed AI converter tools, and in-browser WASM metrics.',
    keywords: 'analytics, telemetry, tool usage, converter stats, live visitors'
  },
  '/analytics': {
    title: 'Live Analytics Matrix & Global Telemetry | ConverterAllAI',
    description: 'Real-time telemetry, visitor geo-distribution, most executed AI converter tools, and in-browser WASM metrics.',
    keywords: 'analytics, telemetry, tool usage, converter stats, live visitors'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);

  init(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEvent = event as NavigationEnd;
        this.updateSeoForRoute(navEvent.urlAfterRedirects || navEvent.url);
      });
  }

  updateSeoForRoute(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const seoData = ROUTE_SEO_MAP[cleanUrl];

    if (seoData) {
      this.updateTags(seoData);
    } else {
      // Fallback
      this.updateTags({
        title: 'ConverterAllAI – Free Online Converter & Processing Tools',
        description: 'All-in-one free online tools for PDFs, images, audio, and calculations. 100% in-browser processing — private, fast, and reliable.'
      });
    }
  }

  updateTags(data: SeoData): void {
    this.titleService.setTitle(data.title);

    this.metaService.updateTag({ name: 'description', content: data.description });

    if (data.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: data.title });
    this.metaService.updateTag({ property: 'og:description', content: data.description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'ConverterAllAI' });

    if (data.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: data.ogImage });
    }

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: data.title });
    this.metaService.updateTag({ name: 'twitter:description', content: data.description });
  }
}
