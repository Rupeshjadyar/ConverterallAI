import { Component, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ALL_RICH_CSS_CHAPTERS, ALL_RICH_CSS_TOPICS } from '../rich-css.data';
import { RichTutorialChapter, W3TopicItem, TutorialSubSection } from '../rich-tutorial.models';

@Component({
  selector: 'app-css-tutorial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lang-workspace">
      <!-- CSS SIDEBAR -->
      <aside class="lang-sidebar">
        <div class="sidebar-sticky-wrap">
          <h4 class="sidebar-heading" style="color: #0284c7;">CSS3 TUTORIAL</h4>
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
                    <div class="sidebar-submenu" style="border-left-color: #0284c7;">
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

      <!-- CSS MAIN STAGE -->
      <main class="lang-content-stage">
        <div class="article-wrap">
          <div class="top-shortcuts-bar">
            <span class="cert-pill" style="color: #0284c7;">CSS3 CERTIFICATION &bull; CONVERTERALLAI</span>
          </div>

          <header class="stage-header">
            <div>
              <h1 class="page-title">{{ activeChapter().title }}</h1>
              <p class="page-subtitle">{{ activeChapter().shortDesc }}</p>
            </div>
            <div class="btn-group">
              <button class="btn-nav" (click)="prevChapter()" [disabled]="currentChapterIndex() <= 0">❮ Home</button>
              <button class="btn-nav btn-green" style="background: #0284c7; border-color: #0284c7;" (click)="nextChapter()" [disabled]="currentChapterIndex() >= chapters.length - 1">Next ❯</button>
            </div>
          </header>

          <!-- ConverterAllAI Certification Banner -->
          <section class="cert-banner" style="background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%);">
            <div class="cert-banner-text">
              <span class="cert-kicker" style="color: #38bdf8;">CSS CERTIFICATION</span>
              <h2 class="cert-title">Get Certified in CSS3 Styling</h2>
              <p class="cert-desc">
                Learn modern Flexbox, CSS Grid, Box Model, and Animations. Earn your certified stylesheet credentials with Learn through ConverterAllAI.
              </p>
              <button class="btn-cert-green" style="background: #38bdf8; color: #0f172a;" (click)="openRunner(activeChapter().sections[0].codeExample || '')">
                Test CSS Live
              </button>
            </div>
            <div class="cert-banner-preview">
              <div class="cert-mockup-card">
                <span class="cert-logo" style="color: #0284c7;">ConverterAllAI</span>
                <div class="cert-mockup-lines">
                  <span class="line-1">CERTIFICATE OF COMPLETION</span>
                  <span class="line-2">Certified CSS3 Developer</span>
                </div>
                <div class="cert-badge-stamp" style="background: #0284c7;">✔</div>
              </div>
            </div>
          </section>

          <!-- Overview Section -->
          <section id="overview-section" class="overview-section" style="background: #e0f2fe; border-left-color: #0284c7;">
            <h3 class="section-title" style="color: #0369a1;">Core Concepts & Overview</h3>
            @for (para of activeChapter().overview; track $index) {
              <p class="overview-paragraph" style="color: #0284c7;">{{ para }}</p>
            }
          </section>

          <!-- Chapter Subsections -->
          <div class="chapter-subsections">
            @for (sec of activeChapter().sections; track $index; let sIdx = $index) {
              <section [id]="'section-' + sIdx" class="section-card">
                <div class="section-card-header">
                  <span class="sec-index" style="color: #0284c7; background: rgba(2, 132, 199, 0.1);">{{ activeChapter().chapterNumber }}.{{ sIdx + 1 }}</span>
                  <h2 class="sec-title">{{ sec.title }}</h2>
                </div>

                <div class="sec-theory">
                  @for (tp of sec.theory; track $index) {
                    <p>{{ tp }}</p>
                  }
                </div>

                @if (sec.syntax) {
                  <div class="sec-syntax-box" style="border-left-color: #0284c7;">
                    <span class="syntax-badge" style="color: #0284c7;">CSS Rule:</span>
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
                          <th>Property / Selector</th>
                          <th>Value Example</th>
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

                <!-- Code Example with Try-it Runner -->
                <div class="code-example-box">
                  <div class="code-header">
                    <span>Example: {{ sec.title }}</span>
                    <button class="btn-try-it" style="background: #0284c7;" (click)="openRunner(sec.codeExample || '')">Try it Yourself ❯</button>
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
                  <h3 class="runner-title" style="color: #38bdf8;">ConverterAllAI CSS Live Editor</h3>
                  <p class="runner-subtitle">Edit the CSS and HTML template live to preview changes in real time.</p>
                </div>
                <button class="btn-close-runner" (click)="closeRunner()">✕ Close</button>
              </div>

              <div class="runner-grid">
                <div class="editor-pane">
                  <div class="pane-label">Source Code:</div>
                  <textarea [(ngModel)]="editableCode" class="code-textarea" spellcheck="false"></textarea>
                  <button class="btn-run-code" style="background: #0284c7;" (click)="refreshPreview()">▶ Run CSS</button>
                </div>
                <div class="preview-pane">
                  <div class="pane-label">Live Preview:</div>
                  <iframe [srcdoc]="editableCode" class="preview-iframe" sandbox="allow-scripts allow-modals"></iframe>
                </div>
              </div>
            </section>
          }

          <div class="bottom-nav-bar">
            <button class="btn-nav" (click)="prevChapter()" [disabled]="currentChapterIndex() <= 0">❮ Previous Chapter</button>
            <button class="btn-nav btn-green" style="background: #0284c7; border-color: #0284c7;" (click)="nextChapter()" [disabled]="currentChapterIndex() >= chapters.length - 1">Next Chapter ❯</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['../web-tutorials-shared.css']
})
export class CssTutorialComponent {
  private platformId = inject(PLATFORM_ID);

  chapters: RichTutorialChapter[] = ALL_RICH_CSS_CHAPTERS;
  topicsList: W3TopicItem[] = ALL_RICH_CSS_TOPICS;
  activeTopicId = signal<string>('css-home');
  expandedTopicId = signal<string>('css-home');
  activePlaygroundCode = signal<string | null>(null);
  editableCode: string = '';

  activeChapter = computed<RichTutorialChapter>(() => {
    const cur = this.topicsList.find(t => t.id === this.activeTopicId());
    const refId = cur ? cur.chapterRefId : 'css-intro';
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
