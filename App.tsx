
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_DATA, POINT_BUDGETS, TREE_VERSION } from './data';
import { validateBuild } from './buildRules.mjs';
import { BuildState, SkillTreeData, SkillCategory, Skill } from './types';
import SkillNode from './components/SkillNode';
import ConnectionLines from './components/ConnectionLines';
import Tooltip from './components/Tooltip';
import GeminiAssistant from './components/GeminiAssistant';
import LandingSections from './components/LandingSections';
import ScreenshotViewer from './components/ScreenshotViewer';
import { Share2, RotateCcw, Info, ZoomIn, ZoomOut, Maximize, Move, Camera, Sparkles } from 'lucide-react';

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
  const [pointBudget, setPointBudget] = useState<number>(76);
  const [buildNotice, setBuildNotice] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copySuccess, setCopySuccess] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [previousBuild, setPreviousBuild] = useState<BuildState | null>(null);

  // Screenshot State
  const [showScreenshotPreview, setShowScreenshotPreview] = useState(false);
  const [showFirstTimeHint, setShowFirstTimeHint] = useState(true);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  // Routing State
  const [currentShortId, setCurrentShortId] = useState<string | null>(null);

  // Viewport State
  const [scale, setScale] = useState(() => window.innerWidth < 640 ? 0.5 : 1);
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

