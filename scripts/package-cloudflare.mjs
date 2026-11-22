import { copyFileSync, existsSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { TOOL_ALIASES } from '../src/app/data/tool-locales.data.ts';
import { TOOLS_DATA } from '../src/app/data/tools.data.ts';

const browser = process.argv[2] ?? 'dist/converterallai/browser';
const canonicalPages = new Set([
  '/developer-tools/json-formatter', '/typing-speed-test', '/typing-master', '/games',
  ...TOOLS_DATA.filter((tool) => tool.categoryId === 'games').map((tool) => tool.slug),
]);
const redirects = [];

// Pages serves a flat .html file at the extensionless canonical URL.
for (const canonical of canonicalPages) {
  const page = join(browser, canonical.slice(1));
  if (existsSync(join(page, 'index.html'))) renameSync(join(page, 'index.html'), page + '.html');
  if (!existsSync(page + '.html')) throw new Error(`Prerendered HTML is missing for ${canonical}.`);
  redirects.push(`${canonical}/ ${canonical} 308`);
}

for (const [alias, canonical] of Object.entries(TOOL_ALIASES)) {
  if (canonicalPages.has(canonical)) redirects.push(`${alias} ${canonical} 308`, `${alias}/ ${canonical} 308`);
}

copyFileSync(join(browser, 'index.csr.html'), join(browser, 'index.html'));
writeFileSync(join(browser, '_redirects'), [...redirects, ''].join('\n'));
