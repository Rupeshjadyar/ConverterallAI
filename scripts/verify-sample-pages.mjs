import fs from 'fs';

const samples = [
  'dist/converterallai/browser/pdf-processing/merge-pdf/index.html',
  'dist/converterallai/browser/image-processing/compressor/index.html',
  'dist/converterallai/browser/calculators/emi/index.html'
];

for (const s of samples) {
  console.log('====================================================');
  console.log('FILE:', s);
  if (!fs.existsSync(s)) {
    console.log('DOES NOT EXIST');
    continue;
  }
  const html = fs.readFileSync(s, 'utf8');
  
  // Title
  const title = html.match(/<title>([^<]*)<\/title>/i);
  console.log('TITLE:', title ? title[1] : 'NONE');
  
  // Meta description
  const desc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
               html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  console.log('DESCRIPTION:', desc ? desc[1] : 'NONE', '(len: ' + (desc ? desc[1].length : 0) + ')');

  // Canonical
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                    html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  console.log('CANONICAL:', canonical ? canonical[1] : 'NONE');

  // H1 tags
  const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  console.log('H1 COUNT:', h1s.length);
  h1s.forEach(h => console.log('  -> ' + h.replace(/\s+/g, ' ').trim()));

  // JSON-LD
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch) {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      console.log('JSON-LD: Valid JSON with @graph count:', parsed['@graph'] ? parsed['@graph'].length : (Array.isArray(parsed) ? parsed.length : 1));
      if (parsed['@graph']) {
        console.log('  Types in @graph:', parsed['@graph'].map(item => item['@type']));
      }
    } catch (e) {
      console.log('JSON-LD ERROR:', e.message);
    }
  } else {
    console.log('JSON-LD: NONE FOUND');
  }
}
