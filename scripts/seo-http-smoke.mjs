import assert from 'node:assert/strict';
import { TOOLS_DATA } from '../src/app/data/tools.data.ts';

const base = process.env.SMOKE_ORIGIN ?? 'http://127.0.0.1:4000';
const canonicalOrigin = 'https://converterallai.com';
const hindi = '/hi-in/tools/bmi-calculator-india';
const english = '/calculators/bmi';
const pdf = '/pdf-processing/compress-pdf';
const json = '/developer-tools/json-formatter';
const typing = '/typing-speed-test';
const course = '/typing-master';
const games = ['/games', ...TOOLS_DATA.filter((tool) => tool.categoryId === 'games').map((tool) => tool.slug)];

for (const path of [pdf, english, hindi, json, typing, course, ...games]) {
  const response = await fetch(base + path + '?utm_source=smoke');
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get('cache-control') ?? '', /s-maxage=300/);
  const page = await response.text();
  assert.ok(page.includes('rel="canonical" href="' + canonicalOrigin + path + '"'), path);
  assert.match(page, /application\/ld\+json/);
  if (games.includes(path)) {
    assert.equal([...page.matchAll(/<h1\b/g)].length, 1, path);
    assert.match(page, /<meta name="description" content="[^"]+"/, path);
    if (path === '/games') assert.ok(page.includes('href="/games/stormline-rescue"'));
    if (path === '/games/stormline-rescue') assert.match(page, /Launch rescue/);
  }
  if (path === json) {
    assert.match(page, /<title>JSON Formatter &amp; Validator Online \| ConverterAllAI<\/title>/);
    assert.match(page, /<meta name="description" content="Beautify, minify, and validate JSON online\./);
    assert.equal([...page.matchAll(/<h1\b/g)].length, 1);
    assert.match(page, /JSON formatting example/);
    assert.match(page, /Does formatting JSON change large numbers or duplicate keys\?/);
    assert.match(page, /"@type"\s*:\s*"BreadcrumbList"/);
  }
  if (path === typing || path === course) {
    assert.equal([...page.matchAll(/<h1\b/g)].length, 1);
    assert.match(page, /<meta name="description" content="(Take a free 1-minute typing speed test|Learn touch typing with seven free modules)/);
    assert.match(page, /"@type"\s*:\s*"BreadcrumbList"/);
    assert.ok(page.includes(`href="${path === typing ? course : typing}"`));
    if (path === typing) {
      assert.match(page, /<title>1-Minute Typing Speed Test &amp; WPM \| ConverterAllAI<\/title>/);
      assert.match(page, /word-wrapper active/);
    } else {
      assert.match(page, /<title>Free Touch Typing Lessons Online \| ConverterAllAI<\/title>/);
      assert.match(page, /Start with the home row/);
    }
  }
  if (path === hindi || path === english) {
    for (const [lang, alternate] of [['en-IN', english], ['hi-IN', hindi], ['x-default', english]]) {
      assert.ok(page.includes('hreflang="' + lang + '" href="' + canonicalOrigin + alternate + '"'), path);
    }
  }
}

for (const [alias, canonical] of [
  ['/tools/compress-pdf-online-free', pdf],
  ['/tools/bmi-calculator-india', english],
  ['/developer-tools/json', json],
  ['/games/typing-test', typing],
  ['/typing-test', typing],
  ['/typing-tutor', course],
]) {
  const response = await fetch(base + alias, { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), canonical);
  await response.body?.cancel();
}

const ttsLanguage = 'english-text-to-speech-united-states';
for (const [alias, canonical] of [
  ['/image-processing/jpeg-to-png', '/image-processing/format-converter'],
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
  const sitemap = await response.text();
  assert.match(sitemap, /<urlset\b/, child);
  if (new URL(child).pathname === '/sitemap-tools.xml') {
    assert.ok(sitemap.includes('<loc>' + canonicalOrigin + json + '</loc>'));
    assert.ok(!sitemap.includes('<loc>' + canonicalOrigin + '/developer-tools/json</loc>'));
    for (const path of [typing, course]) assert.ok(sitemap.includes('<loc>' + canonicalOrigin + path + '</loc>'));
    for (const path of ['/games/typing-test', '/typing-test', '/typing-tutor']) {
      assert.ok(!sitemap.includes('<loc>' + canonicalOrigin + path + '</loc>'));
    }
  }
  if (new URL(child).pathname === '/sitemap-games.xml') {
    for (const path of games) assert.ok(sitemap.includes('<loc>' + canonicalOrigin + path + '</loc>'), path);
  }
}
console.log('HTTP smoke checks passed.');
