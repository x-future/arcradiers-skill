
import React from 'react';
import { Target, Zap, Box, Shield, Users, Crosshair, HelpCircle, BookOpen, MessageSquare, Database } from 'lucide-react';

const LandingSections = () => {
  return (
    <div className="relative z-10 bg-arc-bg text-zinc-300">
      
      {/* === Problems / Hook Section === */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-arc-mob mb-4">
            Master the ARC Raiders Skill Tree
          </h2>
          <p className="text-zinc-300 text-lg">
            The <strong>ARC  Skill Tree</strong> offers a predictable growth system | Define your <strong>Skill</strong> style | Strategic <strong>ARC Raiders</strong> choices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-arc-panel border border-zinc-800 p-8 rounded-xl hover:border-arc-mob/50 transition-colors group">
            <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-arc-mob transition-colors">Beyond Random Gear</h3>
            <p className="text-zinc-300 leading-relaxed">Unlike other games, your power in <strong>ARC Raiders</strong> isn't just about loot drops. The <strong>Skill Tree</strong> puts progression in your hands.</p>
          </div>
          <div className="bg-arc-panel border border-zinc-800 p-8 rounded-xl hover:border-arc-mob/50 transition-colors group">
            <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-arc-mob transition-colors">ARC Raiders Growth</h3>
            <p className="text-zinc-300 leading-relaxed">Don't just rely on weapons. The <strong>ARC Raiders Skill Tree</strong> allows for deep character growth and personal expression through specific <strong>Skill</strong> nodes.</p>
          </div>
          <div className="bg-arc-panel border border-zinc-800 p-8 rounded-xl hover:border-arc-mob/50 transition-colors group">
            <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-arc-mob transition-colors">Strategic Skill Builds</h3>
            <p className="text-zinc-300 leading-relaxed">Avoid homogenized gameplay. Use the <strong>ARC Raiders Skill Tree</strong> to create diverse builds that offer true strategic variety in every raid.</p>
          </div>
        </div>
      </section>

      {/* === Features / What is Skill Tree === */}
      <section id="features" className="py-20 px-6 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white text-center mb-2">What is the ARC Raiders Skill Tree?</h2>
          <p className="text-center text-zinc-300 mb-12">A revolutionary <strong>ARC Raiders</strong> progression system, letting players define strength via the <strong>Skill Tree</strong>.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-arc-panel rounded-full flex items-center justify-center text-arc-mob mb-4 shadow-lg shadow-arc-mob/10">
                <Target size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ARC Raiders Skill Points</h3>
              <p className="text-zinc-300 text-sm">Earn one <strong>ARC Raiders Skill</strong> point per level. Maximize your 75 points to complete your <strong>Skill Tree</strong> build.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-arc-panel rounded-full flex items-center justify-center text-arc-cond mb-4 shadow-lg shadow-arc-cond/10">
                <Box size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Best Skill Configurations</h3>
              <p className="text-zinc-300 text-sm">Conditioning, Mobility, and Survival. Build your optimal <strong>ARC Raiders Skill Tree</strong> configuration.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-arc-panel rounded-full flex items-center justify-center text-arc-surv mb-4 shadow-lg shadow-arc-surv/10">
                <Zap size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">45 Skill Tree Nodes</h3>
              <p className="text-zinc-300 text-sm">~15 <strong>Skill</strong> nodes per branch. Master prerequisites in the <strong>ARC Raiders Skill Tree</strong> for deep customization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* === Detailed Branches (SEO Content) === */}
      <section id="skill-trees" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-white text-center mb-12">ARC Raiders Skill Tree Branches</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conditioning */}
          <div className="bg-arc-panel border-t-4 border-arc-cond p-6 rounded-b-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Shield size={100} />
            </div>
            <h3 className="text-2xl font-display font-bold text-arc-cond mb-4">Conditioning Skill</h3>
            <p className="text-sm text-white font-bold mb-2">Focus: <strong>ARC Raiders</strong> Survival & Stamina</p>
            <p className="text-xs text-zinc-300 mb-4">For: Heavy <strong>Raiders</strong>, tanks, endurance builds</p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex gap-2"><span className="text-arc-cond">▸</span> Stamina recovery <strong>Skill</strong></li>
              <li className="flex gap-2"><span className="text-arc-cond">▸</span> Carry capacity enhancement</li>
              <li className="flex gap-2"><span className="text-arc-cond">▸</span> Shield penalty reduction</li>
            </ul>
          </div>

          {/* Mobility */}
          <div className="bg-arc-panel border-t-4 border-arc-mob p-6 rounded-b-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap size={100} />
            </div>
            <h3 className="text-2xl font-display font-bold text-arc-mob mb-4">Mobility Skill</h3>
            <p className="text-sm text-white font-bold mb-2">Focus: Speed & <strong>ARC Raiders</strong> Movement</p>
            <p className="text-xs text-zinc-300 mb-4">For: Assault <strong>Raiders</strong>, PvP experts</p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex gap-2"><span className="text-arc-mob">▸</span> Marathon Runner (stamina <strong>Skill</strong>)</li>
              <li className="flex gap-2"><span className="text-arc-mob">▸</span> Youthful Lungs (max stamina)</li>
              <li className="flex gap-2"><span className="text-arc-mob">▸</span> Effortless Roll (dodge <strong>Skill</strong>)</li>
            </ul>
          </div>

          {/* Survival */}
          <div className="bg-arc-panel border-t-4 border-arc-surv p-6 rounded-b-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Box size={100} />
            </div>
            <h3 className="text-2xl font-display font-bold text-arc-surv mb-4">Survival Skill</h3>
            <p className="text-sm text-white font-bold mb-2">Focus: Looting & <strong>ARC Raiders</strong> Resources</p>
            <p className="text-xs text-zinc-300 mb-4">For: Looting specialists, stealth <strong>Raiders</strong></p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex gap-2"><span className="text-arc-surv">▸</span> Scraping speed <strong>Skill</strong></li>
              <li className="flex gap-2"><span className="text-arc-surv">▸</span> Backpack capacity expansion</li>
              <li className="flex gap-2"><span className="text-arc-surv">▸</span> Safe cracking ability</li>
            </ul>
          </div>
        </div>
      </section>

      {/* === Scenarios === */}
      <section id="scenarios" className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-white text-center mb-12">ARC Raiders Skill Tree Builds</h2>
          
          <div className="space-y-6">
             <div className="bg-black/50 border-l-4 border-arc-surv p-6 rounded-r-lg">
                <h4 className="text-arc-surv font-bold text-lg mb-2 flex items-center gap-2"><Users size={20}/> Solo <strong>Raider</strong> (Looter Build)</h4>
                <p className="text-zinc-300 text-sm mb-2"><strong>Build:</strong> Survival <strong>Skill Tree</strong> (40-50) + Low Mobility</p>
                <p className="text-zinc-300 text-xs">Silent infiltration and rapid looting. Essential <strong>ARC Raiders</strong> skills: Scraping efficiency, backpack capacity.</p>
             </div>

             <div className="bg-black/50 border-l-4 border-arc-cond p-6 rounded-r-lg">
                <h4 className="text-arc-cond font-bold text-lg mb-2 flex items-center gap-2"><Shield size={20}/> Team Combat (Tank Build)</h4>
                <p className="text-zinc-300 text-sm mb-2"><strong>Build:</strong> Conditioning <strong>Skill Tree</strong> (40-50) + Survival supplement</p>
                <p className="text-zinc-300 text-xs">Damage absorption for your <strong>ARC</strong> squad. Key skills: Shield enhancement, stamina recovery.</p>
             </div>

             <div className="bg-black/50 border-l-4 border-arc-mob p-6 rounded-r-lg">
                <h4 className="text-arc-mob font-bold text-lg mb-2 flex items-center gap-2"><Crosshair size={20}/> PvP Combat (Flanker Build)</h4>
                <p className="text-zinc-300 text-sm mb-2"><strong>Build:</strong> Mobility <strong>Skill Tree</strong> (45-55) + Low Conditioning</p>
                <p className="text-zinc-300 text-xs">High mobility and tactical dodging. Best <strong>ARC Raiders</strong> skills: Extreme sprint, climbing, dodging.</p>
             </div>
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-white text-center mb-12">ARC Raiders Skill Tree FAQ</h2>
        <div className="space-y-8">
          <div className="border-b border-zinc-800 pb-6">
            <h3 className="text-arc-mob font-bold mb-2 flex items-center gap-2"><HelpCircle size={16}/> How to earn ARC Raiders Skill points?</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">Earn experience through character leveling to gain one <strong>Skill</strong> point per level. Currently, a maximum of 75 <strong>ARC Raiders Skill</strong> points are available by default.</p>
          </div>
          <div className="border-b border-zinc-800 pb-6">
            <h3 className="text-arc-mob font-bold mb-2 flex items-center gap-2"><HelpCircle size={16}/> Can I reset my ARC Raiders Skill Tree?</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">The game currently lacks a convenient free respec mechanism for your <strong>Skill Tree</strong>. Use this planner to test <strong>ARC Raiders</strong> builds before committing.</p>
          </div>
          <div className="border-b border-zinc-800 pb-6">
            <h3 className="text-arc-mob font-bold mb-2 flex items-center gap-2"><HelpCircle size={16}/> Which Skill Tree is best for beginners?</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">Prioritize basic Mobility (Marathon Runner) in the <strong>ARC Raiders Skill Tree</strong> for levels 1-20, then move to Survival looting <strong>skills</strong>.</p>
          </div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="bg-black border-t border-zinc-900 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-white font-bold mb-4 font-display">ARC Raiders Resources</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#" className="hover:text-arc-mob transition-colors"><strong>ARC Raiders</strong></a></li>
              <li><a href="#" className="hover:text-arc-mob transition-colors"><strong>Skill Tree</strong> Wiki</a></li>
              <li><a href="#" className="hover:text-arc-mob transition-colors">Build Sharing Platform</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-display">Skill Tree Learning</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#" className="hover:text-arc-mob transition-colors flex items-center gap-2"><BookOpen size={14}/> Beginner <strong>Skill</strong> Guide</a></li>
              <li><a href="#" className="hover:text-arc-mob transition-colors flex items-center gap-2"><Database size={14}/> <strong>ARC Raiders</strong> Meta</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-display">Raiders Community</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><a href="#" className="hover:text-arc-mob transition-colors flex items-center gap-2"><MessageSquare size={14}/> Reddit Discussion</a></li>
              <li><a href="#" className="hover:text-arc-mob transition-colors flex items-center gap-2"><Users size={14}/> Discord Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 font-display">About</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              © 2025 <strong>ARC Raiders Skill Tree</strong> Build Guide. This website is based on official. 
              <br/><br/>
              Version: V1.0 (Dec 2025)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingSections;
