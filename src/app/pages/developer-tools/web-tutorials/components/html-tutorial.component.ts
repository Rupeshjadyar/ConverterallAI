import { Component, signal, computed, Input, Output, EventEmitter, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ALL_RICH_HTML_CHAPTERS, ALL_RICH_HTML_TOPICS } from '../rich-html.data';
import { RichTutorialChapter, W3TopicItem, TutorialSubSection } from '../rich-tutorial.models';

@Component({
  selector: 'app-html-tutorial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lang-workspace">
      <!-- HTML SIDEBAR -->
      <aside class="lang-sidebar">
        <div class="sidebar-sticky-wrap">
          <h4 class="sidebar-heading">HTML5 TUTORIAL</h4>
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
                    <div class="sidebar-submenu">
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

      <!-- HTML MAIN STAGE -->
      <main class="lang-content-stage">
        <div class="article-wrap">
          <!-- Top Utility Bar -->
          <div class="top-shortcuts-bar">
            <span class="cert-pill">HTML5 CERTIFICATION &bull; CONVERTERALLAI</span>
          </div>

          <!-- Stage Header -->
          <header class="stage-header">
            <div>
              <h1 class="page-title">{{ activeChapter().title }}</h1>
              <p class="page-subtitle">{{ activeChapter().shortDesc }}</p>
            </div>
            <div class="btn-group">
              <button class="btn-nav" (click)="prevChapter()" [disabled]="currentChapterIndex() <= 0">❮ Home</button>
              <button class="btn-nav btn-green" (click)="nextChapter()" [disabled]="currentChapterIndex() >= chapters.length - 1">Next ❯</button>
            </div>
          </header>

          <!-- ConverterAllAI Certification Banner -->
          <section class="cert-banner">
            <div class="cert-banner-text">
              <span class="cert-kicker">HTML CERTIFICATION</span>
              <h2 class="cert-title">Get Certified in HTML5</h2>
              <p class="cert-desc">
                Complete the HTML course, strengthen your knowledge with live interactive examples, and earn a verified certificate from Learn through ConverterAllAI.
              </p>
              <button class="btn-cert-green" (click)="openRunner(activeChapter().sections[0].codeExample || '')">
                Start Interactive Exercise
              </button>
            </div>
            <div class="cert-banner-preview">
              <div class="cert-mockup-card">
                <span class="cert-logo">ConverterAllAI</span>
                <div class="cert-mockup-lines">
                  <span class="line-1">CERTIFICATE OF COMPLETION</span>
                  <span class="line-2">Certified HTML Developer</span>
                </div>
                <div class="cert-badge-stamp">✔</div>
              </div>
            </div>
          </section>

          <!-- Core Overview -->
          <section id="overview-section" class="overview-section">
            <h3 class="section-title">What You Need to Know (Core Concepts)</h3>
            @for (para of activeChapter().overview; track $index) {
              <p class="overview-paragraph">{{ para }}</p>
            }
          </section>

          <!-- Subsections -->
          <div class="chapter-subsections">
            @for (sec of activeChapter().sections; track $index; let sIdx = $index) {
              <section [id]="'section-' + sIdx" class="section-card">
                <div class="section-card-header">
                  <span class="sec-index">{{ activeChapter().chapterNumber }}.{{ sIdx + 1 }}</span>
                  <h2 class="sec-title">{{ sec.title }}</h2>
                </div>

                <div class="sec-theory">
                  @for (tp of sec.theory; track $index) {
                    <p>{{ tp }}</p>
                  }
                </div>

                @if (sec.syntax) {
                  <div class="sec-syntax-box">
                    <span class="syntax-badge">Syntax:</span>
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
                          <th>Attribute / Tag</th>
                          <th>Value / Options</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (row of sec.table; track $index) {
                          <tr>
                            <td><code>{{ row.attribute }}</code></td>
                            <td><span class="val-pill">{{ row.value }}</span></td>
                            <td>{{ row.description }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }

                <!-- Code Example with Live Try-it Runner -->
                <div class="code-example-box">
                  <div class="code-header">
                    <span>Example: {{ sec.title }}</span>
                    <button class="btn-try-it" (click)="openRunner(sec.codeExample || '')">Try it Yourself ❯</button>
                  </div>
                  <pre class="code-pre"><code>{{ sec.codeExample }}</code></pre>
                </div>
              </section>
            }
          </div>

          <!-- Live Code Runner Modal / Drawer -->
          @if (activePlaygroundCode()) {
            <section id="liveRunnerStage" class="live-runner-card">
              <div class="runner-header">
                <div>
                  <h3 class="runner-title">ConverterAllAI Live Code Editor</h3>
                  <p class="runner-subtitle">Edit HTML in the left pane and see real-time rendered output on the right.</p>
                </div>
                <button class="btn-close-runner" (click)="closeRunner()">✕ Close</button>
              </div>

              <div class="runner-grid">
                <div class="editor-pane">
                  <div class="pane-label">Source Code (Editable):</div>
                  <textarea [(ngModel)]="editableCode" class="code-textarea" spellcheck="false"></textarea>
                  <button class="btn-run-code" (click)="refreshPreview()">▶ Run Code</button>
                </div>
                <div class="preview-pane">
                  <div class="pane-label">Live Browser Output:</div>
                  <iframe [srcdoc]="editableCode" class="preview-iframe" sandbox="allow-scripts allow-modals"></iframe>
                </div>
              </div>
            </section>
          }

          <!-- Bottom Prev/Next Navigation -->
          <div class="bottom-nav-bar">
            <button class="btn-nav" (click)="prevChapter()" [disabled]="currentChapterIndex() <= 0">❮ Previous Chapter</button>
            <button class="btn-nav btn-green" (click)="nextChapter()" [disabled]="currentChapterIndex() >= chapters.length - 1">Next Chapter ❯</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['../web-tutorials-shared.css']
})
export class HtmlTutorialComponent {
  private platformId = inject(PLATFORM_ID);

  chapters: RichTutorialChapter[] = ALL_RICH_HTML_CHAPTERS;
  activePlaygroundCode = signal<string | null>(null);
  editableCode: string = '';

  topicsList: W3TopicItem[] = ALL_RICH_HTML_TOPICS;
  activeTopicId = signal<string>('html-home');
  expandedTopicId = signal<string>('html-home');

  activeChapter = computed<RichTutorialChapter>(() => {
    const cur = this.topicsList.find(t => t.id === this.activeTopicId());
    const refId = cur ? cur.chapterRefId : 'html-overview';
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

  refreshPreview() {
    const current = this.editableCode;
    this.editableCode = '';
    setTimeout(() => { this.editableCode = current; }, 50);
  }
}
