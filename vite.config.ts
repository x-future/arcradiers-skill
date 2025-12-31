import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import sitemapPlugin from './vite-plugin-sitemap.js';
import { execSync } from 'child_process';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Generate blog posts before build
    if (mode === 'production' || process.env.GENERATE_BLOG === 'true') {
        try {
            console.log('📝 Generating blog posts...');
            execSync('node scripts/generate-blog.js', { stdio: 'inherit' });
        } catch (error) {
            console.error('Failed to generate blog:', error.message);
        }
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), sitemapPlugin()],
      publicDir: 'public',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
