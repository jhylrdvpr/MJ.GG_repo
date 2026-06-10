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
