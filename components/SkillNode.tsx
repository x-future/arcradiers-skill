
import React from 'react';
import { Skill, SkillCategory } from '../types';
import { Lock } from 'lucide-react';
import SkillIcon from './SkillIcon';

interface SkillNodeProps {
  skill: Skill;
  currentRank: number;
  isUnlocked: boolean;
  canAfford: boolean;
  cellWidth: number;
  cellHeight: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  setHoveredSkill: (id: string | null) => void;
  currentCategoryPoints: number;
  offsetX: number;
  offsetY: number;
}

const SkillNode: React.FC<SkillNodeProps> = ({
  skill,
  currentRank,
  isUnlocked,
  canAfford,
  cellWidth,
  cellHeight,
  onIncrement,
  onDecrement,
  setHoveredSkill,
  currentCategoryPoints,
  offsetX,
  offsetY
}) => {
  const isMaxed = currentRank >= skill.maxRank;
  const isActive = currentRank > 0;
  
  // Point Gate Logic
  const isTierLocked = skill.reqPointsInTree > 0 && currentCategoryPoints < skill.reqPointsInTree;
  
  let baseColor = '#52525b'; // zinc-600
  if (skill.category === SkillCategory.CONDITIONING) baseColor = '#26d672'; 
  else if (skill.category === SkillCategory.MOBILITY) baseColor = '#d19a53';
  else if (skill.category === SkillCategory.SURVIVAL) baseColor = '#ff4444';

  // Increase multiplier to make nodes legible on smaller grid
  const nodeSize = cellWidth * 2.8; 
  // Icon size relative to node
  const iconSize = nodeSize * 0.55; 

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.type === 'click') {
      if (!isMaxed && isUnlocked && canAfford) onIncrement(skill.id);
    } else if (e.type === 'contextmenu') {
      if (currentRank > 0) onDecrement(skill.id);
    }
  };

  return (
    <div
      className="absolute flex items-center justify-center z-20 group"
      style={{
        left: (skill.x - offsetX) * cellWidth + cellWidth / 2 - nodeSize / 2,
        top: (skill.y - offsetY) * cellHeight + cellHeight / 2 - nodeSize / 2,
        width: nodeSize,
        height: nodeSize,
      }}
      onMouseEnter={() => setHoveredSkill(skill.id)}
      onMouseLeave={() => setHoveredSkill(null)}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {/* 
        Node Circle 
      */}
      <div 
        className={`
          w-full h-full rounded-full flex items-center justify-center transition-all duration-200 border-[3px]
        `}
        style={{
           backgroundColor: isMaxed ? baseColor : '#0a0a0c',
           borderColor: isActive || isUnlocked ? baseColor : '#27272a',
           boxShadow: isActive ? `0 0 15px ${baseColor}40` : 'none'
        }}
      >
        {/* Generated Vector Icon */}
        <SkillIcon 
          iconName={skill.icon}
          size={iconSize}
          className="relative z-10 transition-all duration-200 select-none pointer-events-none"
          style={{
            // Visual Logic:
            // Maxed: Black Icon (on colored bg)
            // Active/Unlocked: Colored Icon (on dark bg) using current 'color' prop isn't enough for SVG stroke
            // Locked: Dimmed Grey
            
            color: isMaxed ? '#000000' : (isActive || isUnlocked ? baseColor : '#52525b'),
            opacity: !isUnlocked ? 0.3 : 1
          }}
        />

        {/* Lock Overlay */}
        {!isUnlocked && (
          <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-zinc-700 z-20">
             <Lock size={10} className="text-zinc-500" />
          </div>
        )}
      </div>

      {/* Rank Pill */}
      <div 
        className={`
          absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 
          px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-tighter border z-30
          flex items-center justify-center min-w-[28px]
          transition-colors duration-200
        `}
        style={{ 
          backgroundColor: isMaxed ? baseColor : '#0a0a0c',
          color: isMaxed ? '#000000' : (!isUnlocked ? '#52525b' : baseColor),
          borderColor: !isUnlocked ? '#27272a' : baseColor
        }}
      >
        {currentRank}/{skill.maxRank}
      </div>

      {/* Hover Ring */}
      {isUnlocked && (
        <div className="absolute inset-0 rounded-full border-2 border-white/0 group-hover:border-white/30 transition-all duration-200 pointer-events-none scale-110" />
      )}
    </div>
  );
};

export default SkillNode;
