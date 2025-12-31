import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.dirname(__dirname);
const BLOG_DIR = path.join(ROOT_DIR, 'blog');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Parse frontmatter from markdown
function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: markdown };
  const meta = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      let key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
      if (value.startsWith('[') && value.endsWith(']')) value = value.slice(1, -1).split(',').map(i => i.trim().replace(/['"]/g, ''));
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      meta[key] = value;
    }
  }
  return { meta, content: match[2] };
}

const files = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md')) : [];

if (files.length === 0) {
  console.log('No blog posts found for RSS generation.');
  process.exit(0);
}

const posts = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
  const { meta, content: markdown } = parseFrontmatter(content);
  const readingTime = Math.ceil(markdown.replace(/```[\s\S]*?```/g, '').trim().split(/\s+/).length / 200);
  posts.push({ meta, content: markdown, readingTime });
}
posts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));

// Generate RSS XML
const rssItems = posts.slice(0, 20).map(post => {
  const link = 'https://arcraiderskill.com/blog/' + post.meta.slug + '.html';
  const guid = 'https://arcraiderskill.com/blog/' + post.meta.slug + '.html';
  const content = post.meta.description || '';
  
  return `    <item>
      <title>${post.meta.title}</title>
      <link>${link}</link>
      <guid>${guid}</guid>
      <description>${content}</description>
      <pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
    </item>`;
}).join('\n');

const rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ARC Raiders Skill Tree Blog</title>
    <link>https://arcraiderskill.com/blog.html</link>
    <description>Latest ARC Raiders Skill Tree guides and tutorials</description>
    <language>en-us</language>
    <atom:link href="https://arcraiderskill.com/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rssXML);
console.log('✅ RSS feed generated successfully!');
