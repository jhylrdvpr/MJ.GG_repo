export const champions = [
  {
    id: 'ahri',
    name: 'Ahri',
    roles: ['Mid'],
    description: 'Mobile burst mage with strong pick and roam potential.',
    runes: {
      primary: 'Domination',
      keystone: 'Electrocute',
      secondary: 'Inspiration',
      shards: ['Adaptive Force', 'Adaptive Force', 'Armor'],
      details: [
        {
          title: 'Electrocute',
          explanation: 'Burst damage on full combo trades enhances Ahri’s assassin pattern and snowballs lane pressure.',
        },
        {
          title: 'Taste of Blood',
          explanation: 'Sustain from poke and trades helps Ahri survive skirmishes against assassins like Zed.',
        },
        {
          title: 'Eyeball Collection',
          explanation: 'Rewarding aggressive spell usage ensures stronger mid-game roams and damage spikes.',
        },
      ],
    },
    items: {
      start: ['Doran’s Ring', 'Health Potion'],
      core: ['Luden’s Tempest', 'Sorcerer’s Shoes', 'Zhonya’s Hourglass'],
      situational: ['Banshee’s Veil', 'Morellonomicon', 'Shadowflame'],
      final: ['Luden’s Tempest', 'Zhonya’s Hourglass', 'Banshee’s Veil'],
      explanations: [
        {
          item: 'Luden’s Tempest',
          reason: 'Boosts burst and wave clear, which fits Ahri’s playstyle and roaming tempo.',
        },
        {
          item: 'Zhonya’s Hourglass',
          reason: 'Defensive timing against assassination threats like Zed or Talon enables safe engage windows.',
        },
        {
          item: 'Banshee’s Veil',
          reason: 'Spell shield is strong versus crowd control or enemy initiation power.',
        },
      ],
    },
  },
  {
    id: 'darius',
    name: 'Darius',
    roles: ['Top'],
    description: 'Lane bully with huge dunk damage and strong teamfight zoning.',
    runes: {
      primary: 'Precision',
      keystone: 'Conqueror',
      secondary: 'Resolve',
      shards: ['Attack Speed', 'Adaptive Force', 'Armor'],
      details: [
        {
          title: 'Conqueror',
          explanation: 'Stacks well in extended trades and turns Darius’s bleed into a lethal late-lane spike.',
        },
        {
          title: 'Triumph',
          explanation: 'Keeps Darius fighting after risky all-ins and secures clutch skirmish healing.',
        },
      ],
    },
    items: {
      start: ['Doran’s Blade', 'Health Potion'],
      core: ['Stridebreaker', 'Black Cleaver', 'Sterak’s Gage'],
      situational: ['Thornmail', 'Spirit Visage', 'Death’s Dance'],
      final: ['Stridebreaker', 'Black Cleaver', 'Sterak’s Gage'],
      explanations: [
        {
          item: 'Stridebreaker',
          reason: 'Adds chase and sustained damage to Darius’s pull combos in lane and teamfights.',
        },
        {
          item: 'Black Cleaver',
          reason: 'Armor shred amplifies team damage and matches Darius’s bleed-heavy kit.',
        },
      ],
    },
  },
  {
    id: 'jinx',
    name: 'Jinx',
    roles: ['ADC'],
    description: 'Scaling hypercarry with massive teamfight reset potential.',
    runes: {
      primary: 'Precision',
      keystone: 'Fleet Footwork',
      secondary: 'Domination',
      shards: ['Attack Speed', 'Adaptive Force', 'Armor'],
      details: [
        {
          title: 'Fleet Footwork',
          explanation: 'Sustain and mobility keep Jinx healthy through poke-heavy bot lanes and let her reposition in fights.',
        },
        {
          title: 'Overheal',
          explanation: 'Extra shields from healing improve survivability during extended exchanges.',
        },
      ],
    },
    items: {
      start: ['Doran’s Blade', 'Health Potion'],
      core: ['Kraken Slayer', 'Berserker’s Greaves', 'Infinity Edge'],
      situational: ['Guardian Angel', 'Mortal Reminder', 'Phantom Dancer'],
      final: ['Kraken Slayer', 'Infinity Edge', 'Guardian Angel'],
      explanations: [
        {
          item: 'Kraken Slayer',
          reason: 'Mixed damage and on-hit execute are ideal for shredding tanks and scaling into late-game teamfights.',
        },
        {
          item: 'Guardian Angel',
          reason: 'Allows Jinx to play aggressively with a safety net against dive-heavy enemy teams.',
        },
      ],
    },
  },
];

export const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

export const enemies = ['Zed', 'Thresh', 'Yasuo', 'Leona', 'Vayne', 'Sion'];
