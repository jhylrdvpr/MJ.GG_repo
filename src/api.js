const VERSIONS_URL = 'https://ddragon.leagueoflegends.com/api/versions.json';
const DATA_DRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn';
const LOCALE = 'en_US';

let cachedVersion = null;

async function getLatestVersion() {
  if (cachedVersion) return cachedVersion;
  const response = await fetch(VERSIONS_URL);
  const versions = await response.json();
  cachedVersion = versions[0];
  return cachedVersion;
}

export async function fetchChampionList() {
  const version = await getLatestVersion();
  const response = await fetch(`${DATA_DRAGON_BASE}/${version}/data/${LOCALE}/champion.json`);
  const raw = await response.json();

  return Object.values(raw.data)
    .map((champion) => ({
      id: champion.id,
      name: champion.name,
      title: champion.title,
      tags: champion.tags,
      description: champion.blurb,
      key: champion.key,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchItemData() {
  const version = await getLatestVersion();
  const response = await fetch(`${DATA_DRAGON_BASE}/${version}/data/${LOCALE}/item.json`);
  const raw = await response.json();
  return raw.data;
}

export async function fetchRunesData() {
  const version = await getLatestVersion();
  const primaryUrl = `${DATA_DRAGON_BASE}/${version}/data/${LOCALE}/runetree.json`;
  const fallbackUrl = `${DATA_DRAGON_BASE}/${version}/data/${LOCALE}/runesReforged.json`;

  async function tryFetch(url) {
    const res = await fetch(url);
    if (!res.ok) {
      const err = new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  let raw;
  try {
    raw = await tryFetch(primaryUrl);
  } catch (err) {
    if (err.status === 403 || err.status === 404) {
      try {
        raw = await tryFetch(fallbackUrl);
      } catch (err2) {
        throw new Error(`Could not load rune data from Data Dragon (tried ${primaryUrl} and ${fallbackUrl}): ${err2.message}`);
      }
    } else {
      throw new Error(`Could not load rune data from Data Dragon: ${err.message}`);
    }
  }

  // Normalize runes into a flat map for easy lookup. DataDragon may return an array
  // (runesReforged.json) or an object/array shape for runetree.json.
  const trees = Array.isArray(raw) ? raw : (raw.data || raw);
  const runeMap = {};

  trees.forEach((tree) => {
    let normalizedSlots = [];

    if (Array.isArray(tree.slots)) {
      normalizedSlots = tree.slots.map((slot) => {
        const runes = Array.isArray(slot.runes)
          ? slot.runes.map((rune) => ({ id: rune.id, key: rune.key, name: rune.name, description: rune.longDesc || rune.shortDesc || rune.longDesc }))
          : [];
        return { runes };
      });
    } else if (Array.isArray(tree.runes)) {
      normalizedSlots = [{ runes: tree.runes.map((rune) => ({ id: rune.id, key: rune.key, name: rune.name, description: rune.longDesc || rune.shortDesc })) }];
    }

    runeMap[tree.id] = {
      id: tree.id,
      name: tree.name || tree.key || '',
      slots: normalizedSlots,
    };
  });

  return runeMap;
}
