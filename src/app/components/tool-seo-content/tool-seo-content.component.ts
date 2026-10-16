import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToolItem } from '../../data/tools.data';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-tool-seo-content',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  template: `
    @if (currentTool) {
      <div class="tool-seo-container">
        <!-- Breadcrumb Navigation -->
        <app-breadcrumbs />

        <article class="tool-seo-card glass">
          <!-- Main Heading -->
          <header class="tool-seo-header">
            @if (showH1) {
              <h1 class="tool-seo-h1">{{ currentTool.h1 }}</h1>
            } @else {
              <h2 class="tool-seo-h2">{{ currentTool.h1 }}</h2>
            }
            <p class="tool-seo-intro">{{ currentTool.intro }}</p>

            @if (currentTool.privacyNote) {
              <div class="tool-privacy-pill">
                <span class="privacy-icon">🛡️</span>
                <span>{{ currentTool.privacyNote }}</span>
              </div>
            }
          </header>

          <div class="tool-seo-grid">
            <!-- How To Use Section -->
            <section class="tool-seo-section">
              <h3 class="section-title">
                <span class="section-icon">📋</span>
                <span>How to Use {{ currentTool.name }}</span>
              </h3>
              <ol class="steps-list">
                @for (step of currentTool.howToSteps; track step; let idx = $index) {
                  <li class="step-item">
                    <span class="step-num">{{ idx + 1 }}</span>
                    <span class="step-text">{{ step }}</span>
                  </li>
                }
              </ol>
            </section>

            <!-- Key Features Section -->
            <section class="tool-seo-section">
              <h3 class="section-title">
                <span class="section-icon">✨</span>
                <span>Key Features &amp; Capabilities</span>
              </h3>
              <ul class="features-list">
                @for (feat of currentTool.features; track feat) {
                  <li class="feature-item">
                    <span class="feat-check">✓</span>
                    <span class="feat-text">{{ feat }}</span>
                  </li>
                }
              </ul>
            </section>
          </div>

          <!-- FAQ Section (Semantic details/summary for crawler indexability) -->
          @if (currentTool.faqs && currentTool.faqs.length > 0) {
            <section class="tool-seo-faqs">
              <h3 class="section-title">
                <span class="section-icon">❓</span>
                <span>Frequently Asked Questions</span>
              </h3>
              <div class="faqs-accordion">
                @for (faq of currentTool.faqs; track faq.q) {
                  <details class="faq-item">
                    <summary class="faq-summary">
                      <span class="faq-q-text">{{ faq.q }}</span>
                      <span class="faq-chevron" aria-hidden="true">▾</span>
                    </summary>
                    <div class="faq-body">
                      <p>{{ faq.a }}</p>
                    </div>
                  </details>
                }
              </div>
            </section>
          }

          <!-- Related Tools Grid with Real Crawlable Links -->
          @if (relatedTools.length > 0) {
            <section class="tool-seo-related">
              <h3 class="section-title">
                <span class="section-icon">🔗</span>
                <span>Related Tools &amp; Converters</span>
              </h3>
              <div class="related-cards-grid">
                @for (rel of relatedTools; track rel.slug) {
                  <a [routerLink]="rel.slug" class="related-tool-card">
                    <span class="rel-icon">{{ rel.icon }}</span>
                    <div class="rel-info">
                      <strong class="rel-name">{{ rel.name }}</strong>
                      <span class="rel-desc">{{ rel.shortDesc }}</span>
                    </div>
                    <span class="rel-arrow" aria-hidden="true">→</span>
                  </a>
                }
              </div>
            </section>
          }
        </article>
      </div>
    }
  `,
  styles: [`
    .tool-seo-container {
      max-width: 1200px;
      margin: 2.5rem auto 1.5rem auto;
      padding: 0 1rem;
    }

    .tool-seo-card {
      background: rgba(18, 18, 28, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 2.25rem 2rem;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    }

    .tool-seo-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 1.75rem;
    }

    .tool-seo-h1, .tool-seo-h2 {
      font-size: 1.65rem;
      font-weight: 800;
      line-height: 1.3;
      margin: 0 0 0.85rem 0;
      background: linear-gradient(135deg, #ffffff 40%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .tool-seo-intro {
      font-size: 0.98rem;
      color: #94a3b8;
      line-height: 1.7;
      margin: 0 0 1rem 0;
    }

    .tool-privacy-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.9rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 9999px;
      font-size: 0.84rem;
      color: #34d399;
      font-weight: 500;
    }

    .tool-seo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin-bottom: 2.25rem;
    }

    .section-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1.25rem 0;
    }

    .section-icon {
      font-size: 1.25rem;
    }

    .steps-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      font-size: 0.93rem;
      color: #cbd5e1;
      line-height: 1.55;
    }

    .step-num {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(168, 85, 247, 0.2);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #c084fc;
      font-weight: 700;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.93rem;
      color: #cbd5e1;
      line-height: 1.55;
    }

    .feat-check {
      color: #34d399;
      font-weight: 800;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .tool-seo-faqs {
      margin-top: 2rem;
      padding-top: 1.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .faqs-accordion {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .faq-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      overflow: hidden;
      transition: background 0.2s ease, border-color 0.2s ease;
    }

    .faq-item[open] {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .faq-summary {
      padding: 1rem 1.25rem;
      font-size: 0.96rem;
      font-weight: 600;
      color: #f1f5f9;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      list-style: none;
      user-select: none;
    }

    .faq-summary::-webkit-details-marker {
      display: none;
    }

    .faq-chevron {
      color: #94a3b8;
      font-size: 1.1rem;
      transition: transform 0.2s ease;
    }

    .faq-item[open] .faq-chevron {
      transform: rotate(180deg);
      color: #c084fc;
    }

    .faq-body {
      padding: 0 1.25rem 1.1rem 1.25rem;
      color: #94a3b8;
      font-size: 0.91rem;
      line-height: 1.65;
    }

    .faq-body p {
      margin: 0;
    }

    .tool-seo-related {
      margin-top: 2.25rem;
      padding-top: 1.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .related-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 0.9rem;
    }

    .related-tool-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 12px;
      text-decoration: none;
      color: #f1f5f9;
      transition: all 0.2s ease;
    }

    .related-tool-card:hover {
      background: rgba(168, 85, 247, 0.1);
      border-color: rgba(168, 85, 247, 0.35);
      transform: translateY(-2px);
    }

    .rel-icon {
      font-size: 1.4rem;
      flex-shrink: 0;
    }

    .rel-info {
      flex: 1;
      min-width: 0;
    }

    .rel-name {
      display: block;
      font-size: 0.91rem;
      font-weight: 600;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }

    .rel-desc {
      display: block;
      font-size: 0.77rem;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rel-arrow {
      color: #a855f7;
      font-weight: 700;
      transition: transform 0.2s ease;
    }

    .related-tool-card:hover .rel-arrow {
      transform: translateX(3px);
    }

    @media (max-width: 768px) {
      .tool-seo-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .tool-seo-card {
        padding: 1.5rem 1.25rem;
      }
      .tool-seo-h1, .tool-seo-h2 {
        font-size: 1.35rem;
      }
      .related-cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ToolSeoContentComponent implements OnInit {
  @Input() tool?: ToolItem;
  @Input() showH1: boolean = false;

  private router = inject(Router);
  private toolRegistry = inject(ToolRegistryService);

  get currentTool(): ToolItem | undefined {
    if (this.tool) return this.tool;
    const cleanPath = this.router.url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    return this.toolRegistry.getToolBySlug(cleanPath);
  }

  get relatedTools(): ToolItem[] {
    const t = this.currentTool;
    if (!t || !t.relatedToolPaths || t.relatedToolPaths.length === 0) return [];
    return t.relatedToolPaths
      .map(p => this.toolRegistry.getToolBySlug(p))
      .filter((item): item is ToolItem => !!item);
  }

  ngOnInit() {}
}
