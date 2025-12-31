import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.dirname(__dirname);
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
  console.log('No blog posts found.');
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

// Default blog image - using a reliable placeholder
const DEFAULT_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect fill="%230f0f11" width="800" height="450"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="%23d19a53"%3EARC RAIDERS%3C/text%3E%3Ctext x="50%25" y="58%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%239ca3af"%3EBlog Post%3C/text%3E%3C/svg%3E';

const indexCards = posts.map(post => {
  const tags = post.meta.tags && post.meta.tags.length > 0
    ? post.meta.tags.slice(0, 3).map(tag => '<span class="tag">' + tag + '</span>').join('')
    : '';
  const image = post.meta.image || post.meta.coverImage || DEFAULT_IMAGE;
  const dateStr = new Date(post.meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <article class="blog-card">
      <a href="/blog/${post.meta.slug}.html" class="blog-card-link">
        <div class="blog-card-image-wrapper">
          <img src="${image}" alt="${post.meta.title}" class="blog-card-image" loading="lazy" onerror="this.src='${DEFAULT_IMAGE}'" />
          <div class="blog-card-overlay"></div>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <time>${dateStr}</time>
            <span class="blog-card-divider">•</span>
            <span>${post.readingTime} min read</span>
          </div>
          <h2 class="blog-card-title">${post.meta.title}</h2>
          ${post.meta.description ? '<p class="blog-card-excerpt">' + post.meta.description + '</p>' : ''}
          ${tags ? '<div class="blog-card-tags">' + tags + '</div>' : ''}
        </div>
      </a>
    </article>
  `;
}).join('');

const blogStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Urbanist', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #050505;
      color: #e5e5e5;
      line-height: 1.6;
    }
    .blog-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem;
    }
    .blog-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .blog-title {
      font-family: 'Barlow', sans-serif;
      font-size: 3.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    .blog-subtitle {
      font-size: 1.25rem;
      color: #9ca3af;
      margin-bottom: 1rem;
    }
    .blog-count {
      color: #6b7280;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .blog-card {
      background: #0f0f11;
      border: 1px solid #1f1f23;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .blog-card:hover {
      transform: translateY(-4px);
      border-color: #d19a53;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .blog-card-link {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    .blog-card-image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      overflow: hidden;
      background: #1a1a1d;
    }
    .blog-card-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .blog-card:hover .blog-card-image {
      transform: scale(1.05);
    }
    .blog-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent 0%, rgba(5, 5, 5, 0.3) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .blog-card:hover .blog-card-overlay {
      opacity: 1;
    }
    .blog-card-content {
      padding: 1.5rem;
    }
    .blog-card-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #9ca3af;
      margin-bottom: 0.75rem;
    }
    .blog-card-divider {
      color: #3f3f46;
    }
    .blog-card-title {
      font-family: 'Barlow', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      line-height: 1.3;
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .blog-card-excerpt {
      color: #9ca3af;
      font-size: 0.9375rem;
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .blog-card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .blog-card-tags .tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #1a1a1d;
      color: #d19a53;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    @media (max-width: 768px) {
      .blog-container {
        padding: 2rem 1rem;
      }
      .blog-title {
        font-size: 2.5rem;
      }
      .blog-subtitle {
        font-size: 1.125rem;
      }
      .blog-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .blog-card-title {
        font-size: 1.25rem;
      }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .blog-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
`;

const fullHTML = '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'  <title>Blog | ARC Raiders</title>' +
'  <meta name="description" content="ARC Raiders Skill Tree Blog">' +
'  <link rel="icon" href="/favicon.png">' +
'  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Urbanist:wght@300;400;500;600;700&display=swap" rel="stylesheet">' +
'  <style>' + blogStyles + '</style>' +
'</head>' +
'<body>' +
'  <div class="blog-container">' +
'    <header class="blog-header">' +
'      <h1 class="blog-title">ARC Raiders Skill Tree Blog</h1>' +
'      <p class="blog-subtitle">Guides, updates, and tips to master your skill tree</p>' +
'      <div class="blog-count">' + posts.length + ' posts published</div>' +
'    </header>' +
'    <section class="blog-grid">' + indexCards + '</section>' +
'  </div>' +
'</body>' +
'</html>';

fs.writeFileSync(path.join(PUBLIC_DIR, 'blog.html'), fullHTML);

// Generate individual blog posts
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
  console.log('  ✓ Generated', post.meta.slug + '.html');
}

console.log('✅ Blog generation complete!');
