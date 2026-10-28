import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouteConfigLoadStart,
  RouteConfigLoadEnd
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { SeoService } from './services/seo.service';
import { AnalyticsService } from './services/analytics.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RightSidebarComponent } from './components/sidebar/right-sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { ToolSeoContentComponent } from './components/tool-seo-content/tool-seo-content.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, RightSidebarComponent, FooterComponent, CookieConsentComponent, ToolSeoContentComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('converterallai');
  public readonly isNavigating = signal<boolean>(false);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private seoService = inject(SeoService);
  private analyticsService = inject(AnalyticsService);

  ngOnInit() {
    this.themeService.initTheme();
    this.seoService.init();
    this.analyticsService.init();
    this.initNavigationWatcher();
    this.initScrollToTop();
  }

  private initNavigationWatcher(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart || event instanceof RouteConfigLoadStart) {
          this.isNavigating.set(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError ||
          event instanceof RouteConfigLoadEnd
        ) {
          this.isNavigating.set(false);
        }
      });
    }
  }

  private initScrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          // If navigation doesn't target an in-page fragment, always reset scroll to the top
          const targetUrl = event.urlAfterRedirects || event.url;
          if (!targetUrl.includes('#')) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            if (document.documentElement) {
              document.documentElement.scrollTop = 0;
            }
            if (document.body) {
              document.body.scrollTop = 0;
            }
          }
        });
    }
  }
}

