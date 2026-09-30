import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import publications from '../data/publications.json';
import themes from '../data/themes.json';

const TYPE_ORDER = [
  { id: 'journal',    label: 'Journal Articles' },
  { id: 'chapter',    label: 'Book Chapters' },
  { id: 'conference', label: 'Conference Papers' },
  { id: 'workshop',   label: 'Workshop Papers' },
  { id: 'preprint',   label: 'Under Review / In Preparation' },
  { id: 'thesis',     label: 'Dissertation & Theses' },
];

/*
 * Disclosure chevron. Rotating a single glyph rather than swapping two
 * icons keeps the control visually stable while it animates.
 */
const Chevron = ({ open }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className={`h-4 w-4 shrink-0 text-signal transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
  >
    <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const byYearDesc = (items) => {
  const years = new Map();
  for (const p of items) {
    const y = String(p.year);
    if (!years.has(y)) years.set(y, []);
    years.get(y).push(p);
  }
  return [...years.entries()].sort((a, b) => Number(b[0]) - Number(a[0]));
};

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

  /*
   * Two sets, deliberately asymmetric:
   *
   *   openTypes   - which type sections are OPEN. Empty by default, so the
   *                 section arrives collapsed: six headings with counts,
   *                 reading as a contents page rather than a wall of papers.
   *
   *   closedYears - which year rows inside an open type the visitor has
   *                 since closed. Years open WITH their type; requiring a
   *                 second click to see anything would make opening a
   *                 section feel like it had failed.
   *
   * Year keys are namespaced by type ("conference:2026"), since the same
   * year appears under several types.
   */
  const [openTypes, setOpenTypes] = useState(() => new Set());
  const [closedYears, setClosedYears] = useState(() => new Set());

  const toggle = (setFn) => (key) => setFn(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
  const toggleType = toggle(setOpenTypes);
  const toggleYear = toggle(setClosedYears);

  const filtered = themeFilter === 'all'
    ? publications
    : publications.filter(p => p.themes.includes(themeFilter));

  // Group by type, then by year within each type, newest first.
  const grouped = useMemo(() => TYPE_ORDER.map(t => {
    const items = filtered.filter(p => p.type === t.id).sort((a, b) => b.year - a.year);
    return { ...t, items, years: byYearDesc(items) };
  }).filter(g => g.items.length > 0), [filtered]);

  const allClosed = openTypes.size === 0;

  const expandAll = () => { setOpenTypes(new Set(grouped.map(g => g.id))); setClosedYears(new Set()); };
  const collapseAll = () => { setOpenTypes(new Set()); setClosedYears(new Set()); };

  const themeChips = [
    { id: 'all', label: 'All Themes' },
    ...themes.map(t => ({ id: t.id, label: themeShort(t) })),
  ];

  return (
    <section id="publications" className="relative py-32 px-6 md:px-12 bg-slate/20">
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

        {grouped.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={allClosed ? expandAll : collapseAll}
              className="mono text-xs text-mist hover:text-signal transition-colors"
            >
              {allClosed ? 'Expand all' : 'Collapse all'}
            </button>
          </div>
        )}

        <div className="space-y-10">
          {grouped.map(group => {
            const typeOpen = openTypes.has(group.id);
            return (
              <div key={group.id}>
                <h3>
                  <button
                    onClick={() => toggleType(group.id)}
                    aria-expanded={typeOpen}
                    aria-controls={`pub-type-${group.id}`}
                    className="group/th flex w-full items-baseline gap-3 text-left"
                  >
                    <span className="self-center"><Chevron open={typeOpen} /></span>
                    <span className="text-2xl md:text-3xl font-serif font-semibold text-paper
                                     group-hover/th:text-signal transition-colors">
                      {group.label}
                    </span>
                    <span className="mono text-xs text-mist">{group.items.length}</span>
                    <span className="flex-1 h-[1px] bg-signal/10" />
                  </button>
                </h3>

                {typeOpen && (
                  <div id={`pub-type-${group.id}`} className="mt-6 space-y-8">
                    {group.years.map(([year, items]) => {
                      const key = `${group.id}:${year}`;
                      const yearOpen = !closedYears.has(key);
                      return (
                        <div key={key}>
                          <h4>
                            <button
                              onClick={() => toggleYear(key)}
                              aria-expanded={yearOpen}
                              aria-controls={`pub-year-${key}`}
                              className="group/yr flex w-full items-center gap-2 text-left ml-1 mb-4"
                            >
                              <Chevron open={yearOpen} />
                              <span className="mono text-sm text-paper group-hover/yr:text-signal transition-colors">
                                {year}
                              </span>
                              <span className="mono text-[11px] text-mist">
                                {items.length} paper{items.length === 1 ? '' : 's'}
                              </span>
                              <span className="flex-1 h-[1px] bg-signal/10" />
                            </button>
                          </h4>

                          {yearOpen && (
                            <div id={`pub-year-${key}`} className="space-y-4">
                              {items.map((p, i) => (
                                <PublicationItem key={p.id} p={p} i={i} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {grouped.length === 0 && (
          <p className="text-mist text-center mono text-sm">No publications match this filter.</p>
        )}
      </div>
    </section>
  );
};

export default PublicationsSection;
