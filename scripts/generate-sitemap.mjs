import fs from 'fs';
import path from 'path';

// Central Domain Configuration
const SITE_DOMAIN = 'https://converterallai.com';
const TODAY = new Date().toISOString().split('T')[0];

function extractToolsFromTs() {
  const content = fs.readFileSync('src/app/data/tools.data.ts', 'utf8');
  const slugRegex = /["']?slug["']?:\s*['"]([^'"]+)['"]/g;
  const slugs = new Set();
  let m;
  while ((m = slugRegex.exec(content)) !== null) {
    let slug = m[1].trim();
    if (!slug.startsWith('/')) slug = '/' + slug;
    slugs.add(slug);
  }
  return Array.from(slugs);
}

function extractCategoriesFromTs() {
  const content = fs.readFileSync('src/app/data/categories.data.ts', 'utf8');
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const slugs = new Set();
  let m;
  while ((m = slugRegex.exec(content)) !== null) {
    let slug = m[1].trim();
    if (!slug.startsWith('/')) slug = '/' + slug;
    slugs.add(slug);
  }
  return Array.from(slugs);
}

function extractTtsLanguages() {
  if (!fs.existsSync('src/app/data/tts-languages.data.ts')) return [];
  const content = fs.readFileSync('src/app/data/tts-languages.data.ts', 'utf8');
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
  const slugs = [];
  let m;
  while ((m = slugRegex.exec(content)) !== null) {
    slugs.push('/audio-processing/tts/' + m[1].trim());
  }
  return slugs;
}

const legalPages = [
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/disclaimer',
  '/cookie-policy'
];

const sqlChapters = [
  '/developer-tools/web-tutorials',
  '/ai-chat',
  '/developer-tools/sql/intro',
  '/developer-tools/sql/syntax',
  '/developer-tools/sql/ddl',
  '/developer-tools/sql/dml',
  '/developer-tools/sql/dql',
  '/developer-tools/sql/dcl',
  '/developer-tools/sql/tcl',
  '/developer-tools/sql/joins',
  '/developer-tools/sql/data-types',
  '/developer-tools/sql/constraints',
  '/developer-tools/sql/functions',
  '/developer-tools/sql/group-by',
  '/developer-tools/sql/subqueries',
  '/developer-tools/sql/foreign-keys',
  '/developer-tools/sql/views',
  '/developer-tools/sql/playground'
];

const categoryPages = extractCategoriesFromTs();
const toolPages = extractToolsFromTs();
const ttsPages = extractTtsLanguages();

const urls = [];

// 1. Home Page (1.0)
urls.push({
  loc: `${SITE_DOMAIN}/`,
  changefreq: 'daily',
  priority: '1.0'
});

// 2. Category Landing Pages (0.9)
for (const cat of categoryPages) {
  urls.push({
    loc: `${SITE_DOMAIN}${cat}`,
    changefreq: 'weekly',
    priority: '0.9'
  });
}

// 3. Tool Pages (0.8)
for (const tool of toolPages) {
  urls.push({
    loc: `${SITE_DOMAIN}${tool}`,
    changefreq: 'weekly',
    priority: '0.8'
  });
}

// 4. SQL Interactive Modules (0.7)
for (const sql of sqlChapters) {
  urls.push({
    loc: `${SITE_DOMAIN}${sql}`,
    changefreq: 'weekly',
    priority: '0.7'
  });
}

// 5. TTS Regional Language Pages (0.6)
for (const tts of ttsPages) {
  urls.push({
    loc: `${SITE_DOMAIN}${tts}`,
    changefreq: 'monthly',
    priority: '0.6'
  });
}

// 6. Legal & Policy Pages (0.3)
for (const leg of legalPages) {
  urls.push({
    loc: `${SITE_DOMAIN}${leg}`,
    changefreq: 'monthly',
    priority: '0.3'
  });
}

// Deduplicate by URL
const seenLocs = new Set();
const uniqueUrls = [];
for (const u of urls) {
  if (!seenLocs.has(u.loc)) {
    seenLocs.add(u.loc);
    uniqueUrls.push(u);
  }
}

// Build XML string
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('src/sitemap.xml', xml, 'utf8');
console.log(`Generated src/sitemap.xml with ${uniqueUrls.length} public URLs successfully!`);
