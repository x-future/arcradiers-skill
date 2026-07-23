import { BuildState, SkillTreeData } from '../types';

export type AIAdvisorMode = 'generate' | 'review';

export interface AIAdvisorPreferences {
  budget: 76 | 81 | 86 | 91;
  squadSize: 'solo' | 'duo' | 'trio';
  focus: 'balanced' | 'pvp' | 'arc-hunting' | 'looting' | 'trials';
  playstyle: 'aggressive' | 'safe' | 'stealth' | 'mobility';
  notes: string;
}

export interface AIAllocation {
  skillId: string;
  rank: number;
}

export interface AIChange {
  skillId: string;
  from: number;
  to: number;
  reason: string;
}

export interface AIAdvisorResult {
  title: string;
  summary: string;
  allocations: AIAllocation[];
  upgradeOrder: string[];
  reasons: string[];
  tradeoffs: string[];
  changes: AIChange[];
  warnings: string[];
  totalPoints: number;
}

export async function requestAIAdvice(
  mode: AIAdvisorMode,
  preferences: AIAdvisorPreferences,
  treeData: SkillTreeData,
  currentBuild: BuildState
): Promise<AIAdvisorResult> {
  const skills = Object.values(treeData.skills).map((skill) => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    maxRank: skill.maxRank,
    category: skill.category,
    parentIds: skill.parentIds,
    reqPointsInTree: skill.reqPointsInTree,
  }));

  const response = await fetch('/api/ai/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      preferences,
      currentBuild,
      skills,
      treeVersion: '1.38.0',
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'AI service is unavailable.');
  }

  return payload as AIAdvisorResult;
}
