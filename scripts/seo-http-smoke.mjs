import assert from 'node:assert/strict';

const base = process.env.SMOKE_ORIGIN ?? 'http://127.0.0.1:4000';
const canonicalOrigin = 'https://converterallai.com';
const hindi = '/hi-in/tools/bmi-calculator-india';
const english = '/calculators/bmi';
const pdf = '/pdf-processing/compress-pdf';

for (const path of [pdf, english, hindi]) {
  const response = await fetch(base + path + '?utm_source=smoke');
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('cache-control') ?? '', /s-maxage=300/);
  const page = await response.text();
  assert.ok(page.includes('rel="canonical" href="' + canonicalOrigin + path + '"'), path);
  assert.match(page, /application\/ld\+json/);
  if (path === hindi || path === english) {
    for (const [lang, alternate] of [['en-IN', english], ['hi-IN', hindi], ['x-default', english]]) {
      assert.ok(page.includes('hreflang="' + lang + '" href="' + canonicalOrigin + alternate + '"'), path);
    }
  }
}

for (const [alias, canonical] of [
  ['/tools/compress-pdf-online-free', pdf],
  ['/tools/bmi-calculator-india', english],
]) {
  const response = await fetch(base + alias, { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), canonical);
  await response.body?.cancel();
}

const ttsLanguage = 'english-text-to-speech-united-states';
for (const [alias, canonical] of [
  ['/image-processing/jpeg-to-png', '/image-processing/format-converter'],
  ['/games/typing-test', '/typing-speed-test'],
  ['/developer-tools/ai-chat', '/ai-chat'],
  [`/tts/${ttsLanguage}`, `/audio-processing/tts/${ttsLanguage}`],
]) {
  const response = await fetch(base + alias);
  assert.equal(response.status, 200, alias);
  assert.equal(new URL(response.url).pathname, canonical, alias);
  await response.body?.cancel();
}

for (const path of ['/verify-this-tool-does-not-exist', '/audio-processing/tts/no-such-language']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 404, path);
  await response.body?.cancel();
}

const robots = await fetch(base + '/robots.txt');
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes('Sitemap: ' + canonicalOrigin + '/sitemap.xml'));
const index = await fetch(base + '/sitemap.xml');
assert.equal(index.status, 200);
const children = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)];
assert.ok(children.length > 0);
for (const [, child] of children) {
  const response = await fetch(base + new URL(child).pathname);
  assert.equal(response.status, 200, child);
  assert.match(await response.text(), /<urlset\b/, child);
}
console.log('HTTP smoke checks passed.');
