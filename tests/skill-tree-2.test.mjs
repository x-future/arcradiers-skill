import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { validateBuild } from '../buildRules.mjs';

const source = JSON.parse(readFileSync(new URL('../skill-tree-2.json', import.meta.url), 'utf8'));
const skills = Object.fromEntries(source.branches.flatMap((branch) => branch.talents.map((talent) => [
  talent.id,
  {
    ...talent,
    category: branch.id.toUpperCase(),
    maxRank: talent.maxPoints,
    parentIds: talent.parents,
  },
])));

test('Frozen Trail dataset has three branches of 16 connected skills', () => {
  assert.equal(source.version, 'frozen-trail-2.0');
  assert.deepEqual(source.branches.map((branch) => branch.talents.length), [16, 16, 16]);
  for (const skill of Object.values(skills)) {
    for (const parent of skill.parentIds) assert.ok(skills[parent], `${skill.id} parent ${parent}`);
  }
});

test('choice requires ten branch points and excludes its alternative', () => {
  const tenPoints = {
    used_to_the_weight: 1,
    stubborn_mule: 5,
    three_deep_breaths: 3,
    vault_n_carry: 1,
  };
  assert.equal(validateBuild(skills, { ...tenPoints, mules_gallop: 1 }, 76), true);
  assert.equal(validateBuild(skills, { ...tenPoints, mules_gallop: 1, back_on_your_feet: 1 }, 76), false);
  assert.equal(validateBuild(skills, { ...tenPoints, three_deep_breaths: 2, mules_gallop: 1 }, 76), false);
});

test('final skills unlock at 31 and 41 points, with at most two choices', () => {
  const thirty = {
    used_to_the_weight: 1,
    stubborn_mule: 5,
    three_deep_breaths: 5,
    vault_n_carry: 1,
    vigorous_vaulter: 1,
    mules_gallop: 1,
    loaded_arms: 1,
    broad_shoulders: 5,
    downed_but_determined: 5,
    proficient_pryer: 5,
  };
  assert.equal(validateBuild(skills, { ...thirty, security_breach: 1 }, 76), true);
  assert.equal(validateBuild(skills, { ...thirty, proficient_pryer: 4, security_breach: 1 }, 76), false);
  const fortyOne = { ...thirty, speedy_mule: 5, crawl_before_you_walk: 4, security_breach: 1, bull_rush: 1 };
  assert.equal(validateBuild(skills, fortyOne, 76), true);
  assert.equal(validateBuild(skills, { ...fortyOne, weapon_bash: 1 }, 76), false);
  assert.equal(validateBuild(skills, { ...fortyOne, crawl_before_you_walk: 3 }, 76), false);
});

test('point budget and parent paths are enforced', () => {
  assert.equal(validateBuild(skills, { used_to_the_weight: 1, broad_shoulders: 5 }, 76), false);
  assert.equal(validateBuild(skills, { used_to_the_weight: 2 }, 76), false);
  assert.equal(validateBuild(skills, { invalid_skill: 1 }, 76), false);
  assert.equal(validateBuild(skills, { used_to_the_weight: 1 }, 0), false);
});
