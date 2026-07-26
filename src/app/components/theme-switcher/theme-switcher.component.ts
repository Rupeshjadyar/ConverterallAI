import { Component, inject } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  private themeService = inject(ThemeService);

  get currentTheme() {
    return this.themeService.currentTheme();
  }

  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
