import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import news from '../data/news.json';

const tagColor = (tag) => {
  switch (tag) {
    case 'Award': return 'chip-ember';
    case 'Paper': return 'chip';
    case 'Announcement': return 'chip';
    case 'Talk': return 'chip';
    case 'Press': return 'chip';
    default: return 'chip';
  }
};

const yearOf = (item) => String(item.date).slice(0, 4);

const NewsSection = () => {
  /*
   * How many years BEFORE the featured one are on screen. Revealing one
   * year per click rather than the whole archive at once: this list only
   * grows, and "show 40 earlier items" becomes a worse offer every year.
   *
   * Reveal is sequential and backwards rather than an accordion of
   * independent years, because this is a timeline with a continuous
   * spine -- showing 2023 while 2024 stays hidden would break the thread.
   */
  const [yearsBack, setYearsBack] = useState(0);

  const { byYear, years, featuredIndex } = useMemo(() => {
    // Newest first. The JSON is hand-edited, so sort here rather than
    // relying on entries being appended in the right order.
    const items = [...news].sort((a, b) =>
      (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    const groups = new Map();
    for (const item of items) {
      const y = yearOf(item);
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y).push(item);
    }

    const ys = [...groups.keys()];                  // already newest-first
    const thisYear = String(new Date().getFullYear());

    /*
     * Default view is the current calendar year, Jan-Dec. But if the year
     * has no entries yet -- every January, and any quiet stretch -- that
     * would render an empty section that reads as broken, so fall back to
     * the most recent year that actually has news.
     */
    const idx = Math.max(0, ys.indexOf(thisYear));

    return { byYear: groups, years: ys, featuredIndex: idx };
  }, []);

  const lastVisible = Math.min(featuredIndex + yearsBack, years.length - 1);
  const visibleYears = years.slice(featuredIndex, lastVisible + 1);
  const shown = visibleYears.flatMap(y => byYear.get(y) || []);

  const nextYear = years[lastVisible + 1];
  const remainingYears = years.length - 1 - lastVisible;
  const hiddenCount = years
    .slice(lastVisible + 1)
    .reduce((n, y) => n + (byYear.get(y) || []).length, 0);

  return (
    <section id="news" className="relative py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="section-eyebrow text-center">News</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          What we've been up to.
        </h2>
        <p className="text-mist text-center text-sm mb-16">
          {visibleYears.length > 1
            ? `${visibleYears[visibleYears.length - 1]}\u2013${visibleYears[0]}`
            : visibleYears[0]}
          {hiddenCount > 0 &&
            ` \u00b7 ${hiddenCount} earlier item${hiddenCount === 1 ? '' : 's'} in ${remainingYears} year${remainingYears === 1 ? '' : 's'}`}
        </p>

        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-signal/20 -translate-x-1/2" aria-hidden="true" />

          <div className="space-y-10">
            {shown.map((item, i) => {
              // Year divider whenever the year changes, but only once more
              // than one year is on screen -- otherwise it is just noise.
              const showYearDivider = i > 0 && yearOf(item) !== yearOf(shown[i - 1]);

              return (
                <React.Fragment key={item.id}>
                  {showYearDivider && (
                    <div className="relative flex justify-center py-2">
                      <span className="mono text-xs text-mist bg-ink px-3 rounded-full border border-signal/20 py-1">
                        {yearOf(item)}
                      </span>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-6`}
                  >
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-signal border-4 border-ink -translate-x-1/2 mt-1 md:mt-0" />

                    <div className="ml-12 md:ml-0 md:w-1/2 glass rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={tagColor(item.tag)}>{item.tag}</span>
                        <span className="mono text-mist text-xs">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-serif font-semibold text-paper mb-2">{item.title}</h3>
                      <p className="text-mist text-sm leading-relaxed">{item.summary}</p>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {(nextYear || yearsBack > 0) && (
          <div className="mt-12 flex flex-col items-center gap-3">
            {nextYear && (
              <button
                onClick={() => setYearsBack(n => n + 1)}
                className="btn-ghost text-sm"
              >
                Show {nextYear} ({(byYear.get(nextYear) || []).length})
              </button>
            )}
            {yearsBack > 0 && (
              <button
                onClick={() => setYearsBack(0)}
                className="mono text-xs text-mist hover:text-signal transition-colors"
              >
                Collapse to {years[featuredIndex]}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
