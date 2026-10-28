/**
 * Typing Speed Test - Theme & Appearance Manager
 * Namespace: window.TypeApp.Theme
 */

window.TypeApp = window.TypeApp || {};

(function() {
  const THEMES = ['dark', 'light', 'midnight', 'forest', 'sunset', 'ocean', 'retro', 'contrast'];
  
  const FONT_MAP = {
    'ui-mono': 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "Courier New", monospace',
    'consolas': 'Consolas, "Lucida Console", Monaco, monospace',
    'cascadia': '"Cascadia Code", "Cascadia Mono", Consolas, monospace',
    'courier': '"Courier New", Courier, monospace',
    'system-sans': 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  };

  const FONT_SIZES = {
    'small': { size: '1.35rem', line: '2.2rem' },
    'medium': { size: '1.65rem', line: '2.6rem' },
    'large': { size: '1.95rem', line: '3.0rem' },
    'xlarge': { size: '2.25rem', line: '3.4rem' }
  };

  const Theme = {
    themes: THEMES,

    init() {
      this.applyFromStorage();
    },

    applyFromStorage() {
      const settings = window.TypeApp.Storage ? window.TypeApp.Storage.getSettings() : { theme: 'dark' };
      this.applyTheme(settings.theme || 'dark');
      this.applyFontFamily(settings.fontFamily || 'ui-mono');
      this.applyFontSize(settings.fontSize || 'medium');
      this.applyCaret(settings.caretStyle || 'line', settings.caretSmooth !== false);
    },

    applyTheme(themeName) {
      if (!THEMES.includes(themeName)) themeName = 'dark';
      document.documentElement.setAttribute('data-theme', themeName);
      
      // Update any theme selectors or radio buttons on current page
      const themeSelect = document.getElementById('theme-select');
      if (themeSelect) themeSelect.value = themeName;

      const themeBadges = document.querySelectorAll('[data-theme-btn]');
      themeBadges.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme-btn') === themeName);
      });
    },

    setTheme(themeName) {
      this.applyTheme(themeName);
      if (window.TypeApp.Storage) {
        window.TypeApp.Storage.saveSettings({ theme: themeName });
      }
    },

    cycleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const idx = THEMES.indexOf(current);
      const next = THEMES[(idx + 1) % THEMES.length];
      this.setTheme(next);
      return next;
    },

    applyFontFamily(fontKey) {
      const family = FONT_MAP[fontKey] || FONT_MAP['ui-mono'];
      document.documentElement.style.setProperty('--font-mono', family);
    },

    setFontFamily(fontKey) {
      this.applyFontFamily(fontKey);
      if (window.TypeApp.Storage) {
        window.TypeApp.Storage.saveSettings({ fontFamily: fontKey });
      }
    },

    applyFontSize(sizeKey) {
      const config = FONT_SIZES[sizeKey] || FONT_SIZES['medium'];
      document.documentElement.style.setProperty('--font-size-typing', config.size);
      document.documentElement.style.setProperty('--line-height-typing', config.line);
    },

    setFontSize(sizeKey) {
      this.applyFontSize(sizeKey);
      if (window.TypeApp.Storage) {
        window.TypeApp.Storage.saveSettings({ fontSize: sizeKey });
      }
    },

    applyCaret(style, smooth) {
      const root = document.documentElement;
      root.classList.remove('caret-style-line', 'caret-style-block', 'caret-style-underline');
      root.classList.add(`caret-style-${style || 'line'}`);
      
      if (smooth) {
        root.classList.add('caret-smooth');
      } else {
        root.classList.remove('caret-smooth');
      }
    },

    setCaret(style, smooth) {
      this.applyCaret(style, smooth);
      if (window.TypeApp.Storage) {
        window.TypeApp.Storage.saveSettings({ caretStyle: style, caretSmooth: smooth });
      }
    }
  };

  // Immediate execution to avoid flash of wrong theme
  Theme.init();

  window.TypeApp.Theme = Theme;
})();
