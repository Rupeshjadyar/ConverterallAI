import { Component, OnInit, OnDestroy, signal, computed, ElementRef, ViewChild, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';
import { ToolRegistryService } from '../../services/tool-registry.service';
import {
  EASY_ENGLISH_WORDS,
  MEDIUM_ENGLISH_WORDS,
  HARD_ENGLISH_WORDS,
  HINGLISH_WORDS,
  CODE_SNIPPETS,
  QUOTES,
  QuoteItem,
  generateTestTokens
} from './typing-speed-test.data';

export interface CharState {
  char: string;
  state: 'correct' | 'wrong' | 'extra' | 'untyped';
}

export interface WordData {
  original: string;
  typed: string;
  isCurrent: boolean;
  isCompleted: boolean;
  isCorrect: boolean;
  chars: CharState[];
}

export interface TimelinePoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

@Component({
  selector: 'app-typing-speed-test',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './typing-speed-test.component.html',
  styleUrls: ['./typing-speed-test.component.css']
})
export class TypingSpeedTestComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenInput') hiddenInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('typingContainer') typingContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartCanvas') chartCanvasRef?: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private seoService = inject(SeoService);
  private toolRegistry = inject(ToolRegistryService);

  isBrowser = isPlatformBrowser(this.platformId);

  // Configuration Modes
  mode = signal<'time' | 'words' | 'quote' | 'custom' | 'zen'>('time');
  timeOption = signal<number>(60); // 15, 30, 60, 120, 300
  wordsOption = signal<number>(50); // 10, 25, 50, 100
  quoteLength = signal<'short' | 'medium' | 'long'>('medium');
  difficulty = signal<'easy' | 'medium' | 'hard' | 'code'>('easy');
  language = signal<'english' | 'hinglish'>('english');
  punctuation = signal<boolean>(false);
  numbers = signal<boolean>(false);
  soundEnabled = signal<boolean>(true);
  soundType = signal<'mechanical' | 'typewriter' | 'softbeep'>('mechanical');

  // Active Test State
  testStatus = signal<'idle' | 'running' | 'finished'>('idle');
  customText = signal<string>('');
  currentQuoteAuthor = signal<string>('');
  words = signal<WordData[]>([]);
  currentWordIndex = signal<number>(0);
  currentInput = signal<string>('');
  isInputFocused = signal<boolean>(false);

  // Live Metrics
  elapsedSeconds = signal<number>(0);
  timeLeft = signal<number>(60);
  netWpm = signal<number>(0);
  rawWpm = signal<number>(0);
  accuracy = signal<number>(100);
  consistency = signal<number>(100);
  totalKeystrokes = signal<number>(0);
  correctKeystrokes = signal<number>(0);
  incorrectKeystrokes = signal<number>(0);
  extraCharsCount = signal<number>(0);
  missedCharsCount = signal<number>(0);

  // Results & History
  timeline: TimelinePoint[] = [];
  mistypedWords = signal<string[]>([]);
  mistypedKeys = signal<Record<string, number>>({});
  personalBest = signal<number>(0);
  isNewPersonalBest = signal<boolean>(false);
  copiedNotification = signal<boolean>(false);

  // Audio Context (Synthesizer)
  private audioCtx: any = null;
  private timerInterval: any = null;

  // Active FAQ accordion state
  activeFaqIndex = signal<number | null>(0);

  // FAQ items for on-page display and SEO
  faqs = [
    {
      q: 'How is Words Per Minute (WPM) calculated accurately?',
      a: 'In standard typing metrics, one word equals exactly 5 keystrokes (including letters, punctuation, and spaces). Gross WPM is calculated as (Total Characters Typed / 5) divided by time in minutes. Net WPM subtracts uncorrected errors: Net WPM = ((Correct Characters / 5) / Elapsed Minutes). Net WPM is the true metric for typing competence.'
    },
    {
      q: 'What is considered a good typing speed on a 1-minute test?',
      a: 'The worldwide average typing speed is 38 to 41 WPM. A speed of 50-65 WPM is considered good for office productivity. Software engineers and writers commonly hit 70-85 WPM. Speeds above 90 WPM place you in the top 5% of typists globally.'
    },
    {
      q: 'Should I prioritize typing accuracy or typing speed first?',
      a: 'Always prioritize accuracy above 95% first! Typing fast with high errors forces frequent backspacing, which cripples overall velocity. Once finger muscle memory becomes instinctual and errors drop, speed naturally and effortlessly increases.'
    },
    {
      q: 'Can I take typing speed tests in Hinglish or Code mode?',
      a: 'Yes! ConverterAllAI features dedicated Roman Hindi (Hinglish) word banks (300+ conversational words) as well as a JavaScript/CSS Code snippet mode designed specifically for programmers.'
    },
    {
      q: 'How do I generate and download a certified typing scorecard?',
      a: 'After completing any typing test, click the "Download Certificate" button. The tool automatically draws a high-resolution, watermark-free PNG certificate with your Net WPM, accuracy, time duration, and verified skill tier.'
    }
  ];

  ngOnInit(): void {
    if (this.isBrowser) {
      // Apply SEO
      const tool = this.toolRegistry.getToolBySlug('/typing-speed-test');
      if (tool) {
        this.seoService.applyToolSeo(tool);
      } else {
        this.seoService.update({
          title: 'Typing Speed Test Online Free - 1 Minute WPM Test | ConverterAllAI',
          description: 'Free online typing speed test with real-time Words Per Minute (WPM), accuracy, and consistency tracking. Take 1-minute or 3-minute tests with certificate download.',
          keywords: 'typing speed test, typing test online free, 1 minute typing test, wpm test, words per minute test, keyboard speed test',
          canonical: 'https://converterallai.com/typing-speed-test'
        });
      }

      this.loadPersonalBest();
      this.initNewTest();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
    }
  }

  // ==================== TEST INITIALIZATION ====================

  initNewTest(): void {
    this.stopTimer();
    this.testStatus.set('idle');
    this.elapsedSeconds.set(0);
    this.netWpm.set(0);
    this.rawWpm.set(0);
    this.accuracy.set(100);
    this.consistency.set(100);
    this.totalKeystrokes.set(0);
    this.correctKeystrokes.set(0);
    this.incorrectKeystrokes.set(0);
    this.extraCharsCount.set(0);
    this.missedCharsCount.set(0);
    this.currentWordIndex.set(0);
    this.currentInput.set('');
    this.timeline = [];
    this.mistypedWords.set([]);
    this.mistypedKeys.set({});
    this.isNewPersonalBest.set(false);

    // Set time
    if (this.mode() === 'time') {
      this.timeLeft.set(this.timeOption());
    } else {
      this.timeLeft.set(0);
    }

    let rawTokens: string[] = [];

    if (this.mode() === 'custom') {
      const text = this.customText().trim() || 'Type what you want to practice and test your speed on your own text.';
      rawTokens = text.split(/\s+/).filter(Boolean);
    } else if (this.mode() === 'quote') {
      const category = this.quoteLength();
      const filtered = QUOTES.filter(q => q.category === category);
      const chosen = filtered[Math.floor(Math.random() * filtered.length)] || QUOTES[0];
      this.currentQuoteAuthor.set(chosen.author);
      rawTokens = chosen.text.split(/\s+/).filter(Boolean);
    } else if (this.mode() === 'words') {
      rawTokens = generateTestTokens({
        count: this.wordsOption(),
        difficulty: this.difficulty(),
        language: this.language(),
        punctuation: this.punctuation(),
        numbers: this.numbers()
      });
    } else {
      // Time or Zen mode: generate healthy batch of 120 words
      rawTokens = generateTestTokens({
        count: 120,
        difficulty: this.difficulty(),
        language: this.language(),
        punctuation: this.punctuation(),
        numbers: this.numbers()
      });
    }

    const wordDataList: WordData[] = rawTokens.map((w, idx) => ({
      original: w,
      typed: '',
      isCurrent: idx === 0,
      isCompleted: false,
      isCorrect: false,
      chars: w.split('').map(c => ({ char: c, state: 'untyped' }))
    }));

    this.words.set(wordDataList);

    // Focus input
    if (this.isBrowser) {
      setTimeout(() => this.focusInput(), 100);
    }
  }

  repeatSameTest(): void {
    const existingWords = this.words();
    this.stopTimer();
    this.testStatus.set('idle');
    this.elapsedSeconds.set(0);
    this.netWpm.set(0);
    this.rawWpm.set(0);
    this.accuracy.set(100);
    this.consistency.set(100);
    this.totalKeystrokes.set(0);
    this.correctKeystrokes.set(0);
    this.incorrectKeystrokes.set(0);
    this.extraCharsCount.set(0);
    this.missedCharsCount.set(0);
    this.currentWordIndex.set(0);
    this.currentInput.set('');
    this.timeline = [];
    this.mistypedWords.set([]);
    this.mistypedKeys.set({});
    this.isNewPersonalBest.set(false);

    if (this.mode() === 'time') {
      this.timeLeft.set(this.timeOption());
    } else {
      this.timeLeft.set(0);
    }

    const resetWords: WordData[] = existingWords.map((w, idx) => ({
      original: w.original,
      typed: '',
      isCurrent: idx === 0,
      isCompleted: false,
      isCorrect: false,
      chars: w.original.split('').map(c => ({ char: c, state: 'untyped' }))
    }));

    this.words.set(resetWords);
    if (this.isBrowser) {
      setTimeout(() => this.focusInput(), 100);
    }
  }

  // ==================== KEYBOARD HANDLING ====================

  focusInput(): void {
    if (this.hiddenInputRef && this.hiddenInputRef.nativeElement) {
      this.hiddenInputRef.nativeElement.focus();
      this.isInputFocused.set(true);
    }
  }

  onInputBlur(): void {
    this.isInputFocused.set(false);
  }

  onInputFocus(): void {
    this.isInputFocused.set(true);
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(e: KeyboardEvent): void {
    // Tab + Enter or Esc to quickly restart
    if (e.key === 'Escape') {
      e.preventDefault();
      this.initNewTest();
      return;
    }
    if (e.key === 'Tab') {
      // prevent tab away during typing
      if (this.testStatus() === 'running') {
        e.preventDefault();
      }
    }

    // Auto-focus input if user starts typing outside
    if (this.testStatus() !== 'finished' && !this.isInputFocused()) {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.focusInput();
      }
    }
  }

  onHiddenInputKeydown(e: KeyboardEvent): void {
    if (this.testStatus() === 'finished') return;

    // Start timer on first keystroke
    if (this.testStatus() === 'idle') {
      if (e.key !== 'Tab' && e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt') {
        this.startTest();
      }
    }

    // Space advances word
    if (e.key === ' ') {
      e.preventDefault();
      if (this.currentInput().length > 0) {
        this.commitCurrentWord();
        this.playSound(false);
      }
      return;
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      if (e.ctrlKey || e.altKey) {
        // Delete entire word
        e.preventDefault();
        this.currentInput.set('');
        this.updateCurrentWordVisuals('');
        this.playSound(false);
        return;
      }
      // If current input is empty, don't jump back (standard monkeytype default)
      this.playSound(false);
    }
  }

  onHiddenInputChange(event: Event): void {
    if (this.testStatus() === 'finished') return;

    const val = (event.target as HTMLInputElement).value;
    this.currentInput.set(val);

    // Update keystrokes & sounds
    this.totalKeystrokes.update(k => k + 1);

    const wordList = this.words();
    const currIdx = this.currentWordIndex();
    if (currIdx < wordList.length) {
      const targetWord = wordList[currIdx].original;
      const lastTypedChar = val.slice(-1);
      const expectedChar = targetWord[val.length - 1];

      const isError = expectedChar !== undefined && lastTypedChar !== expectedChar;
      if (isError) {
        this.incorrectKeystrokes.update(k => k + 1);
        if (expectedChar) {
          const keyStats = { ...this.mistypedKeys() };
          keyStats[expectedChar] = (keyStats[expectedChar] || 0) + 1;
          this.mistypedKeys.set(keyStats);
        }
      } else {
        this.correctKeystrokes.update(k => k + 1);
      }

      this.playSound(isError);
      this.updateCurrentWordVisuals(val);
    }

    this.calculateLiveMetrics();
  }

  private updateCurrentWordVisuals(val: string): void {
    const list = [...this.words()];
    const currIdx = this.currentWordIndex();
    if (currIdx >= list.length) return;

    const word = list[currIdx];
    const orig = word.original;
    const charStates: CharState[] = [];

    // Map original characters
    for (let i = 0; i < orig.length; i++) {
      if (i < val.length) {
        if (val[i] === orig[i]) {
          charStates.push({ char: orig[i], state: 'correct' });
        } else {
          charStates.push({ char: orig[i], state: 'wrong' });
        }
      } else {
        charStates.push({ char: orig[i], state: 'untyped' });
      }
    }

    // Extra characters typed past word length
    if (val.length > orig.length) {
      for (let i = orig.length; i < val.length; i++) {
        charStates.push({ char: val[i], state: 'extra' });
      }
    }

    list[currIdx] = {
      ...word,
      typed: val,
      chars: charStates
    };

    this.words.set(list);
    this.scrollToActiveWord();
  }

  private commitCurrentWord(): void {
    const list = [...this.words()];
    const currIdx = this.currentWordIndex();
    if (currIdx >= list.length) return;

    const currentWord = list[currIdx];
    const isExactMatch = currentWord.typed === currentWord.original;

    if (!isExactMatch) {
      const mistyped = [...this.mistypedWords()];
      if (!mistyped.includes(currentWord.original)) {
        mistyped.push(currentWord.original);
        this.mistypedWords.set(mistyped);
      }
    }

    list[currIdx] = {
      ...currentWord,
      isCompleted: true,
      isCurrent: false,
      isCorrect: isExactMatch
    };

    const nextIdx = currIdx + 1;
    this.currentWordIndex.set(nextIdx);
    this.currentInput.set('');
    if (this.hiddenInputRef && this.hiddenInputRef.nativeElement) {
      this.hiddenInputRef.nativeElement.value = '';
    }

    if (nextIdx < list.length) {
      list[nextIdx] = {
        ...list[nextIdx],
        isCurrent: true
      };
      this.words.set(list);
      this.scrollToActiveWord();
    } else {
      // Completed all words
      this.words.set(list);
      this.finishTest();
    }
  }

  private scrollToActiveWord(): void {
    if (!this.isBrowser || !this.typingContainerRef) return;
    const container = this.typingContainerRef.nativeElement;
    const activeEl = container.querySelector('.word-wrapper.active') as HTMLElement;
    if (activeEl) {
      const containerTop = container.offsetTop;
      const elementTop = activeEl.offsetTop;
      const relativeTop = elementTop - containerTop;
      if (relativeTop > 65) {
        container.scrollTop = relativeTop - 35;
      } else if (relativeTop < 20) {
        container.scrollTop = 0;
      }
    }
  }

  // ==================== TIMER & METRICS ====================

  startTest(): void {
    this.testStatus.set('running');
    this.elapsedSeconds.set(0);
    this.timeline = [];

    this.timerInterval = setInterval(() => {
      this.elapsedSeconds.update(s => s + 1);

      if (this.mode() === 'time') {
        this.timeLeft.update(t => {
          if (t <= 1) {
            this.finishTest();
            return 0;
          }
          return t - 1;
        });
      }

      this.calculateLiveMetrics();
      this.recordTimelinePoint();
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private calculateLiveMetrics(): void {
    const elapsedSec = Math.max(1, this.elapsedSeconds());
    const minutes = elapsedSec / 60;

    let correctChars = 0;
    let wrongChars = 0;
    let extraChars = 0;

    for (const w of this.words()) {
      if (w.isCompleted || w.isCurrent) {
        for (const c of w.chars) {
          if (c.state === 'correct') correctChars++;
          else if (c.state === 'wrong') wrongChars++;
          else if (c.state === 'extra') extraChars++;
        }
        // Count trailing space as correct character for completed correct words
        if (w.isCompleted && w.isCorrect) {
          correctChars += 1;
        }
      }
    }

    const totalCharsTyped = correctChars + wrongChars + extraChars;
    const grossWpmVal = Math.round((totalCharsTyped / 5) / minutes);
    const netWpmVal = Math.max(0, Math.round((correctChars / 5) / minutes));

    const totalKeys = this.totalKeystrokes();
    const correctKeys = this.correctKeystrokes();
    const accVal = totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 100) : 100;

    this.rawWpm.set(grossWpmVal);
    this.netWpm.set(netWpmVal);
    this.accuracy.set(Math.min(100, Math.max(0, accVal)));
    this.extraCharsCount.set(extraChars);
    this.incorrectKeystrokes.set(wrongChars);
  }

  private recordTimelinePoint(): void {
    const sec = this.elapsedSeconds();
    this.timeline.push({
      second: sec,
      wpm: this.netWpm(),
      rawWpm: this.rawWpm(),
      errors: this.incorrectKeystrokes()
    });
  }

  private computeConsistency(): number {
    if (this.timeline.length < 3) return 96;
    const wpms = this.timeline.map(t => t.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    if (mean === 0) return 100;
    const variance = wpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    return Math.max(10, Math.min(100, Math.round(100 - cv)));
  }

  finishTest(): void {
    this.stopTimer();
    this.testStatus.set('finished');
    this.calculateLiveMetrics();
    this.consistency.set(this.computeConsistency());

    // Check personal best
    const finalWpm = this.netWpm();
    if (finalWpm > this.personalBest()) {
      this.personalBest.set(finalWpm);
      this.isNewPersonalBest.set(true);
      this.savePersonalBest(finalWpm);
      this.playFanfare();
    }

    // Render Speed Chart on canvas
    setTimeout(() => {
      this.renderSpeedChart();
    }, 150);
  }

  // ==================== GRAPH & CERTIFICATE ====================

  renderSpeedChart(): void {
    if (!this.isBrowser || !this.chartCanvasRef) return;
    const canvas = this.chartCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 760;
    const height = 220;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const data = this.timeline;
    if (data.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Typing run completed in under 2 seconds. No trajectory chart available.', width / 2, height / 2);
      return;
    }

    const pad = { top: 25, right: 35, bottom: 35, left: 45 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const maxWpm = Math.max(...data.map(d => d.rawWpm || d.wpm), 30);
    const maxY = Math.ceil(maxWpm / 15) * 15;
    const totalSecs = Math.max(data.length, 1);

    const getX = (sec: number) => pad.left + ((sec - 1) / Math.max(totalSecs - 1, 1)) * chartW;
    const getY = (wpm: number) => pad.top + chartH - (wpm / maxY) * chartH;

    // Grid lines & labels
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'right';

    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const val = Math.round((maxY / steps) * i);
      const y = getY(val);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillText(String(val), pad.left - 8, y + 4);
    }

    // Raw WPM line (faint dashed gray)
    ctx.beginPath();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    data.forEach((pt, idx) => {
      const x = getX(pt.second);
      const y = getY(pt.rawWpm || pt.wpm);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Gradient fill under Net WPM
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.02)');

    ctx.beginPath();
    data.forEach((pt, idx) => {
      const x = getX(pt.second);
      const y = getY(pt.wpm);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(getX(data[data.length - 1].second), pad.top + chartH);
    ctx.lineTo(getX(1), pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Solid Main Net WPM Line
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    data.forEach((pt, idx) => {
      const x = getX(pt.second);
      const y = getY(pt.wpm);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Error dots (red markers)
    data.forEach(pt => {
      if (pt.errors > 0) {
        const x = getX(pt.second);
        const y = getY(pt.wpm);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }

  downloadScorecard(): void {
    if (!this.isBrowser) return;

    const canvas = document.createElement('canvas');
    const width = 900;
    const height = 520;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark sleek gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Modern outer neon border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    // Accent top banner
    const bannerGrad = ctx.createLinearGradient(15, 15, width - 15, 15);
    bannerGrad.addColorStop(0, '#38bdf8');
    bannerGrad.addColorStop(0.5, '#818cf8');
    bannerGrad.addColorStop(1, '#c084fc');
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(15, 15, width - 30, 8);

    // ConverterAllAI Branding Header
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('CONVERTERALLAI', 50, 65);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('Official Typing Speed Test Certificate', 50, 90);

    // Date & Mode stamp
    ctx.fillStyle = '#64748b';
    ctx.font = '13px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'right';
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    ctx.fillText(`Date: ${dateStr} | Mode: ${this.mode().toUpperCase()}`, width - 50, 65);
    ctx.fillText(`Verified In-Browser Session`, width - 50, 88);

    // Central Metric Cards
    // 1. WPM Box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(50, 130, 240, 160);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 64px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(this.netWpm()), 170, 220);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('NET WPM (SPEED)', 170, 260);

    // 2. Accuracy Box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(330, 130, 240, 160);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 64px ui-monospace, Consolas, monospace';
    ctx.fillText(`${this.accuracy()}%`, 450, 220);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('ACCURACY', 450, 260);

    // 3. Consistency Box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(610, 130, 240, 160);
    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 64px ui-monospace, Consolas, monospace';
    ctx.fillText(`${this.consistency()}%`, 730, 220);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('CONSISTENCY', 730, 260);

    // Skill Tier Ribbon
    ctx.fillStyle = '#334155';
    ctx.fillRect(50, 320, width - 100, 70);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Tier Rank: ${this.getSkillTier().title}`, 75, 362);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '14px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Raw WPM: ${this.rawWpm()} | Keystrokes: ${this.totalKeystrokes()}`, width - 75, 362);

    // Footer signature
    ctx.fillStyle = '#64748b';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tested live at converterallai.com/typing-speed-test • 100% Free Client-Side WPM Engine', width / 2, 455);

    // Download PNG
    const link = document.createElement('a');
    link.download = `ConverterAllAI-Typing-Scorecard-${this.netWpm()}WPM.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  copyResultText(): void {
    if (!this.isBrowser) return;
    const text = `⌨️ ConverterAllAI Typing Speed Test
🚀 Speed: ${this.netWpm()} Net WPM (Raw: ${this.rawWpm()} WPM)
🎯 Accuracy: ${this.accuracy()}%
📊 Consistency: ${this.consistency()}%
🏆 Rank: ${this.getSkillTier().title}
⏱️ Mode: ${this.mode().toUpperCase()}
Test your speed free at: https://converterallai.com/typing-speed-test`;

    navigator.clipboard.writeText(text).then(() => {
      this.copiedNotification.set(true);
      setTimeout(() => this.copiedNotification.set(false), 2500);
    });
  }

  // ==================== AUDIO SYNTHESIZER ====================

  private getAudioContext(): any {
    if (!this.audioCtx && this.isBrowser) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private playSound(isError: boolean): void {
    if (!this.soundEnabled() || !this.isBrowser) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    if (isError) {
      // Error buzz sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
      return;
    }

    if (this.soundType() === 'typewriter') {
      // Typewriter snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    } else if (this.soundType() === 'softbeep') {
      // Soft gentle blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } else {
      // Mechanical switch click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 250, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.03);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    }
  }

  private playFanfare(): void {
    if (!this.soundEnabled() || !this.isBrowser) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [440, 554, 659, 880];
    const startTime = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.1);
      gain.gain.setValueAtTime(0.12, startTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime + idx * 0.1);
      osc.stop(startTime + idx * 0.1 + 0.25);
    });
  }

  // ==================== STORAGE & HELPERS ====================

  private loadPersonalBest(): void {
    try {
      const val = localStorage.getItem('converterallai_typing_pb');
      if (val) {
        this.personalBest.set(parseInt(val, 10) || 0);
      }
    } catch (e) {}
  }

  private savePersonalBest(pb: number): void {
    try {
      localStorage.setItem('converterallai_typing_pb', String(pb));
    } catch (e) {}
  }

  getSkillTier(): { title: string; badge: string; desc: string; icon: string } {
    const wpm = this.netWpm();
    if (wpm >= 100) return { title: 'Typing Legend', badge: 'LEGEND', desc: 'Top 1% elite keyboard wizard!', icon: '👑' };
    if (wpm >= 80) return { title: 'Pro Typist', badge: 'PRO', desc: 'Superior speed and dexterity!', icon: '🚀' };
    if (wpm >= 60) return { title: 'Speed Demon', badge: 'ADVANCED', desc: 'High-speed professional typist.', icon: '⚡' };
    if (wpm >= 40) return { title: 'Fast Typist', badge: 'INTERMEDIATE', desc: 'Solid above-average proficiency.', icon: '🏃' };
    if (wpm >= 25) return { title: 'Casual Typist', badge: 'CASUAL', desc: 'Steady conversational typing pace.', icon: '🚶' };
    return { title: 'Beginner', badge: 'NOVICE', desc: 'Great start! Regular practice will elevate your speed.', icon: '🐢' };
  }

  toggleFaq(index: number): void {
    this.activeFaqIndex.set(this.activeFaqIndex() === index ? null : index);
  }

  setMode(m: 'time' | 'words' | 'quote' | 'custom' | 'zen'): void {
    this.mode.set(m);
    this.initNewTest();
  }

  setTimeOption(seconds: number): void {
    this.timeOption.set(seconds);
    this.initNewTest();
  }

  setWordsOption(count: number): void {
    this.wordsOption.set(count);
    this.initNewTest();
  }

  setDifficulty(d: 'easy' | 'medium' | 'hard' | 'code'): void {
    this.difficulty.set(d);
    this.initNewTest();
  }

  setLanguage(l: 'english' | 'hinglish'): void {
    this.language.set(l);
    this.initNewTest();
  }

  togglePunctuation(): void {
    this.punctuation.update(p => !p);
    this.initNewTest();
  }

  toggleNumbers(): void {
    this.numbers.update(n => !n);
    this.initNewTest();
  }
}
