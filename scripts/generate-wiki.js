import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const WIKI_DIR = path.join(PUBLIC_DIR, 'wiki');
const SITE_ORIGIN = 'https://arcraiderskill.com';
const UPDATED = '2026-08-11';
const UPDATED_LABEL = 'August 11, 2026';

const sources = {
  overview: {
    name: 'Everything You Need to Know About ARC Raiders',
    url: 'https://arcraiders.com/news/everything-you-need-to-know',
  },
  shroudedSky: {
    name: 'Shrouded Sky - Patch Notes 1.17.0',
    url: 'https://arcraiders.com/news/shrouded-sky-patch-notes-1-17-0',
  },
  kettleRate: {
    name: 'Patch Notes 1.11.0',
    url: 'https://arcraiders.com/news/patch-notes-1-11-0',
  },
  update13: {
    name: 'Patch Notes 1.3.0',
    url: 'https://arcraiders.com/news/duck-update-patch-notes-1-3-0',
  },
  northLine: {
    name: 'The Frontier Expands North',
    url: 'https://arcraiders.com/news/north-line-update',
  },
  rivenTides: {
    name: 'Riven Tides - Patch Notes 1.26.0',
    url: 'https://arcraiders.com/news/riven-tides-patch-notes-1-26-0',
  },
  fireflyComet: {
    name: 'Firefly and Comet: How to Combat the New ARC Enemies',
    url: 'https://arcraiders.com/news/firefly-comet-tips-and-tricks',
  },
  live39: {
    name: 'Live Update 1.39.0',
    url: 'https://arcraiders.com/news/live-update-1-39-0',
  },
  fourthExpedition: {
    name: 'The Fourth Expedition',
    url: 'https://arcraiders.com/news/the-fourth-expedition',
  },
};

const categories = [
  { slug: 'weapons', name: 'Weapons', kicker: 'Combat database', description: 'Weapon roles, official balance values, build pairings, unlock notes and practical loadouts.' },
  { slug: 'items', name: 'Items', kicker: 'Inventory reference', description: 'Gameplay items, ammunition, blueprints, keys, consumables and economy-sensitive gear.' },
  { slug: 'resources', name: 'Resources', kicker: 'Crafting materials', description: 'Basic materials, ARC components and the workshop loops that turn salvage into gear.' },
  { slug: 'enemies', name: 'Enemies', kicker: 'ARC field guide', description: 'Machines, bosses, threat behaviors, weak-point notes and encounter preparation.' },
  { slug: 'maps', name: 'Maps', kicker: 'Rust Belt atlas', description: 'Locations, terrain identity, map conditions, loot context and route-planning questions.' },
  { slug: 'armor', name: 'Armor', kicker: 'Defense systems', description: 'Shields and Augments explained using the terminology found in official ARC Raiders material.' },
  { slug: 'gadgets', name: 'Gadgets', kicker: 'Topside utility', description: 'Deployables, throwables, traversal tools, healing options and squad utility.' },
];

const navItems = [
  { href: '/wiki/', label: 'Wiki' },
  { href: '/wiki/weapons/', label: 'Weapons' },
  { href: '/wiki/enemies/', label: 'Enemies' },
  { href: '/wiki/maps/', label: 'Maps' },
  { href: '/wiki/items/', label: 'Items' },
  { href: '/blog.html', label: 'Guides' },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) return false;
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function absoluteUrl(pathname) {
  return new URL(pathname, SITE_ORIGIN).href;
}

function sourceLink(source, label = source.name) {
  return `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function cards(items, defaultKicker) {
  return `<div class="entity-grid">${items.map((item) => {
    const content = `
        <span class="card-kicker">${escapeHtml(item.kicker || defaultKicker)}</span>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.description)}</p>
        ${item.href ? `<span class="card-action">${escapeHtml(item.action || 'Open entry')}</span>` : ''}`;
    return item.href
      ? `<article class="entity-card"><a href="${item.href}">${content}</a></article>`
      : `<article class="entity-card"><div class="entity-card-body">${content}</div></article>`;
  }).join('')}
  </div>`;
}

function categoryCards() {
  return `<div class="category-grid">${categories.map((category) => `
    <article class="category-card">
      <a href="/wiki/${category.slug}/">
        <span class="card-kicker">${escapeHtml(category.kicker)}</span>
        <h3>${escapeHtml(category.name)}</h3>
        <p>${escapeHtml(category.description)}</p>
        <span class="card-action">Browse ${escapeHtml(category.name)}</span>
      </a>
    </article>`).join('')}
  </div>`;
}

function factBand(facts) {
  return `<div class="fact-band" aria-label="Quick facts">${facts.map((fact) => `
    <div class="fact"><strong>${escapeHtml(fact.value)}</strong><span>${escapeHtml(fact.label)}</span></div>`).join('')}
  </div>`;
}

function quickNav(currentPath) {
  return `<nav class="quick-nav" aria-label="Wiki categories">
    <a href="/wiki/"${currentPath === '/wiki/' ? ' aria-current="page"' : ''}>All</a>
    ${categories.map((category) => {
      const href = `/wiki/${category.slug}/`;
      return `<a href="${href}"${currentPath.startsWith(href) ? ' aria-current="page"' : ''}>${category.name}</a>`;
    }).join('')}
  </nav>`;
}

function sourceList(sourceItems) {
  return `<ul class="source-list">${sourceItems.map((source) => `
    <li>${sourceLink(source)} <span class="card-kicker">Official ARC Raiders source</span></li>`).join('')}
  </ul>`;
}

function faqMarkup(faqs) {
  return faqs.map((faq) => `
    <h3>${escapeHtml(faq.question)}</h3>
    <p>${faq.answer}</p>`).join('');
}

function navMarkup(currentPath) {
  return navItems.map((item) => {
    const isCurrent = item.href === '/wiki/'
      ? currentPath === '/wiki/'
      : item.href.startsWith('/wiki/') && currentPath.startsWith(item.href);
    return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''}>${item.label}</a>`;
  }).join('');
}

