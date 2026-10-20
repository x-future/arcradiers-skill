export function validateBuild(skills, ranks, budget) {
  let total = 0;
  const branchPoints = new Map();
  const groups = new Map();

  for (const [id, rank] of Object.entries(ranks)) {
    const skill = skills[id];
    if (!skill || !Number.isInteger(rank) || rank < 0 || rank > skill.maxRank) return false;
    total += rank;
    branchPoints.set(skill.category, (branchPoints.get(skill.category) || 0) + rank);
    if (rank && skill.choiceGroup) {
      groups.set(skill.choiceGroup, (groups.get(skill.choiceGroup) || 0) + 1);
    }
  }
  if (total > budget) return false;

  for (const [group, count] of groups) {
    if (count > (group.endsWith('_final') ? 2 : 1)) return false;
  }

  for (const [id, rank] of Object.entries(ranks)) {
    if (!rank) continue;
    const skill = skills[id];
    if (skill.parentIds.length && !skill.parentIds.some((parent) => ranks[parent] > 0)) return false;
    const spent = branchPoints.get(skill.category) || 0;
    if (skill.nodeType === 'choice' && spent - 1 < 10) return false;
    if (skill.nodeType === 'final') {
      const finalCount = groups.get(skill.choiceGroup) || 0;
      if (spent - finalCount < (finalCount === 2 ? 39 : 30)) return false;
    }
  }
  return true;
}
