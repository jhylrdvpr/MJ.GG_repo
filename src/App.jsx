import { useEffect, useMemo, useState } from 'react';
import SelectPanel from './components/SelectPanel.jsx';
import ResultCard from './components/ResultCard.jsx';
import { fetchChampionList, fetchItemData, fetchRunesData } from './api.js';
import { recommendBuild } from './recommendation.js';

function Chip({ children }) {
  return (
    <span className="inline-flex rounded-full border border-lol-border bg-lol-surface-soft px-3 py-1 text-sm text-lol-gold">{children}</span>
  );
}

function ListCard({ label, values }) {
  return (
    <div className="rounded-3xl border border-lol-border bg-lol-surface-soft p-4">
      <p className="text-sm uppercase tracking-[0.3em] text-lol-muted">{label}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {values.map((item) => (
          <Chip key={item}>{item}</Chip>
        ))}
      </div>
    </div>
  );
}

function ExplanationRow({ title, explanation }) {
  return (
    <div className="rounded-3xl border border-lol-border bg-lol-surface-soft p-4">
      <p className="font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{explanation}</p>
    </div>
  );
}

function Divider() {
  return <div className="section-divider my-10 h-px" />;
}

export default function App() {
  const [champions, setChampions] = useState([]);
  const [itemData, setItemData] = useState({});
  const [runesData, setRunesData] = useState({});
  const [championId, setChampionId] = useState('');
  const [role, setRole] = useState('Mid');
  const [enemyId, setEnemyId] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summonerName, setSummonerName] = useState('Faker');
  const [platform, setPlatform] = useState('na1');
  const [summonerData, setSummonerData] = useState(null);
  const [riotLoading, setRiotLoading] = useState(false);
  const [riotError, setRiotError] = useState(null);

  const champion = useMemo(() => champions.find((champ) => champ.id === championId), [champions, championId]);

  async function fetchSummoner() {
    setRiotLoading(true);
    setRiotError(null);
    try {
      const response = await fetch(`/api/riot/summoner/${platform}/${encodeURIComponent(summonerName)}`);
      const data = await response.json();
      if (!response.ok) {
        const message = data.status?.message || data.error || 'Unknown error';
        throw new Error(`Riot API request failed: ${response.status} ${message}`);
      }
      setSummonerData(data);
    } catch (err) {
      console.error(err);
      setRiotError(`Could not load Riot account data: ${err.message}`);
      setSummonerData(null);
    } finally {
      setRiotLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [championList, items, runes] = await Promise.all([
          fetchChampionList(),
          fetchItemData(),
          fetchRunesData(),
        ]);
        setChampions(championList);
        setItemData(items);
        setRunesData(runes);
        const ahrId = championList.find((champ) => champ.name === 'Ahri')?.id ?? championList[0]?.id ?? '';
        setChampionId(ahrId);
        setEnemyId(championList[1]?.id ?? championList[0]?.id ?? '');
      } catch (err) {
        console.error(err);
        setError('Could not load League of Legends data. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    if (name === 'championId') setChampionId(value);
    if (name === 'role') setRole(value);
    if (name === 'enemyId') setEnemyId(value);
  };

  const onGenerate = () => {
    if (!champion || !Object.keys(itemData).length || !Object.keys(runesData).length) return;
    setOutput(recommendBuild(champion, role, enemyId, itemData, runesData));
  };

  const onFetchSummoner = async () => {
    await fetchSummoner();
  };

  return (
    <div className="relative overflow-hidden splash-overlay">
      <div className="pointer-events-none absolute inset-0 bg-lol-hero opacity-85" />
      <div className="pointer-events-none absolute left-[8%] top-0 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-lol-gold/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute right-[8%] top-[8%] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-lol-purple/20 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-lol-gold/80">League Companion</p>
          <h1 className="mt-3 text-4xl font-display font-semibold text-lol-gold sm:text-5xl">MJ.GG</h1>
          <p className="mt-4 max-w-2xl text-lol-muted">Live Data Dragon champion metadata and item lookups power the recommendations.</p>
        </div>
        <div className="rounded-3xl border border-lol-border bg-lol-surface p-5 text-right shadow-glow backdrop-blur-xl">
          <p className="text-sm text-lol-muted">Selected champion</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{champion?.name ?? 'Loading...'}</p>
          <p className="mt-1 text-sm text-lol-muted">{champion?.description ?? 'Fetching champion data...'}</p>
        </div>
      </header>

      <main className="space-y-8">
        <section className="rounded-3xl border border-lol-border bg-lol-surface p-6 shadow-glow backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Riot API Lookup</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-100">Summoner Data</h2>
            </div>
            <button
              onClick={onFetchSummoner}
              className="inline-flex items-center justify-center rounded-2xl btn-gold px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Fetch Summoner
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Platform</span>
              <select
                name="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="na1">NA1</option>
                <option value="euw1">EUW1</option>
                <option value="eun1">EUN1</option>
                <option value="kr">KR</option>
                <option value="br1">BR1</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Summoner Name</span>
              <input
                type="text"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              />
            </label>
            <div className="rounded-3xl border border-lol-border bg-lol-surface-soft p-4">
              {riotLoading ? (
                <p className="text-slate-400">Fetching Riot data...</p>
              ) : riotError ? (
                <p className="text-red-400">{riotError}</p>
              ) : summonerData ? (
                <div className="space-y-2 text-slate-200">
                  <p><strong>Summoner:</strong> {summonerData.name}</p>
                  <p><strong>Level:</strong> {summonerData.summonerLevel}</p>
                  <p><strong>PUUID:</strong> {summonerData.puuid}</p>
                </div>
              ) : (
                <p className="text-slate-400">Enter a summoner name and click fetch to test the Riot key.</p>
              )}
            </div>
          </div>
        </section>

        <Divider />

        <SelectPanel
          championId={championId}
          role={role}
          enemyId={enemyId}
          data={champions}
          onChange={onChange}
          onGenerate={onGenerate}
        />

        <Divider />

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-700/70 bg-slate-900/70 p-10 text-center text-slate-400">
            Loading live League data...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/50 bg-red-950/20 p-10 text-center text-red-200">
            {error}
          </div>
        ) : output ? (
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <ResultCard title="Rune Recommendation">
                <ListCard label="Primary Tree" values={[output.runes.primary, output.runes.keystone]} />
                <ListCard label="Secondary Tree + Shards" values={[output.runes.secondary, ...output.runes.shards]} />
                <div className="grid gap-4 md:grid-cols-2">
                  {output.runes.details.map((detail) => (
                    <ExplanationRow key={detail.title} title={detail.title} explanation={detail.explanation} />
                  ))}
                </div>
              </ResultCard>

              <ResultCard title="Item Build">
                <ListCard label="Starting" values={output.items.start} />
                <ListCard label="Core" values={output.items.core} />
                <ListCard label="Situational" values={output.items.situational} />
                <ListCard label="Final" values={output.items.final} />
                <div className="grid gap-4 md:grid-cols-2">
                  {output.items.explanations.map((item) => (
                    <ExplanationRow key={item.item} title={item.item} explanation={item.reason} />
                  ))}
                </div>
              </ResultCard>
            </div>

            <ResultCard title="In-Depth Strategy">
              <div className="space-y-5 text-slate-300">
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">Overall strategy</h4>
                  <p className="mt-2 leading-7">{output.analysis.strategy}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">Power spikes</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-400">
                    {output.analysis.powerSpikes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">Lane phase</h4>
                  <p className="mt-2 leading-7">{output.analysis.laneApproach}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">Teamfights</h4>
                  <p className="mt-2 leading-7">{output.analysis.teamfight}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-100">Enemy adaptation</h4>
                  <p className="mt-2 leading-7">{output.analysis.adaptation}</p>
                </div>
              </div>
            </ResultCard>
          </section>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700/70 bg-slate-900/70 p-10 text-center text-slate-400">
            Select your matchup and tap Generate Build to see rune, item, and strategy insights.
          </div>
        )}
      </main>

      <footer className="mt-12 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-center text-slate-500 shadow-glow backdrop-blur-xl">
        <p>League Companion MVP — powered by Riot Data Dragon metadata for champions and items.</p>
      </footer>
    </div>
  </div>
  );
}
