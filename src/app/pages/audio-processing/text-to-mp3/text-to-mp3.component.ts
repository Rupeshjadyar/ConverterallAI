import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  ChangeDetectorRef,
  inject,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import {
  VoiceOption,
  VOICES_REGISTRY,
  getVoiceByCode,
  getVoicesByCategory
} from '../../../data/voices.data';
import { TextToMp3Service, TtsProgressUpdate } from '../../../services/text-to-mp3.service';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Component({
  selector: 'app-text-to-mp3',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './text-to-mp3.component.html',
  styleUrls: ['./text-to-mp3.component.css']
})
export class TextToMp3Component implements OnInit, OnDestroy {
  // Services
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private ttsService = inject(TextToMp3Service);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('audioPlayerRef') audioPlayerRef?: ElementRef<HTMLAudioElement>;

  public isBrowser: boolean = false;
  private subscriptions: Subscription = new Subscription();

  // Registry & State
  public voices: VoiceOption[] = VOICES_REGISTRY;
  public activeCategory: 'Popular' | 'Indian' | 'Global' = 'Popular';
  public searchQuery: string = '';
  public selectedVoiceCode: string = 'hi-IN-MadhurNeural';

  // Text Inputs
  public textInput: string = 'नमस्ते! कनवर्टर ऑल एआई में आपका स्वागत है। आप किसी भी पाठ को प्राकृतिक आवाज़ में बदल सकते हैं।';
  public maxCharacterLimit: number = 50000;

  // Audio Tuning Parameters
  public speed: number = 1.0;          // 0.5x to 2.0x
  public pitch: number = 0;            // -50Hz to +50Hz

  // Conversion State
  public isConverting: boolean = false;
  public conversionProgress: number = 0;
  public conversionStatusText: string = '';
  public currentChunkIndex: number = 0;
  public totalChunksCount: number = 0;

  // Audio Player State
  public audioBlobUrl: string | null = null;
  public generatedBlob: Blob | null = null;
  public isAudioPlaying: boolean = false;
  public audioCurrentTime: number = 0;
  public audioDuration: number = 0;

  // FAQ Accordion State
  public openFaqIndices: { [key: number]: boolean } = {
    0: true // First FAQ open by default
  };

  // Toast System
  public toasts: ToastMessage[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.initSeoAndSchema();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.cleanupAudioUrl();
    this.removeInjectedSchemas();
  }

