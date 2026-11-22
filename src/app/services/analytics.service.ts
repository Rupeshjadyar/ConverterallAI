import { Injectable, Injector, effect, inject, signal, untracked, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PrivacyPreferencesService } from './privacy-preferences.service';

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
  private injector = inject(Injector);
  private preferences = inject(PrivacyPreferencesService);
  private lastTrackedPath: string | null = null;
  private inMemoryVisitorId?: string;
  private initialized = false;

  public isBrowser = isPlatformBrowser(this.platformId);
  public analyticsData = signal<AnalyticsState>(this.getEmptyState());
  private pollingTimer: any = null;
  private consecutiveErrors = 0;

  init(): void {
    if (!this.isBrowser || this.initialized) return;
    this.initialized = true;
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.trackPageView(event.urlAfterRedirects));

    effect(() => {
      if (this.preferences.allowsOptional()) {
        untracked(() => this.trackPageView(this.router.url));
      } else {
        this.lastTrackedPath = null;
        this.inMemoryVisitorId = undefined;
      }
    }, { injector: this.injector });
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
      topCountries: [],
      topTools: [],
      weeklyTraffic,
      deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      browserBreakdown: { chrome: 0, safari: 0, edge: 0, firefox: 0, other: 0 },
      recentActivities: []
    };
  }

  public fetchLiveStats(): void {
    if (!this.isBrowser) return;

    fetch('/api/telemetry/stats')
      .then(res => {
        if (!res.ok) throw new Error('Telemetry API not available');
        return res.json();
      })
      .then((data: AnalyticsState) => {
        if (data && typeof data.totalVisitors === 'number') {
          this.analyticsData.set(data);
          this.consecutiveErrors = 0;
        }
      })
      .catch(() => {
        this.consecutiveErrors++;
        // If API fails 3 times consecutively (e.g. static host or backend down), pause aggressive polling
        if (this.consecutiveErrors >= 3 && this.pollingTimer) {
          clearInterval(this.pollingTimer);
          this.pollingTimer = null;
        }
      });
  }

  public startLivePolling(): void {
    if (!this.isBrowser) return;
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.consecutiveErrors = 0;
    this.pollingTimer = setInterval(() => {
      this.fetchLiveStats();
    }, 10000); // Poll every 10 seconds smoothly
  }

  public stopLivePolling(): void {
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    this.pollingTimer = null;
  }

  private ensureVisitorId(): string {
    const id = this.inMemoryVisitorId ??= crypto.randomUUID?.() ??
      (Math.random().toString(36).slice(2) + Date.now().toString(36));
    try {
      const saved = localStorage.getItem(VISITOR_KEY);
      if (saved) return saved;
      localStorage.setItem(VISITOR_KEY, id);
    } catch {}
    return id;
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

  private trackPageView(url: string): void {
    if (!this.isBrowser || !this.preferences.allowsOptional()) return;
    const path = url.split(/[?#]/, 1)[0];
    if (path === this.lastTrackedPath) return;
    this.lastTrackedPath = path;
    const visitorId = this.ensureVisitorId();

    const payload = {
      type: 'visit',
      visitorId,
      path,
      device: this.getDeviceType(),
      browser: this.getBrowserName()
    };

    void fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .catch(() => {});
  }

  public trackToolUsage(toolName: string, category: 'pdf' | 'image' | 'audio' | 'calculator', details?: string): void {
    if (!this.isBrowser || !this.preferences.allowsOptional()) return;
    const visitorId = this.ensureVisitorId();

    const payload = {
      type: 'tool',
      visitorId,
      path: this.router.url.split(/[?#]/, 1)[0],
      toolName,
      category,
      details,
      device: this.getDeviceType(),
      browser: this.getBrowserName()
    };

    void fetch('/api/telemetry/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .catch(() => {});
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

}
