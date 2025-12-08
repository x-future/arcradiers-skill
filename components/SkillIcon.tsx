
import React from 'react';
import { 
  Weight, Bomb, Feather, HeartPulse, Hammer, Zap, RefreshCw, Plus, 
  Activity, Swords, Dumbbell, Shield, Crosshair, ArrowUpCircle, Gavel,
  TrendingUp, FastForward, ChevronsRight, Wind, ArrowDown, Timer, Sunrise,
  MoveHorizontal, RotateCcw, ArrowUpRight, Trophy, Rocket, Watch, Layers, ArrowUp,
  Minimize2, Eye, Battery, Ghost, Wrench, VolumeX, Sparkles, Briefcase, 
  Backpack, Package, Coins, Clover, Cloud, Unlock, Scissors,
  Skull, Hexagon, User, Box, Radio
} from 'lucide-react';

interface SkillIconProps {
  iconName: string;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

const SkillIcon: React.FC<SkillIconProps> = ({ iconName, size, className, style }) => {
  const props = { size, className, style };

  // Mapping from ARC Raiders skill IDs/names to Lucide Icons
  // Based on the 'iconName' field in data.ts (minus .png)
  switch (iconName) {
    // === CONDITIONING ===
    case 'used_to_the_weight': return <Weight {...props} />;
    case 'blast_born': return <Bomb {...props} />;
    case 'gentle_pressure': return <Feather {...props} />;
    case 'fight_or_flight': return <HeartPulse {...props} />;
    case 'proficient_pryer': return <Hammer {...props} />;
    case 'survivors_stamina': return <Zap {...props} />;
    case 'unburdened_roll': return <RefreshCw {...props} />;
    case 'a_little_extra': return <Plus {...props} />;
    case 'downed_but_determined': return <Skull {...props} />;
    case 'effortless_swing': return <Swords {...props} />;
    case 'loaded_arms': return <Dumbbell {...props} />;
    case 'turtle_crawl': return <Shield {...props} />;
    case 'sky_clearing_swing': return <Crosshair {...props} />;
    case 'back_on_your_feet': return <ArrowUpCircle {...props} />;
    case 'flyswatter': return <Gavel {...props} />;

    // === MOBILITY ===
    case 'nimble_climber': return <TrendingUp {...props} />;
    case 'marathon_runner': return <FastForward {...props} />;
    case 'slip_and_slide': return <ChevronsRight {...props} />;
    case 'youthful_lungs': return <Wind {...props} />;
    case 'sturdy_ankles': return <ArrowDown {...props} />;
    case 'carry_the_momentum': return <Timer {...props} />;
    case 'calming_stroll': return <Sunrise {...props} />;
    case 'crawl_before_you_walk': return <MoveHorizontal {...props} />;
    case 'effortless_roll': return <RotateCcw {...props} />;
    case 'off_the_wall': return <ArrowUpRight {...props} />;
    case 'vigorous_vaulter': return <Trophy {...props} />;
    case 'heroic_leap': return <Rocket {...props} />;
    case 'ready_to_roll': return <Watch {...props} />;
    case 'vaults_on_vaults_on_vaults': return <Layers {...props} />;
    case 'vault_spring': return <ArrowUp {...props} />;

    // === SURVIVAL ===
    case 'agile_croucher': return <Minimize2 {...props} />;
    case 'looters_instincts': return <Eye {...props} />;
    case 'revitalizing_squat': return <Battery {...props} />;
    case 'silent_scavenger': return <Ghost {...props} />;
    case 'in_round_crafting': return <Wrench {...props} />;
    case 'suffer_in_silence': return <VolumeX {...props} />;
    case 'good_as_new': return <Sparkles {...props} />;
    case 'traveling_tinkerer': return <Briefcase {...props} />;
    case 'broad_shoulders': return <Backpack {...props} />;
    case 'stubborn_mule': return <Package {...props} />;
    case 'one_raiders_scraps': return <Coins {...props} />;
    case 'looters_luck': return <Clover {...props} />;
    case 'three_deep_breaths': return <Cloud {...props} />;
    case 'security_breach': return <Unlock {...props} />;
    case 'minesweeper': return <Scissors {...props} />;

    // Fallback
    default: return <Hexagon {...props} />;
  }
};

export default SkillIcon;
