import { RenderMode, ServerRoute } from '@angular/ssr';
import { TTS_LANGUAGES } from './data/tts-languages.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'tts/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return TTS_LANGUAGES.map(lang => ({ slug: lang.slug }));
    }
  },
  {
    path: 'audio-processing/tts/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return TTS_LANGUAGES.map(lang => ({ slug: lang.slug }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
