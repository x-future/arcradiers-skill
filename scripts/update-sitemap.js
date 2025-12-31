#!/usr/bin/env node

/**
 * Auto-update sitemap.xml based on HTML files in public directory
 * This script scans for HTML files and updates sitemap.xml accordingly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

const DOMAIN = 'https://arcraiderskill.com';

// Pages configuration with priorities and change frequencies
const PAGE_CONFIG = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/wiki.html': { priority: '0.8', changefreq: 'weekly' },
  '/blog.html': { priority: '0.9', changefreq: 'daily' },
  '/#features': { priority: '0.8', changefreq: 'weekly' },
  '/#skill-trees': { priority: '0.8', changefreq: 'weekly' },
  '/#scenarios': { priority: '0.8', changefreq: 'weekly' },
  '/#faq': { priority: '0.7', changefreq: 'weekly' },
  // Blog posts (wildcard pattern)
  '/blog/': { priority: '0.7', changefreq: 'monthly' },
};

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Get file modification date
function getFileModDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return new Date(stats.mtime).toISOString().split('T')[0];
  } catch {
    return getCurrentDate();
  }
}

// Scan public directory for HTML files
function scanHTMLFiles() {
  const files = [];

  try {
    const entries = fs.readdirSync(publicDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        const filePath = path.join(publicDir, entry.name);
        const url = `/${entry.name}`;
        const modDate = getFileModDate(filePath);

        files.push({
          url,
          modDate,
          filePath,
        });
      } else if (entry.isDirectory() && entry.name === 'blog') {
        // Scan blog subdirectory
        const blogDir = path.join(publicDir, 'blog');
        try {
          const blogEntries = fs.readdirSync(blogDir, { withFileTypes: true });
          for (const blogEntry of blogEntries) {
            if (blogEntry.isFile() && blogEntry.name.endsWith('.html')) {
              const filePath = path.join(blogDir, blogEntry.name);
              const url = `/blog/${blogEntry.name}`;
              const modDate = getFileModDate(filePath);

              files.push({
                url,
                modDate,
                filePath,
              });
            }
          }
        } catch (error) {
          console.error('Error scanning blog directory:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', error);
  }

  return files;
}

// Generate sitemap XML
function generateSitemap() {
  const htmlFiles = scanHTMLFiles();
  const today = getCurrentDate();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${PAGE_CONFIG['/'].changefreq}</changefreq>
    <priority>${PAGE_CONFIG['/'].priority}</priority>
  </url>
`;

  // Add hash fragment URLs (anchor links)
  const hashFragments = ['/#features', '/#skill-trees', '/#scenarios', '/#faq'];
  for (const fragment of hashFragments) {
    const config = PAGE_CONFIG[fragment] || { priority: '0.7', changefreq: 'monthly' };
    xml += `  
  <url>
    <loc>${DOMAIN}${fragment}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>
`;
  }

  // Add HTML files (excluding index.html which is already added as homepage)
  for (const file of htmlFiles) {
    if (file.url === '/index.html') continue;
    
    const config = PAGE_CONFIG[file.url] || { priority: '0.7', changefreq: 'monthly' };
    xml += `  
  <url>
    <loc>${DOMAIN}${file.url}</loc>
    <lastmod>${file.modDate}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${config.priority}</priority>
  </url>
`;
  }

  xml += `  
</urlset>
`;

  return xml;
}

// Main function
function main() {
  console.log('🔄 Updating sitemap.xml...');
  
  try {
    const sitemapContent = generateSitemap();
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    
    console.log('✅ Sitemap updated successfully!');
    console.log(`📄 Location: ${sitemapPath}`);
    
    // Count URLs
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    console.log(`📊 Total URLs: ${urlCount}`);
  } catch (error) {
    console.error('❌ Error updating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSitemap, scanHTMLFiles };

