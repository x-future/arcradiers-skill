import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.dirname(__dirname);
const BLOG_DIR = path.join(ROOT_DIR, 'blog');

console.log('Testing from scripts directory:');
console.log('__dirname:', __dirname);
console.log('ROOT_DIR:', ROOT_DIR);
console.log('BLOG_DIR:', BLOG_DIR);
console.log('Exists:', fs.existsSync(BLOG_DIR));

if (!fs.existsSync(BLOG_DIR)) {
  console.log('⚠️  Blog directory not found');
  process.exit(0);
}
