/**
 * Typing Speed Test - Main UI Controller
 * Orchestrates DOM, Engine, Sounds, Caret, and Result Views.
 * Namespace: window.TypeApp.Main
 */

window.TypeApp = window.TypeApp || {};

(function() {
  let engine = null;
  let currentWordsList = [];
  let currentResult = null;

  // DOM Elements
  let wordsContainer = null;
  let wordsTrack = null;
  let caretEl = null;
  let focusOverlay = null;
  let mobileInput = null;
  let typingWrapper = null;
  
  // Live stats DOM
  let liveStatsEl = null;
  let statWpmEl = null;
  let statAccEl = null;
  let statTimerEl = null;

  // Result Screen DOM
  let testViewEl = null;
  let resultViewEl = null;
  let chartCanvas = null;

  function getSkillLabel(wpm) {
    if (wpm < 25) return { label: 'Beginner', color: '#94a3b8' };
    if (wpm < 45) return { label: 'Intermediate', color: '#38bdf8' };
    if (wpm < 70) return { label: 'Advanced', color: '#52b788' };
    if (wpm < 100) return { label: 'Pro', color: '#bb9af7' };
    return { label: 'Legend', color: '#f59e0b' };
  }

  const Main = {
    init() {
      // Initialize references
      wordsContainer = document.getElementById('words-container');
      wordsTrack = document.getElementById('words-track');
      caretEl = document.getElementById('caret');
      focusOverlay = document.getElementById('focus-overlay');
      mobileInput = document.getElementById('mobile-input');
      typingWrapper = document.getElementById('typing-wrapper');

      liveStatsEl = document.getElementById('live-stats');
      statWpmEl = document.getElementById('stat-wpm');
      statAccEl = document.getElementById('stat-acc');
      statTimerEl = document.getElementById('stat-timer');

      testViewEl = document.getElementById('test-view');
      resultViewEl = document.getElementById('result-view');
      chartCanvas = document.getElementById('result-chart');

      // Instantiate engine
      engine = new window.TypeApp.Engine();
      engine.on('tick', data => this.onEngineTick(data));
      engine.on('update', state => this.onEngineUpdate(state));
      engine.on('wordChange', data => this.onWordChange(data));
      engine.on('finish', data => this.onEngineFinish(data));

      this.bindEvents();
      this.bindConfigButtons();

      // Check if arriving from "Practice Weak Keys" on stats page
      const practiceText = sessionStorage.getItem('tst_practice_text');
      if (practiceText && window.location.search.includes('practice=weak')) {
        sessionStorage.removeItem('tst_practice_text');
        const tokens = practiceText.split(/\s+/).filter(Boolean);
        this.startNewTest(tokens);
      } else {
        this.startNewTest();
      }
    },

    bindEvents() {
      // Focus handling
      document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));

      if (typingWrapper) {
        typingWrapper.addEventListener('click', () => {
          this.focusTypingArea();
        });
      }

      if (focusOverlay) {
        focusOverlay.addEventListener('click', () => {
          this.focusTypingArea();
        });
      }

      // Mobile hidden input
      if (mobileInput) {
        mobileInput.addEventListener('input', (e) => {
          const val = mobileInput.value;
          if (val) {
            const char = val.slice(-1);
            engine.handleInput(char);
            if (window.TypeApp.Sound) window.TypeApp.Sound.playKey();
            mobileInput.value = '';
          }
        });
      }

      // Anti-Cheat: Block Paste & Drop
      if (wordsContainer) {
        wordsContainer.addEventListener('paste', (e) => {
          e.preventDefault();
          this.showToast('Pasting text is disabled during typing test!');
        });
        wordsContainer.addEventListener('drop', (e) => {
          e.preventDefault();
        });
      }

      // Window Blur / Pause
      window.addEventListener('blur', () => {
        if (engine.status === 'running') {
          engine.pause();
          this.showFocusOverlay(true);
        }
      });

      // Quick Restart buttons
      const restartBtn = document.getElementById('btn-restart');
      if (restartBtn) restartBtn.addEventListener('click', () => this.startNewTest());

      const nextTestBtn = document.getElementById('btn-next-test');
      if (nextTestBtn) nextTestBtn.addEventListener('click', () => this.startNewTest());

      const tryAgainBtn = document.getElementById('btn-try-again');
      if (tryAgainBtn) tryAgainBtn.addEventListener('click', () => this.repeatSameTest());

      const repeatBtn = document.getElementById('btn-repeat-test');
      if (repeatBtn) repeatBtn.addEventListener('click', () => this.repeatSameTest());

      const practiceWeakBtn = document.getElementById('btn-practice-weak');
      if (practiceWeakBtn) practiceWeakBtn.addEventListener('click', () => this.practiceWeakWords());

      const shareBtn = document.getElementById('btn-share-img');
      if (shareBtn) shareBtn.addEventListener('click', () => {
        if (currentResult && window.TypeApp.Chart) {
          window.TypeApp.Chart.downloadResultCard(currentResult);
        }
      });

      const copyBtn = document.getElementById('btn-copy-result');
      if (copyBtn) copyBtn.addEventListener('click', () => this.copyResultSummary());

      // Custom Text Modal
      this.bindCustomModal();
    },

    bindCustomModal() {
      const modal = document.getElementById('custom-text-modal');
      const openBtn = document.getElementById('btn-mode-custom');
      const closeBtn = document.getElementById('modal-close-btn');
      const applyBtn = document.getElementById('modal-apply-btn');
      const textarea = document.getElementById('custom-input-text');

      if (!modal) return;

      if (openBtn) {
        openBtn.addEventListener('click', () => {
          modal.classList.add('open');
          if (textarea) textarea.focus();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });

      if (applyBtn && textarea) {
        applyBtn.addEventListener('click', () => {
          const text = textarea.value.trim();
          if (text.length > 5) {
            const customTokens = text.split(/\s+/).filter(Boolean);
            this.setMode('custom', customTokens.length, { customWords: customTokens });
            modal.classList.remove('open');
            this.startNewTest(customTokens);
          } else {
            alert('Please paste at least a few words to test.');
          }
        });
      }
    },

    handleGlobalKeydown(e) {
      // Shortcuts: Tab + Enter or Esc to reset
      if (e.key === 'Escape') {
        e.preventDefault();
        this.startNewTest();
        return;
      }

      if (e.key === 'Tab') {
        // Tab + Enter quick restart
        this.tabPressed = true;
        setTimeout(() => { this.tabPressed = false; }, 800);
      }

      if (e.key === 'Enter' && this.tabPressed) {
        e.preventDefault();
        this.startNewTest();
        return;
      }

      // If user is inside an input or textarea (like custom modal), don't capture typing test
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      // If result screen is active, space or enter restarts test
      if (resultViewEl && resultViewEl.classList.contains('active')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.startNewTest();
        }
        return;
      }

      // If test is paused, resume on keypress
      if (engine.status === 'paused') {
        engine.resume();
        this.showFocusOverlay(false);
      }

      // Process typing keys
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Backspace' || (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)) {
        e.preventDefault();
        this.showFocusOverlay(false);

        // Sound trigger
        const isErrorKey = false;
        if (window.TypeApp.Sound) {
          window.TypeApp.Sound.playKey(isErrorKey);
        }

        engine.handleInput(e.key, e.ctrlKey);
      }
    },

    focusTypingArea() {
      this.showFocusOverlay(false);
      if (mobileInput) {
        mobileInput.focus();
      }
      if (engine.status === 'paused') {
        engine.resume();
      }
    },

    showFocusOverlay(show) {
      if (!focusOverlay) return;
      if (show) {
        focusOverlay.classList.add('visible');
      } else {
        focusOverlay.classList.remove('visible');
      }
    },

    bindConfigButtons() {
      const settings = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : {};

      // Mode buttons
      const modeButtons = document.querySelectorAll('[data-mode]');
      modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-mode');
          if (mode === 'custom') return; // Handled by modal
          this.switchMode(mode);
        });
      });

      // Submode options (time / words options)
      const submodeButtons = document.querySelectorAll('[data-submode]');
      submodeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-submode');
          this.switchSubMode(val);
        });
      });

      // Difficulty buttons
      const diffButtons = document.querySelectorAll('[data-difficulty]');
      diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const diff = btn.getAttribute('data-difficulty');
          if (window.TypeApp.Storage) window.TypeApp.Storage.saveSettings({ difficulty: diff });
          this.updateActivePills();
          this.startNewTest();
        });
      });

      // Language buttons
      const langButtons = document.querySelectorAll('[data-language]');
      langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const lang = btn.getAttribute('data-language');
          if (window.TypeApp.Storage) window.TypeApp.Storage.saveSettings({ language: lang });
          this.updateActivePills();
          this.startNewTest();
        });
      });

      // Toggles (Punctuation, Numbers)
      const punctBtn = document.getElementById('toggle-punct');
      if (punctBtn) {
        punctBtn.addEventListener('click', () => {
          const s = window.TypeApp.Storage.getSettings();
          const newVal = !s.punctuation;
          window.TypeApp.Storage.saveSettings({ punctuation: newVal });
          punctBtn.classList.toggle('active', newVal);
          this.startNewTest();
        });
      }

      const numBtn = document.getElementById('toggle-numbers');
      if (numBtn) {
        numBtn.addEventListener('click', () => {
          const s = window.TypeApp.Storage.getSettings();
          const newVal = !s.numbers;
          window.TypeApp.Storage.saveSettings({ numbers: newVal });
          numBtn.classList.toggle('active', newVal);
          this.startNewTest();
        });
      }

      this.updateActivePills();
    },

    switchMode(mode) {
      const settings = window.TypeApp.Storage.getSettings();
      let subMode = settings.timeOption || 30;
      if (mode === 'words') subMode = settings.wordsOption || 25;
      else if (mode === 'quote') subMode = settings.quoteOption || 'medium';
      else if (mode === 'zen') subMode = 'infinity';

      window.TypeApp.Storage.saveSettings({ mode: mode });
      this.updateActivePills();
      this.startNewTest();
    },

    switchSubMode(val) {
      const settings = window.TypeApp.Storage.getSettings();
      if (settings.mode === 'time') {
        window.TypeApp.Storage.saveSettings({ timeOption: Number(val) });
      } else if (settings.mode === 'words') {
        window.TypeApp.Storage.saveSettings({ wordsOption: Number(val) });
      } else if (settings.mode === 'quote') {
        window.TypeApp.Storage.saveSettings({ quoteOption: val });
      }
      this.updateActivePills();
      this.startNewTest();
    },

    updateActivePills() {
      const s = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : { mode: 'time', timeOption: 30 };

      // Update Mode pills
      document.querySelectorAll('[data-mode]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-mode') === s.mode);
      });

      // Update Submode container visibility
      const timeGroup = document.getElementById('submode-time-group');
      const wordsGroup = document.getElementById('submode-words-group');
      const quoteGroup = document.getElementById('submode-quote-group');

      if (timeGroup) timeGroup.style.display = (s.mode === 'time') ? 'flex' : 'none';
      if (wordsGroup) wordsGroup.style.display = (s.mode === 'words') ? 'flex' : 'none';
      if (quoteGroup) quoteGroup.style.display = (s.mode === 'quote') ? 'flex' : 'none';

      // Update Submode active item
      const activeSub = (s.mode === 'time') ? String(s.timeOption)
                      : (s.mode === 'words') ? String(s.wordsOption)
                      : (s.mode === 'quote') ? String(s.quoteOption)
                      : '';

      document.querySelectorAll('[data-submode]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-submode') === activeSub);
      });

      // Difficulty active
      document.querySelectorAll('[data-difficulty]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-difficulty') === (s.difficulty || 'medium'));
      });

      // Language active
      document.querySelectorAll('[data-language]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-language') === (s.language || 'english'));
      });

      // Toggles
      const punctBtn = document.getElementById('toggle-punct');
      if (punctBtn) punctBtn.classList.toggle('active', !!s.punctuation);

      const numBtn = document.getElementById('toggle-numbers');
      if (numBtn) numBtn.classList.toggle('active', !!s.numbers);
    },

    /**
     * Start a new test with fresh words or specified tokens
     */
    startNewTest(customTokens = null) {
      if (resultViewEl) resultViewEl.classList.remove('active');
      if (testViewEl) testViewEl.style.display = 'block';

      const s = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : {};
      const mode = s.mode || 'time';
      let subMode = (mode === 'time') ? (s.timeOption || 30)
                  : (mode === 'words') ? (s.wordsOption || 25)
                  : (mode === 'quote') ? (s.quoteOption || 'medium')
                  : 30;

      let wordTokens = [];

      if (customTokens && customTokens.length > 0) {
        wordTokens = customTokens;
        subMode = customTokens.length;
      } else if (mode === 'quote') {
        const quoteObj = window.TypeApp.Quotes ? window.TypeApp.Quotes.getRandom(subMode) : { text: 'The quick brown fox jumps over the lazy dog.' };
        wordTokens = quoteObj.text.split(/\s+/).filter(Boolean);
        // Display quote author
        const quoteAuthorEl = document.getElementById('quote-author');
        if (quoteAuthorEl) {
          quoteAuthorEl.textContent = `— ${quoteObj.author || 'Anonymous'}`;
          quoteAuthorEl.style.display = 'block';
        }
      } else {
        const quoteAuthorEl = document.getElementById('quote-author');
        if (quoteAuthorEl) quoteAuthorEl.style.display = 'none';

        // Count for words pool
        let count = 100;
        if (mode === 'words') count = Number(subMode);
        else if (mode === 'time') count = Math.max(120, Number(subMode) * 4); // ample words for time
        else if (mode === 'zen') count = 200;

        wordTokens = window.TypeApp.Words.generateTokens({
          count: count,
          difficulty: s.difficulty || 'medium',
          language: s.language || 'english',
          punctuation: !!s.punctuation,
          numbers: !!s.numbers,
          capitalLetters: !!s.capitalLetters
        });
      }

      currentWordsList = [...wordTokens];

      engine.initTest(wordTokens, mode, subMode, {
        stopOnError: !!s.stopOnError,
        backspaceMode: s.backspaceMode || 'normal'
      });

      this.renderWordsDOM(engine.tokenData);
      this.updateCaretPosition();
      this.resetLiveStats();
      this.showFocusOverlay(false);

      if (wordsTrack) {
        wordsTrack.style.transform = 'translateY(0px)';
      }
    },

    repeatSameTest() {
      if (!currentWordsList || currentWordsList.length === 0) {
        this.startNewTest();
        return;
      }

      if (resultViewEl) resultViewEl.classList.remove('active');
      if (testViewEl) testViewEl.style.display = 'block';

      const s = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : {};
      engine.initTest(currentWordsList, engine.mode, engine.subMode, {
        stopOnError: !!s.stopOnError,
        backspaceMode: s.backspaceMode || 'normal'
      });

      this.renderWordsDOM(engine.tokenData);
      this.updateCaretPosition();
      this.resetLiveStats();
      if (wordsTrack) wordsTrack.style.transform = 'translateY(0px)';
    },

    practiceWeakWords() {
      if (!currentResult || !currentResult.mistypedWords || Object.keys(currentResult.mistypedWords).length === 0) {
        this.showToast('No mistyped words to practice! Great job.');
        return;
      }

      const weakWords = Object.keys(currentResult.mistypedWords);
      const practiceList = [];
      // Repeat weak words to build fluency
      for (let i = 0; i < 25; i++) {
        practiceList.push(weakWords[i % weakWords.length]);
      }
      this.startNewTest(practiceList);
    },

    /**
     * Build words DOM representation
     */
    renderWordsDOM(tokens) {
      if (!wordsTrack) return;
      wordsTrack.innerHTML = '';

      tokens.forEach((token, wIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.id = `word-${wIdx}`;
        if (wIdx === 0) wordSpan.classList.add('current-word');

        for (let cIdx = 0; cIdx < token.original.length; cIdx++) {
          const charSpan = document.createElement('span');
          charSpan.className = 'char untyped';
          charSpan.textContent = token.original[cIdx];
          wordSpan.appendChild(charSpan);
        }

        wordsTrack.appendChild(wordSpan);
      });
    },

    /**
     * Efficient Character & Caret DOM Update
     */
    onEngineUpdate(state) {
      const currentToken = state.tokenData[state.currentWordIndex];
      if (!currentToken) return;

      const wordEl = document.getElementById(`word-${state.currentWordIndex}`);
      if (!wordEl) return;

      const expected = currentToken.original;
      const typed = currentToken.typed;

      // Update characters inside this word
      const charNodes = wordEl.querySelectorAll('.char');
      
      // Update original characters
      for (let i = 0; i < expected.length; i++) {
        const charNode = charNodes[i];
        if (!charNode) continue;

        if (i < typed.length) {
          if (typed[i] === expected[i]) {
            charNode.className = 'char correct';
          } else {
            charNode.className = 'char incorrect';
          }
        } else {
          charNode.className = 'char untyped';
        }
      }

      // Handle extra characters typed beyond word length
      const existingExtras = wordEl.querySelectorAll('.char.extra');
      existingExtras.forEach(node => node.remove());

      if (typed.length > expected.length) {
        for (let j = expected.length; j < typed.length; j++) {
          const extraNode = document.createElement('span');
          extraNode.className = 'char extra incorrect';
          extraNode.textContent = typed[j];
          wordEl.appendChild(extraNode);
        }
      }

      this.updateCaretPosition();
    },

    onWordChange(data) {
      // Mark previous word status
      const prevIdx = data.index - 1;
      const prevWordEl = document.getElementById(`word-${prevIdx}`);
      if (prevWordEl) {
        prevWordEl.classList.remove('current-word');
        const token = engine.tokenData[prevIdx];
        if (token && token.status === 'error') {
          prevWordEl.classList.add('word-error');
        }
      }

      // Highlight new current word
      const currentWordEl = document.getElementById(`word-${data.index}`);
      if (currentWordEl) {
        currentWordEl.classList.add('current-word');
        this.autoScrollLines(currentWordEl);
      }

      this.updateCaretPosition();
    },

    /**
     * Smooth 3-Line Auto Scrolling
     */
    autoScrollLines(currentWordEl) {
      if (!wordsTrack || !currentWordEl) return;

      const trackTop = wordsTrack.offsetTop;
      const wordTop = currentWordEl.offsetTop;
      const lineHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--line-height-typing')) * 16 || 42;

      // When reaching 2nd line or below, scroll up so active line stays visible
      const lineOffset = Math.floor((wordTop - trackTop) / lineHeight);
      if (lineOffset >= 1) {
        const translateY = -(lineOffset - 1) * lineHeight;
        wordsTrack.style.transform = `translateY(${translateY}px)`;
      }
    },

    /**
     * Position the animated Caret
     */
    updateCaretPosition() {
      if (!caretEl || !wordsTrack) return;

      const currentWordEl = document.getElementById(`word-${engine.currentWordIndex}`);
      if (!currentWordEl) return;

      const currentToken = engine.tokenData[engine.currentWordIndex];
      const typedLen = currentToken ? currentToken.typed.length : 0;
      const charNodes = currentWordEl.querySelectorAll('.char');

      let targetLeft = 0;
      let targetTop = currentWordEl.offsetTop;

      if (typedLen === 0) {
        // At start of word
        targetLeft = currentWordEl.offsetLeft;
      } else if (typedLen <= charNodes.length) {
        // Before or after a character
        const charNode = charNodes[typedLen - 1];
        targetLeft = charNode.offsetLeft + charNode.offsetWidth;
      } else {
        // Beyond extra characters
        const lastNode = charNodes[charNodes.length - 1];
        targetLeft = lastNode.offsetLeft + lastNode.offsetWidth;
      }

      caretEl.style.left = `${targetLeft}px`;
      caretEl.style.top = `${targetTop + 4}px`;
      caretEl.style.height = `${currentWordEl.offsetHeight - 8}px`;
    },

    /**
     * Timer ticks every second
     */
    onEngineTick(data) {
      const s = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : {};

      if (statTimerEl && s.liveTimer !== false) {
        statTimerEl.textContent = `${data.remainingSeconds}s`;
      }

      if (statWpmEl && s.liveWpm !== false) {
        statWpmEl.textContent = data.metrics.netWpm;
      }

      if (statAccEl && s.liveAcc !== false) {
        statAccEl.textContent = `${data.metrics.accuracy}%`;
      }
    },

    resetLiveStats() {
      const s = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : {};
      if (liveStatsEl) {
        liveStatsEl.style.display = (s.liveWpm || s.liveAcc || s.liveTimer) ? 'flex' : 'none';
      }

      if (statWpmEl) statWpmEl.textContent = '0';
      if (statAccEl) statAccEl.textContent = '100%';
      if (statTimerEl) {
        const total = (engine.mode === 'time') ? engine.subMode : 0;
        statTimerEl.textContent = `${total}s`;
      }
    },

    /**
     * Test Completed -> Show Result Screen & Celebration
     */
    onEngineFinish(data) {
      if (window.TypeApp.Sound) {
        window.TypeApp.Sound.playFanfare();
      }

      const metrics = data.metrics;
      const skill = getSkillLabel(metrics.netWpm);

      // Save to localStorage
      const saveRes = window.TypeApp.Storage.saveTestResult({
        mode: data.mode,
        subMode: data.subMode,
        netWpm: metrics.netWpm,
        grossWpm: metrics.grossWpm,
        rawWpm: metrics.rawWpm,
        accuracy: metrics.accuracy,
        consistency: metrics.consistency,
        characters: metrics.characters,
        keystrokes: metrics.keystrokes,
        durationSeconds: metrics.durationSeconds,
        timeline: data.timeline,
        mistypedWords: data.mistypedWords,
        mistypedKeys: data.mistypedKeys
      });

      currentResult = {
        ...metrics,
        timestamp: Date.now(),
        mode: data.mode,
        subMode: data.subMode,
        skill: skill.label,
        timeline: data.timeline,
        mistypedWords: data.mistypedWords,
        mistypedKeys: data.mistypedKeys,
        isPB: saveRes.isPersonalBest
      };

      this.showResultScreen(currentResult);
    },

    showResultScreen(res) {
      if (testViewEl) testViewEl.style.display = 'none';
      if (resultViewEl) resultViewEl.classList.add('active');

      // Populate metrics
      const wpmValEl = document.getElementById('res-wpm-val');
      if (wpmValEl) wpmValEl.textContent = res.netWpm;

      const skillBadgeEl = document.getElementById('res-skill-badge');
      if (skillBadgeEl) {
        const skill = getSkillLabel(res.netWpm);
        skillBadgeEl.textContent = skill.label;
        skillBadgeEl.style.color = skill.color;
        skillBadgeEl.style.borderColor = skill.color;
      }

      const pbBadgeEl = document.getElementById('res-pb-badge');
      if (pbBadgeEl) {
        pbBadgeEl.style.display = res.isPB ? 'inline-flex' : 'none';
        if (res.isPB) {
          this.triggerConfetti();
        }
      }

      const accEl = document.getElementById('res-acc-val');
      if (accEl) accEl.textContent = `${res.accuracy}%`;

      const rawEl = document.getElementById('res-raw-val');
      if (rawEl) rawEl.textContent = res.rawWpm;

      const consEl = document.getElementById('res-cons-val');
      if (consEl) consEl.textContent = `${res.consistency}%`;

      const charsEl = document.getElementById('res-chars-val');
      if (charsEl && res.characters) {
        charsEl.textContent = `${res.characters.correct}/${res.characters.incorrect}/${res.characters.extra}/${res.characters.missed}`;
      }

      const timeEl = document.getElementById('res-time-val');
      if (timeEl) timeEl.textContent = `${res.durationSeconds}s`;

      const modeEl = document.getElementById('res-mode-val');
      if (modeEl) modeEl.textContent = `${res.mode} ${res.subMode || ''}`;

      // Populate Weak Words & Keys
      this.renderMistakeBreakdown(res);

      // Render Canvas Chart
      if (chartCanvas && window.TypeApp.Chart) {
        window.TypeApp.Chart.renderWpmChart(chartCanvas, res.timeline);
      }
    },

    renderMistakeBreakdown(res) {
      const wordsBox = document.getElementById('res-weak-words-list');
      const keysBox = document.getElementById('res-weak-keys-list');

      if (wordsBox) {
        wordsBox.innerHTML = '';
        const words = Object.entries(res.mistypedWords || {}).sort((a, b) => b[1] - a[1]);
        if (words.length === 0) {
          wordsBox.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">None! Flawless run.</span>';
        } else {
          words.slice(0, 8).forEach(([word, count]) => {
            const tag = document.createElement('span');
            tag.className = 'error-tag';
            tag.innerHTML = `${word} <span class="error-tag-count">${count}</span>`;
            wordsBox.appendChild(tag);
          });
        }
      }

      if (keysBox) {
        keysBox.innerHTML = '';
        const keys = Object.entries(res.mistypedKeys || {}).sort((a, b) => b[1] - a[1]);
        if (keys.length === 0) {
          keysBox.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">None!</span>';
        } else {
          keys.slice(0, 8).forEach(([key, count]) => {
            const tag = document.createElement('span');
            tag.className = 'error-tag';
            tag.innerHTML = `${key === ' ' ? 'Space' : key} <span class="error-tag-count">${count}</span>`;
            keysBox.appendChild(tag);
          });
        }
      }
    },

    /**
     * Pure CSS Confetti celebration on Personal Best
     */
    triggerConfetti() {
      const container = document.getElementById('confetti-container');
      if (!container) return;

      container.innerHTML = '';
      const colors = ['#bb9af7', '#7aa2f7', '#9ece6a', '#f7768e', '#e0af68', '#7dcfff'];

      for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = `${6 + Math.random() * 8}px`;
        piece.style.height = `${10 + Math.random() * 8}px`;
        piece.style.animationDelay = `${Math.random() * 0.8}s`;
        piece.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
        container.appendChild(piece);
      }

      setTimeout(() => {
        if (container) container.innerHTML = '';
      }, 5000);
    },

    copyResultSummary() {
      if (!currentResult) return;
      const text = `TypePulse Speed Test\n` +
        `Mode: ${currentResult.mode} ${currentResult.subMode || ''}\n` +
        `Net WPM: ${currentResult.netWpm} | Accuracy: ${currentResult.accuracy}%\n` +
        `Raw WPM: ${currentResult.rawWpm} | Consistency: ${currentResult.consistency}%\n` +
        `Time: ${currentResult.durationSeconds}s | 100% Offline`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('Result copied to clipboard!');
        });
      } else {
        this.showToast('Copied result text');
      }
    },

    showToast(message) {
      let toast = document.getElementById('toast-notice');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notice';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  };

  window.TypeApp.Main = Main;
  document.addEventListener('DOMContentLoaded', () => Main.init());
})();
