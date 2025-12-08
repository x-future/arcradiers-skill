
import { Skill, SkillCategory, SkillTreeData } from './types';

// Raw JSON Data with explicit requirements
const RAW_JSON = [
  // === CONDITIONING ===
  { 
    "id": "cond_1", "name": { "en": "Used To The Weight" }, "description": { "en": "Wearing a shield doesn't slow you down as much." }, 
    "impactedSkill": { "en": "Movement Speed" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "used_to_the_weight", 
    "position": { "x": 25, "y": 75 }, "prerequisiteNodeIds": [], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_2l", "name": { "en": "Blast-Born" }, "description": { "en": "Your hearing is less affected by nearby explosions." }, 
    "impactedSkill": { "en": "Hearing Enhancement" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "blast_born", 
    "position": { "x": 20, "y": 65 }, "prerequisiteNodeIds": ["cond_1"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_2r", "name": { "en": "Gentle Pressure" }, "description": { "en": "You make less noise when breaching." }, 
    "impactedSkill": { "en": "Noise Reduction" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "gentle_pressure", 
    "position": { "x": 30, "y": 65 }, "prerequisiteNodeIds": ["cond_1"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_3l", "name": { "en": "Fight Or Flight" }, "description": { "en": "When you're hurt in combat, regain a fixed amount of stamina. Has cooldown between uses." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "fight_or_flight", 
    "position": { "x": 20, "y": 55 }, "prerequisiteNodeIds": ["cond_2l"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_3r", "name": { "en": "Proficient Pryer" }, "description": { "en": "Breaching doors and containers takes less time" }, 
    "impactedSkill": { "en": "Breach Time Reduction" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "proficient_pryer", 
    "position": { "x": 30, "y": 55 }, "prerequisiteNodeIds": ["cond_2r"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_4l", "name": { "en": "Survivor's Stamina" }, "description": { "en": "When you're critically hurt, your stamina regenerates faster." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "CONDITIONING", "maxPoints": 1, "iconName": "survivors_stamina", 
    "position": { "x": 20, "y": 45 }, "prerequisiteNodeIds": ["cond_3l"], "reqPointsInTree": 15 
  },
  { 
    "id": "cond_4r", "name": { "en": "Unburdened Roll" }, "description": { "en": "If your shield breaks, your first Dodge Roll within a few seconds does not cost stamina." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "CONDITIONING", "maxPoints": 1, "iconName": "unburdened_roll", 
    "position": { "x": 30, "y": 45 }, "prerequisiteNodeIds": ["cond_3r"], "reqPointsInTree": 15 
  },
  { 
    "id": "cond_5c", "name": { "en": "A Little Extra" }, "description": { "en": "Breaching an object generates resources." }, 
    "impactedSkill": { "en": "Resource Generation" }, "category": "CONDITIONING", "maxPoints": 1, "iconName": "a_little_extra", 
    "position": { "x": 25, "y": 35 }, "prerequisiteNodeIds": ["cond_4l", "cond_4r"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_5l", "name": { "en": "Downed But Determined" }, "description": { "en": "When you're downed, it takes longer before you collapse." }, 
    "impactedSkill": { "en": "Downed Duration" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "downed_but_determined", 
    "position": { "x": 20, "y": 35 }, "prerequisiteNodeIds": ["cond_4l"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_5r", "name": { "en": "Effortless Swing" }, "description": { "en": "Melee abilities cost less stamina" }, 
    "impactedSkill": { "en": "Stamina Cost Reduction" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "effortless_swing", 
    "position": { "x": 30, "y": 35 }, "prerequisiteNodeIds": ["cond_4r"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_6c", "name": { "en": "Loaded Arms" }, "description": { "en": "Your equipped weapon has less impact on your encumbrance." }, 
    "impactedSkill": { "en": "Encumbrance Reduction" }, "category": "CONDITIONING", "maxPoints": 1, "iconName": "loaded_arms", 
    "position": { "x": 25, "y": 25 }, "prerequisiteNodeIds": ["cond_5c"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_6l", "name": { "en": "Turtle Crawl" }, "description": { "en": "While downed, you take less damage." }, 
    "impactedSkill": { "en": "Downed Damage Reduction" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "turtle_crawl", 
    "position": { "x": 20, "y": 25 }, "prerequisiteNodeIds": ["cond_5l"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_6r", "name": { "en": "Sky-Clearing Swing" }, "description": { "en": "You deal more melee damage to drones." }, 
    "impactedSkill": { "en": "Melee Damage" }, "category": "CONDITIONING", "maxPoints": 5, "iconName": "sky_clearing_swing", 
    "position": { "x": 30, "y": 25 }, "prerequisiteNodeIds": ["cond_5r"], "reqPointsInTree": 0 
  },
  { 
    "id": "cond_7l", "name": { "en": "Back On Your Feet" }, "description": { "en": "When you're critically hurt, your health regenerates until a certain limit." }, 
    "impactedSkill": { "en": "Health Regeneration" }, "category": "CONDITIONING", "maxPoints": 1, "iconName": "back_on_your_feet", 
    "position": { "x": 20, "y": 15 }, "prerequisiteNodeIds": ["cond_6l", "cond_6c"], "reqPointsInTree": 36 
  },
  { 
    "id": "cond_7r", "name": { "en": "Flyswatter" }, "description": { "en": "Wasps and Turrets can now be destroyed with a single melee attack" }, 
    "impactedSkill": { "en": "Melee Damage" }, "category": "CONDITIONING", "maxPoints": 1, "iconName": "flyswatter", 
    "position": { "x": 30, "y": 15 }, "prerequisiteNodeIds": ["cond_6r", "cond_6c"], "reqPointsInTree": 36 
  },

  // === MOBILITY ===
  { 
    "id": "mob_1", "name": { "en": "Nimble Climber" }, "description": { "en": "You can climb and vault more quickly." }, 
    "impactedSkill": { "en": "Climb and Vault Speed" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "nimble_climber", 
    "position": { "x": 50, "y": 75 }, "prerequisiteNodeIds": [], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_2l", "name": { "en": "Marathon Runner" }, "description": { "en": "Moving around costs less stamina." }, 
    "impactedSkill": { "en": "Stamina Cost Reduction" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "marathon_runner", 
    "position": { "x": 45, "y": 65 }, "prerequisiteNodeIds": ["mob_1"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_2r", "name": { "en": "Slip and Slide" }, "description": { "en": "You can slide further and faster." }, 
    "impactedSkill": { "en": "Slide Distance" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "slip_and_slide", 
    "position": { "x": 55, "y": 65 }, "prerequisiteNodeIds": ["mob_1"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_3l", "name": { "en": "Youthful Lungs" }, "description": { "en": "Increase your max stamina." }, 
    "impactedSkill": { "en": "Max Stamina" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "youthful_lungs", 
    "position": { "x": 45, "y": 55 }, "prerequisiteNodeIds": ["mob_2l"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_3r", "name": { "en": "Sturdy Ankles" }, "description": { "en": "You take less fall damage when falling from a non-lethal height." }, 
    "impactedSkill": { "en": "Fall Damage Reduction" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "sturdy_ankles", 
    "position": { "x": 55, "y": 55 }, "prerequisiteNodeIds": ["mob_2r"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_4l", "name": { "en": "Carry The Momentum" }, "description": { "en": "After a Sprint Dodge Roll, sprinting does not consume stamina for a short time. Has a cooldown between uses." }, 
    "impactedSkill": { "en": "Stamina Cost Reduction" }, "category": "MOBILITY", "maxPoints": 1, "iconName": "carry_the_momentum", 
    "position": { "x": 45, "y": 45 }, "prerequisiteNodeIds": ["mob_3l"], "reqPointsInTree": 15 
  },
  { 
    "id": "mob_4r", "name": { "en": "Calming Stroll" }, "description": { "en": "While walking, your stamina regenerates as if you were standing still." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "MOBILITY", "maxPoints": 1, "iconName": "calming_stroll", 
    "position": { "x": 55, "y": 45 }, "prerequisiteNodeIds": ["mob_3r"], "reqPointsInTree": 15 
  },
  { 
    "id": "mob_5c", "name": { "en": "Crawl Before You Walk" }, "description": { "en": "When you're downed, you crawl faster." }, 
    "impactedSkill": { "en": "Movement Speed" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "crawl_before_you_walk", 
    "position": { "x": 50, "y": 35 }, "prerequisiteNodeIds": ["mob_4l", "mob_4r"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_5l", "name": { "en": "Effortless Roll" }, "description": { "en": "Dodge Rolls cost less stamina." }, 
    "impactedSkill": { "en": "Stamina Cost Reduction" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "effortless_roll", 
    "position": { "x": 45, "y": 35 }, "prerequisiteNodeIds": ["mob_4l"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_5r", "name": { "en": "Off The Wall" }, "description": { "en": "You can Wall Leap further." }, 
    "impactedSkill": { "en": "Wall Leap Distance" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "off_the_wall", 
    "position": { "x": 55, "y": 35 }, "prerequisiteNodeIds": ["mob_4r"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_6c", "name": { "en": "Vigorous Vaulter" }, "description": { "en": "Vaulting is no longer slowed down while exhausted." }, 
    "impactedSkill": { "en": "Climb and Vault Speed" }, "category": "MOBILITY", "maxPoints": 1, "iconName": "vigorous_vaulter", 
    "position": { "x": 50, "y": 25 }, "prerequisiteNodeIds": ["mob_5c"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_6l", "name": { "en": "Heroic Leap" }, "description": { "en": "You can Sprint Dodge Roll further." }, 
    "impactedSkill": { "en": "Roll Distance" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "heroic_leap", 
    "position": { "x": 45, "y": 25 }, "prerequisiteNodeIds": ["mob_5l"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_6r", "name": { "en": "Ready To Roll" }, "description": { "en": "When falling, your timing window to perform a Recovery Roll is increased." }, 
    "impactedSkill": { "en": "Recover Roll Window" }, "category": "MOBILITY", "maxPoints": 5, "iconName": "ready_to_roll", 
    "position": { "x": 55, "y": 25 }, "prerequisiteNodeIds": ["mob_5r"], "reqPointsInTree": 0 
  },
  { 
    "id": "mob_7l", "name": { "en": "Vaults on Vaults on Vaults" }, "description": { "en": "Vaulting no longer costs stamina." }, 
    "impactedSkill": { "en": "Stamina Cost Reduction" }, "category": "MOBILITY", "maxPoints": 1, "iconName": "vaults_on_vaults_on_vaults", 
    "position": { "x": 45, "y": 15 }, "prerequisiteNodeIds": ["mob_6l", "mob_6c"], "reqPointsInTree": 36 
  },
  { 
    "id": "mob_7r", "name": { "en": "Vault Spring" }, "description": { "en": "Lets you jump at the end of a vault." }, 
    "impactedSkill": { "en": "Vault Jump" }, "category": "MOBILITY", "maxPoints": 1, "iconName": "vault_spring", 
    "position": { "x": 55, "y": 15 }, "prerequisiteNodeIds": ["mob_6r", "mob_6c"], "reqPointsInTree": 36 
  },

  // === SURVIVAL ===
  { 
    "id": "surv_1", "name": { "en": "Agile Croucher" }, "description": { "en": "Your movement speed while crouching is increased." }, 
    "impactedSkill": { "en": "Movement Speed" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "agile_croucher", 
    "position": { "x": 75, "y": 75 }, "prerequisiteNodeIds": [], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_2l", "name": { "en": "Looter's Instincts" }, "description": { "en": "When searching a container, loot is revealed faster." }, 
    "impactedSkill": { "en": "Loot Speed" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "looters_instincts", 
    "position": { "x": 70, "y": 65 }, "prerequisiteNodeIds": ["surv_1"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_2r", "name": { "en": "Revitalizing Squat" }, "description": { "en": "Stamina regeneration while crouched is increased." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "revitalizing_squat", 
    "position": { "x": 80, "y": 65 }, "prerequisiteNodeIds": ["surv_1"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_3l", "name": { "en": "Silent Scavenger" }, "description": { "en": "You make less noise when looting" }, 
    "impactedSkill": { "en": "Noise Reduction" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "silent_scavenger", 
    "position": { "x": 70, "y": 55 }, "prerequisiteNodeIds": ["surv_2l"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_3r", "name": { "en": "In-Round Crafting" }, "description": { "en": "Unlocks the ability to field-craft items while topside." }, 
    "impactedSkill": { "en": "Field Crafting" }, "category": "SURVIVAL", "maxPoints": 1, "iconName": "in_round_crafting", 
    "position": { "x": 80, "y": 55 }, "prerequisiteNodeIds": ["surv_2r"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_4l", "name": { "en": "Suffer In Silence" }, "description": { "en": "While critically hurt, your movement makes less noise." }, 
    "impactedSkill": { "en": "Noise Reduction" }, "category": "SURVIVAL", "maxPoints": 1, "iconName": "suffer_in_silence", 
    "position": { "x": 70, "y": 45 }, "prerequisiteNodeIds": ["surv_3l"], "reqPointsInTree": 15 
  },
  { 
    "id": "surv_4r", "name": { "en": "Good As New" }, "description": { "en": "While under a healing effect, stamina regeneration is increased." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "SURVIVAL", "maxPoints": 1, "iconName": "good_as_new", 
    "position": { "x": 80, "y": 45 }, "prerequisiteNodeIds": ["surv_3r"], "reqPointsInTree": 15 
  },
  { 
    "id": "surv_5c", "name": { "en": "Traveling Tinkerer" }, "description": { "en": "Unlocks additional items to field craft." }, 
    "impactedSkill": { "en": "Field Crafting" }, "category": "SURVIVAL", "maxPoints": 1, "iconName": "traveling_tinkerer", 
    "position": { "x": 75, "y": 35 }, "prerequisiteNodeIds": ["surv_4l", "surv_4r"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_5l", "name": { "en": "Broad Shoulders" }, "description": { "en": "Increases the maximum amount of items you can carry." }, 
    "impactedSkill": { "en": "Max Inventory" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "broad_shoulders", 
    "position": { "x": 70, "y": 35 }, "prerequisiteNodeIds": ["surv_4l"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_5r", "name": { "en": "Stubborn Mule" }, "description": { "en": "Your stamina regeneration is less affected by being over-encumbered." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "stubborn_mule", 
    "position": { "x": 80, "y": 35 }, "prerequisiteNodeIds": ["surv_4r"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_6c", "name": { "en": "One Raider's Scraps" }, "description": { "en": "When looting Raider containers, you have a small chance of finding additional field-crafted items." }, 
    "impactedSkill": { "en": "Loot Find Chance" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "one_raiders_scraps", 
    "position": { "x": 75, "y": 25 }, "prerequisiteNodeIds": ["surv_5c"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_6l", "name": { "en": "Looter's Luck" }, "description": { "en": "While looting, there's a chance to reveal twice as many items at once." }, 
    "impactedSkill": { "en": "Loot Search Speed" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "looters_luck", 
    "position": { "x": 70, "y": 25 }, "prerequisiteNodeIds": ["surv_5l"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_6r", "name": { "en": "Three Deep Breaths" }, "description": { "en": "After an ability drains your stamina, you recover more quickly." }, 
    "impactedSkill": { "en": "Stamina Regeneration" }, "category": "SURVIVAL", "maxPoints": 5, "iconName": "three_deep_breaths", 
    "position": { "x": 80, "y": 25 }, "prerequisiteNodeIds": ["surv_5r"], "reqPointsInTree": 0 
  },
  { 
    "id": "surv_7l", "name": { "en": "Security Breach" }, "description": { "en": "Lets you breach Security Lockers." }, 
    "impactedSkill": { "en": "Security Breach" }, "category": "SURVIVAL", "maxPoints": 1, "iconName": "security_breach", 
    "position": { "x": 70, "y": 15 }, "prerequisiteNodeIds": ["surv_6l", "surv_6c"], "reqPointsInTree": 36 
  },
  { 
    "id": "surv_7r", "name": { "en": "Minesweeper" }, "description": { "en": "Mines and explosive deployables can be defused when in close proximity." }, 
    "impactedSkill": { "en": "Explosive Defuse" }, "category": "SURVIVAL", "maxPoints": 1, "iconName": "minesweeper", 
    "position": { "x": 80, "y": 15 }, "prerequisiteNodeIds": ["surv_6r", "surv_6c"], "reqPointsInTree": 36 
  }
];

const skillsMap: { [id: string]: Skill } = {};

// Transform JSON to internal Skill format
RAW_JSON.forEach((raw) => {
  skillsMap[raw.id] = {
    id: raw.id,
    name: raw.name.en,
    description: raw.description.en,
    impactedStat: raw.impactedSkill?.en,
    category: raw.category as SkillCategory,
    maxRank: raw.maxPoints,
    currentRank: 0,
    parentIds: raw.prerequisiteNodeIds,
    childrenIds: [], // Populated later
    x: raw.position.x,
    y: raw.position.y,
    icon: raw.iconName,
    reqPointsInTree: raw.reqPointsInTree
  };
});

// Populate childrenIds
Object.values(skillsMap).forEach(skill => {
  skill.parentIds.forEach(parentId => {
    if (skillsMap[parentId]) {
      skillsMap[parentId].childrenIds.push(skill.id);
    }
  });
});

export const INITIAL_DATA: SkillTreeData = {
  skills: skillsMap,
  maxPoints: 75
};
