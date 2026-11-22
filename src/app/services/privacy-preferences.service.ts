import { DOCUMENT } from '@angular/common';
import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';

const COOKIE_PREFERENCE = 'converterall_cookie_consent';
type Choice = 'accepted' | 'declined';

@Injectable({ providedIn: 'root' })
export class PrivacyPreferencesService {
  private readonly document = inject(DOCUMENT);
  private readonly choice = signal<Choice | null>(null);
  private readonly ready = signal(false);
  private readonly settingsOpen = signal(false);

  readonly allowsOptional = computed(() => this.choice() === 'accepted');
  readonly showBanner = computed(() => this.ready() && (!this.choice() || this.settingsOpen()));

  constructor() {
    afterNextRender(() => {
      try {
        const saved = localStorage.getItem(COOKIE_PREFERENCE);
        if (saved === 'accepted' || saved === 'declined') this.apply(saved);
      } catch {
        // Storage can be unavailable in private or restricted browser contexts.
      }
      this.ready.set(true);
    });
  }

  openSettings(): void {
    this.settingsOpen.set(true);
  }

  choose(choice: Choice): void {
    const reload = this.allowsOptional() && choice === 'declined';
    let persisted = false;
    try {
      localStorage.setItem(COOKIE_PREFERENCE, choice);
      persisted = true;
    } catch {
      // Respect the choice in memory if it cannot be saved.
    }
    this.apply(choice);
    this.settingsOpen.set(false);
    // A fresh page removes the third-party runtime that was loaded under the previous choice.
    if (reload && persisted) this.document.defaultView?.location.reload();
  }

  private apply(choice: Choice): void {
    this.choice.set(choice);
    if (choice === 'declined') {
      try { localStorage.removeItem('c_all_visitor_id'); } catch {}
      try { sessionStorage.removeItem('c_all_geo'); } catch {}
      this.document.getElementById('optional-adsense')?.remove();
      return;
    }
    if (!this.document.getElementById('optional-adsense')) {
      const script = this.document.createElement('script');
      script.id = 'optional-adsense';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9707682105347147';
      this.document.head.appendChild(script);
    }
  }
}
