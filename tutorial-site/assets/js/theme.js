/**
 * WebDev Academy - Theme, Preferences & Study Notes Engine
 * Manages Dark Mode, Bilingual Toggle (EN/Hinglish), Font Scaling, and Student Notes.
 */
(function(window) {
  'use strict';

  const Theme = {
    THEME_KEY: 'webdev_theme',
    LANG_KEY: 'webdev_lang',
    FONT_KEY: 'webdev_font_scale',
    NOTES_KEY: 'webdev_notes',

    currentScale: 1,

    init: function() {
      // 1. Theme (Dark/Light)
      const savedTheme = localStorage.getItem(this.THEME_KEY) || 'light';
      this.setTheme(savedTheme);

      // 2. Language (en/hi)
      const savedLang = localStorage.getItem(this.LANG_KEY) || 'en';
      this.setLang(savedLang);

      // 3. Font Scale
      const savedScale = parseFloat(localStorage.getItem(this.FONT_KEY) || '1');
      this.setScale(savedScale);

      // 4. Notes & Bookmarks setup
      this.setupNotes();
      this.setupCollapsibles();
    },

    setTheme: function(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.THEME_KEY, theme);
      const btn = document.querySelector('.theme-toggle-btn');
      if (btn) {
        btn.innerHTML = theme === 'dark' ? '&#9728;' : '&#9790;';
        btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      }
    },

    toggleTheme: function() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      this.setTheme(current === 'dark' ? 'light' : 'dark');
    },

    setLang: function(lang) {
      document.body.setAttribute('data-lang', lang);
      localStorage.setItem(this.LANG_KEY, lang);
      const btn = document.querySelector('.lang-switch-btn');
      if (btn) {
        btn.textContent = lang === 'hi' ? 'Hinglish' : 'English';
      }
    },

    toggleLang: function() {
      const current = document.body.getAttribute('data-lang') || 'en';
      this.setLang(current === 'en' ? 'hi' : 'en');
    },

    setScale: function(scale) {
      this.currentScale = Math.min(Math.max(scale, 0.85), 1.25);
      document.documentElement.style.setProperty('--font-scale', this.currentScale);
      localStorage.setItem(this.FONT_KEY, this.currentScale);
    },

    increaseFont: function() {
      this.setScale(this.currentScale + 0.05);
    },

    decreaseFont: function() {
      this.setScale(this.currentScale - 0.05);
    },

    setupNotes: function() {
      const notesArea = document.querySelector('.notes-textarea');
      if (!notesArea) return;

      const pageKey = window.location.pathname.split('/').pop() || 'general';
      let allNotes = {};
      try {
        allNotes = JSON.parse(localStorage.getItem(this.NOTES_KEY) || '{}');
      } catch (e) {}

      if (allNotes[pageKey]) {
        notesArea.value = allNotes[pageKey];
      }

      const saveBtn = document.querySelector('.btn-save-notes');
      if (saveBtn) {
        saveBtn.addEventListener('click', function() {
          allNotes[pageKey] = notesArea.value;
          localStorage.setItem(Theme.NOTES_KEY, JSON.stringify(allNotes));
          saveBtn.textContent = 'Saved!';
          setTimeout(() => { saveBtn.textContent = 'Save Note'; }, 1500);
        });
      }
    },

    setupCollapsibles: function() {
      // Toggle for Exercise hints and solutions
      document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-toggle-hint')) {
          const card = e.target.closest('.exercise-card');
          const hint = card.querySelector('.exercise-hint');
          if (hint) {
            const isHidden = hint.style.display === 'none' || !hint.style.display;
            hint.style.display = isHidden ? 'block' : 'none';
            e.target.textContent = isHidden ? 'Hide Hint' : 'Show Hint';
          }
        } else if (e.target.matches('.btn-toggle-sol')) {
          const card = e.target.closest('.exercise-card');
          const sol = card.querySelector('.exercise-solution');
          if (sol) {
            const isHidden = sol.style.display === 'none' || !sol.style.display;
            sol.style.display = isHidden ? 'block' : 'none';
            e.target.textContent = isHidden ? 'Hide Solution' : 'Show Solution';
          }
        }
      });
    }
  };

  window.Theme = Theme;
})(window);
