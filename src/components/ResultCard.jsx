import React from 'react';

export default function ResultCard({ title, children }) {
  return (
    <article className="rounded-3xl border border-lol-border bg-lol-surface p-6 shadow-glow backdrop-blur-xl">
      <h3 className="text-xl font-display font-semibold text-lol-gold">{title}</h3>
      <div className="mt-5 space-y-5">{children}</div>
    </article>
  );
}