function breadcrumbMarkup(crumbs) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
    ${crumbs.map((crumb, index) => {
      const isLast = index === crumbs.length - 1;
      const item = isLast
        ? `<span aria-current="page">${escapeHtml(crumb.name)}</span>`
        : `<a href="${crumb.path}">${escapeHtml(crumb.name)}</a>`;
      return `${index ? '<span aria-hidden="true">/</span>' : ''}${item}`;
    }).join('')}
  </nav>`;
}

function pageSchema(page) {
  const graph = [
    {
      '@type': 'VideoGame',
      '@id': `${SITE_ORIGIN}/wiki/#game`,
      name: 'ARC Raiders',
      url: 'https://arcraiders.com/',
      gamePlatform: ['PC', 'PlayStation 5', 'Xbox Series X|S'],
    },
    {
      '@type': page.schemaType || 'WebPage',
      '@id': `${absoluteUrl(page.path)}#page`,
      url: absoluteUrl(page.path),
      name: page.title,
      description: page.description,
      dateModified: UPDATED,
      inLanguage: 'en',
      about: { '@id': `${SITE_ORIGIN}/wiki/#game` },
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      ...(page.schemaType === 'TechArticle' ? {
        headline: page.h1,
        author: { '@type': 'Organization', name: 'ARC Raiders Skill Tree Builder' },
        publisher: { '@type': 'Organization', name: 'ARC Raiders Skill Tree Builder' },
      } : {}),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: page.crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    },
  ];

  if (page.listItems?.length) {
    graph.push({
      '@type': 'ItemList',
      name: page.h1,
      numberOfItems: page.listItems.length,
      itemListElement: page.listItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(item.href ? { url: absoluteUrl(item.href) } : {}),
      })),
    });
  }

  if (page.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.schemaAnswer,
        },
      })),
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function renderPage(page) {
  const canonical = absoluteUrl(page.path);
  const imageUrl = absoluteUrl(page.image);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.description)}">
  <meta name="author" content="ARC Raiders Skill Tree Builder">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.png">
  <link rel="stylesheet" href="/wiki/wiki.css">
  <meta property="og:type" content="${page.schemaType === 'TechArticle' ? 'article' : 'website'}">
  <meta property="og:site_name" content="ARC Raiders Skill Tree Builder">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1024">
  <meta property="og:image:height" content="576">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(page.title)}">
  <meta name="twitter:description" content="${escapeHtml(page.description)}">
  <meta name="twitter:image" content="${imageUrl}">
  <script type="application/ld+json">${pageSchema(page)}</script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9774598933307185" crossorigin="anonymous"></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="ARC Raiders Skill Tree Builder home">
        <img src="/apple-touch-icon.png" width="34" height="34" alt="">
        <span class="brand-copy"><strong>ARC Raiders</strong><small>Field Wiki</small></span>
      </a>
      <nav class="primary-nav" aria-label="Primary navigation">${navMarkup(page.path)}</nav>
      <a class="builder-link" href="/">Open Builder</a>
    </div>
  </header>

  <main id="main-content">
    <header class="hero">
      <img src="${page.image}" width="1024" height="576" alt="${escapeHtml(page.imageAlt)}" fetchpriority="high">
      <div class="hero-inner">
        ${breadcrumbMarkup(page.crumbs)}
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeHtml(page.h1)}</h1>
        <p class="hero-lead">${escapeHtml(page.lead)}</p>
        <div class="hero-meta">
          <span>Updated ${UPDATED_LABEL}</span>
          <span>Official sources cited</span>
          <span>Community guide</span>
        </div>
      </div>
    </header>
    <div class="page-shell">
      ${quickNav(page.path)}
      ${page.body}
    </div>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div>Community-created ARC Raiders reference. Not affiliated with or endorsed by Embark Studios. Game data can change after live updates.</div>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="/">Skill Builder</a>
        <a href="/wiki/">Wiki</a>
        <a href="/blog.html">Guides</a>
        <a href="/privacy-policy.html">Privacy</a>
        <a href="https://arcraiders.com/" target="_blank" rel="noopener noreferrer">Official site</a>
      </nav>
    </div>
  </footer>
