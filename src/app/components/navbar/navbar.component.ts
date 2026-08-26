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

        <!-- NAVBAR PILL -->
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

          <!-- Center Nav Links -->
          <div class="nav-links">
            <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-pill">
              🏠 Home
            </a>

            <!-- Tools trigger — mega menu renders BELOW navbar (sibling of navbar-glass) -->
            <button class="nav-pill dropdown-btn" [class.active]="toolsMenuOpen()" (click)="toggleToolsMenu($event)">
              🧰 Tools <span class="caret-icon" [class.rotated]="toolsMenuOpen()">▼</span>
            </button>
          </div>

          <!-- Right Actions -->
          <div class="nav-actions">
            <app-spotlight-search></app-spotlight-search>
            <app-theme-switcher></app-theme-switcher>

            <!-- AdSense / Legal Pages Menu -->
            <div class="dropdown-wrapper desktop-legal-menu">
              <button class="nav-pill desktop-menu-btn" (click)="toggleLegalMenu($event)">
                ☰
              </button>
              <div class="ai-dropdown glass" *ngIf="legalMenuOpen()">
                <a routerLink="/home" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">ℹ️</span>
                  <div>
                    <div class="ai-drop-name">About Us</div>
                    <div class="ai-drop-sub">Who we are</div>
                  </div>
                </a>
                <a routerLink="/home" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">🛡️</span>
                  <div>
                    <div class="ai-drop-name">Privacy Policy</div>
                    <div class="ai-drop-sub">Data protection</div>
                  </div>
                </a>
                <a routerLink="/home" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">📄</span>
                  <div>
                    <div class="ai-drop-name">Terms of Service</div>
                    <div class="ai-drop-sub">Usage guidelines</div>
                  </div>
                </a>
                <a routerLink="/home" (click)="closeAllMenus()" class="ai-drop-item">
                  <span class="ai-drop-icon">✉️</span>
                  <div>
                    <div class="ai-drop-name">Contact Us</div>
                    <div class="ai-drop-sub">Get in touch</div>
                  </div>
                </a>
              </div>
            </div>

            <button class="mobile-toggle-btn" (click)="toggleMobileMenu()" aria-label="Toggle mobile menu">☰</button>
          </div>
        </nav>

        <!-- =====================================================================
             TOOLS MEGA MENU
             Placed OUTSIDE navbar-glass, as a direct child of nav-container.
             nav-container has position:relative and max-width:1400px.
             So this mega menu will ALWAYS be perfectly centered and within bounds.
             ===================================================================== -->
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

              <a [routerLink]="cat.slug" (click)="closeAllMenus()" class="mega-view-all">
                View All {{ cat.name }} →
              </a>
            </div>
          </div>
        </div>

        <!-- Mobile Drawer -->
        <div class="mobile-drawer-overlay" *ngIf="mobileMenuOpen()" (click)="closeAllMenus()"></div>
        <div class="mobile-drawer-card" [class.open]="mobileMenuOpen()">
          <div class="drawer-header">
            <span>Navigation</span>
            <button class="drawer-close" (click)="closeAllMenus()">✕</button>
          </div>
          <div class="drawer-list">
            <a routerLink="/home" (click)="closeAllMenus()" class="drawer-item">🏠 Home</a>
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

    /* nav-container is the POSITIONING PARENT for the mega-dropdown */
    .nav-container {
      max-width: 100%;
      padding: 0 1.5rem;
      margin: 0 auto;
      position: relative;
    }

    .navbar-glass {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.7rem 0;
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
      gap: 0.25rem;
    }

    .nav-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.48rem 0.9rem;
      border-radius: 11px;
      color: var(--text-color, #e2e8f0);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
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

    .caret-icon {
      font-size: 0.7rem;
      transition: transform 0.25s ease;
      display: inline-block;
    }
    .caret-icon.rotated { transform: rotate(180deg); }

    /* AI small dropdown (positioned relative to its wrapper button) */
    .dropdown-wrapper { position: relative; }

    .ai-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      background: var(--card-color, rgba(15, 18, 28, 0.97));
      border: 1px solid var(--border-color, rgba(255,255,255,0.16));
      border-radius: 16px;
      box-shadow: 0 20px 55px rgba(0,0,0,0.7);
      padding: 0.6rem;
      z-index: 1300;
      animation: dropFade 0.2s cubic-bezier(0.16,1,0.3,1);
    }

    @keyframes dropFade {
      from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    .desktop-legal-menu .ai-dropdown {
      left: auto;
      right: 0;
      transform: none;
      animation: dropFadeRight 0.2s cubic-bezier(0.16,1,0.3,1);
    }
    
    @keyframes dropFadeRight {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ai-drop-item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.65rem 0.75rem;
      border-radius: 10px;
      text-decoration: none;
      color: var(--text-color, #fff);
      transition: background 0.2s;
    }
    .ai-drop-item:hover { background: rgba(139, 92, 246, 0.15); }
    .ai-drop-icon { font-size: 1.3rem; flex-shrink: 0; }
    .ai-drop-name { font-weight: 700; font-size: 0.9rem; }
    .ai-drop-sub  { font-size: 0.74rem; color: #94a3b8; margin-top: 2px; }

    /* Search button style */
    .search-nav-btn {
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.3) !important;
      color: #c4b5fd !important;
    }
    .search-nav-btn:hover {
      background: rgba(139, 92, 246, 0.22) !important;
    }

    /* Right actions bar */
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

    /* =====================================================================
       LIGHT THEME OVERRIDES (Flash White + Dual White)
       ===================================================================== */

    /* Navbar on white background */
    :host-context(body.light-theme) .universal-header {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(15, 23, 42, 0.09);
      box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    }
    
    :host-context(body.light-theme) .navbar-glass {
      background: transparent;
      border: none;
      box-shadow: none;
    }

    /* Brand tag on light */
    :host-context(body.light-theme) .brand-tag {
      background: #ede9fe;
      color: #6d28d9;
      border-color: rgba(109,40,217,0.2);
    }

    /* Brand AI gradient — vivid on white */
    :host-context(body.light-theme) .brand-ai {
      background: linear-gradient(135deg, #6d28d9 0%, #0ea5e9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Nav pills on light — dark text, subtle hover */
    :host-context(body.light-theme) .nav-pill {
      color: #374151;
    }
    :host-context(body.light-theme) .nav-pill:hover {
      background: #f3f4f6;
      color: #111827;
    }
    :host-context(body.light-theme) .nav-pill.active {
      background: #ede9fe;
      border-color: rgba(109,40,217,0.3);
      color: #6d28d9;
    }

    /* Search button on light */
    :host-context(body.light-theme) .search-nav-btn {
      background: #ede9fe !important;
      border: 1px solid rgba(109,40,217,0.25) !important;
      color: #6d28d9 !important;
    }
    :host-context(body.light-theme) .search-nav-btn:hover {
      background: #ddd6fe !important;
    }

    /* Mobile toggle on light */
    :host-context(body.light-theme) .mobile-toggle-btn {
      background: #f3f4f6;
      border-color: rgba(15,23,42,0.1);
      color: #111827;
    }

    /* AI small dropdown on light */
    :host-context(body.light-theme) .ai-dropdown {
      background: #ffffff;
      border: 1px solid rgba(15,23,42,0.09);
      box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
    }
    :host-context(body.light-theme) .ai-drop-item:hover {
      background: #f5f3ff;
    }
    :host-context(body.light-theme) .ai-drop-sub {
      color: #64748b;
    }
    :host-context(body.light-theme) .tool-mini-badge {
      background: #ede9fe;
      color: #6d28d9;
    }

    /* Mega menu on light */
    :host-context(body.light-theme) .mega-dropdown {
      background: #ffffff;
      border: 1px solid rgba(15,23,42,0.09);
      box-shadow: 0 8px 40px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.06);
    }
    :host-context(body.light-theme) .mega-header {
      background: rgba(255,255,255,0.99);
      border-bottom-color: rgba(15,23,42,0.07);
    }
    :host-context(body.light-theme) .mega-title { color: #111827; }
    :host-context(body.light-theme) .mega-badge-tag {
      background: #ede9fe;
      color: #6d28d9;
    }
    :host-context(body.light-theme) .mega-category-card {
      background: #f7f8fc;
      border-color: rgba(15,23,42,0.07);
    }
    :host-context(body.light-theme) .mega-category-card:hover {
      background: #ffffff;
      border-color: rgba(109,40,217,0.25);
      box-shadow: 0 4px 16px rgba(109,40,217,0.08);
    }
    :host-context(body.light-theme) .mega-cat-name { color: #111827; }
    :host-context(body.light-theme) .cat-count { color: #6d28d9; }
    :host-context(body.light-theme) .mega-cat-desc { color: #64748b; }
    :host-context(body.light-theme) .mega-subtool-link { color: #374151; }
    :host-context(body.light-theme) .mega-subtool-link:hover {
      background: #f5f3ff;
      color: #6d28d9;
    }
    :host-context(body.light-theme) .mega-view-all { color: #6d28d9; }
    :host-context(body.light-theme) .mega-view-all:hover { color: #0ea5e9; }

    /* Mobile drawer on light */
    :host-context(body.light-theme) .mobile-drawer-card {
      background: #ffffff;
      border-color: rgba(15,23,42,0.09);
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    }
    :host-context(body.light-theme) .drawer-item:hover {
      background: #f5f3ff;
      color: #6d28d9;
    }
    :host-context(body.light-theme) .drawer-badge {
      background: #ede9fe;
      color: #6d28d9;
    }



    /* =====================================================================
       TOOLS MEGA MENU
       position: FIXED = relative to VIEWPORT, never clipped by parents.
       backdrop-filter on navbar creates stacking context which clips
       absolute children — fixed bypasses this completely.
       ===================================================================== */
    .mega-dropdown {
      position: fixed;
      top: 82px;                              /* just below the navbar pill */
      left: 1.25rem;
      right: 1.25rem;
      max-width: 1390px;
      margin: 0 auto;
      background: var(--card-color, rgba(13, 16, 26, 0.97));
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid var(--border-color, rgba(255,255,255,0.15));
      border-radius: 20px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.75);
      padding: 1.25rem;
      z-index: 9999;
      animation: megaFade 0.22s cubic-bezier(0.16,1,0.3,1);
      max-height: min(72vh, 540px);
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: rgba(139,92,246,0.4) transparent;
    }

    .mega-dropdown::-webkit-scrollbar { width: 5px; }
    .mega-dropdown::-webkit-scrollbar-track { background: transparent; }
    .mega-dropdown::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 99px; }

    @keyframes megaFade {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .mega-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 1rem;
      position: sticky;
      top: -1.25rem;
      background: var(--card-color, rgba(13, 16, 26, 0.99));
      backdrop-filter: blur(10px);
      margin-left: -1.25rem;
      margin-right: -1.25rem;
      padding-left: 1.25rem;
      padding-right: 1.25rem;
      padding-top: 1rem;
      border-radius: 20px 20px 0 0;
      z-index: 2;
    }

    .mega-title {
      font-weight: 800;
      font-size: 1rem;
      color: var(--text-color, #fff);
    }

    .mega-badge-tag {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.65rem;
      border-radius: 99px;
      background: rgba(139,92,246,0.2);
      color: #c4b5fd;
    }

    /* 3-column grid */
    .mega-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    @media (max-width: 900px) {
      .mega-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 560px) {
      .mega-grid { grid-template-columns: 1fr; }
    }

    .mega-category-card {
      display: flex;
      flex-direction: column;
      padding: 0.9rem;
      border-radius: 14px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      transition: border-color 0.2s;
    }
    .mega-category-card:hover { border-color: rgba(139,92,246,0.35); }

    .mega-cat-header {
      display: flex;
      align-items: flex-start;
      gap: 0.7rem;
      text-decoration: none;
      color: inherit;
      margin-bottom: 0.65rem;
    }

    .mega-cat-icon { font-size: 1.5rem; flex-shrink: 0; }
    .mega-cat-info { flex: 1; min-width: 0; }

    .mega-cat-name {
      font-weight: 800;
      font-size: 0.98rem;
      color: var(--text-color, #fff);
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-wrap: wrap;
    }

    .cat-count {
      font-size: 0.7rem;
      font-weight: 700;
      color: #a78bfa;
    }

    .mega-cat-desc {
      font-size: 0.77rem;
      color: #94a3b8;
      line-height: 1.4;
      margin-top: 0.2rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .mega-tools-list {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-bottom: 0.65rem;
    }

    .mega-subtool-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.83rem;
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
    @media (max-width: 1040px) {
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
  `]
})
export class NavbarComponent {
  private registry = inject(ToolRegistryService);
  mobileMenuOpen = signal(false);
  toolsMenuOpen = signal(false);
  aiMenuOpen = signal(false);
  legalMenuOpen = signal(false);

  categories: CategoryItem[] = this.registry.getCategories();

  getTopTools(categoryId: string): ToolItem[] {
    return this.registry.getTopToolsByCategory(categoryId, 5);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    this.toolsMenuOpen.set(false);
    this.aiMenuOpen.set(false);
    this.legalMenuOpen.set(false);
  }

  toggleToolsMenu(event: Event) {
    event.stopPropagation();
    this.toolsMenuOpen.set(!this.toolsMenuOpen());
    this.aiMenuOpen.set(false);
    this.legalMenuOpen.set(false);
  }

  toggleAiMenu(event: Event) {
    event.stopPropagation();
    this.aiMenuOpen.set(!this.aiMenuOpen());
    this.toolsMenuOpen.set(false);
    this.legalMenuOpen.set(false);
  }

  toggleLegalMenu(event: Event) {
    event.stopPropagation();
    this.legalMenuOpen.set(!this.legalMenuOpen());
    this.toolsMenuOpen.set(false);
    this.aiMenuOpen.set(false);
  }

  openSearch() {
    const el = document.querySelector('app-spotlight-search button') as HTMLButtonElement | null;
    el?.click();
  }

  closeAllMenus() {
    this.mobileMenuOpen.set(false);
    this.toolsMenuOpen.set(false);
    this.aiMenuOpen.set(false);
    this.legalMenuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.toolsMenuOpen()) this.toolsMenuOpen.set(false);
    if (this.aiMenuOpen()) this.aiMenuOpen.set(false);
    if (this.legalMenuOpen()) this.legalMenuOpen.set(false);
  }
}
