import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import data from '../data/conferences.json';
import pubs from '../data/publications.json';

/*
 * Papers published per venue SERIES, derived from publications.json rather
 * than stored alongside each conference -- a hand-kept count is one more
 * thing to forget when a paper lands.
 *
 * The series is the conference name minus its year ("ACL 2027" -> "ACL"),
 * matched against publication venues on a word boundary. The boundary
 * matters: a bare substring test would count every NAACL and EACL paper
 * as an ACL paper.
 *
 * Counts include Findings and co-located workshops (so "Findings of EMNLP
 * 2025" counts toward EMNLP, and "CONSTRAINT @ ACL 2022" toward ACL),
 * which is the reading most people expect from "papers we published
 * there".
 */
const seriesOf = (name) => String(name).replace(/\s*\d{4}\s*$/, '').trim();

const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/*
 * Journals need an explicit `match`: their publication venue strings are
 * abbreviated ("J. Open Innov.: Tech., Market, Complexity (Q1)") and would
 * never match the display name on their own.
 */
const patternsFor = (c) =>
  (c.match && c.match.length ? c.match : [esc(seriesOf(c.name))]);

const countFor = (c, list) => {
  const res = patternsFor(c).map(pat => new RegExp(`\\b${pat}\\b`));
  return list.filter(p => res.some(re => re.test(String(p.venue || '')))).length;
};

const publicationCounts = (() => {
  const list = Array.isArray(pubs) ? pubs : (pubs.publications || []);
  const counts = new Map();
  for (const c of data.conferences) counts.set(c.id, countFor(c, list));
  return counts;
})();

const paperCountLabel = (n) =>
  n === 0 ? 'No papers yet' : n === 1 ? '1 paper' : `${n} papers`;

const STATUS = {
  targeting:  { label: 'Targeting',   cls: 'chip' },
  submitted:  { label: 'Submitted',   cls: 'chip' },
  attending:  { label: 'Attending',   cls: 'chip-ember' },
  presented:  { label: 'Presented',   cls: 'chip-ember' },
  past:       { label: 'Past',        cls: 'chip' },
  published:  { label: 'Published',   cls: 'chip-ember' },
};

const fmtDate = (d) => {
  if (!d) return 'TBA';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m[2],10)-1]} ${parseInt(m[3],10)}, ${m[1]}`;
};

const fmtRange = (a, b) => {
  if (!a) return 'TBA';
  if (!b || a === b) return fmtDate(a);
  const am = /^(\d{4})-(\d{2})-(\d{2})$/.exec(a);
  const bm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(b);
  if (am && bm && am[1] === bm[1] && am[2] === bm[2]) {
    // same year and month — "Jul 2–7, 2026"
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(am[2],10)-1]} ${parseInt(am[3],10)}–${parseInt(bm[3],10)}, ${am[1]}`;
  }
  return `${fmtDate(a)} – ${fmtDate(b)}`;
};

// Today's date used for "next deadline" — passed in from render time so we don't call Date()
// at module load. Kept as a helper for testability.
const daysFromNow = (target, now) => {
  const t = new Date(target).getTime();
  const n = now.getTime();
  return Math.round((t - n) / (1000 * 60 * 60 * 24));
};

const nextDeadline = (deadlines, now) => {
  const future = deadlines
    .map(d => ({ ...d, days: daysFromNow(d.date, now) }))
    .filter(d => d.days >= 0)
    .sort((a, b) => a.days - b.days);
  return future[0] || null;
};

