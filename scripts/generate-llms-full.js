import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.dirname(SCRIPT_DIR);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SITE_ORIGIN = 'https://arcraiderskill.com';

const decodeEntities = (value) => value
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;|&#34;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&#(d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const stripTags = (value) => decodeEntities(value.replace(/<[^>]+>/g, ''))
  .replace(/[ \t]+/g, ' ')
  .trim();

function absoluteUrl(href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:')) return href;
  if (/^https?:\/\//i.test(href)) return href;
  return new URL(href, SITE_ORIGIN).href;
}

function htmlToMarkdown(html) {
  const codeBlocks = [];
  let content = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|svg|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, block) => {
      const token = `LLMSFULLCODEBLOCK${codeBlocks.length}TOKEN`;
      codeBlocks.push(`\n\n\`\`\`\n${stripTags(block).replace(/^\s+|\s+$/g, '')}\n\`\`\`\n\n`);
      return token;
    });

  content = content
    .replace(/<div\b[^>]*class=["'][^"']*faq-question[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, (_, text) => `\n\n### ${stripTags(text)}\n\n`)
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
      const text = stripTags(label);
      const url = absoluteUrl(decodeEntities(href));
      return text && url ? `[${text}](${url})` : text;
    })
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, text) => `\n\n${'#'.repeat(Number(level))} ${stripTags(text)}\n\n`)
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, text) => `**${stripTags(text)}**`)
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, text) => `*${stripTags(text)}*`)
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<tr\b[^>]*>/gi, '\n')
    .replace(/<\/(tr|thead|tbody|table)>/gi, '\n')
    .replace(/<(th|td)\b[^>]*>/gi, '| ')
    .replace(/<\/(th|td)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\b[^>]*>/gi, '\n\n---\n\n')
    .replace(/<\/(p|div|section|article|main|header|ul|ol|blockquote|figure|figcaption)>/gi, '\n\n')
    .replace(/<(p|div|section|article|main|header|ul|ol|blockquote|figure|figcaption)\b[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '');

  content = decodeEntities(content);
  codeBlocks.forEach((block, index) => {
    content = content.replace(`LLMSFULLCODEBLOCK${index}TOKEN`, block);
  });

  return content
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    .replace(/\n[ \t]*\n[ \t]*\n+/g, '\n\n')
    .replace(/^\s+|\s+$/g, '');
}

function getMeta(html, name) {
  const pattern = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const reversePattern = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i');
  return decodeEntities((html.match(pattern) || html.match(reversePattern) || [])[1] || '');
}

function localPathForUrl(url) {
  const pathname = new URL(url).pathname;
  if (pathname === '/') return null;
  const relative = pathname.replace(/^\//, '');
  return pathname.endsWith('/')
    ? path.join(PUBLIC_DIR, relative, 'index.html')
    : path.join(PUBLIC_DIR, relative);
}

const sitemap = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const overview = fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf8').trim();
const generatedAt = new Date().toISOString();
const pageSections = [];

for (const url of urls) {
  const localPath = localPathForUrl(url);
  if (!localPath) continue;
  if (!fs.existsSync(localPath) || path.extname(localPath) !== '.html') {
    console.warn(`Skipping missing or unsupported page: ${url}`);
    continue;
  }

  const html = fs.readFileSync(localPath, 'utf8');
  const title = stripTags((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || path.basename(localPath));
  const description = getMeta(html, 'description');
  const body = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i) || [])[1] || html;
  const markdown = htmlToMarkdown(body);

  pageSections.push([
    `# ${title}`,
    '',
    `**URL:** ${url}`,
    '',
    description,
    '',
    '---',
    '',
    markdown,
  ].join('\n').replace(/\n{3,}/g, '\n\n'));
}

const output = [
  '# ARC Raiders Skill Tree Builder - Full Content',
  '',
  'This file provides the complete, machine-readable content for arcraiderskill.com, following the full-content structure used by the Claude Developer Platform documentation.',
  '',
  '## Root URL',
  '',
  SITE_ORIGIN,
  '',
  '## Scope and usage',
  '',
  `- Language: English`,
  `- Public HTML pages included: ${pageSections.length}`,
  '- Content includes the skill tree planner overview, AI Build Advisor, wiki, FAQ, guide index, gameplay guides, weapon guides, updates, gallery, and site policies.',
  '- This is a community-created ARC Raiders resource and is not affiliated with or endorsed by Embark Studios.',
  '- Game values and recommendations may change after patches; verify patch-sensitive information in game or against official sources.',
  '',
  '---',
  '',
  '# Site Overview',
  '',
  overview,
  '',
  '---',
  '',
  '# Public Pages - Full Content',
  '',
  pageSections.join('\n\n---\n\n'),
  '',
  '---',
  '',
  `Last generated: ${generatedAt}`,
  `Total pages included: ${pageSections.length + 1}`,
  '',
].join('\n');

const outputPath = path.join(PUBLIC_DIR, 'llms-full.txt');
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`Generated ${path.relative(ROOT_DIR, outputPath)} with ${pageSections.length + 1} pages (${Buffer.byteLength(output)} bytes).`);
