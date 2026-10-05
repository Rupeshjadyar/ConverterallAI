import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { SeoService } from './services/seo.service';
import { AnalyticsService } from './services/analytics.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RightSidebarComponent } from './components/sidebar/right-sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, RightSidebarComponent, FooterComponent, CookieConsentComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('converterallai');
  private themeService = inject(ThemeService);
  private seoService = inject(SeoService);
  private analyticsService = inject(AnalyticsService);

  ngOnInit() {
    this.themeService.initTheme();
    this.seoService.init();
    this.analyticsService.init();
  }
}
