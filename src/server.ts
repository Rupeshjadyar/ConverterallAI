import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import { join } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

/* Serve static files from /browser */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/* Serve assets folder (src/assets) */
const assetsPath = join(process.cwd(), 'src', 'assets');
app.use('/assets', express.static(assetsPath));

/* Expose home image directly for convenience */
const homeImagePath = join(process.cwd(), 'src', 'assets', 'images', 'home.png');
app.get('/home.png', (req: Request, res: Response) => {
  res.sendFile(homeImagePath);
});

/* Google Search Console Verification Endpoint */
app.get('/googleabc606346e17bc34.html', (req: Request, res: Response) => {
  res.type('text/html').send('google-site-verification: googleabc606346e17bc34.html');
});

/* ═══════════════════════════════════════════════════════════════
   REAL-TIME GLOBAL TELEMETRY & ANALYTICS BACKEND
   ═══════════════════════════════════════════════════════════════ */
const TELEMETRY_FILE = join(process.cwd(), 'analytics-live.json');

interface LiveAnalyticsStore {
  totalVisitors: number;
  totalPageViews: number;
  totalToolExecutions: number;
  totalDataSavedMB: number;
  visitorSet: Record<string, boolean>;
  topCountries: Record<string, { code: string; name: string; flag: string; count: number }>;
  topTools: Record<string, { name: string; category: string; icon: string; count: number; route: string }>;
  weeklyTraffic: Record<string, { visitors: number; toolRuns: number; day: string; date: string }>;
  devices: { desktop: number; mobile: number; tablet: number };
  browsers: { chrome: number; safari: number; edge: number; firefox: number; other: number };
  recentActivities: Array<{
    id: string;
    title: string;
    country: string;
    flag: string;
    timestamp: string;
    category: string;
    details?: string;
  }>;
}

function getInitialStore(): LiveAnalyticsStore {
  return {
    totalVisitors: 0,
    totalPageViews: 0,
    totalToolExecutions: 0,
    totalDataSavedMB: 0,
    visitorSet: {},
    topCountries: {},
    topTools: {},
    weeklyTraffic: {},
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    browsers: { chrome: 0, safari: 0, edge: 0, firefox: 0, other: 0 },
    recentActivities: []
  };
}

let liveStore: LiveAnalyticsStore = getInitialStore();

// Load from disk if exists
try {
  if (existsSync(TELEMETRY_FILE)) {
    const raw = readFileSync(TELEMETRY_FILE, 'utf-8');
    liveStore = { ...getInitialStore(), ...JSON.parse(raw) };
  }
} catch (e) {
  console.warn('Could not read analytics-live.json', e);
}