</body>
</html>`;
}

const weaponItems = [
  { name: 'Kettle', href: '/wiki/weapons/kettle/', kicker: 'Mid-range / Light ammo', description: 'A deliberate semi-automatic option whose official fire-rate cap and base damage were rebalanced in 2026.' },
  { name: 'Stitcher', href: '/wiki/weapons/stitcher/', kicker: 'Close range / Light ammo', description: 'An automatic close-quarters weapon balanced around fast pressure, positioning and controlled dispersion.' },
  { name: 'Venator', href: '/wiki/weapons/venator/', kicker: 'Pistol / Medium ammo', description: 'A high-performing precision pistol with strong headshot incentive, upgrade scaling and meaningful carry weight.' },
];

const enemyItems = [
  { name: 'Bastion', href: '/wiki/enemies/bastion/', kicker: 'Ground ARC / Heavy', description: 'An armored ground machine with target-switch audio cues and vulnerable leg joints or weak spots.' },
  { name: 'Tick', kicker: 'Interior ambusher', description: 'A small eight-legged ARC that clings to walls and ceilings before jumping an unaware Raider.' },
  { name: 'Snitch', kicker: 'Flying scout', description: 'Aerial surveillance ARC that calls reinforcements after spotting suspicious activity.' },
  { name: 'Leaper', kicker: 'Ground assault', description: 'A large patrol machine defined by a destructive leap attack and sudden gap-closing pressure.' },
  { name: 'Bombardier', kicker: 'Indirect fire', description: 'Works with Spotter drones to designate Raiders for lethal mortar attacks.' },
  { name: 'Queen', kicker: 'Boss ARC', description: 'An enormous machine that defends the Harvester and can punish unprepared groups with stomp pressure.' },
  { name: 'Matriarch', kicker: 'Boss ARC', description: 'An imposing machine introduced with Stella Montis and encountered under a specific map condition.' },
  { name: 'Shredder', kicker: 'Close quarters', description: 'A fast ARC introduced at Stella Montis for dangerous interior and close-range encounters.' },
  { name: 'Firefly', kicker: 'Flying hunter', description: 'A persistent flying flame threat that can chase Raiders into cover instead of holding distance.' },
  { name: 'Comet', kicker: 'Focused predator', description: 'A rolling explosive ARC with armor plates, an exposed inner weak point and high burst threat.' },
  { name: 'ARC Turbine', kicker: 'Riven Tides', description: 'A floating ARC introduced with Riven Tides whose loot value was increased in Live Update 1.36.0.' },
  { name: 'Wasp', kicker: 'Flying ARC', description: 'One of the Rust Belt flying ARC types and a recurring Feat target in official game examples.' },
];

const mapItems = [
  { name: 'Dam Battlegrounds', kicker: 'Starter location', description: 'Forests, swamps, old research centers and apartment buildings create varied early routes.' },
  { name: 'Buried City', kicker: 'Urban / Sand', description: 'A pre-collapse city buried in dunes, with a hospital, mall, town squares and apartments.' },
  { name: 'Spaceport', kicker: 'Industrial', description: 'A derelict launch facility filled with old technology and large industrial locations.' },
  { name: 'The Blue Gate', kicker: 'Mountain region', description: 'Open areas, small towns, tunnels and underground complexes reward flexible routing.' },
  { name: 'Stella Montis', kicker: 'Northern frontier', description: 'A later Rust Belt location unlocked through the North Line community effort.' },
  { name: 'Riven Tides', kicker: 'Coastal map', description: 'An abandoned shoreline, Exodus port and the Panorama Azzurro hotel, added in April 2026.' },
];

const itemItems = [
  { name: 'Ammunition', kicker: 'Combat supply', description: 'Weapon-specific supplies such as launcher, heavy and energy ammunition; costs and drop sources can change.' },
  { name: 'Blueprints', kicker: 'Progression', description: 'Unlock paths for workshop crafting that may appear in events, expeditions, loot and rotating rewards.' },
  { name: 'Consumables', kicker: 'Recovery', description: 'Healing and support items used during a raid, including bandages and Vita Spray.' },
  { name: 'Quest Items', kicker: 'Objective', description: 'Mission-specific objects and relics that can require a successful extraction to count.' },
  { name: 'Keys and Access', kicker: 'Exploration', description: 'Access items for locked rooms, hatches and high-value spaces where the risk-reward profile changes.' },
  { name: 'Trinkets', kicker: 'Value loot', description: 'Collectible valuables shown in the Raider Den and used by live events or projects.' },
];

const resourceItems = [
  { name: 'Metal Parts', kicker: 'Basic material', description: 'A core contribution material named in the official North Line tunnel project.' },
  { name: 'Fabric', kicker: 'Basic material', description: 'General salvage used by the resource and workshop economy.' },
  { name: 'Chemicals', kicker: 'Basic material', description: 'A base resource used in progression and crafting-oriented loops.' },
  { name: 'Rubber Parts', kicker: 'Basic material', description: 'Common project material gathered Topside and returned to Speranza.' },
  { name: 'Plastic Parts', kicker: 'Basic material', description: 'One of the five official Basic Materials requested by the North Line event.' },
  { name: 'ARC Circuitry', kicker: 'ARC component', description: 'A machine-derived component used in official crafting adjustments such as Deadline.' },
  { name: 'ARC Motion Core', kicker: 'ARC component', description: 'A component used in the official revised recipe for launcher ammunition.' },
  { name: 'Explosive Compound', kicker: 'Refined material', description: 'An explosive crafting input whose recipes and costs have changed across patches.' },
  { name: 'Electrical Components', kicker: 'Crafting component', description: 'A workshop input used in updated utility recipes such as Showstopper.' },
];

const gadgetItems = [
  { name: 'Lure Grenade', kicker: 'ARC control', description: 'A distraction tool the official overview describes as a way to trick ARC machines.' },
  { name: 'Zipline', kicker: 'Traversal', description: 'A route-making gadget for vertical or horizontal repositioning, subject to placement rules.' },
  { name: 'Mines', kicker: 'Area control', description: 'Deployable threats that shape doors, paths and defensive positions.' },
  { name: 'Door Blocker', kicker: 'Fortification', description: 'A defensive utility for controlling access and buying time inside structures.' },
  { name: 'Powered Descender', kicker: 'Epic gadget', description: 'A traversal gadget introduced with the Riven Tides update in April 2026.' },
  { name: 'Crash Mat', kicker: 'Uncommon throwable', description: 'A throwable introduced with Riven Tides that extends safe fall options.' },
  { name: 'White Flag', kicker: 'Common deployable', description: 'A common deployable added to the gameplay item roster in Riven Tides.' },
  { name: "Dockmaster's Detector", kicker: 'Common gadget', description: 'A detector introduced alongside the Riven Tides coastal map.' },
  { name: 'Photoelectric Cloak', kicker: 'Stealth utility', description: 'A power-using cloak whose weight and consumption were increased in Update 1.26.0.' },
];

const armorItems = [
  { name: 'Light Shield Setup', kicker: 'Mobility first', description: 'Trades some protection for movement and carrying flexibility when routes matter more than open trades.' },
  { name: 'Heavy Shield Setup', kicker: 'Protection first', description: 'Prioritizes defensive capacity while increasing the importance of weight and stamina support.' },
  { name: 'Combat Augments', kicker: 'Offensive slots', description: 'Augments that bias a loadout toward fighting, gadget capacity or specialist combat roles.' },
  { name: 'Tactical Augments', kicker: 'Squad utility', description: 'Support-oriented options including officially referenced healing and smoke variants.' },
];

const categoryPages = [
  {
    path: '/wiki/weapons/',
    title: 'ARC Raiders Weapons: Best Guns & Tier Guide | Wiki',
    description: 'Explore ARC Raiders weapons, current official damage changes, role-based gun picks, best builds, loadouts, unlock notes and detailed weapon guides.',
    h1: 'ARC Raiders Weapons Guide',
    eyebrow: 'Weapons database',
    lead: 'Compare ARC Raiders guns by role, current official balance values, build fit and loadout purpose. Start with verified facts, then choose for the fight you expect.',
    image: '/images/wiki/official-weapons.webp',
    imageAlt: 'ARC Raiders weapons and gear shown in official game artwork',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Weapons', path: '/wiki/weapons/' }],
    schemaType: 'CollectionPage',
    listItems: weaponItems,
    body: `
      ${factBand([{ value: '3', label: 'Detailed guides' }, { value: '1.39.0', label: 'Notes reviewed through' }, { value: 'Role-based', label: 'Tier method' }, { value: 'Official', label: 'Balance citations' }])}
      <section class="section" id="featured-weapons">
        <div class="section-heading"><h2>Featured Weapon Guides</h2><p>Each page separates official balance facts from community build recommendations, with patch-sensitive fields clearly labeled.</p></div>
        ${cards(weaponItems, 'Weapon guide')}
      </section>
      <section class="section" id="tier-list">
        <div class="section-heading"><h2>Best Weapons by Role</h2><p>A useful tier list starts with the job, not a single universal ranking.</p></div>
        <table class="data-table">
          <thead><tr><th>Combat role</th><th>Shortlist</th><th>Why it fits</th></tr></thead>
          <tbody>
            <tr><td>Close quarters</td><td><a href="/wiki/weapons/stitcher/">Stitcher</a></td><td>Officially described as a close-quarter weapon; best when positioning gets you inside its effective pressure window.</td></tr>
            <tr><td>Deliberate mid range</td><td><a href="/wiki/weapons/kettle/">Kettle</a></td><td>Official notes distinguish it from the Stitcher by encouraging paced, medium-range shots and headshot accuracy.</td></tr>
            <tr><td>Precision sidearm</td><td><a href="/wiki/weapons/venator/">Venator</a></td><td>A pistol with strong headshot incentive and upgrade fire-rate scaling, balanced by meaningful weight.</td></tr>
            <tr><td>Simple automatic rifle</td><td>Rattler</td><td>The official game overview names the Rattler as a straightforward automatic rifle.</td></tr>
            <tr><td>Close-range shotgun</td><td>Vulcano</td><td>The official overview identifies the Vulcano as a close-range shotgun option.</td></tr>
            <tr><td>Energy weapon</td><td>Equalizer</td><td>Officially cited as an example of ARC Raiders' higher-tech energy weapon category.</td></tr>
          </tbody>
        </table>
        <div class="notice"><strong>Tier-list note:</strong> ARC Raiders is updated frequently. Treat a weapon's role, ammo economy and route fit as more durable guidance than a fixed S-to-D ranking.</div>
      </section>
      <section class="section" id="weapon-system">
        <div class="section-heading"><h2>How Weapons Progress</h2><p>The official overview confirms three separate improvement levers: attachments, workshop upgrades and loadout specialization.</p></div>
        <div class="article"><p>Weapons are only one part of a Raider setup. Attachments change handling, Workshop upgrades improve a weapon over time, and skills support the movement, stamina, carrying and recovery needed to use that gun well. The skill tree does not simply add a universal damage multiplier, so each detailed guide recommends skills for positioning and sustain rather than claiming unsupported DPS bonuses.</p></div>
      </section>
      <section class="section" id="sources"><div class="section-heading"><h2>Official Sources</h2><p>Primary sources used for names, roles and current balance values.</p></div>${sourceList([sources.overview, sources.shroudedSky, sources.kettleRate, sources.update13, sources.live39])}</section>`,
  },
  {
    path: '/wiki/items/',
    title: 'ARC Raiders Items Guide: Loot, Ammo & Blueprints | Wiki',
    description: 'Browse ARC Raiders items by purpose, including ammunition, blueprints, consumables, quest items, access items and trinkets with official source notes.',
    h1: 'ARC Raiders Items Guide',
    eyebrow: 'Inventory reference',
    lead: 'Understand what an item does before it consumes a slot: fight with it, craft with it, unlock something, complete an objective or extract it for value.',
    image: '/images/wiki/official-workshop.webp',
    imageAlt: 'ARC Raiders trader and workshop scene from official game artwork',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Items', path: '/wiki/items/' }],
    schemaType: 'CollectionPage',
    listItems: itemItems,
    body: `
      ${factBand([{ value: '6', label: 'Item groups' }, { value: 'Topside', label: 'Primary source' }, { value: 'Workshop', label: 'Craft and repair' }, { value: 'Live', label: 'Economy changes' }])}
      <section class="section" id="item-types"><div class="section-heading"><h2>Item Types</h2><p>This taxonomy keeps inventory objects separate from crafting resources and equippable gadgets.</p></div>${cards(itemItems, 'Item category')}</section>
      <section class="section" id="decision-guide">
        <div class="section-heading"><h2>Keep, Use or Extract?</h2><p>Classify the item by immediate raid value and longer-term progression value.</p></div>
        <table class="data-table"><thead><tr><th>Question</th><th>Decision signal</th></tr></thead><tbody>
          <tr><td>Does it keep this run alive?</td><td>Healing, ammunition and escape utility normally outrank speculative value when extraction is at risk.</td></tr>
          <tr><td>Is it needed by an active quest or project?</td><td>Official events can require successful extraction with relics or direct project contributions.</td></tr>
          <tr><td>Does it unlock future crafting?</td><td>Blueprints and workshop progression can be more valuable than their immediate sale value.</td></tr>
          <tr><td>Is the price patch-sensitive?</td><td>Items such as Deadline, Power Cell and launcher ammo have received official economy changes; verify the live tooltip.</td></tr>
        </tbody></table>
      </section>
      <section class="section" id="sources"><div class="section-heading"><h2>Official Sources</h2><p>The official site describes the loot loop and records economy changes in patch notes.</p></div>${sourceList([sources.overview, sources.update13, sources.shroudedSky, sources.live39])}</section>`,
  },
  {
    path: '/wiki/resources/',
    title: 'ARC Raiders Resources & Crafting Materials Guide | Wiki',
    description: 'Find ARC Raiders resources and crafting materials, from basic parts to ARC components, with workshop uses, official recipe examples and inventory guidance.',
    h1: 'ARC Raiders Resources Guide',
    eyebrow: 'Crafting materials',
    lead: 'Track the basic salvage and ARC-derived components that feed projects, ammunition, gadgets and Workshop progression in Speranza.',
    image: '/images/wiki/official-workshop.webp',
    imageAlt: 'Official ARC Raiders workshop environment with equipment and salvage',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Resources', path: '/wiki/resources/' }],
    schemaType: 'CollectionPage',
    listItems: resourceItems,
    body: `
      ${factBand([{ value: '5', label: 'Basic materials' }, { value: 'ARC', label: 'Machine components' }, { value: 'Projects', label: 'Progression use' }, { value: 'Workshop', label: 'Crafting use' }])}
      <section class="section" id="resource-index"><div class="section-heading"><h2>Resource Index</h2><p>Start with broad Basic Materials, then preserve rarer machine components for recipes that specifically require them.</p></div>${cards(resourceItems, 'Crafting resource')}</section>
      <section class="section" id="official-recipes">
        <div class="section-heading"><h2>Official Recipe Examples</h2><p>Patch notes show why crafting tables must be treated as live data rather than permanent values.</p></div>
        <table class="data-table"><thead><tr><th>Output</th><th>Officially documented inputs</th><th>Source context</th></tr></thead><tbody>
          <tr><td>Deadline</td><td>ARC Circuitry plus explosive materials after Update 1.3.0</td><td>Recipe and economy rebalance</td></tr>
          <tr><td>Launcher ammo</td><td>ARC Motion Core plus Crude Explosives after Update 1.3.0</td><td>Workbench recipe available without a blueprint at that update</td></tr>
          <tr><td>Wolfpack</td><td>Rocketeer Driver and Refined Explosive adjustments in Update 1.17.0</td><td>Value and crafting-cost pass</td></tr>
          <tr><td>Vita Spray</td><td>Tick Pod added as a crafting cost in Update 1.17.0</td><td>Utility economy pass</td></tr>
        </tbody></table>
        <div class="notice">Always use the current in-game Workshop as the final recipe authority. This page records official examples to explain material relationships, not to freeze a live economy.</div>
      </section>
      <section class="section" id="sources"><div class="section-heading"><h2>Official Sources</h2><p>Primary sources for Basic Materials and recipe changes.</p></div>${sourceList([sources.northLine, sources.update13, sources.shroudedSky, sources.overview])}</section>`,
  },
  {
    path: '/wiki/enemies/',
    title: 'ARC Raiders Enemies & Bosses: ARC Machines Guide | Wiki',
    description: 'Identify ARC Raiders enemies, bosses and machines, including Bastion, Queen, Tick, Firefly, Comet and ARC Turbine, with official behavior notes.',
    h1: 'ARC Raiders Enemies & Bosses',
    eyebrow: 'ARC machine field guide',
    lead: 'Identify a machine by behavior before choosing the fight. This field guide separates scouts, ambushers, artillery, armored ARC and boss-scale threats.',
    image: '/images/wiki/official-arc-queen.webp',
    imageAlt: 'The Queen ARC machine in official ARC Raiders artwork',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Enemies', path: '/wiki/enemies/' }],
    schemaType: 'CollectionPage',
    listItems: enemyItems,
    body: `
      ${factBand([{ value: '12', label: 'Machines indexed' }, { value: '3', label: 'Threat scales' }, { value: 'Weak spots', label: 'Aim priority' }, { value: 'Audio', label: 'Early warning' }])}
      <section class="section" id="arc-index"><div class="section-heading"><h2>ARC Machine Index</h2><p>Official descriptions are condensed into the behavior signal a Raider needs during an encounter.</p></div>${cards(enemyItems, 'ARC machine')}</section>
      <section class="section" id="threat-classes">
        <div class="section-heading"><h2>Threat Classes</h2><p>Use size only as a first clue; detection behavior and attack pattern are often more important.</p></div>
        <table class="data-table"><thead><tr><th>Class</th><th>Examples</th><th>Primary response</th></tr></thead><tbody>
          <tr><td>Detection and pursuit</td><td>Snitch, Firefly, Wasp</td><td>Break line of sight, remove surveillance quickly and avoid letting an alert escalate.</td></tr>
          <tr><td>Ambush and close pressure</td><td>Tick, Leaper, Shredder, Comet</td><td>Preserve movement space and learn the cue that precedes the machine's committed attack.</td></tr>
          <tr><td>Armored and indirect fire</td><td>Bastion, Bombardier, Rocketeer</td><td>Fight from hard cover, attack vulnerable components and avoid static open trades.</td></tr>
          <tr><td>Boss-scale ARC</td><td>Queen, Matriarch</td><td>Treat the encounter as an objective requiring preparation, ammunition depth and an exit plan.</td></tr>
        </tbody></table>
      </section>
      <section class="section" id="sources"><div class="section-heading"><h2>Official Sources</h2><p>Enemy names and behavior notes are based on official overview, update and developer-tip pages.</p></div>${sourceList([sources.overview, sources.northLine, sources.fireflyComet, sources.rivenTides, sources.live39])}</section>`,
  },
  {
    path: '/wiki/maps/',
    title: 'ARC Raiders Maps Guide: Locations & Conditions | Wiki',
    description: 'Explore ARC Raiders maps and locations, including Dam Battlegrounds, Buried City, Spaceport, Blue Gate, Stella Montis and Riven Tides.',
    h1: 'ARC Raiders Maps Guide',
    eyebrow: 'Rust Belt atlas',
    lead: 'Compare each location by terrain identity, interior density, sight-line risk and the map conditions that can transform its routes and rewards.',
    image: '/images/wiki/official-environments.webp',
    imageAlt: 'Multiple Rust Belt environments from official ARC Raiders artwork',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Maps', path: '/wiki/maps/' }],
    schemaType: 'CollectionPage',
    listItems: mapItems,
    body: `
      ${factBand([{ value: '6', label: 'Locations' }, { value: 'Dynamic', label: 'Map conditions' }, { value: 'Solo-Trio', label: 'Route planning' }, { value: 'Live', label: 'Official schedule' }])}
      <section class="section" id="map-index"><div class="section-heading"><h2>Rust Belt Locations</h2><p>Official location descriptions provide the stable terrain baseline; routes and loot remain live-game knowledge.</p></div>${cards(mapItems, 'Map')}</section>
      <section class="section" id="conditions">
        <div class="section-heading"><h2>Map Conditions</h2><p>Conditions change visibility, threat, loot or objectives and should alter your loadout before deployment.</p></div>
        <table class="data-table"><thead><tr><th>Condition</th><th>Officially described effect or context</th></tr></thead><tbody>
          <tr><td>Night Raid</td><td>Higher-value loot and a stronger ARC threat under reduced visibility.</td></tr>
          <tr><td>Harvest Season</td><td>Higher yield from nature loot.</td></tr>
          <tr><td>Electromagnetic Storm</td><td>A named special condition in the official game overview.</td></tr>
          <tr><td>Hidden Bunkers</td><td>A condition that changes access and objective opportunities.</td></tr>
          <tr><td>Hurricane</td><td>Low visibility, strong wind and dangerous debris introduced with Shrouded Sky.</td></tr>
          <tr><td>Beachcombing</td><td>A Riven Tides-exclusive condition centered on buried beach discoveries.</td></tr>
        </tbody></table>
        <div class="button-row"><a class="button" href="https://arcraiders.com/map-conditions" target="_blank" rel="noopener noreferrer">Official live schedule</a></div>
      </section>
      <section class="section" id="sources"><div class="section-heading"><h2>Official Sources</h2><p>Primary descriptions for locations and conditions.</p></div>${sourceList([sources.overview, sources.northLine, sources.rivenTides, sources.shroudedSky, sources.live39])}</section>`,
  },
  {
    path: '/wiki/armor/',
    title: 'ARC Raiders Armor, Shields & Augments Guide | Wiki',
    description: 'Understand ARC Raiders armor terminology, shields and Augments, including light versus heavy setups, weight tradeoffs and tactical build choices.',
    h1: 'ARC Raiders Armor & Shields',
    eyebrow: 'Defense systems',
    lead: 'The official overview frames defense through Shields and Augments. Use that system to balance protection, movement, carrying capacity, gadgets and squad role.',
    image: '/images/wiki/official-weapons.webp',
    imageAlt: 'ARC Raiders equipment and defensive gear in official artwork',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Armor', path: '/wiki/armor/' }],
    schemaType: 'CollectionPage',
    listItems: armorItems,
    body: `
      ${factBand([{ value: 'Shields', label: 'Protection layer' }, { value: 'Augments', label: 'Build layer' }, { value: 'Weight', label: 'Core tradeoff' }, { value: 'Capacity', label: 'Loadout tradeoff' }])}
      <section class="section" id="systems"><div class="section-heading"><h2>Defense System Index</h2><p>Searchers often say armor, while official ARC Raiders material emphasizes shields and Augments.</p></div>${cards(armorItems, 'Defense setup')}</section>
      <section class="section" id="build-choice">
        <div class="section-heading"><h2>Choose Protection by Mission</h2><p>There is no best armor setup without a route, squad role and extraction goal.</p></div>
        <table class="data-table"><thead><tr><th>Mission profile</th><th>Defense priority</th><th>Supporting skills</th></tr></thead><tbody>
          <tr><td>Fast objective or loot route</td><td>Lighter setup that preserves movement and carry flexibility.</td><td>Nimble Climber, Marathon Runner, Broad Shoulders.</td></tr>
          <tr><td>Expected PvP contact</td><td>More shield capacity with stamina support for repositioning after a trade.</td><td>Used To The Weight, Fight Or Flight, Effortless Roll.</td></tr>
          <tr><td>Heavy ARC objective</td><td>Protection and utility capacity, with enough weight margin for ammunition.</td><td>Loaded Arms, Stubborn Mule, Traveling Tinkerer.</td></tr>
          <tr><td>Squad support</td><td>Tactical Augment choices that add healing, smoke or recovery utility.</td><td>Good As New, In-Round Crafting, Downed But Determined.</td></tr>
        </tbody></table>
        <div class="notice">Skill recommendations support movement, inventory and recovery. They do not claim to increase a shield's listed value unless the in-game skill tooltip explicitly says so.</div>
      </section>
      <section class="section" id="sources"><div class="section-heading"><h2>Official Sources</h2><p>Official terminology and recent Augment references.</p></div>${sourceList([sources.overview, sources.rivenTides, sources.live39])}</section>`,
  },
  {
    path: '/wiki/gadgets/',
    title: 'ARC Raiders Gadgets, Grenades & Utility Guide | Wiki',
    description: 'Browse ARC Raiders gadgets, grenades, deployables and traversal tools, including ziplines, mines, Powered Descender, Crash Mat and utility picks.',
    h1: 'ARC Raiders Gadgets Guide',
    eyebrow: 'Topside utility',
    lead: 'Build a utility kit around the problem you cannot solve with a gun: movement, cover, healing, detection, distraction, denial or a safer extraction route.',
    image: '/images/wiki/official-workshop.webp',
    imageAlt: 'Official ARC Raiders workshop where gadgets and gear are prepared',
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Gadgets', path: '/wiki/gadgets/' }],
    schemaType: 'CollectionPage',
    listItems: gadgetItems,
    body: `
      ${factBand([{ value: '9', label: 'Tools indexed' }, { value: 'Traversal', label: 'Route control' }, { value: 'Deployables', label: 'Area control' }, { value: 'Support', label: 'Squad value' }])}
      <section class="section" id="gadget-index"><div class="section-heading"><h2>Gadget Index</h2><p>The official overview spans distraction, traversal, mines, fortification, explosives, light and recovery.</p></div>${cards(gadgetItems, 'Gadget')}</section>
      <section class="section" id="loadout-slots">
        <div class="section-heading"><h2>Build a Utility Kit</h2><p>A balanced kit covers entry, the expected fight and the exit.</p></div>
        <div class="loadout">
          <div><strong>Movement slot</strong><span>Zipline, Powered Descender or Crash Mat for a route the base movement kit cannot safely solve.</span></div>
          <div><strong>Control slot</strong><span>Lure Grenade, mine, Door Blocker or other deployable for space and timing.</span></div>
          <div><strong>Recovery slot</strong><span>Bandage, Vita Spray, smoke or squad support for surviving the consequence of contact.</span></div>
        </div>
        <p class="notice">Patch-sensitive utility matters: Photoelectric Cloak power use rose from 2.5/s to 10/s and its weight rose from 1 to 3 in Update 1.26.0. Recheck live values before committing a high-cost kit.</p>
      </section>
      <section class="section" id="sources"><div class="section-heading"><h2>Official Sources</h2><p>Primary sources for core and newly introduced gadgets.</p></div>${sourceList([sources.overview, sources.rivenTides, sources.shroudedSky, sources.live39])}</section>`,
  },
];

const weaponDetails = [
  {
    slug: 'kettle',
    name: 'Kettle',
    title: 'ARC Raiders Kettle: Stats, Best Build & Loadout Guide',
    description: 'ARC Raiders Kettle guide with current official base damage and fire rate, best build skills, unlock guidance, attachments and a practical mid-range loadout.',
    lead: 'The Kettle is a deliberate semi-automatic weapon for flexible medium-range fights, with enough close-range usability that official balance changes specifically pushed it away from behaving like an SMG.',
    facts: [{ value: '8.5', label: 'Base damage' }, { value: '450 RPM', label: 'Fire-rate cap' }, { value: 'Light', label: 'Ammo' }, { value: 'Mid range', label: 'Best role' }],
    overview: `<p>The official Shrouded Sky notes describe the Kettle as a high-output weapon intended for <strong>medium range at a deliberate pace</strong>. Players had been using that versatility to force close-quarters fights, so Update 1.17.0 reduced base damage from 10 to 8.5 while preserving its high headshot incentive. Earlier, Update 1.11.0 reduced the achievable fire rate from 600 to 450 RPM to remove a macro-favored input advantage.</p><p>That makes the Kettle a flexible gun, but not a substitute for the Stitcher inside every room. Pace shots, work from cover and treat accuracy as the reason to choose it.</p>`,
    bestBuild: `<p><strong>Best build direction: balanced Mobility and Conditioning.</strong> The Kettle benefits from reliable angle changes without forcing the full commitment of a close-range rush build.</p><ul><li><strong>Nimble Climber:</strong> reach windows and elevation faster to create medium-range sight lines.</li><li><strong>Marathon Runner:</strong> spend less stamina rotating between cover.</li><li><strong>Fight Or Flight:</strong> recover stamina after taking damage so a lost trade does not trap you.</li><li><strong>Loaded Arms:</strong> reduce the encumbrance pressure of the equipped weapon.</li><li><strong>Broad Shoulders:</strong> preserve extraction value when ammunition and loot accumulate.</li></ul>`,
    unlock: `<p>The public official weapon overview confirms that weapons can be found, specialized with attachments and upgraded in the Workshop, but it does not publish a permanent Kettle recipe or universal unlock level. Loot tables, trader access and crafting paths can move with live updates. Use the current in-game <strong>Acquire and Craft</strong> view as the final unlock authority.</p>`,
    loadout: [
      { title: 'Primary', text: 'Kettle with handling or accuracy attachments that support deliberate follow-up shots.' },
      { title: 'Utility', text: 'Smoke or traversal utility to preserve the preferred medium-range gap.' },
      { title: 'Defense', text: 'A shield setup you can carry without losing the stamina needed to rotate.' },
    ],
    tactics: `<ol><li>Open from cover at medium range instead of sprinting into a Stitcher fight.</li><li>Pace inputs so dispersion settles and headshots benefit from the Kettle's retained precision incentive.</li><li>Relocate after revealing your angle; the weapon's versatility matters most when the opponent cannot pre-aim you.</li><li>Against ARC, prioritize visible weak points and conserve shots for the extraction route.</li></ol>`,
    faqs: [
      { question: 'What is the current Kettle base damage?', answer: 'The official Update 1.17.0 notes reduced Kettle base damage from 10 to <strong>8.5</strong>.', schemaAnswer: 'Official Update 1.17.0 reduced Kettle base damage from 10 to 8.5.' },
      { question: 'What is the Kettle fire rate?', answer: 'Official Update 1.11.0 reduced its maximum practical fire rate from 600 to <strong>450 RPM</strong>.', schemaAnswer: 'Official Update 1.11.0 reduced the Kettle fire-rate cap from 600 to 450 RPM.' },
      { question: 'Is Kettle better than Stitcher?', answer: 'Neither wins every situation. Kettle is the better fit for deliberate medium-range angles; <a href="/wiki/weapons/stitcher/">Stitcher</a> is purpose-built for close quarters.', schemaAnswer: 'Kettle fits deliberate medium-range fights, while Stitcher is purpose-built for close quarters.' },
    ],
    sourceItems: [sources.shroudedSky, sources.kettleRate, sources.overview, sources.live39],
  },
  {
    slug: 'stitcher',
    name: 'Stitcher',
    title: 'ARC Raiders Stitcher: Stats, Best Build & Loadout Guide',
    description: 'ARC Raiders Stitcher guide with current official damage and headshot values, best Mobility skills, unlock notes, attachments and close-range loadouts.',
    lead: 'The Stitcher is a close-quarters automatic weapon that rewards initiative and thoughtful positioning, while its faster bloom makes uncontrolled full sprays less dependable.',
    facts: [{ value: '6.5', label: 'Base damage' }, { value: '1.75x', label: 'Headshot multiplier' }, { value: 'Light', label: 'Ammo' }, { value: 'Close range', label: 'Best role' }],
    overview: `<p>Embark's Update 1.17.0 notes call the Stitcher a <strong>close-quarter weapon that rewards thoughtful positioning</strong>. Its headshot time-to-kill was too fast in ambush situations, so the patch lowered base damage from 7 to 6.5, reduced the headshot multiplier from 2.5 to 1.75 and increased per-shot dispersion by about 50 percent.</p><p>The result still favors aggressive interior play, but asks you to start the fight from the right distance and manage bloom instead of holding the trigger across an open lane.</p>`,
    bestBuild: `<p><strong>Best build direction: Mobility-first entry and exit.</strong> The Stitcher's advantage appears only after you close the gap, so movement and stamina skills create more value than passive inventory bonuses.</p><ul><li><strong>Nimble Climber:</strong> enter through less predictable windows and ledges.</li><li><strong>Marathon Runner:</strong> reduce the stamina cost of closing distance.</li><li><strong>Slip and Slide:</strong> extend low-profile movement through exposed approaches.</li><li><strong>Effortless Roll:</strong> preserve stamina during a committed push or disengage.</li><li><strong>Heroic Leap:</strong> improve the distance of a sprint dodge roll when a fight turns.</li></ul>`,
    unlock: `<p>The official site does not publish a fixed Stitcher unlock level or permanent crafting recipe. It confirms the broader loop of finding weapons Topside, adding attachments and upgrading them in the Workshop. Check the live Workshop, trader and loot interfaces for the current acquisition route.</p>`,
    loadout: [
      { title: 'Primary', text: 'Stitcher configured for controllability and fast close-range readiness.' },
      { title: 'Range cover', text: 'A deliberate medium-range secondary so open ground does not force a bad push.' },
      { title: 'Entry tool', text: 'Smoke, Lure Grenade or traversal utility to cross the final unsafe distance.' },
    ],
    tactics: `<ol><li>Use sound and cover to arrive inside close range before opening fire.</li><li>Avoid full-spray tracking beyond the intended distance; Update 1.17.0 deliberately increased bloom.</li><li>Commit only with enough stamina left for the exit, not merely enough to reach the target.</li><li>Reload behind hard cover and assume a second Raider is holding the trade angle.</li></ol>`,
    faqs: [
      { question: 'What is the current Stitcher base damage?', answer: 'Official Update 1.17.0 reduced Stitcher base damage from 7 to <strong>6.5</strong>.', schemaAnswer: 'Official Update 1.17.0 reduced Stitcher base damage from 7 to 6.5.' },
      { question: 'What is the Stitcher headshot multiplier?', answer: 'The same official patch reduced its headshot multiplier from 2.5 to <strong>1.75x</strong>.', schemaAnswer: 'The official Stitcher headshot multiplier is 1.75x after Update 1.17.0.' },
      { question: 'What skills are best for Stitcher?', answer: 'Prioritize Mobility skills such as Nimble Climber, Marathon Runner and Effortless Roll. They help create and leave close-range fights; they do not directly increase weapon damage.', schemaAnswer: 'Mobility skills such as Nimble Climber, Marathon Runner and Effortless Roll best support Stitcher positioning and stamina.' },
    ],
    sourceItems: [sources.shroudedSky, sources.update13, sources.overview, sources.live39],
  },
  {
    slug: 'venator',
    name: 'Venator',
    title: 'ARC Raiders Venator: Stats, Best Build & Loadout Guide',
    description: 'ARC Raiders Venator pistol guide with current official damage, headshot multiplier, weight, upgrade fire-rate scaling, best skills and loadout advice.',
    lead: 'The Venator is a precision pistol, not a sniper rifle: a high-performing sidearm that rewards headshots, paced accuracy and a loadout capable of carrying its corrected weight.',
    facts: [{ value: '8', label: 'Base damage' }, { value: '2x', label: 'Headshot multiplier' }, { value: 'Medium', label: 'Ammo' }, { value: '5', label: 'Weight' }],
    overview: `<p>Official Update 1.3.0 explicitly compares Venator weight with other <strong>pistols</strong>, correcting it from 2 to 5. That same update lowered the fire-rate bonus gained through upgrades to 13, 26 and 40 percent. Update 1.17.0 then reduced base damage from 9 to 8 and the headshot multiplier from 2.5 to 2 because the weapon remained one of the game's highest performers in PvP.</p><p>The Venator still rewards precision. Its identity is a high-value sidearm with strong headshot expression, not the bolt-action sniper role described by older community pages.</p>`,
    bestBuild: `<p><strong>Best build direction: Conditioning support with flexible Mobility.</strong> Weight management and the ability to reset after a precision trade matter more than trying to turn the Venator into a spray weapon.</p><ul><li><strong>Loaded Arms:</strong> directly supports the encumbrance cost of an equipped weapon.</li><li><strong>Used To The Weight:</strong> helps offset the movement pressure of a defensive setup.</li><li><strong>Fight Or Flight:</strong> restores stamina after damage during a contested angle.</li><li><strong>Marathon Runner:</strong> preserves stamina while rotating to a better precision lane.</li><li><strong>Broad Shoulders:</strong> adds inventory margin for ammunition, utility and extracted loot.</li></ul>`,
    unlock: `<p>Official Expedition material has listed a <strong>Venator Blueprint</strong> as a reward, showing that blueprint access can be tied to time-specific progression. Because event and Workshop availability can rotate, confirm the current acquisition path in game rather than relying on an old fixed unlock claim.</p>`,
    loadout: [
      { title: 'Precision slot', text: 'Venator used for paced head-level shots and fast angle punishment.' },
      { title: 'Primary', text: 'A forgiving automatic weapon that covers sustained pressure and missed precision shots.' },
      { title: 'Reset tool', text: 'Smoke, cover utility or healing to survive the gap between precision opportunities.' },
    ],
    tactics: `<ol><li>Pre-aim likely head height and let the target enter a prepared angle.</li><li>Pace shots rather than treating upgrade fire-rate bonuses as permission to empty the weapon.</li><li>Switch to the primary weapon when the fight becomes a sustained close-range trade.</li><li>Budget for weight: the official correction to 5 makes the sidearm a real loadout decision.</li></ol>`,
    faqs: [
      { question: 'Is the Venator a sniper rifle?', answer: '<strong>No.</strong> Official Update 1.3.0 identifies its class context by comparing its corrected weight with other pistols. Older community pages calling it a bolt-action sniper are outdated.', schemaAnswer: 'No. Official Update 1.3.0 compares Venator with other pistols, confirming it is a pistol rather than a bolt-action sniper rifle.' },
      { question: 'What are the current Venator damage values?', answer: 'Official Update 1.17.0 set base damage to <strong>8</strong> and the headshot multiplier to <strong>2x</strong>.', schemaAnswer: 'After official Update 1.17.0, Venator has 8 base damage and a 2x headshot multiplier.' },
      { question: 'How much does the Venator weigh?', answer: 'Official Update 1.3.0 increased and corrected Venator weight from 2 to <strong>5</strong>.', schemaAnswer: 'Official Update 1.3.0 corrected Venator weight from 2 to 5.' },
    ],
    sourceItems: [sources.update13, sources.shroudedSky, sources.fourthExpedition, sources.live39],
  },
];

