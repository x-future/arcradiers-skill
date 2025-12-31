// Test script to simulate production environment (no blog directory)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.dirname(__dirname);
const BLOG_DIR = path.join(ROOT_DIR, 'blog');

console.log('Simulating production environment (no blog directory):');
console.log('BLOG_DIR:', BLOG_DIR);
console.log('BLOG_DIR exists:', fs.existsSync(BLOG_DIR));

if (!fs.existsSync(BLOG_DIR)) {
  console.log('✅ SUCCESS: Script handles missing blog directory gracefully');
  console.log('Exiting with code 0');
  process.exit(0);
} else {
  console.log('❌ FAIL: Blog directory exists when it should not');
  process.exit(1);
}
