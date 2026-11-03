import React from 'react';
import { ArrowRight, ArrowUpRight, Crosshair } from 'lucide-react';
import './home.css';
import StoreCatalog from './StoreCatalog';
import StoreOffer from './StoreOffer';
import SkillReference from './SkillReference';

const media = 'https://evgenii-barov.github.io/arc-store-chaoseon-embed';
const builds = [
  { title: 'Find your solo build', tag: 'SOLO / SURVIVAL', image: '/images/wiki/official-environments.webp', text: 'Plan your route, manage stamina and make the extraction.', href: '/blog/arc-raiders-skill-tree-best-build.html' },
  { title: 'Build for the fight', tag: 'PVP / COMBAT', image: '/images/live-update-2-3-0/souls-01.jpg', text: 'Explore skill choices for player encounters and aggressive runs.', href: '/blog/arc-raiders-pvp-skill-tree-build.html' },
  { title: 'Explore more playstyles', tag: 'SOLO / SQUAD', image: '/images/blog-arc-news1.webp', text: 'Compare build guides before committing your skill points.', href: '/blog/arc-raiders-20-best-skill-tree-builds-for-pvpve-solo--squad.html' },
];
const products = [
  { name: 'Level V weapons', image: 'weapons-v.webp', path: 'weapons-level-5', text: 'Choose your weapon and available attachments.' },
  { name: 'Raider Loadouts', image: 'raider-loadout.webp', path: 'raider-loadout', text: 'Put together weapons, shields and supplies.' },
];

export default function HomePage({ store }: { store: boolean }) {
  return <div className="arc-home">
    <a className="skip-home" href="#main">Skip to content</a>
    <header className="home-header"><a className="home-brand" href="/"><Crosshair size={28} /><span>ARC<span className="brand-light">SKILLER</span><small>RAIDERS FIELD GUIDE</small></span></a><nav aria-label="Main navigation"><a href="/planner/">Skill Planner</a><a href="/#builds">Builds</a><a href="/#guides">Guides</a><a className={store ? 'active' : ''} href="/store/">Shop <ArrowUpRight size={14} /></a></nav></header>
    <main id="main">
      {store ? <>
        <section className="store-intro home-wrap"><div className="section-kicker">WEAPONS & EQUIPMENT</div><h1>Your next loadout.</h1><p>Choose your gear. Review current prices and available options before checkout.</p></section>
        <StoreCatalog />
      </> : <>
        <section className="home-hero"><img className="hero-photo" src="/images/wiki/official-environments.webp" alt="ARC Raiders game landscape" fetchPriority="high"/><div className="hero-shade"/><div className="home-wrap hero-content"><div className="section-kicker">PLAN THE BUILD. MAKE THE EXTRACTION.</div><h1>ARC Raiders<br/>Skill Tree Builder</h1><p>Your next run starts here. Plan your skills,<br className="desktop-break"/> find a build and choose the gear to match.</p><div className="hero-actions"><a className="home-button" href="/planner/">Open Skill Planner <ArrowRight size={18}/></a><a className="home-text-link" href="#builds">Explore builds <ArrowRight size={17}/></a></div><a className="tree-preview" href="/planner/"><img src="/images/official-frozen-trail-skill-tree.jpg" alt="Frozen Trail skill tree preview"/><span>FROZEN TRAIL SKILL TREE <ArrowUpRight size={18}/></span></a></div></section>
        <div className="home-strip home-wrap"><span>Conditioning</span><span>Mobility</span><span>Survival</span><a href="/planner/">76-point base · up to 91 points <ArrowRight size={16}/></a></div>
        <section className="home-wrap home-section" id="builds"><div className="home-section-head"><div><div className="section-kicker">01 / BUILD GUIDES</div><h2>Choose your next run.</h2></div><a href="/blog/arc-raiders-skill-tree-builds.html">All build guides <ArrowRight size={17}/></a></div><div className="build-grid">{builds.map(b => <a className="build-tile" href={b.href} key={b.title}><div className="tile-image"><img src={b.image} alt="" loading="lazy"/></div><div className="tile-body"><span className="section-kicker">{b.tag}</span><h3>{b.title} <ArrowUpRight size={20}/></h3><p>{b.text}</p><span className="tile-cta">Read build guide <ArrowRight size={16}/></span></div></a>)}</div></section>
        <section className="gear-section"><div className="home-wrap home-section"><div className="home-section-head"><div><div className="section-kicker">02 / WEAPONS & LOADOUTS</div><h2>Bring the right gear.</h2></div><a href="/store/">Visit shop <ArrowUpRight size={17}/></a></div><div className="gear-grid">{products.map(p => <a className="gear-tile" key={p.name} href={`/go/${p.path}`} target="_blank" rel="sponsored noopener noreferrer"><img src={`${media}/assets/${p.image}`} alt={p.name} loading="lazy"/><div><h3>{p.name} <ArrowUpRight size={20}/></h3><p>{p.text}</p><span className="tile-cta">View options & prices <ArrowRight size={16}/></span></div></a>)}</div><div className="gear-extras"><a href="/go/blueprints" target="_blank" rel="sponsored noopener noreferrer">Blueprints <ArrowUpRight size={17}/></a><a href="/go/items-and-resources" target="_blank" rel="sponsored noopener noreferrer">Items & resources <ArrowUpRight size={17}/></a></div><StoreOffer /><a className="partner-banner home-button" href="/go/store" target="_blank" rel="sponsored noopener noreferrer">Explore ARC Store <ArrowUpRight size={18}/></a><p className="affiliate-note">Purchases are fulfilled by ARC Store. We may earn a commission.</p></div></section>
        <section className="home-wrap home-section" id="guides"><div className="home-section-head"><div><div className="section-kicker">03 / FIELD NOTES</div><h2>Go in prepared.</h2></div><a href="/blog.html">All guides <ArrowRight size={17}/></a></div><div className="guide-layout"><a className="guide-feature" href="/blog/arc-raiders-skill-tree-builder-guide.html"><img src="/images/official-frozen-trail-skill-tree.jpg" alt="ARC Raiders skill tree" loading="lazy"/><h3>Get more from your skill tree <ArrowUpRight size={20}/></h3><p>Start with the skill planner guide.</p></a><div className="guide-list">{[['01','Skill tree mechanics','/blog/skill-tree-mechanics-deep-dive.html'],['02','Beginner mistakes to avoid','/blog/arc-raiders-beginner-mistakes.html'],['03','PvP combat tactics','/blog/arc-raiders-pvp-combat-tactics.html'],['04','Weapons reference','/wiki/weapons/']].map(([n,t,h]) => <a href={h} key={n}><span>{n}</span><h3>{t}</h3><ArrowUpRight size={20}/></a>)}</div></div></section>
        <SkillReference />
        <section className="home-wrap home-faq"><h2>Before you head out.</h2><details><summary>How many skill points can I use?</summary><p>The planner supports a 76-point base build and Expedition budgets up to 91 points.</p></details><details><summary>Can I share my skill build?</summary><p>Open the planner, allocate your skills and use its share control to copy your build link.</p></details><details><summary>Who handles shop orders?</summary><p>ARC Store handles checkout, fulfillment and support. Our shop links are partner links.</p></details></section>
      </>}
    </main><footer className="home-footer home-wrap"><a href="/">ARCSKILLER</a><div><a href="/planner/">Planner</a><a href="/wiki/">Wiki</a><a href="/blog.html">Guides</a><a href="/store/">Shop</a></div><p>Independent fan resource. Not affiliated with Embark Studios. Game imagery belongs to its respective owners. Store links may earn us a commission.</p></footer>
  </div>;
}
