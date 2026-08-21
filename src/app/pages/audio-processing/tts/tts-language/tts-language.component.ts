import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TTS_LANGUAGES, TtsLanguage, getLanguageFact, LanguageFact } from '../../../../data/tts-languages.data';
import { SpeakTtsService, VOICE_CHARACTERS, VoiceOption } from '../../../../services/speak-tts.service';

export interface DialogueLine {
  speaker: string;
  voiceId: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-tts-language',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tts-language.component.html',
  styleUrls: ['./tts-language.component.css']
})
export class TtsLanguageComponent implements OnInit, OnDestroy {
  lang: TtsLanguage = TTS_LANGUAGES[0];
  allLanguages: TtsLanguage[] = TTS_LANGUAGES;
  voiceCharacters: VoiceOption[] = VOICE_CHARACTERS;
  fact: LanguageFact = getLanguageFact('hi-IN');

  activeMode: 'single' | 'dialogue' = 'single';
  textInput: string = '';
  
  selectedVoiceId: string = 'female-1';
  speed: number = 1.0;
  pitch: number = 0;
  volume: number = 100;
  speakingStyle: string = 'General';
  audioFormat: 'mp3' | 'wav' = 'mp3';
  naturalMode: boolean = true;
  currentTheme: 'light' | 'dark' = 'light';

  // Dialogue Mode
  dialogueLines: DialogueLine[] = [
    { speaker: 'Host', voiceId: 'female-1', text: 'Namaste! Welcome to AI Voice Studio.' },
    { speaker: 'Guest', voiceId: 'male-1', text: 'Thank you! Multi-lingual voice synthesis is amazing.' }
  ];

  isPlaying: boolean = false;
  isGenerating: boolean = false;
  toastMessage: string | null = null;
  toastType: 'ok' | 'err' = 'ok';

  speakingStyles: string[] = ['General', 'Cheerful', 'Newscast Formal', 'Narration Professional', 'Friendly', 'Poetry Reading', 'Documentary', 'Customer Service'];

  faqs: FaqItem[] = [];

  private isBrowser: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private ttsService: SpeakTtsService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
      this.currentTheme = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.initLanguage(slug);
    });
  }

  ngOnDestroy(): void {
    this.ttsService.stop();
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', this.currentTheme);
      document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
  }

  private initLanguage(slug: string): void {
    const found = this.allLanguages.find(l => l.slug === slug);
    if (found) {
      this.lang = found;
    } else {
      this.lang = this.allLanguages[0];
    }

    this.fact = getLanguageFact(this.lang.code);
    this.textInput = this.lang.sampleText;

    // Dynamic SEO Meta Tags
    this.titleService.setTitle(this.lang.seoTitle);
    this.metaService.updateTag({ name: 'description', content: this.lang.metaDescription });
    this.metaService.updateTag({ name: 'keywords', content: this.lang.keywords });
    this.metaService.updateTag({ property: 'og:title', content: this.lang.seoTitle });
    this.metaService.updateTag({ property: 'og:description', content: this.lang.metaDescription });

    // FAQs
    this.faqs = [
      {
        question: `Is ${this.lang.lang} Text to Speech 100% free with no login?`,
        answer: `Yes! ConverterallAI provides 100% free ${this.lang.lang} Text to Speech voice generation with unlimited conversions, zero daily caps, and no credit card or account registration required.`,
        isOpen: false
      },
      {
        question: `How do I download ${this.lang.lang} audio as MP3 or WAV?`,
        answer: `Simply enter your ${this.lang.lang} text into the studio input, select your preferred voice character, speed, and pitch, click "Generate ${this.lang.lang} Voice", then click Download MP3 or Download WAV.`,
        isOpen: false
      },
      {
        question: `Can I use generated ${this.lang.lang} voiceovers for YouTube and Commercial Videos?`,
        answer: `Yes! All audio files generated on ConverterallAI are royalty-free and ready for YouTube videos, podcasts, commercial ads, social media reels, and educational modules.`,
        isOpen: false
      },
      {
        question: `Does it support ${this.lang.lang} multi-voice dialogue conversations?`,
        answer: `Yes! Switch to "Multi-Voice Dialogue Mode" to create conversation audio between male, female, and kid voice characters.`,
        isOpen: false
      }
    ];
  }

  switchTab(mode: 'single' | 'dialogue'): void {
    this.activeMode = mode;
  }

  loadSampleText(): void {
    this.textInput = this.lang.sampleText;
    this.showToast(`Loaded sample ${this.lang.lang} text!`);
  }

  onLangSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newCode = target.value;
    const targetLang = this.allLanguages.find(l => l.code === newCode);
    if (targetLang) {
      this.router.navigate(['/tts', targetLang.slug]);
    }
  }

  get charCount(): number {
    return this.textInput.length;
  }

  get estimatedDurationSec(): number {
    const words = this.textInput.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil((words / (140 * this.speed)) * 60));
  }

  doGenerateAndPlay(): void {
    let script = this.textInput.trim();
    if (this.activeMode === 'dialogue') {
      script = this.dialogueLines.map(l => `${l.speaker}: ${l.text}`).join('. ');
    }

    if (!script) {
      this.showToast('Please enter text to speak!', 'err');
      return;
    }

    this.isPlaying = true;
    this.showToast(`Generating & playing ${this.lang.lang} audio...`);

    this.ttsService.speakText(
      script,
      this.lang.code,
      this.selectedVoiceId,
      this.speed,
      this.pitch,
      this.volume,
      () => { this.isPlaying = true; },
      () => { this.isPlaying = false; },
      () => { this.isPlaying = false; this.showToast('Playback error', 'err'); }
    );
  }

  doStop(): void {
    this.ttsService.stop();
    this.isPlaying = false;
  }

  doDownload(fmt: 'mp3' | 'wav'): void {
    let text = this.textInput.trim();
    if (this.activeMode === 'dialogue') {
      text = this.dialogueLines.map(l => l.text).join('. ');
    }

    if (!text) {
      this.showToast('Please enter text first!', 'err');
      return;
    }

    this.isGenerating = true;
    this.showToast(`Generating ${fmt.toUpperCase()} download...`);

    try {
      const blob = this.ttsService.generateAudioBlob(text, this.pitch, this.volume, this.speed);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converterallai_${this.lang.code}_${Date.now()}.${fmt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.showToast(`${fmt.toUpperCase()} download started! 🎉`);
    } catch (e) {
      this.showToast('Download generation failed', 'err');
    } finally {
      this.isGenerating = false;
    }
  }

  addDialogueLine(): void {
    this.dialogueLines.push({
      speaker: `Speaker ${this.dialogueLines.length + 1}`,
      voiceId: this.dialogueLines.length % 2 === 0 ? 'female-1' : 'male-1',
      text: ''
    });
  }

  removeDialogueLine(index: number): void {
    if (this.dialogueLines.length > 1) {
      this.dialogueLines.splice(index, 1);
    }
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  copyLink(): void {
    if (this.isBrowser && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this.showToast('Page link copied to clipboard!');
    }
  }

  showToast(msg: string, type: 'ok' | 'err' = 'ok'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
