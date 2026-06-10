function resolveItems(itemData, names) {
  return names.map((name) => {
    const entry = Object.values(itemData).find((item) => item.name === name || item.name?.includes(name) || name.includes(item.name));
    return entry ? entry.name : name;
  });
}

function selectBuildProfile(tags, role) {
  const normalized = tags.map((tag) => tag.toLowerCase());
  if (normalized.includes('assassin')) return 'assassin';
  if (normalized.includes('marksman')) return 'marksman';
  if (normalized.includes('support')) return 'support';
  if (normalized.includes('tank')) return 'tank';
  if (normalized.includes('fighter')) return 'fighter';
  if (normalized.includes('mage')) return 'mage';
  if (role === 'ADC') return 'marksman';
  if (role === 'Mid') return 'mage';
  if (role === 'Top') return 'fighter';
  if (role === 'Jungle') return 'fighter';
  return 'mage';
}

const buildProfiles = {
  assassin: {
    runes: {
      primary: 'Domination',
      keystone: 'Electrocute',
      secondary: 'Sorcery',
      shards: ['Adaptive Force', 'Adaptive Force', 'Armor'],
      details: [
        {
          title: 'Electrocute',
          explanation: 'Favored by champions that burst vulnerable targets quickly and look for trade windows.',
        },
        {
          title: 'Sudden Impact',
          explanation: 'Provides extra lethality after dashes or spell-based engages, fitting assassin champions.',
        },
        {
          title: 'Ravenous Hunter',
          explanation: 'Sustain from spell damage helps recover after trading and skirmishing.',
        },
      ],
    },
    items: {
      start: ["Doran's Blade", 'Health Potion'],
      core: ['Youmuu’s Ghostblade', 'Eclipse', 'Edge of Night'],
      situational: ['Serylda’s Grudge', 'Maw of Malmortius', 'Guardian Angel'],
      final: ['Eclipse', 'Serylda’s Grudge', 'Guardian Angel'],
      explanations: [
        { item: 'Eclipse', reason: 'Burst, movement speed, and survivability for dive-heavy assassin play.' },
        { item: 'Guardian Angel', reason: 'Allows aggressive target selection with a safety net in fights.' },
      ],
    },
  },
  mage: {
    runes: {
      primary: 'Domination',
      keystone: 'Electrocute',
      secondary: 'Inspiration',
      shards: ['Adaptive Force', 'Adaptive Force', 'Magic Resist'],
      details: [
        { title: 'Electrocute', explanation: 'Boosts trade burst and combo damage in lane and skirmishes.' },
        { title: 'Manaflow Band', explanation: 'Improves sustain for repeated spellcasts through the lane phase.' },
        { title: 'Transcendence', explanation: 'Extra cooldown reduction helps hit power spikes faster.' },
      ],
    },
    items: {
      start: ["Doran's Ring", 'Health Potion'],
      core: ['Luden’s Tempest', 'Sorcerer’s Shoes', 'Zhonya’s Hourglass'],
      situational: ['Banshee’s Veil', 'Morellonomicon', 'Shadowflame'],
      final: ['Luden’s Tempest', 'Zhonya’s Hourglass', 'Banshee’s Veil'],
      explanations: [
        { item: 'Luden’s Tempest', reason: 'Strong wave clear and spell damage for mid-game control.' },
        { item: 'Zhonya’s Hourglass', reason: 'Protects against assassins and all-in burst removal.' },
      ],
    },
  },
  marksman: {
    runes: {
      primary: 'Precision',
      keystone: 'Fleet Footwork',
      secondary: 'Domination',
      shards: ['Attack Speed', 'Adaptive Force', 'Armor'],
      details: [
        { title: 'Fleet Footwork', explanation: 'Sustain and movement help survive bot lane poke and position safely.' },
        { title: 'Overheal', explanation: 'Bonus shields improve survivability in extended fights.' },
        { title: 'Legend: Alacrity', explanation: 'Attack speed scaling strengthens mid and late-game damage.' },
      ],
    },
    items: {
      start: ["Doran's Blade", 'Health Potion'],
      core: ['Kraken Slayer', 'Berserker’s Greaves', 'Infinity Edge'],
      situational: ['Guardian Angel', 'Mortal Reminder', 'Phantom Dancer'],
      final: ['Kraken Slayer', 'Infinity Edge', 'Guardian Angel'],
      explanations: [
        { item: 'Kraken Slayer', reason: 'Ideal against tanky frontline with consistent on-hit damage.' },
        { item: 'Infinity Edge', reason: 'Amplifies crits and spikes overall DPS in teamfights.' },
      ],
    },
  },
  fighter: {
    runes: {
      primary: 'Precision',
      keystone: 'Conqueror',
      secondary: 'Resolve',
      shards: ['Attack Speed', 'Adaptive Force', 'Armor'],
      details: [
        { title: 'Conqueror', explanation: 'Builds sustained damage during extended melee trades.' },
        { title: 'Triumph', explanation: 'Health and bonus gold after takedowns help stay in fights.' },
        { title: 'Second Wind', explanation: 'Laner sustain against poke and repeat trades.' },
      ],
    },
    items: {
      start: ["Doran's Blade", 'Health Potion'],
      core: ['Stridebreaker', 'Black Cleaver', 'Sterak’s Gage'],
      situational: ['Thornmail', 'Spirit Visage', 'Death’s Dance'],
      final: ['Stridebreaker', 'Black Cleaver', 'Sterak’s Gage'],
      explanations: [
        { item: 'Stridebreaker', reason: 'Mobility and damage for sticking to key targets.' },
        { item: 'Black Cleaver', reason: 'Shreds armor while amplifying team damage.' },
      ],
    },
  },
  tank: {
    runes: {
      primary: 'Resolve',
      keystone: 'Grasp of the Undying',
      secondary: 'Inspiration',
      shards: ['Health', 'Armor', 'Magic Resist'],
      details: [
        { title: 'Grasp of the Undying', explanation: 'Sustain and scaling health in extended top or support fights.' },
        { title: 'Demolish', explanation: 'Helps siege towers and punish overextended opponents.' },
        { title: 'Bone Plating', explanation: 'Reduces damage from burst trades and engage combos.' },
      ],
    },
    items: {
      start: ['Steel Shoulderguards', 'Health Potion'],
      core: ['Sunfire Aegis', 'Thornmail', 'Spirit Visage'],
      situational: ['Randuin’s Omen', 'Gargoyle Stoneplate', 'Knight’s Vow'],
      final: ['Sunfire Aegis', 'Thornmail', 'Spirit Visage'],
      explanations: [
        { item: 'Sunfire Aegis', reason: 'Frontline durability and constant area damage in teamfights.' },
        { item: 'Thornmail', reason: 'Strong counter to healing and attack damage carry threats.' },
      ],
    },
  },
  support: {
    runes: {
      primary: 'Resolve',
      keystone: 'Guardian',
      secondary: 'Inspiration',
      shards: ['Health', 'Armor', 'Magic Resist'],
      details: [
        { title: 'Guardian', explanation: 'Protects allies during engages and burst exchanges.' },
        { title: 'Font of Life', explanation: 'Adds healing amplification when enemies are impaired.' },
        { title: 'Biscuit Delivery', explanation: 'Extra sustain through the early lane phase.' },
      ],
    },
    items: {
      start: ['Steel Shoulderguards', 'Health Potion'],
      core: ['Locket of the Iron Solari', 'Redemption', 'Plated Steelcaps'],
      situational: ['Mikael’s Blessing', 'Abyssal Mask', 'Knight’s Vow'],
      final: ['Locket of the Iron Solari', 'Redemption', 'Mikael’s Blessing'],
      explanations: [
        { item: 'Locket of the Iron Solari', reason: 'Provides an instant shield for teamfight engages.' },
        { item: 'Redemption', reason: 'Adds global healing and fight-turning support utility.' },
      ],
    },
  },
};

