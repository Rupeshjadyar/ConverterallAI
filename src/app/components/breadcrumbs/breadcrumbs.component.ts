import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToolRegistryService } from '../../services/tool-registry.service';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="Breadcrumb" class="breadcrumbs-container">
      <ol class="breadcrumbs-list">
        @for (crumb of resolvedCrumbs; track crumb.url; let idx = $index; let last = $last) {
          <li class="breadcrumb-item">
            @if (!last) {
              <a [routerLink]="crumb.url" class="breadcrumb-link">
                @if (idx === 0) { <span class="crumb-icon">🏠</span> }
                <span>{{ crumb.name }}</span>
              </a>
              <span class="breadcrumb-sep" aria-hidden="true">/</span>
            } @else {
              <span class="breadcrumb-current" aria-current="page">{{ crumb.name }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumbs-container {
      margin-bottom: 1.25rem;
    }
    .breadcrumbs-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.88rem;
    }
    .breadcrumb-item {
      display: inline-flex;
      align-items: center;
    }
    .breadcrumb-link {
      color: #94a3b8;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: color 0.15s ease;
    }
    .breadcrumb-link:hover {
      color: #c084fc;
    }
    .crumb-icon {
      font-size: 0.95rem;
    }
    .breadcrumb-sep {
      margin: 0 0.5rem;
      color: #64748b;
    }
    .breadcrumb-current {
      color: #f1f5f9;
      font-weight: 600;
    }
  `]
})
export class BreadcrumbsComponent implements OnInit {
  @Input() items?: BreadcrumbItem[];

  private router = inject(Router);
  private toolRegistry = inject(ToolRegistryService);

  get resolvedCrumbs(): BreadcrumbItem[] {
    if (this.items && this.items.length > 0) {
      return this.items;
    }

    const cleanPath = this.router.url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    if (cleanPath === '/' || cleanPath === '/home') {
      return [{ name: 'Home', url: '/' }];
    }

    // Check if it is a tool
    const tool = this.toolRegistry.getToolBySlug(cleanPath);
    if (tool) {
      const cat = this.toolRegistry.getCategoryById(tool.categoryId);
      return [
        { name: 'Home', url: '/' },
        { name: cat?.name || 'Tools', url: cat?.slug || '/' },
        { name: tool.name, url: tool.slug }
      ];
    }

    // Check if it is a category
    const cat = this.toolRegistry.getCategoryBySlug(cleanPath);
    if (cat) {
      return [
        { name: 'Home', url: '/' },
        { name: cat.name, url: cat.slug }
      ];
    }

    // Default 2-step crumb
    const segments = cleanPath.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ name: 'Home', url: '/' }];
    let acc = '';
    for (const seg of segments) {
      acc += '/' + seg;
      const formatted = seg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      crumbs.push({ name: formatted, url: acc });
    }
    return crumbs;
  }

  ngOnInit() {}
}
