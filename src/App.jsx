import { useEffect, useMemo, useState } from 'react';
import SelectPanel from './components/SelectPanel.jsx';
import ResultCard from './components/ResultCard.jsx';
import { fetchChampionList, fetchItemData } from './api.js';
import { recommendBuild } from './recommendation.js';

function Chip({ children }) {
  return (
    <span className="inline-flex rounded-full border border-slate-700 bg-slate-950/90 px-3 py-1 text-sm text-slate-200">{children}</span>
  );
}

function ListCard({ label, values }) {
  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
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
    <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4">
      <p className="font-semibold text-slate-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{explanation}</p>
    </div>
  );
}

export default function App() {
  const [champions, setChampions] = useState([]);
  const [itemData, setItemData] = useState({});
  const [championId, setChampionId] = useState('');
  const [role, setRole] = useState('Mid');
  const [enemyInput, setEnemyInput] = useState('Zed');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const champion = useMemo(() => champions.find((champ) => champ.id === championId), [champions, championId]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [championList, items] = await Promise.all([fetchChampionList(), fetchItemData()]);
        setChampions(championList);
        setItemData(items);
        setChampionId(championList.find((champ) => champ.name === 'Ahri')?.id ?? championList[0]?.id ?? '');
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
    if (name === 'enemyInput') setEnemyInput(value);
  };

  const onGenerate = () => {
    if (!champion || !Object.keys(itemData).length) return;
    setOutput(recommendBuild(champion, role, enemyInput, itemData));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">League Companion</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-100 sm:text-5xl">MJ.GG</h1>
          <p className="mt-4 max-w-2xl text-slate-400">Live Data Dragon champion metadata and item lookups power the recommendations.</p>
        </div>
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 text-right shadow-glow backdrop-blur-xl">
          <p className="text-sm text-slate-400">Selected champion</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{champion?.name ?? 'Loading...'}</p>
          <p className="mt-1 text-sm text-slate-500">{champion?.description ?? 'Fetching champion data...'}</p>
        </div>
      </header>

      <main className="space-y-8">
        <SelectPanel
          championId={championId}
          role={role}
          enemyInput={enemyInput}
          data={champions}
          onChange={onChange}
          onGenerate={onGenerate}
        />

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
  );
}
