import fs from 'fs';

// 1. Check tools
const toolsTs = fs.readFileSync('src/app/data/tools.data.ts', 'utf8');
const toolTitleMatches = toolsTs.match(/seoTitle:\s*['"]([^'"]+)['"]/g) || [];
console.log('Tools titles count:', toolTitleMatches.length);
toolTitleMatches.forEach(m => {
  const t = m.match(/seoTitle:\s*['"]([^'"]+)['"]/)[1];
  if (t.length > 60) console.log('Tool title > 60 (' + t.length + '):', t);
});

// 2. Check categories
const catsTs = fs.readFileSync('src/app/data/categories.data.ts', 'utf8');
const catTitleMatches = catsTs.match(/seoTitle:\s*['"]([^'"]+)['"]/g) || [];
console.log('Cat titles count:', catTitleMatches.length);
catTitleMatches.forEach(m => {
  const t = m.match(/seoTitle:\s*['"]([^'"]+)['"]/)[1];
  if (t.length > 60) console.log('Cat title > 60 (' + t.length + '):', t);
});

// 3. Check static in seo.service.ts
const seoTs = fs.readFileSync('src/app/services/seo.service.ts', 'utf8');
const staticMatches = seoTs.match(/title:\s*['"]([^'"]+)['"]/g) || [];
console.log('Static titles count:', staticMatches.length);
staticMatches.forEach(m => {
  const t = m.match(/title:\s*['"]([^'"]+)['"]/)[1];
  if (t.length > 60) console.log('Static title > 60 (' + t.length + '):', t);
});
