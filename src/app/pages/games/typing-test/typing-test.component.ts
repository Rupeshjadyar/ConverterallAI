import { Component, signal, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typing-test',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="typing-container">
      
      <div class="game-header">
        <div class="header-left">
          <a routerLink="/games" class="back-link">← All Games</a>
          <h1 class="game-title">Speed Typing Test Pro ⌨️</h1>
        </div>

        <div class="header-controls">
          <div class="duration-pills">
            <button *ngFor="let d of [15, 30, 60]" 
                    class="btn-pill" 
                    [class.active-pill]="duration() === d"
                    (click)="setDuration(d)">
              {{ d }}s
            </button>
          </div>
          <button (click)="restartTest()" class="btn-top">🔄 New Test</button>
        </div>
      </div>

      <div class="typing-arena">
        
        <!-- Live Benchmark Stats -->
        <div class="stats-ribbon glass">
          <div class="stat-box">
            <span class="stat-num text-purple">{{ liveWPM() }}</span>
            <span class="stat-lbl">WPM (Words/Min)</span>
          </div>
          <div class="stat-box">
            <span class="stat-num text-cyan">{{ accuracy() }}%</span>
            <span class="stat-lbl">Accuracy</span>
          </div>
          <div class="stat-box">
            <span class="stat-num text-amber">{{ timeLeft() }}s</span>
            <span class="stat-lbl">Time Left</span>
          </div>
          <div class="stat-box">
            <span class="stat-num text-red">{{ errorCount() }}</span>
            <span class="stat-lbl">Errors</span>
          </div>
        </div>

        <!-- Typing Test Card -->
        <div class="typing-card glass" (click)="focusInput()">
          <div class="text-display" #textContainer>
            <span *ngFor="let ch of targetChars; let i = index" 
                  class="char-span" 
                  [ngClass]="getCharClass(i)">
              {{ ch }}
            </span>
          </div>

          <!-- Hidden active input capturing strokes -->
          <input 
            #hiddenInput
            type="text" 
            class="hidden-input"
            [(ngModel)]="userInput"
            (input)="onInput()"
            [disabled]="isFinished()"
            autofocus
          />
        </div>

        <div class="typing-tip">
          <span>💡 Click the box above or start typing. Timer begins automatically on your first keystroke!</span>
        </div>

        <!-- Results Summary Modal -->
        <div *ngIf="isFinished()" class="results-modal glass">
          <div class="results-box">
            <div class="result-badge">{{ getPerformanceBadge() }}</div>
            <h2>🎉 Typing Test Completed!</h2>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <span class="metric-val text-purple">{{ finalWPM() }}</span>
                <span class="metric-name">Net WPM</span>
              </div>
              <div class="metric-card">
                <span class="metric-val text-cyan">{{ accuracy() }}%</span>
                <span class="metric-name">Accuracy</span>
              </div>
              <div class="metric-card">
                <span class="metric-val text-green">{{ rawCPM() }}</span>
                <span class="metric-name">Chars/Min (CPM)</span>
              </div>
              <div class="metric-card">
                <span class="metric-val text-red">{{ errorCount() }}</span>
                <span class="metric-name">Mistakes</span>
              </div>
            </div>

            <button (click)="restartTest()" class="btn-play-again">Take Test Again ➔</button>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .typing-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: inherit;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .back-link {
      font-size: 0.85rem;
      color: #a78bfa;
      text-decoration: none;
      font-weight: 700;
      margin-bottom: 0.25rem;
      display: inline-block;
    }

    .game-title {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--text-color, #fff);
      margin: 0;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .duration-pills {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 3px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-pill {
      padding: 0.35rem 0.75rem;
      border-radius: 9px;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-weight: 800;
      font-size: 0.82rem;
      cursor: pointer;
    }

    .btn-pill.active-pill {
      background: #8b5cf6;
      color: #fff;
    }

    .btn-top {
      padding: 0.45rem 1rem;
      border-radius: 10px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
    }

    /* Stats Ribbon */
    .stats-ribbon {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-radius: 18px;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .stat-num {
      font-size: 1.8rem;
      font-weight: 900;
      display: block;
      line-height: 1.1;
    }

    .stat-lbl {
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .text-purple { color: #c084fc; }
    .text-cyan { color: #38bdf8; }
    .text-amber { color: #fbbf24; }
    .text-red { color: #f87171; }
    .text-green { color: #4ade80; }

    /* Typing Card */
    .typing-card {
      position: relative;
      padding: 2rem;
      border-radius: 20px;
      min-height: 200px;
      cursor: text;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
      margin-bottom: 1rem;
    }

    .text-display {
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: clamp(1.15rem, 2.8vw, 1.45rem);
      line-height: 1.7;
      user-select: none;
    }

    .char-span {
      position: relative;
      color: #64748b;
      transition: color 0.1s;
    }

    .char-correct {
      color: #4ade80;
    }

    .char-wrong {
      color: #f87171;
      background: rgba(239, 68, 68, 0.2);
      border-radius: 3px;
    }

    .char-current {
      color: #fff;
      border-bottom: 3px solid #8b5cf6;
      animation: cursorBlink 0.8s infinite;
    }

    @keyframes cursorBlink {
      0%, 100% { border-color: #8b5cf6; }
      50% { border-color: transparent; }
    }

    .hidden-input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .typing-tip {
      font-size: 0.82rem;
      color: #94a3b8;
      text-align: center;
    }

    /* Results Modal */
    .results-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2.5rem;
      border-radius: 24px;
      text-align: center;
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      z-index: 1000;
      max-width: 480px;
      width: 90%;
    }

    .result-badge {
      display: inline-block;
      padding: 0.25rem 0.8rem;
      border-radius: 99px;
      background: rgba(139, 92, 246, 0.25);
      border: 1px solid #8b5cf6;
      color: #c4b5fd;
      font-size: 0.78rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }

    .results-box h2 {
      font-size: 1.6rem;
      font-weight: 900;
      color: #fff;
      margin-bottom: 1.5rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.04);
      padding: 1rem;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .metric-val {
      font-size: 1.8rem;
      font-weight: 900;
      display: block;
    }

    .metric-name {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 700;
    }

    .btn-play-again {
      padding: 0.75rem 2rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 800;
      font-size: 1rem;
      border: none;
      cursor: pointer;
    }
  `]
})
export class TypingTestComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenInput') inputRef!: ElementRef<HTMLInputElement>;

  duration = signal<number>(30);
  timeLeft = signal<number>(30);
  liveWPM = signal<number>(0);
  finalWPM = signal<number>(0);
  rawCPM = signal<number>(0);
  accuracy = signal<number>(100);
  errorCount = signal<number>(0);
  isFinished = signal<boolean>(false);

  userInput = '';
  targetText = '';
  targetChars: string[] = [];

  private timer: any;
  private isStarted = false;
  private startTime = 0;

  private sampleTexts = [
    "Technology is constantly transforming our digital world with high performance artificial intelligence and scalable software systems.",
    "Fast typing requires consistent rhythm and muscle memory. Keep your eyes on the screen and let your fingers glide smoothly over the keys.",
    "Computer programming is the art of expressing algorithms logically to solve complex human challenges and create interactive applications.",
    "The quick brown fox jumps over the lazy dog while engineering modern web experiences using standalone Angular components and WebGPU."
  ];

  ngOnInit() {
    this.restartTest();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  setDuration(d: number) {
    this.duration.set(d);
    this.restartTest();
  }

  restartTest() {
    if (this.timer) clearInterval(this.timer);
    this.isStarted = false;
    this.isFinished.set(false);
    this.userInput = '';
    this.timeLeft.set(this.duration());
    this.liveWPM.set(0);
    this.accuracy.set(100);
    this.errorCount.set(0);

    // Pick random text
    this.targetText = this.sampleTexts[Math.floor(Math.random() * this.sampleTexts.length)];
    this.targetChars = this.targetText.split('');

    setTimeout(() => this.focusInput(), 100);
  }

  focusInput() {
    if (this.inputRef && !this.isFinished()) {
      this.inputRef.nativeElement.focus();
    }
  }

  onInput() {
    if (!this.isStarted && this.userInput.length > 0) {
      this.isStarted = true;
      this.startTime = Date.now();
      this.timer = setInterval(() => {
        this.timeLeft.update(t => {
          if (t <= 1) {
            this.finishTest();
            return 0;
          }
          this.calculateLiveStats();
          return t - 1;
        });
      }, 1000);
    }

    this.calculateLiveStats();

    if (this.userInput.length >= this.targetText.length) {
      this.finishTest();
    }
  }

  calculateLiveStats() {
    let errors = 0;
    const inputLen = this.userInput.length;

    for (let i = 0; i < inputLen; i++) {
      if (this.userInput[i] !== this.targetText[i]) errors++;
    }
    this.errorCount.set(errors);

    const elapsedMin = Math.max(0.01, (Date.now() - this.startTime) / 60000);
    const wordsTyped = (inputLen - errors) / 5;
    const wpm = Math.max(0, Math.round(wordsTyped / elapsedMin));
    this.liveWPM.set(wpm);

    const acc = inputLen > 0 ? Math.max(0, Math.round(((inputLen - errors) / inputLen) * 100)) : 100;
    this.accuracy.set(acc);
  }

  finishTest() {
    if (this.timer) clearInterval(this.timer);
    this.isFinished.set(true);

    const elapsedMin = Math.max(0.01, (this.duration() - this.timeLeft()) / 60);
    const correctChars = Math.max(0, this.userInput.length - this.errorCount());
    const finalWpm = Math.max(0, Math.round((correctChars / 5) / elapsedMin));
    const cpm = Math.round(this.userInput.length / elapsedMin);

    this.finalWPM.set(finalWpm);
    this.rawCPM.set(cpm);
  }

  getCharClass(index: number): string {
    if (index < this.userInput.length) {
      return this.userInput[index] === this.targetChars[index] ? 'char-correct' : 'char-wrong';
    }
    if (index === this.userInput.length) {
      return 'char-current';
    }
    return '';
  }

  getPerformanceBadge(): string {
    const w = this.finalWPM();
    if (w >= 80) return '⚡ Grandmaster Speed (Top 1%)';
    if (w >= 60) return '🚀 Pro Typist (Top 10%)';
    if (w >= 40) return '⭐ Fast Average';
    return '👍 Good Effort - Keep Practicing!';
  }
}
