import React, { useState } from 'react';
import { motion } from 'framer-motion';
import publications from '../data/publications.json';
import themes from '../data/themes.json';

const TYPE_ORDER = [
  { id: 'journal',    label: 'Journal Articles' },
  { id: 'chapter',    label: 'Book Chapters' },
  { id: 'conference', label: 'Conference & Workshop' },
  { id: 'preprint',   label: 'Under Review / In Preparation' },
  { id: 'thesis',     label: 'Dissertation & Theses' },
];

const themeShort = (t) => t.short || t.title.split(' and ')[0].split(':')[0];

const PublicationItem = ({ p, i }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06 }}
    className="glass rounded-2xl p-6 md:p-7 hover:border-signal/40 transition-colors group"
  >
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="mono text-signal text-sm">{p.venue}</span>
        {p.award && <span className="chip-ember">🏆 {p.award}</span>}
      </div>
      <span className="mono text-mist text-xs">{p.year}</span>
    </div>

    <h3 className="text-lg md:text-xl font-serif font-semibold text-paper mb-2 group-hover:text-signal transition-colors leading-snug">
      {p.url ? <a href={p.url}>{p.title}</a> : p.title}
    </h3>

    <p className="text-mist text-sm mb-3 italic leading-relaxed">
      {p.authors.join(', ')}
    </p>

    {p.abstract && (
      <p className="text-paper/75 text-sm leading-relaxed mb-4">{p.abstract}</p>
    )}

    <div className="flex flex-wrap gap-2 mt-3">
      {p.themes.map(themeId => {
        const t = themes.find(x => x.id === themeId);
        return t ? (
          <span key={themeId} className={t.accent === 'ember' ? 'chip-ember' : 'chip'}>
            {themeShort(t)}
          </span>
        ) : null;
      })}
    </div>
  </motion.article>
);

const PublicationsSection = () => {
  const [themeFilter, setThemeFilter] = useState('all');

  const filtered = themeFilter === 'all'
    ? publications
    : publications.filter(p => p.themes.includes(themeFilter));

  // Group by type, then sort by year desc within each type
  const grouped = TYPE_ORDER.map(t => ({
    ...t,
    items: filtered
      .filter(p => p.type === t.id)
      .sort((a, b) => b.year - a.year),
  })).filter(g => g.items.length > 0);

  const themeChips = [
    { id: 'all', label: 'All Themes' },
    ...themes.map(t => ({ id: t.id, label: themeShort(t) })),
  ];

  return (
    <section id="publications" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-6xl mx-auto">
        <p className="section-eyebrow text-center">Publications</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          Peer-reviewed research.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-10">
          Filter by theme; papers group by type below. Author names in <strong className="text-paper">bold</strong> denote lab members.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {themeChips.map(c => (
            <button
              key={c.id}
              onClick={() => setThemeFilter(c.id)}
              className={`px-4 py-2 rounded-full text-xs mono transition-all
                ${themeFilter === c.id
                  ? 'bg-signal text-ink font-medium'
                  : 'border border-signal/30 text-signal-soft hover:bg-signal/10'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="space-y-14">
          {grouped.map(group => (
            <div key={group.id}>
              <div className="flex items-baseline gap-4 mb-6">
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper">
                  {group.label}
                </h3>
                <span className="mono text-xs text-mist">{group.items.length}</span>
                <div className="flex-1 h-[1px] bg-signal/10" />
              </div>
              <div className="space-y-4">
                {group.items.map((p, i) => (
                  <PublicationItem key={p.id} p={p} i={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {grouped.length === 0 && (
          <p className="text-mist text-center mono text-sm">No publications match this filter.</p>
        )}
      </div>
    </section>
  );
};

export default PublicationsSection;