function saveStore() {
  try {
    writeFileSync(TELEMETRY_FILE, JSON.stringify(liveStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save analytics-live.json', e);
  }
}

function getCountryFromCode(code: string): { name: string; flag: string } {
  if (!code || code.length !== 2) return { name: 'Unknown', flag: '🌐' };
  const upper = code.toUpperCase();
  const flag = upper.split('').map(c => String.fromCodePoint(127397 + c.charCodeAt(0))).join('');
  const names: Record<string, string> = {
    IN: 'India', US: 'United States', GB: 'United Kingdom', AE: 'United Arab Emirates',
    DE: 'Germany', CA: 'Canada', AU: 'Australia', FR: 'France', SA: 'Saudi Arabia',
    PK: 'Pakistan', BD: 'Bangladesh', BR: 'Brazil', ID: 'Indonesia', NG: 'Nigeria',
    RU: 'Russia', JP: 'Japan', CN: 'China', IT: 'Italy', ES: 'Spain', SG: 'Singapore'
  };
  return { name: names[upper] || upper, flag };
}

// GET Live Stats
app.get('/api/telemetry/stats', (req: Request, res: Response) => {
  const totalCountryHits = Object.values(liveStore.topCountries).reduce((a, b) => a + b.count, 0) || 1;
  const topCountriesList = Object.values(liveStore.topCountries)
    .map(c => ({
      ...c,
      percentage: +((c.count / totalCountryHits) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  const totalToolHits = Object.values(liveStore.topTools).reduce((a, b) => a + b.count, 0) || 1;
  const topToolsList = Object.values(liveStore.topTools)
    .map(t => ({
      ...t,
      percentage: +((t.count / totalToolHits) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  // Generate 7-day traffic format
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeklyTrafficList = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    const dateStr = `${months[d.getMonth()]} ${d.getDate()}`;
    const dayData = liveStore.weeklyTraffic[key] || { visitors: 0, toolRuns: 0 };
    weeklyTrafficList.push({
      day: dayName,
      date: dateStr,
      visitors: dayData.visitors,
      toolRuns: dayData.toolRuns
    });
  }

  // Device percentage
  const totalDev = liveStore.devices.desktop + liveStore.devices.mobile + liveStore.devices.tablet || 1;
  const deviceBreakdown = {
    desktop: +((liveStore.devices.desktop / totalDev) * 100).toFixed(1),
    mobile: +((liveStore.devices.mobile / totalDev) * 100).toFixed(1),
    tablet: +((liveStore.devices.tablet / totalDev) * 100).toFixed(1)
  };

  // Browser percentage
  const totalBrowser = Object.values(liveStore.browsers).reduce((a, b) => a + b, 0) || 1;
  const browserBreakdown = {
    chrome: +((liveStore.browsers.chrome / totalBrowser) * 100).toFixed(1),
    safari: +((liveStore.browsers.safari / totalBrowser) * 100).toFixed(1),
    edge: +((liveStore.browsers.edge / totalBrowser) * 100).toFixed(1),
    firefox: +((liveStore.browsers.firefox / totalBrowser) * 100).toFixed(1),
    other: +((liveStore.browsers.other / totalBrowser) * 100).toFixed(1)
  };

  res.json({
    totalVisitors: liveStore.totalVisitors,
    totalPageViews: liveStore.totalPageViews,
    totalToolExecutions: liveStore.totalToolExecutions,
    totalDataSavedMB: liveStore.totalDataSavedMB,
    topCountries: topCountriesList.length > 0 ? topCountriesList : [{ code: 'IN', name: 'India', flag: '🇮🇳', count: 1, percentage: 100 }],
    topTools: topToolsList,
    weeklyTraffic: weeklyTrafficList,
    deviceBreakdown,
    browserBreakdown,
    recentActivities: liveStore.recentActivities
  });
});

// POST Telemetry Event
app.post('/api/telemetry/event', (req: Request, res: Response) => {
  try {
    const { type, visitorId, path, toolName, category, details, countryCode, countryName, flag, device, browser } = req.body || {};

    // 1. Detect Country
    const cfCountry = (req.headers['cf-ipcountry'] || req.headers['x-country-code'] || countryCode || 'IN') as string;
    const countryInfo = getCountryFromCode(cfCountry);
    const resolvedCountryName = countryName || countryInfo.name;
    const resolvedFlag = flag || countryInfo.flag;

    // 2. Track Unique Visitor
    if (visitorId && !liveStore.visitorSet[visitorId]) {
      liveStore.visitorSet[visitorId] = true;
      liveStore.totalVisitors += 1;
    }

    // 3. Track Date Key
    const todayKey = new Date().toISOString().split('T')[0];
    if (!liveStore.weeklyTraffic[todayKey]) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      liveStore.weeklyTraffic[todayKey] = {
        visitors: 0,
        toolRuns: 0,
        day: days[now.getDay()],
        date: `${months[now.getMonth()]} ${now.getDate()}`
      };
    }

    // 4. Update Country Stats
    if (!liveStore.topCountries[cfCountry]) {
      liveStore.topCountries[cfCountry] = {
        code: cfCountry,
        name: resolvedCountryName,
        flag: resolvedFlag,
        count: 0
      };
    }
    liveStore.topCountries[cfCountry].count += 1;

    // 5. Update Device / Browser
    if (device === 'mobile') liveStore.devices.mobile += 1;
    else if (device === 'tablet') liveStore.devices.tablet += 1;
    else liveStore.devices.desktop += 1;

    if (browser === 'safari') liveStore.browsers.safari += 1;
    else if (browser === 'edge') liveStore.browsers.edge += 1;
    else if (browser === 'firefox') liveStore.browsers.firefox += 1;
    else if (browser === 'chrome') liveStore.browsers.chrome += 1;
    else liveStore.browsers.other += 1;

    if (type === 'visit') {
      liveStore.totalPageViews += 1;
      liveStore.weeklyTraffic[todayKey].visitors += 1;

      liveStore.recentActivities.unshift({
        id: Date.now().toString(),
        title: `Visited ${path || 'Homepage'}`,
        country: resolvedCountryName,
        flag: resolvedFlag,
        timestamp: new Date().toISOString(),
        category: 'visit',
        details: 'Direct Visitor Access'
      });
    } else if (type === 'tool' && toolName) {
      liveStore.totalToolExecutions += 1;
      liveStore.totalDataSavedMB += 2;
      liveStore.weeklyTraffic[todayKey].toolRuns += 1;

      const cat = category || 'tool';
      const icon = cat === 'pdf' ? '📄' : cat === 'image' ? '🖼️' : cat === 'audio' ? '🎙️' : '🧮';
      if (!liveStore.topTools[toolName]) {
        liveStore.topTools[toolName] = {
          name: toolName,
          category: cat,
          icon,
          count: 0,
          route: path || '/'
        };
      }
      liveStore.topTools[toolName].count += 1;

      liveStore.recentActivities.unshift({
        id: Date.now().toString(),
        title: `Executed ${toolName}`,
        country: resolvedCountryName,
        flag: resolvedFlag,
        timestamp: new Date().toISOString(),
        category: 'tool',
        details: details || 'Client-Side WASM processing'
      });
    }

    // Keep recent activities capped at 30
    if (liveStore.recentActivities.length > 30) {
      liveStore.recentActivities = liveStore.recentActivities.slice(0, 30);
    }

    saveStore();
    res.json({ success: true });
  } catch (err) {
    console.error('Error recording telemetry', err);
    res.status(500).json({ error: 'Failed to record event' });
  }
});

// POST Reset Stats
app.post('/api/telemetry/reset', (req: Request, res: Response) => {
  liveStore = getInitialStore();
  saveStore();
  res.json({ success: true, message: 'Analytics reset successfully' });
});

/* Handle all other requests by rendering the Angular application. */
app.use((req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/* Start the server if this module is the main entry point or PM2. */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error?: Error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/* Request handler – used by Angular CLI or Firebase. */
export const reqHandler = createNodeRequestHandler(app);
