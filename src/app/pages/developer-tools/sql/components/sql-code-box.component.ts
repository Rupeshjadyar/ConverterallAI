import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sql-code-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sql-code-container">
      <div class="code-header">
        <div class="window-controls">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
          <span class="window-title">{{ title || 'MySQL Terminal / Query' }}</span>
        </div>
        <div class="header-actions">
          <button class="action-btn copy-btn" (click)="copyCode()" [class.copied]="copied()">
            <span *ngIf="!copied()">📋 Copy</span>
            <span *ngIf="copied()">✓ Copied!</span>
          </button>
          <button *ngIf="isRunnable" class="action-btn run-btn" (click)="runInPlayground()">
            ▶ Run Query
          </button>
        </div>
      </div>
      <div class="code-body">
        <pre><code>{{ code.trim() }}</code></pre>
      </div>
      <div *ngIf="output" class="terminal-output">
        <div class="output-label">
          <span class="terminal-prompt">&gt; Output (MariaDB / MySQL):</span>
        </div>
        <pre class="output-pre"><code>{{ output.trim() }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    .sql-code-container {
      background: rgba(10, 14, 26, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      overflow: hidden;
      margin: 1.25rem 0;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
    }
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 1rem;
      background: rgba(255, 255, 255, 0.04);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.8rem;
    }
    .window-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }
    .window-title {
      margin-left: 8px;
      color: #94a3b8;
      font-size: 0.78rem;
    }
    .header-actions {
      display: flex;
      gap: 8px;
    }
    .action-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #e2e8f0;
      border-radius: 6px;
      padding: 3px 9px;
      font-size: 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.25);
    }
    .copy-btn.copied {
      background: rgba(16, 185, 129, 0.2);
      border-color: #10b981;
      color: #34d399;
    }
    .run-btn {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.4), rgba(59, 130, 246, 0.4));
      border-color: rgba(139, 92, 246, 0.6);
      color: #c084fc;
      font-weight: 600;
    }
    .run-btn:hover {
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      color: #ffffff;
      box-shadow: 0 0 14px rgba(124, 58, 237, 0.5);
    }
    .code-body {
      padding: 1rem 1.25rem;
      overflow-x: auto;
      font-size: 0.88rem;
      line-height: 1.6;
    }
    .code-body pre {
      margin: 0;
      color: #38bdf8;
    }
    .code-body code {
      color: #cbd5e1;
    }
    .terminal-output {
      background: rgba(0, 0, 0, 0.45);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.85rem 1.25rem;
      font-size: 0.82rem;
    }
    .output-label {
      color: #10b981;
      font-size: 0.75rem;
      margin-bottom: 0.35rem;
      font-weight: 600;
    }
    .output-pre {
      margin: 0;
      color: #94a3b8;
      font-family: inherit;
      white-space: pre-wrap;
    }
  `]
})
export class SqlCodeBoxComponent {
  @Input() code: string = '';
  @Input() title: string = '';
  @Input() output?: string;
  @Input() isRunnable: boolean = true;

  private router = inject(Router);
  copied = signal<boolean>(false);

  copyCode() {
    if (!this.code) return;
    navigator.clipboard?.writeText(this.code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  runInPlayground() {
    this.router.navigate(['/developer-tools/sql/playground'], {
      queryParams: { q: this.code.trim() }
    });
  }
}
