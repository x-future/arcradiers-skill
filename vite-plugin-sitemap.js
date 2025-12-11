/**
 * Vite plugin to automatically update sitemap.xml before build
 */
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function sitemapPlugin() {
  return {
    name: 'sitemap-updater',
    buildStart() {
      try {
        console.log('🔄 Auto-updating sitemap.xml...');
        execSync('node scripts/update-sitemap.js', {
          cwd: resolve(__dirname),
          stdio: 'inherit',
        });
        console.log('✅ Sitemap updated!');
      } catch (error) {
        console.warn('⚠️  Failed to update sitemap:', error.message);
      }
    },
  };
}

