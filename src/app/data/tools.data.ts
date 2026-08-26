export interface ToolItem {
  id: string;
  name: string;
  slug: string; // Route path
  categoryId: 'pdf-tools' | 'image-tools' | 'audio-tools' | 'calculators' | 'converters' | 'developer-tools' | 'resume-tools';
  shortDesc: string;
  fullDesc: string;
  icon: string;
  badge?: 'NEW' | 'PRO' | 'AI' | 'FREE' | 'POPULAR';
  isPopular?: boolean;
  isLatest?: boolean;
  isAI?: boolean;
}

export const TOOLS_DATA: ToolItem[] = [
  // ==================== AUDIO TOOLS ====================
  {
    id: 'text-to-mp3',
    name: 'Text to Audio MP3 Studio',
    slug: '/audio-processing/text-to-mp3',
    categoryId: 'audio-tools',
    shortDesc: 'Convert scripts and text to natural human voice narration with adjustable rate & pitch.',
    fullDesc: 'Client-side studio speech narration engine with real-time audio playback, multi-language voice detection, and instant script/audio export.',
    icon: '🎙️',
    badge: 'NEW',
    isPopular: true,
    isLatest: true,
    isAI: true
  },
  {
    id: 'resume-builder',
    name: 'Professional Resume Builder',
    slug: '/resume-builder',
    categoryId: 'resume-tools',
    shortDesc: 'Build stunning resumes with 21 free templates. Edit, save locally, and export as PDF.',
    fullDesc: 'Full-featured resume builder with 21 professional templates, structured form editor, live preview, localStorage auto-save, and one-click PDF export.',
    icon: '📝',
    badge: 'NEW',
    isPopular: true,
    isLatest: true
  },

  // ==================== PDF TOOLS ====================
  {
    id: 'merge-pdf',
    name: 'Merge PDF Documents',
    slug: '/pdf-processing/merge-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Combine multiple PDF documents into a single ordered file seamlessly.',
    fullDesc: 'High-speed browser-based PDF merger. Drag, reorder, and merge files instantly in client memory.',
    icon: '🔗',
    badge: 'POPULAR',
    isPopular: true
  },
  {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    slug: '/pdf-processing/split-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Extract individual pages or page ranges into separate PDF files.',
    fullDesc: 'Split large PDF documents into smaller chapters or individual pages without server uploads.',
    icon: '✂️',
    isPopular: true
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF Size',
    slug: '/pdf-processing/compress-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Reduce PDF file weight significantly while maintaining sharp text quality.',
    fullDesc: 'Optimize PDF file size for email attachment and fast web delivery locally in your browser.',
    icon: '🗜️',
    badge: 'FREE',
    isPopular: true
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    slug: '/pdf-processing/pdf-to-word',
    categoryId: 'pdf-tools',
    shortDesc: 'Convert PDF files into editable Word (.docx) documents with structure preserved.',
    fullDesc: 'AI-assisted PDF to DOCX document structure reconstruction engine.',
    icon: '📄',
    badge: 'AI',
    isPopular: true,
    isAI: true
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF Scanner',
    slug: '/pdf-processing/ocr-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Extract searchable, selectable text from scanned image PDFs.',
    fullDesc: 'Optical Character Recognition engine runs inside web workers for high accuracy.',
    icon: '🔍',
    badge: 'AI',
    isLatest: true,
    isAI: true
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF Converter',
    slug: '/pdf-processing/word-to-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Convert DOC and DOCX files into universal PDF format.',
    fullDesc: 'Fast, clean Word document to PDF format conversion.',
    icon: '📝'
  },
  {
    id: 'add-password',
    name: 'Password Protect PDF',
    slug: '/pdf-processing/add-password',
    categoryId: 'pdf-tools',
    shortDesc: 'Encrypt confidential PDFs with strong AES security passwords.',
    fullDesc: 'Add user and owner passwords to protect sensitive financial or legal documents.',
    icon: '🔒'
  },
  {
    id: 'remove-password',
    name: 'Unlock PDF',
    slug: '/pdf-processing/remove-password',
    categoryId: 'pdf-tools',
    shortDesc: 'Remove password protection from your PDF files.',
    fullDesc: 'Remove PDF passwords and restrictions instantly.',
    icon: '🔓'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF Pages',
    slug: '/pdf-processing/rotate-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Rotate PDF pages to left, right, or upside down.',
    fullDesc: 'Fix upside down scans and rotate specific pages easily.',
    icon: '🔃'
  },
  {
    id: 'sign-pdf',
    name: 'eSign PDF',
    slug: '/pdf-processing/sign-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Sign PDF documents electronically with ease.',
    fullDesc: 'Draw, type, or upload your signature to digitally sign documents.',
    icon: '🖋️'
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    slug: '/pdf-processing/add-watermark',
    categoryId: 'pdf-tools',
    shortDesc: 'Stamp an image or text over your PDF.',
    fullDesc: 'Add copyright text or logo watermarks to your PDF pages.',
    icon: '©️'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: '/pdf-processing/pdf-to-jpg',
    categoryId: 'pdf-tools',
    shortDesc: 'Extract pages from PDF to high-quality JPG images.',
    fullDesc: 'Convert every page of your PDF to a JPG file.',
    icon: '🖼️'
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    slug: '/pdf-processing/html-to-pdf',
    categoryId: 'pdf-tools',
    shortDesc: 'Convert HTML pages or URLs to PDF documents.',
    fullDesc: 'Capture websites or HTML files as static PDF pages.',
    icon: '🌐'
  },

  // ==================== IMAGE TOOLS ====================
  {
    id: 'bg-remover',
    name: 'AI Background Remover',
    slug: '/image-processing/bg-remover',
    categoryId: 'image-tools',
    shortDesc: 'Remove photo backgrounds automatically with AI in 1 second.',
    fullDesc: 'Client-side WebAssembly neural model removes complex portrait & product backgrounds accurately.',
    icon: '🪄',
    badge: 'PRO',
    isPopular: true,
    isAI: true
  },
  {
    id: 'image-compressor',
    slug: '/image-processing/compressor',
    name: 'Smart Image Compressor',
    categoryId: 'image-tools',
    shortDesc: 'Compress JPG, PNG & WEBP images losslessly without visible blur.',
    fullDesc: 'Advanced quantization algorithm compresses photo file sizes by up to 85%.',
    icon: '🗜️',
    badge: 'POPULAR',
    isPopular: true
  },
  {
    id: 'format-converter',
    name: 'HEIC / PNG / JPG Converter',
    slug: '/image-processing/format-converter',
    categoryId: 'image-tools',
    shortDesc: 'Convert iPhone HEIC and transparent PNG images to universal JPG.',
    fullDesc: 'Batch convert image formats instantly in your browser canvas.',
    icon: '🔄',
    isLatest: true
  },
  {
    id: 'image-cropper',
    name: 'Professional Image Cropper',
    slug: '/image-processing/cropper',
    categoryId: 'image-tools',
    shortDesc: 'Crop, scale, and rotate images to standard aspect ratios.',
    fullDesc: 'Precision photo cropper for social media banners, avatars, and e-commerce listings.',
    icon: '📐'
  },
  {
    id: 'image-editor',
    name: 'Advanced Image Editor',
    slug: '/image-processing/image-editor',
    categoryId: 'image-tools',
    shortDesc: 'Apply filters, adjust brightness, contrast, and add text to your images.',
    fullDesc: 'Client-side image editing studio with layer support and non-destructive filters.',
    icon: '🎨'
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF Maker',
    slug: '/image-processing/image-to-pdf',
    categoryId: 'image-tools',
    shortDesc: 'Convert JPG, PNG, and WEBP images into a single PDF document.',
    fullDesc: 'Quickly batch images and convert them into a standard PDF file for easy sharing.',
    icon: '📸'
  },
  {
    id: 'jpeg-to-png',
    name: 'JPEG to PNG Converter',
    slug: '/image-processing/jpeg-to-png',
    categoryId: 'image-tools',
    shortDesc: 'Convert JPEG images to high-quality PNG format.',
    fullDesc: 'Convert JPEG photos to lossless PNG format maintaining quality.',
    icon: '🖼️'
  },
  {
    id: 'meme-generator',
    name: 'Meme Generator',
    slug: '/image-processing/meme-generator',
    categoryId: 'image-tools',
    shortDesc: 'Create funny memes with custom text and templates.',
    fullDesc: 'Easy to use meme generator with popular templates and custom text tools.',
    icon: '😂'
  },
  {
    id: 'image-resizer',
    name: 'Bulk Image Resizer',
    slug: '/image-processing/resizer',
    categoryId: 'image-tools',
    shortDesc: 'Resize multiple images at once to exact dimensions.',
    fullDesc: 'Resize photos for web, social media, and printing instantly.',
    icon: '📏'
  },
  {
    id: 'watermark-image',
    name: 'Add Watermark to Image',
    slug: '/image-processing/watermark',
    categoryId: 'image-tools',
    shortDesc: 'Protect your images by adding a text or logo watermark.',
    fullDesc: 'Batch watermark your photos to protect your copyright.',
    icon: '©️'
  },

  // ==================== CALCULATORS ====================
  {
    id: 'emi-calc',
    name: 'Loan EMI Calculator',
    slug: '/calculators/emi',
    categoryId: 'calculators',
    shortDesc: 'Calculate home, car, and personal loan monthly installments & interest.',
    fullDesc: 'Complete amortization schedule and principal vs. interest breakdown charts.',
    icon: '💰',
    isPopular: true
  },
  {
    id: 'sip-calc',
    name: 'SIP Mutual Fund Calculator',
    slug: '/calculators/sip',
    categoryId: 'calculators',
    shortDesc: 'Project wealth accumulation and compound interest from SIPs.',
    fullDesc: 'Accurate financial compounding projections with expected returns.',
    icon: '📈',
    isPopular: true
  },
  {
    id: 'gst-calc',
    name: 'India GST Calculator',
    slug: '/calculators/gst',
    categoryId: 'calculators',
    shortDesc: 'Compute inclusive and exclusive GST tax amounts instantly.',
    fullDesc: 'Supports 5%, 12%, 18%, and 28% tax slabs for Indian businesses & invoices.',
    icon: '🧾'
  },
  {
    id: 'bmi-calc',
    name: 'BMI Health Tracker',
    slug: '/calculators/bmi',
    categoryId: 'calculators',
    shortDesc: 'Calculate Body Mass Index and healthy weight ranges.',
    fullDesc: 'Personalized health classification based on WHO BMI standards.',
    icon: '⚖️'
  },
  {
    id: 'age-calc',
    name: 'Precise Age Calculator',
    slug: '/calculators/age',
    categoryId: 'calculators',
    shortDesc: 'Compute exact age down to years, months, days, and hours.',
    fullDesc: 'Exact age interval calculation between birthdate and any future date.',
    icon: '🎂'
  }
];
