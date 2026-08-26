import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { CategoryItem } from '../../data/categories.data';
import { ToolItem } from '../../data/tools.data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar-wrapper">
      <aside class="app-sidebar glass">
        <div class="sidebar-header">
          <h2 class="sidebar-title">All Tools</h2>
        </div>
        <nav class="sidebar-nav">
          <div *ngFor="let cat of categories" class="sidebar-category">
            <div class="cat-header" (click)="toggleCat(cat.id)" [title]="cat.name">
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-chevron" [class.open]="openCatId === cat.id">▼</span>
            </div>
            <div class="cat-tools" *ngIf="openCatId === cat.id">
              <a *ngFor="let tool of getTools(cat.id)" 
                 [routerLink]="tool.slug" 
                 routerLinkActive="active"
                 class="tool-item"
                 [title]="tool.name">
                <span class="tool-icon">{{ tool.icon }}</span>
                <span class="tool-name">{{ tool.name }}</span>
              </a>
            </div>
          </div>
        </nav>
      </aside>
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      width: 82px;
      margin: 1rem 0 1rem 1rem;
      position: sticky;
      top: 76px;
      height: calc(100vh - 90px);
      z-index: 1040;
    }

    .app-sidebar {
      width: 82px;
      height: 100%;
      border-radius: 18px;
      background: var(--card-color, rgba(14, 16, 24, 0.88));
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
    }
    
    .app-sidebar:hover {
      width: 260px;
    }
    
    .sidebar-header {
      padding: 1.2rem;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
      display: flex;
      align-items: center;
      min-width: 260px;
    }
    
    .sidebar-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin: 0;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .app-sidebar:hover .sidebar-title {
      opacity: 1;
    }
    
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 1rem 0.8rem;
      /* Hide scrollbar for a cleaner look */
      scrollbar-width: none; 
      -ms-overflow-style: none;
    }
    .sidebar-nav::-webkit-scrollbar { 
      display: none; 
    }
    
    .sidebar-category {
      margin-bottom: 0.5rem;
      min-width: 260px;
    }
    
    .cat-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.7rem;
      cursor: pointer;
      border-radius: 12px;
      color: var(--text-color, #e2e8f0);
      font-weight: 700;
      font-size: 0.95rem;
      transition: background 0.2s;
      white-space: nowrap;
      width: 236px;
    }
    
    .cat-icon {
      font-size: 1.3rem;
      display: flex;
      justify-content: center;
      min-width: 32px;
    }

    .cat-header:hover {
      background: rgba(139, 92, 246, 0.15);
    }
    
    .cat-chevron {
      margin-left: auto;
      font-size: 0.7rem;
      transition: transform 0.3s ease;
      opacity: 0;
    }

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
      padding-left: 1rem;
      margin-top: 0.2rem;
      animation: dropFade 0.2s ease-out;
    }
    
    @keyframes dropFade {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .tool-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.6rem 0.7rem;
      text-decoration: none;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.2s;
      white-space: nowrap;
      width: 220px;
    }

    .tool-icon {
      font-size: 1.1rem;
      display: flex;
      justify-content: center;
      min-width: 32px;
    }
    
    .tool-name {
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    .app-sidebar:hover .tool-name {
      opacity: 1;
    }
    
    .tool-item:hover, .tool-item.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }
    
    /* Light Theme Overrides */
    :host-context(body.light-theme) .app-sidebar {
      background: rgba(255, 255, 255, 0.92);
      border-color: rgba(15, 23, 42, 0.09);
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    
    :host-context(body.light-theme) .sidebar-title { color: #111827; }
    :host-context(body.light-theme) .cat-header { color: #374151; }
    :host-context(body.light-theme) .cat-header:hover { background: #f3f4f6; color: #111827; }
    :host-context(body.light-theme) .tool-item { color: #64748b; }
    :host-context(body.light-theme) .tool-item:hover, 
    :host-context(body.light-theme) .tool-item.active {
      color: #6d28d9;
      background: #f5f3ff;
    }
  `]
})
export class SidebarComponent {
  private registry = inject(ToolRegistryService);
  categories: CategoryItem[] = this.registry.getCategories();
  openCatId: string | null = null;
  
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
