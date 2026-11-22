import { Component, inject, signal, OnInit, PLATFORM_ID, HostBinding } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { CategoryItem } from '../../data/categories.data';
import { ToolItem } from '../../data/tools.data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private registry = inject(ToolRegistryService);
  private router = inject(Router);
  
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

    this.checkCurrentRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.checkCurrentRoute(url);
      });
  }

  private checkCurrentRoute(url: string) {
    if (url.includes('/developer-tools')) {
      this.openCatId = 'developer-tools';
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
