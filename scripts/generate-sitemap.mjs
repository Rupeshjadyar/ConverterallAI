import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES_DATA } from '../src/app/data/categories.data.ts';
import { SITE_DOMAIN } from '../src/app/data/seo.config.ts';
import { BMI_HI } from '../src/app/data/tool-locales.data.ts';
import { TOOLS_DATA } from '../src/app/data/tools.data.ts';
import { TTS_LANGUAGES } from '../src/app/data/tts-languages.data.ts';

const output = '.generated/seo';
const chunkSize = 500;
const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const categories = CATEGORIES_DATA.map(category => category.slug);
const tools = TOOLS_DATA.map(tool => tool.slug);
const sql = 'intro syntax ddl dml dql dcl tcl joins data-types constraints functions group-by subqueries foreign-keys views playground';
const groups = {
  pages: [
    '/', ...categories.filter(path => path !== '/games'),
    '/about', '/contact', '/privacy-policy', '/terms-of-service', '/disclaimer',
    '/cookie-policy', '/developer-tools/web-tutorials', '/ai-chat',
    ...sql.split(' ').map(chapter => '/developer-tools/sql/' + chapter),
  ],
  tools: [...tools.filter(path => !path.startsWith('/games/')), BMI_HI],
  games: ['/games', ...tools.filter(path => path.startsWith('/games/'))],
  tts: TTS_LANGUAGES.map(language => '/audio-processing/tts/' + language.slug),
};

function writeXml(file, root, rows) {
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<' + root +
    ' xmlns="' + namespace + '">\n' + rows.join('\n') + '\n</' + root + '>\n';
  if (Buffer.byteLength(xml) > 50_000_000) throw new Error('Sitemap exceeds size limit: ' + file);
  writeFileSync(join(output, file), xml);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const seen = new Set();
const files = [];
for (const [name, paths] of Object.entries(groups)) {
  const urls = [];
  for (const path of paths) {
    if (!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/i.test(path)) {
      throw new Error('Unexpected sitemap path: ' + path);
    }
    if (seen.has(path)) continue;
    seen.add(path);
    urls.push(SITE_DOMAIN + path);
  }
  for (let offset = 0; offset < urls.length; offset += chunkSize) {
    const suffix = offset ? '-' + (offset / chunkSize + 1) : '';
    const nameWithSuffix = 'sitemap-' + name + suffix + '.xml';
    writeXml(nameWithSuffix, 'urlset', urls.slice(offset, offset + chunkSize)
      .map(url => '  <url><loc>' + url + '</loc></url>'));
    files.push(nameWithSuffix);
  }
}
if (files.length > 50_000) throw new Error('Sitemap index exceeds entry limit');
writeXml('sitemap.xml', 'sitemapindex',
  files.map(file => '  <sitemap><loc>' + SITE_DOMAIN + '/' + file + '</loc></sitemap>'));
writeFileSync(join(output, 'robots.txt'),
  'User-agent: *\nDisallow: /api/\n\nSitemap: ' + SITE_DOMAIN + '/sitemap.xml\n');
console.log('Generated ' + files.length + ' sitemaps with ' + seen.size + ' URLs.');
