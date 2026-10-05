export interface ToolItem {
  id: string;
  name: string;
  slug: string; // Route path
  categoryId: 'games' | 'pdf-tools' | 'image-tools' | 'audio-tools' | 'calculators' | 'converters' | 'developer-tools' | 'resume-tools';
  shortDesc: string;
  fullDesc: string;
  icon: string;
  badge?: 'NEW' | 'PRO' | 'AI' | 'FREE' | 'POPULAR' | '3D FPS' | 'HOT' | 'ALL-IN-1';
  isPopular?: boolean;
  isLatest?: boolean;
  isAI?: boolean;
}

export const TOOLS_DATA: ToolItem[] = [
  {
    id: 'teen-do-paanch',
    name: '3-2-5 Patte Wala',
    slug: '/games/teen-do-paanch',
    categoryId: 'games',
    shortDesc: 'Play the classic Indian trick-taking card game 3-2-5 with AI bots.',
    fullDesc: 'Classic Teen Do Paanch (3-2-5) card game played with 30 cards.',
    icon: 'dYZ',
    badge: 'NEW',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'snakes-ladders',
    name: 'Saanp Seedi (Snakes & Ladders)',
    slug: '/games/snakes-ladders',
    categoryId: 'games',
    shortDesc: 'Classic Indian board game of Snakes and Ladders. Roll the dice and climb to 100!',
    fullDesc: 'Play Saanp Seedi (Snakes and Ladders) against the computer or a friend.',
    icon: 'dY+',
    badge: 'NEW',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'ludo',
    name: 'Ludo King Game',
    slug: '/games/ludo',
    categoryId: 'games',
    shortDesc: 'Classic Ludo board game for 2 to 4 players. Roll the dice and race your tokens home.',
    fullDesc: 'Play the beloved Ludo game with your friends or against AI bots.',
    icon: 'dY*',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'spelling-bee',
    name: 'Spelling Master (Word Game)',
    slug: '/games/spelling-bee',
    categoryId: 'games',
    shortDesc: 'Test your vocabulary and spelling skills by guessing the hidden words.',
    fullDesc: 'A fun spelling and vocabulary game where you guess words.',
    icon: 'dYT',
    badge: 'NEW',
    isPopular: true,
    isLatest: true
  },
  // ==================== GAMES ====================
  {
    id: 'frontline-survivor',
    name: 'Battleground (3D FPS)',
    slug: '/games/frontline-survivor',
    categoryId: 'games',
    shortDesc: 'First-person 3D survival shooter! Pointer-lock mouse aim, WASD movement, sprint, jump & raycast laser shooting.',
    fullDesc: 'First-person 3D survival arena shooter powered by Three.js. Features true FPS mouse-look controls, camera-relative WASD movement, sprinting, jumping, and precision raycast shooting against advancing 3D sentry bot waves.',
    icon: '🪖',
    badge: '3D FPS',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'warfare-3000',
    name: 'Warfare 3000 (Tank Arena)',
    slug: '/games/warfare-3000',
    categoryId: 'games',
    shortDesc: 'Real-time 2D multiplayer tank arena shooter! 1600x1000 arena, twin-stick mobile controls & live leaderboard.',
    fullDesc: 'Free-for-all real-time multiplayer 2D tank shooter. Join the live shared arena, battle players, climb top-5 leaderboard with smooth 60fps canvas controls.',
    icon: '⚔️',
    badge: 'NEW',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'chess',
    name: 'Chess vs AI',
    slug: '/games/chess',
    categoryId: 'games',
    shortDesc: 'Challenge a Minimax AI at chess or play 2-player. Full legal moves, check indicators & history.',
    fullDesc: 'Full-featured browser chess engine with Minimax AI. Supports all legal moves, castling, en passant, check/checkmate, and move history.',
    icon: '♟️',
    badge: 'POPULAR',
    isPopular: true,
    isAI: true
  },
  {
    id: 'teen-patti',
    name: 'Teen Patti Royale (3-Patti)',
    slug: '/games/teen-patti',
    categoryId: 'games',
    shortDesc: 'Authentic Indian 3-card poker with AI bots. Place Blind & Chaal bets, build your chip empire.',
    fullDesc: 'Experience classic Teen Patti (3-Patti) card game with AI opponents. Virtual chips, blind/chaal betting, and side show options.',
    icon: '🃏',
    badge: 'POPULAR',
    isPopular: true,
    isAI: true
  },
  {
    id: 'snake',
    name: 'Snake Classic',
    slug: '/games/snake',
    categoryId: 'games',
    shortDesc: 'Classic snake game — eat food, grow longer, avoid walls. Touch D-pad for mobile!',
    fullDesc: 'The timeless Snake arcade game with smooth controls, touch D-pad support, and a high score tracker stored locally.',
    icon: '🐍',
    badge: 'FREE',
    isPopular: true
  },
  {
    id: 'sudoku',
    name: 'Sudoku Puzzle',
    slug: '/games/sudoku',
    categoryId: 'games',
    shortDesc: 'Classic 9x9 Sudoku with Easy, Medium, Hard levels. Auto-validation and hints included.',
    fullDesc: 'Solve classic 9x9 Sudoku puzzles with three difficulty levels. Includes auto-validation, pencil marks, undo, and hints.',
    icon: '🔢',
    badge: 'FREE',
    isPopular: true
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    slug: '/games/memory-match',
    categoryId: 'games',
    shortDesc: 'Flip cards to find matching pairs. Train your short-term memory and beat your best time.',
    fullDesc: 'Classic card memory matching game with multiple grid sizes. Find all pairs as fast as possible.',
    icon: '🧠',
    badge: 'FREE'
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe vs AI',
    slug: '/games/tic-tac-toe',
    categoryId: 'games',
    shortDesc: 'Play Tic Tac Toe against a smart AI or a second player. Unbeatable Minimax engine!',
    fullDesc: 'Classic Tic Tac Toe with an unbeatable Minimax AI. Play solo or 2-player pass & play.',
    icon: '❌',
    badge: 'FREE',
    isAI: true
  },
  {
    id: 'brick-breaker',
    name: 'Brick Breaker',
    slug: '/games/brick-breaker',
    categoryId: 'games',
    shortDesc: 'Classic arcade brick breaking game — destroy all bricks with the ball and paddle.',
    fullDesc: 'Retro-style Brick Breaker arcade game. Break all bricks with bounce physics, power-ups, and increasing difficulty.',
    icon: '🧱',
    badge: 'FREE'
  },
  {
    id: 'pong',
    name: 'Pong Classic',
    slug: '/games/pong',
    categoryId: 'games',
    shortDesc: 'The original arcade classic — play Pong against AI or a second player.',
    fullDesc: 'Retro Pong game with smooth ball physics, AI paddle, and 2-player mode.',
    icon: '🏓',
    badge: 'FREE'
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

  // ==================== AUDIO TOOLS ====================
  {
    id: 'text-to-mp3',
    name: 'AI Text to Speech Studio',
    slug: '/audio-processing/text-to-mp3',
    categoryId: 'audio-tools',
    shortDesc: 'Convert text to natural human speech in 100+ languages with voice cloning.',
    fullDesc: 'Multi-lingual studio quality text-to-speech with dialogue mode, pitch controls, and instant MP3 download.',
    icon: '🎙️',
    badge: 'AI',
    isPopular: true,
    isAI: true
  },
  {
    id: 'voice-cloning',
    name: 'AI Voice Cloning Studio',
    slug: '/audio-processing/voice-cloning',
    categoryId: 'audio-tools',
    shortDesc: 'Clone any voice from a 5-second sample & generate custom speech.',
    fullDesc: 'Advanced spectral feature extraction for pitch F0, formants, and voice profile synthesis.',
    icon: '🧬',
    badge: 'NEW',
    isPopular: true,
    isLatest: true,
    isAI: true
  },
  {
    id: 'audio-editor',
    name: 'Powerful Audio Editor Pro',
    slug: '/audio-processing/audio-editor',
    categoryId: 'audio-tools',
    shortDesc: 'Cut, trim, merge, pitch shift, normalize peak volume & equalize audio.',
    fullDesc: 'Interactive canvas waveform visualizer with precision crop, multi-track audio joiner, and audio FX studio.',
    icon: '🎛️',
    badge: 'PRO',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'audio-cutter',
    name: 'Audio Cutter & Trimmer',
    slug: '/audio-processing/audio-cutter',
    categoryId: 'audio-tools',
    shortDesc: 'Cut, crop, and trim MP3/WAV files with interactive waveform UI.',
    fullDesc: 'Browser-based audio trimmer with 60fps canvas waveform, millisecond start/end markers, fade transitions, and instant download.',
    icon: '✂️',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'volume-booster',
    name: 'Volume Booster & Peak Limiter',
    slug: '/audio-processing/volume-booster',
    categoryId: 'audio-tools',
    shortDesc: 'Amplify low audio volume up to 500% with soft-knee peak limiting.',
    fullDesc: 'Boost quiet MP3/WAV tracks up to +14dB using Web Audio API GainNode with automatic anti-clipping protection.',
    icon: '🔊',
    badge: 'FREE',
    isPopular: true
  },
  {
    id: 'speed-changer',
    name: 'Audio Speed & Tempo Changer',
    slug: '/audio-processing/speed-changer',
    categoryId: 'audio-tools',
    shortDesc: 'Change audio speed from 0.25x to 3.0x without pitch distortion.',
    fullDesc: 'Adjust playback speed for podcasts, music practice, and lectures with real-time audio playback preview.',
    icon: '⚡',
    badge: 'FREE',
    isPopular: true
  },
  {
    id: 'audio-reverser',
    name: 'Audio Reverser Studio',
    slug: '/audio-processing/audio-reverser',
    categoryId: 'audio-tools',
    shortDesc: 'Reverse audio playback and PCM Float32 waveform data in 1 click.',
    fullDesc: 'Flip song tracks backwards instantly in client browser memory with visual waveform inversion.',
    icon: '🔄',
    badge: 'FREE'
  },
  {
    id: 'equalizer',
    name: '5-Band Equalizer & Bass Booster',
    slug: '/audio-processing/equalizer',
    categoryId: 'audio-tools',
    shortDesc: 'Adjust bass, treble, vocal clarity, and 5 frequency bands in real-time.',
    fullDesc: 'BiquadFilterNode cascade EQ with presets for Bass Boost, Treble Enhancer, Vocal Clarity, and EDM Punch.',
    icon: '🎚️',
    badge: 'PRO',
    isPopular: true
  },
  {
    id: 'audio-compressor',
    name: 'Audio Dynamic Range Compressor',
    slug: '/audio-processing/audio-compressor',
    categoryId: 'audio-tools',
    shortDesc: 'Compress audio dynamic range for balanced radio & podcast volume.',
    fullDesc: 'Inbuilt Web Audio API DynamicsCompressorNode to smooth quiet and loud sounds automatically.',
    icon: '🗜️',
    badge: 'PRO'
  },
  {
    id: 'video-to-audio',
    name: 'Video to Audio MP3 Extractor',
    slug: '/audio-processing/video-to-audio',
    categoryId: 'audio-tools',
    shortDesc: 'Extract audio MP3/WAV tracks from MP4, WebM, MOV, and AVI videos.',
    fullDesc: '100% in-browser video audio extractor — no file upload required. Decodes video container and exports clean MP3 audio.',
    icon: '🎬',
    badge: 'NEW',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'audio-format-converter',
    name: 'Audio Format Converter',
    slug: '/audio-processing/format-converter',
    categoryId: 'audio-tools',
    shortDesc: 'Convert between MP3, WAV, OGG, and AAC formats in batch.',
    fullDesc: 'Batch convert audio files locally with custom bitrate selection (128k, 192k, 320k) and zero server uploads.',
    icon: '🔁',
    badge: 'POPULAR'
  },
  {
    id: 'audio-joiner',
    name: 'Audio Joiner & Merger',
    slug: '/audio-processing/audio-joiner',
    categoryId: 'audio-tools',
    shortDesc: 'Merge multiple audio tracks into a single seamless audio file.',
    fullDesc: 'Combine multiple MP3/WAV tracks with custom sequence ordering, crossfades, and single-click export.',
    icon: '🔗',
    badge: 'NEW',
    isLatest: true
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
  },
  {
    id: 'standard-calc',
    name: 'Standard Calculator',
    slug: '/calculators/standard',
    categoryId: 'calculators',
    shortDesc: 'Simple calculator for daily math.',
    fullDesc: 'Basic arithmetic calculator for quick calculations.',
    icon: '🔢'
  },
  {
    id: 'scientific-calc',
    name: 'Scientific Math',
    slug: '/calculators/scientific',
    categoryId: 'calculators',
    shortDesc: 'Advanced scientific calculator with trigonometry.',
    fullDesc: 'Evaluate complex mathematical expressions, logarithms, and trig functions.',
    icon: '🧮'
  },
  {
    id: 'percentage-calc',
    name: 'Percentage Calculator',
    slug: '/calculators/percentage',
    categoryId: 'calculators',
    shortDesc: 'Calculate discounts, markups, and percentage changes.',
    fullDesc: 'Quickly find percentages of numbers, percent increase or decrease.',
    icon: '💯'
  },
  {
    id: 'currency-calc',
    name: 'Currency Converter',
    slug: '/calculators/currency',
    categoryId: 'calculators',
    shortDesc: 'Real-time currency exchange rates calculator.',
    fullDesc: 'Convert between 150+ global currencies using live forex rates.',
    icon: '💵'
  },
  {
    id: 'discount-calc',
    name: 'Discount Calculator',
    slug: '/calculators/discount',
    categoryId: 'calculators',
    shortDesc: 'Find out the final price after sales tax and discount.',
    fullDesc: 'Quickly calculate sale prices and shopping discounts.',
    icon: '🏷️'
  },
  {
    id: 'salary-calc',
    name: 'Salary & Tax Calculator',
    slug: '/calculators/salary',
    categoryId: 'calculators',
    shortDesc: 'Estimate take-home pay after taxes and deductions.',
    fullDesc: 'Break down gross pay into net salary for different regions.',
    icon: '💼'
  },
  {
    id: 'time-calc',
    name: 'Time Calculator',
    slug: '/calculators/time',
    categoryId: 'calculators',
    shortDesc: 'Add or subtract time, calculate durations.',
    fullDesc: 'Calculate hours and minutes worked or duration between dates.',
    icon: '⏱️'
  },

  // ==================== DEVELOPER TOOLS ====================
  {
    id: 'sql',
    name: 'SQL',
    slug: '/developer-tools/sql',
    categoryId: 'developer-tools',
    shortDesc: 'Complete in-browser SQL Masterclass with DDL, DML, DQL, DCL, TCL, Joins & live query sandbox.',
    fullDesc: 'Interactive SQL learning curriculum with internal navigation: Introduction, Syntax, DDL, DML, DQL, DCL, TCL, Joins, and sandbox.',
    icon: '🗄️',
    badge: 'PRO',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'typing-master',
    name: 'Type Master',
    slug: '/typing-master',
    categoryId: 'developer-tools',
    shortDesc: 'Master touch typing with interactive finger drills, keyboard heatmap, and live WPM scoring.',
    fullDesc: 'Full touch-typing course with home row drills, real-time typing test, accuracy, and speed analytics.',
    icon: '⌨️',
    badge: 'POPULAR',
    isPopular: true
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    slug: '/developer-tools/json-formatter',
    categoryId: 'developer-tools',
    shortDesc: 'Prettify, format, validate, and minify JSON documents with instant syntax error detection.',
    fullDesc: 'Direct in-browser JSON formatter and validator with two-way split view, minify, beautify, and copy.',
    icon: '🧩',
    badge: 'POPULAR',
    isPopular: true
  }
];

