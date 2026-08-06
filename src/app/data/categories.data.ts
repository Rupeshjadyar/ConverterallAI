export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: 'violet' | 'cyan' | 'amber' | 'emerald' | 'blue' | 'fuchsia' | 'rose';
  toolCount: number;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'pdf-tools',
    slug: '/pdf-processing',
    name: 'PDF Tools',
    icon: '📄',
    description: '30+ professional PDF utilities: Merge, Split, OCR, Compress, Encrypt, Sign & Convert documents locally.',
    color: 'violet',
    toolCount: 30,
  },
  {
    id: 'image-tools',
    slug: '/image-processing',
    name: 'Image Tools',
    icon: '🖼️',
    description: 'AI-powered image suite: Background Removal, Lossless Compression, Format Shifting (HEIC/WEBP/JPG) & Cropper.',
    color: 'cyan',
    toolCount: 15,
  },
  {
    id: 'audio-tools',
    slug: '/audio-processing/text-to-mp3',
    name: 'Audio Tools',
    icon: '🎙️',
    description: 'Studio-grade AI speech synthesis: Text to Audio MP3 narration with real-time rate, pitch, and voice controls.',
    color: 'amber',
    toolCount: 5,
  },
  {
    id: 'calculators',
    slug: '/calculators',
    name: 'Calculators',
    icon: '🧮',
    description: 'Smart financial & health calculators: Loan EMIs, Mutual Fund SIPs, India GST tax slabs, BMI & Precise Age.',
    color: 'emerald',
    toolCount: 12,
  },
  {
    id: 'converters',
    slug: '/converters',
    name: 'Converters',
    icon: '🔄',
    description: 'Universal unit, currency, measurement, and data converters for engineering & academic workflows.',
    color: 'blue',
    toolCount: 10,
  },
  {
    id: 'developer-tools',
    slug: '/developer-tools',
    name: 'Developer Tools',
    icon: '💻',
    description: 'JSON formatters, Base64 encoders/decoders, Hash generators, Regex testers, and Markdown utilities.',
    color: 'fuchsia',
    toolCount: 14,
  },
  {
    id: 'resume-tools',
    slug: '/resume-builder',
    name: 'Resume Tools',
    icon: '📝',
    description: 'Build stunning professional resumes with 21 free templates, save locally, and export as PDF.',
    color: 'rose',
    toolCount: 1,
  }
];
