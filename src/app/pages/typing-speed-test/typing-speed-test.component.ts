import { Component, OnInit, OnDestroy, signal, computed, ElementRef, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { insertedText, wordsPerMinute } from '../typing-input';
import {
  EASY_ENGLISH_WORDS,
  QUOTES,
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
  imports: [CommonModule, RouterModule],
  templateUrl: './typing-speed-test.component.html',
  styleUrls: ['./typing-speed-test.component.css']
})
export class TypingSpeedTestComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenInput') hiddenInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('typingContainer') typingContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('resultsHeading') private resultsHeading?: ElementRef<HTMLElement>;
  @ViewChild('chartCanvas') chartCanvasRef?: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);

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
  soundEnabled = signal<boolean>(false);
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
  consistency = signal<number | null>(null);
  consistencyLabel = computed(() => {
    const value = this.consistency();
    return value === null ? '—' : `${value}%`;
  });
  totalKeystrokes = signal<number>(0);
  correctKeystrokes = signal<number>(0);
  incorrectKeystrokes = signal<number>(0);
  extraCharsCount = signal<number>(0);

  // Results & History
  timeline: TimelinePoint[] = [];
  mistypedWords = signal<string[]>([]);
  mistypedKeys = signal<Record<string, number>>({});
  frequentErrors = computed(() => Object.entries(this.mistypedKeys())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8));
  personalBest = signal<number>(0);
  isNewPersonalBest = signal<boolean>(false);
  copyFeedback = signal('');
  customError = signal('');
  visibleWords = computed(() => {
    const index = this.currentWordIndex();
    return this.words().slice(Math.max(0, index - 12), index + 55);
  });
  activeWord = computed(() => this.words()[this.currentWordIndex()]?.original ?? '');

  // Audio Context (Synthesizer)
  private audioCtx: any = null;
  private timerInterval?: ReturnType<typeof setInterval>;
  private startedAt = 0;
  private completedCorrect = 0;
  private completedMistakes = 0;
  private completedExtra = 0;
  private testTokens: string[] = [];
  private resultFrame?: number;

  ngOnInit(): void {
    // Keep the initial passage identical in the prerender and the hydrated editor.
    this.resetTest(EASY_ENGLISH_WORDS.slice(0, 120));
    if (this.isBrowser) this.loadPersonalBest();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.resultFrame !== undefined) cancelAnimationFrame(this.resultFrame);
    if (this.audioCtx) {
      try {
        void this.audioCtx.close().catch(() => {});
      } catch (e) {}
    }
  }

  // ==================== TEST INITIALIZATION ====================

  initNewTest(focus = false): void {
    this.customError.set('');
    let tokens: string[];
    this.currentQuoteAuthor.set('');
    if (this.mode() === 'custom') {
      const source = this.customText().trim();
      if (!source) {
        this.customError.set('Enter a passage before starting custom practice.');
        return;
      }
      tokens = source.split(/\s+/);
    } else if (this.mode() === 'quote') {
      const quotes = QUOTES.filter((quote) => quote.category === this.quoteLength());
      const selected = quotes[Math.floor(Math.random() * quotes.length)] ?? QUOTES[0];
      this.currentQuoteAuthor.set(selected.author);
      tokens = selected.text.split(/\s+/);
    } else {
      tokens = this.generateWords(this.mode() === 'words' ? this.wordsOption() : 120);
    }
    this.resetTest(tokens);
    if (focus) this.focusInput();
  }

  private generateWords(count: number): string[] {
    return generateTestTokens({
      count,
      difficulty: this.difficulty(),
      language: this.language(),
      punctuation: this.punctuation(),
      numbers: this.numbers(),
    });
  }

  private toWord(original: string, isCurrent = false): WordData {
    return {
      original,
      typed: '',
      isCurrent,
      isCompleted: false,
      isCorrect: false,
      chars: original.split('').map((char) => ({ char, state: 'untyped' })),
    };
  }

  private resetTest(tokens: string[]): void {
    this.stopTimer();
    if (this.resultFrame !== undefined) cancelAnimationFrame(this.resultFrame);
    this.testTokens = tokens;
    this.testStatus.set('idle');
    this.elapsedSeconds.set(0);
    this.timeLeft.set(this.mode() === 'time' ? this.timeOption() : 0);
    this.netWpm.set(0);
    this.rawWpm.set(0);
    this.accuracy.set(100);
    this.consistency.set(null);
    this.totalKeystrokes.set(0);
    this.correctKeystrokes.set(0);
    this.incorrectKeystrokes.set(0);
    this.extraCharsCount.set(0);
    this.currentWordIndex.set(0);
    this.setInput('');
    this.words.set(tokens.map((word, index) => this.toWord(word, index === 0)));
    this.timeline = [];
    this.completedCorrect = 0;
    this.completedMistakes = 0;
    this.completedExtra = 0;
    this.mistypedWords.set([]);
    this.mistypedKeys.set({});
    this.isNewPersonalBest.set(false);
    this.copyFeedback.set('');
    if (this.typingContainerRef) this.typingContainerRef.nativeElement.scrollTop = 0;
  }

  repeatSameTest(): void {
    this.resetTest(this.testTokens);
    this.focusInput();
  }

  finishZen(): void {
    if (this.mode() === 'zen') this.finishTest();
  }

  focusInput(): void {
    this.hiddenInputRef?.nativeElement.focus({ preventScroll: true });
  }

  onHiddenInputKeydown(event: KeyboardEvent): void {
    if (event.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.initNewTest(true);
    } else if (event.key === 'Enter' && this.currentInput() && this.isLastFiniteWord()) {
      event.preventDefault();
      if (!this.syncClock()) this.commitCurrentWord(false);
    }
  }

  onHiddenInputChange(event: Event): void {
    if ((event as InputEvent).isComposing || this.testStatus() === 'finished') return;
    const field = event.target as HTMLInputElement;
    const [value] = field.value.split(/\s+/);
    const hasSpace = value.length < field.value.length;
    const previous = this.currentInput();
    if (this.testStatus() === 'idle') {
      if (!value) {
        this.setInput('');
        return;
      }
      this.startTest();
    }
    if (this.syncClock()) {
      this.setInput(previous);
      return;
    }

    const word = this.words()[this.currentWordIndex()];
    const { text, start } = insertedText(previous, value);
    const keys = { ...this.mistypedKeys() };
    let errors = 0;
    for (let index = 0; index < text.length; index++) {
      const expected = word.original[start + index];
      if (text[index] !== expected) {
        errors++;
        if (expected) keys[expected] = (keys[expected] ?? 0) + 1;
      }
    }
    this.totalKeystrokes.update((count) => count + text.length);
    this.correctKeystrokes.update((count) => count + text.length - errors);
    if (errors) this.mistypedKeys.set(keys);
    if (text.length) this.playSound(errors > 0);
    this.setInput(value);
    this.updateCurrentWordVisuals(value);

    if (hasSpace && value) {
      if (!this.isLastFiniteWord()) {
        this.totalKeystrokes.update((count) => count + 1);
        this.correctKeystrokes.update((count) => count + 1);
      }
      this.commitCurrentWord(!this.isLastFiniteWord());
    } else if (value === word.original && this.isLastFiniteWord()) {
      this.commitCurrentWord(false);
    } else {
      this.calculateLiveMetrics();
    }
  }

  private setInput(value: string): void {
    this.currentInput.set(value);
    const field = this.hiddenInputRef?.nativeElement;
    if (field && field.value !== value) field.value = value;
  }

  private isLastFiniteWord(): boolean {
    return this.mode() !== 'time' && this.mode() !== 'zen' &&
      this.currentWordIndex() === this.words().length - 1;
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
  }

  private commitCurrentWord(separator: boolean): void {
    const list = this.words().slice();
    const index = this.currentWordIndex();
    const word = list[index];
    const exact = word.typed === word.original;
    const { correct, mistakes, extra } = this.countWord(word);
    this.completedCorrect += correct + (separator && exact ? 1 : 0);
    this.completedMistakes += mistakes + (separator && !exact ? 1 : 0);
    this.completedExtra += extra;
    if (!exact && !this.mistypedWords().includes(word.original)) {
      this.mistypedWords.update((words) => [...words, word.original]);
    }

    list[index] = { ...word, isCompleted: true, isCurrent: false, isCorrect: exact };
    let nextIndex = index + 1;
    if (this.mode() === 'zen' && nextIndex >= 180) {
      list.splice(0, nextIndex - 12);
      nextIndex = 12;
    }
    this.currentWordIndex.set(nextIndex);
    this.setInput('');
    if ((this.mode() === 'time' || this.mode() === 'zen') && list.length - nextIndex < 20) {
      list.push(...this.generateWords(60).map((token) => this.toWord(token)));
    }

    if (nextIndex < list.length) {
      list[nextIndex] = { ...list[nextIndex], isCurrent: true };
      this.words.set(list);
      this.calculateLiveMetrics();
      requestAnimationFrame(() => this.scrollToActiveWord());
    } else {
      this.words.set(list);
      this.finishTest();
    }
  }

  private scrollToActiveWord(): void {
    const stage = this.typingContainerRef?.nativeElement;
    const active = stage?.querySelector<HTMLElement>('.word-wrapper.active');
    if (!stage || !active) return;
    const bounds = stage.getBoundingClientRect();
    const word = active.getBoundingClientRect();
    if (word.bottom > bounds.bottom || word.top < bounds.top) {
      stage.scrollTop += word.top - bounds.top - 12;
    }
  }

  private startTest(): void {
    this.startedAt = performance.now();
    this.testStatus.set('running');
    this.timerInterval = setInterval(() => {
      if (this.syncClock()) return;
      this.calculateLiveMetrics();
      this.recordTimelinePoint();
    }, 200);
  }

  private elapsed(): number {
    const elapsed = Math.max(0, (performance.now() - this.startedAt) / 1000);
    return this.mode() === 'time' ? Math.min(elapsed, this.timeOption()) : elapsed;
  }

  private syncClock(): boolean {
    const elapsed = this.elapsed();
    this.elapsedSeconds.set(Math.floor(elapsed));
    if (this.mode() === 'time') {
      this.timeLeft.set(Math.ceil(this.timeOption() - elapsed));
      if (elapsed >= this.timeOption()) {
        this.finishTest();
        return true;
      }
    }
    return false;
  }

  private stopTimer(): void {
    clearInterval(this.timerInterval);
    this.timerInterval = undefined;
  }

  private countWord(word: WordData | undefined): { correct: number; mistakes: number; extra: number } {
    let correct = 0;
    let mistakes = 0;
    let extra = 0;
    for (const char of word?.chars ?? []) {
      if (char.state === 'correct') correct++;
      else if (char.state === 'wrong') mistakes++;
      else if (char.state === 'extra') extra++;
    }
    return { correct, mistakes, extra };
  }

  private calculateLiveMetrics(): void {
    const elapsed = this.elapsed();
    const active = this.countWord(this.words()[this.currentWordIndex()]);
    const correct = this.completedCorrect + active.correct;
    const mistakes = this.completedMistakes + active.mistakes;
    const extra = this.completedExtra + active.extra;
    this.rawWpm.set(wordsPerMinute(correct + mistakes + extra, elapsed));
    this.netWpm.set(wordsPerMinute(correct, elapsed));
    this.accuracy.set(this.totalKeystrokes() ? Math.round(100 * this.correctKeystrokes() / this.totalKeystrokes()) : 100);
    this.extraCharsCount.set(extra);
    this.incorrectKeystrokes.set(mistakes + extra);
  }

  private recordTimelinePoint(): void {
    const sec = this.elapsedSeconds();
    if (!sec || this.timeline.at(-1)?.second === sec) return;
    if (this.timeline.length >= 600) this.timeline.shift();
    this.timeline.push({
      second: sec,
      wpm: this.netWpm(),
      rawWpm: this.rawWpm(),
      errors: this.incorrectKeystrokes()
    });
  }

  private computeConsistency(): number | null {
    if (this.timeline.length < 3) return null;
    const wpms = this.timeline.map(t => t.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    if (mean === 0) return null;
    const variance = wpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    return Math.max(10, Math.min(100, Math.round(100 - cv)));
  }

  private finishTest(): void {
    if (this.testStatus() !== 'running') return;
    this.stopTimer();
    this.elapsedSeconds.set(Math.floor(this.elapsed()));
    this.calculateLiveMetrics();
    this.recordTimelinePoint();
    this.testStatus.set('finished');
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
    this.resultFrame = requestAnimationFrame(() => {
      this.resultFrame = undefined;
      this.renderSpeedChart();
      this.resultsHeading?.nativeElement.focus({ preventScroll: true });
    });
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
      ctx.fillText('Too few samples to draw a speed chart.', width / 2, height / 2);
      return;
    }

    const pad = { top: 25, right: 35, bottom: 35, left: 45 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const maxWpm = Math.max(...data.map(d => d.rawWpm || d.wpm), 30);
    const maxY = Math.ceil(maxWpm / 15) * 15;
    const firstSecond = data[0].second;
    const lastSecond = data[data.length - 1].second;

    const getX = (sec: number) => pad.left + ((sec - firstSecond) / Math.max(lastSecond - firstSecond, 1)) * chartW;
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
    ctx.fillText('Typing Speed Test Scorecard', 50, 90);

    // Date & Mode stamp
    ctx.fillStyle = '#64748b';
    ctx.font = '13px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'right';
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    ctx.fillText(`Date: ${dateStr} | Mode: ${this.mode().toUpperCase()}`, width - 50, 65);
    ctx.fillText(`Browser practice result`, width - 50, 88);

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
    ctx.fillText(this.consistencyLabel(), 730, 220);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('CONSISTENCY', 730, 260);

    // Skill Tier Ribbon
    ctx.fillStyle = '#334155';
    ctx.fillRect(50, 320, width - 100, 70);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Elapsed: ${this.elapsedSeconds()}s`, 75, 362);

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
📊 Consistency: ${this.consistencyLabel()}
⏱️ Mode: ${this.mode().toUpperCase()}
Test your speed free at: https://converterallai.com/typing-speed-test`;

    if (!navigator.clipboard) {
      this.copyFeedback.set('Clipboard unavailable. You can download the scorecard instead.');
      return;
    }
    void navigator.clipboard.writeText(text).then(
      () => this.copyFeedback.set('Result copied.'),
      () => this.copyFeedback.set('Clipboard unavailable. You can download the scorecard instead.'),
    );
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
      void this.audioCtx.resume().catch(() => {});
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

  setMode(m: 'time' | 'words' | 'quote' | 'custom' | 'zen'): void {
    this.mode.set(m);
    if (m === 'custom' && !this.customText().trim()) {
      this.resetTest([]);
      return;
    }
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
    if (this.difficulty() === 'code') this.difficulty.set('easy');
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
