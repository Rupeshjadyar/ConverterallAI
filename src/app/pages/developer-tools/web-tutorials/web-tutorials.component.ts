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
  templateUrl: './web-tutorials.component.html',
  styleUrls: ['./web-tutorials.component.css']
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
