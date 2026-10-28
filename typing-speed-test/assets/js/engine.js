/**
 * Typing Speed Test - Pure Typing Engine (Zero External Dependencies)
 * Handles word tokens, keystroke parsing, real-time metrics, timers, and edge cases.
 * Namespace: window.TypeApp.Engine
 */

window.TypeApp = window.TypeApp || {};

(function() {
  class TypingEngine {
    constructor() {
      this.reset();
    }

    reset() {
      this.mode = 'time'; // 'time', 'words', 'quote', 'zen', 'custom'
      this.subMode = 30; // 15, 30, 60, etc.
      this.options = {
        stopOnError: false,
        backspaceMode: 'normal', // 'normal', 'none'
        punctuation: false,
        numbers: false,
        capitalLetters: false,
        difficulty: 'easy',
        language: 'english'
      };

      this.words = []; // Array of word strings
      this.tokenData = []; // [{ original: "word", typed: "", status: "untyped" | "correct" | "error" }]
      this.currentWordIndex = 0;
      this.currentCharIndex = 0;

      this.status = 'idle'; // 'idle', 'running', 'paused', 'finished'
      this.startTime = null;
      this.endTime = null;
      this.elapsedSeconds = 0;
      this.timerInterval = null;

      // Keystroke counters for exact WPM & Accuracy calculation
      this.totalKeystrokes = 0;
      this.correctKeystrokes = 0;
      this.incorrectKeystrokes = 0;
      
      // Tracking characters
      this.correctChars = 0;
      this.incorrectChars = 0;
      this.extraChars = 0;
      this.missedChars = 0;

      // Error analytics
      this.mistypedKeys = {}; // { 'a': 3, 's': 1 }
      this.mistypedWords = {}; // { 'because': 2 }

      // Second-by-second timeline for chart and consistency
      this.timeline = []; // [{ second: 1, wpm: 45, rawWpm: 50, errors: 0 }]
      this.errorsInCurrentSecond = 0;

      // Listeners
      this.listeners = {
        tick: [],
        update: [],
        wordChange: [],
        finish: []
      };
    }

    on(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event].push(callback);
      }
    }

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(data));
      }
    }

    /**
     * Initialize test with words list
     */
    initTest(words, mode = 'time', subMode = 30, options = {}) {
      this.reset();
      this.words = [...words];
      this.mode = mode;
      this.subMode = subMode;
      this.options = { ...this.options, ...options };

      this.tokenData = this.words.map(w => ({
        original: w,
        typed: '',
        status: 'untyped',
        hasError: false
      }));

      this.status = 'idle';
      this.emit('update', this.getState());
    }

    start() {
      if (this.status === 'running') return;
      this.status = 'running';
      this.startTime = performance.now();
      this.elapsedSeconds = 0;
      this.timeline = [];
      this.errorsInCurrentSecond = 0;

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => this.handleTimerTick(), 1000);
    }

    handleTimerTick() {
      if (this.status !== 'running') return;

      this.elapsedSeconds += 1;
      const metrics = this.calculateMetrics();

      this.timeline.push({
        second: this.elapsedSeconds,
        wpm: metrics.netWpm,
        rawWpm: metrics.rawWpm,
        errors: this.errorsInCurrentSecond
      });
      this.errorsInCurrentSecond = 0;

      this.emit('tick', {
        elapsedSeconds: this.elapsedSeconds,
        remainingSeconds: this.getRemainingSeconds(),
        metrics: metrics
      });

      // Time mode expiration
      if (this.mode === 'time' && this.elapsedSeconds >= Number(this.subMode)) {
        this.finish();
      }
    }

    getRemainingSeconds() {
      if (this.mode === 'time') {
        const total = Number(this.subMode) || 30;
        return Math.max(0, total - this.elapsedSeconds);
      }
      return this.elapsedSeconds;
    }

    /**
     * Main keystroke processor
     */
    handleInput(key, ctrlKey = false) {
      if (this.status === 'finished') return;

      if (this.status === 'idle') {
        this.start();
      }

      const currentToken = this.tokenData[this.currentWordIndex];
      if (!currentToken) return;

      const expectedWord = currentToken.original;
      const typed = currentToken.typed;

      // Handle Backspace
      if (key === 'Backspace') {
        if (this.options.backspaceMode === 'none') {
          return; // Backspace disabled in Hard/None mode
        }

        if (ctrlKey) {
          // Delete entire current word
          currentToken.typed = '';
        } else if (typed.length > 0) {
          currentToken.typed = typed.slice(0, -1);
        } else if (this.currentWordIndex > 0) {
          // Allow going back to previous word if backspace pressed at start of word
          const prevToken = this.tokenData[this.currentWordIndex - 1];
          if (prevToken && prevToken.hasError) {
            this.currentWordIndex--;
          }
        }
        this.emit('update', this.getState());
        return;
      }

      // Handle Space (Word completion)
      if (key === ' ' || key === 'Spacebar') {
        if (typed.length === 0) return; // Prevent multiple empty spaces

        // If stopOnError is enabled and word has errors, cannot proceed!
        if (this.options.stopOnError && typed !== expectedWord) {
          this.recordMistake(expectedWord, 'space');
          this.emit('update', this.getState());
          return;
        }

        this.totalKeystrokes++;
        const isExactMatch = typed === expectedWord;

        if (isExactMatch) {
          currentToken.status = 'correct';
          this.correctKeystrokes++;
        } else {
          currentToken.status = 'error';
          currentToken.hasError = true;
          this.incorrectKeystrokes++;
          this.recordMistake(expectedWord, ' ');
        }

        this.currentWordIndex++;
        this.emit('wordChange', {
          index: this.currentWordIndex,
          total: this.tokenData.length
        });

        // Words mode or Quote/Custom mode end check
        if (this.mode === 'words' && this.currentWordIndex >= Number(this.subMode)) {
          this.finish();
          return;
        }

        if ((this.mode === 'quote' || this.mode === 'custom') && this.currentWordIndex >= this.tokenData.length) {
          this.finish();
          return;
        }

        this.emit('update', this.getState());
        return;
      }

      // Handle regular printable character
      if (key.length === 1) {
        this.totalKeystrokes++;
        const targetChar = expectedWord[typed.length];

        // Check if Stop On Error prevents typing further when current typed is wrong
        if (this.options.stopOnError && typed.length >= expectedWord.length) {
          // Already longer than expected and stopOnError is on
          this.recordMistake(expectedWord, key);
          this.emit('update', this.getState());
          return;
        }

        if (targetChar === key) {
          this.correctKeystrokes++;
        } else {
          this.incorrectKeystrokes++;
          this.recordMistake(expectedWord, key, targetChar);
          currentToken.hasError = true;
        }

        currentToken.typed += key;

        // Quote/Custom single last word completion check (if typed reaches end without space)
        if ((this.mode === 'quote' || this.mode === 'custom') && 
            this.currentWordIndex === this.tokenData.length - 1 &&
            currentToken.typed === expectedWord) {
          currentToken.status = 'correct';
          this.finish();
          return;
        }

        this.emit('update', this.getState());
      }
    }

    recordMistake(word, keyTyped, expectedKey = '') {
      this.errorsInCurrentSecond++;
      if (expectedKey) {
        this.mistypedKeys[expectedKey] = (this.mistypedKeys[expectedKey] || 0) + 1;
      }
      this.mistypedWords[word] = (this.mistypedWords[word] || 0) + 1;
    }

    /**
     * Compute all character categories accurately:
     * - correctChars
     * - incorrectChars
     * - extraChars
     * - missedChars
     */
    computeCharacterStats() {
      let correct = 0;
      let incorrect = 0;
      let extra = 0;
      let missed = 0;

      for (let i = 0; i < this.tokenData.length; i++) {
        const token = this.tokenData[i];
        if (i < this.currentWordIndex || (i === this.currentWordIndex && token.typed.length > 0)) {
          const expected = token.original;
          const typed = token.typed;
          const minLen = Math.min(expected.length, typed.length);

          for (let c = 0; c < minLen; c++) {
            if (typed[c] === expected[c]) {
              correct++;
            } else {
              incorrect++;
            }
          }

          if (typed.length > expected.length) {
            extra += (typed.length - expected.length);
          } else if (i < this.currentWordIndex && typed.length < expected.length) {
            missed += (expected.length - typed.length);
          }

          // Count space between completed words as correct if word was completed
          if (i < this.currentWordIndex) {
            if (token.status === 'correct') {
              correct++;
            } else {
              incorrect++;
            }
          }
        }
      }

      this.correctChars = correct;
      this.incorrectChars = incorrect;
      this.extraChars = extra;
      this.missedChars = missed;

      return { correct, incorrect, extra, missed };
    }

    /**
     * Official Typing Formulas:
     * Gross WPM = (all typed characters / 5) / minutes
     * Net WPM = ((correct characters / 5) / minutes)
     * Accuracy % = (correct keystrokes / total keystrokes) * 100
     * Consistency % = (1 - (StdDev of per-second WPM / Mean of per-second WPM)) * 100
     */
    calculateMetrics() {
      const now = performance.now();
      const elapsedMs = this.startTime ? (now - this.startTime) : 0;
      const minutes = Math.max(0.001, elapsedMs / 60000);

      this.computeCharacterStats();

      const allTypedChars = this.correctChars + this.incorrectChars + this.extraChars;
      const rawWpm = Math.max(0, Math.round((allTypedChars / 5) / minutes));
      const netWpm = Math.max(0, Math.round((this.correctChars / 5) / minutes));
      const grossWpm = rawWpm;

      const accuracy = this.totalKeystrokes > 0
        ? Math.max(0, Math.min(100, Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100)))
        : 100;

      // Consistency Calculation
      const consistency = this.calculateConsistency();

      return {
        netWpm,
        grossWpm,
        rawWpm,
        accuracy,
        consistency,
        characters: {
          correct: this.correctChars,
          incorrect: this.incorrectChars,
          extra: this.extraChars,
          missed: this.missedChars,
          total: allTypedChars
        },
        keystrokes: {
          total: this.totalKeystrokes,
          correct: this.correctKeystrokes,
          incorrect: this.incorrectKeystrokes
        },
        durationSeconds: Math.round(elapsedMs / 1000)
      };
    }

    calculateConsistency() {
      if (this.timeline.length < 2) return 100;
      const wpms = this.timeline.map(t => t.wpm);
      const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      if (mean === 0) return 100;

      const variance = wpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / mean; // Coefficient of variation

      const consistency = Math.max(0, Math.min(100, Math.round(100 * (1 - cv))));
      return consistency;
    }

    finish() {
      if (this.status === 'finished') return;
      this.status = 'finished';
      this.endTime = performance.now();
      clearInterval(this.timerInterval);

      // Final tick record
      const finalMetrics = this.calculateMetrics();
      if (this.timeline.length === 0 || this.timeline[this.timeline.length - 1].second !== this.elapsedSeconds) {
        this.timeline.push({
          second: Math.max(1, this.elapsedSeconds),
          wpm: finalMetrics.netWpm,
          rawWpm: finalMetrics.rawWpm,
          errors: this.errorsInCurrentSecond
        });
      }

      this.emit('finish', {
        metrics: finalMetrics,
        timeline: this.timeline,
        mistypedKeys: this.mistypedKeys,
        mistypedWords: this.mistypedWords,
        mode: this.mode,
        subMode: this.subMode
      });
    }

    pause() {
      if (this.status === 'running') {
        this.status = 'paused';
        clearInterval(this.timerInterval);
        this.emit('update', this.getState());
      }
    }

    resume() {
      if (this.status === 'paused') {
        this.status = 'running';
        this.timerInterval = setInterval(() => this.handleTimerTick(), 1000);
        this.emit('update', this.getState());
      }
    }

    getState() {
      return {
        status: this.status,
        mode: this.mode,
        subMode: this.subMode,
        tokenData: this.tokenData,
        currentWordIndex: this.currentWordIndex,
        elapsedSeconds: this.elapsedSeconds,
        remainingSeconds: this.getRemainingSeconds(),
        metrics: this.calculateMetrics()
      };
    }
  }

  window.TypeApp.Engine = TypingEngine;
})();
