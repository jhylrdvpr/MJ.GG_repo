function normalizeName(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function resolveItems(itemData, names) {
  return names.map((name) => {
    const normalized = normalizeName(name);
    const entry = Object.values(itemData).find((item) => {
      const itemName = normalizeName(item.name);
      return itemName === normalized || itemName.includes(normalized) || normalized.includes(itemName);
    });
    return entry?.name || name;
  });
}

function selectBuildProfile(tags, role) {
  const normalized = tags.map((tag) => tag.toLowerCase());
  if (role === 'ADC') return 'marksman';
  if (role === 'Mid') return 'mage';
  if (role === 'Top') return 'fighter';
  if (role === 'Jungle') return 'fighter';
  if (role === 'Support') return 'support';
  if (normalized.includes('mage')) return 'mage';
  if (normalized.includes('marksman')) return 'marksman';
  if (normalized.includes('support')) return 'support';
  if (normalized.includes('tank')) return 'tank';
  if (normalized.includes('fighter')) return 'fighter';
  if (normalized.includes('assassin')) return 'assassin';
  return 'mage';
}

const runeProfiles = {
  assassin: { primary: 8100, secondary: 8200, keystone: 'Electrocute' },
  marksman: { primary: 8000, secondary: 8100, keystone: 'Lethal Tempo' },
  support: { primary: 8400, secondary: 8300, keystone: 'Guardian' },
  tank: { primary: 8400, secondary: 8300, keystone: 'Aftershock' },
  fighter: { primary: 8000, secondary: 8400, keystone: 'Conqueror' },
  mage: { primary: 8200, secondary: 8100, keystone: 'Arcane Comet' },
};

function buildRuneRecommendation(profile, runesData) {
  const profileConfig = runeProfiles[profile] || runeProfiles.mage;
  const primaryTree = Object.values(runesData).find((t) => t.id === profileConfig.primary);
  const secondaryTree = Object.values(runesData).find((t) => t.id === profileConfig.secondary);

  if (!primaryTree) {
    return {
      primary: 'Primary Tree',
      keystone: 'Keystone',
      secondary: 'Secondary Tree',
      shards: ['Adaptive Force', 'Adaptive Force', 'Armor'],
      details: [],
    };
  }

  const keystone = primaryTree.slots
    .flatMap((slot) => slot.runes)
    .find((rune) => rune.name === profileConfig.keystone)
    || primaryTree.slots[0]?.runes[0];

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
        explanation: secondaryTree ? `Secondary path: ${secondaryTree.name}. Choose runes that improve your durability and utility.` : 'Choose a complementary secondary rune path.'
      },
      {
        title: 'Stat Shards',
        explanation: 'Choose adaptive force for offense, armor for defense, or magic resist for survival.'
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

function getItemExplanation(item) {
  const messages = {
    "Doran's Blade": 'Solid early-game stats for wave control and trading.',
    'Health Potion': 'Offers early sustain in lane fights and trades.',
    "Youmuu's Ghostblade": 'Provides burst, mobility, and lethality for assassins.',
    Eclipse: 'Great for burst champions, offering damage, sustain, and movement.',
    'Edge of Night': 'Helps avoid crucial enemy crowd control and cast interruption.',
    "Serylda's Grudge": 'Adds armor penetration and slows enemies hit by abilities.',
    'Maw of Malmortius': 'Offers a shield against burst AP damage with bonus attack damage.',
    'Guardian Angel': 'Grants a second life in teamfights with revive protection.',
    "Doran's Ring": 'Combines ability power and mana sustain for early wave pressure.',
    "Luden's Tempest": 'Delivers burst, mana, and wave clear for mages.',
    "Sorcerer's Shoes": 'Increases magic penetration and movement speed.',
    "Zhonya's Hourglass": 'Provides survivability and teamfight timing with stasis.',
    "Banshee's Veil": 'Blocks a damaging spell and grants magic resist.',
    'Morellonomicon': 'Applies grievous wounds and amplifies AP healing reduction.',
    Shadowflame: 'Penetrates shields and boosts damage against high-health targets.',
    'Kraken Slayer': 'Great for sustained damage against tanky opponents.',
    "Berserker's Greaves": 'Boosts attack speed for ADC carry scaling.',
    'Infinity Edge': 'Maximizes crit damage for marksman carries.',
    'Mortal Reminder': 'Counters healing while offering armor penetration.',
    'Phantom Dancer': 'Improves dueling ability and attack speed with survivability.',
    'Stridebreaker': 'Gives mobility and damage to stick to priority targets.',
    'Black Cleaver': 'Shreds armor and boosts repeat damage from abilities.',
    "Sterak's Gage": 'Increases survivability and burst resistance under attack.',
    "Death's Dance": 'Converts damage into a delayed bleed, improving sustain.',
    'Sunfire Aegis': 'Provides consistent damage aura and frontline durability.',
    Thornmail: 'Reflects damage and punishes auto-attack heavy champions.',
    'Spirit Visage': 'Boosts healing and magic resistance for tanky champions.',
    "Randuin's Omen": 'Reduces incoming crit damage and slows attackers.',
    'Gargoyle Stoneplate': 'Great for surviving during fights with a powerful shield.',
    "Knight's Vow": 'Helps protect your most important ally with bonus defense.',
    'Steel Shoulderguards': 'Good support start item for sustain and lane presence.',
    'Locket of the Iron Solari': 'Provides a team shield during engages and skirmishes.',
    Redemption: 'Offers global healing and fight-turning utility for allies.',
    'Plated Steelcaps': 'Reduces incoming auto-attack damage for frontline or support.',
    "Mikael's Blessing": 'Removes crowd control effects from an ally instantly.',
    'Abyssal Mask': 'Increases magic damage taken by nearby enemies and boosts resistances.',
  };
  return messages[item] || `Recommended item for this build: ${item}.`;
}

function buildItemExplanations(profile) {
  const allItems = [
    ...profile.start,
    ...profile.core,
    ...profile.situational,
    ...profile.final,
  ];
  return [...new Set(allItems)].map((item) => ({
    item,
    reason: getItemExplanation(item),
  }));
}

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
  const startItems = resolveItems(itemData, itemProfile.start);
  const coreItems = resolveItems(itemData, itemProfile.core);
  const situationalItems = resolveItems(itemData, itemProfile.situational);
  const finalItems = resolveItems(itemData, itemProfile.final);
  const items = {
    start: startItems,
    core: coreItems,
    situational: situationalItems,
    final: finalItems,
    explanations: buildItemExplanations({
      start: startItems,
      core: coreItems,
      situational: situationalItems,
      final: finalItems,
    }),
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