function weaponDetailPage(weapon) {
  const path = `/wiki/weapons/${weapon.slug}/`;
  const faqs = weapon.faqs;
  return {
    path,
    title: weapon.title,
    description: weapon.description,
    h1: `ARC Raiders ${weapon.name} Guide`,
    eyebrow: 'Weapon guide',
    lead: weapon.lead,
    image: '/images/wiki/official-weapons.webp',
    imageAlt: `Official ARC Raiders weapons artwork for the ${weapon.name} guide`,
    crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Weapons', path: '/wiki/weapons/' }, { name: weapon.name, path }],
    schemaType: 'TechArticle',
    faqs,
    body: `
      ${factBand(weapon.facts)}
      <div class="detail-layout">
        <article class="article">
          <section id="overview"><h2>${weapon.name} Overview</h2>${weapon.overview}</section>
          <section id="damage"><h2>Damage, Fire Rate & Ammo</h2>
            <p>The numeric fields above use official balance notes for patch-sensitive damage, headshot, fire-rate or weight values. Ammo category is an in-game reference; magazine size and attachment effects should be checked on the current tooltip because the public official site does not maintain a complete static stat table.</p>
            <div class="notice">Balance reference: ${sourceLink(weapon.sourceItems[0])}. Official values can change after this guide's review date.</div>
          </section>
          <section id="best-build"><h2>Best Build & Skills</h2>${weapon.bestBuild}<div class="button-row"><a class="button" href="/">Plan these skills</a><a class="button secondary" href="/wiki/weapons/">Compare weapons</a></div></section>
          <section id="unlock"><h2>How to Unlock ${weapon.name}</h2>${weapon.unlock}</section>
          <section id="loadout"><h2>Best ${weapon.name} Loadout</h2><div class="loadout">${weapon.loadout.map((slot) => `<div><strong>${escapeHtml(slot.title)}</strong><span>${escapeHtml(slot.text)}</span></div>`).join('')}</div></section>
          <section id="tactics"><h2>How to Use ${weapon.name}</h2>${weapon.tactics}</section>
          <section id="faq"><h2>${weapon.name} FAQ</h2>${faqMarkup(faqs)}</section>
          <section id="sources"><h2>Official Sources</h2><p>Official facts are cited directly. Build and loadout sections are community recommendations derived from those roles and the site's skill data.</p>${sourceList(weapon.sourceItems)}</section>
        </article>
        <aside class="on-this-page" aria-label="On this page">
          <strong>On this page</strong><a href="#overview">Overview</a><a href="#damage">Stats</a><a href="#best-build">Best build</a><a href="#unlock">Unlock</a><a href="#loadout">Loadout</a><a href="#tactics">Tactics</a><a href="#faq">FAQ</a><a href="#sources">Sources</a>
        </aside>
      </div>`,
  };
}

