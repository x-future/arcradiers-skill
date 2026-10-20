import { Skill, SkillCategory, SkillTreeData } from './types';
import source from './skill-tree-2.json';

const branchCenters: Record<string, number> = {
  conditioning: 25,
  mobility: 50,
  survival: 75,
};
const laneOffsets: Record<string, number> = {
  root: 0,
  a: -4,
  b: 4,
  left: -6,
  center: 0,
  right: 6,
};

const skills: Record<string, Skill> = {};

for (const branch of source.branches) {
  const choices = branch.talents.filter((talent) => talent.nodeType === 'choice');
  const finals = branch.talents.filter((talent) => talent.nodeType === 'final');

  for (const talent of branch.talents) {
    const x = branchCenters[branch.id]
      + (talent.nodeType === 'choice'
        ? (choices.indexOf(talent) === 0 ? -3 : 3)
        : talent.nodeType === 'final'
          ? (finals.indexOf(talent) - 1) * 6
          : laneOffsets[talent.lane]);

    skills[talent.id] = {
      id: talent.id,
      name: talent.name,
      description: talent.id === 'sprinting_on_fumes'
        ? `${talent.description} During the recovery cooldown, stamina items cannot be used and Fight or Flight does not bypass the penalty (Update 2.1.0).`
        : talent.detail && talent.detail !== talent.description
        ? `${talent.description} ${talent.detail}`
        : talent.description,
      category: branch.id.toUpperCase() as SkillCategory,
      maxRank: talent.maxPoints,
      currentRank: 0,
      parentIds: talent.parents,
      childrenIds: [],
      x,
      y: 75 - talent.tier * 10,
      icon: talent.id,
      reqPointsInTree: talent.requiredBranchPoints,
      choiceGroup: talent.choiceGroup || undefined,
      nodeType: talent.nodeType,
    };
  }
}

for (const skill of Object.values(skills)) {
  for (const parentId of skill.parentIds) {
    skills[parentId].childrenIds.push(skill.id);
  }
}

export const TREE_VERSION = source.version;
export const POINT_BUDGETS = [76, 81, 86, 91] as const;
export const INITIAL_DATA: SkillTreeData = { skills, maxPoints: 91 };
