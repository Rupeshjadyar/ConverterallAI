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
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
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
