import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const origin = 'https://arcraiderskill.com';
for (const route of ['', 'planner/', 'store/']) {
  const html = await fs.readFile(new URL(`../dist/${route}index.html`, import.meta.url), 'utf8');
  assert.ok(!html.includes('<div id="root"></div>'), `Empty content: ${route}`);
  assert.ok(html.includes(`rel="canonical" href="${origin}/${route}"`), `Wrong canonical: ${route}`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `Wrong heading count: ${route}`);
  assert.ok(!/content="[^"\n]*(?:noindex|nosnippet)/.test(html));
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.url, `${origin}/${route}`);
  assert.ok(html.includes(route === 'store/' ? '/go/catalog/services-' : 'How the ARC Raiders skill tree works'));
}
const sitemap = await fs.readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
for (const route of ['planner/', 'store/']) assert.ok(sitemap.includes(`<loc>${origin}/${route}</loc>`));
console.log('Search checks passed: static content, canonical, headings, schema, preview controls and sitemap');
