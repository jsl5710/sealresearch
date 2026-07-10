import React, { useState } from 'react';
import { motion } from 'framer-motion';
import publications from '../data/publications.json';
import themes from '../data/themes.json';

const PublicationsSection = () => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? publications
    : publications.filter(p => p.themes.includes(filter));

  const filterChips = [
    { id: 'all', label: 'All' },
    ...themes.map(t => ({ id: t.id, label: t.title.split(' and ')[0].split(':')[0] })),
  ];

  return (
    <section id="publications" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-6xl mx-auto">
        <p className="section-eyebrow text-center">Publications</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          Peer-reviewed research.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-12">
          A selection of the lab's recent work across our four research themes.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterChips.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-full text-xs mono transition-all
                ${filter === c.id
                  ? 'bg-signal text-ink font-medium'
                  : 'border border-signal/30 text-signal-soft hover:bg-signal/10'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-6 md:p-8 hover:border-signal/40 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="mono text-signal text-sm">{p.venue}</span>
                  {p.award && <span className="chip-ember">🏆 {p.award}</span>}
                </div>
                <span className="mono text-mist text-xs">{p.year}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-semibold text-paper mb-2 group-hover:text-signal transition-colors">
                {p.url ? <a href={p.url}>{p.title}</a> : p.title}
              </h3>

              <p className="text-mist text-sm mb-3 italic">
                {p.authors.join(', ')}
              </p>

              {p.abstract && (
                <p className="text-paper/80 text-sm leading-relaxed mb-4">
                  {p.abstract}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {p.themes.map(themeId => {
                  const t = themes.find(x => x.id === themeId);
                  return t ? (
                    <span key={themeId} className={t.accent === 'ember' ? 'chip-ember' : 'chip'}>
                      {t.title.split(' and ')[0].split(':')[0]}
                    </span>
                  ) : null;
                })}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsSection;
