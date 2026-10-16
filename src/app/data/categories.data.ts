export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: 'violet' | 'cyan' | 'amber' | 'emerald' | 'blue' | 'fuchsia' | 'rose' | 'indigo';
  toolCount: number;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'pdf-tools',
    slug: '/pdf-processing',
    name: 'PDF Tools',
    icon: '📄',
    description: '30+ professional PDF utilities: Merge, Split, OCR, Compress, Encrypt, Sign & Convert documents locally.',
    color: 'violet',
    toolCount: 32,
    seoTitle: 'Free Online PDF Tools - Edit, Merge & Sign | ConverterAllAI',
    seoDescription: 'Work with PDF files easily using our free online suite. Merge, split, compress, sign, and convert documents directly in your browser with complete privacy.',
    h1: 'All-in-One Online PDF Tools Suite',
    intro: 'Manage, edit, and convert your PDF documents in seconds without installing extra software. From merging and compressing to digital signing and OCR, all tasks run smoothly in your web browser.'
  },
  {
    id: 'image-tools',
    slug: '/image-processing',
    name: 'Image Tools',
    icon: '🖼️',
    description: 'AI-powered image suite: Background Removal, Lossless Compression, Format Shifting (HEIC/WEBP/JPG) & Cropper.',
    color: 'cyan',
    toolCount: 7,
    seoTitle: 'Online Image Tools - Edit, Convert & Crop | ConverterAllAI',
    seoDescription: 'Fast and free online image tools to crop, compress, convert formats, and remove backgrounds with AI. Optimize your photos and graphics with zero quality loss.',
    h1: 'Online Image Processing & AI Graphics Tools',
    intro: 'Transform, compress, and edit photos directly from your browser. Whether you need transparent backgrounds, lossless image compression, or format conversion, our suite delivers instant results.'
  },
  {
    id: 'games',
    slug: '/games',
    name: 'Games Hub',
    icon: '🎮',
    description: '14 free browser games: Chess vs AI, Teen Patti, Ludo, Teen Do Paanch, Sudoku, Snake, Brick Breaker & more.',
    color: 'indigo',
    toolCount: 14,
    seoTitle: 'Play Online Games Free - Arcade & Cards | ConverterAllAI',
    seoDescription: 'Play free online browser games with no downloads or installation. Enjoy chess against AI, Ludo, Teen Patti, 3-2-5, Sudoku, classic Snake, and arcade battles.',
    h1: 'Free Online Web Games & Brain Puzzles',
    intro: 'Take a break and enjoy a rich collection of browser games right on your screen. Challenge smart AI opponents in chess, roll the dice in classic Ludo, or test your reflexes in retro arcade adventures.'
  },
  {
    id: 'audio-tools',
    slug: '/audio-processing',
    name: 'Audio Tools',
    icon: '🎙️',
    description: '12+ studio-grade audio processing & speech tools: Audio Cutter, Volume Booster, Speed Changer, Equalizer & TTS.',
    color: 'amber',
    toolCount: 12,
    seoTitle: 'Online Audio Tools - Cut, Boost & Convert | ConverterAllAI',
    seoDescription: 'Edit and transform audio tracks online for free. Trim songs, boost volume, adjust speed, extract audio from video, and convert audio formats without software.',
    h1: 'Studio-Grade Online Audio Tools & Editors',
    intro: 'Produce and manipulate audio files directly in your web browser. Cut ringtones, enhance quiet audio recordings, apply equalizer curves, and convert between MP3, WAV, and AAC effortlessly.'
  },
  {
    id: 'calculators',
    slug: '/calculators',
    name: 'Calculators',
    icon: '🧮',
    description: 'Smart financial & health calculators: Loan EMIs, Mutual Fund SIPs, India GST tax slabs, BMI & Precise Age.',
    color: 'emerald',
    toolCount: 11,
    seoTitle: 'Online Calculators - Financial & Health | ConverterAllAI',
    seoDescription: 'Calculate loan EMI, mutual fund SIP returns, GST tax, BMI, age, and academic CGPA online for free. Fast, accurate calculations with visual schedules and charts.',
    h1: 'Free Financial, Academic & Health Calculators',
    intro: 'Plan your personal finances, verify statutory taxes, and monitor health metrics with our responsive calculation tools. Instant calculations backed by official formulas and clear breakdowns.'
  },
  {
    id: 'developer-tools',
    slug: '/developer-tools',
    name: 'Developer Tools',
    icon: '💻',
    description: 'Developer suite: Interactive SQL Masterclass, Type Master, and JSON Formatter.',
    color: 'fuchsia',
    toolCount: 2,
    seoTitle: 'Free Dev Tools - JSON Formatter & SQL | ConverterAllAI',
    seoDescription: 'Essential online utilities for software engineers and students. Format JSON, practice SQL queries interactively, test syntax, and train keyboard typing speed.',
    h1: 'Interactive Developer Utilities & SQL Studio',
    intro: 'Speed up your engineering workflow with lightweight web utilities. Validate and beautify complex JSON payloads, practice relational database queries with our in-browser engine, and sharpen typing.'
  },
  {
    id: 'resume-tools',
    slug: '/resume-builder',
    name: 'Resume Tools',
    icon: '📝',
    description: 'Build stunning professional resumes with free templates, save locally, and export as PDF.',
    color: 'rose',
    toolCount: 1,
    seoTitle: 'Free Online Resume Builder - ATS CV Maker | ConverterAllAI',
    seoDescription: 'Create an ATS-friendly professional resume online for free. Choose modern templates, enter work experience, preview in real time, and download as clean PDF.',
    h1: 'Professional Free Online Resume Builder',
    intro: 'Craft clean, job-ready resumes and curriculum vitae tailored for applicant tracking systems. Select proven templates, customize your profile, and export print-ready PDFs in minutes.'
  },
  {
    id: 'converters',
    slug: '/image-processing/format-converter',
    name: 'Converters',
    icon: '🔄',
    description: 'Universal unit, currency, measurement, and file converters for everyday digital workflows.',
    color: 'blue',
    toolCount: 10,
    seoTitle: 'Free Online Converters - File & Unit Tools | ConverterAllAI',
    seoDescription: 'Convert documents, units, media formats, and data values instantly online. Free browser-based converters designed for high accuracy and everyday productivity.',
    h1: 'Universal Online Converters & Transformation Suite',
    intro: 'Quickly convert between common digital formats and measurement units. Designed for speed, convenience, and accurate results across desktop and mobile devices.'
  }
];
