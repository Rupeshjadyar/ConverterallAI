import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { SQL_TOPICS, SqlTopicItem } from './sql/sql.models';

@Component({
  selector: 'app-developer-tools-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dev-layout-wrapper">
      <!-- Ambient Glow Orbs -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="dev-layout-container">
        <!-- Top Breadcrumbs Navigation -->
        <div class="dev-breadcrumbs">
          <a routerLink="/" class="crumb-link">🏠 Home</a>
          <span class="crumb-sep">/</span>
          <a routerLink="/developer-tools" class="crumb-link">Developer Tools</a>
          <ng-container *ngIf="isSqlRoute()">
            <span class="crumb-sep">/</span>
            <a routerLink="/developer-tools/sql" class="crumb-link">SQL Learn</a>
            <ng-container *ngIf="currentSqlTopic()">
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ currentSqlTopic()?.title }}</span>
            </ng-container>
          </ng-container>
        </div>

        <!-- Master Dashboard Shell (Dual Sidebar + Content Stage) -->
        <div class="dev-dashboard-shell">
          <!-- 1. SLIM ICON RAIL (Far-Left Dock like User Screenshot) -->
          <aside class="dev-icon-rail glass">
            <!-- Hub Home Icon -->
            <button
              class="rail-btn"
              [class.active]="isHubRoute()"
              (click)="navigateToHub()"
              title="Developer Tools Hub"
            >
              <span class="rail-icon">🏠</span>
              <span class="rail-tooltip">Overview Hub</span>
            </button>

            <!-- SQL Learn Icon -->
            <button
              class="rail-btn"
              [class.active]="isSqlRoute()"
              (click)="openSqlFromRail()"
              title="SQL Learn (102 Slides)"
            >
              <span class="rail-icon">🗄️</span>
              <span class="rail-tooltip">SQL Learn (14 Topics)</span>
            </button>

            <!-- Type Master Icon -->
            <a
              routerLink="/typing-master"
              class="rail-btn"
              title="Type Master Pro"
            >
              <span class="rail-icon">⌨️</span>
              <span class="rail-tooltip">Type Master Pro</span>
            </a>

            <!-- JSON Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('json-tool')"
              title="JSON Formatter & Validator"
            >
              <span class="rail-icon">&#123;&#125;</span>
              <span class="rail-tooltip">JSON Formatter</span>
            </button>

            <!-- JWT Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('jwt-tool')"
              title="JWT Token Decoder"
            >
              <span class="rail-icon">🎫</span>
              <span class="rail-tooltip">JWT Decoder</span>
            </button>

            <!-- Hash Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('hash-tool')"
              title="Cryptographic Hash Generator"
            >
              <span class="rail-icon">🔒</span>
              <span class="rail-tooltip">Hash Generator</span>
            </button>

            <!-- UUID Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('uuid-tool')"
              title="UUID / GUID v4 Generator"
            >
              <span class="rail-icon">🆔</span>
              <span class="rail-tooltip">UUID Generator</span>
            </button>

            <!-- Base64 Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('base64-tool')"
              title="Base64 Encoder & Decoder"
            >
              <span class="rail-icon">🔤</span>
              <span class="rail-tooltip">Base64 Encoder</span>
            </button>

            <!-- URL Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('url-tool')"
              title="URL Encoder & Decoder"
            >
              <span class="rail-icon">🔗</span>
              <span class="rail-tooltip">URL Encoder</span>
            </button>

            <!-- Regex Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('regex-tool')"
              title="Regex Tester & Evaluator"
            >
              <span class="rail-icon">🎯</span>
              <span class="rail-tooltip">Regex Tester</span>
            </button>

            <!-- HTML Entity Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('html-tool')"
              title="HTML Entity Tool"
            >
              <span class="rail-icon">🌐</span>
              <span class="rail-tooltip">HTML Entities</span>
            </button>

            <!-- Markdown Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('markdown-tool')"
              title="Markdown Live Editor"
            >
              <span class="rail-icon">📝</span>
              <span class="rail-tooltip">Markdown Editor</span>
            </button>

            <!-- Color Tool Icon -->
            <button
              class="rail-btn"
              (click)="scrollToTool('color-tool')"
              title="Color Converter"
            >
              <span class="rail-icon">🎨</span>
              <span class="rail-tooltip">Color Converter</span>
            </button>

            <!-- Live SQL Sandbox Icon -->
            <a
              routerLink="/developer-tools/sql/playground"
              routerLinkActive="active"
              class="rail-btn rail-sandbox"
              title="Live SQL Playground"
            >
              <span class="rail-icon">⚡</span>
              <span class="rail-tooltip">Live SQL Sandbox</span>
            </a>

            <div class="rail-spacer"></div>

            <!-- Toggle Expand Rail Button -->
            <button
              class="rail-btn rail-bottom-btn"
              (click)="toggleMenuCollapse()"
              [title]="panelVisible() ? 'Hide Submenu Panel' : 'Show Submenu Panel'"
            >
              <span class="rail-icon">{{ panelVisible() ? '◀' : '▶' }}</span>
              <span class="rail-tooltip">{{ panelVisible() ? 'Collapse Menu' : 'Expand Menu' }}</span>
            </button>
          </aside>

          <!-- 2. SECONDARY SUBMENU PANEL (Tree Menu like User Screenshot) -->
          <aside
            class="dev-menu-panel glass"
            [class.collapsed]="!panelVisible()"
            [class.mobile-open]="mobileMenuOpen()"
          >
            <!-- Panel Header -->
            <div class="panel-header">
              <div class="panel-brand">
                <span class="panel-badge-pill">DEVELOPER TOOLS</span>
                <span class="panel-title-text">12 Free Tools</span>
              </div>
              <button class="mobile-close-btn" (click)="toggleMobileMenu()">✕</button>
            </div>

            <!-- Instant Search Input -->
            <div class="panel-search">
              <span class="search-lens">🔍</span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearchChange()"
                placeholder="Search tools..."
                class="search-field"
              />
              <button *ngIf="searchQuery" (click)="searchQuery = ''" class="clear-search-btn">✕</button>
            </div>

            <!-- NAVIGATION TREE MENU -->
            <div class="nav-tree-scroll">
              <!-- TOP ACTIVE PILL: HOME -->
              <a
                routerLink="/developer-tools"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="active-home-block"
                class="nav-home-pill"
                (click)="closeMobileMenu()"
              >
                <span class="pill-icon">🏠</span>
                <span class="pill-label">Home</span>
              </a>

              <!-- SECTION: DEVELOPER TOOLS -->
              <div class="tree-section-header">
                <span class="tree-section-label">Developer Tools</span>
              </div>

              <!-- 1. SQL Learn (Expandable Parent with 14 Child Lessons) -->
              <div class="tree-group" [class.is-expanded]="sqlExpanded()">
                <div
                  class="tree-node tree-parent"
                  [class.node-active]="isSqlRoute()"
                  (click)="toggleSqlMenu()"
                >
                  <span class="tree-chevron" [class.rotated]="sqlExpanded()">›</span>
                  <span class="tree-node-icon">🗄️</span>
                  <span class="tree-node-text">SQL Learn</span>
                  <span class="tree-count-badge">14 Topics</span>
                </div>

                <!-- 14 SQL Child Lessons Underneath -->
                <div class="tree-nested-list" *ngIf="sqlExpanded()">
                  <a
                    *ngFor="let topic of filteredSqlTopics"
                    [routerLink]="['/developer-tools/sql', topic.slug]"
                    routerLinkActive="active-nested-topic"
                    class="tree-child-row"
                    (click)="closeMobileMenu()"
                  >
                    <span class="child-dash">›</span>
                    <span class="child-icon">{{ topic.icon }}</span>
                    <span class="child-text" [title]="topic.title">{{ topic.title }}</span>
                    <span *ngIf="topic.badge" class="child-mini-tag" [ngClass]="topic.badge.toLowerCase()">
                      {{ topic.badge }}
                    </span>
                  </a>
                </div>
              </div>

              <!-- 2. Type Master Pro (Single Node) -->
              <a
                routerLink="/typing-master"
                class="tree-node tree-single"
                (click)="closeMobileMenu()"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">⌨️</span>
                <span class="tree-node-text">Type Master</span>
                <span class="badge-accent hot">POPULAR</span>
              </a>

              <!-- 3. JSON Formatter & Validator -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('json-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">&#123;&#125;</span>
                <span class="tree-node-text">JSON Formatter</span>
                <span class="badge-accent hot">HOT</span>
              </a>

              <!-- 4. JWT Token Decoder -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('jwt-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🎫</span>
                <span class="tree-node-text">JWT Decoder</span>
                <span class="badge-accent pro">PRO</span>
              </a>

              <!-- 5. Hash Generator (SHA-256 / MD5) -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('hash-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🔒</span>
                <span class="tree-node-text">Hash Generator</span>
              </a>

              <!-- 6. UUID / GUID Generator -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('uuid-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🆔</span>
                <span class="tree-node-text">UUID Generator</span>
              </a>

              <!-- 7. Base64 Text Encoder & Decoder -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('base64-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🔤</span>
                <span class="tree-node-text">Base64 Encoder</span>
              </a>

              <!-- 8. URL Encoder & Decoder -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('url-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🔗</span>
                <span class="tree-node-text">URL Encoder</span>
              </a>

              <!-- 9. Regex Tester & Evaluator -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('regex-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🎯</span>
                <span class="tree-node-text">Regex Tester</span>
              </a>

              <!-- 10. HTML Entity Tool -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('html-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🌐</span>
                <span class="tree-node-text">HTML Entity Tool</span>
              </a>

              <!-- 11. Markdown Live Previewer -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('markdown-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">📝</span>
                <span class="tree-node-text">Markdown Editor</span>
              </a>

              <!-- 12. Color Code Converter -->
              <a
                class="tree-node tree-single"
                (click)="scrollToTool('color-tool')"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">🎨</span>
                <span class="tree-node-text">Color Converter</span>
              </a>

              <!-- 13. Live SQL Playground Sandbox (Single Node) -->
              <a
                routerLink="/developer-tools/sql/playground"
                routerLinkActive="node-active"
                class="tree-node tree-single playground-highlight"
                (click)="closeMobileMenu()"
              >
                <span class="chevron-placeholder"></span>
                <span class="tree-node-icon">⚡</span>
                <span class="tree-node-text">Live SQL Sandbox</span>
                <span class="badge-accent live">LIVE</span>
              </a>
            </div>

            <!-- Panel Footer (Like "Configure >" in User Screenshot) -->
            <div class="panel-bottom-footer">
              <a routerLink="/developer-tools" class="configure-link" (click)="scrollToTool('json-tool')">
                <span class="configure-icon">⚙️</span>
                <span class="configure-text">Configure Studio</span>
                <span class="configure-arrow">›</span>
              </a>
            </div>
          </aside>

          <!-- Mobile Floating Menu Trigger -->
          <button class="mobile-floating-bar" (click)="toggleMobileMenu()">
            <span>☰ Developer Tools Menu</span>
            <span class="badge-pill">14 SQL Lessons</span>
          </button>

          <!-- 3. MAIN CONTENT STAGE (Right Side) -->
          <main class="dev-main-stage">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-color, #030303);
      color: var(--text-color, #e2e8f0);
    }
    .dev-layout-wrapper {
      position: relative;
      min-height: 100vh;
      padding: 5rem 0 6rem 0;
      overflow-x: hidden;
    }
    .dev-layout-container {
      max-width: 1480px;
      margin: 0 auto;
      padding: 0 1.25rem;
      position: relative;
      z-index: 2;
    }

    /* Ambient Glows */
    .glow-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(140px);
      opacity: 0.16;
      pointer-events: none;
      z-index: 1;
    }
    .orb-1 { width: 550px; height: 550px; background: #7c3aed; top: 5%; left: -150px; }
    .orb-2 { width: 500px; height: 500px; background: #0284c7; bottom: 10%; right: -150px; }

    /* Breadcrumbs */
    .dev-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
      color: #94a3b8;
      flex-wrap: wrap;
    }
    .crumb-link {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .crumb-link:hover { color: #c084fc; }
    .crumb-sep { color: #475569; }
    .crumb-current { color: #ffffff; font-weight: 600; }

    /* DASHBOARD SHELL: DUAL SIDEBAR + CONTENT */
    .dev-dashboard-shell {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
      min-height: 80vh;
    }

    /* 1. SLIM ICON RAIL (Far Left Dock) */
    .dev-icon-rail {
      width: 58px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px 6px;
      border-radius: 16px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 80px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      z-index: 10;
    }
    @media (max-width: 1024px) {
      .dev-icon-rail {
        display: none;
      }
    }

    .rail-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: none;
      background: transparent;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
      text-decoration: none;
    }
    .rail-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      transform: scale(1.05);
    }
    .rail-btn.active {
      background: #0284c7;
      color: #ffffff;
      box-shadow: 0 0 16px rgba(2, 132, 199, 0.55);
    }
    .rail-icon {
      font-size: 1.25rem;
      line-height: 1;
    }
    .rail-sandbox.active, .rail-sandbox:hover {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.8));
      color: #fff;
    }
    .rail-spacer {
      flex-grow: 1;
      min-height: 16px;
    }
    .rail-bottom-btn {
      color: #64748b;
      font-size: 0.85rem;
    }

    /* Rail Tooltip on Hover */
    .rail-tooltip {
      position: absolute;
      left: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
      background: rgba(15, 23, 42, 0.95);
      color: #f1f5f9;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      z-index: 100;
    }
    .rail-btn:hover .rail-tooltip {
      opacity: 1;
      visibility: visible;
    }

    /* 2. SUBMENU PANEL (Tree Menu like Screenshot) */
    .dev-menu-panel {
      width: 260px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px 12px;
      border-radius: 18px;
      background: rgba(15, 23, 42, 0.82);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 80px;
      max-height: calc(100vh - 100px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      transition: width 0.25s ease, opacity 0.25s ease;
      overflow: hidden;
      z-index: 9;
    }
    .dev-menu-panel.collapsed {
      width: 0;
      padding: 0;
      border: none;
      opacity: 0;
      pointer-events: none;
    }
    @media (max-width: 1024px) {
      .dev-menu-panel {
        position: fixed;
        top: 0;
        left: -320px;
        bottom: 0;
        width: 300px;
        max-height: 100vh;
        z-index: 2000;
        border-radius: 0 20px 20px 0;
        transition: left 0.3s ease;
      }
      .dev-menu-panel.mobile-open {
        left: 0;
        box-shadow: 0 0 60px rgba(0, 0, 0, 0.85);
      }
    }

    /* Panel Header */
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .panel-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .panel-badge-pill {
      font-size: 0.65rem;
      font-weight: 800;
      background: rgba(139, 92, 246, 0.25);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.4);
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }
    .panel-title-text {
      font-size: 0.78rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .mobile-close-btn {
      display: none;
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: #fff;
      padding: 4px 8px;
      border-radius: 6px;
      cursor: pointer;
    }
    @media (max-width: 1024px) {
      .mobile-close-btn { display: block; }
    }

    /* Panel Search */
    .panel-search {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-lens {
      position: absolute;
      left: 10px;
      font-size: 0.8rem;
      pointer-events: none;
      opacity: 0.6;
    }
    .search-field {
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 7px 26px 7px 28px;
      color: #f1f5f9;
      font-size: 0.8rem;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s;
    }
    .search-field:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.35);
    }
    .clear-search-btn {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 0.75rem;
    }

    /* Tree Scroll Area */
    .nav-tree-scroll {
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
      padding-right: 2px;
      flex-grow: 1;
    }

    /* TOP ACTIVE PILL: HOME (Matches User Screenshot Blue Block) */
    .nav-home-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 8px;
      text-decoration: none;
      color: #cbd5e1;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      margin-bottom: 4px;
    }
    .nav-home-pill:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }
    .nav-home-pill.active-home-block {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
    }
    .pill-icon {
      font-size: 1.15rem;
      line-height: 1;
    }
    .pill-label {
      font-size: 0.92rem;
    }

    /* TREE NODES WITH CHEVRON ON THE LEFT */
    .tree-group {
      display: flex;
      flex-direction: column;
    }
    .tree-node {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      text-decoration: none;
      color: #cbd5e1;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }
    .tree-node:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
    }
    .tree-node.node-active {
      background: rgba(139, 92, 246, 0.2);
      border: 1px solid rgba(139, 92, 246, 0.4);
      color: #ffffff;
      font-weight: 600;
    }
    .tree-chevron {
      font-size: 1rem;
      font-weight: 700;
      color: #94a3b8;
      width: 14px;
      text-align: center;
      transition: transform 0.2s ease;
      display: inline-block;
    }
    .tree-chevron.rotated {
      transform: rotate(90deg);
      color: #c084fc;
    }
    .chevron-placeholder {
      width: 14px;
      flex-shrink: 0;
    }
    .tree-node-icon {
      font-size: 1.05rem;
      line-height: 1;
    }
    .tree-node-text {
      flex-grow: 1;
      font-size: 0.88rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tree-count-badge {
      font-size: 0.68rem;
      background: rgba(139, 92, 246, 0.2);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.35);
      padding: 1px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    .badge-accent {
      font-size: 0.62rem;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .badge-accent.hot {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }
    .badge-accent.live {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }

    /* NESTED CHILDREN LIST (INDENTED LIKE ENTERPRISE SAAS) */
    .tree-nested-list {
      margin: 2px 0 4px 14px;
      padding-left: 10px;
      border-left: 1.5px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tree-child-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border-radius: 6px;
      text-decoration: none;
      color: #94a3b8;
      font-size: 0.8rem;
      transition: all 0.2s;
      cursor: pointer;
    }
    .tree-child-row:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      transform: translateX(2px);
    }
    .tree-child-row.active-nested-topic {
      background: rgba(139, 92, 246, 0.22);
      color: #c084fc;
      font-weight: 600;
    }
    .child-dash {
      font-size: 0.75rem;
      color: #64748b;
    }
    .child-icon {
      font-size: 0.88rem;
    }
    .child-text {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.8rem;
    }
    .child-mini-tag {
      font-size: 0.6rem;
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 600;
    }
    .child-mini-tag.essential { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .child-mini-tag.core { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    .child-mini-tag.advanced { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
    .child-mini-tag.interactive { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }

    /* Playground Highlight Node */
    .playground-highlight {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .playground-highlight:hover {
      background: rgba(16, 185, 129, 0.16);
      border-color: rgba(16, 185, 129, 0.4);
    }

    /* Panel Bottom Footer (Like "Configure >" in Screenshot) */
    .panel-bottom-footer {
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      margin-top: auto;
    }
    .configure-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      border-radius: 8px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
    }
    .configure-link:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
    }
    .configure-icon { font-size: 0.95rem; }
    .configure-text { flex-grow: 1; }
    .configure-arrow { font-size: 1rem; color: #64748b; font-weight: 700; }

    /* 3. MAIN CONTENT STAGE */
    .dev-main-stage {
      flex: 1;
      min-width: 0;
    }

    /* Mobile Floating Bar */
    .mobile-floating-bar {
      display: none;
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 10px 22px;
      font-weight: 700;
      font-size: 0.88rem;
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.6);
      cursor: pointer;
      align-items: center;
      gap: 10px;
    }
    @media (max-width: 1024px) {
      .mobile-floating-bar { display: inline-flex; }
    }
    .badge-pill {
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
    }
  `]
})
export class DeveloperToolsLayoutComponent implements OnInit {
  private router = inject(Router);

  sqlTopics = SQL_TOPICS;
  searchQuery = '';
  mobileMenuOpen = signal<boolean>(false);
  panelVisible = signal<boolean>(true);
  sqlExpanded = signal<boolean>(false);
  jsonExpanded = signal<boolean>(false);
  base64Expanded = signal<boolean>(false);
  urlExpanded = signal<boolean>(false);
  currentUrl = signal<string>('');

  ngOnInit() {
    const url = this.router.url;
    this.currentUrl.set(url);
    this.sqlExpanded.set(url.includes('/developer-tools/sql'));

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const current = event.urlAfterRedirects || event.url;
        this.currentUrl.set(current);
        if (current.includes('/developer-tools/sql')) {
          this.sqlExpanded.set(true);
        }
      });
  }

  isHubRoute(): boolean {
    const url = this.currentUrl();
    return url === '/developer-tools' || url.startsWith('/developer-tools#');
  }

  isSqlRoute(): boolean {
    return this.currentUrl().includes('/developer-tools/sql');
  }

  currentSqlTopic(): SqlTopicItem | undefined {
    const parts = this.currentUrl().split('/');
    const lastSlug = parts[parts.length - 1]?.split('?')[0];
    return this.sqlTopics.find(t => t.slug === lastSlug);
  }

  get filteredSqlTopics(): SqlTopicItem[] {
    if (!this.searchQuery) return this.sqlTopics;
    const q = this.searchQuery.toLowerCase();
    return this.sqlTopics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.shortDesc.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q)
    );
  }

  onSearchChange() {
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.sqlExpanded.set(true);
      this.jsonExpanded.set(true);
      this.base64Expanded.set(true);
      this.urlExpanded.set(true);
    }
  }

  navigateToHub() {
    this.router.navigate(['/developer-tools']);
  }

  openSqlFromRail() {
    if (!this.isSqlRoute()) {
      this.router.navigate(['/developer-tools/sql/intro']);
    }
    this.sqlExpanded.set(true);
    this.panelVisible.set(true);
  }

  toggleMenuCollapse() {
    this.panelVisible.set(!this.panelVisible());
  }

  toggleSqlMenu() {
    if (!this.isSqlRoute()) {
      this.router.navigate(['/developer-tools/sql/intro']);
      this.sqlExpanded.set(true);
    } else {
      this.sqlExpanded.set(!this.sqlExpanded());
    }
  }

  toggleJsonMenu() {
    this.jsonExpanded.set(!this.jsonExpanded());
  }

  toggleBase64Menu() {
    this.base64Expanded.set(!this.base64Expanded());
  }

  toggleUrlMenu() {
    this.urlExpanded.set(!this.urlExpanded());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  scrollToTool(elementId: string) {
    this.closeMobileMenu();
    if (!this.currentUrl().startsWith('/developer-tools') || this.isSqlRoute()) {
      this.router.navigate(['/developer-tools'], { fragment: elementId }).then(() => {
        setTimeout(() => this.scrollElementIntoView(elementId), 150);
      });
    } else {
      this.scrollElementIntoView(elementId);
    }
  }

  private scrollElementIntoView(id: string) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-pulse');
      setTimeout(() => el.classList.remove('highlight-pulse'), 1500);
    }
  }
}
