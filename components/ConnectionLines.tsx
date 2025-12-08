
import React from 'react';
import { Skill, BuildState, SkillCategory } from '../types';

interface ConnectionLinesProps {
  skills: { [id: string]: Skill };
  buildState: BuildState;
  cellWidth: number;
  cellHeight: number;
  getCategoryPoints: (category: SkillCategory, currentSkills: { [id: string]: number }) => number;
  offsetX: number;
  offsetY: number;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ skills, buildState, cellWidth, cellHeight, getCategoryPoints, offsetX, offsetY }) => {
  const getPosition = (skill: Skill) => ({
    x: (skill.x - offsetX) * cellWidth + cellWidth / 2,
    y: (skill.y - offsetY) * cellHeight + cellHeight / 2
  });

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
      {Object.values(skills).map((skill: Skill) => {
        if (!skill.parentIds || skill.parentIds.length === 0) return null;

        return skill.parentIds.map(parentId => {
          const parent = skills[parentId];
          if (!parent) return null;

          const start = getPosition(parent);
          const end = getPosition(skill);

          const isSelfActive = (buildState.skills[skill.id] || 0) > 0;
          const isParentActive = (buildState.skills[parent.id] || 0) > 0;
          const catPoints = getCategoryPoints(skill.category, buildState.skills);
          const isTierUnlocked = skill.reqPointsInTree === 0 || catPoints >= skill.reqPointsInTree;
          
          let strokeColor = '#27272a'; // Dark Grey (Inactive)
          let opacity = 1;
          let strokeWidth = 2;

          if (isSelfActive) {
            // Active Path
            if (skill.category === SkillCategory.CONDITIONING) strokeColor = '#26d672';
            else if (skill.category === SkillCategory.MOBILITY) strokeColor = '#d19a53';
            else if (skill.category === SkillCategory.SURVIVAL) strokeColor = '#ff4444';
            strokeWidth = 3;
          } else if (isParentActive && isTierUnlocked) {
            // Unlocked Potential Path
            strokeColor = '#71717a'; // Lighter Grey
          }

          // Bezier Curve Logic
          // We want a vertical S-curve. 
          // Control Point 1: Start + vertical offset up
          // Control Point 2: End + vertical offset down
          // Since Y coordinates decrease as we go UP the tree (root is 75, leaf is 15),
          // Parent (bottom) has HIGHER Y value than Child (top).
          // Start Y > End Y.
          // We want the curve to leave the parent upwards (negative Y delta) and enter child upwards.
          
          const dist = Math.abs(start.y - end.y) * 0.5;
          // Control points
          const cp1x = start.x;
          const cp1y = start.y - dist; // Go Up
          const cp2x = end.x;
          const cp2y = end.y + dist;   // Come from Down

          const d = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

          return (
            <path
              key={`${parent.id}-${skill.id}`}
              d={d}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-colors duration-300"
              style={{ opacity }}
            />
          );
        });
      })}
    </svg>
  );
};

export default ConnectionLines;
