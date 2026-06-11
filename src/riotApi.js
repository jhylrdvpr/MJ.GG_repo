export const RIOT_PLATFORMS = [
  { id: 'na1', label: 'North America (NA)', region: 'americas' },
  { id: 'br1', label: 'Brazil (BR)', region: 'americas' },
  { id: 'la1', label: 'Latin America North (LAN)', region: 'americas' },
  { id: 'la2', label: 'Latin America South (LAS)', region: 'americas' },
  { id: 'kr', label: 'Korea (KR)', region: 'asia' },
  { id: 'jp1', label: 'Japan (JP)', region: 'asia' },
  { id: 'euw1', label: 'Europe West (EUW)', region: 'europe' },
  { id: 'eun1', label: 'Europe Nordic & East (EUNE)', region: 'europe' },
  { id: 'tr1', label: 'Turkey (TR)', region: 'europe' },
  { id: 'ru', label: 'Russia (RU)', region: 'europe' },
  { id: 'oc1', label: 'Oceania (OCE)', region: 'sea' },
  { id: 'sg2', label: 'Singapore (SG) — Philippines & Thailand', region: 'sea' },
  { id: 'tw2', label: 'Taiwan (TW)', region: 'sea' },
  { id: 'vn2', label: 'Vietnam (VN)', region: 'sea' },
];

// Riot merged PH2/TH2 into SG2; keep aliases so older saved selections still work.
const PLATFORM_ALIASES = {
  ph2: 'sg2',
  th2: 'sg2',
  me1: 'euw1',
};

const PLATFORM_BY_ID = Object.fromEntries(RIOT_PLATFORMS.map((entry) => [entry.id, entry]));

export function resolvePlatform(platformId) {
  const normalized = platformId?.toLowerCase?.() ?? '';
  return PLATFORM_ALIASES[normalized] ?? normalized;
}

export function getRegionForPlatform(platformId) {
  const platform = resolvePlatform(platformId);
  return PLATFORM_BY_ID[platform]?.region ?? 'americas';
}

// Account-v1 data is global. Dev keys return 403 on sea.api.riotgames.com — use asia instead.
export function getAccountRegionForPlatform(platformId) {
  const region = getRegionForPlatform(platformId);
  return region === 'sea' ? 'asia' : region;
}

export function getPlatformLabel(platformId) {
  const platform = resolvePlatform(platformId);
  return PLATFORM_BY_ID[platform]?.label ?? platform.toUpperCase();
}

function riotBaseUrl(host) {
  if (import.meta.env.DEV) {
    return `/riot-api/${host}`;
  }
  return `https://${host}.api.riotgames.com`;
}

async function riotFetch(host, path) {
  if (!import.meta.env.DEV) {
    throw new Error('Summoner lookup requires npm run dev with RIOT_API_KEY set in .env.');
  }

  const response = await fetch(`${riotBaseUrl(host)}/${path}`);

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message = data?.status?.message || data?.message || response.statusText || 'Riot API request failed';
    throw new Error(message);
  }

  return data;
}

export async function fetchAccountByRiotId(region, gameName, tagLine) {
  const path = `riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  return riotFetch(region, path);
}

export async function fetchSummonerByPuuid(platform, puuid) {
  const path = `lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
  return riotFetch(platform, path);
}

export async function fetchSummonerProfile(platformId, gameName, tagLine) {
  const platform = resolvePlatform(platformId);
  const accountRegion = getAccountRegionForPlatform(platform);
  const account = await fetchAccountByRiotId(accountRegion, gameName, tagLine);
  const summoner = await fetchSummonerByPuuid(platform, account.puuid);

  return {
    gameName: account.gameName,
    tagLine: account.tagLine,
    puuid: account.puuid,
    platform,
    platformLabel: getPlatformLabel(platform),
    revisionDate: new Date(summoner.revisionDate).toLocaleDateString(),
    profileIconId: summoner.profileIconId,
    summonerLevel: summoner.summonerLevel,
  };
}
