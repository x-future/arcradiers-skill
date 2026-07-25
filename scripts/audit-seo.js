import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SITE_ORIGIN = 'https://arcraiderskill.com';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function textContent(value = '') {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;|&#8211;/gi, '-')
    .replace(/&mdash;|&#8212;/gi, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(html, pattern) {
  return (html.match(pattern) || [])[1] || '';
}

function metaContent(html, name) {
  const tag = (html.match(new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, 'i')) || [])[0] || '';
  return firstMatch(tag, /content="([^"]*)"/i) || firstMatch(tag, /content='([^']*)'/i);
}

function expectedUrl(filePath) {
  if (filePath === path.join(ROOT_DIR, 'index.html')) return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}/${path.relative(PUBLIC_DIR, filePath).split(path.sep).join('/')}`;
}

function targetPath(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl, SITE_ORIGIN);
  } catch {
    return null;
  }
  if (url.origin !== SITE_ORIGIN || url.pathname === '/') return null;
  const decodedPath = decodeURIComponent(url.pathname).replace(/^\//, '');
  const resolved = path.resolve(PUBLIC_DIR, decodedPath);
  return resolved.startsWith(PUBLIC_DIR) ? resolved : null;
}

const htmlFiles = [
  path.join(ROOT_DIR, 'index.html'),
  ...walk(PUBLIC_DIR).filter((file) => file.endsWith('.html')),
].sort();
const publicFiles = new Set(walk(PUBLIC_DIR).map((file) => path.resolve(file)));
const titles = new Map();
const descriptions = new Map();
const findings = [];

function report(severity, filePath, message) {
  findings.push({ severity, file: path.relative(ROOT_DIR, filePath), message });
}

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  const title = textContent(firstMatch(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i));
  const description = metaContent(html, 'description');
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => textContent(match[1]));
  const canonical = firstMatch(html, /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)
    || firstMatch(html, /<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const expected = expectedUrl(filePath);

  if (!title) report('ERROR', filePath, 'Missing title.');
  else {
    if (title.length < 30 || title.length > 60) report('WARN', filePath, `Title length is ${title.length}; target 30-60.`);
    const matches = titles.get(title) || [];
    matches.push(filePath);
    titles.set(title, matches);
  }
  if (!description) report('ERROR', filePath, 'Missing meta description.');
  else {
    if (description.length < 120 || description.length > 165) {
      report('WARN', filePath, `Meta description length is ${description.length}; target 120-165.`);
    }
    const matches = descriptions.get(description) || [];
    matches.push(filePath);
    descriptions.set(description, matches);
  }
  const isClientRenderedHomepage = filePath === path.join(ROOT_DIR, 'index.html');
  if (!isClientRenderedHomepage && h1s.length !== 1) {
    report('ERROR', filePath, `Expected one H1, found ${h1s.length}.`);
  }
  if (!canonical) report('ERROR', filePath, 'Missing self-referencing canonical.');
  else if (canonical !== expected) report('ERROR', filePath, `Canonical is ${canonical}; expected ${expected}.`);

  const references = [...html.matchAll(/<(?:a|link|img|script)\b[^>]*(?:href|src)=["']([^"']+)["']/gi)];
  for (const [, reference] of references) {
    if (/^(?:#|mailto:|tel:|javascript:|data:)/i.test(reference)) continue;
    const target = targetPath(reference);
    if (!target) continue;
    const sourceTarget = path.resolve(ROOT_DIR, reference.replace(/^\//, ''));
    if (filePath === path.join(ROOT_DIR, 'index.html') && fs.existsSync(sourceTarget)) continue;
    if (path.extname(target) && !publicFiles.has(target)) {
      report('ERROR', filePath, `Broken internal reference: ${reference}`);
    }
  }
}

for (const [title, files] of titles) {
  if (files.length > 1) files.forEach((file) => report('ERROR', file, `Duplicate title: ${title}`));
}
for (const [description, files] of descriptions) {
  if (files.length > 1) files.forEach((file) => report('WARN', file, `Duplicate meta description: ${description}`));
}

const severityOrder = { ERROR: 0, WARN: 1 };
findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.file.localeCompare(b.file));
for (const finding of findings) {
  console.log(`${finding.severity}\t${finding.file}\t${finding.message}`);
}

const errors = findings.filter((finding) => finding.severity === 'ERROR').length;
const warnings = findings.length - errors;
console.log(`\nAudited ${htmlFiles.length} HTML pages: ${errors} errors, ${warnings} warnings.`);
process.exitCode = errors > 0 ? 1 : 0;
