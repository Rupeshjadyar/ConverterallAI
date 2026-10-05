import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="json-tool-wrapper">
      <!-- Breadcrumb Header -->
      <div class="tool-breadcrumbs">
        <a routerLink="/" class="crumb-link">🏠 Home</a>
        <span class="crumb-sep">/</span>
        <a routerLink="/developer-tools" class="crumb-link">Developer Tools</a>
        <span class="crumb-sep">/</span>
        <span class="crumb-current">JSON Formatter &amp; Validator</span>
      </div>

      <!-- Main Tool Container -->
      <div class="tool-header glass">
        <div class="header-left">
          <div class="tool-badge-icon">&#123;&#125;</div>
          <div>
            <h1 class="tool-title">JSON Formatter &amp; Validator</h1>
            <p class="tool-subtitle">Prettify, format, validate, and minify your JSON data in real-time with instant error diagnostics.</p>
          </div>
        </div>

        <div class="header-actions">
          <button (click)="beautifyJson(2)" class="btn-action primary">
            <span>✨</span> Beautify (2 Spaces)
          </button>
          <button (click)="beautifyJson(4)" class="btn-action">
            <span>📐</span> Beautify (4 Spaces)
          </button>
          <button (click)="minifyJson()" class="btn-action">
            <span>🗜️</span> Minify
          </button>
          <button (click)="loadSampleJson()" class="btn-action ghost">
            <span>📋</span> Load Sample
          </button>
          <button (click)="clearAll()" class="btn-action danger">
            <span>🗑️</span> Clear
          </button>
        </div>
      </div>

      <!-- Error / Success Notification Bar -->
      <div *ngIf="statusMessage" class="status-banner" [ngClass]="isError ? 'banner-error' : 'banner-success'">
        <span class="banner-icon">{{ isError ? '❌' : '✅' }}</span>
        <span class="banner-text">{{ statusMessage }}</span>
      </div>

      <!-- Two-Panel Split Stage (Input -> Output) -->
      <div class="json-split-stage">
        <!-- Panel 1: Input JSON -->
        <div class="json-panel glass">
          <div class="panel-topbar">
            <div class="panel-label">
              <span class="panel-dot"></span>
              <strong>Input JSON</strong>
              <small class="meta-tag">{{ inputLength }} chars</small>
            </div>
            <div class="panel-controls">
              <button (click)="pasteFromClipboard()" class="btn-micro" title="Paste from clipboard">
                📋 Paste
              </button>
            </div>
          </div>

          <div class="editor-area">
            <textarea
              [(ngModel)]="rawJson"
              (input)="onInputChange()"
              placeholder='Paste or type your raw JSON here...&#10;&#10;{\n  "name": "ConverterAll AI",\n  "version": "2.0"\n}'
              class="code-textarea"
              spellcheck="false"
            ></textarea>
          </div>
        </div>

        <!-- Transform Arrow (Desktop Divider) -->
        <div class="transform-divider">
          <div class="arrow-circle">
            <span>➔</span>
          </div>
        </div>

        <!-- Panel 2: Formatted JSON -->
        <div class="json-panel glass">
          <div class="panel-topbar">
            <div class="panel-label">
              <span class="panel-dot output-dot"></span>
              <strong>Formatted JSON</strong>
              <small class="meta-tag" *ngIf="formattedJson">{{ outputLength }} chars • {{ lineCount }} lines</small>
            </div>
            <div class="panel-controls">
              <button (click)="copyFormattedJson()" class="btn-micro primary" [disabled]="!formattedJson">
                {{ copySuccess ? '✓ Copied!' : '📋 Copy JSON' }}
              </button>
              <button (click)="downloadJsonFile()" class="btn-micro" [disabled]="!formattedJson">
                ⬇️ Download
              </button>
            </div>
          </div>

          <div class="editor-area output-area">
            <textarea
              [value]="formattedJson"
              readonly
              placeholder="Formatted, validated JSON output will appear here..."
              class="code-textarea output-textarea"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="metrics-strip glass" *ngIf="formattedJson">
        <div class="metric-item">
          <span class="m-label">Status</span>
          <span class="m-val success">Valid JSON ✓</span>
        </div>
        <div class="metric-item">
          <span class="m-label">Total Characters</span>
          <span class="m-val">{{ outputLength }}</span>
        </div>
        <div class="metric-item">
          <span class="m-label">Total Lines</span>
          <span class="m-val">{{ lineCount }}</span>
        </div>
        <div class="metric-item">
          <span class="m-label">Estimated Size</span>
          <span class="m-val">{{ byteSize }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      background: var(--bg-color, #030303);
      color: var(--text-color, #e2e8f0);
      box-sizing: border-box;
      padding: 1.5rem 2rem 4rem 2rem;
    }

    .tool-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #94a3b8;
      margin-bottom: 1.25rem;
    }
    .crumb-link {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .crumb-link:hover {
      color: #a78bfa;
    }
    .crumb-sep {
      color: #475569;
    }
    .crumb-current {
      color: #e2e8f0;
      font-weight: 600;
    }

    .glass {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
    }

    .tool-header {
      padding: 1.5rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
      border: 1px solid rgba(139, 92, 246, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .tool-badge-icon {
      width: 54px;
      height: 54px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.25));
      border: 1px solid rgba(139, 92, 246, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      font-family: monospace;
      font-weight: 800;
      color: #c4b5fd;
      flex-shrink: 0;
    }

    .tool-title {
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0 0 0.25rem 0;
      background: linear-gradient(135deg, #ffffff 40%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }

    .tool-subtitle {
      font-size: 0.88rem;
      color: #94a3b8;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .btn-action {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #e2e8f0;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      transition: all 0.2s ease;
    }

    .btn-action:hover {
      background: rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.4);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .btn-action.primary {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-color: #8b5cf6;
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35);
    }

    .btn-action.primary:hover {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
    }

    .btn-action.ghost {
      background: rgba(6, 182, 212, 0.1);
      border-color: rgba(6, 182, 212, 0.25);
      color: #67e8f9;
    }

    .btn-action.ghost:hover {
      background: rgba(6, 182, 212, 0.22);
      color: #ffffff;
    }

    .btn-action.danger {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.25);
      color: #fca5a5;
    }

    .btn-action.danger:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #ffffff;
    }

    .status-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 500;
      margin-bottom: 1.25rem;
      animation: fadeIn 0.2s ease;
    }

    .banner-success {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #6ee7b7;
    }

    .banner-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
    }

    .json-split-stage {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 1rem;
      align-items: stretch;
      min-height: 520px;
    }

    .transform-divider {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .arrow-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.18);
      border: 1px solid rgba(139, 92, 246, 0.35);
      color: #c4b5fd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
    }

    .json-panel {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    }

    .panel-topbar {
      padding: 0.75rem 1rem;
      background: rgba(0, 0, 0, 0.35);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .panel-label {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.9rem;
      color: #f1f5f9;
    }

    .panel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #8b5cf6;
      box-shadow: 0 0 8px #8b5cf6;
    }

    .panel-dot.output-dot {
      background: #06b6d4;
      box-shadow: 0 0 8px #06b6d4;
    }

    .meta-tag {
      font-size: 0.72rem;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.1rem 0.45rem;
      border-radius: 6px;
    }

    .panel-controls {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .btn-micro {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      padding: 0.35rem 0.65rem;
      border-radius: 8px;
      font-size: 0.76rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-micro:hover:not(:disabled) {
      background: rgba(139, 92, 246, 0.25);
      border-color: rgba(139, 92, 246, 0.4);
      color: #ffffff;
    }

    .btn-micro.primary {
      background: rgba(139, 92, 246, 0.22);
      border-color: rgba(139, 92, 246, 0.4);
      color: #c4b5fd;
    }

    .btn-micro:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .editor-area {
      flex: 1;
      display: flex;
      min-height: 440px;
      background: rgba(5, 7, 15, 0.7);
    }

    .code-textarea {
      width: 100%;
      min-height: 440px;
      padding: 1rem 1.25rem;
      background: transparent;
      border: none;
      color: #f8fafc;
      font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
      font-size: 0.88rem;
      line-height: 1.6;
      resize: vertical;
      outline: none;
      white-space: pre;
      box-sizing: border-box;
    }

    .output-textarea {
      color: #67e8f9;
      background: rgba(0, 0, 0, 0.2);
    }

    .metrics-strip {
      margin-top: 1.25rem;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .metric-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.84rem;
    }

    .m-label {
      color: #94a3b8;
    }

    .m-val {
      font-weight: 700;
      color: #f1f5f9;
    }

    .m-val.success {
      color: #34d399;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 900px) {
      .json-split-stage {
        grid-template-columns: 1fr;
      }
      .transform-divider {
        padding: 0.5rem 0;
      }
      .arrow-circle span {
        transform: rotate(90deg);
      }
      :host {
        padding: 1rem;
      }
    }
  `]
})
export class JsonFormatterComponent implements OnInit {
  private seo = inject(SeoService);

  rawJson = '';
  formattedJson = '';
  statusMessage = '';
  isError = false;
  copySuccess = false;

  get inputLength(): number {
    return this.rawJson ? this.rawJson.length : 0;
  }

  get outputLength(): number {
    return this.formattedJson ? this.formattedJson.length : 0;
  }

  get lineCount(): number {
    return this.formattedJson ? this.formattedJson.split('\n').length : 0;
  }

  get byteSize(): string {
    if (!this.formattedJson) return '0 B';
    const bytes = new Blob([this.formattedJson]).size;
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(2) + ' KB';
  }

  ngOnInit() {
    this.seo.updateTags({
      title: 'JSON Formatter & Validator Online – Prettify, Minify & Inspect JSON',
      description: 'Free in-browser JSON Formatter, Prettifier, Validator and Minifier. Clean format, validate syntax error diagnostics, and copy formatted JSON.',
      keywords: 'json formatter, json prettifier, json validator, json minifier, format json online, validate json syntax',
      canonicalUrl: 'https://converterallai.com/developer-tools/json-formatter'
    });

    // Default sample on initial load
    this.loadSampleJson();
  }

  onInputChange() {
    this.statusMessage = '';
    this.isError = false;
  }

  beautifyJson(spaces: number) {
    if (!this.rawJson || !this.rawJson.trim()) {
      this.statusMessage = 'Please enter JSON input first.';
      this.isError = true;
      return;
    }

    try {
      const parsed = JSON.parse(this.rawJson);
      this.formattedJson = JSON.stringify(parsed, null, spaces);
      this.statusMessage = `Valid JSON formatted with ${spaces} spaces indentation!`;
      this.isError = false;
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Syntax Error: ${e.message}`;
    }
  }

  minifyJson() {
    if (!this.rawJson || !this.rawJson.trim()) {
      this.statusMessage = 'Please enter JSON input first.';
      this.isError = true;
      return;
    }

    try {
      const parsed = JSON.parse(this.rawJson);
      this.formattedJson = JSON.stringify(parsed);
      this.statusMessage = 'JSON successfully minified (whitespace removed)!';
      this.isError = false;
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Syntax Error: ${e.message}`;
    }
  }

  loadSampleJson() {
    const sample = {
      product: "ConverterAll AI Developer Suite",
      version: "2.4.0",
      active: true,
      features: [
        "In-Browser SQL Query Engine",
        "Touch Typing Master Pro",
        "JSON Prettifier & Minifier",
        "Interactive Venn Diagram Joins"
      ],
      author: {
        name: "Developer",
        skills: ["Angular", "TypeScript", "MySQL", "CSS3"]
      },
      stats: {
        totalTools: 3,
        usersServed: 150000,
        rating: 4.95
      }
    };
    this.rawJson = JSON.stringify(sample);
    this.beautifyJson(2);
  }

  clearAll() {
    this.rawJson = '';
    this.formattedJson = '';
    this.statusMessage = '';
    this.isError = false;
  }

  async pasteFromClipboard() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        this.rawJson = text;
        this.beautifyJson(2);
      } catch {
        this.statusMessage = 'Clipboard access denied. Please paste manually into the editor.';
        this.isError = true;
      }
    }
  }

  async copyFormattedJson() {
    if (!this.formattedJson) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(this.formattedJson);
      this.copySuccess = true;
      setTimeout(() => (this.copySuccess = false), 2000);
    }
  }

  downloadJsonFile() {
    if (!this.formattedJson || typeof document === 'undefined') return;
    const blob = new Blob([this.formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}