function buildEnemyAdaptation(enemyInput) {
  const enemies = enemyInput
    .split(',')
    .map((enemy) => enemy.trim().toLowerCase())
    .filter(Boolean);

  const adaptation = [];
  if (enemies.some((e) => ['zed', 'talon', 'kha\'zix', 'ekko', 'leblanc'].includes(e))) {
    adaptation.push('Prioritize defensive timing items and vision to survive assassination threats.');
  }
  if (enemies.some((e) => ['leona', 'blitzcrank', 'thresh', 'alistar'].includes(e))) {
    adaptation.push('Expect strong engage; keep distance and favor shields or magic resist.');
  }
  if (enemies.some((e) => ['vayne', 'kai\'sa', 'caitlyn'].includes(e))) {
    adaptation.push('Build for sustained DPS and anti-heal when the enemy carry is the main threat.');
  }
  return adaptation.length ? adaptation.join(' ') : 'This build stays balanced for common skirmishes and objective control.';
}

export function recommendBuild(champion, role, enemyInput, itemData) {
  const profileKey = selectBuildProfile(champion.tags || [], role);
  const profile = buildProfiles[profileKey];
  const runes = profile.runes;
  const items = {
    start: resolveItems(itemData, profile.items.start),
    core: resolveItems(itemData, profile.items.core),
    situational: resolveItems(itemData, profile.items.situational),
    final: resolveItems(itemData, profile.items.final),
    explanations: profile.items.explanations,
  };

  const enemies = enemyInput
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  return {
    championName: champion.name,
    description: champion.description,
    runes,
    items,
    analysis: {
      strategy: `Use ${champion.name} as a ${role.toLowerCase()} with a focus on ${profileKey} strengths and matchup adaptability.`,
      powerSpikes: [
        'Early item recall should transition into a clean mid-game power spike.',
        `Use ${runes.keystone} to open trades and secure kills or lane control.`,
        `Focus on objectives once core items are completed and the enemy team is pressured.`,
      ],
      laneApproach: `Win trades with strong poke and ability rotation, then look for roams or objective control depending on the role.`,
      teamfight: `Position around the strongest enemy threats, either diving the carry or protecting your own backline.`,
      adaptation: buildEnemyAdaptation(enemyInput),
    },
  };
}
