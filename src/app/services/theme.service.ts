import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public currentTheme = signal<Theme>('dark');
  public resolvedTheme = signal<'light' | 'dark'>('dark');
  private isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public initTheme(): void {
    if (!this.isBrowser) return;

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('dark');
    }

    // Listen for system theme changes if in 'auto' mode
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (this.currentTheme() === 'auto') {
          this.applyResolvedTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  public setTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'auto') {
      const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyResolvedTheme(isSystemDark ? 'dark' : 'light');
    } else {
      this.applyResolvedTheme(theme);
    }
  }

  private applyResolvedTheme(resolved: 'light' | 'dark'): void {
    this.resolvedTheme.set(resolved);
    this.document.body.classList.remove('default-theme', 'dark-theme', 'light-theme', 'custom-theme');
    if (resolved === 'light') {
      this.document.body.classList.add('light-theme');
    } else {
      this.document.body.classList.add('dark-theme');
    }
  }
}
