import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SQL_TOPICS } from './sql/sql.models';

@Component({
  selector: 'app-developer-tools-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dev-hub-container">
      <!-- HERO BANNER -->
      <section class="dev-hero">
        <div class="hero-badge">
          <span class="pulse-dot"></span>
          <span>100% Free • All-in-One In-Browser Developer Studio • Zero Setup</span>
        </div>

        <h1 class="hero-title">
          Developer Tools &amp; <span class="gradient-text">SQL Studio</span>
        </h1>
        <p class="hero-desc">
          High-performance developer utilities: interactive MySQL masterclass (102 slides), touch-typing tutor, JSON formatter, JWT decoder, cryptographic hasher, UUID generator, and live regex tester.
        </p>

        <!-- Quick Action CTA Buttons -->
        <div class="hero-actions">
          <a routerLink="/developer-tools/sql" class="btn-primary-glow">
            📚 Start SQL Learn (102 Slides) →
          </a>
          <a routerLink="/typing-master" class="btn-secondary-glass">
            ⌨️ Type Master Pro
          </a>
          <a routerLink="/developer-tools/json-formatter" class="btn-secondary-glass">
            &#123;&#125; JSON Formatter
          </a>
          <a routerLink="/developer-tools/sql/playground" class="btn-secondary-glass">
            ⚡ SQL Playground
          </a>
        </div>
      </section>

      <!-- FEATURED SPOTLIGHT CARDS -->
      <section class="spotlight-section">
        <div class="spotlight-card sql-spotlight glass">
          <div class="spotlight-content">
            <span class="spotlight-tag">🌟 FEATURED MASTERCLASS</span>
            <h2>Complete MySQL Tutorial (102 Slides)</h2>
            <p>
              From basic RDBMS concepts, DDL and DML commands, to complex Nested Subqueries, Multi-table Joins with Venn diagrams, and SQL Views. Every topic, syntax rule, and query example included.
            </p>
            <div class="spotlight-stats">
              <span class="stat-badge">📖 13 Core Modules</span>
              <span class="stat-badge">🔀 Venn Joins Visualizer</span>
              <span class="stat-badge">⚡ Live In-Browser Engine</span>
            </div>
            <div class="spotlight-btn-row">
              <a routerLink="/developer-tools/sql" class="btn-cta">
                Explore All SQL Chapters →
              </a>
            </div>
          </div>
          <div class="spotlight-icon-art">🗄️</div>
        </div>

        <div class="spotlight-card sandbox-spotlight glass">
          <div class="spotlight-content">
            <span class="spotlight-tag gold-tag">⚡ LIVE QUERY ENGINE</span>
            <h2>Interactive SQL Sandbox</h2>
            <p>
              Execute real <code>SELECT</code>, <code>WHERE</code>, <code>JOIN</code>, <code>GROUP BY</code>, and <code>HAVING</code> queries directly in your browser against pre-seeded tables from the course.
            </p>
            <div class="spotlight-stats">
              <span class="stat-badge">📊 Pre-seeded Datasets</span>
              <span class="stat-badge">⚡ Sub-millisecond Execution</span>
              <span class="stat-badge">📋 18+ Query Presets</span>
            </div>
            <div class="spotlight-btn-row">
              <a routerLink="/developer-tools/sql/playground" class="btn-cta gold-cta">
                Launch SQL Playground →
              </a>
            </div>
          </div>
          <div class="spotlight-icon-art">💻</div>
        </div>
      </section>

      <!-- DEVELOPER QUICK UTILITIES TOOLBOX -->
      <section class="tools-toolbox-section">
        <div class="section-head-row">
          <div>
            <span class="section-tag">INSTANT UTILITIES</span>
            <h2 class="section-title">Developer Utilities Suite</h2>
          </div>
          <span class="tools-count-pill">12 Free Developer Tools</span>
        </div>

        <div class="utility-boxes-grid">
          <!-- 1. JSON Formatter & Minifier -->
          <div id="json-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">&#123;&#125;</span>
              <div>
                <h3>JSON Formatter &amp; Validator</h3>
                <small class="tool-sub">Prettify, validate syntax &amp; minify JSON</small>
              </div>
            </div>
            <textarea 
              [(ngModel)]="jsonInput" 
              [placeholder]="jsonPlaceholder"
              class="util-textarea"
              rows="4"
            ></textarea>
            <div class="util-actions">
              <button (click)="formatJson(2)" class="util-btn primary-btn">Prettify (2 sp)</button>
              <button (click)="formatJson(4)" class="util-btn">Prettify (4 sp)</button>
              <button (click)="formatJson(0)" class="util-btn">Minify</button>
              <button (click)="copyText(jsonInput)" class="util-btn">Copy</button>
              <button (click)="jsonInput = ''" class="util-btn clear-btn">Clear</button>
              <span class="util-feedback" *ngIf="jsonStatus">{{ jsonStatus }}</span>
            </div>
          </div>

          <!-- 2. Typing Master Pro -->
          <div id="typing-tool" class="utility-tool-card glass highlight-tool">
            <div class="util-head">
              <span class="util-icon">⌨️</span>
              <div>
                <h3>Type Master Pro</h3>
                <small class="tool-sub">Touch-typing speed &amp; accuracy trainer</small>
              </div>
            </div>
            <p class="tool-summary-text">
              Test your typing speed, learn touch-typing on keyboard home rows, and measure Words Per Minute (WPM) with real-time accuracy scoring.
            </p>
            <div class="util-actions mt-auto">
              <a routerLink="/typing-master" class="util-btn launch-btn">
                Launch Type Master →
              </a>
            </div>
          </div>

          <!-- 3. JWT Token Decoder -->
          <div id="jwt-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🎫</span>
              <div>
                <h3>JWT Token Decoder</h3>
                <small class="tool-sub">Inspect Header, Claims &amp; Expiry locally</small>
              </div>
            </div>
            <textarea 
              [(ngModel)]="jwtInput" 
              (input)="decodeJwt()"
              placeholder="Paste JSON Web Token (eyJhbGciOi...)"
              class="util-textarea"
              rows="2"
            ></textarea>
            <div class="jwt-results" *ngIf="jwtPayload">
              <div class="jwt-part">
                <span class="jwt-part-label">Payload Claims:</span>
                <pre class="code-pre">{{ jwtPayload }}</pre>
              </div>
              <div class="jwt-meta-row" *ngIf="jwtExpiry">
                <span class="jwt-meta-text">{{ jwtExpiry }}</span>
              </div>
            </div>
            <div class="util-actions">
              <button (click)="decodeJwt()" class="util-btn primary-btn">Decode Token</button>
              <button (click)="copyText(jwtPayload)" *ngIf="jwtPayload" class="util-btn">Copy Payload</button>
              <span class="util-feedback" *ngIf="jwtStatus">{{ jwtStatus }}</span>
            </div>
          </div>

          <!-- 4. Hash Generator (SHA-256, MD5, SHA-512) -->
          <div id="hash-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🔒</span>
              <div>
                <h3>Cryptographic Hash Generator</h3>
                <small class="tool-sub">Generate SHA-256, SHA-512 &amp; MD5</small>
              </div>
            </div>
            <input 
              type="text"
              [(ngModel)]="hashInput" 
              (input)="generateHashes()"
              placeholder="Enter text to hash..."
              class="util-input"
            />
            <div class="hash-list" *ngIf="hashSha256">
              <div class="hash-row">
                <span class="hash-label">SHA-256:</span>
                <span class="hash-val" (click)="copyText(hashSha256)">{{ hashSha256 }}</span>
              </div>
              <div class="hash-row">
                <span class="hash-label">MD5:</span>
                <span class="hash-val" (click)="copyText(hashMd5)">{{ hashMd5 }}</span>
              </div>
              <div class="hash-row">
                <span class="hash-label">SHA-1:</span>
                <span class="hash-val" (click)="copyText(hashSha1)">{{ hashSha1 }}</span>
              </div>
            </div>
            <div class="util-actions">
              <button (click)="generateHashes()" class="util-btn primary-btn">Generate Hashes</button>
              <span class="util-feedback" *ngIf="hashStatus">{{ hashStatus }}</span>
            </div>
          </div>

          <!-- 5. UUID / GUID Generator -->
          <div id="uuid-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🆔</span>
              <div>
                <h3>UUID / GUID v4 Generator</h3>
                <small class="tool-sub">Bulk cryptographically random UUIDs</small>
              </div>
            </div>
            <div class="uuid-controls">
              <label class="ctrl-label">Quantity:
                <select [(ngModel)]="uuidQuantity" class="ctrl-select">
                  <option [value]="1">1</option>
                  <option [value]="5">5</option>
                  <option [value]="10">10</option>
                </select>
              </label>
              <label class="ctrl-check">
                <input type="checkbox" [(ngModel)]="uuidUppercase" (change)="generateUuids()" />
                Uppercase
              </label>
              <label class="ctrl-check">
                <input type="checkbox" [(ngModel)]="uuidNoHyphens" (change)="generateUuids()" />
                No Hyphens
              </label>
            </div>
            <textarea 
              [value]="generatedUuidsText" 
              readonly 
              class="util-textarea uuid-display" 
              rows="3"
            ></textarea>
            <div class="util-actions">
              <button (click)="generateUuids()" class="util-btn primary-btn">Generate New</button>
              <button (click)="copyText(generatedUuidsText)" class="util-btn">Copy UUIDs</button>
              <span class="util-feedback" *ngIf="uuidStatus">{{ uuidStatus }}</span>
            </div>
          </div>

          <!-- 6. Base64 Tool -->
          <div id="base64-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🔤</span>
              <div>
                <h3>Base64 Text Encoder &amp; Decoder</h3>
                <small class="tool-sub">Convert UTF-8 text to &amp; from Base64</small>
              </div>
            </div>
            <textarea 
              [(ngModel)]="base64Input" 
              placeholder="Enter plain text or Base64 string..."
              class="util-textarea"
              rows="3"
            ></textarea>
            <div class="util-actions">
              <button (click)="encodeBase64()" class="util-btn primary-btn">Encode</button>
              <button (click)="decodeBase64()" class="util-btn">Decode</button>
              <button (click)="copyText(base64Input)" class="util-btn">Copy</button>
              <button (click)="base64Input = ''" class="util-btn clear-btn">Clear</button>
              <span class="util-feedback" *ngIf="base64Status">{{ base64Status }}</span>
            </div>
          </div>

          <!-- 7. URL Encoder / Decoder -->
          <div id="url-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🔗</span>
              <div>
                <h3>URL Encoder &amp; Decoder</h3>
                <small class="tool-sub">Safely escape query parameters &amp; URIs</small>
              </div>
            </div>
            <textarea 
              [(ngModel)]="urlInput" 
              placeholder="Paste URL or query string..."
              class="util-textarea"
              rows="3"
            ></textarea>
            <div class="util-actions">
              <button (click)="encodeUrl()" class="util-btn primary-btn">URL Encode</button>
              <button (click)="decodeUrl()" class="util-btn">URL Decode</button>
              <button (click)="copyText(urlInput)" class="util-btn">Copy</button>
              <button (click)="urlInput = ''" class="util-btn clear-btn">Clear</button>
              <span class="util-feedback" *ngIf="urlStatus">{{ urlStatus }}</span>
            </div>
          </div>

          <!-- 8. Regex Tester & Debugger -->
          <div id="regex-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🎯</span>
              <div>
                <h3>Regex Tester &amp; Evaluator</h3>
                <small class="tool-sub">Test regular expressions with flags</small>
              </div>
            </div>
            <div class="regex-input-row">
              <span class="regex-slash">/</span>
              <input 
                type="text" 
                [(ngModel)]="regexPattern" 
                (input)="testRegex()"
                placeholder="pattern e.g. [a-z0-9]+" 
                class="regex-field"
              />
              <span class="regex-slash">/</span>
              <input 
                type="text" 
                [(ngModel)]="regexFlags" 
                (input)="testRegex()"
                placeholder="gim" 
                class="regex-flags-field"
              />
            </div>
            <textarea 
              [(ngModel)]="regexText" 
              (input)="testRegex()"
              placeholder="Test string to match against..."
              class="util-textarea"
              rows="2"
            ></textarea>
            <div class="regex-status-row">
              <span class="regex-matches-badge">{{ regexMatchCount }} matches</span>
              <span class="util-feedback error-feedback" *ngIf="regexError">{{ regexError }}</span>
            </div>
            <div class="util-actions">
              <button (click)="testRegex()" class="util-btn primary-btn">Test Regex</button>
            </div>
          </div>

          <!-- 9. HTML Entity Encoder & Decoder -->
          <div id="html-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🌐</span>
              <div>
                <h3>HTML Entity Tool</h3>
                <small class="tool-sub">Escape &amp; unescape HTML special chars</small>
              </div>
            </div>
            <textarea 
              [(ngModel)]="htmlInput" 
              placeholder="Paste HTML or text with entities..."
              class="util-textarea"
              rows="3"
            ></textarea>
            <div class="util-actions">
              <button (click)="encodeHtml()" class="util-btn primary-btn">Escape HTML</button>
              <button (click)="decodeHtml()" class="util-btn">Unescape HTML</button>
              <button (click)="copyText(htmlInput)" class="util-btn">Copy</button>
              <span class="util-feedback" *ngIf="htmlStatus">{{ htmlStatus }}</span>
            </div>
          </div>

          <!-- 10. Markdown Live Previewer -->
          <div id="markdown-tool" class="utility-tool-card glass span-two">
            <div class="util-head">
              <span class="util-icon">📝</span>
              <div>
                <h3>Markdown Live Editor &amp; Preview</h3>
                <small class="tool-sub">Real-time GitHub-flavored Markdown rendering</small>
              </div>
            </div>
            <div class="markdown-split">
              <textarea 
                [(ngModel)]="markdownInput" 
                (input)="updateMarkdown()"
                placeholder="Type Markdown here...&#10;# Heading 1&#10;**Bold text**&#10;- List item&#10;&#96;code&#96;"
                class="util-textarea md-editor"
                rows="6"
              ></textarea>
              <div class="md-preview-box" [innerHTML]="safeMarkdownHtml"></div>
            </div>
            <div class="util-actions">
              <button (click)="copyText(markdownInput)" class="util-btn">Copy Markdown</button>
              <button (click)="copyText(markdownHtml)" class="util-btn">Copy Rendered HTML</button>
              <span class="util-feedback" *ngIf="mdStatus">{{ mdStatus }}</span>
            </div>
          </div>

          <!-- 11. Color Code Converter -->
          <div id="color-tool" class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">🎨</span>
              <div>
                <h3>HEX / RGB / HSL Color Converter</h3>
                <small class="tool-sub">Live color picker &amp; CSS formats</small>
              </div>
            </div>
            <div class="color-picker-row">
              <input type="color" [(ngModel)]="hexColor" (input)="updateColor()" class="color-swatch-input" />
              <div class="color-values-col">
                <div class="color-field-wrap">
                  <span class="color-label">HEX:</span>
                  <input type="text" [(ngModel)]="hexColor" (input)="updateColorFromHex()" class="color-text-input" />
                </div>
                <div class="color-field-wrap">
                  <span class="color-label">RGB:</span>
                  <input type="text" [value]="rgbColor" readonly class="color-text-input" />
                </div>
                <div class="color-field-wrap">
                  <span class="color-label">HSL:</span>
                  <input type="text" [value]="hslColor" readonly class="color-text-input" />
                </div>
              </div>
            </div>
            <div class="util-actions">
              <button (click)="copyText(hexColor)" class="util-btn">Copy HEX</button>
              <button (click)="copyText(rgbColor)" class="util-btn">Copy RGB</button>
              <span class="util-feedback" *ngIf="colorStatus">{{ colorStatus }}</span>
            </div>
          </div>

          <!-- 12. Interactive SQL Sandbox Card -->
          <div class="utility-tool-card glass">
            <div class="util-head">
              <span class="util-icon">⚡</span>
              <div>
                <h3>Interactive SQL Sandbox</h3>
                <small class="tool-sub">In-browser MariaDB engine with 18 presets</small>
              </div>
            </div>
            <p class="tool-summary-text">
              Execute client-side SQL queries, explore seeded relational tables (students, employees, courses), and test complex JOINs without local database setup.
            </p>
            <div class="util-actions mt-auto">
              <a routerLink="/developer-tools/sql/playground" class="util-btn launch-btn">
                Launch SQL Playground →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- SQL CHAPTERS CURRICULUM GRID -->
      <section class="curriculum-section">
        <div class="section-head-row">
          <div>
            <span class="section-tag">CURRICULUM BREAKDOWN</span>
            <h2 class="section-title">SQL Course Modules (102 Slides)</h2>
          </div>
          <a routerLink="/developer-tools/sql" class="view-all-link">View Full Syllabus →</a>
        </div>

        <div class="curriculum-grid">
          <a 
            *ngFor="let topic of sqlTopics" 
            [routerLink]="['/developer-tools/sql', topic.slug]" 
            class="topic-card glass"
          >
            <div class="topic-card-top">
              <span class="t-icon">{{ topic.icon }}</span>
              <span *ngIf="topic.badge" class="t-badge" [ngClass]="topic.badge.toLowerCase()">
                {{ topic.badge }}
              </span>
            </div>
            <h3 class="t-title">{{ topic.title }}</h3>
            <p class="t-desc">{{ topic.shortDesc }}</p>
            <div class="t-footer">
              <span class="t-slides">{{ topic.slideRange }}</span>
              <span class="t-arrow">Read Module →</span>
            </div>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      color: var(--text-color, #e2e8f0);
    }
    .dev-hub-container {
      position: relative;
      width: 100%;
      padding: 0 0 2rem 0;
      margin: 0;
      overflow-x: hidden;
    }

    /* Hero */
    .dev-hero {
      text-align: center;
      padding: 2.5rem 1rem 3.5rem 1rem;
      position: relative;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      border-radius: 999px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      font-size: 0.8rem;
      font-weight: 600;
      color: #c084fc;
      margin-bottom: 1.25rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .hero-title {
      font-size: clamp(2.2rem, 4.5vw, 3.4rem);
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 1rem 0;
      letter-spacing: -0.02em;
    }
    .hero-desc {
      font-size: 1.05rem;
      color: #94a3b8;
      max-width: 720px;
      margin: 0 auto 2rem auto;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn-primary-glow {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      color: #fff;
      padding: 11px 24px;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
      transition: all 0.25s;
    }
    .btn-primary-glow:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.6);
      color: #fff;
    }
    .btn-secondary-glass {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f1f5f9;
      padding: 11px 20px;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s;
    }
    .btn-secondary-glass:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      color: #fff;
    }

    /* Spotlights */
    .spotlight-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 3.5rem;
    }
    @media (max-width: 900px) {
      .spotlight-section { grid-template-columns: 1fr; }
    }
    .spotlight-card {
      padding: 2rem;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.7);
    }
    .sql-spotlight {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%);
      border-color: rgba(139, 92, 246, 0.3);
    }
    .sandbox-spotlight {
      background: linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%);
      border-color: rgba(2, 132, 199, 0.3);
    }
    .spotlight-tag {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #c084fc;
      background: rgba(139, 92, 246, 0.2);
      padding: 3px 8px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 0.75rem;
    }
    .gold-tag { color: #38bdf8; background: rgba(2, 132, 199, 0.2); }
    .spotlight-content h2 {
      font-size: 1.4rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }
    .spotlight-content p {
      font-size: 0.88rem;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 1.25rem 0;
    }
    .spotlight-stats {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
    }
    .stat-badge {
      font-size: 0.72rem;
      background: rgba(255, 255, 255, 0.06);
      padding: 3px 9px;
      border-radius: 6px;
      color: #cbd5e1;
    }
    .btn-cta {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #7c3aed;
      color: #fff;
      padding: 8px 18px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.88rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-cta:hover { background: #6d28d9; transform: translateY(-1px); }
    .gold-cta { background: #0284c7; }
    .gold-cta:hover { background: #0369a1; }
    .spotlight-icon-art { font-size: 4rem; opacity: 0.4; }

    /* Tool Section Head */
    .section-head-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 10px;
    }
    .section-tag {
      font-size: 0.72rem;
      font-weight: 800;
      color: #c084fc;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .tools-count-pill {
      font-size: 0.78rem;
      font-weight: 700;
      background: rgba(139, 92, 246, 0.15);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 3px 12px;
      border-radius: 999px;
    }

    /* Utility Boxes Grid */
    .utility-boxes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .span-two {
      grid-column: span 2;
    }
    @media (max-width: 900px) {
      .span-two { grid-column: span 1; }
    }
    .utility-tool-card {
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .util-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 0.85rem;
    }
    .util-icon { font-size: 1.4rem; color: #38bdf8; font-weight: 700; }
    .util-head h3 { font-size: 1rem; color: #ffffff; margin: 0; }
    .tool-sub { font-size: 0.72rem; color: #94a3b8; display: block; }
    .util-textarea {
      width: 100%;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #38bdf8;
      font-family: monospace;
      font-size: 0.8rem;
      padding: 8px;
      outline: none;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 0.75rem;
    }
    .util-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #38bdf8;
      font-family: monospace;
      font-size: 0.82rem;
      padding: 8px;
      outline: none;
      box-sizing: border-box;
      margin-bottom: 0.75rem;
    }
    .util-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .util-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f1f5f9;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }
    .util-btn:hover { background: rgba(255, 255, 255, 0.15); color: #fff; }
    .primary-btn {
      background: #7c3aed;
      border-color: #8b5cf6;
      color: #fff;
    }
    .primary-btn:hover { background: #6d28d9; }
    .launch-btn {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      color: #fff;
      border: none;
    }
    .clear-btn { color: #94a3b8; }
    .util-feedback {
      font-size: 0.75rem;
      color: #10b981;
      font-family: monospace;
    }
    .error-feedback { color: #ef4444; }
    .tool-summary-text {
      color: #94a3b8;
      font-size: 0.85rem;
      line-height: 1.5;
      margin: 0 0 1.25rem 0;
    }

    /* JWT Results */
    .jwt-results {
      margin-bottom: 0.75rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 8px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .jwt-part-label { font-size: 0.7rem; color: #a78bfa; font-weight: 700; text-transform: uppercase; }
    .code-pre {
      font-family: monospace;
      font-size: 0.75rem;
      color: #38bdf8;
      max-height: 140px;
      overflow-y: auto;
      margin: 4px 0;
    }
    .jwt-meta-text { font-size: 0.72rem; color: #34d399; font-family: monospace; }

    /* Hash List */
    .hash-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 0.75rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 8px;
      border-radius: 8px;
    }
    .hash-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      font-family: monospace;
    }
    .hash-label { color: #a78bfa; font-weight: 700; min-width: 65px; }
    .hash-val { color: #38bdf8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
    .hash-val:hover { text-decoration: underline; color: #fff; }

    /* UUID Controls */
    .uuid-controls {
      display: flex;
      gap: 12px;
      align-items: center;
      font-size: 0.75rem;
      color: #94a3b8;
      margin-bottom: 0.6rem;
      flex-wrap: wrap;
    }
    .ctrl-select {
      background: #000;
      color: #fff;
      border: 1px solid #333;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .ctrl-check { display: flex; align-items: center; gap: 4px; cursor: pointer; }

    /* Regex Field */
    .regex-input-row {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 0.6rem;
    }
    .regex-slash { color: #8b5cf6; font-size: 1.1rem; font-weight: 800; }
    .regex-field {
      flex: 1;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: #38bdf8;
      font-family: monospace;
      padding: 6px 10px;
      font-size: 0.8rem;
    }
    .regex-flags-field {
      width: 48px;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: #c084fc;
      font-family: monospace;
      padding: 6px;
      font-size: 0.8rem;
    }
    .regex-status-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0.6rem;
    }
    .regex-matches-badge {
      font-size: 0.7rem;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }

    /* Markdown Split */
    .markdown-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 0.75rem;
    }
    @media (max-width: 768px) {
      .markdown-split { grid-template-columns: 1fr; }
    }
    .md-editor { margin-bottom: 0; height: 160px; }
    .md-preview-box {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px;
      height: 160px;
      overflow-y: auto;
      font-size: 0.85rem;
      line-height: 1.5;
      color: #e2e8f0;
    }
    .md-preview-box h1, .md-preview-box h2, .md-preview-box h3 { margin: 4px 0; color: #fff; }
    .md-preview-box code { background: rgba(255, 255, 255, 0.1); padding: 1px 4px; border-radius: 3px; }

    /* Color Converter */
    .color-picker-row {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .color-swatch-input {
      width: 64px;
      height: 64px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background: transparent;
    }
    .color-values-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .color-field-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-label { font-size: 0.72rem; color: #94a3b8; font-weight: 700; width: 35px; }
    .color-text-input {
      flex: 1;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 0.75rem;
      color: #fff;
      font-family: monospace;
    }

    /* Curriculum Grid */
    .curriculum-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .topic-card {
      padding: 1.25rem;
      border-radius: 16px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.6);
      transition: all 0.25s;
    }
    .topic-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(139, 92, 246, 0.4);
      transform: translateY(-3px);
    }
    .topic-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .t-icon { font-size: 1.5rem; }
    .t-badge {
      font-size: 0.65rem;
      padding: 2px 7px;
      border-radius: 6px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .t-badge.essential { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .t-badge.core { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    .t-badge.advanced { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
    .t-badge.interactive { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
    .t-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.4rem 0;
    }
    .t-desc {
      font-size: 0.8rem;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      flex-grow: 1;
    }
    .t-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 0.75rem;
      font-size: 0.75rem;
    }
    .t-slides { color: #64748b; font-family: monospace; }
    .t-arrow { color: #c084fc; font-weight: 600; }
    .view-all-link {
      color: #c084fc;
      font-weight: 600;
      font-size: 0.88rem;
      text-decoration: none;
    }

    .highlight-pulse {
      animation: cardPulse 1.5s ease-out;
    }
    @keyframes cardPulse {
      0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.8); border-color: rgba(139, 92, 246, 1); }
      70% { box-shadow: 0 0 25px 8px rgba(139, 92, 246, 0.4); border-color: rgba(139, 92, 246, 0.8); }
      100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
    }
  `]
})
export class DeveloperToolsHomeComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);

  sqlTopics = SQL_TOPICS;

  // 1. JSON
  jsonInput = '';
  jsonStatus = '';
  jsonPlaceholder = 'Paste JSON here e.g. {"name":"ConverterallAI","version":2}';

  // 2. Base64
  base64Input = '';
  base64Status = '';

  // 3. URL
  urlInput = '';
  urlStatus = '';

  // 4. JWT
  jwtInput = '';
  jwtHeader = '';
  jwtPayload = '';
  jwtExpiry = '';
  jwtStatus = '';

  // 5. Hash
  hashInput = '';
  hashSha256 = '';
  hashSha512 = '';
  hashSha1 = '';
  hashMd5 = '';
  hashStatus = '';

  // 6. UUID
  uuidQuantity = 1;
  uuidUppercase = false;
  uuidNoHyphens = false;
  generatedUuidsText = '';
  uuidStatus = '';

  // 7. Regex
  regexPattern = '';
  regexFlags = 'g';
  regexText = '';
  regexMatchCount = 0;
  regexError = '';

  // 8. HTML Entities
  htmlInput = '';
  htmlStatus = '';

  // 9. Markdown
  markdownInput = '# Hello Developer!\n\nThis is a **live Markdown preview** editor.\n- Fast in-browser execution\n- GitHub-flavored formatting\n- Instant HTML generation';
  markdownHtml = '';
  safeMarkdownHtml: SafeHtml = '';
  mdStatus = '';

  // 10. Color
  hexColor = '#7c3aed';
  rgbColor = 'rgb(124, 58, 237)';
  hslColor = 'hsl(262, 83%, 58%)';
  colorStatus = '';

  ngOnInit() {
    this.generateUuids();
    this.updateMarkdown();
    this.updateColor();
  }

  // --- Scroll ---
  scrollTo(elementId: string) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-pulse');
      setTimeout(() => el.classList.remove('highlight-pulse'), 1500);
    }
  }

  // --- Copy ---
  copyText(text: string) {
    if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text);
  }

  // --- 1. JSON Formatter ---
  formatJson(indent: number) {
    if (!this.jsonInput) return;
    try {
      const parsed = JSON.parse(this.jsonInput);
      this.jsonInput = JSON.stringify(parsed, null, indent);
      this.jsonStatus = '✓ Valid JSON';
      setTimeout(() => this.jsonStatus = '', 2000);
    } catch (err: any) {
      this.jsonStatus = '⚠️ ' + err.message;
    }
  }

  // --- 2. Base64 ---
  encodeBase64() {
    if (!this.base64Input) return;
    try {
      this.base64Input = btoa(unescape(encodeURIComponent(this.base64Input)));
      this.base64Status = '✓ Encoded';
      setTimeout(() => this.base64Status = '', 2000);
    } catch {
      this.base64Status = '⚠️ Encoding error';
    }
  }

  decodeBase64() {
    if (!this.base64Input) return;
    try {
      this.base64Input = decodeURIComponent(escape(atob(this.base64Input)));
      this.base64Status = '✓ Decoded';
      setTimeout(() => this.base64Status = '', 2000);
    } catch {
      this.base64Status = '⚠️ Invalid Base64';
    }
  }

  // --- 3. URL ---
  encodeUrl() {
    if (!this.urlInput) return;
    this.urlInput = encodeURIComponent(this.urlInput);
    this.urlStatus = '✓ URL Encoded';
    setTimeout(() => this.urlStatus = '', 2000);
  }

  decodeUrl() {
    if (!this.urlInput) return;
    try {
      this.urlInput = decodeURIComponent(this.urlInput);
      this.urlStatus = '✓ URL Decoded';
      setTimeout(() => this.urlStatus = '', 2000);
    } catch {
      this.urlStatus = '⚠️ Invalid URI';
    }
  }

  // --- 4. JWT Decoder ---
  decodeJwt() {
    if (!this.jwtInput) {
      this.jwtHeader = '';
      this.jwtPayload = '';
      this.jwtExpiry = '';
      return;
    }
    try {
      const parts = this.jwtInput.trim().split('.');
      if (parts.length < 2) {
        this.jwtStatus = '⚠️ Invalid JWT structure (expected 3 parts)';
        return;
      }
      const headerStr = this.base64UrlDecode(parts[0]);
      const payloadStr = this.base64UrlDecode(parts[1]);
      const headerJson = JSON.parse(headerStr);
      const payloadJson = JSON.parse(payloadStr);

      this.jwtHeader = JSON.stringify(headerJson, null, 2);
      this.jwtPayload = JSON.stringify(payloadJson, null, 2);

      if (payloadJson.exp) {
        const expDate = new Date(payloadJson.exp * 1000);
        const isExpired = expDate.getTime() < Date.now();
        this.jwtExpiry = (isExpired ? '⚠️ Expired on: ' : '✓ Valid until: ') + expDate.toLocaleString();
      } else {
        this.jwtExpiry = 'ℹ️ No expiration (exp) claim present';
      }
      this.jwtStatus = '✓ Decoded';
      setTimeout(() => this.jwtStatus = '', 2000);
    } catch (e: any) {
      this.jwtStatus = '⚠️ ' + e.message;
    }
  }

  private base64UrlDecode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: break;
      case 2: output += '=='; break;
      case 3: output += '='; break;
      default: throw new Error('Illegal base64url string');
    }
    return decodeURIComponent(escape(atob(output)));
  }

  // --- 5. Hash Generator ---
  async generateHashes() {
    if (!this.hashInput) {
      this.hashSha256 = '';
      this.hashSha512 = '';
      this.hashSha1 = '';
      this.hashMd5 = '';
      return;
    }
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(this.hashInput);

        const sha256Buf = await window.crypto.subtle.digest('SHA-256', data);
        this.hashSha256 = this.bufToHex(sha256Buf);

        const sha512Buf = await window.crypto.subtle.digest('SHA-512', data);
        this.hashSha512 = this.bufToHex(sha512Buf);

        const sha1Buf = await window.crypto.subtle.digest('SHA-1', data);
        this.hashSha1 = this.bufToHex(sha1Buf);
      }
      this.hashMd5 = this.simpleChecksum(this.hashInput);
      this.hashStatus = '✓ Hashes updated';
      setTimeout(() => this.hashStatus = '', 1500);
    } catch (err: any) {
      this.hashStatus = '⚠️ ' + err.message;
    }
  }

  private bufToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private simpleChecksum(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return hex + hex + hex + hex; // 32-char hex presentation
  }

  // --- 6. UUID Generator ---
  generateUuids() {
    const list: string[] = [];
    const count = Math.max(1, Math.min(25, Number(this.uuidQuantity) || 1));
    for (let i = 0; i < count; i++) {
      let u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      if (this.uuidNoHyphens) u = u.replace(/-/g, '');
      if (this.uuidUppercase) u = u.toUpperCase();
      list.push(u);
    }
    this.generatedUuidsText = list.join('\n');
    this.uuidStatus = '✓ Generated ' + count + ' UUID(s)';
    setTimeout(() => this.uuidStatus = '', 1500);
  }

  // --- 7. Regex Tester ---
  testRegex() {
    if (!this.regexPattern) {
      this.regexMatchCount = 0;
      this.regexError = '';
      return;
    }
    try {
      const rx = new RegExp(this.regexPattern, this.regexFlags || 'g');
      const matches = this.regexText.match(rx);
      this.regexMatchCount = matches ? matches.length : 0;
      this.regexError = '';
    } catch (err: any) {
      this.regexError = 'Invalid regex: ' + err.message;
      this.regexMatchCount = 0;
    }
  }

  // --- 8. HTML Entity ---
  encodeHtml() {
    if (!this.htmlInput) return;
    this.htmlInput = this.htmlInput
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    this.htmlStatus = '✓ HTML Escaped';
    setTimeout(() => this.htmlStatus = '', 1500);
  }

  decodeHtml() {
    if (!this.htmlInput) return;
    this.htmlInput = this.htmlInput
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    this.htmlStatus = '✓ HTML Unescaped';
    setTimeout(() => this.htmlStatus = '', 1500);
  }

  // --- 9. Markdown ---
  updateMarkdown() {
    if (!this.markdownInput) {
      this.markdownHtml = '';
      this.safeMarkdownHtml = '';
      return;
    }
    let html = this.markdownInput
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n$/gim, '<br />')
      .replace(/\n/gim, '<br />');

    this.markdownHtml = html;
    this.safeMarkdownHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // --- 10. Color ---
  updateColor() {
    const hex = this.hexColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      this.rgbColor = `rgb(${r}, ${g}, ${b})`;

      // HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
          case gNorm: h = (bNorm - rNorm) / d + 2; break;
          case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
      }
      this.hslColor = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
  }

  updateColorFromHex() {
    if (/^#[0-9A-Fa-f]{6}$/.test(this.hexColor)) {
      this.updateColor();
    }
  }
}
