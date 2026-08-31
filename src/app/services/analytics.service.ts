import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface CountryStat {
  code: string;
  name: string;
  flag: string;
  count: number;
  percentage: number;
}

export interface ToolStat {
  name: string;
  category: 'pdf' | 'image' | 'audio' | 'calculator';
  icon: string;
  count: number;
  percentage: number;
  route: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  country: string;
  flag: string;
  timestamp: string;
  category: 'tool' | 'visit' | 'download';
  details?: string;
}

export interface DayTraffic {
  day: string;
  date: string;
  visitors: number;
  toolRuns: number;
}

export interface AnalyticsState {
  totalVisitors: number;
  totalPageViews: number;
  totalToolExecutions: number;
  totalDataSavedMB: number;
  topCountries: CountryStat[];
  topTools: ToolStat[];
  weeklyTraffic: DayTraffic[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  browserBreakdown: { chrome: number; safari: number; edge: number; firefox: number; other: number };
  recentActivities: ActivityEvent[];
}

const VISITOR_KEY = 'c_all_visitor_id';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  public isBrowser = isPlatformBrowser(this.platformId);
  public currentCountry = signal<{ name: string; code: string; flag: string }>({
    name: 'India',
    code: 'IN',
    flag: '🇮🇳'
  });

  public analyticsData = signal<AnalyticsState>(this.getEmptyState());
  private pollingTimer: any = null;

  init(): void {
    if (!this.isBrowser) return;

    this.detectCountry();
    this.ensureVisitorId();
    this.fetchLiveStats();

    // Listen to route changes for page views
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navEvent = event as NavigationEnd;
        this.trackPageView(navEvent.urlAfterRedirects || navEvent.url);
      });

    // Start auto polling for live dashboard updates
    this.startLivePolling();
  }

  public getEmptyState(): AnalyticsState {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weeklyTraffic: DayTraffic[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      weeklyTraffic.push({
        day: days[d.getDay()],
        date: `${months[d.getMonth()]} ${d.getDate()}`,
        visitors: 0,
        toolRuns: 0
      });
    }

    return {
      totalVisitors: 0,
      totalPageViews: 0,
      totalToolExecutions: 0,
      totalDataSavedMB: 0,
      topCountries: [
        { code: 'IN', name: 'India', flag: '🇮🇳', count: 0, percentage: 0 }
      ],
      topTools: [],
      weeklyTraffic,
      deviceBreakdown: { desktop: 100, mobile: 0, tablet: 0 },
      browserBreakdown: { chrome: 100, safari: 0, edge: 0, firefox: 0, other: 0 },
      recentActivities: []
    };
  }

  public fetchLiveStats(): void {
    if (!this.isBrowser) return;

    fetch('/api/telemetry/stats')
      .then(res => res.json())
      .then((data: AnalyticsState) => {
        if (data && typeof data.totalVisitors === 'number') {
          this.analyticsData.set(data);
        }
      })
      .catch(() => {
        // In local or static mode fallback, keep state updated
      });
  }

  public startLivePolling(): void {
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.pollingTimer = setInterval(() => {
      this.fetchLiveStats();
    }, 5000); // Live poll every 5 seconds
  }

  private ensureVisitorId(): string {
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, vid);
    }
    return vid;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (!this.isBrowser) return 'desktop';
    const w = window.innerWidth;
    if (w < 640) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowserName(): 'chrome' | 'safari' | 'edge' | 'firefox' | 'other' {
    if (!this.isBrowser) return 'chrome';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('edg/')) return 'edge';
    if (ua.includes('firefox/')) return 'firefox';
    if (ua.includes('chrome/') && !ua.includes('edg/')) return 'chrome';
    if (ua.includes('safari/') && !ua.includes('chrome/')) return 'safari';
    return 'other';
  }

  public trackPageView(path: string): void {
    if (!this.isBrowser) return;
    const country = this.currentCountry();
    const visitorId = this.ensureVisitorId();

    const payload = {
      type: 'visit',
      visitorId,
      path,
      countryCode: country.code,
      countryName: country.name,
      flag: country.flag,
      device: this.getDeviceType(),
      browser: this.getBrowserName()
    };

    fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => this.fetchLiveStats())
    .catch(() => {});
  }

  public trackToolUsage(toolName: string, category: 'pdf' | 'image' | 'audio' | 'calculator', details?: string): void {
    if (!this.isBrowser) return;
    const country = this.currentCountry();
    const visitorId = this.ensureVisitorId();

    const payload = {
      type: 'tool',
      visitorId,
      path: this.router.url,
      toolName,
      category,
      details,
      countryCode: country.code,
      countryName: country.name,
      flag: country.flag,
      device: this.getDeviceType(),
      browser: this.getBrowserName()
    };

    fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => this.fetchLiveStats())
    .catch(() => {});
  }

  private detectCountry(): void {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lang = navigator.language || 'en';

      if (timeZone.includes('Kolkata') || timeZone.includes('Calcutta') || lang.includes('hi') || lang.includes('mr') || lang.includes('ta')) {
        this.currentCountry.set({ name: 'India', code: 'IN', flag: '🇮🇳' });
      } else if (timeZone.includes('New_York') || timeZone.includes('Chicago') || timeZone.includes('Los_Angeles') || timeZone.includes('America')) {
        this.currentCountry.set({ name: 'United States', code: 'US', flag: '🇺🇸' });
      } else if (timeZone.includes('London') || timeZone.includes('Europe/London')) {
        this.currentCountry.set({ name: 'United Kingdom', code: 'GB', flag: '🇬🇧' });
      } else if (timeZone.includes('Dubai')) {
        this.currentCountry.set({ name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' });
      } else if (timeZone.includes('Berlin') || timeZone.includes('Frankfurt')) {
        this.currentCountry.set({ name: 'Germany', code: 'DE', flag: '🇩🇪' });
      } else if (timeZone.includes('Toronto') || timeZone.includes('Vancouver')) {
        this.currentCountry.set({ name: 'Canada', code: 'CA', flag: '🇨🇦' });
      } else if (timeZone.includes('Sydney') || timeZone.includes('Melbourne')) {
        this.currentCountry.set({ name: 'Australia', code: 'AU', flag: '🇦🇺' });
      } else {
        this.currentCountry.set({ name: 'India', code: 'IN', flag: '🇮🇳' });
      }

      // High precision background IP Geo lookup
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data && data.country_name && data.country_code) {
            const flag = this.getFlagEmoji(data.country_code);
            this.currentCountry.set({
              name: data.country_name,
              code: data.country_code,
              flag: flag
            });
          }
        })
        .catch(() => {});
    } catch {
      // Fallback
    }
  }

  private getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  public exportData(): void {
    if (!this.isBrowser) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.analyticsData(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `converterallai_live_analytics_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  public resetData(): void {
    if (!this.isBrowser) return;
    fetch('/api/telemetry/reset', { method: 'POST' })
      .then(() => this.fetchLiveStats())
      .catch(() => {
        this.analyticsData.set(this.getEmptyState());
      });
  }
}
