import { Component, signal, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typing-test',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './typing-test.component.html',
  styleUrls: ['./typing-test.component.css']
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
