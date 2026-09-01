import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { SpotlightSearchComponent } from '../spotlight-search/spotlight-search.component';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { CategoryItem } from '../../data/categories.data';
import { ToolItem } from '../../data/tools.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeSwitcherComponent, SpotlightSearchComponent],
  template: `
    <header class="universal-header">
      <div class="nav-container">

        <!-- MAIN NAVBAR -->
        <nav class="navbar-glass">
          <!-- Logo -->
          <a routerLink="/" class="nav-logo" (click)="closeAllMenus()">
            <div class="logo-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="logo-title">
              <span class="brand-main">Converterall</span><span class="brand-ai">AI</span>
              <span class="brand-tag">v2.0</span>
            </div>
          </a>

          <!-- Center Nav Links (Clean, Spacious, Fits perfectly) -->
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-pill" (click)="closeAllMenus()">
              🏠 Home
            </a>

            <!-- Tools trigger — mega menu renders BELOW navbar -->
            <button class="nav-pill dropdown-btn" [class.active]="toolsMenuOpen()" (click)="toggleToolsMenu($event)">
              🧰 Tools <span class="caret-icon" [class.rotated]="toolsMenuOpen()">▼</span>
            </button>

            <!-- Analytics Dashboard -->
            <a routerLink="/dashboard" routerLinkActive="active" (click)="closeAllMenus()" class="nav-pill cyber-pill">
              📊 Analytics
            </a>

            <!-- Legal & Info Dropdown -->
            <div class="dropdown-wrapper">
              <button class="nav-pill dropdown-btn" [class.active]="legalMenuOpen()" (click)="toggleLegalMenu($event)">
                ⚖️ Legal <span class="caret-icon" [class.rotated]="legalMenuOpen()">▼</span>
              </button>
              <div class="ai-dropdown glass" *ngIf="legalMenuOpen()">
                <a routerLink="/about" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">ℹ️</span>
                  <div>
                    <div class="ai-drop-name">About Us</div>
                    <div class="ai-drop-sub">Who we are &amp; tech stack</div>
                  </div>
                </a>
                <a routerLink="/contact" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">✉️</span>
                  <div>
                    <div class="ai-drop-name">Contact Us</div>
                    <div class="ai-drop-sub">24/7 support &amp; inquiries</div>
                  </div>
                </a>
                <a routerLink="/privacy-policy" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">🛡️</span>
                  <div>
                    <div class="ai-drop-name">Privacy Policy</div>
                    <div class="ai-drop-sub">GDPR, CCPA &amp; zero logs</div>
                  </div>
                </a>
                <a routerLink="/terms-of-service" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">📄</span>
                  <div>
                    <div class="ai-drop-name">Terms of Service</div>
                    <div class="ai-drop-sub">Usage guidelines &amp; license</div>
                  </div>
                </a>
                <a routerLink="/disclaimer" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">⚠️</span>
                  <div>
                    <div class="ai-drop-name">Disclaimer</div>
                    <div class="ai-drop-sub">Calculators &amp; tool liability</div>
                  </div>
                </a>
                <a routerLink="/cookie-policy" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">🍪</span>
                  <div>
                    <div class="ai-drop-name">Cookie Policy</div>
                    <div class="ai-drop-sub">AdSense &amp; browser storage</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="nav-actions">
            <app-spotlight-search></app-spotlight-search>
            <app-theme-switcher></app-theme-switcher>

            <!-- Mobile Hamburger Button -->
            <button class="mobile-toggle-btn" (click)="toggleMobileMenu()" aria-label="Toggle mobile menu">☰</button>
          </div>
        </nav>

        <!-- TOOLS MEGA MENU -->
        <div class="mega-dropdown glass" *ngIf="toolsMenuOpen()">
          <div class="mega-header">
            <div class="mega-title">🧰 Explore Tool Categories</div>
            <span class="mega-badge-tag">{{ categories.length }} Categories • Dynamic Registry</span>
          </div>

          <div class="mega-grid">
            <div *ngFor="let cat of categories" class="mega-category-card">
              <!-- Category heading row -->
              <a [routerLink]="cat.slug" (click)="closeAllMenus()" class="mega-cat-header">
                <div class="mega-cat-icon">{{ cat.icon }}</div>
                <div class="mega-cat-info">
                  <div class="mega-cat-name">
                    {{ cat.name }}
                    <span class="cat-count">{{ cat.toolCount }} tools</span>
                  </div>
                  <div class="mega-cat-desc">{{ cat.description }}</div>
                </div>
              </a>

              <!-- Top 5 tools in category -->
              <div class="mega-tools-list">
                <a
                  *ngFor="let tool of getTopTools(cat.id)"
                  [routerLink]="tool.slug"
                  (click)="closeAllMenus()"
                  class="mega-subtool-link"
                >
                  <span>{{ tool.icon }}</span>
                  <span class="tool-link-name">{{ tool.name }}</span>
                  <span *ngIf="tool.badge" class="tool-mini-badge">{{ tool.badge }}</span>
                </a>
              </div>

              <!-- View all link for category -->
              <a [routerLink]="cat.slug" (click)="closeAllMenus()" class="mega-view-all">
                All {{ cat.name }} →
              </a>
            </div>
          </div>
        </div>

        <!-- MOBILE DRAWER MENU -->
        <div class="mobile-drawer-overlay" *ngIf="mobileMenuOpen()" (click)="closeAllMenus()"></div>
        <div class="mobile-drawer-card" [class.open]="mobileMenuOpen()">
          <div class="drawer-header">
            <span>Navigation Menu</span>
            <button class="drawer-close" (click)="closeAllMenus()">✕</button>
          </div>
          <div class="drawer-list">
            <a routerLink="/" (click)="closeAllMenus()" class="drawer-item">🏠 Home</a>
            <a routerLink="/dashboard" (click)="closeAllMenus()" class="drawer-item">📊 Live Analytics</a>
            <a routerLink="/about" (click)="closeAllMenus()" class="drawer-item">ℹ️ About Us</a>
            <a routerLink="/contact" (click)="closeAllMenus()" class="drawer-item">✉️ Contact Us</a>
            <a routerLink="/privacy-policy" (click)="closeAllMenus()" class="drawer-item">🛡️ Privacy Policy</a>
            <a routerLink="/terms-of-service" (click)="closeAllMenus()" class="drawer-item">📄 Terms of Service</a>
            <a routerLink="/disclaimer" (click)="closeAllMenus()" class="drawer-item">⚠️ Disclaimer</a>
            <a routerLink="/cookie-policy" (click)="closeAllMenus()" class="drawer-item">🍪 Cookie Policy</a>

            <div class="drawer-cat-heading">Tool Categories</div>
            <a *ngFor="let cat of categories" [routerLink]="cat.slug" (click)="closeAllMenus()" class="drawer-item">
              <span>{{ cat.icon }} {{ cat.name }}</span>
              <span class="drawer-badge">{{ cat.toolCount }}</span>
            </a>
          </div>
        </div>

      </div>
    </header>
  `,
  styles: [`
    .universal-header {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1050;
      padding: 0;
      background: var(--card-color, rgba(14, 16, 24, 0.88));
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    }

    .nav-container {
      max-width: 100%;
      padding: 0 1.2rem;
      margin: 0 auto;
      position: relative;
    }

    .navbar-glass {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.65rem 0;
    }

    /* Logo */
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: inherit;
      flex-shrink: 0;
    }

    .logo-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
    }

    .logo-title {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 1.1rem;
      font-weight: 800;
    }

    .brand-main { color: var(--text-color, #fff); }
    .brand-ai {
      background: linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 900;
    }
    .brand-tag {
      font-size: 0.65rem;
      font-weight: 700;
      background: rgba(139, 92, 246, 0.2);
      color: #c4b5fd;
      border: 1px solid rgba(139, 92, 246, 0.35);
      padding: 0.1rem 0.4rem;
      border-radius: 6px;
      margin-left: 5px;
    }

    /* Nav Links Row */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      flex-shrink: 0;
    }

    .nav-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.44rem 0.72rem;
      border-radius: 11px;
      color: var(--text-color, #e2e8f0);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.86rem;
      transition: all 0.2s ease;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      white-space: nowrap;
    }

    .nav-pill:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }

    .nav-pill.active {
      background: rgba(139, 92, 246, 0.18);
      border-color: rgba(139, 92, 246, 0.4);
      color: #fff;
    }

    .cyber-pill {
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.2);
      background: rgba(56, 189, 248, 0.08);
    }
    .cyber-pill:hover {
      background: rgba(56, 189, 248, 0.18);
    }

    .caret-icon {
      font-size: 0.7rem;
      transition: transform 0.25s ease;
      display: inline-block;
    }
    .caret-icon.rotated { transform: rotate(180deg); }

    /* Dropdown wrapper */
    .dropdown-wrapper { position: relative; }

    .ai-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 280px;
      background: var(--card-color, rgba(15, 18, 28, 0.97));
      border: 1px solid var(--border-color, rgba(255,255,255,0.16));
      border-radius: 16px;
      box-shadow: 0 20px 55px rgba(0,0,0,0.7);
      padding: 0.5rem;
      z-index: 1300;
      animation: dropFade 0.2s cubic-bezier(0.16,1,0.3,1);
    }

    @keyframes dropFade {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ai-drop-item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.6rem 0.75rem;
      border-radius: 10px;
      text-decoration: none;
      color: var(--text-color, #fff);
      transition: background 0.2s;
    }
    .ai-drop-item:hover { background: rgba(139, 92, 246, 0.15); }
    .ai-drop-icon { font-size: 1.2rem; flex-shrink: 0; }
    .ai-drop-name { font-weight: 700; font-size: 0.88rem; }
    .ai-drop-sub  { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }

    /* Right Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-shrink: 0;
    }

    .mobile-toggle-btn {
      display: none;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      color: inherit;
      font-size: 1.2rem;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    /* MEGA DROPDOWN */
    .mega-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 1.5rem;
      right: 1.5rem;
      background: var(--card-color, rgba(12, 15, 26, 0.98));
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
      border-radius: 20px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
      padding: 1.4rem;
      z-index: 1200;
      max-height: calc(85vh - 70px);
      overflow-y: auto;
      animation: megaFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes megaFadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .mega-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .mega-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #fff;
    }

    .mega-badge-tag {
      font-size: 0.75rem;
      color: #a78bfa;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      font-weight: 600;
    }

    .mega-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.2rem;
    }

    .mega-category-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 14px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .mega-cat-header {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: inherit;
    }

    .mega-cat-icon { font-size: 1.5rem; }

    .mega-cat-info { flex: 1; }

    .mega-cat-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .cat-count {
      font-size: 0.7rem;
      color: #94a3b8;
      font-weight: 400;
    }

    .mega-cat-desc {
      font-size: 0.76rem;
      color: #94a3b8;
      line-height: 1.35;
      margin-top: 2px;
    }

    .mega-tools-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin: 0.3rem 0;
    }

    .mega-subtool-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: #cbd5e1;
      text-decoration: none;
      padding: 0.3rem 0.45rem;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .mega-subtool-link:hover { background: rgba(139,92,246,0.14); color: #fff; }

    .tool-link-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tool-mini-badge {
      margin-left: auto;
      flex-shrink: 0;
      font-size: 0.62rem;
      font-weight: 800;
      padding: 0.1rem 0.38rem;
      border-radius: 99px;
      background: rgba(139,92,246,0.22);
      color: #c4b5fd;
    }

    .mega-view-all {
      margin-top: auto;
      font-size: 0.82rem;
      font-weight: 700;
      color: #a78bfa;
      text-decoration: none;
    }
    .mega-view-all:hover { color: #38bdf8; }

    /* Mobile */
    @media (max-width: 1024px) {
      .nav-links { display: none; }
      .mobile-toggle-btn { display: flex; }
    }

    .mobile-drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(4px);
      z-index: 1090;
    }

    .mobile-drawer-card {
      display: none;
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 300px;
      background: var(--card-color, #0f111a);
      border: 1px solid var(--border-color, rgba(255,255,255,0.18));
      border-radius: 18px;
      padding: 1rem;
      z-index: 1100;
      max-height: 80vh;
      overflow-y: auto;
    }
    .mobile-drawer-card.open { display: block; }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      margin-bottom: 0.75rem;
      padding-bottom: 0.65rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .drawer-close {
      background: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 1rem;
    }

    .drawer-list {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .drawer-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0.75rem;
      border-radius: 10px;
      text-decoration: none;
      color: var(--text-color, #fff);
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .drawer-item:hover { background: rgba(139,92,246,0.14); }

    .drawer-cat-heading {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748b;
      padding: 0.5rem 0.25rem 0.25rem;
    }

    .drawer-badge {
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(139,92,246,0.2);
      color: #c4b5fd;
      padding: 0.12rem 0.45rem;
      border-radius: 99px;
    }

    /* LIGHT THEME */
    :host-context(body.light-theme) .universal-header {
      background: rgba(255, 255, 255, 0.92);
      border-bottom: 1px solid rgba(15, 23, 42, 0.09);
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    :host-context(body.light-theme) .nav-pill { color: #374151; }
    :host-context(body.light-theme) .nav-pill:hover { background: #f3f4f6; color: #111827; }
    :host-context(body.light-theme) .nav-pill.active { background: #ede9fe; color: #6d28d9; }
    :host-context(body.light-theme) .ai-dropdown,
    :host-context(body.light-theme) .mega-dropdown,
    :host-context(body.light-theme) .mobile-drawer-card {
      background: #ffffff;
      border-color: rgba(0,0,0,0.1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    :host-context(body.light-theme) .ai-drop-item,
    :host-context(body.light-theme) .drawer-item { color: #1f2937; }
    :host-context(body.light-theme) .ai-drop-item:hover,
    :host-context(body.light-theme) .drawer-item:hover { background: #f3f4f6; }
    :host-context(body.light-theme) .mega-title,
    :host-context(body.light-theme) .mega-cat-name { color: #111827; }
    :host-context(body.light-theme) .mega-category-card { background: #f8fafc; border-color: #e2e8f0; }
  `]
})
export class NavbarComponent {
  private registry = inject(ToolRegistryService);
  mobileMenuOpen = signal(false);
  toolsMenuOpen = signal(false);
  legalMenuOpen = signal(false);

  categories: CategoryItem[] = this.registry.getCategories();

  getTopTools(categoryId: string): ToolItem[] {
    return this.registry.getTopToolsByCategory(categoryId, 5);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    this.toolsMenuOpen.set(false);
    this.legalMenuOpen.set(false);
  }

  toggleToolsMenu(event: Event) {
    event.stopPropagation();
    this.toolsMenuOpen.set(!this.toolsMenuOpen());
    this.legalMenuOpen.set(false);
  }

  toggleLegalMenu(event: Event) {
    event.stopPropagation();
    this.legalMenuOpen.set(!this.legalMenuOpen());
    this.toolsMenuOpen.set(false);
  }

  closeAllMenus() {
    this.mobileMenuOpen.set(false);
    this.toolsMenuOpen.set(false);
    this.legalMenuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.toolsMenuOpen()) this.toolsMenuOpen.set(false);
    if (this.legalMenuOpen()) this.legalMenuOpen.set(false);
  }
}
