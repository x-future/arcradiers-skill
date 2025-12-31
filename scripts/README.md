# Sitemap Auto-Update Script

This script automatically updates `sitemap.xml` based on HTML files in the `public` directory.

## Features

- ✅ Automatically scans for HTML files in `public/` directory
- ✅ Updates `lastmod` dates based on file modification times
- ✅ Includes hash fragment URLs (anchor links)
- ✅ Configurable priorities and change frequencies
- ✅ Runs automatically before build

## Usage

### Manual Update

```bash
npm run update-sitemap
```

### Automatic Update

The sitemap is automatically updated when you run:

```bash
npm run build
```

This is handled by the Vite plugin in `vite-plugin-sitemap.js`.

## Configuration

Edit `scripts/update-sitemap.js` to modify:

- **DOMAIN**: Change the base domain URL
- **PAGE_CONFIG**: Adjust priorities and change frequencies for specific pages

## How It Works

1. Scans `public/` directory for `.html` files
2. Gets file modification dates
3. Generates sitemap.xml with proper XML structure
4. Includes:
   - Homepage (`/`)
   - Hash fragment URLs (`/#features`, `/#skill-trees`, etc.)
   - All HTML files in public directory

## Adding New Pages

Simply add a new HTML file to `public/` directory, and it will be automatically included in the sitemap on the next update.

To customize a page's priority or change frequency, add it to `PAGE_CONFIG` in `update-sitemap.js`:

```javascript
const PAGE_CONFIG = {
  '/new-page.html': { priority: '0.9', changefreq: 'weekly' },
};
```