const bastionFaqs = [
  { question: 'What is a Bastion in ARC Raiders?', answer: 'Bastion is an armored, ground-based ARC machine. Official sources group it among major ground threats and identify leg joints and other weak spots as valid aim targets.', schemaAnswer: 'Bastion is an armored ground-based ARC machine with targetable leg joints and weak spots.' },
  { question: 'Where should you shoot a Bastion?', answer: 'Official Update 1.26.0 references <strong>leg joints and weak spots</strong> on Bastion. Prioritize exposed components instead of relying only on center-mass splash damage.', schemaAnswer: 'Prioritize Bastion leg joints and exposed weak spots, as referenced in official Update 1.26.0.' },
  { question: 'What sound cue does Bastion have?', answer: 'Official Update 1.29.0 added a distinct sound when Bastion and Bombardier switch targets. Use that cue to decide whether to keep firing or move to cover.', schemaAnswer: 'Bastion has a distinct sound when it switches targets, added in official Update 1.29.0.' },
];

const bastionPage = {
  path: '/wiki/enemies/bastion/',
  title: 'ARC Raiders Bastion Guide: Weak Spots & How to Beat It',
  description: 'Learn how to fight the ARC Raiders Bastion, including official weak-point and audio-cue notes, best weapon approach, positioning, squad roles and mistakes.',
  h1: 'ARC Raiders Bastion Guide',
  eyebrow: 'Heavy ARC field guide',
  lead: 'Bastion is an armored ground threat that punishes static exposure. Break the encounter into cover timing, target-switch audio and deliberate shots at leg joints or exposed weak points.',
  image: '/images/wiki/official-arc-queen.webp',
  imageAlt: 'Large ARC machine threat shown in official ARC Raiders artwork',
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }, { name: 'Enemies', path: '/wiki/enemies/' }, { name: 'Bastion', path: '/wiki/enemies/bastion/' }],
  schemaType: 'TechArticle',
  faqs: bastionFaqs,
  body: `
    ${factBand([{ value: 'Ground ARC', label: 'Type' }, { value: 'Leg joints', label: 'Aim priority' }, { value: 'Hard cover', label: 'Positioning' }, { value: 'Audio cue', label: 'Target switch' }])}
    <div class="detail-layout">
      <article class="article">
        <section id="overview"><h2>Bastion Overview</h2><p>The official ARC Raiders overview lists Bastion among the Rust Belt's ground-based ARC machines. Later patch notes identify <strong>leg joints and weak spots</strong> as aim-assist targets and add a distinct audio cue when Bastion changes targets.</p><p>Those facts define the encounter: avoid a flat damage race, use hard cover and attack vulnerable components during the machine's commitment window.</p></section>
        <section id="weak-spots"><h2>Bastion Weak Spots</h2><p>Prioritize visible <strong>leg joints and exposed weak spots</strong>. Official Update 1.3.0 also notes that explosive damage against larger enemies such as Bastion was rebalanced to deal less damage in typical cases. Precision on a chosen component is therefore a more dependable plan than assuming splash damage will solve the armor.</p><div class="notice">Do not stand in the open to confirm damage. Fire during a safe angle, read the target-switch cue, then reset behind hard cover.</div></section>
        <section id="strategy"><h2>How to Beat Bastion</h2><ol><li><strong>Choose hard cover:</strong> use a structure that blocks the attack, not a thin visual obstruction.</li><li><strong>Create two angles:</strong> squads should separate enough that a target switch gives the other angle a safe damage window.</li><li><strong>Listen for the switch:</strong> Update 1.29.0 added a distinct Bastion target-change sound.</li><li><strong>Focus a component:</strong> repeated precision on a leg joint is more useful than distributing damage across armor.</li><li><strong>Preserve an exit:</strong> other Raiders and ARC can enter the fight while your ammunition and attention are committed.</li></ol></section>
        <section id="loadout"><h2>Best Bastion Loadout</h2><div class="loadout"><div><strong>Precision weapon</strong><span>A controllable weapon that can repeatedly hit a selected joint from cover.</span></div><div><strong>ARC utility</strong><span>Area control or distraction that buys time without forcing open exposure.</span></div><div><strong>Ammo reserve</strong><span>Enough depth for an armored objective plus the route to extraction.</span></div></div><p>For skills, <strong>Marathon Runner</strong> and <strong>Fight Or Flight</strong> help reset between angles, while <strong>Loaded Arms</strong> and <strong>Broad Shoulders</strong> support a heavier anti-ARC kit.</p></section>
        <section id="mistakes"><h2>Common Bastion Mistakes</h2><ul><li>Trading center-mass damage from open ground.</li><li>Using every explosive without checking whether it is damaging the intended component.</li><li>Grouping so tightly that a target switch does not create a second angle.</li><li>Starting the encounter without budgeting ammunition for extraction.</li><li>Ignoring nearby Raiders while focused on the machine.</li></ul></section>
        <section id="faq"><h2>Bastion FAQ</h2>${faqMarkup(bastionFaqs)}</section>
        <section id="sources"><h2>Official Sources</h2>${sourceList([sources.overview, sources.rivenTides, sources.update13, { name: 'Patch Notes 1.29.0', url: 'https://arcraiders.com/news/patch-notes-1-29-0' }])}</section>
      </article>
      <aside class="on-this-page" aria-label="On this page"><strong>On this page</strong><a href="#overview">Overview</a><a href="#weak-spots">Weak spots</a><a href="#strategy">Strategy</a><a href="#loadout">Loadout</a><a href="#mistakes">Mistakes</a><a href="#faq">FAQ</a><a href="#sources">Sources</a></aside>
    </div>`,
};

