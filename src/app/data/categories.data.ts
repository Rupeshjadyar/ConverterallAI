export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: 'violet' | 'cyan' | 'amber' | 'emerald' | 'blue' | 'fuchsia' | 'rose' | 'indigo';
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
    id: 'games',
    slug: '/games',
    name: 'Games Hub',
    icon: '🎮',
    description: '12 free trending browser games: Cyber Battlegrounds (PUBG 2D), Chess vs AI, Teen Patti 3-Patti, Sudoku, 2048, Snake & more.',
    color: 'indigo',
    toolCount: 12,
  },
  {
    id: 'audio-tools',
    slug: '/audio-processing',
    name: 'Audio Tools',
    icon: '🎙️',
    description: '12+ studio-grade audio processing & AI speech tools: Audio Cutter, Volume Booster, Speed Changer, Audio Reverser, 5-Band Equalizer, Dynamics Compressor, Video to Audio Extractor, Audio Joiner, Format Converter & TTS Voice Studio.',
    color: 'amber',
    toolCount: 12,
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
    description: 'Developer suite: Interactive SQL Masterclass, Type Master, and JSON Formatter.',
    color: 'fuchsia',
    toolCount: 3,
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
