
export enum SkillCategory {
  CONDITIONING = 'CONDITIONING',
  MOBILITY = 'MOBILITY',
  SURVIVAL = 'SURVIVAL'
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  maxRank: number;
  currentRank: number; // For runtime state
  category: SkillCategory;
  parentIds: string[]; // Changed from single parentId to array
  childrenIds: string[];
  x: number; // Grid X
  y: number; // Grid Y
  icon: string; // Icon identifier
  reqPointsInTree: number; // Points required in THIS CATEGORY to unlock
  impactedStat?: string; // Additional metadata from JSON
}

export interface SkillTreeData {
  skills: { [id: string]: Skill };
  maxPoints: number;
}

export interface BuildState {
  pointsSpent: number;
  skills: { [id: string]: number }; // id -> currentRank
}

export type SkillUpdateAction = 'INCREMENT' | 'DECREMENT';