const handleScreenshot = async () => {
    const element = document.getElementById('skill-tree-container');
    if (!element) {
      alert('Could not find skill tree to capture');
      return;
    }

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      // Reset transform for clean capture
      const originalTransform = element.style.transform;
      element.style.transform = 'translate(-50%, -50%) scale(1)';
      
      // Capture the element
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0f',
        scale: 2, // High resolution
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Restore original transform
      element.style.transform = originalTransform;
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setScreenshotDataUrl(dataUrl);
      
      // Generate a unique short ID (9 characters)
      const generateShortId = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 9; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };
      
      const buildHash = btoa(JSON.stringify(buildState.skills));
      const shortId = generateShortId();
      const filename = `arcraiders-build-${shortId}.png`;
      const url = `${window.location.origin}/s/${shortId}`;
      setScreenshotUrl(url);

      // Store screenshot data in localStorage for the viewer page
      const storageKey = `arcraiders_screenshot_${shortId}`;
      localStorage.setItem(storageKey, JSON.stringify({
        buildState: buildState,
        screenshotDataUrl: dataUrl,
        timestamp: Date.now(),
        shortId: shortId
      }));

      // Show preview
      setShowScreenshotPreview(true);
      
    } catch (error) {
      console.error('Screenshot failed:', error);
      alert('Screenshot failed. Please try again.');
    }
  };

  const copyImageToClipboard = async () => {
    if (!screenshotDataUrl) return;
    
    try {
      const response = await fetch(screenshotDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('Image copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy image. Your browser may not support this feature.');
    }
  };

  const copyImageUrlToClipboard = () => {
    if (!screenshotUrl) return;
    navigator.clipboard.writeText(screenshotUrl);
    alert('Link copied to clipboard!');
  };

  const downloadScreenshot = () => {
    if (!screenshotDataUrl) return;
    const link = document.createElement('a');
    link.href = screenshotDataUrl;
    link.download = `arcraiders-build-${Date.now()}.png`;
    link.click();
  };

  // Check current URL for screenshot route
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/s\/([a-zA-Z0-9]{9})$/);
    console.log('Route check:', { path, match });
    if (match) {
      console.log('Setting currentShortId to:', match[1]);
      setCurrentShortId(match[1]);
    } else {
      console.log('No match, showing main app');
      setCurrentShortId(null);
    }
  }, []);

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
    if ((currentSkills[skillId] || 0) >= skill.maxRank) return (currentSkills[skillId] || 0) > 0;
    return validateBuild(treeData.skills, {
      ...currentSkills,
      [skillId]: (currentSkills[skillId] || 0) + 1,
    }, pointBudget);
  }, [treeData, pointBudget]);

  const canDecrement = useCallback((skillId: string, currentSkills: { [id: string]: number }) => {
    if (!treeData.skills[skillId] || (currentSkills[skillId] || 0) <= 0) return false;
    return validateBuild(treeData.skills, {
      ...currentSkills,
      [skillId]: currentSkills[skillId] - 1,
    }, pointBudget);
  }, [treeData, pointBudget]);

  const handleIncrement = (skillId: string) => {
    setBuildState(prev => {
      if ((prev.skills[skillId] || 0) >= treeData.skills[skillId].maxRank || !isSkillUnlocked(skillId, prev.skills)) return prev;
      return {
        pointsSpent: prev.pointsSpent + 1,
        skills: { ...prev.skills, [skillId]: (prev.skills[skillId] || 0) + 1 }
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
    for (const suggestion of suggestions) {
      if (!treeData.skills[suggestion.skillId] || newSkills[suggestion.skillId] !== 0) return false;
      newSkills[suggestion.skillId] = suggestion.rank;
    }
    if (!validateBuild(treeData.skills, newSkills, pointBudget)) return false;

    setPreviousBuild(buildState);
    setBuildState({
      pointsSpent: Object.values(newSkills).reduce((sum, rank) => sum + rank, 0),
      skills: newSkills
    });
    return true;
  };

  const handleUndoAIBuild = () => {
    if (!previousBuild) return;
    setBuildState(previousBuild);
    setPreviousBuild(null);
  };

  const generateShareLink = () => {
    const json = JSON.stringify({ version: TREE_VERSION, budget: pointBudget, skills: buildState.skills });
    const hash = btoa(json);
    window.location.hash = `build=${hash}`;
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('build=')) {
      try {
        const base64 = hash.split('build=')[1];
        const json = atob(base64);
        const saved = JSON.parse(json);
        if (saved.version !== TREE_VERSION || !POINT_BUDGETS.includes(saved.budget) ||
            !saved.skills || !validateBuild(treeData.skills, saved.skills, saved.budget)) {
          setBuildNotice('This share link uses an older or invalid skill tree. Start a new Frozen Trail build.');
          return;
        }
        setPointBudget(saved.budget);
        setBuildState({ skills: saved.skills, pointsSpent: Object.values(saved.skills as Record<string, number>).reduce((sum, rank) => sum + rank, 0) });
      } catch (e) { setBuildNotice('This share link could not be read. Start a new build.'); }
    }
  }, [treeData]);

  const condPoints = getCategoryPoints(SkillCategory.CONDITIONING, buildState.skills);
  const mobPoints = getCategoryPoints(SkillCategory.MOBILITY, buildState.skills);
  const survPoints = getCategoryPoints(SkillCategory.SURVIVAL, buildState.skills);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 2.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.4));
  const handleZoomReset = () => {
    setScale(window.innerWidth < 640 ? 0.5 : 1);
    setPan({ x: 0, y: 0 });
  };

  const headerTopPos = (10 - GRID_OFFSET_Y) * CELL_HEIGHT;

  // Handle back to main page
  const handleBack = () => {
    window.history.pushState({}, '', window.location.pathname.replace(/\/s\/[a-zA-Z0-9]{9}$/, '') || '/');
    setCurrentShortId(null);
  };

  // Show screenshot viewer if we have a short ID, otherwise show main app
  if (currentShortId) {
    return <ScreenshotViewer shortId={currentShortId} onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-300 overflow-x-hidden font-body selection:bg-arc-mob selection:text-black">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800/50"
        style={{ background: 'rgba(7,8,13,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        {/* Top accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6) 40%, rgba(147,51,234,0.6) 60%, transparent)' }} />
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/apple-touch-icon.png"
              alt="ARC Raiders Skill Tree Builder"
              className="h-9 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div>
              <div className="font-display font-black text-base uppercase tracking-wider leading-none"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ARC Raiders
              </div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 leading-none mt-0.5 font-display">Skill Tree Builder</div>
            </div>
          </a>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-1 text-xs font-display font-bold uppercase tracking-[0.12em]">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Skill Trees', href: '#skill-trees' },
              { label: 'Builds', href: '#scenarios' },
              { label: 'Videos', href: '#videos' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Wiki', href: '/wiki/' },
              { label: 'Gallery', href: '/screenshots.html' },
              { label: 'Blog', href: '/blog.html' },
            ].map(item => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="relative px-3 py-2 text-zinc-400 hover:text-white transition-colors duration-200 group block"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </a>
              </li>
            ))}
            <li className="ml-1">
              <a
                href="/ai-see.html"
                className="px-4 py-1.5 rounded border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-200"
              >
                AI See
              </a>
            </li>
            <li className="ml-3">
              <a
                href="https://store.steampowered.com/app/1808500/ARC_Raiders/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200"
                style={{ boxShadow: '0 0 12px rgba(0,212,255,0.1)' }}
              >
                Play Now
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <button
        type="button"
        onClick={() => setIsAIAdvisorOpen(true)}
        className="group mt-14 flex min-h-10 w-full items-center justify-center gap-2 border-b border-orange-500/30 bg-orange-500/10 px-4 py-2 text-center text-xs font-semibold text-orange-100 transition-colors hover:bg-orange-500/15"
      >
        <Sparkles size={15} className="shrink-0 text-orange-400" />
        <span>
          New: AI Build Advisor is live. Generate a build for your playstyle or review your current setup.
        </span>
        <span className="hidden shrink-0 font-display font-bold uppercase text-orange-400 sm:inline">
          Try it now
        </span>
      </button>

      {/* Main Interactive Builder Section ("Hero") */}
      <div
        ref={containerRef}
        className={`relative h-[calc(92vh-2.5rem)] min-h-[640px] w-full overflow-hidden border-b border-zinc-900/60 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ background: '#07080d' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
         
         {/* Background image with layered dark overlays */}
         <div className="absolute inset-0 pointer-events-none z-0">
           {/* Game art background */}
           <div
             className="absolute inset-0"
             style={{
               backgroundImage: 'url(/images/blog-arc-news1.webp)',
               backgroundSize: 'cover',
               backgroundPosition: 'center 30%',
               backgroundRepeat: 'no-repeat',
               filter: 'saturate(0.45) brightness(0.28)',
             }}
           />
           {/* Dark fill — moderate, keeps image faintly visible */}
           <div
             className="absolute inset-0"
             style={{ background: 'rgba(7,8,13,0.38)' }}
           />
           {/* Edge vignette — darken outer frame only */}
           <div
             className="absolute inset-0"
             style={{
               background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(7,8,13,0.85) 100%)',
             }}
           />
           {/* Top & bottom fade */}
           <div
             className="absolute inset-0"
             style={{
               background: 'linear-gradient(180deg, rgba(7,8,13,0.75) 0%, transparent 18%, transparent 72%, rgba(7,8,13,0.9) 100%)',
             }}
           />
           {/* Subtle grid overlay */}
           <div
             className="absolute inset-0 opacity-15"
             style={{
               backgroundImage: `linear-gradient(rgba(0,212,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.08) 1px, transparent 1px)`,
               backgroundSize: '40px 40px',
             }}
           />
         </div>

         {/* Controls Panel */}
         <div className="absolute top-3 left-3 right-3 z-40 flex flex-col items-end gap-3 pointer-events-auto sm:top-8 sm:left-auto sm:right-8 sm:gap-4">
            <div className="bg-[#0f0f11]/90 backdrop-blur border border-zinc-800 w-full sm:w-auto px-2 sm:px-6 py-2 rounded-full flex items-center justify-between sm:justify-start gap-1 sm:gap-4 shadow-xl">
               <div className="flex flex-col items-end">
                  <span className="text-zinc-400 font-display font-bold text-[10px] tracking-widest uppercase">Total Points</span>
                  <div className="text-lg sm:text-2xl font-display font-bold text-white leading-none">{buildState.pointsSpent}/{pointBudget}</div>
               </div>
                <select
                  aria-label="Skill point budget"
                  title="Skill point budget"
                  value={pointBudget}
                  onChange={(event) => setPointBudget(Number(event.target.value))}
                  className="bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs sm:text-sm px-1 sm:px-2 py-1"
                >
                  {POINT_BUDGETS.map((budget) => <option key={budget} value={budget} disabled={budget < buildState.pointsSpent}>{budget} points</option>)}
                </select>
               <div className="h-8 w-px bg-zinc-800"></div>
               <button 
                  onClick={handleReset}
                  className="text-zinc-400 hover:text-white transition-colors p-1.5 sm:p-2"
                  title="Reset Tree"
                >
                  <RotateCcw size={18} />
                </button>
                <button 
                  onClick={generateShareLink}
                  className={`text-zinc-400 hover:text-white transition-colors p-1.5 sm:p-2 ${copySuccess ? 'text-green-500' : ''}`}
                  title="Share Build"
                >
                   <Share2 size={18} />
                </button>
                <button
                  onClick={handleScreenshot}
                  className="relative text-zinc-400 hover:text-white transition-colors p-1.5 sm:p-2"
                  title="Take Screenshot (NEW!)"
                >
                   <Camera size={18} />
                   <span className="absolute -top-1 -right-1 flex items-center justify-center">
                     <span className="relative flex h-4 w-4">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-4 w-4 items-center justify-center bg-green-500 text-[8px] font-bold text-white">
                         NEW
                       </span>
                     </span>
                   </span>
                </button>
                <div className="h-8 w-px bg-zinc-800"></div>
                <button
                  onClick={() => setIsAIAdvisorOpen(true)}
                  className={`hidden h-9 items-center gap-2 border px-3 text-xs font-bold uppercase transition-colors sm:flex ${
                    isAIAdvisorOpen
                      ? 'border-orange-400 bg-orange-500 text-black'
                      : 'border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                  }`}
                  title="Open AI Build Advisor"
                >
                  <Sparkles size={15} />
                  <span className="hidden xl:inline">AI Advisor</span>
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
                  canAfford={buildState.pointsSpent < pointBudget}
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

      <button
        onClick={() => setIsAIAdvisorOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center border border-orange-400 bg-orange-500 text-black shadow-xl sm:hidden"
        title="Open AI Build Advisor"
        aria-label="Open AI Build Advisor"
      >
        <Sparkles size={20} />
      </button>

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
            selectedInGroup={treeData.skills[hoveredSkillId].choiceGroup
              ? Object.values(treeData.skills).filter((skill) => skill.choiceGroup === treeData.skills[hoveredSkillId].choiceGroup && buildState.skills[skill.id] > 0).length
              : 0}
          />
        </div>
      )}

      {/* AI Assistant */}
      <GeminiAssistant
        treeData={treeData}
        buildState={buildState}
        pointBudget={pointBudget}
        isOpen={isAIAdvisorOpen}
        onOpenChange={setIsAIAdvisorOpen}
        onApplyBuild={handleApplyAIBuild}
        onUndo={handleUndoAIBuild}
        canUndo={previousBuild !== null}
      />
      {buildNotice && <div role="alert" className="fixed bottom-5 left-5 z-50 max-w-sm border border-amber-500/60 bg-zinc-950 p-4 text-sm text-zinc-100 shadow-xl">{buildNotice}<button className="ml-3 text-amber-400" onClick={() => setBuildNotice(null)}>Dismiss</button></div>}

      {/* Screenshot Preview Modal */}
      {showScreenshotPreview && screenshotDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="relative max-w-4xl w-full bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <div>
                <h3 className="text-lg font-display font-bold text-white">Build Screenshot</h3>
                <p className="text-sm text-zinc-400 mt-1">Your ARC Raiders skill tree build</p>
              </div>
              <button
                onClick={() => setShowScreenshotPreview(false)}
                className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Image Preview */}
            <div className="p-6 bg-zinc-950/50">
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/50">
                <img src={screenshotDataUrl} alt="Skill Tree Build" className="w-full h-auto" />
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={copyImageToClipboard}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-all text-cyan-400 font-semibold text-sm"
                >
                  📋 Copy Image
                </button>
                <button
                  onClick={copyImageUrlToClipboard}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-all text-purple-400 font-semibold text-sm"
                >
                  🔗 Copy Link
                </button>
                <button
                  onClick={downloadScreenshot}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-all text-orange-400 font-semibold text-sm"
                >
                  ⬇️ Download
                </button>
              </div>
              {screenshotUrl && (
                <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <p className="text-xs text-zinc-400 mb-2">Share this URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-zinc-300 bg-zinc-900/50 px-3 py-2 rounded font-mono break-all">
                      {screenshotUrl}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
