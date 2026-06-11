export const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';
const VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const LOCALE = 'en_US';

let cachedVersion = null;

export async function getLatestVersion() {
  if (cachedVersion) return cachedVersion;

  const response = await fetch(VERSIONS_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Data Dragon versions: ${response.status} ${response.statusText}`
    );
  }

  const versions = await response.json();
  cachedVersion = versions[0];

  return cachedVersion;
}

function htmlToText(html) {
  if (!html) return '';

  // Browser-safe conversion
  const doc = new DOMParser().parseFromString(html, 'text/html');

  return (doc.body.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchChampionList() {
  const version = await getLatestVersion();

  const response = await fetch(
    `${DATA_DRAGON_BASE}/${version}/data/${LOCALE}/champion.json`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch champions: ${response.status} ${response.statusText}`
    );
  }

  const raw = await response.json();

  return Object.values(raw.data)
    .map((champion) => ({
      id: champion.id,
      name: champion.name,
      title: champion.title,
      tags: champion.tags,
      description: champion.blurb,
      key: champion.key,
      image: `${DATA_DRAGON_BASE}/${version}/img/champion/${champion.image.full}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchItemData() {
  const version = await getLatestVersion();

  const response = await fetch(
    `${DATA_DRAGON_BASE}/${version}/data/${LOCALE}/item.json`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch items: ${response.status} ${response.statusText}`
    );
  }

  const raw = await response.json();
  const items = raw.data;
  const itemIcons = {};

  Object.values(items).forEach((item) => {
    itemIcons[item.name] =
      `${DATA_DRAGON_BASE}/${version}/img/item/${item.image.full}`;
  });

  return { items, itemIcons };
}

export async function fetchRunesData() {
  const version = await getLatestVersion();

  const url =
    `${DATA_DRAGON_BASE}/${version}/data/${LOCALE}/runesReforged.json`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Could not load rune data from Data Dragon: ${res.status} ${res.statusText}`
    );
  }

  const raw = await res.json();
  const runeMap = {};

  raw.forEach((tree) => {
    const normalizedSlots = tree.slots.map((slot) => ({
      runes: slot.runes.map((rune) => ({
        id: rune.id,
        key: rune.key,
        name: rune.name,

        // Convert Riot HTML descriptions into plain text
        description: htmlToText(
          rune.longDesc || rune.shortDesc || ''
        ),

        icon: rune.icon
          ? `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`
          : null,
      })),
    }));

    runeMap[tree.id] = {
      id: tree.id,
      name: tree.name,
      key: tree.key,

      icon: tree.icon
        ? `https://ddragon.leagueoflegends.com/cdn/img/${tree.icon}`
        : null,

      slots: normalizedSlots,
    };
  });

  return runeMap;
}