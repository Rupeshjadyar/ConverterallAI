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
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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
