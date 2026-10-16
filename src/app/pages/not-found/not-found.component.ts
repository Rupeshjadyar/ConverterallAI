import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { SITE_DOMAIN } from '../../data/seo.config';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-card glass">
        <div class="error-badge">404</div>
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-desc">
          Sorry, the page you are looking for does not exist or has been moved. Explore our popular free online tools below:
        </p>

        <div class="action-grid">
          <a routerLink="/" class="quick-link primary">
            <span>🏠</span>
            <div class="link-text">
              <strong>Homepage</strong>
              <small>Browse all 80+ free browser tools</small>
            </div>
          </a>

          <a routerLink="/pdf-processing" class="quick-link">
            <span>📄</span>
            <div class="link-text">
              <strong>PDF Tools</strong>
              <small>Merge, split, compress, sign &amp; convert</small>
            </div>
          </a>

          <a routerLink="/image-processing" class="quick-link">
            <span>🖼️</span>
            <div class="link-text">
              <strong>Image Tools</strong>
              <small>Compress, crop, convert &amp; remove bg</small>
            </div>
          </a>

          <a routerLink="/calculators" class="quick-link">
            <span>🧮</span>
            <div class="link-text">
              <strong>Calculators</strong>
              <small>EMI, SIP, GST, BMI &amp; Age tools</small>
            </div>
          </a>

          <a routerLink="/games" class="quick-link">
            <span>🎮</span>
            <div class="link-text">
              <strong>Games Hub</strong>
              <small>Play Chess, Ludo, Snake &amp; puzzles</small>
            </div>
          </a>

          <a routerLink="/developer-tools" class="quick-link">
            <span>💻</span>
            <div class="link-text">
              <strong>Developer Tools</strong>
              <small>JSON formatter &amp; SQL masterclass</small>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 75vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
    }

    .not-found-card {
      max-width: 680px;
      width: 100%;
      background: rgba(18, 18, 26, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 3rem 2.5rem;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .error-badge {
      display: inline-block;
      font-size: 4.5rem;
      font-weight: 900;
      line-height: 1;
      background: linear-gradient(135deg, #a855f7 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
      letter-spacing: -2px;
    }

    .error-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #f8fafc;
      margin: 0 0 1rem 0;
    }

    .error-desc {
      font-size: 1rem;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0 0 2rem 0;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.85rem;
      text-align: left;
    }

    .quick-link {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.9rem 1.1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      color: #f1f5f9;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .quick-link:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(168, 85, 247, 0.4);
      transform: translateY(-2px);
    }

    .quick-link.primary {
      background: rgba(168, 85, 247, 0.12);
      border-color: rgba(168, 85, 247, 0.35);
    }

    .quick-link span {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .link-text strong {
      display: block;
      font-size: 0.92rem;
      color: #f8fafc;
      margin-bottom: 0.15rem;
    }

    .link-text small {
      display: block;
      font-size: 0.78rem;
      color: #94a3b8;
    }

    @media (max-width: 640px) {
      .action-grid {
        grid-template-columns: 1fr;
      }
      .not-found-card {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class NotFoundComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.update({
      title: '404 Page Not Found - ConverterAllAI',
      description: 'The page you requested could not be found. Explore our free online PDF tools, image converters, audio editors, games, and calculators on the ConverterAllAI home.',
      robots: 'noindex, nofollow',
      canonical: `${SITE_DOMAIN}/404`
    });
  }
}
