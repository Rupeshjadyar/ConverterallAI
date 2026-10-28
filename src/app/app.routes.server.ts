import { RenderMode, ServerRoute } from '@angular/ssr';
import { TTS_LANGUAGES } from './data/tts-languages.data';

export const STATIC_PRERENDER_ROUTES: string[] = [
  '',
  'calculators',
  'calculators/basic',
  'calculators/bmi',
  'calculators/percentage',
  'calculators/emi',
  'calculators/age',
  'calculators/gst',
  'calculators/discount',
  'calculators/sip',
  'calculators/cgpa',
  'calculators/loan',
  'calculators/date',
  'image-processing',
  'image-Compressor',
  'image-processing/format-converter',
  'image-processing/jpeg-to-png',
  'image-processing/cropper',
  'image-processing/compressor',
  'image-processing/bg-remover',
  'image-processing/image-to-pdf',
  'image-processing/editor',
  'audio-processing',
  'audio-processing/audio-cutter',
  'audio-processing/volume-booster',
  'audio-processing/speed-changer',
  'audio-processing/audio-reverser',
  'audio-processing/equalizer',
  'audio-processing/audio-compressor',
  'audio-processing/video-to-audio',
  'audio-processing/format-converter',
  'audio-processing/audio-joiner',
  'audio-processing/tts',
  'audio-processing/text-to-mp3',
  'audio-processing/audio-editor',
  'audio-editor',
  'audio-processing/voice-cloning',
  'pdf-processing',
  'pdf-processing/merge-pdf',
  'pdf-processing/split-pdf',
  'pdf-processing/compress-pdf',
  'pdf-processing/pdf-to-word',
  'pdf-processing/pdf-to-ppt',
  'pdf-processing/pdf-to-excel',
  'pdf-processing/word-to-pdf',
  'pdf-processing/ppt-to-pdf',
  'pdf-processing/excel-to-pdf',
  'pdf-processing/edit-pdf',
  'pdf-processing/pdf-to-jpg',
  'pdf-processing/jpg-to-pdf',
  'pdf-processing/sign-pdf',
  'pdf-processing/add-watermark',
  'pdf-processing/rotate-pdf',
  'pdf-processing/html-to-pdf',
  'pdf-processing/remove-password',
  'pdf-processing/add-password',
  'pdf-processing/organize-pdf',
  'pdf-processing/pdf-to-pdfa',
  'pdf-processing/repair-pdf',
  'pdf-processing/add-page-numbers',
  'pdf-processing/scan-to-pdf',
  'pdf-processing/ocr-pdf',
  'pdf-processing/compare-pdf',
  'pdf-processing/redact-pdf',
  'pdf-processing/crop-pdf',
  'pdf-processing/pdf-forms',
  'pdf-processing/ai-summarizer',
  'pdf-processing/translate-pdf',
  'pdf-processing/pdf-to-text',
  'pdf-processing/text-to-pdf',
  'games',
  'games/chess',
  'games/frontline-survivor',
  'games/warfare-3000',
  'games/teen-do-paanch',
  'games/snakes-ladders',
  'games/ludo',
  'games/spelling-bee',
  'games/teen-patti',
  'games/sudoku',
  'games/snake',
  'games/memory-match',
  'games/tic-tac-toe',
  'games/brick-breaker',
  'games/pong',
  'typing-speed-test',
  'typing-master',
  'resume-builder',
  'about',
  'contact',
  'privacy-policy',
  'terms-of-service',
  'disclaimer',
  'cookie-policy',
  'developer-tools',
  'developer-tools/json-formatter',
  'developer-tools/sql',
  'developer-tools/sql/intro',
  'developer-tools/sql/syntax',
  'developer-tools/sql/ddl',
  'developer-tools/sql/dml',
  'developer-tools/sql/dql',
  'developer-tools/sql/dcl',
  'developer-tools/sql/tcl',
  'developer-tools/sql/joins',
  'developer-tools/sql/data-types',
  'developer-tools/sql/constraints',
  'developer-tools/sql/functions',
  'developer-tools/sql/group-by',
  'developer-tools/sql/subqueries',
  'developer-tools/sql/foreign-keys',
  'developer-tools/sql/views',
  'developer-tools/sql/playground',
  'developer-tools/web-tutorials',
  'ai-chat'
];

export const serverRoutes: ServerRoute[] = [
  // Client-rendered dashboard and private routes
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: 'analytics',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin',
    renderMode: RenderMode.Client
  },

  // Dynamic parameterized TTS routes
  {
    path: 'audio-processing/tts/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return TTS_LANGUAGES.map(lang => ({ slug: lang.slug }));
    }
  },

  // Static public pages prerender
  ...(STATIC_PRERENDER_ROUTES.map(path => ({
    path,
    renderMode: RenderMode.Prerender as const
  })) as ServerRoute[]),

  // Fallback dynamically on server
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
