import React from 'react';
import { INITIAL_DATA, POINT_BUDGETS, TREE_VERSION } from '../data';

export default function SkillReference() {
  return <section className="home-wrap home-section" aria-labelledby="tree-reference-title">
    <div className="section-kicker">SKILL TREE / PLANNING REFERENCE</div>
    <h2 id="tree-reference-title">How the ARC Raiders skill tree works</h2>
    <p>The ARC Raiders skill tree has three branches: Conditioning, Mobility and Survival. This community planner models {Object.keys(INITIAL_DATA.skills).length} skills in the {TREE_VERSION} dataset and supports {POINT_BUDGETS.join(', ')}-point budgets. Choose your budget before allocating points; not every player has the same Expedition progression.</p>
    <p>Spend points along connected paths. A skill may require an earlier skill, a minimum investment in its branch or a choice within a limited group. The planner checks these requirements and the total budget when loading a shared build.</p>
    <div className="guide-list">
      <a href="/blog/ultimate-conditioning-guide.html"><h3>Conditioning: carrying equipment and managing physical strain</h3></a>
      <a href="/blog/mobility-mastery-guide.html"><h3>Mobility: movement, stamina and traversal</h3></a>
      <a href="/blog/survival-branch-complete-guide.html"><h3>Survival: looting, supplies and recovery</h3></a>
    </div>
    <p>Start with your role and point budget, compare prerequisites, then save a share link from the <a href="/planner/">interactive skill planner</a>. There is no single best allocation for every solo, squad or PvP run.</p>
    <p className="affiliate-note">Data scope: this is a community planning model, not a live game API. Patches can change skill behavior. See the <a href="https://arcraiders.com/news/frozen-trail-2-0-update" target="_blank" rel="noopener noreferrer">official Frozen Trail update</a>, <a href="https://arcraiders.com/news/store-update-2-1-0" target="_blank" rel="noopener noreferrer">2.1.0 corrections</a> and our <a href="/blog/arc-raiders-20-best-skill-tree-builds-for-pvpve-solo--squad.html">source-attributed build comparison</a>. Exact unknown values are marked in the planner; build recommendations are not independently verified in game.</p>
  </section>;
}
