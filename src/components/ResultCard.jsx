import React from 'react';

export default function ResultCard({ title, children }) {
  return (
    <article className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl">
      <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      <div className="mt-5 space-y-5">{children}</div>
    </article>
  );
}
