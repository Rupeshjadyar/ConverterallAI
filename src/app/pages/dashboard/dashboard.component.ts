import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public analyticsService = inject(AnalyticsService);
  public analytics = this.analyticsService.analyticsData;

  public countrySearch = signal('');
  public selectedCategory = signal<'all' | 'image' | 'pdf' | 'audio' | 'calculator'>('all');

  ngOnInit() {
    this.analyticsService.fetchLiveStats();
    this.analyticsService.startLivePolling();
  }

  ngOnDestroy() {
    this.analyticsService.stopLivePolling();
  }

  public filteredCountries = computed(() => {
    const list = this.analytics().topCountries;
    const query = this.countrySearch().trim().toLowerCase();
    if (!query) return list;
    return list.filter(c => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query));
  });

  public filteredTools = computed(() => {
    const list = this.analytics().topTools;
    const cat = this.selectedCategory();
    if (cat === 'all') return list;
    return list.filter(t => t.category === cat);
  });

  public maxWeeklyRuns = computed(() => {
    const list = this.analytics().weeklyTraffic;
    const max = Math.max(...list.map(i => i.toolRuns), 10);
    return max;
  });

  public maxWeeklyVisitors = computed(() => {
    const list = this.analytics().weeklyTraffic;
    const max = Math.max(...list.map(i => i.visitors), 10);
    return max;
  });

  getBarHeight(val: number, max: number): number {
    if (val === 0) return 4; // minimum dot
    return Math.min(100, Math.max(8, (val / max) * 100));
  }

  refreshFeed(): void {
    this.analyticsService.fetchLiveStats();
  }

  exportReport(): void {
    this.analyticsService.exportData();
  }

  formatTimeAgo(isoString: string): string {
    if (!isoString) return 'Just now';
    const now = new Date().getTime();
    const diff = Math.floor((now - new Date(isoString).getTime()) / 1000);
    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }
}
