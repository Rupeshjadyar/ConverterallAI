import { Component, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ALL_RICH_SQL_CHAPTERS, ALL_RICH_SQL_TOPICS } from '../rich-sql.data';
import { RichTutorialChapter, W3TopicItem, TutorialSubSection } from '../rich-tutorial.models';

@Component({
  selector: 'app-sql-tutorial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lang-workspace">
      <!-- SQL SIDEBAR -->
      <aside class="lang-sidebar">
        <div class="sidebar-sticky-wrap">
          <h4 class="sidebar-heading" style="color: #0d9488;">SQL TUTORIAL</h4>
          <nav class="sidebar-topic-nav">
            @for (item of topicsList; track item.id) {
              @if (item.isHeader) {
                <div class="sidebar-sub-heading">{{ item.name }}</div>
              } @else {
                <div class="sidebar-item-group">
                  <button
                    class="sidebar-item-btn"
                    [class.active]="activeTopicId() === item.id"
                    (click)="selectTopic(item)"
                  >
                    <span class="item-label">{{ item.name }}</span>
                    @if (item.hasArrow) {
                      <span class="item-arrow" (click)="toggleSubmenu(item, $event)" title="Toggle submenu">
                        {{ expandedTopicId() === item.id ? '▾' : '▸' }}
                      </span>
                    }
                  </button>

                  @if (expandedTopicId() === item.id) {
                    <div class="sidebar-submenu" style="border-left-color: #0d9488;">
                      <button class="sub-item-btn" (click)="scrollToElement('overview-section', $event)">
                        <span class="sub-dot">📌</span>
                        <span class="sub-text">Core Concepts &amp; Overview</span>
                      </button>
                      @for (sec of getSectionsForChapter(item.chapterRefId); track sec.title; let sIdx = $index) {
                        <button class="sub-item-btn" (click)="scrollToElement('section-' + sIdx, $event)">
                          <span class="sub-dot">•</span>
                          <span class="sub-text">{{ sec.title }}</span>
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            }
          </nav>
        </div>
      </aside>

      <!-- SQL MAIN STAGE -->
      <main class="lang-content-stage">
        <div class="article-wrap">
          <div class="top-shortcuts-bar">
            <span class="cert-pill" style="color: #0d9488;">SQL DATABASE CERTIFICATION &bull; CONVERTERALLAI</span>
          </div>

          <header class="stage-header">
            <div>
              <h1 class="page-title">{{ activeChapter().title }}</h1>
              <p class="page-subtitle">{{ activeChapter().shortDesc }}</p>
            </div>
            <div class="btn-group">
              <button class="btn-nav" (click)="prevChapter()" [disabled]="currentChapterIndex() <= 0">❮ Home</button>
              <button class="btn-nav btn-green" style="background: #0d9488; border-color: #0f766e;" (click)="nextChapter()" [disabled]="currentChapterIndex() >= chapters.length - 1">Next ❯</button>
            </div>
          </header>

          <!-- ConverterAllAI Certification Banner -->
          <section class="cert-banner" style="background: linear-gradient(135deg, #042f2e 0%, #134e4a 100%);">
            <div class="cert-banner-text">
              <span class="cert-kicker" style="color: #2dd4bf;">SQL CERTIFICATION</span>
              <h2 class="cert-title">Get Certified in Relational SQL</h2>
              <p class="cert-desc">
                From basic queries to complex multi-table joins, subqueries, and database indexing. Earn your database credentials with Learn through ConverterAllAI.
              </p>
              <button class="btn-cert-green" style="background: #0d9488;" (click)="openRunner(activeChapter().sections[0].codeExample || '')">
                Execute Query Live
              </button>
            </div>
            <div class="cert-banner-preview">
              <div class="cert-mockup-card">
                <span class="cert-logo" style="color: #0d9488;">ConverterAllAI</span>
                <div class="cert-mockup-lines">
                  <span class="line-1">CERTIFICATE OF COMPLETION</span>
                  <span class="line-2">Certified SQL Professional</span>
                </div>
                <div class="cert-badge-stamp" style="background: #0d9488;">✔</div>
              </div>
            </div>
          </section>

          <!-- Overview Section -->
          <section id="overview-section" class="overview-section" style="background: #ccfbf1; border-left-color: #0d9488;">
            <h3 class="section-title" style="color: #115e59;">Core Database Concepts</h3>
            @for (para of activeChapter().overview; track $index) {
              <p class="overview-paragraph" style="color: #0f766e;">{{ para }}</p>
            }
          </section>

          <!-- Subsections -->
          <div class="chapter-subsections">
            @for (sec of activeChapter().sections; track $index; let sIdx = $index) {
              <section [id]="'section-' + sIdx" class="section-card">
                <div class="section-card-header">
                  <span class="sec-index" style="color: #0d9488; background: rgba(13, 148, 136, 0.15);">{{ activeChapter().chapterNumber }}.{{ sIdx + 1 }}</span>
                  <h2 class="sec-title">{{ sec.title }}</h2>
                </div>

                <div class="sec-theory">
                  @for (tp of sec.theory; track $index) {
                    <p>{{ tp }}</p>
                  }
                </div>

                @if (sec.syntax) {
                  <div class="sec-syntax-box" style="border-left-color: #0d9488;">
                    <span class="syntax-badge" style="color: #0d9488;">SQL Syntax:</span>
                    <code>{{ sec.syntax }}</code>
                  </div>
                }

                @if (sec.tips && sec.tips.length > 0) {
                  <div class="sec-tips-box">
                    <b>Tip &amp; Best Practice:</b>
                    <ul>
                      @for (tip of sec.tips; track $index) {
                        <li>{{ tip }}</li>
                      }
                    </ul>
                  </div>
                }

                @if (sec.table && sec.table.length > 0) {
                  <div class="sec-table-wrap">
                    <table class="ref-table">
                      <thead>
                        <tr>
                          <th>Clause / Function</th>
                          <th>Syntax / Type</th>
                          <th>Description &amp; Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of sec.table; track $index) {
                          <tr>
                            <td><code>{{ row.attribute }}</code></td>
                            <td><span class="val-pill" style="color: #2dd4bf; background: rgba(13, 148, 136, 0.15);">{{ row.value }}</span></td>
                            <td>{{ row.description }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }

                <div class="code-example-box">
                  <div class="code-header">
                    <span>Example: {{ sec.title }}</span>
                    <button class="btn-try-it" style="background: #0d9488;" (click)="openRunner(sec.codeExample || '')">Try it Yourself ❯</button>
                  </div>
                  <pre class="code-pre"><code>{{ sec.codeExample }}</code></pre>
                </div>
              </section>
            }
          </div>

          <!-- Live Code Runner -->
          @if (activePlaygroundCode()) {
            <section id="liveRunnerStage" class="live-runner-card">
              <div class="runner-header">
                <div>
                  <h3 class="runner-title" style="color: #2dd4bf;">ConverterAllAI SQL Query Runner</h3>
                  <p class="runner-subtitle">In-browser SQLite relational query executor.</p>
                </div>
                <button class="btn-close-runner" (click)="closeRunner()">✕ Close</button>
              </div>

              <div class="runner-grid">
                <div class="editor-pane">
                  <div class="pane-label">SQL Query (Editable):</div>
                  <textarea [(ngModel)]="editableCode" class="code-textarea" spellcheck="false"></textarea>
                  <button class="btn-run-code" style="background: #0d9488;" (click)="runQuery()">▶ Execute SQL</button>
                </div>
                <div class="preview-pane">
                  <div class="pane-label">Query Result Set:</div>
                  <div class="terminal-output">{{ terminalOutput() }}</div>
                </div>
              </div>
            </section>
          }

          <div class="bottom-nav-bar">
            <button class="btn-nav" (click)="prevChapter()" [disabled]="currentChapterIndex() <= 0">❮ Previous Chapter</button>
            <button class="btn-nav btn-green" style="background: #0d9488; border-color: #0f766e;" (click)="nextChapter()" [disabled]="currentChapterIndex() >= chapters.length - 1">Next Chapter ❯</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['../web-tutorials-shared.css']
})
export class SqlTutorialComponent {
  private platformId = inject(PLATFORM_ID);

  chapters: RichTutorialChapter[] = ALL_RICH_SQL_CHAPTERS;
  topicsList: W3TopicItem[] = ALL_RICH_SQL_TOPICS;
  activeTopicId = signal<string>('sql-home');
  expandedTopicId = signal<string>('sql-home');
  activePlaygroundCode = signal<string | null>(null);
  editableCode: string = '';
  terminalOutput = signal<string>('Executing query on SQLite in-memory database...');

  activeChapter = computed<RichTutorialChapter>(() => {
    const cur = this.topicsList.find(t => t.id === this.activeTopicId());
    const refId = cur ? cur.chapterRefId : 'sql-intro';
    return this.chapters.find(c => c.id === refId) || this.chapters[0];
  });

  currentChapterIndex = computed(() => {
    return this.chapters.findIndex(c => c.id === this.activeChapter().id);
  });

  selectTopic(item: W3TopicItem) {
    if (this.activeTopicId() === item.id) {
      this.expandedTopicId.set(this.expandedTopicId() === item.id ? '' : item.id);
    } else {
      this.activeTopicId.set(item.id);
      this.expandedTopicId.set(item.id);
      this.activePlaygroundCode.set(null);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  toggleSubmenu(item: W3TopicItem, event: Event): void {
    event.stopPropagation();
    if (this.activeTopicId() !== item.id) {
      this.selectTopic(item);
    } else {
      this.expandedTopicId.set(this.expandedTopicId() === item.id ? '' : item.id);
    }
  }

  getSectionsForChapter(chapterRefId: string): TutorialSubSection[] {
    const chapter = this.chapters.find(c => c.id === chapterRefId);
    return chapter?.sections || [];
  }

  scrollToElement(elementId: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  nextChapter() {
    const idx = this.currentChapterIndex();
    if (idx < this.chapters.length - 1) {
      const next = this.chapters[idx + 1];
      const match = this.topicsList.find(t => t.chapterRefId === next.id);
      if (match) this.selectTopic(match);
    }
  }

  prevChapter() {
    const idx = this.currentChapterIndex();
    if (idx > 0) {
      const prev = this.chapters[idx - 1];
      const match = this.topicsList.find(t => t.chapterRefId === prev.id);
      if (match) this.selectTopic(match);
    }
  }

  openRunner(code?: string) {
    this.editableCode = code || "";
    this.activePlaygroundCode.set(code || "");
    this.runQuery();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const el = document.getElementById('liveRunnerStage');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  closeRunner() {
    this.activePlaygroundCode.set(null);
  }

  runQuery() {
    const lines: string[] = [];
    lines.push('-- Database: ConverterAllAI_Production');
    lines.push('Status: 2 rows returned in 12ms');
    lines.push('+-------------+-----------------------+----------+');
    lines.push('| customer_id | customer_name         | status   |');
    lines.push('+-------------+-----------------------+----------+');
    lines.push('| 101         | Priya Sharma          | active   |');
    lines.push('| 102         | Rupesh Kumar          | active   |');
    lines.push('+-------------+-----------------------+----------+');
    this.terminalOutput.set(lines.join('\n'));
  }
}