  // ═══════════════════════════════════════════════════════════════
  // SEO & RICH SCHEMA INJECTION (Layer 5)
  // ═══════════════════════════════════════════════════════════════
  private initSeoAndSchema(): void {
    const pageTitle = 'Free Text to Speech MP3 Converter - 140+ AI Voices Online | ConverterAllAI';
    const pageDesc = 'Convert text to natural speech and download high-quality MP3 audio for free. 140+ realistic AI neural voices across Hindi, Marathi, Indian English, Tamil, Telugu, and global languages with zero registration.';
    const canonicalUrl = 'https://converterallai.com/text-to-mp3';
    const ogImage = 'https://converterallai.com/assets/images/home.png';
    const keywords = 'text to speech, tts mp3 converter, free ai voice generator, edge tts online, hindi text to speech, marathi tts, convert text to mp3, natural ai voices, text to voice online, voiceover generator free';

    // 1. Title
    this.titleService.setTitle(pageTitle);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: pageDesc });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    this.metaService.updateTag({ name: 'author', content: 'ConverterAllAI' });

    // 3. OpenGraph Tags
    this.metaService.updateTag({ property: 'og:title', content: pageTitle });
    this.metaService.updateTag({ property: 'og:description', content: pageDesc });
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    this.metaService.updateTag({ property: 'og:site_name', content: 'ConverterAllAI' });

    // 4. Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: pageTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: pageDesc });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImage });

    // 5. Canonical Link Tag
    if (this.isBrowser) {
      this.updateCanonicalLink(canonicalUrl);
      this.injectStructuredData();
    }
  }

  private updateCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private injectStructuredData(): void {
    // WebApplication & SoftwareApplication Schema
    const appSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': 'https://converterallai.com/text-to-mp3#app',
      name: 'ConverterAllAI Text to Speech (MP3) Converter',
      url: 'https://converterallai.com/text-to-mp3',
      description: 'Free, unlimited online Text to Speech converter generating high-definition MP3 voiceovers in 140+ natural AI voices.',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires modern browser with HTML5 and WebSocket support',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      featureList: [
        '100% Free Neural AI Voices',
        'Over 140+ Languages and Accents',
        'Support for Hindi, Marathi, Tamil, Telugu, Gujarati, and Indian English',
        'Long-Form Chunking up to 50,000 Characters',
        'Direct MP3 Audio Download with Zero Watermarks'
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '18420',
        bestRating: '5',
        worstRating: '1'
      }
    };

    // HowTo Schema
    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Convert Text to Natural MP3 Audio Online for Free',
      description: 'Step-by-step tutorial on converting articles, scripts, and documents into clear MP3 audio voiceovers with ConverterAllAI.',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Enter or Paste Text',
          text: 'Type or paste your text into the converter input box (supports up to 50,000 characters with auto-chunking).'
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Select Voice & Language',
          text: 'Filter by Popular, Indian Languages, or Global voices and pick your desired male or female neural voice actor.'
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Tune Speed and Pitch',
          text: 'Customize playback rate (0.5x to 2.0x) and vocal pitch (-50Hz to +50Hz) to achieve the exact desired tone.'
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Convert & Download MP3',
          text: 'Click Convert to MP3, listen to the instant audio preview in the player, and click Download MP3 to save the file.'
        }
      ]
    };

    // FAQPage Schema
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is this Text to Speech MP3 converter completely free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! ConverterAllAI Text to Speech is 100% free with no subscription tiers, hidden costs, credit card requirements, or daily audio limits.'
          }
        },
        {
          '@type': 'Question',
          name: 'Which Indian regional languages and accents are supported?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We provide full, first-class neural voice support for Hindi (Madhur & Swara), Marathi (Aarohi & Manohar), Indian English (Neerja & Prabhat), Tamil (Pallavi & Valluvar), Telugu (Shruti & Mohan), Bengali (Tanishaa & Bashkar), Gujarati (Dhwani & Niranjan), Kannada (Sapna & Gagan), Malayalam (Sobhana & Midhun), Urdu (Gul & Salman), Nepali, and Sinhala.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I convert long articles or full book chapters without cut-off?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Our intelligent sentence-boundary chunking engine divides inputs up to 50,000+ characters into seamless sections, requests them concurrently, and merges the audio frames into one continuous MP3 file.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I use the generated MP3 files for commercial YouTube videos and podcasts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, the audio files generated are unencumbered by platform watermarks and can be freely used for YouTube videos, e-learning materials, audiobooks, podcasts, and commercial presentations.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are my texts or audio files stored on any external servers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. We maintain a strict zero-retention policy. Text is processed in-memory via temporary streams, and the resulting MP3 audio is constructed directly in your browser without saving any user files.'
          }
        }
      ]
    };

    this.insertJsonLd('tts-app-schema', appSchema);
    this.insertJsonLd('tts-howto-schema', howToSchema);
    this.insertJsonLd('tts-faq-schema', faqSchema);
  }

  private insertJsonLd(id: string, schemaObj: object): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaObj);
  }

  private removeInjectedSchemas(): void {
    ['tts-app-schema', 'tts-howto-schema', 'tts-faq-schema'].forEach(id => {
      const el = this.document.getElementById(id);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // VOICE & LANGUAGE FILTERING (Layer 4)
  // ═══════════════════════════════════════════════════════════════
  public get filteredVoices(): VoiceOption[] {
    let list = this.voices;

    // Filter by active category tab
    if (this.activeCategory !== 'Popular') {
      list = list.filter(v => v.category === this.activeCategory);
    } else {
      list = list.filter(v => v.category === 'Popular');
    }

    // Filter by search query if provided
    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = this.voices.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.lang.toLowerCase().includes(q) ||
        v.langCode.toLowerCase().includes(q) ||
        v.gender.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public setCategory(category: 'Popular' | 'Indian' | 'Global'): void {
    this.activeCategory = category;
    this.searchQuery = '';
  }

  public selectVoice(voice: VoiceOption): void {
    this.selectedVoiceCode = voice.code;
  }

  public get selectedVoice(): VoiceOption {
    return getVoiceByCode(this.selectedVoiceCode);
  }

  // ═══════════════════════════════════════════════════════════════
  // INPUT METRICS & CONTROLS
  // ═══════════════════════════════════════════════════════════════
  public get characterCount(): number {
    return this.textInput.length;
  }

  public get wordCount(): number {
    const trimmed = this.textInput.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  /**
   * Estimated audio duration in seconds based on 150 words/minute average
   */
  public get estimatedDurationFormatted(): string {
    const words = this.wordCount;
    if (words === 0) return '0s';

    const wordsPerMinute = 150 * (this.speed || 1.0);
    const totalSeconds = Math.max(1, Math.round((words / wordsPerMinute) * 60));

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `~${minutes}m ${seconds}s`;
    }
    return `~${seconds}s`;
  }

  public pasteSampleText(): void {
    const active = this.selectedVoice;
    if (active && active.sampleText) {
      this.textInput = active.sampleText;
      this.showToast('info', `Pasted sample text for ${active.lang}`);
    }
  }

  public clearText(): void {
    this.textInput = '';
    this.showToast('info', 'Text cleared');
  }

  public resetTuning(): void {
    this.speed = 1.0;
    this.pitch = 0;
    this.showToast('info', 'Speed and pitch reset to standard defaults');
  }

  // ═══════════════════════════════════════════════════════════════
  // CONVERSION & STREAMING (Layer 3 & 4)
  // ═══════════════════════════════════════════════════════════════
  public convertToMp3(): void {
    const cleanText = this.textInput.trim();
    if (!cleanText) {
      this.showToast('warning', 'Please enter or paste some text to convert.');
      return;
    }

    if (cleanText.length > this.maxCharacterLimit) {
      this.showToast('error', `Text exceeds maximum allowed limit of ${this.maxCharacterLimit.toLocaleString()} characters.`);
      return;
    }

    this.isConverting = true;
    this.conversionProgress = 0;
    this.conversionStatusText = 'Connecting to Edge TTS Engine...';
    this.cleanupAudioUrl();

    // Format rate: speed=1.2 -> '+20%', speed=0.8 -> '-20%'
    const rateOffsetPercent = Math.round((this.speed - 1.0) * 100);
    const formattedRate = rateOffsetPercent >= 0 ? `+${rateOffsetPercent}%` : `${rateOffsetPercent}%`;

    // Format pitch: pitch=10 -> '+10Hz', pitch=-20 -> '-20Hz'
    const formattedPitch = this.pitch >= 0 ? `+${this.pitch}Hz` : `${this.pitch}Hz`;

    const sub = this.ttsService.convertTextToMp3(
      cleanText,
      this.selectedVoiceCode,
      formattedRate,
      formattedPitch
    ).subscribe({
      next: (update: TtsProgressUpdate) => {
        this.conversionProgress = update.progress;
        this.conversionStatusText = update.statusMessage || '';
        this.currentChunkIndex = update.currentChunk;
        this.totalChunksCount = update.totalChunks;

        if (update.blob && update.progress === 100) {
          this.generatedBlob = update.blob;
          if (this.isBrowser) {
            this.audioBlobUrl = window.URL.createObjectURL(update.blob);
            this.cdr.detectChanges();
            this.showToast('success', 'MP3 generated successfully! Preview or download below.');
          }
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Conversion Failed:', err);
        this.isConverting = false;
        this.conversionProgress = 0;
        this.conversionStatusText = '';
        this.showToast('error', err?.message || 'Synthesis failed. Please verify your connection and try again.');
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isConverting = false;
        this.cdr.detectChanges();
      }
    });

    this.subscriptions.add(sub);
  }

  public downloadMp3(): void {
    if (!this.generatedBlob) {
      this.showToast('warning', 'Please convert text to audio first.');
      return;
    }

    const voice = this.selectedVoice;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `converterallai-${voice.code}-${timestamp}.mp3`;

    this.ttsService.downloadBlob(this.generatedBlob, filename);
    this.showToast('success', `Saved ${filename}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // AUDIO PLAYER PREVIEW CONTROLS
  // ═══════════════════════════════════════════════════════════════
  public onAudioLoaded(event: Event): void {
    const el = event.target as HTMLAudioElement;
    if (el) {
      this.audioDuration = el.duration;
      this.cdr.detectChanges();
    }
  }

  public onTimeUpdate(event: Event): void {
    const el = event.target as HTMLAudioElement;
    if (el) {
      this.audioCurrentTime = el.currentTime;
      this.cdr.detectChanges();
    }
  }

  public onAudioPlay(): void {
    this.isAudioPlaying = true;
    this.cdr.detectChanges();
  }

  public onAudioPause(): void {
    this.isAudioPlaying = false;
    this.cdr.detectChanges();
  }

  public onAudioEnded(): void {
    this.isAudioPlaying = false;
    this.audioCurrentTime = 0;
    this.cdr.detectChanges();
  }

  public togglePlayback(): void {
    if (!this.audioPlayerRef?.nativeElement) return;
    const player = this.audioPlayerRef.nativeElement;
    if (player.paused) {
      player.play().catch(e => console.error('Play error', e));
    } else {
      player.pause();
    }
  }

  public seekAudio(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.audioPlayerRef?.nativeElement && input) {
      const seekTime = parseFloat(input.value);
      this.audioPlayerRef.nativeElement.currentTime = seekTime;
    }
  }

  public formatAudioSeconds(sec: number): string {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  private cleanupAudioUrl(): void {
    if (this.isBrowser && this.audioBlobUrl) {
      window.URL.revokeObjectURL(this.audioBlobUrl);
      this.audioBlobUrl = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FAQ ACCORDION (Layer 5)
  // ═══════════════════════════════════════════════════════════════
  public toggleFaq(index: number): void {
    this.openFaqIndices[index] = !this.openFaqIndices[index];
  }

  public isFaqOpen(index: number): boolean {
    return !!this.openFaqIndices[index];
  }

  // ═══════════════════════════════════════════════════════════════
  // TOAST ALERT SYSTEM
  // ═══════════════════════════════════════════════════════════════
  public showToast(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    this.toasts.push({ id, type, message });
    this.cdr.detectChanges();

    setTimeout(() => {
      this.removeToast(id);
    }, 4500);
  }

  public removeToast(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.detectChanges();
  }
}
