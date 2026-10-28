/**
 * WebDev Academy - Offline Instant Search Controller
 * Fast, zero-dependency fuzzy search across all lessons and reference docs.
 */
(function(window) {
  'use strict';

  const Search = {
    modalBackdrop: null,
    searchInput: null,
    resultsList: null,
    selectedIndex: -1,
    currentResults: [],

    init: function(rootPath) {
      this.rootPath = rootPath || './';
      this.buildModal();
      this.attachEvents();
    },

    buildModal: function() {
      if (document.getElementById('search-modal')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'search-modal';
      backdrop.className = 'search-modal-backdrop';
      backdrop.innerHTML = `
        <div class="search-modal-dialog">
          <div class="search-box-wrapper">
            <span style="font-size: 1.2rem; color: var(--text-muted);">&#128269;</span>
            <input type="text" class="search-input" placeholder="Search lessons, tags, concepts... (Press Esc to close)" autocomplete="off">
            <span class="kbd-shortcut">ESC</span>
          </div>
          <ul class="search-results-list"></ul>
        </div>
      `;
      document.body.appendChild(backdrop);

      this.modalBackdrop = backdrop;
      this.searchInput = backdrop.querySelector('.search-input');
      this.resultsList = backdrop.querySelector('.search-results-list');
    },

    open: function() {
      if (!this.modalBackdrop) this.buildModal();
      this.modalBackdrop.classList.add('open');
      this.searchInput.value = '';
      this.searchInput.focus();
      this.renderResults(window.SEARCH_INDEX ? window.SEARCH_INDEX.slice(0, 6) : []);
    },

    close: function() {
      if (!this.modalBackdrop) return;
      this.modalBackdrop.classList.remove('open');
      this.selectedIndex = -1;
    },

    performSearch: function(query) {
      if (!window.SEARCH_INDEX) return;
      const q = query.trim().toLowerCase();
      if (!q) {
        this.renderResults(window.SEARCH_INDEX.slice(0, 6));
        return;
      }

      const words = q.split(/\s+/);
      const matches = window.SEARCH_INDEX.filter(function(item) {
        const titleMatch = item.title.toLowerCase();
        const kwMatch = item.keywords.join(' ').toLowerCase();
        const excerptMatch = item.excerpt.toLowerCase();
        const full = titleMatch + ' ' + kwMatch + ' ' + excerptMatch;

        return words.every(word => full.includes(word));
      });

      this.renderResults(matches);
    },

    renderResults: function(results) {
      this.currentResults = results;
      this.selectedIndex = -1;
      this.resultsList.innerHTML = '';

      if (results.length === 0) {
        this.resultsList.innerHTML = '<li class="search-empty">No matching lessons or concepts found.</li>';
        return;
      }

      results.slice(0, 8).forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'search-result-item';
        li.setAttribute('data-index', idx);
        const resolvedUrl = this.rootPath + item.url;

        li.innerHTML = `
          <a href="${resolvedUrl}">
            <div class="search-result-breadcrumb">${item.course}</div>
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-snippet">${item.excerpt}</div>
          </a>
        `;
        this.resultsList.appendChild(li);
      });
    },

    updateHighlight: function() {
      const items = this.resultsList.querySelectorAll('.search-result-item');
      items.forEach((item, idx) => {
        if (idx === this.selectedIndex) {
          item.classList.add('highlighted');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('highlighted');
        }
      });
    },

    attachEvents: function() {
      // Global shortcut "/"
      document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.open();
        } else if (e.key === 'Escape' && this.modalBackdrop.classList.contains('open')) {
          this.close();
        }
      });

      // Search input changes
      this.searchInput.addEventListener('input', (e) => {
        this.performSearch(e.target.value);
      });

      // Keyboard navigation inside search
      this.searchInput.addEventListener('keydown', (e) => {
        const items = this.resultsList.querySelectorAll('.search-result-item');
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.selectedIndex < items.length - 1) {
            this.selectedIndex++;
            this.updateHighlight();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
            this.updateHighlight();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            const link = items[this.selectedIndex].querySelector('a');
            if (link) window.location.href = link.href;
          }
        }
      });

      // Click backdrop to close
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) {
          this.close();
        }
      });

      // Delegate search triggers
      document.addEventListener('click', (e) => {
        if (e.target.closest('.search-trigger-btn')) {
          this.open();
        }
      });
    }
  };

  window.Search = Search;
})(window);
