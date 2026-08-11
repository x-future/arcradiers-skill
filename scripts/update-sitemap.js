import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const REDIRECT_PATHS = new Set([
  '/blog/arc-raiders-kettle-guide.html',
  '/blog/arc-raiders-stitcher-guide.html',
  '/blog/arc-raiders-venator-guide.html',
  '/blog/arc-raiders-renegade-vs-venator.html',
  '/blog/arc-raiders-rattler-guide.html',
]);
const PAGE_CONFIG = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/ai-see.html': { priority: '0.9', changefreq: 'weekly' },
  '/blog.html': { priority: '0.9', changefreq: 'weekly' },
  '/wiki/': { priority: '0.95', changefreq: 'weekly' },
  '/wiki/weapons/': { priority: '0.9', changefreq: 'weekly' },
  '/wiki/enemies/': { priority: '0.9', changefreq: 'weekly' },
  '/wiki/maps/': { priority: '0.85', changefreq: 'weekly' },
  '/wiki/items/': { priority: '0.85', changefreq: 'weekly' },
  '/wiki/resources/': { priority: '0.8', changefreq: 'weekly' },
  '/wiki/armor/': { priority: '0.8', changefreq: 'weekly' },
  '/wiki/gadgets/': { priority: '0.8', changefreq: 'weekly' },
  '/wiki.html': { priority: '0.6', changefreq: 'monthly' },
  '/faq.html': { priority: '0.8', changefreq: 'monthly' },
};

function getPageConfig(url) {
  if (PAGE_CONFIG[url]) return PAGE_CONFIG[url];
  if (url.startsWith('/wiki/weapons/') || url.startsWith('/wiki/enemies/')) {
    return { priority: '0.8', changefreq: 'weekly' };
  }
  if (url.startsWith('/wiki/')) return { priority: '0.7', changefreq: 'weekly' };
  if (url.startsWith('/blog/')) return { priority: '0.7', changefreq: 'monthly' };
  return { priority: '0.5', changefreq: 'monthly' };
}

// Get file modification time
function getFileModDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

// Scan public directory for files
function scanDirectory(dir, baseUrl = '') {
  const files = [];
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip blog directory - handled separately
      if (entry.name === 'blog') {
        const blogDir = path.join(dir, 'blog');
        try {
          const blogEntries = fs.readdirSync(blogDir, { withFileTypes: true });
          for (const blogEntry of blogEntries) {
            if (blogEntry.isFile() && blogEntry.name.endsWith('.html')) {
              const filePath = path.join(blogDir, blogEntry.name);
              files.push({
                url: '/blog/' + blogEntry.name,
                modDate: getFileModDate(filePath),
                ...getPageConfig('/blog/' + blogEntry.name)
              });
            }
          }
        } catch (error) {
          console.error('Error scanning blog directory:', error.message);
        }
      }
      // Recursively scan other directories
      else if (entry.name !== 'node_modules' && entry.name !== '.git') {
        const subFiles = scanDirectory(fullPath, baseUrl + entry.name + '/');
        files.push(...subFiles);
      }
    } else if (entry.isFile()) {
      // Add HTML files
      if (entry.name.endsWith('.html')) {
        // Ensure URL starts with /
        const url = entry.name === 'index.html' && baseUrl
          ? baseUrl
          : baseUrl + entry.name;
        const fullUrl = url.startsWith('/') ? url : '/' + url;
        const modDate = getFileModDate(fullPath);
        
        files.push({
          url: fullUrl,
          modDate: modDate,
          ...getPageConfig(fullUrl)
        });
      }
    }
  }
  
  return files;
}

// Generate sitemap XML
function generateSitemap(files) {
  const baseUrl = 'https://arcraiderskill.com';
  
  const urlEntries = files.map(file => {
    const fullUrl = baseUrl + file.url;
    return `    <url>
      <loc>${fullUrl}</loc>
      <lastmod>${file.modDate}</lastmod>
      <changefreq>${file.changefreq}</changefreq>
      <priority>${file.priority}</priority>
    </url>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Main generation
console.log('🔄 Auto-updating sitemap.xml...');

try {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.log('⚠️  Public directory not found, skipping sitemap generation');
    process.exit(0);
  }

  const files = scanDirectory(PUBLIC_DIR).filter((file) => !REDIRECT_PATHS.has(file.url));

  // Add root URL (homepage)
  files.unshift({
    url: '/',
    modDate: getFileModDate(path.join(ROOT_DIR, 'index.html')),
    ...getPageConfig('/')
  });

  console.log('🔄 Updating sitemap.xml...');
  console.log('  Found', files.length, 'files');

  const sitemap = generateSitemap(files);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap updated successfully!');
  console.log('📄 Location:', path.join(PUBLIC_DIR, 'sitemap.xml'));
  console.log('📊 Total URLs:', files.length);
} catch (error) {
  console.error('⚠️  Error updating sitemap:', error.message);
  console.log('Continuing with build...');
  process.exit(0);
}
