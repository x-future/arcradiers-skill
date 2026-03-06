
import React from 'react';
import { Target, Zap, Box, Shield, Users, Crosshair, HelpCircle, BookOpen, MessageSquare, Database, Play, Star, TrendingUp, Map, Sword } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Shared background effects                                           */
/* ------------------------------------------------------------------ */
const GridBg = ({ className = '' }: { className?: string }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `
        linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}
  />
);

const Scanlines = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.03]"
    style={{
      backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)',
    }}
  />
);

/* ------------------------------------------------------------------ */
/*  Feature card data                                                   */
/* ------------------------------------------------------------------ */
const featureCards = [
  {
    icon: <Target size={28} />,
    badge: 'NEW',
    badgeColor: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
    accentColor: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-cyan-500/10',
    titleColor: 'text-cyan-400',
    title: 'Interactive Skill Planner',
    desc: 'Plan your full 75-point build before spending a single point in-game. Drag, zoom, and share instantly.',
  },
  {
    icon: <Zap size={28} />,
    badge: 'POPULAR',
    badgeColor: 'text-orange-400 border-orange-400/40 bg-orange-400/10',
    accentColor: 'border-purple-500/30 hover:border-purple-400/60 shadow-purple-500/10',
    titleColor: 'text-purple-400',
    title: 'Best Early Builds',
    desc: 'Curated high-performance builds for every playstyle — solo looter, team tank, or aggressive flanker.',
  },
  {
    icon: <Box size={28} />,
    badge: 'NEW',
    badgeColor: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10',
    accentColor: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-cyan-500/10',
    titleColor: 'text-cyan-400',
    title: 'Branch Deep-Dives',
    desc: 'Full breakdowns of Conditioning, Mobility, and Survival trees — every node, every effect explained.',
  },
  {
    icon: <TrendingUp size={28} />,
    badge: 'COMING SOON',
    badgeColor: 'text-zinc-400 border-zinc-600/40 bg-zinc-800/40',
    accentColor: 'border-zinc-700/30 hover:border-zinc-500/40 shadow-zinc-700/5',
    titleColor: 'text-zinc-300',
    title: 'Build Sharing',
    desc: 'Save and share permalinks for your exact skill allocation with teammates and the community.',
  },
  {
    icon: <Map size={28} />,
    badge: 'COMING SOON',
    badgeColor: 'text-zinc-400 border-zinc-600/40 bg-zinc-800/40',
    accentColor: 'border-zinc-700/30 hover:border-zinc-500/40 shadow-zinc-700/5',
    titleColor: 'text-zinc-300',
    title: 'Zone Strategy Map',
    desc: 'Interactive map overlay showing best skill synergies per extraction zone and raid type.',
  },
  {
    icon: <Sword size={28} />,
    badge: 'COMING SOON',
    badgeColor: 'text-zinc-400 border-zinc-600/40 bg-zinc-800/40',
    accentColor: 'border-zinc-700/30 hover:border-zinc-500/40 shadow-zinc-700/5',
    titleColor: 'text-zinc-300',
    title: 'Meta Tracker',
    desc: 'Track the current community meta builds and discover which skill paths top players are running.',
  },
];

/* ------------------------------------------------------------------ */
/*  Quick tool grid data                                                */
/* ------------------------------------------------------------------ */
const quickTools = [
  { label: 'Skill Planner', href: '#', color: 'text-cyan-400' },
  { label: 'Build Guides', href: '#scenarios', color: 'text-purple-400' },
  { label: 'Skill Branches', href: '#skill-trees', color: 'text-cyan-400' },
  { label: 'Video Guides', href: '#videos', color: 'text-orange-400' },
  { label: 'FAQ', href: '#faq', color: 'text-purple-400' },
  { label: 'Wiki', href: '/wiki.html', color: 'text-cyan-400' },
  { label: 'Gallery', href: '/screenshots.html', color: 'text-orange-400' },
  { label: 'Blog', href: '/blog.html', color: 'text-purple-400' },
];

/* ================================================================== */
/*  Main component                                                      */
/* ================================================================== */
const LandingSections = () => {
  return (
    <div className="relative text-zinc-300 overflow-hidden" style={{ background: '#07080d' }}>

      {/* ============================================================ */}
      {/*  STATS BANNER                                                  */}
      {/* ============================================================ */}
      <section className="relative border-b border-zinc-800/60 overflow-hidden">
        <GridBg />
        <Scanlines />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(0,212,255,0.06) 0%, transparent 50%, rgba(147,51,234,0.06) 100%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '45+', label: 'Skill Nodes', color: 'text-cyan-400' },
            { value: '75', label: 'Max Points', color: 'text-purple-400' },
            { value: '3', label: 'Skill Branches', color: 'text-orange-400' },
            { value: '∞', label: 'Build Combos', color: 'text-cyan-400' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold font-display tracking-tighter ${stat.color}`}
                style={{ textShadow: `0 0 20px currentColor` }}>
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURE CARDS                                                */}
      {/* ============================================================ */}
      <section id="features" className="relative py-24 px-6 overflow-hidden">
        <GridBg />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs uppercase tracking-[0.2em] font-display mb-6">
              <Star size={10} /> ARC Raiders Tools
            </div>
            <h2
              className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight mb-4"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Master the ARC Raiders Skill Tree
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              The <strong className="text-zinc-200">ARC Skill Tree</strong> offers a predictable growth system — define your <strong className="text-zinc-200">Skill</strong> style with strategic <strong className="text-zinc-200">ARC Raiders</strong> choices.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map(card => (
              <div
                key={card.title}
                className={`relative group rounded-xl border bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-6 shadow-xl backdrop-blur transition-all duration-300 ${card.accentColor}`}
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
              >
                {/* Scanline overlay on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 4px)',
                  }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div className={`${card.titleColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    {card.icon}
                  </div>
                  <span className={`text-[10px] font-display uppercase tracking-[0.15em] px-2 py-0.5 rounded border font-bold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <h3 className={`text-lg font-display font-bold mb-2 group-hover:${card.titleColor} transition-colors ${card.titleColor}`}>
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-px rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity`}
                  style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  QUICK ACCESS TOOLS                                           */}
      {/* ============================================================ */}
      <section className="relative py-12 px-6 border-t border-b border-zinc-800/50 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}
        />
        <GridBg className="opacity-50" />

        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 text-center mb-6 font-display">Quick Access</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {quickTools.map(tool => (
              <a
                key={tool.label}
                href={tool.href}
                className={`group flex items-center justify-center text-center px-3 py-3 rounded-lg border border-zinc-800/60 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-zinc-600/60 transition-all text-xs font-display font-bold uppercase tracking-wide ${tool.color} hover:scale-105`}
              >
                {tool.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PROBLEMS / HOOK (original content, restyled)                */}
      {/* ============================================================ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <GridBg />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(147,51,234,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Beyond Random Gear',
              body: <>Unlike other games, your power in <strong className="text-zinc-200">ARC Raiders</strong> isn't just about loot drops. The <strong className="text-zinc-200">Skill Tree</strong> puts progression in your hands.</>,
              accent: 'border-cyan-500/20 hover:border-cyan-400/50',
              dot: 'bg-cyan-400',
            },
            {
              title: 'ARC Raiders Growth',
              body: <>Don't just rely on weapons. The <strong className="text-zinc-200">ARC Raiders Skill Tree</strong> allows for deep character growth and personal expression through specific <strong className="text-zinc-200">Skill</strong> nodes.</>,
              accent: 'border-purple-500/20 hover:border-purple-400/50',
              dot: 'bg-purple-400',
            },
            {
              title: 'Strategic Skill Builds',
              body: <>Avoid homogenized gameplay. Use the <strong className="text-zinc-200">ARC Raiders Skill Tree</strong> to create diverse builds that offer true strategic variety in every raid.</>,
              accent: 'border-orange-500/20 hover:border-orange-400/50',
              dot: 'bg-orange-400',
            },
          ].map(card => (
            <div
              key={card.title}
              className={`relative rounded-xl border bg-zinc-900/50 p-7 transition-all duration-300 backdrop-blur ${card.accent}`}
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
            >
              <div className={`w-2 h-2 rounded-full ${card.dot} mb-4 shadow-lg`} style={{ boxShadow: `0 0 8px currentColor` }} />
              <h3 className="text-lg font-display font-bold text-white mb-3">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT IS SKILL TREE                                           */}
      {/* ============================================================ */}
      <section id="features-detail" className="relative py-20 px-6 overflow-hidden border-t border-zinc-800/40">
        <GridBg className="opacity-60" />
        <Scanlines />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3 uppercase tracking-tight">
              What is the ARC Raiders Skill Tree?
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              A revolutionary <strong className="text-zinc-200">ARC Raiders</strong> progression system, letting players define strength via the <strong className="text-zinc-200">Skill Tree</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target size={30} />,
                color: 'text-cyan-400',
                shadowColor: 'rgba(0,212,255,0.15)',
                title: 'ARC Raiders Skill Points',
                body: <>Earn one <strong className="text-zinc-200">ARC Raiders Skill</strong> point per level. Maximize your 75 points to complete your <strong className="text-zinc-200">Skill Tree</strong> build.</>,
              },
              {
                icon: <Box size={30} />,
                color: 'text-purple-400',
                shadowColor: 'rgba(147,51,234,0.15)',
                title: 'Best Skill Configurations',
                body: <>Conditioning, Mobility, and Survival. Build your optimal <strong className="text-zinc-200">ARC Raiders Skill Tree</strong> configuration.</>,
              },
              {
                icon: <Zap size={30} />,
                color: 'text-orange-400',
                shadowColor: 'rgba(249,115,22,0.15)',
                title: '45 Skill Tree Nodes',
                body: <>~15 <strong className="text-zinc-200">Skill</strong> nodes per branch. Master prerequisites in the <strong className="text-zinc-200">ARC Raiders Skill Tree</strong> for deep customization.</>,
              },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center text-center p-6 rounded-xl border border-zinc-800/40 bg-zinc-900/30 hover:border-zinc-700/60 transition-all">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${item.color}`}
                  style={{ background: item.shadowColor, boxShadow: `0 0 30px ${item.shadowColor}` }}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SKILL TREE BRANCHES                                          */}
      {/* ============================================================ */}
      <section id="skill-trees" className="relative py-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,5,15,0.6) 100%)' }}
        />
        <GridBg />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-700/50 bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-[0.2em] font-display mb-5">
              Skill Branches
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight">
              ARC Raiders Skill Tree Branches
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conditioning */}
            <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 bg-zinc-900/60 hover:border-cyan-400/40 transition-all duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70" />
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield size={120} className="text-cyan-400" />
              </div>
              <div className="p-7">
                <span className="text-[10px] font-display uppercase tracking-[0.2em] text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 rounded mb-4 inline-block">Branch</span>
                <h3 className="text-2xl font-display font-bold text-cyan-400 mb-2">Conditioning</h3>
                <p className="text-sm text-zinc-300 font-bold mb-1">Focus: <strong>ARC Raiders</strong> Survival & Stamina</p>
                <p className="text-xs text-zinc-500 mb-5">For: Heavy Raiders, tanks, endurance builds</p>
                <ul className="space-y-2.5 text-sm text-zinc-400">
                  <li className="flex gap-2 items-center"><span className="text-cyan-400 text-lg leading-none">▸</span> Stamina recovery <strong className="text-zinc-300">Skill</strong></li>
                  <li className="flex gap-2 items-center"><span className="text-cyan-400 text-lg leading-none">▸</span> Carry capacity enhancement</li>
                  <li className="flex gap-2 items-center"><span className="text-cyan-400 text-lg leading-none">▸</span> Shield penalty reduction</li>
                </ul>
              </div>
            </div>

            {/* Mobility */}
            <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-zinc-900/60 hover:border-purple-400/40 transition-all duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70" />
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={120} className="text-purple-400" />
              </div>
              <div className="p-7">
                <span className="text-[10px] font-display uppercase tracking-[0.2em] text-purple-400 border border-purple-400/30 bg-purple-400/10 px-2 py-0.5 rounded mb-4 inline-block">Branch</span>
                <h3 className="text-2xl font-display font-bold text-purple-400 mb-2">Mobility</h3>
                <p className="text-sm text-zinc-300 font-bold mb-1">Focus: Speed & <strong>ARC Raiders</strong> Movement</p>
                <p className="text-xs text-zinc-500 mb-5">For: Assault Raiders, PvP experts</p>
                <ul className="space-y-2.5 text-sm text-zinc-400">
                  <li className="flex gap-2 items-center"><span className="text-purple-400 text-lg leading-none">▸</span> Marathon Runner (stamina <strong className="text-zinc-300">Skill</strong>)</li>
                  <li className="flex gap-2 items-center"><span className="text-purple-400 text-lg leading-none">▸</span> Youthful Lungs (max stamina)</li>
                  <li className="flex gap-2 items-center"><span className="text-purple-400 text-lg leading-none">▸</span> Effortless Roll (dodge <strong className="text-zinc-300">Skill</strong>)</li>
                </ul>
              </div>
            </div>

            {/* Survival */}
            <div className="relative rounded-xl overflow-hidden border border-orange-500/20 bg-zinc-900/60 hover:border-orange-400/40 transition-all duration-300 group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-70" />
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Box size={120} className="text-orange-400" />
              </div>
              <div className="p-7">
                <span className="text-[10px] font-display uppercase tracking-[0.2em] text-orange-400 border border-orange-400/30 bg-orange-400/10 px-2 py-0.5 rounded mb-4 inline-block">Branch</span>
                <h3 className="text-2xl font-display font-bold text-orange-400 mb-2">Survival</h3>
                <p className="text-sm text-zinc-300 font-bold mb-1">Focus: Looting & <strong>ARC Raiders</strong> Resources</p>
                <p className="text-xs text-zinc-500 mb-5">For: Looting specialists, stealth Raiders</p>
                <ul className="space-y-2.5 text-sm text-zinc-400">
                  <li className="flex gap-2 items-center"><span className="text-orange-400 text-lg leading-none">▸</span> Scraping speed <strong className="text-zinc-300">Skill</strong></li>
                  <li className="flex gap-2 items-center"><span className="text-orange-400 text-lg leading-none">▸</span> Backpack capacity expansion</li>
                  <li className="flex gap-2 items-center"><span className="text-orange-400 text-lg leading-none">▸</span> Safe cracking ability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SCENARIOS / BUILDS                                           */}
      {/* ============================================================ */}
      <section id="scenarios" className="relative py-20 px-6 overflow-hidden border-t border-zinc-800/40">
        <GridBg className="opacity-40" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight">
              ARC Raiders Skill Tree Builds
            </h2>
          </div>

          <div className="space-y-5">
            <div className="relative rounded-xl overflow-hidden border border-orange-500/20 bg-zinc-900/50 hover:border-orange-400/30 transition-all p-6">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400/80 via-orange-400 to-orange-400/80" />
              <div className="pl-4">
                <h4 className="text-orange-400 font-display font-bold text-lg mb-2 flex items-center gap-2">
                  <Users size={18} /> Solo Raider (Looter Build)
                </h4>
                <p className="text-zinc-300 text-sm mb-1"><strong className="text-zinc-200">Build:</strong> Survival Skill Tree (40–50) + Low Mobility</p>
                <p className="text-zinc-500 text-xs">Silent infiltration and rapid looting. Essential ARC Raiders skills: Scraping efficiency, backpack capacity.</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 bg-zinc-900/50 hover:border-cyan-400/30 transition-all p-6">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400/80 via-cyan-400 to-cyan-400/80" />
              <div className="pl-4">
                <h4 className="text-cyan-400 font-display font-bold text-lg mb-2 flex items-center gap-2">
                  <Shield size={18} /> Team Combat (Tank Build)
                </h4>
                <p className="text-zinc-300 text-sm mb-1"><strong className="text-zinc-200">Build:</strong> Conditioning Skill Tree (40–50) + Survival supplement</p>
                <p className="text-zinc-500 text-xs">Damage absorption for your ARC squad. Key skills: Shield enhancement, stamina recovery.</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-zinc-900/50 hover:border-purple-400/30 transition-all p-6">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400/80 via-purple-400 to-purple-400/80" />
              <div className="pl-4">
                <h4 className="text-purple-400 font-display font-bold text-lg mb-2 flex items-center gap-2">
                  <Crosshair size={18} /> PvP Combat (Flanker Build)
                </h4>
                <p className="text-zinc-300 text-sm mb-1"><strong className="text-zinc-200">Build:</strong> Mobility Skill Tree (45–55) + Low Conditioning</p>
                <p className="text-zinc-500 text-xs">High mobility and tactical dodging. Best ARC Raiders skills: Extreme sprint, climbing, dodging.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  VIDEO GUIDES                                                  */}
      {/* ============================================================ */}
      <section id="videos" className="relative py-20 px-6 overflow-hidden border-t border-zinc-800/40">
        <GridBg className="opacity-50" />
        <Scanlines />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs uppercase tracking-[0.2em] font-display mb-5">
              <Play size={10} /> Video Guides
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight mb-3">
              ARC Raiders Skill Tree Video Guides
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm">
              Prefer learning by watching? These community videos walk through early priorities, full 75-point builds, and common mistakes to avoid.
            </p>
          </div>

          {/* Featured iframe */}
          <div className="mb-12">
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5 md:p-7 shadow-2xl backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-400 mb-3 font-display">Featured Guide</p>
              <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-5">
                Arc Raiders – Skill Tree Overview – Best EARLY Skills
              </h3>
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800/60 bg-black">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/41EgAdedf8k"
                  title="Arc Raiders – Skill Tree Overview – Best EARLY Skills"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Video link grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { href: 'https://www.youtube.com/watch?v=GhaoPMkzido', color: 'text-purple-400', hoverBorder: 'hover:border-purple-400/40', title: 'Arc Raiders OP Skill Tree Build Guide – BEST SKILLS TO UNLOCK! – SOLO Beginner to Pro Full Guide', desc: 'Deep-dive on strong early picks and a full progression path from fresh character to end-game.' },
              { href: 'https://www.youtube.com/watch?v=K7Mf9fg8-7U', color: 'text-cyan-400', hoverBorder: 'hover:border-cyan-400/40', title: 'Arc Raiders – The ONLY Skill Tree Build you NEED | 75 Points', desc: 'A full 75-point example build focusing on consistent performance across most activities.' },
              { href: 'https://www.youtube.com/watch?v=V5nKXXsiODQ', color: 'text-purple-400', hoverBorder: 'hover:border-purple-400/40', title: 'Watch THIS Before Unlocking Skills in ARC Raiders (In-Depth Guide & Build)', desc: 'Explains how the tree works so you avoid wasting points and understand long-term trade-offs.' },
              { href: 'https://www.youtube.com/watch?v=s08i_ImDvc0', color: 'text-orange-400', hoverBorder: 'hover:border-orange-400/40', title: 'BEST All Round Skill Tree in Arc Raiders! Avoid This Mistake!', desc: 'A flexible all-rounder build plus common routing mistakes to steer clear of.' },
              { href: 'https://www.youtube.com/watch?v=abOCeC8vruw', color: 'text-purple-400', hoverBorder: 'hover:border-purple-400/40', title: 'Arc Raiders: The Best 13 Skills To Unlock Early… (Skill Tree Beginner\'s Guide)', desc: 'A curated list of must-have early skills to unlock first on fresh accounts.' },
              { href: 'https://www.youtube.com/watch?v=yKBU3UMhT4U', color: 'text-cyan-400', hoverBorder: 'hover:border-cyan-400/40', title: 'If YOU Mess this up, Goodluck. - Arc Raiders Skill Tree Guide & Best Skill Tree Build', desc: 'Highlights critical mistakes and presents a safe, strong recommendation to follow.' },
              { href: 'https://www.youtube.com/watch?v=akrz8fbocZI', color: 'text-orange-400', hoverBorder: 'hover:border-orange-400/40', title: 'My ARC Raiders Skill Tree: what I like, what I regret (level 75 build review)', desc: 'Level 75 review with insight into which picks felt worth it and which could be skipped.' },
            ].map(v => (
              <a
                key={v.href}
                href={v.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 transition-all ${v.hoverBorder} hover:bg-zinc-800/50 group`}
              >
                <div className={`mt-0.5 shrink-0 ${v.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                  <Play size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{v.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{v.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                           */}
      {/* ============================================================ */}
      <section id="faq" className="relative py-20 px-6 overflow-hidden border-t border-zinc-800/40">
        <GridBg className="opacity-40" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(147,51,234,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tight">
              ARC Raiders Skill Tree FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How to earn ARC Raiders Skill points?',
                a: <>Earn experience through character leveling to gain one <strong className="text-zinc-200">Skill</strong> point per level. Currently, a maximum of 75 <strong className="text-zinc-200">ARC Raiders Skill</strong> points are available by default.</>,
              },
              {
                q: 'Can I reset my ARC Raiders Skill Tree?',
                a: <>The game currently lacks a convenient free respec mechanism for your <strong className="text-zinc-200">Skill Tree</strong>. Use this planner to test <strong className="text-zinc-200">ARC Raiders</strong> builds before committing.</>,
              },
              {
                q: 'Which Skill Tree is best for beginners?',
                a: <>Prioritize basic Mobility (Marathon Runner) in the <strong className="text-zinc-200">ARC Raiders Skill Tree</strong> for levels 1–20, then move to Survival looting <strong className="text-zinc-200">skills</strong>.</>,
              },
            ].map(item => (
              <div
                key={item.q}
                className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-6 hover:border-zinc-700/60 transition-all"
              >
                <h3 className="text-cyan-400 font-display font-bold mb-3 flex items-center gap-2 text-base">
                  <HelpCircle size={16} className="shrink-0" /> {item.q}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                        */}
      {/* ============================================================ */}
      <footer className="relative border-t border-zinc-800/60 overflow-hidden" style={{ background: '#040509' }}>
        <GridBg className="opacity-30" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(0,212,255,0.03) 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="text-cyan-400 font-display font-bold text-lg mb-1 uppercase tracking-wider">ARC Raiders</div>
            <div className="text-xs text-zinc-600 uppercase tracking-[0.2em] mb-5">Skill Tree Builder</div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              © 2025 ARC Raiders Skill Tree Build Guide.<br />
              This website is not official.<br /><br />
              Version: V1.0 (Dec 2025)
            </p>
          </div>

          <div>
            <h4 className="text-zinc-300 font-display font-bold mb-4 text-sm uppercase tracking-[0.15em]">Resources</h4>
            <ul className="space-y-2.5 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors"><strong className="text-zinc-400">ARC Raiders</strong></a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors"><strong className="text-zinc-400">Skill Tree</strong> Wiki</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Build Sharing Platform</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-300 font-display font-bold mb-4 text-sm uppercase tracking-[0.15em]">Learning</h4>
            <ul className="space-y-2.5 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><BookOpen size={13} /> Beginner Guide</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Database size={13} /> ARC Raiders Meta</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-300 font-display font-bold mb-4 text-sm uppercase tracking-[0.15em]">Community</h4>
            <ul className="space-y-2.5 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><MessageSquare size={13} /> Reddit Discussion</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Users size={13} /> Discord Community</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-zinc-900 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
            {/* Decorative line */}
            <div className="flex items-center w-full max-w-lg">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }} />
              <span className="px-4 text-[10px] uppercase tracking-[0.3em] text-zinc-700 font-display whitespace-nowrap">
                ARC Raiders Skill Tree
              </span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.3), transparent)' }} />
            </div>
            {/* Legal / contact links */}
            <div className="flex items-center gap-4 text-[11px] text-zinc-600">
              <span>© 2025 ARC Raiders Skill Tree Builder</span>
              <span className="text-zinc-800">·</span>
              <a
                href="/privacy-policy.html"
                className="hover:text-cyan-400 transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-zinc-800">·</span>
              <a
                href="mailto:support@arcraiderskill.com"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                support@arcraiderskill.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingSections;
