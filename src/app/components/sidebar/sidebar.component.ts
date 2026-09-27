import { Component, inject, signal, OnInit, PLATFORM_ID, HostBinding } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { CategoryItem } from '../../data/categories.data';
import { ToolItem } from '../../data/tools.data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Full-Height Fixed Navigation Bar (Stretches all the way to bottom of screen: bottom: 0) -->
    <aside 
      class="app-sidebar glass" 
      [class.expanded]="isPinned() || isHovered"
      [class.pinned]="isPinned()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()">
      
      <!-- Top Header -->
      <div class="sidebar-header">
        <div class="header-icon-box" title="All Categories">
          <span>🧰</span>
        </div>
        <div class="header-info">
          <h2 class="sidebar-title">All Categories</h2>
          <span class="sidebar-sub">{{ categories.length }} Tool Suites</span>
        </div>
        <button 
          class="btn-pin-toggle" 
          (click)="togglePin()" 
          [title]="isPinned() ? 'Unpin Sidebar (Auto-collapse on mouse leave)' : 'Pin Sidebar (Keep permanently open)'"
          [class.active-pinned]="isPinned()">
          <span>{{ isPinned() ? '📌' : '📍' }}</span>
        </button>
      </div>

      <!-- Scrollable Navigation (Full height, scrolls cleanly with visible thumb) -->
      <nav class="sidebar-nav">
        <div *ngFor="let cat of categories" class="sidebar-category">
          <div 
            class="cat-header" 
            (click)="toggleCat(cat.id)" 
            [class.active-cat]="openCatId === cat.id" 
            [title]="cat.name + ' (' + cat.toolCount + ' tools)'">
            <span class="cat-icon">{{ cat.icon }}</span>
            <div class="cat-info-wrap">
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-badge">{{ cat.toolCount }}</span>
            </div>
            <span class="cat-chevron" [class.open]="openCatId === cat.id">▼</span>
          </div>

          <!-- Accordion Tools -->
          <div class="cat-tools" *ngIf="openCatId === cat.id">
            <a 
              *ngFor="let tool of getTools(cat.id)" 
              [routerLink]="tool.slug" 
              routerLinkActive="active"
              class="tool-item"
              [title]="tool.name">
              <span class="tool-icon">{{ tool.icon }}</span>
              <span class="tool-name">{{ tool.name }}</span>
              <span *ngIf="tool.badge" class="tool-mini-badge">{{ tool.badge }}</span>
            </a>
          </div>
        </div>
      </nav>

    </aside>
  `,
  styles: [`
    :host {
      display: block;
      flex-shrink: 0;
      width: 76px;
      align-self: stretch;
      z-index: 1040;
      transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host(.is-pinned-host) {
      width: 280px;
    }

    .app-sidebar {
      position: fixed;
      top: 60px;
      left: 0;
      bottom: 0;
      width: 76px;
      height: calc(100vh - 60px);
      background: var(--card-color, rgba(14, 16, 24, 0.96));
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border-right: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
      display: flex;
      flex-direction: column;
      box-shadow: 4px 0 25px rgba(0, 0, 0, 0.35);
      transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s, border-color 0.28s;
      z-index: 1045;
      overflow: hidden;
    }

    .app-sidebar.expanded,
    .app-sidebar:hover {
      width: 280px;
      box-shadow: 12px 0 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(139, 92, 246, 0.25);
      border-color: rgba(139, 92, 246, 0.4);
    }

    .app-sidebar.pinned {
      width: 280px;
      box-shadow: 4px 0 25px rgba(0, 0, 0, 0.3);
    }
    
    /* Light theme override */
    :host-context(body.light-theme) .app-sidebar {
      background: #ffffff;
      border-right: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
    }
    :host-context(body.light-theme) .app-sidebar.expanded,
    :host-context(body.light-theme) .app-sidebar:hover {
      box-shadow: 12px 0 35px rgba(0, 0, 0, 0.15), 0 0 20px rgba(139, 92, 246, 0.15);
      border-color: rgba(139, 92, 246, 0.35);
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 0.55rem 0.65rem;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 280px;
      flex-shrink: 0;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.15);
    }

    .header-icon-box {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.25));
      border: 1px solid rgba(139, 92, 246, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-left: 0.3rem;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
      flex: 1;
      overflow: hidden;
    }

    .app-sidebar.expanded .header-info,
    .app-sidebar:hover .header-info {
      opacity: 1;
    }
    
    .sidebar-title {
      font-size: 0.96rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin: 0;
      line-height: 1.2;
    }

    .sidebar-sub {
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .btn-pin-toggle {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 0.3rem 0.5rem;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.85rem;
      opacity: 0;
      transition: all 0.2s;
      margin-right: 0.6rem;
      flex-shrink: 0;
    }

    .app-sidebar.expanded .btn-pin-toggle,
    .app-sidebar:hover .btn-pin-toggle {
      opacity: 1;
    }

    .btn-pin-toggle:hover {
      background: rgba(139, 92, 246, 0.25);
      color: #fff;
    }

    .btn-pin-toggle.active-pinned {
      background: rgba(139, 92, 246, 0.35);
      border-color: #8b5cf6;
      color: #c4b5fd;
    }
    
    /* Scrollable Navigation */
    .sidebar-nav {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0.6rem 0.4rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(139, 92, 246, 0.5) transparent;
      box-sizing: border-box;
    }

    /* Custom Webkit Scrollbar */
    .sidebar-nav::-webkit-scrollbar {
      width: 5px;
    }
    .sidebar-nav::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.15);
      border-radius: 99px;
    }
    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(139, 92, 246, 0.5);
      border-radius: 99px;
    }
    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.85);
    }
    
    .sidebar-category {
      margin-bottom: 0.35rem;
      width: 270px;
    }
    
    .cat-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.35rem 0.4rem;
      cursor: pointer;
      border-radius: 14px;
      color: var(--text-muted, #94a3b8);
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
      white-space: nowrap;
      width: 260px;
      box-sizing: border-box;
    }
    
    .cat-icon {
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all 0.2s;
      flex-shrink: 0;
      margin-left: 0.2rem;
    }

    .cat-header:hover {
      background: rgba(139, 92, 246, 0.12);
      color: var(--text-color, #fff);
    }

    .cat-header:hover .cat-icon {
      background: rgba(139, 92, 246, 0.2);
      border-color: rgba(139, 92, 246, 0.35);
      transform: scale(1.05);
    }
    
    .cat-info-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      opacity: 0;
      transition: opacity 0.2s;
      overflow: hidden;
    }

    .app-sidebar.expanded .cat-info-wrap,
    .app-sidebar:hover .cat-info-wrap {
      opacity: 1;
    }

    .cat-name {
      font-weight: 700;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cat-badge {
      font-size: 0.68rem;
      font-weight: 700;
      background: rgba(139, 92, 246, 0.18);
      color: #c4b5fd;
      padding: 0.1rem 0.45rem;
      border-radius: 99px;
      flex-shrink: 0;
    }
    
    .cat-header.active-cat .cat-icon {
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
    }
    
    .cat-chevron {
      margin-left: auto;
      margin-right: 0.6rem;
      font-size: 0.65rem;
      transition: transform 0.3s ease;
      opacity: 0;
      flex-shrink: 0;
    }

    .app-sidebar.expanded .cat-chevron,
    .app-sidebar:hover .cat-chevron {
      opacity: 1;
    }
    
    .cat-chevron.open {
      transform: rotate(180deg);
    }
    
    .cat-tools {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      padding-left: 0.6rem;
      margin: 0.3rem 0;
      animation: dropFade 0.2s ease-out;
    }

    /* CRITICAL: Hide expanded tools when sidebar is collapsed — prevents vertical layout break */
    .app-sidebar:not(.expanded):not(:hover) .cat-tools {
      display: none;
    }
    
    @keyframes dropFade {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .tool-item {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.35rem 0.5rem;
      margin: 0.1rem 0.2rem;
      text-decoration: none;
      color: #94a3b8;
      font-size: 0.82rem;
      font-weight: 500;
      border-radius: 10px;
      transition: all 0.2s;
      white-space: nowrap;
      width: 245px;
      box-sizing: border-box;
    }

    .tool-icon {
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      flex-shrink: 0;
    }
    
    .tool-name {
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      transition: opacity 0.2s;
      flex: 1;
      white-space: nowrap;
    }
    
    .app-sidebar.expanded .tool-name,
    .app-sidebar:hover .tool-name {
      opacity: 1;
    }

    .tool-mini-badge {
      font-size: 0.6rem;
      font-weight: 700;
      padding: 0.08rem 0.35rem;
      border-radius: 99px;
      background: rgba(6, 182, 212, 0.2);
      color: #67e8f9;
      opacity: 0;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    .app-sidebar.expanded .tool-mini-badge,
    .app-sidebar:hover .tool-mini-badge {
      opacity: 1;
    }
    
    .tool-item:hover {
      background: rgba(139, 92, 246, 0.14);
      color: #fff;
    }
    
    .tool-item.active {
      color: #fff;
      background: rgba(139, 92, 246, 0.22);
      font-weight: 700;
    }
    
    .tool-item.active .tool-icon {
      background: #8b5cf6;
      color: #ffffff;
    }


    /* Light Theme Overrides */
    :host-context(body.light-theme) .sidebar-title { color: #111827; }
    :host-context(body.light-theme) .cat-header { color: #475569; }
    :host-context(body.light-theme) .cat-icon { background: #f1f5f9; border-color: #e2e8f0; }
    :host-context(body.light-theme) .cat-header:hover { background: #f3f4f6; color: #111827; }
    :host-context(body.light-theme) .cat-badge { background: #ede9fe; color: #6d28d9; }
    :host-context(body.light-theme) .tool-item { color: #64748b; }
    :host-context(body.light-theme) .tool-item:hover, 
    :host-context(body.light-theme) .tool-item.active {
      color: #6d28d9;
      background: #f5f3ff;
    }
    :host-context(body.light-theme) .sidebar-footer {
      background: #f8fafc;
      border-top-color: #e2e8f0;
    }
    :host-context(body.light-theme) .sidebar-footer-item {
      background: #ffffff;
      border-color: #e2e8f0;
      color: #1e293b;
    }

    @media (max-width: 992px) {
      :host {
        display: none !important;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private registry = inject(ToolRegistryService);
  
  categories: CategoryItem[] = this.registry.getCategories();
  openCatId: string | null = null;
  isPinned = signal(false);
  isHovered = false;

  @HostBinding('class.is-pinned-host')
  get isPinnedHost(): boolean {
    return this.isPinned();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('app_sidebar_pinned');
      if (saved === 'true') {
        this.isPinned.set(true);
      }
    }
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  togglePin() {
    this.isPinned.update(p => {
      const next = !p;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('app_sidebar_pinned', String(next));
      }
      return next;
    });
  }
  
  getTools(categoryId: string): ToolItem[] {
    return this.registry.getToolsByCategory(categoryId);
  }
  
  toggleCat(catId: string) {
    if (this.openCatId === catId) {
      this.openCatId = null;
    } else {
      this.openCatId = catId;
    }
  }
}