const rootPage = {
  path: '/wiki/',
  title: 'ARC Raiders Wiki: Weapons, Items, Maps & Enemies',
  description: 'Explore the ARC Raiders wiki for weapons, items, resources, enemies, maps, armor, gadgets, official source notes and practical community guides.',
  h1: 'ARC Raiders Wiki',
  eyebrow: 'Field database',
  lead: 'A source-led field guide to the Rust Belt: weapons, machines, maps, resources and loadout systems organized for fast decisions before you go Topside.',
  image: '/images/wiki/official-environments.webp',
  imageAlt: 'Rust Belt environments from official ARC Raiders artwork',
  crumbs: [{ name: 'Home', path: '/' }, { name: 'Wiki', path: '/wiki/' }],
  schemaType: 'CollectionPage',
  listItems: categories.map((category) => ({ name: category.name, href: `/wiki/${category.slug}/` })),
  body: `
    ${factBand([{ value: '7', label: 'Wiki sections' }, { value: '4', label: 'Detailed entries' }, { value: 'Primary', label: 'Official sources' }, { value: '1.39.0', label: 'Notes reviewed through' }])}
    <section class="section" id="categories"><div class="section-heading"><h2>Explore the Database</h2><p>Hub-and-spoke navigation keeps every detailed guide reachable and gives each search intent one clear home.</p></div>${categoryCards()}</section>
    <section class="section" id="start-here">
      <div class="section-heading"><h2>Start With the Fight</h2><p>The fastest path into the wiki follows the decision most Raiders are already making.</p></div>
      ${cards([
        { name: 'Choose a Weapon', href: '/wiki/weapons/', kicker: 'Build planning', description: 'Compare current official balance values and pick a role before filling the rest of the loadout.' },
        { name: 'Identify the ARC', href: '/wiki/enemies/', kicker: 'Encounter prep', description: 'Read detection, attack and weak-point cues before committing ammunition to a machine.' },
        { name: 'Plan the Route', href: '/wiki/maps/', kicker: 'Extraction prep', description: 'Match sight lines, interiors and live map conditions to the kit you can afford to lose.' },
      ], 'Start here')}
    </section>
    <section class="section" id="methodology">
      <div class="section-heading"><h2>How This Wiki Handles Live Data</h2><p>ARC Raiders changes often, so evidence and recommendations are deliberately separated.</p></div>
      <div class="article"><p><strong>Official facts</strong> link directly to arcraiders.com patch notes or game overviews. <strong>Community recommendations</strong> explain how those facts interact with the skill builder, route planning and loadout risk. When the official site does not publish a stable value, the page tells you to verify the current in-game tooltip instead of inventing precision.</p><p>Balance-sensitive entries show a review date and their controlling source. This prevents older weapon articles from silently presenting pre-patch roles as current facts.</p></div>
    </section>
    <section class="section" id="sources"><div class="section-heading"><h2>Official Baseline</h2><p>These official pages anchor the initial database.</p></div>${sourceList([sources.overview, sources.shroudedSky, sources.rivenTides, sources.live39])}</section>`,
};

const pages = [
  rootPage,
  ...categoryPages,
  ...weaponDetails.map(weaponDetailPage),
  bastionPage,
];

let changedPages = 0;

for (const page of pages) {
  const relative = page.path.replace(/^\/wiki\/?/, '').replace(/\/$/, '');
  const targetDir = relative ? path.join(WIKI_DIR, relative) : WIKI_DIR;
  fs.mkdirSync(targetDir, { recursive: true });
  if (writeIfChanged(path.join(targetDir, 'index.html'), renderPage(page))) changedPages += 1;
}

const manifest = pages.map((page) => ({ path: page.path, title: page.title, description: page.description }));
writeIfChanged(path.join(WIKI_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${pages.length} ARC Raiders wiki pages (${changedPages} changed).`);
