import fs from 'fs';
import path from 'path';

const ROOT_DIR = '/Users/admin/ai-web/arcradierskill';
const BLOG_DIR = path.join(ROOT_DIR, 'blog');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BLOG_PUBLIC_DIR = path.join(PUBLIC_DIR, 'blog');

if (!fs.existsSync(BLOG_PUBLIC_DIR)) {
  fs.mkdirSync(BLOG_PUBLIC_DIR, { recursive: true });
}

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
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith('[') && value.endsWith(']')) value = value.slice(1, -1).split(',').map(i => i.trim().replace(/['"]/g, ''));
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      meta[key] = value;
    }
  }
  return { meta, content: match[2] };
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
const posts = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
  const { meta, content: markdown } = parseFrontmatter(content);
  const readingTime = Math.ceil(markdown.replace(/```[\s\S]*?```/g, '').trim().split(/\s+/).length / 200);
  posts.push({ meta, content: markdown, readingTime });
}

posts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));

console.log('Found', posts.length, 'posts');

// Generate blog index
const indexHTML = posts.map(p => 
  '<div style="border:1px solid #1f1f23;padding:1.5em;margin-bottom:1em;"><a href="/blog/' + p.meta.slug + '.html" style="color:#d19a53;text-decoration:none;"><h2 style="margin:0;">' + p.meta.title + '</h2><p style="color:#9ca3af;"><time>' + p.meta.date + '</time> • ' + p.readingTime + ' min read</p>' + (p.meta.description ? '<p>' + p.meta.description + '</p>' : '') + '</a></div>'
).join('');

const fullHTML = '<!DOCTYPE html><html><head><title>Blog | ARC Raiders</title><meta name="description" content="ARC Raiders Skill Tree Blog"><link rel="icon" href="/favicon.png"><style>body{background:#050505;color:#e5e5e5;font-family:Urbanist,sans-serif;max-width:800px;margin:0 auto;padding:2em;}a{color:#d19a53;text-decoration:none;}h1,h2{font-family:Barlow,sans-serif;}</style></head><body><h1>ARC Raiders Skill Tree Blog</h1><p>' + posts.length + ' posts published</p>' + indexHTML + '</body></html>';

fs.writeFileSync(path.join(PUBLIC_DIR, 'blog.html'), fullHTML);
console.log('Generated blog.html');

// Generate individual posts
for (const post of posts) {
  let html = post.content;
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  const postHTML = '<!DOCTYPE html><html><head><title>' + post.meta.title + ' | ARC Raiders</title><meta name="description" content="' + (post.meta.description || '') + '"><link rel="icon" href="/favicon.png"><style>body{background:#050505;color:#e5e5e5;font-family:Urbanist,sans-serif;max-width:800px;margin:0 auto;padding:2em;line-height:1.6;}a{color:#d19a53;text-decoration:none;}h1,h2,h3{font-family:Barlow,sans-serif;}code{background:#0f0f11;padding:0.2em 0.4em;border-radius:4px;}</style></head><body><nav><a href="/blog.html">← Back to Blog</a></nav><article><h1>' + post.meta.title + '</h1><p style="color:#9ca3af;"><time>' + post.meta.date + '</time> • ' + post.readingTime + ' min read</p>' + html + '</article></body></html>';
  
  fs.writeFileSync(path.join(BLOG_PUBLIC_DIR, post.meta.slug + '.html'), postHTML);
  console.log('BLOG_PUBLIC_DIR:', BLOG_PUBLIC_DIR);  console.log('post.meta.slug:', post.meta.slug);  console.log('Generated', post.meta.slug + '.html');
}

console.log('Blog generation complete!');