const ConferenceCard = ({ c, i, now }) => {
  const st = STATUS[c.status] || STATUS.targeting;
  const next = nextDeadline(c.deadlines || [], now);
  const startDays = c.start ? daysFromNow(c.start, now) : null;
  const isPast = startDays !== null && startDays < -14; // more than 2 weeks ago

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.05 }}
      className={`glass rounded-2xl p-6 hover:border-signal/40 transition-colors group ${isPast ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={st.cls}>{st.label}</span>
          <span className="mono text-xs text-mist">· {data.fields.find(f => f.id === c.field)?.label || c.field}</span>
        </div>
        <span className="mono text-mist text-xs">{c.start ? c.start.slice(0, 4) : ''}</span>
      </div>

      {(() => {
        const n = publicationCounts.get(c.id) ?? 0;
        return (
          <p
            className={`mono text-[10px] uppercase tracking-widest mb-2 ${n > 0 ? 'text-ember' : 'text-mist/70'}`}
            title={n > 0
              ? `${n} paper${n === 1 ? '' : 's'} published at ${c.name}, including Findings and co-located workshops`
              : `No ${c.name} papers yet \u2014 a venue we are targeting`}
          >
            {paperCountLabel(n)}
          </p>
        );
      })()}

      <h4 className="text-xl font-serif font-semibold text-paper mb-1 group-hover:text-signal transition-colors">
        {c.site ? <a href={c.site}>{c.name}</a> : c.name}
      </h4>
      <p className="text-mist text-xs mb-3 italic">{c.long}</p>

      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <p className="mono uppercase tracking-widest text-signal/70 mb-1">
            {c.type === 'journal' ? 'Submissions' : 'When'}
          </p>
          <p className="text-paper/85">
            {c.type === 'journal' ? 'Rolling' : fmtRange(c.start, c.end)}
          </p>
        </div>
        <div>
          <p className="mono uppercase tracking-widest text-signal/70 mb-1">Where</p>
          <p className="text-paper/85">{c.location || 'TBA'}</p>
        </div>
      </div>

      {next && (
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-signal/10 mb-3">
          <div>
            <p className="mono uppercase tracking-widest text-signal/70 text-xs mb-1">Next deadline</p>
            <p className="text-paper text-sm">{next.label} · {fmtDate(next.date)}</p>
          </div>
          <span className={`mono text-xs px-2 py-1 rounded-full ${next.days <= 14 ? 'bg-ember/15 text-ember border border-ember/30' : 'bg-signal/10 text-signal border border-signal/20'}`}>
            {next.days === 0 ? 'today' : next.days === 1 ? '1 day' : `${next.days} days`}
          </span>
        </div>
      )}

      {c.note && (
        <p className="text-mist text-xs leading-relaxed pt-3 border-t border-signal/10">{c.note}</p>
      )}
    </motion.article>
  );
};

const ConferencesSection = () => {
  const [fieldFilter, setFieldFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('upcoming');

  // Snap 'now' once at render — cheap, and we don't need per-second precision here.
  const now = useMemo(() => new Date(), []);

  const filtered = useMemo(() => {
    return data.conferences.filter(c => {
      // Journals have no dates, so the upcoming/past filter is meaningless
      // for them -- they are listed separately below.
      if (c.type === 'journal') return false;
      if (fieldFilter !== 'all' && c.field !== fieldFilter) return false;
      const startDays = c.start ? daysFromNow(c.start, now) : null;
      const isPast = startDays !== null && startDays < -14;
      if (statusFilter === 'upcoming' && isPast) return false;
      if (statusFilter === 'past' && !isPast) return false;
      return true;
    }).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
  }, [fieldFilter, statusFilter, now]);

  const journals = useMemo(
    () => data.conferences.filter(c => c.type === 'journal'
      && (fieldFilter === 'all' || c.field === fieldFilter)),
    [fieldFilter]);

  const fieldChips = [{ id: 'all', label: 'All Fields' }, ...data.fields];
  const statusChips = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past',     label: 'Past' },
    { id: 'all',      label: 'All' },
  ];

  return (
    <section id="conferences" className="relative py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="section-eyebrow text-center">Conferences</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          Where we <span className="italic text-signal">show up</span>.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-10">
          Venues we've presented at, are attending, or are targeting for submission — with paper deadlines counted down
          to the day.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {statusChips.map(c => (
              <button
                key={c.id}
                onClick={() => setStatusFilter(c.id)}
                className={`px-4 py-2 rounded-full text-xs mono transition-all
                  ${statusFilter === c.id ? 'bg-signal text-ink font-medium' : 'border border-signal/30 text-signal-soft hover:bg-signal/10'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="w-px bg-signal/20 self-stretch" />
          <div className="flex flex-wrap gap-2">
            {fieldChips.map(c => (
              <button
                key={c.id}
                onClick={() => setFieldFilter(c.id)}
                className={`px-4 py-2 rounded-full text-xs mono transition-all
                  ${fieldFilter === c.id ? 'bg-signal text-ink font-medium' : 'border border-signal/30 text-signal-soft hover:bg-signal/10'}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline gap-4 mb-6">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper">Conferences</h3>
          <span className="mono text-xs text-mist">{filtered.length}</span>
          <div className="flex-1 h-[1px] bg-signal/10" />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c, i) => <ConferenceCard key={c.id} c={c} i={i} now={now} />)}
          </div>
        ) : (
          <p className="text-mist text-center mono text-sm">No conferences match this filter.</p>
        )}

        {/* Source + Phase-3 tracker callout */}
        <div className="glass rounded-2xl p-5 md:p-6 mt-16 mb-4 max-w-3xl mx-auto text-sm text-center">
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">
            Canonical source{data.sources.length > 1 ? 's' : ''}
          </p>
          <p className="text-mist leading-relaxed mb-3 mx-auto max-w-prose">
            Deadlines are cross-checked against the trackers below. Where a CFP isn't posted
            yet, we mark deadlines <span className="mono text-signal-soft">TBA</span> rather
            than guess.
          </p>
          <ul className="mb-4 space-y-2 list-none">
            {data.sources.map(src => (
              <li key={src.url} className="text-mist leading-relaxed">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-signal hover:text-signal-soft underline transition-colors"
                >
                  {src.name}
                </a>
                {src.note && <span className="block text-xs text-mist/80 mt-0.5">{src.note}</span>}
              </li>
            ))}
          </ul>
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Coming soon — automated tracker</p>
          <p className="text-mist leading-relaxed mx-auto max-w-prose">
            Same Phase-3 backbone as Grants: a scheduled agent will poll the mlciv.com feed and conference sites,
            surface deadline changes, and auto-PR updates to <span className="mono text-signal-soft">conferences.json</span> —
            so the countdowns never go stale.
          </p>
        </div>

        {journals.length > 0 && (
          <div className="mt-16 mb-4">
            <div className="flex items-baseline gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper">Journals</h3>
              <span className="mono text-xs text-mist">{journals.length}</span>
              <div className="flex-1 h-[1px] bg-signal/10" />
            </div>
            <p className="text-mist text-sm mb-6 max-w-3xl">
              Rolling submissions rather than a deadline, so these sit outside the countdown above.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {journals.map((c, i) => (
                <ConferenceCard key={c.id} c={c} i={i} now={now} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConferencesSection;
