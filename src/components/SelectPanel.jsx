import React from 'react';

export default function SelectPanel({ championId, role, enemyId, data, onChange, onGenerate }) {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Champion Selection</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-100">Build your next game plan</h2>
        <p className="mt-2 max-w-2xl text-slate-400">Choose your champion, lane, and enemy threats for tailored rune and item guidance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm text-slate-300">Champion</span>
          <select
            name="championId"
            value={championId}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          >
            {data.map((champ) => (
              <option key={champ.id} value={champ.id}>{champ.name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-300">Role / Lane</span>
          <select
            name="role"
            value={role}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          >
            {['Top', 'Jungle', 'Mid', 'ADC', 'Support'].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-300">Enemy Champion</span>
          <select
            name="enemyId"
            value={enemyId}
            onChange={onChange}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          >
            {data.map((champ) => (
              <option key={champ.id} value={champ.id}>{champ.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">Powered by Riot Data Dragon for live champion, rune, and item data.</p>
        <button
          onClick={onGenerate}
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Generate Build
        </button>
      </div>
    </section>
  );
}
