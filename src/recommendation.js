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

const treeMap = {
  assassin: { primary: 8100, secondary: 8200 },
  marksman: { primary: 8000, secondary: 8100 },
  support: { primary: 8400, secondary: 8300 },
  tank: { primary: 8400, secondary: 8300 },
  fighter: { primary: 8000, secondary: 8400 },
  mage: { primary: 8100, secondary: 8200 },
};

function buildRuneRecommendation(profile, runesData) {
  const primaryTreeId = treeMap[profile].primary;
  const secondaryTreeId = treeMap[profile].secondary;
  const primaryTree = Object.values(runesData).find((t) => t.id === primaryTreeId);
  const secondaryTree = Object.values(runesData).find((t) => t.id === secondaryTreeId);

  if (!primaryTree) {
    return {
      primary: 'Primary Tree',
      keystone: 'Keystone',
      secondary: 'Secondary Tree',
      shards: ['Adaptive Force', 'Adaptive Force', 'Armor'],
      details: [],
    };
  }

  const keystone = primaryTree.slots[0]?.runes[0];

  return {
    primary: primaryTree.name,
    keystone: keystone?.name || 'Keystone',
    secondary: secondaryTree?.name || 'Secondary Tree',
    shards: ['Adaptive Force', 'Adaptive Force', 'Armor'],
    details: [
      {
        title: keystone?.name || 'Primary Keystone',
        explanation: keystone?.description || 'Enhances your champion ability and playstyle.',
      },
      {
        title: 'Secondary Rune Path',
        explanation: 'Provides additional utility or stats to round out your build.',
      },
      {
        title: 'Stat Shards',
        explanation: 'Choose adaptive force for offense, armor for defense, or magic resist for survival.',
      },
    ],
  };
}

const itemProfiles = {
  assassin: {
    start: ["Doran's Blade", 'Health Potion'],
    core: ["Youmuu's Ghostblade", 'Eclipse', 'Edge of Night'],
    situational: ["Serylda's Grudge", 'Maw of Malmortius', 'Guardian Angel'],
    final: ['Eclipse', "Serylda's Grudge", 'Guardian Angel'],
    explanations: [
      { item: 'Eclipse', reason: 'Burst, movement speed, and survivability for dive-heavy assassin play.' },
      { item: 'Guardian Angel', reason: 'Allows aggressive target selection with a safety net in fights.' },
    ],
  },
  mage: {
    start: ["Doran's Ring", 'Health Potion'],
    core: ["Luden's Tempest", "Sorcerer's Shoes", "Zhonya's Hourglass"],
    situational: ["Banshee's Veil", 'Morellonomicon', 'Shadowflame'],
    final: ["Luden's Tempest", "Zhonya's Hourglass", "Banshee's Veil"],
    explanations: [
      { item: "Luden's Tempest", reason: 'Strong wave clear and spell damage for mid-game control.' },
      { item: "Zhonya's Hourglass", reason: 'Protects against assassins and all-in burst removal.' },
    ],
  },
  marksman: {
    start: ["Doran's Blade", 'Health Potion'],
    core: ['Kraken Slayer', "Berserker's Greaves", 'Infinity Edge'],
    situational: ['Guardian Angel', 'Mortal Reminder', 'Phantom Dancer'],
    final: ['Kraken Slayer', 'Infinity Edge', 'Guardian Angel'],
    explanations: [
      { item: 'Kraken Slayer', reason: 'Ideal against tanky frontline with consistent on-hit damage.' },
      { item: 'Infinity Edge', reason: 'Amplifies crits and spikes overall DPS in teamfights.' },
    ],
  },
  fighter: {
    start: ["Doran's Blade", 'Health Potion'],
    core: ['Stridebreaker', 'Black Cleaver', "Sterak's Gage"],
    situational: ['Thornmail', 'Spirit Visage', "Death's Dance"],
    final: ['Stridebreaker', 'Black Cleaver', "Sterak's Gage"],
    explanations: [
      { item: 'Stridebreaker', reason: 'Mobility and damage for sticking to key targets.' },
      { item: 'Black Cleaver', reason: 'Shreds armor while amplifying team damage.' },
    ],
  },
  tank: {
    start: ['Steel Shoulderguards', 'Health Potion'],
    core: ['Sunfire Aegis', 'Thornmail', 'Spirit Visage'],
    situational: ["Randuin's Omen", 'Gargoyle Stoneplate', "Knight's Vow"],
    final: ['Sunfire Aegis', 'Thornmail', 'Spirit Visage'],
    explanations: [
      { item: 'Sunfire Aegis', reason: 'Frontline durability and constant area damage in teamfights.' },
      { item: 'Thornmail', reason: 'Strong counter to healing and attack damage carry threats.' },
    ],
  },
  support: {
    start: ['Steel Shoulderguards', 'Health Potion'],
    core: ['Locket of the Iron Solari', 'Redemption', 'Plated Steelcaps'],
    situational: ["Mikael's Blessing", 'Abyssal Mask', "Knight's Vow"],
    final: ['Locket of the Iron Solari', 'Redemption', "Mikael's Blessing"],
    explanations: [
      { item: 'Locket of the Iron Solari', reason: 'Provides an instant shield for teamfight engages.' },
      { item: 'Redemption', reason: 'Adds global healing and fight-turning support utility.' },
    ],
  },
};

function buildEnemyAdaptation(enemyId) {
  const enemy = enemyId.toLowerCase();
  const assassins = ['zed', 'talon', 'khazix', 'ekko', 'leblanc', 'ahri'];
  const engagers = ['leona', 'blitzcrank', 'thresh', 'alistar'];
  const carries = ['vayne', 'kaisa', 'caitlyn', 'jinx'];

  if (assassins.includes(enemy)) {
    return 'Prioritize defensive timing items and vision to survive assassination threats.';
  }
  if (engagers.includes(enemy)) {
    return 'Expect strong engage; keep distance and favor shields or magic resist.';
  }
  if (carries.includes(enemy)) {
    return 'Build for sustained DPS and anti-heal when the enemy carry is the main threat.';
  }
  return 'This build stays balanced for common skirmishes and objective control.';
}

export function recommendBuild(champion, role, enemyId, itemData, runesData) {
  const profileKey = selectBuildProfile(champion.tags || [], role);
  const itemProfile = itemProfiles[profileKey];

  const runes = buildRuneRecommendation(profileKey, runesData);
  const items = {
    start: resolveItems(itemData, itemProfile.start),
    core: resolveItems(itemData, itemProfile.core),
    situational: resolveItems(itemData, itemProfile.situational),
    final: resolveItems(itemData, itemProfile.final),
    explanations: itemProfile.explanations,
  };

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
        'Focus on objectives once core items are completed and the enemy team is pressured.',
      ],
      laneApproach: 'Win trades with strong poke and ability rotation, then look for roams or objective control depending on the role.',
      teamfight: 'Position around the strongest enemy threats, either diving the carry or protecting your own backline.',
      adaptation: buildEnemyAdaptation(enemyId),
    },
  };
}
