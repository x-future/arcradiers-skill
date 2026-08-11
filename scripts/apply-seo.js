import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE_ORIGIN = 'https://arcraiderskill.com';

const titles = {
  'public/ai-see.html': 'ARC Raiders Skill Tree Data for AI Agents | AI See',
  'public/blog.html': 'ARC Raiders Guides, Builds & Updates | Blog',
  'public/faq.html': 'ARC Raiders Skill Tree FAQ | Points, Builds & Respec',
  'public/privacy-policy.html': 'Privacy Policy | ARC Raiders Skill Tree Builder',
  'public/screenshots.html': 'ARC Raiders Skill Tree Screenshots & Build Gallery',
  'public/wiki.html': 'ARC Raiders Skill Tree Wiki | Builds & Mechanics',
  'public/blog/arc-raiders-1-7-2-update.html': 'ARC Raiders Update 1.7.2 | Hidden Bunker Changes',
  'public/blog/arc-raiders-anvil-guide.html': 'ARC Raiders Anvil Rifle Guide | Stats & Best Build',
  'public/blog/arc-raiders-beginner-guide-2026.html': 'ARC Raiders Beginner Guide 2026 | Complete Starter Tips',
  'public/blog/arc-raiders-beginner-mistakes.html': '10 ARC Raiders Beginner Mistakes and How to Fix Them',
  'public/blog/arc-raiders-bobcat-guide.html': 'ARC Raiders Bobcat Guide | Stats & Best End-Game Build',
  'public/blog/arc-raiders-character-reset-guide.html': 'ARC Raiders Character Reset Guide | Respec Explained',
  'public/blog/arc-raiders-extraction-loop-guide.html': 'ARC Raiders Extraction Loop Guide | Extract More Often',
  'public/blog/arc-raiders-ferro-guide.html': 'ARC Raiders Ferro Guide | Stats, Best Build & Tips',
  'public/blog/arc-raiders-high-risk-zones-guide.html': 'ARC Raiders High-Risk Zones Guide | Loot & Survival',
  'public/blog/arc-raiders-kettle-guide.html': 'ARC Raiders Kettle Guide | Stats, Loadout & Best Build',
  'public/blog/arc-raiders-latest-update.html': 'ARC Raiders Latest Update 2026 | New Content Guide',
  'public/blog/arc-raiders-osprey-guide.html': 'ARC Raiders Osprey Sniper Guide | Stats & Best Build',
  'public/blog/arc-raiders-pvp-combat-tactics.html': 'ARC Raiders PvP Combat Tactics | Win More Fights',
  'public/blog/arc-raiders-pvp-skill-tree-build.html': 'ARC Raiders PvP Skill Tree Build | Flanker Guide',
  'public/blog/arc-raiders-raider-den-guide.html': 'ARC Raiders Raider Den Guide | Base Upgrades & Features',
  'public/blog/arc-raiders-rattler-guide.html': 'ARC Raiders Rattler Pistol Guide | Best Secondary?',
  'public/blog/arc-raiders-renegade-vs-venator.html': 'ARC Raiders Renegade vs Venator | Sniper Comparison',
  'public/blog/arc-raiders-skill-tree-best-build.html': 'ARC Raiders Skill Tree Best Build | 75-Point Guide',
  'public/blog/arc-raiders-skill-tree-builder-guide.html': 'ARC Raiders Skill Tree Builder | Plan & Share Builds',
  'public/blog/arc-raiders-skill-tree-builds.html': 'ARC Raiders Skill Tree Builds | Best Playstyles',
  'public/blog/arc-raiders-sound-design-guide.html': 'ARC Raiders Sound Guide | Hear and Locate Enemies',
  'public/blog/arc-raiders-stitcher-guide.html': 'ARC Raiders Stitcher Guide | CQC Stats & Best Build',
  'public/blog/arc-raiders-survival-tips.html': '10 ARC Raiders Survival Tips for Safer Extractions',
  'public/blog/arc-raiders-tempest-guide.html': 'ARC Raiders Tempest Guide | Stats, Build & Tactics',
  'public/blog/arc-raiders-venator-guide.html': 'ARC Raiders Venator Sniper Guide | Stats & Best Build',
  'public/blog/beginners-complete-guide.html': 'ARC Raiders Skill Tree Beginner Guide | 75-Point Basics',
  'public/blog/mobility-mastery-guide.html': 'ARC Raiders Mobility Guide | Speed, Evasion & Positioning',
  'public/blog/north-line-update.html': 'ARC Raiders North Line Update | Stella Montis Guide',
  'public/blog/skill-tree-mechanics-deep-dive.html': 'ARC Raiders Skill Tree Mechanics | Stats & Math Guide',
  'public/blog/survival-branch-complete-guide.html': 'ARC Raiders Survival Branch Guide | Looting & Crafting',
  'public/blog/tfue-arc-raiders-skill-tree.html': 'Tfue ARC Raiders Skill Tree | Build Analysis',
  'public/blog/top-5-meta-builds.html': 'Top 5 ARC Raiders Skill Tree Builds | Current Meta',
  'public/blog/ultimate-conditioning-guide.html': 'ARC Raiders Conditioning Guide | Stamina & Tank Builds',
};

