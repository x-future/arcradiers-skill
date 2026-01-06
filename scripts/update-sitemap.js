import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

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
                priority: '0.7'
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
        const url = baseUrl + entry.name;
        const fullUrl = url.startsWith('/') ? url : '/' + url;
        const modDate = getFileModDate(fullPath);
        
        // Determine priority based on URL
        let priority = '0.5';
        if (fullUrl === '/index.html' || fullUrl === '/') {
          priority = '1.0';
        } else if (fullUrl === '/wiki.html' || fullUrl === '/blog.html') {
          priority = '0.9';
        } else if (fullUrl.startsWith('/blog/')) {
          priority = '0.7';
        }
        
        files.push({
          url: fullUrl,
          modDate: modDate,
          priority: priority
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
      <changefreq>monthly</changefreq>
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
  const files = scanDirectory(PUBLIC_DIR);
  
  // Add root URL (homepage)
  files.unshift({
    url: '/',
    modDate: getFileModDate(path.join(ROOT_DIR, 'index.html')),
    priority: '1.0'
  });
  
  console.log('🔄 Updating sitemap.xml...');
  console.log('  Found', files.length, 'files');
  
  const sitemap = generateSitemap(files);
  
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap updated successfully!');
  console.log('📄 Location:', path.join(PUBLIC_DIR, 'sitemap.xml'));
  console.log('📊 Total URLs:', files.length);
} catch (error) {
  console.error('❌ Error updating sitemap:', error.message);
  process.exit(1);
}
