import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

const root = path.resolve(import.meta.dirname, '..');
const origin = 'https://arcraiderskill.com';
const vite = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { default: HomePage } = await vite.ssrLoadModule('/components/HomePage.tsx');
  const { default: SkillReference } = await vite.ssrLoadModule('/components/SkillReference.tsx');
  const template = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
  if (!template.includes('<div id="root"></div>')) throw new Error('Run vite build before prerendering pages');
  const pages = [
    { route: '/', title: 'ARC Raiders Skill Tree Builder & Build Guides | ARCSKILLER', description: 'Plan your ARC Raiders skill tree, compare solo and PvP build guides, and inspect Conditioning, Mobility and Survival prerequisites.', element: React.createElement(HomePage, { store: false }) },
    { route: '/store/', title: 'ARC Raiders Weapons, Loadouts & Equipment | ARCSKILLER', description: 'Browse weapons, blueprints, loadouts, resources and upgrade services. Compare options and continue to ARC Store for checkout.', element: React.createElement(HomePage, { store: true }) },
    { route: '/planner/', title: 'ARC Raiders Skill Tree Planner | 76–91 Point Calculator', description: 'Allocate ARC Raiders skills with 76, 81, 86 or 91 points. Check branch prerequisites and choice groups, then share your skill build.', element: React.createElement('main', { className: 'arc-home' }, React.createElement('h1', null, 'ARC Raiders Skill Tree Planner'), React.createElement('p', null, 'The interactive calculator loads with JavaScript. Browse the planning reference below or return to the home page.'), React.createElement('a', { href: '/' }, 'Home'), React.createElement(SkillReference)) },
  ];
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  for (const page of pages) {
    let html = template.replace('<div id="root"></div>', `<div id="root">${renderToString(page.element)}</div>`);
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(page.description)}`)
      .replace(/(<link rel="canonical" href=")[^"]*/, `$1${origin}${page.route}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(page.title)}`)
      .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${escape(page.title)}`)
      .replace(/(<meta (?:property="og:description"|name="twitter:description") content=")[^"]*/g, `$1${escape(page.description)}`);
    // Each route describes its own visible page, rather than inheriting the app schema.
    const schema = { '@context': 'https://schema.org', '@type': page.route === '/store/' ? 'CollectionPage' : 'WebPage', name: page.title, url: `${origin}${page.route}`, description: page.description, isPartOf: { '@type': 'WebSite', name: 'ARCSKILLER', url: `${origin}/` } };
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
    html = html.replace('</head>', '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"></head>');
    const output = path.join(root, 'dist', page.route, 'index.html');
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, html);
    console.log(`Prerendered ${page.route}`);
  }
  const sitemapPath = path.join(root, 'dist/sitemap.xml');
  let sitemap = await fs.readFile(sitemapPath, 'utf8');
  for (const route of ['/planner/', '/store/']) {
    if (!sitemap.includes(`<loc>${origin}${route}</loc>`)) sitemap = sitemap.replace('</urlset>', `<url><loc>${origin}${route}</loc></url>\n</urlset>`);
  }
  await fs.writeFile(sitemapPath, sitemap);
} finally {
  await vite.close();
}
