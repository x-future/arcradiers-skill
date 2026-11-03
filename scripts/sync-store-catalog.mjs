import fs from 'node:fs/promises';

const api = 'https://api.arc-store.pro/api/v1';
const catalog = [];
for (const kind of ['services', 'bundles']) {
  const response = await fetch(`${api}/${kind}/?is_active=true&storefront=en`);
  if (!response.ok) throw new Error(`Catalog fetch failed: ${response.status}`);
  const entries = await response.json();
  if (!Array.isArray(entries)) throw new Error('Invalid catalog response');
  for (const entry of entries.filter(item => item.is_active)) {
    if (!entry.slug || !entry.name_en) throw new Error('Missing product identity');
    const image = entry.image_url_en || entry.image_url;
    catalog.push({
      id: `${kind}-${entry.id}`,
      name: entry.name_en.replace(/^\S*\p{Extended_Pictographic}\S*\s*/u, ''),
      destination: `/${kind}/${kind === 'bundles' && entry.id === 30 ? 'post-wipe-recovery' : encodeURIComponent(entry.slug)}/`,
      image: image ? new URL(image, image.startsWith('/assets/') ? 'https://arc-store.pro' : 'https://api.arc-store.pro').href : null,
      description: entry.short_descr_en || '',
      group: /weapon|grenade|shield|backpack/.test(entry.slug) ? 'Weapons & gear'
        : /blueprint/.test(entry.slug) ? 'Blueprints'
        : /loadout|bundles/.test(`${entry.slug} ${kind}`) ? 'Loadouts & bundles' : 'Resources & upgrades',
    });
  }
}
if (!catalog.length) throw new Error('Empty catalog');
await fs.writeFile(new URL('../store-catalog.json', import.meta.url), `${JSON.stringify({ updatedAt: new Date().toISOString(), products: catalog }, null, 2)}\n`);
console.log(`Saved ${catalog.length} catalog entries`);
