import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="jf-app-container" [class.is-fullscreen]="isFullscreen">
      <!-- TOP NAVIGATION BAR (JSONFormatter.org Iconic Style) -->
      <header class="jf-navbar">
        <div class="jf-brand">
          <span class="jf-bracket">&#123;</span>
          <span class="jf-logo-text">JSON formatter</span>
          <span class="jf-bracket">&#125;</span>
        </div>

        <nav class="jf-nav-links">
          <button class="jf-nav-link active" (click)="beautifyJson()">JSON BEAUTIFIER</button>
          <button class="jf-nav-link" (click)="validateJson()">JSON PARSER</button>
          <button class="jf-nav-link" (click)="toggleViewMode()">{{ viewMode === 'tree' ? 'CODE VIEW' : 'TREE VIEW' }}</button>
          <button class="jf-nav-link" (click)="minifyJson()">MINIFIER</button>
          <button class="jf-nav-link" (click)="downloadJsonFile()">SAVE</button>
          <button class="jf-nav-link" (click)="loadSampleJson()">SAMPLE</button>
          <button class="jf-nav-link text-danger" (click)="clearAll()">CLEAR</button>
        </nav>
      </header>

      <!-- NOTIFICATION / STATUS POPUP -->
      <div *ngIf="statusMessage" class="jf-alert" [ngClass]="isError ? 'jf-alert-error' : 'jf-alert-success'">
        <div class="jf-alert-content">
          <span class="jf-alert-icon">{{ isError ? '❌' : '✅' }}</span>
          <span class="jf-alert-msg">{{ statusMessage }}</span>
        </div>
        <button class="jf-alert-close" (click)="statusMessage = ''">✕</button>
      </div>

      <!-- MAIN TEAL WORKSPACE CANVAS -->
      <div class="jf-workspace">
        <div class="jf-stage-grid">
          
          <!-- LEFT COLUMN: INPUT EDITOR -->
          <div class="jf-panel">
            <!-- Left Toolbar -->
            <div class="jf-toolbar">
              <div class="jf-toolbar-left">
                <button class="tool-icon-btn" title="Tree / Format" (click)="beautifyJson()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
                </button>
                <button class="tool-icon-btn" title="Align" (click)="beautifyJson()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
                </button>
                <button class="tool-icon-btn" title="Sort Keys" (click)="sortJsonKeys()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 4h18M3 8h12M3 12h8M15 12l4 4m0 0l4-4m-4 4V8"/></svg>
                </button>
                <button class="tool-icon-btn" title="Fix Quotes &amp; Formatting" (click)="repairJson()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </button>
                <button class="tool-icon-btn" title="Undo" (click)="undo()" [disabled]="historyIndex <= 0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                </button>
                <button class="tool-icon-btn" title="Redo" (click)="redo()" [disabled]="historyIndex >= history.length - 1">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
                </button>
              </div>

              <div class="jf-toolbar-right">
                <button class="jf-link-btn" (click)="loadSampleJson()">Sample</button>
                <button class="tool-icon-btn" title="Load from URL" (click)="openUrlPrompt()">🔗</button>
                <button class="tool-icon-btn" title="Upload File" (click)="fileInput.click()">📁</button>
                <button class="tool-icon-btn" title="Save / Download" (click)="downloadJsonFile()">💾</button>
                <button class="tool-icon-btn" title="Validate JSON" (click)="validateJson()">✔</button>
                <button class="tool-icon-btn" title="Print" (click)="printJson()">🖨️</button>
                <button class="tool-icon-btn" title="Clear Input" (click)="clearInput()">✕</button>
                <button class="tool-icon-btn" title="Paste / Copy" (click)="pasteFromClipboard()">📋</button>
                <button class="tool-icon-btn" title="Toggle Fullscreen" (click)="toggleFullscreen()">⛶</button>
              </div>
            </div>

            <!-- Left Editor Area with Line Numbers -->
            <div class="jf-editor-container">
              <div class="jf-line-gutter" #inputGutter>
                <div *ngFor="let num of inputLines; let i = index" class="gutter-num" [class.active-line]="cursorLine === num">
                  {{ num }}
                </div>
              </div>
              <textarea
                #inputTextarea
                class="jf-textarea"
                [(ngModel)]="rawJson"
                (input)="onRawJsonChange()"
                (scroll)="syncInputScroll()"
                (click)="updateCursorPos($event)"
                (keyup)="updateCursorPos($event)"
                placeholder="Paste or type raw JSON here..."
                spellcheck="false"
              ></textarea>
            </div>
          </div>

          <!-- CENTER COLUMN: ACTIONS STRIP (Iconic JSONFormatter buttons) -->
          <div class="jf-actions-strip">
            <button class="jf-btn-rect" (click)="fileInput.click()">
              Upload Data
            </button>
            <input #fileInput type="file" accept=".json,.txt" (change)="onFileUpload($event)" style="display: none;" />

            <button class="jf-btn-rect" (click)="validateJson()">
              Validate
            </button>

            <select class="jf-select-indent" [(ngModel)]="indentation" (change)="beautifyJson()">
              <option value="2">2 Tab Space</option>
              <option value="3">3 Tab Space</option>
              <option value="4">4 Tab Space</option>
              <option value="tab">1 Tab Character</option>
              <option value="compact">Compact / 0 Space</option>
            </select>

            <button class="jf-btn-rect jf-btn-primary" (click)="beautifyJson()">
              Format / Beautify
            </button>

            <!-- Promo Banner Badge like reference screenshot -->
            <div class="jf-card-promo">
              <div class="promo-text-sub">Instant AI</div>
              <div class="promo-text-main">Ready for a Surprise?</div>
            </div>

            <button class="jf-btn-rect" (click)="minifyJson()">
              Minify / Compact
            </button>

            <button class="jf-btn-rect" (click)="clearAll()">
              Clear All
            </button>
          </div>

          <!-- RIGHT COLUMN: OUTPUT EDITOR -->
          <div class="jf-panel">
            <!-- Right Toolbar -->
            <div class="jf-toolbar">
              <div class="jf-toolbar-left">
                <button class="tool-icon-btn" title="Tree / Code" (click)="toggleViewMode()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
                </button>
                <button class="tool-icon-btn" title="Align" (click)="beautifyJson()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
                </button>
                <button class="tool-icon-btn" title="Filter" (click)="sortJsonKeys()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                </button>
                <button class="tool-icon-btn" title="Tools" (click)="minifyJson()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
                <div class="jf-mode-select-wrap">
                  <select class="jf-mode-select" [(ngModel)]="viewMode">
                    <option value="code">Code ▾</option>
                    <option value="tree">Tree View</option>
                  </select>
                </div>
              </div>

              <div class="jf-toolbar-right">
                <button class="tool-icon-btn" title="Beautify" (click)="beautifyJson()">✨</button>
                <button class="tool-icon-btn" title="Clear Output" (click)="formattedJson = ''">✕</button>
                <button class="tool-icon-btn" title="Download JSON" (click)="downloadJsonFile()" [disabled]="!formattedJson">⬇</button>
                <button class="tool-icon-btn" title="Copy to Clipboard" (click)="copyFormattedJson()" [disabled]="!formattedJson">📋</button>
                <button class="tool-icon-btn" title="Toggle Fullscreen" (click)="toggleFullscreen()">⛶</button>
              </div>
            </div>

            <!-- Right Editor Area / Tree View -->
            <div class="jf-editor-container" *ngIf="viewMode === 'code'">
              <div class="jf-line-gutter" #outputGutter>
                <div *ngFor="let num of outputLines; let i = index" class="gutter-num" [class.active-line]="num === 1">
                  {{ num }}
                </div>
              </div>
              <textarea
                #outputTextarea
                class="jf-textarea output-code"
                [value]="formattedJson"
                readonly
                (scroll)="syncOutputScroll()"
                placeholder="Formatted, validated JSON output appears here..."
                spellcheck="false"
              ></textarea>
            </div>

            <!-- Tree View Mode -->
            <div class="jf-tree-container" *ngIf="viewMode === 'tree'">
              <div *ngIf="!parsedObject" class="tree-empty-msg">
                Please enter and format valid JSON to inspect interactive tree view.
              </div>
              <div *ngIf="parsedObject" class="tree-tree-root">
                <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: parsedObject, key: 'root', isRoot: true }"></ng-container>
              </div>
            </div>

            <!-- Status Bar at Bottom of Output -->
            <div class="jf-statusbar">
              <div class="status-left">
                <span>Ln: {{ cursorLine }}</span>
                <span class="status-spacer"></span>
                <span>Col: {{ currentCol }}</span>
              </div>
              <div class="status-right" *ngIf="formattedJson">
                <span>{{ outputLength }} chars</span>
                <span class="status-sep">|</span>
                <span>{{ lineCount }} lines</span>
                <span class="status-sep">|</span>
                <span>{{ byteSize }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Recursive Tree Node Template -->
    <ng-template #nodeTemplate let-data let-key="key" let-isRoot="isRoot">
      <div class="tree-node">
        <!-- Object or Array -->
        <div *ngIf="isObject(data)" class="tree-branch">
          <span class="tree-toggle" (click)="toggleNodeCollapse(key)">
            {{ isCollapsed(key) ? '▶' : '▼' }}
          </span>
          <span *ngIf="!isRoot" class="tree-key">"{{ key }}": </span>
          <span class="tree-type-badge">{{ isArray(data) ? '[' + data.length + ']' : '{' + getKeysCount(data) + '}' }}</span>

          <div class="tree-children" *ngIf="!isCollapsed(key)">
            <div *ngFor="let childKey of getObjectKeys(data)" class="tree-child-row">
              <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: data[childKey], key: childKey, isRoot: false }"></ng-container>
            </div>
          </div>
        </div>

        <!-- Primitive Values -->
        <div *ngIf="!isObject(data)" class="tree-leaf">
          <span class="tree-key">"{{ key }}": </span>
          <span [ngClass]="getValClass(data)">{{ formatPrimitive(data) }}</span>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .jf-app-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: calc(100vh - 80px);
      background: #00a884; /* Iconic JSONFormatter.org Teal Background */
      box-sizing: border-box;
    }

    .jf-app-container.is-fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 99999;
      background: #00a884;
    }

    /* TOP NAVBAR */
    .jf-navbar {
      background: #1b242f;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      height: 48px;
      border-bottom: 2px solid #009688;
      box-sizing: border-box;
      user-select: none;
    }

    .jf-brand {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.3px;
    }

    .jf-bracket {
      color: #00e676;
      font-size: 1.4rem;
      font-weight: 800;
      font-family: monospace;
    }

    .jf-logo-text {
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 600;
    }

    .jf-nav-links {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      overflow-x: auto;
    }

    .jf-nav-link {
      background: transparent;
      border: none;
      color: #b0bec5;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 0.35rem 0.6rem;
      border-radius: 4px;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .jf-nav-link:hover, .jf-nav-link.active {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    .jf-nav-link.text-danger {
      color: #ff8a80;
    }
    .jf-nav-link.text-danger:hover {
      background: rgba(255, 82, 82, 0.2);
    }

    /* ALERT / NOTIFICATION BANNER */
    .jf-alert {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 1.2rem;
      font-size: 0.88rem;
      font-weight: 600;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      animation: slideDown 0.2s ease;
    }
    .jf-alert-success {
      background: #e8f5e9;
      color: #2e7d32;
      border-bottom: 2px solid #81c784;
    }
    .jf-alert-error {
      background: #ffebee;
      color: #c62828;
      border-bottom: 2px solid #e57373;
    }
    .jf-alert-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .jf-alert-close {
      background: transparent;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      color: inherit;
    }

    /* WORKSPACE BODY */
    .jf-workspace {
      flex: 1;
      padding: 10px 14px 18px 14px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .jf-stage-grid {
      display: grid;
      grid-template-columns: 1fr 140px 1fr;
      gap: 12px;
      flex: 1;
      min-height: 580px;
      align-items: stretch;
    }

    /* PANELS (LEFT & RIGHT) */
    .jf-panel {
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    /* TOOLBAR */
    .jf-toolbar {
      background: #273746;
      color: #ecf0f1;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      user-select: none;
      flex-shrink: 0;
    }

    .jf-toolbar-left, .jf-toolbar-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .tool-icon-btn {
      background: transparent;
      border: none;
      color: #bdc3c7;
      width: 28px;
      height: 28px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.15s;
    }
    .tool-icon-btn:hover:not(:disabled) {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
    }
    .tool-icon-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .jf-link-btn {
      background: transparent;
      border: none;
      color: #ecf0f1;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .jf-link-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #00e676;
    }

    .jf-mode-select-wrap {
      margin-left: 4px;
    }
    .jf-mode-select {
      background: #34495e;
      color: #ffffff;
      border: 1px solid #4a627a;
      font-size: 0.78rem;
      font-weight: 600;
      border-radius: 3px;
      padding: 2px 6px;
      cursor: pointer;
      outline: none;
    }

    /* EDITOR CONTAINER WITH LINE NUMBERS */
    .jf-editor-container {
      flex: 1;
      display: flex;
      background: #ffffff;
      position: relative;
      overflow: hidden;
      min-height: 520px;
    }

    .jf-line-gutter {
      width: 44px;
      background: #f8fafc;
      border-right: 1px solid #e2e8f0;
      color: #94a3b8;
      font-family: Consolas, 'Fira Code', 'Courier New', monospace;
      font-size: 13px;
      line-height: 22px;
      text-align: right;
      padding: 6px 8px 6px 0;
      user-select: none;
      overflow: hidden;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .gutter-num {
      height: 22px;
      line-height: 22px;
    }
    .gutter-num.active-line {
      background: #fff9c4;
      color: #334155;
      font-weight: 700;
    }

    .jf-textarea {
      flex: 1;
      height: 100%;
      min-height: 520px;
      padding: 6px 10px;
      background: #ffffff;
      border: none;
      outline: none;
      color: #1e293b;
      font-family: Consolas, 'Fira Code', 'Courier New', monospace;
      font-size: 13px;
      line-height: 22px;
      white-space: pre;
      overflow-wrap: normal;
      overflow-x: auto;
      resize: none;
      tab-size: 2;
      box-sizing: border-box;
    }

    .jf-textarea.output-code {
      background: #fafbfc;
      color: #0f172a;
    }

    /* TREE VIEW */
    .jf-tree-container {
      flex: 1;
      padding: 12px 16px;
      overflow: auto;
      background: #fdfdfd;
      font-family: Consolas, 'Fira Code', monospace;
      font-size: 13px;
      min-height: 520px;
    }
    .tree-empty-msg {
      color: #94a3b8;
      font-style: italic;
      padding: 20px;
    }
    .tree-node {
      line-height: 24px;
    }
    .tree-toggle {
      display: inline-block;
      width: 14px;
      font-size: 10px;
      color: #64748b;
      cursor: pointer;
      user-select: none;
    }
    .tree-key {
      color: #8b5cf6;
      font-weight: 600;
    }
    .tree-type-badge {
      color: #94a3b8;
      font-size: 11px;
      margin-left: 4px;
    }
    .tree-children {
      padding-left: 18px;
      border-left: 1px dashed #cbd5e1;
      margin-left: 6px;
    }
    .val-string { color: #059669; }
    .val-number { color: #d97706; }
    .val-boolean { color: #2563eb; font-weight: 600; }
    .val-null { color: #94a3b8; font-style: italic; }

    /* STATUS BAR */
    .jf-statusbar {
      background: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      font-size: 11px;
      color: #64748b;
      user-select: none;
      flex-shrink: 0;
    }
    .status-left {
      display: flex;
      align-items: center;
    }
    .status-spacer {
      width: 12px;
    }
    .status-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .status-sep {
      color: #cbd5e1;
    }

    /* CENTER COLUMN ACTIONS */
    .jf-actions-strip {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding-top: 10px;
    }

    .jf-btn-rect {
      width: 100%;
      background: rgba(255, 255, 255, 0.18);
      border: 2px solid #ffffff;
      color: #ffffff;
      font-weight: 700;
      font-size: 13px;
      padding: 8px 10px;
      border-radius: 6px;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .jf-btn-rect:hover {
      background: #ffffff;
      color: #00a884;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.18);
    }
    .jf-btn-rect:active {
      transform: translateY(0);
    }

    .jf-btn-primary {
      background: #ffffff;
      color: #00a884;
      font-weight: 800;
    }
    .jf-btn-primary:hover {
      background: #e8f5e9;
      color: #00796b;
    }

    .jf-select-indent {
      width: 100%;
      background: #ffffff;
      border: 2px solid #ffffff;
      color: #334155;
      font-weight: 600;
      font-size: 13px;
      padding: 7px 8px;
      border-radius: 6px;
      cursor: pointer;
      outline: none;
      box-sizing: border-box;
    }

    /* Promo Badge like reference image */
    .jf-card-promo {
      width: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1));
      border: 1px dashed rgba(255,255,255,0.6);
      border-radius: 6px;
      padding: 10px 6px;
      text-align: center;
      color: #ffffff;
      user-select: none;
    }
    .promo-text-sub {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.9;
    }
    .promo-text-main {
      font-size: 12px;
      font-weight: 700;
      margin-top: 2px;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* RESPONSIVE LAYOUT */
    @media (max-width: 960px) {
      .jf-stage-grid {
        grid-template-columns: 1fr;
      }
      .jf-actions-strip {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
      .jf-btn-rect {
        width: auto;
        min-width: 130px;
      }
      .jf-select-indent {
        width: auto;
      }
      .jf-card-promo {
        display: none;
      }
    }
  `]
})
export class JsonFormatterComponent implements OnInit {
  private seo = inject(SeoService);

  @ViewChild('inputTextarea') inputTextareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('outputTextarea') outputTextareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputGutter') inputGutterRef!: ElementRef<HTMLDivElement>;
  @ViewChild('outputGutter') outputGutterRef!: ElementRef<HTMLDivElement>;

  rawJson = '';
  formattedJson = '';
  statusMessage = '';
  isError = false;
  indentation: string = '2';
  viewMode: 'code' | 'tree' = 'code';
  isFullscreen = false;

  cursorLine = 1;
  currentCol = 1;

  parsedObject: any = null;
  collapsedKeys = new Set<string>();

  // History stack for Undo / Redo
  history: string[] = [];
  historyIndex: number = -1;
  private isPushingHistory = true;

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

  get inputLines(): number[] {
    const count = (this.rawJson || '').split('\n').length;
    return Array.from({ length: Math.max(count, 24) }, (_, i) => i + 1);
  }

  get outputLines(): number[] {
    const count = (this.formattedJson || '').split('\n').length;
    return Array.from({ length: Math.max(count, 24) }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.seo.update({
      title: 'JSON Formatter & Validator - Free Online Beautifier & Parser',
      description: 'Format, validate, beautify, and minify your JSON data with line numbers, error diagnostics, tree view, and copy/download features.',
      keywords: 'json formatter, json beautifier, json validator, format json, json parser online'
    });

    this.loadSampleJson();
  }

  onRawJsonChange() {
    this.statusMessage = '';
    this.isError = false;
    this.pushHistory(this.rawJson);
  }

  private pushHistory(val: string) {
    if (!this.isPushingHistory) return;
    if (this.history[this.historyIndex] === val) return;

    // Truncate redo branches
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(val);
    if (this.history.length > 50) this.history.shift();
    this.historyIndex = this.history.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.isPushingHistory = false;
      this.rawJson = this.history[this.historyIndex] || '';
      this.beautifyJson();
      this.isPushingHistory = true;
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.isPushingHistory = false;
      this.rawJson = this.history[this.historyIndex] || '';
      this.beautifyJson();
      this.isPushingHistory = true;
    }
  }

  beautifyJson() {
    if (!this.rawJson || !this.rawJson.trim()) {
      this.formattedJson = '';
      this.parsedObject = null;
      return;
    }

    try {
      const parsed = JSON.parse(this.rawJson);
      this.parsedObject = parsed;

      let indent: string | number = 2;
      if (this.indentation === '3') indent = 3;
      else if (this.indentation === '4') indent = 4;
      else if (this.indentation === 'tab') indent = '\t';
      else if (this.indentation === 'compact') indent = 0;

      this.formattedJson = JSON.stringify(parsed, null, indent);
      this.isError = false;
      this.statusMessage = 'Valid JSON formatted successfully!';
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Syntax Error: ${e.message}`;
    }
  }

  validateJson() {
    if (!this.rawJson || !this.rawJson.trim()) {
      this.isError = true;
      this.statusMessage = 'Error: JSON input is empty. Please enter JSON to validate.';
      return;
    }

    try {
      JSON.parse(this.rawJson);
      this.isError = false;
      this.statusMessage = 'Valid JSON! No syntax errors detected.';
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Invalid JSON: ${e.message}`;
    }
  }

  minifyJson() {
    if (!this.rawJson || !this.rawJson.trim()) return;

    try {
      const parsed = JSON.parse(this.rawJson);
      this.parsedObject = parsed;
      this.formattedJson = JSON.stringify(parsed);
      this.indentation = 'compact';
      this.isError = false;
      this.statusMessage = 'JSON minified (compacted without whitespace)!';
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Syntax Error: ${e.message}`;
    }
  }

  sortJsonKeys() {
    if (!this.rawJson || !this.rawJson.trim()) return;

    try {
      const parsed = JSON.parse(this.rawJson);
      const sorted = this.deepSortObject(parsed);
      this.rawJson = JSON.stringify(sorted, null, 2);
      this.beautifyJson();
      this.statusMessage = 'JSON keys sorted alphabetically!';
      this.isError = false;
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Cannot sort: ${e.message}`;
    }
  }

  private deepSortObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSortObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key) => {
          result[key] = this.deepSortObject(obj[key]);
          return result;
        }, {});
    }
    return obj;
  }

  repairJson() {
    if (!this.rawJson) return;
    try {
      // Fix single quotes to double quotes, trailing commas
      let fixed = this.rawJson
        .replace(/'/g, '"')
        .replace(/,\s*([}\]])/g, '$1');
      JSON.parse(fixed);
      this.rawJson = fixed;
      this.beautifyJson();
      this.statusMessage = 'Repaired common formatting quirks!';
      this.isError = false;
    } catch {
      this.beautifyJson();
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
    this.rawJson = JSON.stringify(sample, null, 2);
    this.pushHistory(this.rawJson);
    this.beautifyJson();
    this.statusMessage = '';
  }

  clearAll() {
    this.rawJson = '';
    this.formattedJson = '';
    this.parsedObject = null;
    this.statusMessage = '';
    this.isError = false;
    this.cursorLine = 1;
    this.currentCol = 1;
  }

  clearInput() {
    this.rawJson = '';
    this.statusMessage = '';
  }

  async pasteFromClipboard() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        this.rawJson = text;
        this.beautifyJson();
        this.statusMessage = 'Pasted from clipboard!';
        this.isError = false;
      } catch {
        this.statusMessage = 'Clipboard permission denied. Please paste directly into the box.';
        this.isError = true;
      }
    }
  }

  async copyFormattedJson() {
    if (!this.formattedJson) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(this.formattedJson);
      this.statusMessage = 'Copied formatted JSON to clipboard! ✓';
      this.isError = false;
      setTimeout(() => {
        if (this.statusMessage.includes('Copied')) this.statusMessage = '';
      }, 2500);
    }
  }

  downloadJsonFile() {
    const content = this.formattedJson || this.rawJson;
    if (!content || typeof document === 'undefined') return;

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    this.statusMessage = 'JSON file download started!';
    this.isError = false;
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.rawJson = reader.result as string;
      this.beautifyJson();
      this.statusMessage = `Loaded "${file.name}" successfully!`;
      this.isError = false;
      input.value = '';
    };
    reader.readAsText(file);
  }

  openUrlPrompt() {
    if (typeof window === 'undefined') return;
    const url = window.prompt('Enter JSON API or Raw URL to fetch:');
    if (!url) return;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.rawJson = JSON.stringify(data, null, 2);
        this.beautifyJson();
        this.statusMessage = `Fetched data from URL successfully!`;
        this.isError = false;
      })
      .catch(err => {
        this.isError = true;
        this.statusMessage = `Failed to fetch URL: ${err.message}`;
      });
  }

  printJson() {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<pre>${this.formattedJson || this.rawJson}</pre>`);
    printWindow.document.close();
    printWindow.print();
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'code' ? 'tree' : 'code';
    if (this.viewMode === 'tree' && !this.parsedObject && this.rawJson) {
      try {
        this.parsedObject = JSON.parse(this.rawJson);
      } catch {}
    }
  }

  syncInputScroll() {
    if (this.inputTextareaRef && this.inputGutterRef) {
      this.inputGutterRef.nativeElement.scrollTop = this.inputTextareaRef.nativeElement.scrollTop;
    }
  }

  syncOutputScroll() {
    if (this.outputTextareaRef && this.outputGutterRef) {
      this.outputGutterRef.nativeElement.scrollTop = this.outputTextareaRef.nativeElement.scrollTop;
    }
  }

  updateCursorPos(event: any) {
    const textarea = event.target as HTMLTextAreaElement;
    const selStart = textarea.selectionStart || 0;
    const textBefore = textarea.value.substring(0, selStart);
    const lines = textBefore.split('\n');
    this.cursorLine = lines.length;
    this.currentCol = lines[lines.length - 1].length + 1;
  }

  // Tree View Helper Functions
  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  getObjectKeys(val: any): string[] {
    return val && typeof val === 'object' ? Object.keys(val) : [];
  }

  getKeysCount(val: any): number {
    return val && typeof val === 'object' ? Object.keys(val).length : 0;
  }

  isCollapsed(key: string): boolean {
    return this.collapsedKeys.has(key);
  }

  toggleNodeCollapse(key: string) {
    if (this.collapsedKeys.has(key)) {
      this.collapsedKeys.delete(key);
    } else {
      this.collapsedKeys.add(key);
    }
  }

  getValClass(val: any): string {
    if (typeof val === 'string') return 'val-string';
    if (typeof val === 'number') return 'val-number';
    if (typeof val === 'boolean') return 'val-boolean';
    return 'val-null';
  }

  formatPrimitive(val: any): string {
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
  }
}
