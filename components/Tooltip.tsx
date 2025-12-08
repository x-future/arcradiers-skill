
import React from 'react';
import { Skill, SkillCategory } from '../types';
import { AlertTriangle, Lock } from 'lucide-react';

interface TooltipProps {
  skill: Skill;
  currentRank: number;
  isUnlocked: boolean;
  reqPoints: number;
  currentCategoryPoints: number;
}

const Tooltip: React.FC<TooltipProps> = ({ skill, currentRank, isUnlocked, reqPoints, currentCategoryPoints }) => {
  let headerColor = 'bg-slate-500';
  let textColor = 'text-slate-500';

  if (skill.category === SkillCategory.CONDITIONING) {
    headerColor = 'bg-emerald-500';
    textColor = 'text-emerald-500';
  } else if (skill.category === SkillCategory.MOBILITY) {
    headerColor = 'bg-yellow-400';
    textColor = 'text-yellow-400';
  } else if (skill.category === SkillCategory.SURVIVAL) {
    headerColor = 'bg-red-600';
    textColor = 'text-red-600';
  }

  // Determine lock reason
  const isTierLocked = reqPoints > 0 && currentCategoryPoints < reqPoints;
  const isParentLocked = !isUnlocked && !isTierLocked; // If tiered unlocked but still locked, must be parent

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-0 rounded-lg shadow-2xl backdrop-blur-xl max-w-xs w-80 pointer-events-none z-50 overflow-hidden relative">
      {/* Header Stripe */}
      <div className={`h-1 w-full ${headerColor}`}></div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-display font-bold text-xl tracking-wide leading-none ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
            {skill.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
           <div className={`text-[10px] font-bold uppercase tracking-widest ${textColor}`}>
             {skill.category}
           </div>
           <span className="text-[10px] font-mono text-zinc-600">ID: {skill.id}</span>
        </div>

        <p className="text-sm text-zinc-300 mb-5 leading-relaxed font-body">
          {skill.description}
        </p>

        {skill.impactedStat && (
          <div className="mb-4 text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2 rounded">
            <span className="text-zinc-500 uppercase mr-2 font-bold">Stat:</span> 
            {skill.impactedStat}
          </div>
        )}

        <div className="space-y-2">
          {/* Rank Display */}
          <div className="flex justify-between items-center text-xs uppercase font-bold tracking-wider bg-zinc-900 p-2 rounded border border-zinc-800">
            <span className="text-zinc-500">Rank</span>
            <span className={`${currentRank === skill.maxRank ? textColor : 'text-white'}`}>
              {currentRank} <span className="text-zinc-600">/</span> {skill.maxRank}
            </span>
          </div>
          
          {/* Lock Warnings */}
          {!isUnlocked && (
            <div className="space-y-1 mt-2">
              {isTierLocked && (
                <div className="flex items-center gap-2 text-xs text-red-400 font-mono bg-red-950/20 p-2 rounded border border-red-900/30">
                   <Lock size={12} />
                   <span>REQ: {reqPoints} Points in {skill.category} (Current: {currentCategoryPoints})</span>
                </div>
              )}
              {isParentLocked && skill.parentIds.length > 0 && (
                 <div className="flex items-center gap-2 text-xs text-orange-400 font-mono bg-orange-950/20 p-2 rounded border border-orange-900/30">
                   <AlertTriangle size={12} />
                   <span>REQ: Connected Skill</span>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
