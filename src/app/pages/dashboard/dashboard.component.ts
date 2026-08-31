import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cyber-dashboard-wrap">
      <!-- Ambient Glow Orbs -->
      <div class="ambient-glow cyan-orb"></div>
      <div class="ambient-glow purple-orb"></div>

      <div class="dashboard-container">
        
        <!-- HEADER HUD -->
        <header class="hud-header glass-card">
          <div class="hud-left">
            <div class="cyber-badge-live">
              <span class="live-dot"></span>
              <span class="live-text">100% LIVE GLOBAL TELEMETRY</span>
            </div>
            <h1 class="hud-title">
              <span class="glitch-text">ConverterAll</span><span class="neon-ai">AI</span>
              <span class="hud-sub">Live Analytics Matrix</span>
            </h1>
            <p class="hud-caption">
              Live real-time visitors, actual country-wise users, most executed AI tools, and in-browser WASM metrics.
            </p>
          </div>

          <div class="hud-actions">
            <div class="hud-chip">
              <span class="chip-label">YOUR LOCATION</span>
              <span class="chip-val">{{ analyticsService.currentCountry().flag }} {{ analyticsService.currentCountry().name }}</span>
            </div>

            <button (click)="refreshFeed()" class="cyber-btn" title="Refresh Live Feed">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
              <span>Refresh</span>
            </button>

            <button (click)="exportReport()" class="cyber-btn primary" title="Export Analytics Report">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              <span>Export JSON</span>
            </button>

            <button (click)="resetStats()" class="cyber-btn danger-btn" title="Reset All Statistics">
              <span>🧹 Reset Data</span>
            </button>
          </div>
        </header>

        <!-- KPI METRICS GRID -->
        <section class="kpi-grid">
          <!-- KPI 1 -->
          <div class="kpi-card glass-card cyan-border">
            <div class="kpi-icon-box cyan-glow">👥</div>
            <div class="kpi-content">
              <span class="kpi-label">TOTAL UNIQUE VISITORS</span>
              <div class="kpi-value">{{ analytics().totalVisitors | number }}</div>
              <div class="kpi-trend up">
                <span>🟢 Live count</span>
                <span class="trend-sub">{{ analytics().totalPageViews }} Page Views</span>
              </div>
            </div>
            <div class="kpi-bar-indicator"><div class="bar-fill cyan" style="width: 100%;"></div></div>
          </div>

          <!-- KPI 2 -->
          <div class="kpi-card glass-card purple-border">
            <div class="kpi-icon-box purple-glow">⚡</div>
            <div class="kpi-content">
              <span class="kpi-label">TOTAL TOOLS EXECUTED</span>
              <div class="kpi-value">{{ analytics().totalToolExecutions | number }}</div>
              <div class="kpi-trend up">
                <span>⚡ Real actions</span>
                <span class="trend-sub">all tools combined</span>
              </div>
            </div>
            <div class="kpi-bar-indicator"><div class="bar-fill purple" style="width: 100%;"></div></div>
          </div>

          <!-- KPI 3 -->
          <div class="kpi-card glass-card emerald-border">
            <div class="kpi-icon-box emerald-glow">🌍</div>
            <div class="kpi-content">
              <span class="kpi-label">TOP VISITING COUNTRY</span>
              <div class="kpi-value" *ngIf="analytics().topCountries.length > 0">
                {{ analytics().topCountries[0].flag }} {{ analytics().topCountries[0].name }}
              </div>
              <div class="kpi-value" *ngIf="analytics().topCountries.length === 0">
                🌐 No visitors yet
              </div>
              <div class="kpi-trend">
                <span>{{ analytics().topCountries[0]?.percentage || 0 }}% of traffic</span>
                <span class="trend-sub">Global reach</span>
              </div>
            </div>
            <div class="kpi-bar-indicator"><div class="bar-fill emerald" [style.width.%]="analytics().topCountries[0]?.percentage || 100"></div></div>
          </div>

          <!-- KPI 4 -->
          <div class="kpi-card glass-card amber-border">
            <div class="kpi-icon-box amber-glow">💾</div>
            <div class="kpi-content">
              <span class="kpi-label">BANDWIDTH / DATA SAVED</span>
              <div class="kpi-value">{{ analytics().totalDataSavedMB | number }} MB</div>
              <div class="kpi-trend emerald-text">
                <span>100% In-Browser WASM</span>
              </div>
            </div>
            <div class="kpi-bar-indicator"><div class="bar-fill amber" style="width: 100%;"></div></div>
          </div>
        </section>

        <!-- MAIN 2-COLUMN SECTION: TRAFFIC GRAPH & TOP COUNTRIES -->
        <div class="grid-2col">
          
          <!-- LEFT: 7-DAY TRAFFIC ACTIVITY CHART -->
          <div class="panel-card glass-card">
            <div class="panel-head">
              <div class="head-left">
                <span class="panel-icon">📈</span>
                <div>
                  <h3 class="panel-title">7-Day Real Traffic &amp; Velocity</h3>
                  <span class="panel-desc">Actual daily visitors and tool executions</span>
                </div>
              </div>
              <div class="legend-pills">
                <span class="legend-item"><span class="dot cyan"></span> Visitors</span>
                <span class="legend-item"><span class="dot purple"></span> Tool Runs</span>
              </div>
            </div>

            <!-- Custom Cyber Bar Chart -->
            <div class="cyber-chart-wrap">
              <div class="chart-bars">
                <div *ngFor="let item of analytics().weeklyTraffic" class="chart-col">
                  <div class="bars-container">
                    <div class="bar-track">
                      <div class="bar-value-pill">{{ item.toolRuns }} runs</div>
                      <div class="bar-fill-dynamic purple-grad" [style.height.%]="getBarHeight(item.toolRuns, maxWeeklyRuns())"></div>
                    </div>
                    <div class="bar-track">
                      <div class="bar-value-pill">{{ item.visitors }} visits</div>
                      <div class="bar-fill-dynamic cyan-grad" [style.height.%]="getBarHeight(item.visitors, maxWeeklyVisitors())"></div>
                    </div>
                  </div>
                  <div class="col-label">
                    <span class="day-name">{{ item.day }}</span>
                    <span class="day-date">{{ item.date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: GEO-ANALYTICS (COUNTRIES BREAKDOWN) -->
          <div class="panel-card glass-card">
            <div class="panel-head">
              <div class="head-left">
                <span class="panel-icon">🌐</span>
                <div>
                  <h3 class="panel-title">Live Global Visitor Countries</h3>
                  <span class="panel-desc">Ranked by real visitor location and traffic</span>
                </div>
              </div>
              <div class="search-input-wrap">
                <input type="text" [(ngModel)]="countrySearch" placeholder="Search country..." class="hud-search" />
              </div>
            </div>

            <div class="country-list-scroll">
              <div *ngIf="filteredCountries().length === 0" class="empty-state-box">
                <span>🌐 Waiting for live visitor requests...</span>
              </div>

              <div *ngFor="let c of filteredCountries(); let i = index" class="country-row">
                <div class="c-rank">#{{ i + 1 }}</div>
                <div class="c-flag">{{ c.flag }}</div>
                <div class="c-info">
                  <div class="c-top-line">
                    <span class="c-name">{{ c.name }}</span>
                    <span class="c-count">{{ c.count | number }} hits ({{ c.percentage }}%)</span>
                  </div>
                  <div class="c-bar-bg">
                    <div class="c-bar-fill" [style.width.%]="c.percentage"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- LOWER 2-COLUMN SECTION: TOOLS LEADERBOARD & LIVE EVENT STREAM -->
        <div class="grid-2col lower-grid">
          
          <!-- LEFT: TOOL PERFORMANCE LEADERBOARD -->
          <div class="panel-card glass-card">
            <div class="panel-head">
              <div class="head-left">
                <span class="panel-icon">🏆</span>
                <div>
                  <h3 class="panel-title">Live Tool Popularity Leaderboard</h3>
                  <span class="panel-desc">Real conversions ranked by actual usage</span>
                </div>
              </div>
              <!-- Filter tabs -->
              <div class="filter-tab-pills">
                <button [class.active]="selectedCategory() === 'all'" (click)="selectedCategory.set('all')">All</button>
                <button [class.active]="selectedCategory() === 'image'" (click)="selectedCategory.set('image')">Image</button>
                <button [class.active]="selectedCategory() === 'pdf'" (click)="selectedCategory.set('pdf')">PDF</button>
                <button [class.active]="selectedCategory() === 'audio'" (click)="selectedCategory.set('audio')">TTS/Audio</button>
                <button [class.active]="selectedCategory() === 'calculator'" (click)="selectedCategory.set('calculator')">Calc</button>
              </div>
            </div>

            <div class="tools-leaderboard-list">
              <div *ngIf="filteredTools().length === 0" class="empty-state-box">
                <span>⚡ No tool executions recorded yet. Open and use any tool to see it appear live here!</span>
              </div>

              <div *ngFor="let tool of filteredTools(); let idx = index" class="tool-rank-row">
                <div class="tool-rank-badge" [class.gold]="idx === 0" [class.silver]="idx === 1" [class.bronze]="idx === 2">
                  {{ idx + 1 }}
                </div>
                <div class="tool-icon-circle">{{ tool.icon }}</div>
                <div class="tool-meta">
                  <div class="tool-title-row">
                    <span class="tool-name">{{ tool.name }}</span>
                    <span class="tool-badge-cat" [attr.data-cat]="tool.category">{{ tool.category | uppercase }}</span>
                  </div>
                  <div class="tool-meter-row">
                    <div class="tool-meter-track">
                      <div class="tool-meter-fill" [style.width.%]="tool.percentage"></div>
                    </div>
                    <span class="tool-meter-stat">{{ tool.count | number }} runs ({{ tool.percentage }}%)</span>
                  </div>
                </div>
                <a [routerLink]="tool.route" class="tool-open-btn" title="Open Tool">
                  <span>Launch →</span>
                </a>
              </div>
            </div>
          </div>

          <!-- RIGHT: LIVE ACTIVITY STREAM & DEVICE MATRIX -->
          <div class="panel-card glass-card">
            <div class="panel-head">
              <div class="head-left">
                <span class="panel-icon">⚡</span>
                <div>
                  <h3 class="panel-title">Real-Time User Execution Stream</h3>
                  <span class="panel-desc">Live streaming events from actual visitors</span>
                </div>
              </div>
              <span class="stream-pulse">● LIVE STREAM</span>
            </div>

            <!-- Device/Browser Matrix mini-strip -->
            <div class="device-matrix-strip">
              <div class="matrix-box">
                <span class="m-label">🖥️ Desktop</span>
                <span class="m-val">{{ analytics().deviceBreakdown.desktop }}%</span>
              </div>
              <div class="matrix-box">
                <span class="m-label">📱 Mobile</span>
                <span class="m-val">{{ analytics().deviceBreakdown.mobile }}%</span>
              </div>
              <div class="matrix-box">
                <span class="m-label">🌐 Chrome</span>
                <span class="m-val">{{ analytics().browserBreakdown.chrome }}%</span>
              </div>
              <div class="matrix-box">
                <span class="m-label">🧭 Safari / Other</span>
                <span class="m-val">{{ (analytics().browserBreakdown.safari + analytics().browserBreakdown.other) | number:'1.0-1' }}%</span>
              </div>
            </div>

            <!-- Activity Items List -->
            <div class="activity-feed-scroll">
              <div *ngIf="analytics().recentActivities.length === 0" class="empty-state-box">
                <span>⏳ Waiting for incoming real-time activity...</span>
              </div>

              <div *ngFor="let act of analytics().recentActivities" class="activity-item">
                <div class="act-flag">{{ act.flag }}</div>
                <div class="act-body">
                  <div class="act-main">
                    <span class="act-title">{{ act.title }}</span>
                    <span class="act-tag">{{ act.country }}</span>
                  </div>
                  <div class="act-foot">
                    <span class="act-detail">{{ act.details || 'Real-time telemetry hit' }}</span>
                    <span class="act-time">{{ formatTimeAgo(act.timestamp) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #070913;
      color: #f1f5f9;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow-x: hidden;
      padding-bottom: 5rem;
    }

    .cyber-dashboard-wrap {
      position: relative;
      min-height: 100vh;
      padding: 1.5rem 1rem;
    }

    /* Ambient Background Glows */
    .ambient-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(140px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.25;
    }
    .cyan-orb {
      width: 500px;
      height: 500px;
      top: 50px;
      left: -100px;
      background: #00f0ff;
    }
    .purple-orb {
      width: 600px;
      height: 600px;
      top: 300px;
      right: -150px;
      background: #8b5cf6;
    }

    .dashboard-container {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
    }

    /* Glass Card Standard */
    .glass-card {
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
    }

    /* HUD HEADER */
    .hud-header {
      padding: 2rem 2.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
      border: 1px solid rgba(0, 240, 255, 0.22);
      box-shadow: 0 0 30px rgba(0, 240, 255, 0.06);
    }

    .cyber-badge-live {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 99px;
      padding: 0.3rem 0.85rem;
      margin-bottom: 0.7rem;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 1.5s infinite;
    }
    .live-text {
      color: #34d399;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 1px;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }

    .hud-title {
      font-size: 2.1rem;
      font-weight: 900;
      margin: 0;
      letter-spacing: -0.5px;
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .glitch-text {
      color: #fff;
    }
    .neon-ai {
      background: linear-gradient(135deg, #00f0ff 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hud-sub {
      font-size: 1.1rem;
      color: #94a3b8;
      font-weight: 500;
      margin-left: 0.5rem;
    }
    .hud-caption {
      margin: 0.4rem 0 0 0;
      color: #94a3b8;
      font-size: 0.92rem;
      max-width: 600px;
    }

    .hud-actions {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      flex-wrap: wrap;
    }
    .hud-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0.5rem 0.9rem;
      display: flex;
      flex-direction: column;
    }
    .chip-label {
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .chip-val {
      font-size: 0.88rem;
      font-weight: 700;
      color: #00f0ff;
    }

    .cyber-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #f1f5f9;
      font-size: 0.84rem;
      font-weight: 600;
      padding: 0.65rem 1.1rem;
      border-radius: 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    .cyber-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }
    .cyber-btn.primary {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      border: none;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
    }
    .cyber-btn.primary:hover {
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.55);
    }
    .cyber-btn.danger-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
    }
    .cyber-btn.danger-btn:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    /* KPI GRID */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
    @media (max-width: 1100px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }

    .kpi-card {
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
    }
    .cyan-border { border-left: 3px solid #00f0ff; }
    .purple-border { border-left: 3px solid #a855f7; }
    .emerald-border { border-left: 3px solid #10b981; }
    .amber-border { border-left: 3px solid #f59e0b; }

    .kpi-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      margin-bottom: 0.3rem;
    }
    .cyan-glow { background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.3); }
    .purple-glow { background: rgba(168, 85, 247, 0.12); border: 1px solid rgba(168, 85, 247, 0.3); }
    .emerald-glow { background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); }
    .amber-glow { background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); }

    .kpi-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.8px;
    }
    .kpi-value {
      font-size: 2rem;
      font-weight: 900;
      color: #fff;
      margin: 0.2rem 0;
    }
    .kpi-trend {
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #94a3b8;
    }
    .kpi-trend.up span:first-child {
      color: #34d399;
      font-weight: 700;
    }
    .emerald-text {
      color: #34d399 !important;
      font-weight: 600;
    }
    .trend-sub {
      color: #64748b;
    }

    .kpi-bar-indicator {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 99px;
      overflow: hidden;
    }
    .bar-fill { height: 100%; border-radius: 99px; }
    .bar-fill.cyan { background: #00f0ff; box-shadow: 0 0 8px #00f0ff; }
    .bar-fill.purple { background: #a855f7; box-shadow: 0 0 8px #a855f7; }
    .bar-fill.emerald { background: #10b981; box-shadow: 0 0 8px #10b981; }
    .bar-fill.amber { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }

    /* 2-COLUMN PANELS */
    .grid-2col {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 1.5rem;
    }
    @media (max-width: 1024px) {
      .grid-2col { grid-template-columns: 1fr; }
    }

    .panel-card {
      padding: 1.8rem;
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
    }
    .panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 1rem;
    }
    .head-left {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    .panel-icon {
      font-size: 1.5rem;
    }
    .panel-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #fff;
      margin: 0;
    }
    .panel-desc {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    /* CHART WRAP */
    .legend-pills {
      display: flex;
      gap: 1rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      color: #94a3b8;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .dot.cyan { background: #00f0ff; }
    .dot.purple { background: #a855f7; }

    .cyber-chart-wrap {
      padding: 1rem 0;
      height: 280px;
    }
    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 100%;
      gap: 0.8rem;
    }
    .chart-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      gap: 0.6rem;
    }
    .bars-container {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      height: 200px;
      width: 100%;
      justify-content: center;
    }
    .bar-track {
      position: relative;
      width: 22px;
      height: 100%;
      display: flex;
      align-items: flex-end;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px 6px 0 0;
    }
    .bar-fill-dynamic {
      width: 100%;
      border-radius: 6px 6px 0 0;
      transition: height 0.5s ease;
      min-height: 4px;
    }
    .purple-grad {
      background: linear-gradient(180deg, #a855f7 0%, rgba(168, 85, 247, 0.3) 100%);
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
    }
    .cyan-grad {
      background: linear-gradient(180deg, #00f0ff 0%, rgba(0, 240, 255, 0.3) 100%);
      box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
    }
    .bar-value-pill {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.65rem;
      font-weight: 700;
      color: #e2e8f0;
      opacity: 0;
      transition: opacity 0.2s ease;
      white-space: nowrap;
      pointer-events: none;
      background: rgba(0,0,0,0.8);
      padding: 2px 4px;
      border-radius: 4px;
    }
    .bar-track:hover .bar-value-pill {
      opacity: 1;
    }
    .col-label {
      text-align: center;
      display: flex;
      flex-direction: column;
    }
    .day-name { font-size: 0.78rem; font-weight: 700; color: #fff; }
    .day-date { font-size: 0.68rem; color: #64748b; }

    /* COUNTRY LIST */
    .hud-search {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.4rem 0.8rem;
      color: #fff;
      font-size: 0.8rem;
      outline: none;
    }
    .hud-search:focus {
      border-color: #00f0ff;
    }
    .country-list-scroll {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      max-height: 280px;
      overflow-y: auto;
      padding-right: 0.3rem;
    }
    .empty-state-box {
      padding: 2rem;
      text-align: center;
      color: #94a3b8;
      font-size: 0.85rem;
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    .country-row {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.5rem 0.7rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      transition: background 0.2s ease;
    }
    .country-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    .c-rank {
      font-size: 0.75rem;
      font-weight: 800;
      color: #64748b;
      width: 24px;
    }
    .c-flag {
      font-size: 1.4rem;
    }
    .c-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .c-top-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.84rem;
    }
    .c-name {
      font-weight: 700;
      color: #f1f5f9;
    }
    .c-count {
      color: #94a3b8;
      font-size: 0.78rem;
    }
    .c-bar-bg {
      width: 100%;
      height: 5px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 99px;
      overflow: hidden;
    }
    .c-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #00f0ff 0%, #a855f7 100%);
      border-radius: 99px;
    }

    /* TOOLS LEADERBOARD */
    .filter-tab-pills {
      display: flex;
      gap: 0.3rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 0.25rem;
      border-radius: 8px;
    }
    .filter-tab-pills button {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-tab-pills button.active {
      background: rgba(255, 255, 255, 0.12);
      color: #00f0ff;
    }

    .tools-leaderboard-list {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }
    .tool-rank-row {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.7rem 0.9rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .tool-rank-row:hover {
      transform: translateX(4px);
      border-color: rgba(0, 240, 255, 0.3);
    }
    .tool-rank-badge {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.78rem;
      font-weight: 800;
      color: #cbd5e1;
    }
    .tool-rank-badge.gold { background: #eab308; color: #000; box-shadow: 0 0 10px #eab308; }
    .tool-rank-badge.silver { background: #94a3b8; color: #000; }
    .tool-rank-badge.bronze { background: #b45309; color: #fff; }

    .tool-icon-circle {
      font-size: 1.3rem;
    }
    .tool-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .tool-title-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .tool-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: #fff;
    }
    .tool-badge-cat {
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      color: #94a3b8;
    }
    .tool-badge-cat[data-cat="image"] { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
    .tool-badge-cat[data-cat="pdf"] { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .tool-badge-cat[data-cat="audio"] { background: rgba(0, 240, 255, 0.15); color: #38bdf8; }
    .tool-badge-cat[data-cat="calculator"] { background: rgba(16, 185, 129, 0.15); color: #34d399; }

    .tool-meter-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .tool-meter-track {
      flex: 1;
      height: 5px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 99px;
      overflow: hidden;
    }
    .tool-meter-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1 0%, #00f0ff 100%);
      border-radius: 99px;
    }
    .tool-meter-stat {
      font-size: 0.72rem;
      color: #94a3b8;
      white-space: nowrap;
    }
    .tool-open-btn {
      color: #00f0ff;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 0.4rem 0.7rem;
      border-radius: 6px;
      background: rgba(0, 240, 255, 0.08);
      border: 1px solid rgba(0, 240, 255, 0.2);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .tool-open-btn:hover {
      background: rgba(0, 240, 255, 0.2);
      transform: translateY(-2px);
    }

    /* DEVICE & ACTIVITY FEED */
    .stream-pulse {
      font-size: 0.72rem;
      font-weight: 800;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.3rem 0.6rem;
      border-radius: 6px;
    }

    .device-matrix-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.6rem;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.8rem;
      border-radius: 10px;
    }
    .matrix-box {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .m-label { font-size: 0.7rem; color: #94a3b8; }
    .m-val { font-size: 0.95rem; font-weight: 800; color: #fff; }

    .activity-feed-scroll {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      max-height: 270px;
      overflow-y: auto;
      padding-right: 0.3rem;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.6rem 0.8rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
    }
    .act-flag { font-size: 1.4rem; }
    .act-body { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
    .act-main { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .act-title { font-size: 0.84rem; font-weight: 700; color: #f1f5f9; }
    .act-tag { font-size: 0.7rem; color: #00f0ff; background: rgba(0, 240, 255, 0.1); padding: 2px 6px; border-radius: 4px; }
    .act-foot { display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: #64748b; }
  `]
})
export class DashboardComponent implements OnInit {
  public analyticsService = inject(AnalyticsService);
  public analytics = this.analyticsService.analyticsData;

  public countrySearch = '';
  public selectedCategory = signal<'all' | 'image' | 'pdf' | 'audio' | 'calculator'>('all');

  ngOnInit() {
    this.analyticsService.fetchLiveStats();
  }

  public filteredCountries = computed(() => {
    const list = this.analytics().topCountries;
    if (!this.countrySearch.trim()) return list;
    const query = this.countrySearch.toLowerCase();
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

  resetStats(): void {
    if (confirm('Are you sure you want to reset all analytics back to 0?')) {
      this.analyticsService.resetData();
    }
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
