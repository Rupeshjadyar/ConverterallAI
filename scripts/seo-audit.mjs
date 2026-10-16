import fs from 'fs';
import path from 'path';

const DIST_BROWSER = path.resolve('dist/converterallai/browser');

if (!fs.existsSync(DIST_BROWSER)) {
  console.error(`Error: Directory ${DIST_BROWSER} does not exist. Run 'npm run build' first.`);
  process.exit(1);
}

function findIndexHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findIndexHtmlFiles(fullPath));
    } else if (entry.name === 'index.html') {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = findIndexHtmlFiles(DIST_BROWSER);
console.log(`\n========================================`);
console.log(`CONVERTERALL AI - SEO PRODUCTION AUDIT`);
console.log(`Found ${htmlFiles.length} prerendered HTML files`);
console.log(`========================================\n`);

const seenTitles = new Map();
const seenDescriptions = new Map();
const errors = [];
const warnings = [];
const tableRows = [];

for (const filePath of htmlFiles) {
  const relativePath = path.relative(DIST_BROWSER, filePath).replace(/\\/g, '/');
  const route = '/' + relativePath.replace(/\/index\.html$/, '').replace(/^index\.html$/, '');
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip 404 page for uniqueness checks, but audit basic structure
  const is404 = route === '/404';

  // 1. Title Audit
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) {
    errors.push(`[${route}] Missing or empty <title>`);
  } else {
    // Unescape HTML entities like &amp; for accurate char count
    const plainTitle = title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    if (plainTitle.length > 60) {
      errors.push(`[${route}] Title exceeds 60 chars (${plainTitle.length} chars): "${plainTitle}"`);
    }
    if (!is404) {
      if (seenTitles.has(plainTitle)) {
        errors.push(`[${route}] Duplicate title with [${seenTitles.get(plainTitle)}]: "${plainTitle}"`);
      } else {
        seenTitles.set(plainTitle, route);
      }
    }
  }

  // 2. Meta Description Audit
  const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                    content.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';
  if (!description) {
    errors.push(`[${route}] Missing meta description`);
  } else {
    const plainDesc = description.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    if (plainDesc.length > 165) {
      errors.push(`[${route}] Description exceeds 165 chars (${plainDesc.length} chars): "${plainDesc}"`);
    }
    if (!is404) {
      if (seenDescriptions.has(plainDesc)) {
        errors.push(`[${route}] Duplicate description with [${seenDescriptions.get(plainDesc)}]: "${plainDesc}"`);
      } else {
        seenDescriptions.set(plainDesc, route);
      }
    }
  }

  // 3. Canonical Link Audit
  const canonicalMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                         content.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';
  if (!canonical) {
    errors.push(`[${route}] Missing canonical link`);
  } else {
    if (canonical.includes('?')) {
      errors.push(`[${route}] Canonical link contains query params: "${canonical}"`);
    }
    // Only root '/' should have trailing slash
    const urlPath = canonical.replace(/^https?:\/\/[^\/]+/, '');
    if (urlPath.length > 1 && urlPath.endsWith('/')) {
      errors.push(`[${route}] Canonical link has unwanted trailing slash: "${canonical}"`);
    }
  }

  // 4. H1 Heading Audit
  const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  if (h1Matches.length === 0) {
    errors.push(`[${route}] Missing H1 heading (found 0)`);
  } else if (h1Matches.length > 1) {
    errors.push(`[${route}] Multiple H1 headings found (${h1Matches.length})`);
  }

  // 5. JSON-LD Structured Data Audit
  const jsonLdMatch = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  let schemaTypes = [];
  if (!jsonLdMatch) {
    errors.push(`[${route}] Missing JSON-LD script`);
  } else {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
        schemaTypes = parsed['@graph'].map(item => item['@type']);
      } else if (parsed['@type']) {
        schemaTypes = [parsed['@type']];
      } else if (Array.isArray(parsed)) {
        schemaTypes = parsed.map(item => item['@type']);
      }
    } catch (e) {
      errors.push(`[${route}] Invalid JSON in JSON-LD script: ${e.message}`);
    }
  }

  // 6. Image Alt Audit
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  for (const img of imgMatches) {
    if (!/alt\s*=\s*['"][^'"]*['"]/i.test(img)) {
      errors.push(`[${route}] Image missing alt attribute: ${img}`);
    }
  }

  tableRows.push({
    route,
    title,
    descLength: description.length,
    schemas: schemaTypes.join(', ') || 'None',
    prerendered: 'Yes'
  });
}

// Print Audit Results
console.log(`Audited ${htmlFiles.length} pages.`);
console.log(`Total Errors: ${errors.length}`);
console.log(`Total Warnings: ${warnings.length}\n`);

if (errors.length > 0) {
  console.error(`FAILED CHECKS (${errors.length}):`);
  errors.slice(0, 30).forEach(e => console.error('  ❌', e));
  if (errors.length > 30) {
    console.error(`  ... and ${errors.length - 30} more errors.`);
  }
  process.exit(1);
} else {
  console.log(`✅ ALL SEO AUDIT CHECKS PASSED PERFECTLY! (0 errors)\n`);
}