const shortDescriptions = {
  'public/blog.html': 'Browse ARC Raiders guides covering skill tree builds, weapons, extraction tactics, beginner tips, game updates, and practical strategies for every playstyle.',
  'public/faq.html': 'Find answers about ARC Raiders skill points, Conditioning, Mobility and Survival branches, build planning, prerequisites, sharing builds, and respec options.',
  'public/privacy-policy.html': 'Read how ARC Raiders Skill Tree Builder handles analytics, third-party content, cookies, security, and privacy choices when you use the community website.',
  'public/screenshots.html': 'Explore ARC Raiders skill tree screenshots and example builds for Conditioning, Mobility, Survival, solo play, team support, and PvP-focused playstyles.',
  'public/blog/tfue-arc-raiders-skill-tree.html': 'Review the Tfue ARC Raiders skill tree build, understand its Mobility and combat priorities, and adapt the allocation to your own point budget and playstyle.',
};

const linkFixes = {
  '/wiki.html': '/wiki/',
  '/blog/arc-raiders-kettle-guide.html': '/wiki/weapons/kettle/',
  '/blog/arc-raiders-stitcher-guide.html': '/wiki/weapons/stitcher/',
  '/blog/arc-raiders-venator-guide.html': '/wiki/weapons/venator/',
  '/blog/arc-raiders-renegade-vs-venator.html': '/wiki/weapons/',
  '/blog/arc-raiders-rattler-guide.html': '/wiki/weapons/',
  '/blog/survival-branch-guide.html': '/blog/survival-branch-complete-guide.html',
  '/blog/mobility-guide.html': '/blog/mobility-mastery-guide.html',
  '/blog/survival-guide.html': '/blog/survival-branch-complete-guide.html',
};

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateDescription(value) {
  if (value.length <= 165) return value;
  const shortened = value.slice(0, 157).replace(/\s+\S*$/, '').replace(/[,:;.!?\s]+$/, '');
  return `${shortened}.`;
}

for (const [relativePath, title] of Object.entries(titles)) {
  const filePath = path.join(ROOT_DIR, relativePath);
  let html = fs.readFileSync(filePath, 'utf8');
  const originalHtml = html;
  const pathname = `/${relativePath.replace(/^public\//, '')}`;
  const canonical = `${SITE_ORIGIN}${pathname}`;
  const escapedTitle = escapeHtml(title);

  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);

  if (!/<link\s+[^>]*rel=["']canonical["']/i.test(html)) {
    html = html.replace(
      /(<meta\s+[^>]*name=["']description["'][^>]*>)/i,
      `$1\n  <link rel="canonical" href="${canonical}">`,
    );
  }

  const descriptionMatch = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=(['"])([\s\S]*?)\1[^>]*>/i);
  if (descriptionMatch) {
    const description = shortDescriptions[relativePath] || truncateDescription(descriptionMatch[2]);
    html = html.replace(
      descriptionMatch[0],
      descriptionMatch[0].replace(descriptionMatch[2], escapeHtml(description)),
    );
  }

  if (relativePath.startsWith('public/blog/')) {
    const h1 = escapeHtml(title.split(' | ')[0]);
    let h1Count = 0;
    html = html.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (_match, attributes, content) => {
      h1Count += 1;
      return h1Count === 1 ? `<h1${attributes}>${h1}</h1>` : `<h2${attributes}>${content}</h2>`;
    });
    html = html.replace(`<h2>${h1}</h2>`, '');
  }

  for (const [broken, fixed] of Object.entries(linkFixes)) {
    html = html.replaceAll(`href="${broken}"`, `href="${fixed}"`);
  }

  if (html !== originalHtml) fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`Applied SEO metadata to ${Object.keys(titles).length} public pages.`);
