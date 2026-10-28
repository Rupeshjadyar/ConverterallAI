import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { HtmlTutorialComponent } from './components/html-tutorial.component';
import { CssTutorialComponent } from './components/css-tutorial.component';
import { JavascriptTutorialComponent } from './components/javascript-tutorial.component';
import { JavaTutorialComponent } from './components/java-tutorial.component';
import { PythonTutorialComponent } from './components/python-tutorial.component';
import { SqlTutorialComponent } from './components/sql-tutorial.component';

@Component({
  selector: 'app-web-tutorials',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HtmlTutorialComponent,
    CssTutorialComponent,
    JavascriptTutorialComponent,
    JavaTutorialComponent,
    PythonTutorialComponent,
    SqlTutorialComponent
  ],
  template: `
    <div class="tutorials-site-wrapper" [class.dark-mode]="isDarkMode()">
      
      <!-- Top Brand Strip -->
      <div class="tutorials-brand-bar">
        <div class="brand-container">
          <div class="brand-info">
            <span class="brand-badge">Tutorials Hub</span>
            <h1 class="brand-title">Learn through <span class="highlight-brand">ConverterAllAI</span></h1>
            <p class="brand-tagline">Comprehensive interactive tutorials for HTML, CSS, JavaScript, Java, Python &amp; SQL with live in-browser code execution.</p>
          </div>
          <div class="brand-actions">
            <button class="btn-theme-toggle" (click)="toggleTheme()" [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <span>{{ isDarkMode() ? '☀️ Light' : '🌙 Dark' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Secondary Horizontal Language Bar -->
      <nav class="subnav-bar" aria-label="Languages Bar">
        <div class="subnav-scroll">
          <button
            class="subnav-link"
            [class.active]="selectedLanguage() === 'HTML'"
            (click)="selectLanguage('HTML')"
          >HTML</button>
          
          <button
            class="subnav-link"
            [class.active]="selectedLanguage() === 'CSS'"
            (click)="selectLanguage('CSS')"
          >CSS</button>
          
          <button
            class="subnav-link"
            [class.active]="selectedLanguage() === 'JAVASCRIPT'"
            (click)="selectLanguage('JAVASCRIPT')"
          >JAVASCRIPT</button>

          <button
            class="subnav-link"
            [class.active]="selectedLanguage() === 'JAVA'"
            (click)="selectLanguage('JAVA')"
          >JAVA</button>

          <button
            class="subnav-link"
            [class.active]="selectedLanguage() === 'PYTHON'"
            (click)="selectLanguage('PYTHON')"
          >PYTHON</button>

          <button
            class="subnav-link"
            [class.active]="selectedLanguage() === 'SQL'"
            (click)="selectLanguage('SQL')"
          >SQL</button>
        </div>
      </nav>

      <!-- Main Tutorial Sub-Component View -->
      <div class="main-component-container">
        @if (selectedLanguage() === 'HTML') {
          <app-html-tutorial />
        } @else if (selectedLanguage() === 'CSS') {
          <app-css-tutorial />
        } @else if (selectedLanguage() === 'JAVASCRIPT') {
          <app-javascript-tutorial />
        } @else if (selectedLanguage() === 'JAVA') {
          <app-java-tutorial />
        } @else if (selectedLanguage() === 'PYTHON') {
          <app-python-tutorial />
        } @else if (selectedLanguage() === 'SQL') {
          <app-sql-tutorial />
        } @else {
          <app-html-tutorial />
        }
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .tutorials-site-wrapper {
      min-height: 100vh;
      background-color: var(--w3-bg, #ffffff);
      color: var(--w3-text, #1e293b);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --w3-green: #04AA6D;
      --w3-bg: #ffffff;
      --w3-surface: #ffffff;
      --w3-sidebar-bg: #f8fafc;
      --w3-text: #0f172a;
      --w3-text-sub: #334155;
      --w3-text-muted: #64748b;
      --w3-border: #e2e8f0;
    }

    .tutorials-site-wrapper.dark-mode {
      --w3-bg: #0f172a;
      --w3-surface: #1e293b;
      --w3-sidebar-bg: #111827;
      --w3-text: #f8fafc;
      --w3-text-sub: #cbd5e1;
      --w3-text-muted: #94a3b8;
      --w3-border: #334155;
    }

    /* Top Brand Bar */
    .tutorials-brand-bar {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 20px 24px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand-container {
      max-width: 1300px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }

    .brand-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #04AA6D;
      background: rgba(4, 170, 109, 0.15);
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }

    .brand-title {
      font-size: 1.85rem;
      font-weight: 800;
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }

    .highlight-brand {
      color: #38bdf8;
    }

    .brand-tagline {
      font-size: 0.92rem;
      color: #94a3b8;
      margin: 0;
      max-width: 720px;
    }

    .btn-theme-toggle {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .btn-theme-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Horizontal Subnav Bar */
    .subnav-bar {
      background-color: #1e293b;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }

    .subnav-scroll {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      max-width: 1300px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .subnav-scroll::-webkit-scrollbar {
      display: none;
    }

    .subnav-link {
      display: inline-flex;
      align-items: center;
      padding: 12px 20px;
      color: #cbd5e1;
      font-size: 0.92rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-decoration: none;
      background: transparent;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.15s, color 0.15s;
    }

    .subnav-link:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .subnav-link.active {
      background-color: #04AA6D;
      color: #ffffff;
    }

    /* Main Component Container */
    .main-component-container {
      width: 100%;
      min-height: calc(100vh - 120px);
    }

    @media (max-width: 768px) {
      .brand-container {
        flex-direction: column;
        align-items: flex-start;
      }
      .brand-title {
        font-size: 1.45rem;
      }
      .subnav-link {
        padding: 10px 14px;
        font-size: 0.85rem;
      }
    }
  `]
})
export class WebTutorialsComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seoService = inject(SeoService);

  selectedLanguage = signal<string>('HTML');
  isDarkMode = signal<boolean>(false);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedTheme = localStorage.getItem('converterallai_theme');
        if (savedTheme === 'dark') {
          this.isDarkMode.set(true);
        }
      } catch (e) {}

      // Check query parameter ?lang=
      this.route.queryParams.subscribe(params => {
        const langParam = params['lang'];
        if (langParam) {
          const upper = langParam.toUpperCase();
          if (['HTML', 'CSS', 'JAVASCRIPT', 'JAVA', 'PYTHON', 'SQL'].includes(upper)) {
            this.selectedLanguage.set(upper);
            this.updateSeoForLanguage(upper);
            return;
          }
        }
        this.updateSeoForLanguage(this.selectedLanguage());
      });
    }
  }

  selectLanguage(lang: string) {
    this.selectedLanguage.set(lang);
    this.updateSeoForLanguage(lang);
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { lang: lang.toLowerCase() },
        queryParamsHandling: 'merge'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateSeoForLanguage(lang: string): void {
    const seoMap: Record<string, { title: string; desc: string; keywords: string }> = {
      'HTML': {
        title: 'Free HTML Tutorial & Live Code Runner | ConverterAllAI',
        desc: 'Learn HTML from scratch with 38 interactive chapters, live code sandbox preview, semantic tags, tables, forms, and free developer certification on ConverterAllAI.',
        keywords: 'html tutorial, learn html, html code runner, html tags, html5 tutorial, html practice online'
      },
      'CSS': {
        title: 'Free CSS Tutorial & Styling Sandbox | ConverterAllAI',
        desc: 'Master modern CSS with interactive styling sandbox: CSS selectors, Box Model, Flexbox layout, Grid system, keyframe animations, and responsive design.',
        keywords: 'css tutorial, learn css, css flexbox guide, css grid tutorial, css animations, css practice sandbox'
      },
      'JAVASCRIPT': {
        title: 'Free JavaScript Tutorial & JS Code Runner | ConverterAllAI',
        desc: 'Learn modern JavaScript (ES6+) with live in-browser execution: variables, functions, arrow syntax, array methods, DOM manipulation, async/await, and APIs.',
        keywords: 'javascript tutorial, learn javascript online, js runner, modern es6 guide, dom manipulation, async await js'
      },
      'JAVA': {
        title: 'Free Java Tutorial & JVM Console Runner | ConverterAllAI',
        desc: 'Master Java programming with simulated JVM console output: classes, OOP principles, constructors, inheritance, interfaces, and Java Collections framework.',
        keywords: 'java tutorial, learn java, online java compiler, java oop guide, java collections, core java tutorial'
      },
      'PYTHON': {
        title: 'Free Python Tutorial & Interactive Sandbox | ConverterAllAI',
        desc: 'Learn Python 3 step by step with live console runner: syntax, indentation, lists, dictionaries, list comprehensions, functions, and OOP classes.',
        keywords: 'python tutorial, learn python, python online compiler, python syntax, python lists dicts, python for beginners'
      },
      'SQL': {
        title: 'Free SQL Tutorial & Database Query Runner | ConverterAllAI',
        desc: 'Master SQL database queries with interactive tabular results: SELECT, WHERE, operators, aggregate functions, and complete multi-table JOINs guide.',
        keywords: 'sql tutorial, learn sql online, sql query runner, sql joins guide, select where sql, relational database practice'
      }
    };

    const config = seoMap[lang] || seoMap['HTML'];
    this.seoService.update({
      title: config.title,
      description: config.desc,
      keywords: config.keywords,
      canonical: `https://converterallai.com/developer-tools/web-tutorials?lang=${lang.toLowerCase()}`,
      robots: 'index, follow'
    });
  }

  toggleTheme() {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('converterallai_theme', next ? 'dark' : 'light');
      } catch (e) {}
    }
  }
}
