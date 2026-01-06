
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_DATA } from './data';
import { BuildState, SkillTreeData, SkillCategory, Skill } from './types';
import SkillNode from './components/SkillNode';
import ConnectionLines from './components/ConnectionLines';
import Tooltip from './components/Tooltip';
import GeminiAssistant from './components/GeminiAssistant';
import LandingSections from './components/LandingSections';
import { Share2, RotateCcw, Info, ZoomIn, ZoomOut, Maximize, Move, Camera } from 'lucide-react';

// Configuration for Grid Cropping & Sizing
// Flatter aspect ratio: Width 18, Height 12
const CELL_WIDTH = 18;
const CELL_HEIGHT = 12; 
const GRID_OFFSET_X = 15; // Crop left
const GRID_OFFSET_Y = 4;  // Crop top
const GRID_WIDTH_UNITS = 70; 
const GRID_HEIGHT_UNITS = 75;

export default function App() {
  const [treeData] = useState<SkillTreeData>(INITIAL_DATA);
  const [buildState, setBuildState] = useState<BuildState>({
    pointsSpent: 0,
    skills: {}
  });
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Viewport State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Move for Tooltip tracking & Panning
  const handleMouseMove = (e: React.MouseEvent) => {
    // Tooltip position
    setMousePos({ x: e.clientX, y: e.clientY });

    // Panning logic
    if (isDragging) {
      e.preventDefault();
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow drag on background, not if clicking a button/node (though nodes usually stop propagation)
    if (e.button === 0) { // Left click
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Wheel Zoom Logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      setScale(prev => Math.min(Math.max(0.4, prev + delta), 2.5));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const initialSkills: { [id: string]: number } = {};
    Object.keys(treeData.skills).forEach(id => initialSkills[id] = 0);
    setBuildState(prev => ({ ...prev, skills: initialSkills }));
  }, [treeData]);

  const getCategoryPoints = useCallback((category: SkillCategory, currentSkills: { [id: string]: number }) => {
    let total = 0;
    Object.values(treeData.skills).forEach((skill: Skill) => {
      if (skill.category === category) {
        total += currentSkills[skill.id] || 0;
      }
    });
    return total;
  }, [treeData]);

  const isSkillUnlocked = useCallback((skillId: string, currentSkills: { [id: string]: number }) => {
    const skill = treeData.skills[skillId];
    if (!skill) return false;

    const catPoints = getCategoryPoints(skill.category, currentSkills);
    if (skill.reqPointsInTree > 0 && catPoints < skill.reqPointsInTree) return false;

    if (skill.parentIds.length === 0) return true;

    return skill.parentIds.some(pid => (currentSkills[pid] || 0) > 0);
  }, [treeData, getCategoryPoints]);

  const canDecrement = useCallback((skillId: string, currentSkills: { [id: string]: number }) => {
    const skill = treeData.skills[skillId];
    if (!skill) return false;
    if ((currentSkills[skillId] || 0) <= 0) return false;
    
    const activeChildren = skill.childrenIds.filter(childId => (currentSkills[childId] || 0) > 0);
    
    if (activeChildren.length > 0) {
      for (const childId of activeChildren) {
        const child = treeData.skills[childId];
        const activeParents = child.parentIds.filter(pid => (currentSkills[pid] || 0) > 0);
        if (activeParents.length <= 1) return false;
      }
    }
    
    const catPoints = getCategoryPoints(skill.category, currentSkills);
    const categorySkills = (Object.values(treeData.skills) as Skill[]).filter(s => s.category === skill.category);
    
    for (const s of categorySkills) {
      if ((currentSkills[s.id] || 0) > 0 && s.reqPointsInTree > 0) {
         if (catPoints <= s.reqPointsInTree) {
             if (s.id !== skillId) {
               return false;
             }
         }
      }
    }

    return true;
  }, [treeData, getCategoryPoints]);

  const handleIncrement = (skillId: string) => {
    setBuildState(prev => {
      const currentRank = prev.skills[skillId] || 0;
      if (currentRank >= treeData.skills[skillId].maxRank) return prev;
      
      return {
        pointsSpent: prev.pointsSpent + 1,
        skills: { ...prev.skills, [skillId]: currentRank + 1 }
      };
    });
  };

  const handleDecrement = (skillId: string) => {
    setBuildState(prev => {
      if (!canDecrement(skillId, prev.skills)) return prev;
      const currentRank = prev.skills[skillId] || 0;
      if (currentRank <= 0) return prev;
      return {
        pointsSpent: prev.pointsSpent - 1,
        skills: { ...prev.skills, [skillId]: currentRank - 1 }
      };
    });
  };

  const handleReset = () => {
    const resetSkills: { [id: string]: number } = {};
    Object.keys(treeData.skills).forEach(id => resetSkills[id] = 0);
    setBuildState({ pointsSpent: 0, skills: resetSkills });
  };

  const handleApplyAIBuild = (suggestions: { skillId: string; rank: number }[]) => {
    const newSkills: { [id: string]: number } = {};
    Object.keys(treeData.skills).forEach(id => newSkills[id] = 0);
    
    let points = 0;
    suggestions.forEach(s => {
      if (treeData.skills[s.skillId]) {
        let rank = s.rank;
        if (rank > treeData.skills[s.skillId].maxRank) rank = treeData.skills[s.skillId].maxRank;
        newSkills[s.skillId] = rank;
        points += rank;
      }
    });

    setBuildState({
      pointsSpent: points,
      skills: newSkills
    });
  };

  const generateShareLink = () => {
    const json = JSON.stringify(buildState.skills);
    const hash = btoa(json);
    window.location.hash = `build=${hash}`;
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
const handleScreenshot = () => {
    const element = document.getElementById('skill-tree-container');
    if (!element) {
      alert('Could not find skill tree to capture');
      return;
    }
    
    // Using browser's native capture API or alert for now
    alert('📸 Screenshot Feature\n\nTo take a screenshot of your build:\n1. Use your system screenshot tool (Win+Shift+S or Cmd+Shift+4)\n2. Or wait for our upcoming built-in screenshot feature!\n\nTip: Screenshots will be shareable in our Gallery soon!');
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('build=')) {
      try {
        const base64 = hash.split('build=')[1];
        const json = atob(base64);
        const loadedSkills = JSON.parse(json);
        const validSkills: Record<string, number> = {};
        let total = 0;
        
        Object.keys(treeData.skills).forEach(id => validSkills[id] = 0);
        Object.entries(loadedSkills).forEach(([id, val]) => {
           if (treeData.skills[id]) {
             validSkills[id] = val as number;
             total += val as number;
           }
        });
        setBuildState({ skills: validSkills, pointsSpent: total });
      } catch (e) { console.error("Failed to load build"); }
    }
  }, [treeData]);

  const condPoints = getCategoryPoints(SkillCategory.CONDITIONING, buildState.skills);
  const mobPoints = getCategoryPoints(SkillCategory.MOBILITY, buildState.skills);
  const survPoints = getCategoryPoints(SkillCategory.SURVIVAL, buildState.skills);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 2.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.4));
  const handleZoomReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const headerTopPos = (10 - GRID_OFFSET_Y) * CELL_HEIGHT;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-300 overflow-x-hidden font-body selection:bg-arc-mob selection:text-black">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-arc-bg/90 backdrop-blur-md z-50 border-b border-zinc-900 py-3">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 text-arc-mob font-display font-bold text-xl">
            <img 
              src="/apple-touch-icon.png" 
              alt="ARC Radiers Skill Tree Builder" 
              className="h-10 w-auto object-contain"
            />
            ARC Radiers Skill Tree Builder
          </div>
          <ul className="hidden md:flex gap-8 text-sm font-medium text-zinc-300">
             <li><a href="#features" className="hover:text-arc-mob transition-colors">Features</a></li>
             <li><a href="#skill-trees" className="hover:text-arc-mob transition-colors">Skill Trees</a></li>
             <li><a href="#scenarios" className="hover:text-arc-mob transition-colors">Scenarios</a></li>
             <li><a href="#faq" className="hover:text-arc-mob transition-colors">FAQ</a></li>
             <li><a href="/wiki.html" className="hover:text-arc-mob transition-colors">Wiki</a></li>
             <li><a href="/screenshots.html" className="hover:text-arc-mob transition-colors">Gallery</a></li>
             <li><a href="/blog.html" className="hover:text-arc-mob transition-colors">Blog</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Interactive Builder Section ("Hero") */}
      <div 
        ref={containerRef}
        className={`relative h-[92vh] w-full overflow-hidden bg-[#050505] border-b border-zinc-900 mt-14 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
         
         {/* PROMINENT TITLE OVERLAY */}
         <div className="absolute top-8 left-0 w-full z-40 text-center pointer-events-none">
            <h1 className="text-4xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 drop-shadow-2xl tracking-tighter uppercase">
               ARC Raiders Skill Tree
            </h1>
            <p className="text-xl md:text-2xl font-display font-bold text-arc-mob tracking-widest mt-2 uppercase drop-shadow-lg">
               Best Tree Build
            </p>
         </div>

         {/* Controls Panel */}
         <div className="absolute top-8 right-8 z-40 flex flex-col items-end gap-4 pointer-events-auto">
            <div className="bg-[#0f0f11]/90 backdrop-blur border border-zinc-800 px-6 py-2 rounded-full flex items-center gap-4 shadow-xl">
               <div className="flex flex-col items-end">
                  <span className="text-zinc-400 font-display font-bold text-[10px] tracking-widest uppercase">Total Points</span>
                  <div className="text-2xl font-display font-bold text-white leading-none">
                    {buildState.pointsSpent}
                  </div>
               </div>
               <div className="h-8 w-px bg-zinc-800"></div>
               <button 
                  onClick={handleReset}
                  className="text-zinc-400 hover:text-white transition-colors p-2"
                  title="Reset Tree"
                >
                  <RotateCcw size={18} />
                </button>
                <button 
                  onClick={generateShareLink}
                  className={`text-zinc-400 hover:text-white transition-colors p-2 ${copySuccess ? 'text-green-500' : ''}`}
                  title="Share Build"
                >
                   <Share2 size={18} />
                </button>
                <button
                  onClick={handleScreenshot}
                  className="text-zinc-400 hover:text-white transition-colors p-2"
                  title="Take Screenshot"
                >
                   <Camera size={18} />
                </button>
            </div>

            {/* Zoom Controls */}
            <div className="bg-[#0f0f11]/90 backdrop-blur border border-zinc-800 p-1.5 rounded-full flex flex-col items-center gap-1 shadow-xl">
              <button onClick={handleZoomIn} className="p-2 text-zinc-400 hover:text-white transition-colors" title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button onClick={handleZoomReset} className="p-2 text-zinc-400 hover:text-white transition-colors" title="Reset View">
                <Maximize size={14} />
              </button>
              <button onClick={handleZoomOut} className="p-2 text-zinc-400 hover:text-white transition-colors" title="Zoom Out">
                <ZoomOut size={16} />
              </button>
            </div>
         </div>

         {/* Scalable & Pannable Wrapper */}
         <div 
            id="skill-tree-container"
            className="absolute left-1/2 top-1/2 transition-transform duration-75 ease-linear origin-center"
            style={{ 
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${scale})` 
            }}
         >
           
           <div className="relative" style={{ width: GRID_WIDTH_UNITS * CELL_WIDTH, height: GRID_HEIGHT_UNITS * CELL_HEIGHT }}>
              
              {/* === TIER GATES VISUALIZATION === */}
              <div 
                className="absolute w-full border-t border-dashed border-zinc-900 pointer-events-none flex items-center justify-center opacity-50"
                style={{ top: (50 - GRID_OFFSET_Y) * CELL_HEIGHT, left: 0 }}
              />

              <div 
                className="absolute w-full border-t border-dashed border-zinc-900 pointer-events-none flex items-center justify-center opacity-50"
                style={{ top: (20 - GRID_OFFSET_Y) * CELL_HEIGHT, left: 0 }}
              />


              {/* === CATEGORY HEADERS === */}
              <div 
                className="absolute flex flex-col items-center -translate-x-1/2 pointer-events-none z-10"
                style={{ left: (25 - GRID_OFFSET_X) * CELL_WIDTH + CELL_WIDTH / 2, top: headerTopPos }} 
              >
                <span className="text-3xl font-display font-bold text-arc-cond tracking-wide mb-1 opacity-90 drop-shadow-md">CONDITIONING</span>
                <span className="text-lg font-display text-zinc-300 bg-black/40 px-3 py-0.5 rounded-full backdrop-blur-sm border border-zinc-800/50">{condPoints} Points</span>
              </div>

              <div 
                className="absolute flex flex-col items-center -translate-x-1/2 pointer-events-none z-10"
                style={{ left: (50 - GRID_OFFSET_X) * CELL_WIDTH + CELL_WIDTH / 2, top: headerTopPos }}
              >
                <span className="text-3xl font-display font-bold text-arc-mob tracking-wide mb-1 opacity-90 drop-shadow-md">MOBILITY</span>
                <span className="text-lg font-display text-zinc-300 bg-black/40 px-3 py-0.5 rounded-full backdrop-blur-sm border border-zinc-800/50">{mobPoints} Points</span>
              </div>

              <div 
                className="absolute flex flex-col items-center -translate-x-1/2 pointer-events-none z-10"
                style={{ left: (75 - GRID_OFFSET_X) * CELL_WIDTH + CELL_WIDTH / 2, top: headerTopPos }}
              >
                <span className="text-3xl font-display font-bold text-arc-surv tracking-wide mb-1 opacity-90 drop-shadow-md">SURVIVAL</span>
                <span className="text-lg font-display text-zinc-300 bg-black/40 px-3 py-0.5 rounded-full backdrop-blur-sm border border-zinc-800/50">{survPoints} Points</span>
              </div>

              {/* Connections Layer */}
              <ConnectionLines 
                skills={treeData.skills} 
                buildState={buildState} 
                cellWidth={CELL_WIDTH}
                cellHeight={CELL_HEIGHT}
                getCategoryPoints={getCategoryPoints}
                offsetX={GRID_OFFSET_X}
                offsetY={GRID_OFFSET_Y}
              />

              {/* Nodes Layer */}
              {Object.values(treeData.skills).map((skill: Skill) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  currentRank={buildState.skills[skill.id] || 0}
                  isUnlocked={isSkillUnlocked(skill.id, buildState.skills)}
                  canAfford={true}
                  cellWidth={CELL_WIDTH}
                  cellHeight={CELL_HEIGHT}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  setHoveredSkill={setHoveredSkillId}
                  currentCategoryPoints={getCategoryPoints(skill.category, buildState.skills)}
                  offsetX={GRID_OFFSET_X}
                  offsetY={GRID_OFFSET_Y}
                />
              ))}

           </div>
         </div>

         {/* Info Button (Bottom Left within builder) */}
         <div className="absolute bottom-8 left-8 z-40 pointer-events-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-zinc-300 mb-1">
                 <Move size={12}/> Drag to Pan | Scroll to Zoom
              </div>
              <button className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-all group relative">
                <Info size={20} />
                <span className="absolute left-14 text-xs text-zinc-300 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-black px-2 py-1 rounded border border-zinc-800">
                  Scroll down for full guide
                </span>
              </button>
            </div>
         </div>
      </div>

      {/* SEO Landing Content Sections */}
      <LandingSections />

      {/* Tooltip */}
      {hoveredSkillId && treeData.skills[hoveredSkillId] && !isDragging && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{ 
            left: Math.min(mousePos.x + 20, window.innerWidth - 320), 
            top: Math.min(mousePos.y + 20, window.innerHeight - 300)
          }}
        >
          <Tooltip 
            skill={treeData.skills[hoveredSkillId]} 
            currentRank={buildState.skills[hoveredSkillId] || 0}
            isUnlocked={isSkillUnlocked(hoveredSkillId, buildState.skills)}
            reqPoints={treeData.skills[hoveredSkillId].reqPointsInTree}
            currentCategoryPoints={getCategoryPoints(treeData.skills[hoveredSkillId].category, buildState.skills)}
          />
        </div>
      )}

      {/* AI Assistant */}
      <GeminiAssistant treeData={treeData} onApplyBuild={handleApplyAIBuild} />
      
    </div>
  );
}
