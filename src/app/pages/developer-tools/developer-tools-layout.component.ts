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
  templateUrl: './developer-tools-layout.component.html',
  styleUrls: ['./developer-tools-layout.component.css']
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
