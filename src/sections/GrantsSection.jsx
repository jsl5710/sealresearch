import React, { useState } from 'react';
import { motion } from 'framer-motion';
import grantsData from '../data/grants.json';

const STATUS = {
  targeting: { label: 'Targeting', cls: 'chip' },
  planning:  { label: 'Planning',  cls: 'chip' },
  submitted: { label: 'Submitted', cls: 'chip' },
  awarded:   { label: 'Awarded',   cls: 'chip-ember' },
  active:    { label: 'Active',    cls: 'chip-ember' },
  declined:  { label: 'Declined',  cls: 'chip' },
};

const AWARDED_STATUSES = new Set(['awarded', 'active']);

const parseAmount = (a) => {
  if (!a || a === 'TBA') return 0;
  const n = parseFloat(a.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
};

const fmtMoney = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n.toFixed(0)}`;

const fmtDate = (d) => {
  if (!d || d === 'TBA' || d === 'Rolling') return d || 'TBA';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m[2],10)-1]} ${parseInt(m[3],10)}, ${m[1]}`;
};

const GrantsSection = () => {
  const [sourceFilter, setSourceFilter] = useState('all');
  const { sources, grants } = grantsData;

  const awarded = grants
    .filter(g => AWARDED_STATUSES.has(g.status))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const pipeline = grants.filter(g => !AWARDED_STATUSES.has(g.status));

  const totalAwarded = awarded.reduce((sum, g) => sum + parseAmount(g.amount), 0);

  const filtered = sourceFilter === 'all'
    ? pipeline
    : pipeline.filter(g => g.source === sourceFilter);

  const grouped = sources
    .map(src => ({ ...src, items: filtered.filter(g => g.source === src.id) }))
    .filter(g => g.items.length > 0);

  const sourceChips = [{ id: 'all', label: 'All Sources' }, ...sources.map(s => ({ id: s.id, label: s.label }))];

  return (
    <section id="grants" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-6xl mx-auto">
        <p className="section-eyebrow text-center">Grants</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          Funding & <span className="italic text-signal">opportunities</span>.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-10">
          Active, targeted, and planned funding across internal CU Boulder programs, federal agencies (NSF, NIH, DARPA),
          the American Cancer Association, and industry sponsors.
        </p>

        {/* Awarded — summary row */}
        {awarded.length > 0 && (
          <div className="mb-14">
            <div className="flex items-baseline gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper">🏆 Awarded &amp; Active</h3>
              <span className="mono text-xs text-mist">{awarded.length}</span>
              <div className="flex-1 h-[1px] bg-ember/20" />
              {totalAwarded > 0 && (
                <span className="mono text-ember text-sm">Total: {fmtMoney(totalAwarded)}</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awarded.map((g, i) => (
                <AwardCard key={g.id} g={g} i={i} />
              ))}
            </div>
          </div>
        )}

        {/* Phase-3 roadmap callout — remove or update once the tracker agent is deployed */}
        <div className="glass rounded-2xl p-5 md:p-6 mb-12 max-w-3xl mx-auto text-sm">
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Coming soon — automated tracker</p>
          <p className="text-mist leading-relaxed">
            This page is hand-maintained today. A scheduled agent (Cloudflare Worker + LLM) will soon watch NSF Guide,
            NIH Guide, DARPA BAAs, and ACA program RSS feeds, surface newly-opened calls, flag close-date changes,
            and propose PRs to this file — so the list stays fresh without a human refresh.
          </p>
        </div>

        <div className="flex items-baseline gap-4 mb-6">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper">Pipeline</h3>
          <span className="mono text-xs text-mist">{pipeline.length}</span>
          <div className="flex-1 h-[1px] bg-signal/10" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {sourceChips.map(c => (
            <button
              key={c.id}
              onClick={() => setSourceFilter(c.id)}
              className={`px-4 py-2 rounded-full text-xs mono transition-all
                ${sourceFilter === c.id
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
                <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper">{group.label}</h3>
                <span className="mono text-xs text-mist">{group.items.length}</span>
                <div className="flex-1 h-[1px] bg-signal/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((g, i) => (
                  <GrantCard key={g.id} g={g} i={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {grouped.length === 0 && (
          <p className="text-mist text-center mono text-sm">No grants match this filter.</p>
        )}
      </div>
    </section>
  );
};

const GrantCard = ({ g, i }) => {
  const st = STATUS[g.status] || STATUS.targeting;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06 }}
      className="glass rounded-2xl p-6 hover:border-signal/40 transition-colors group"
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={st.cls}>{st.label}</span>
        <span className="mono text-xs text-mist">· {g.role}</span>
        {g.amount && g.amount !== 'TBA' && <span className="mono text-xs text-mist">· {g.amount}</span>}
      </div>

      <p className="mono text-signal text-sm mb-2">{g.program}</p>

      <h4 className="text-lg font-serif font-semibold text-paper mb-4 group-hover:text-signal transition-colors">
        {g.url ? <a href={g.url}>{g.title}</a> : g.title}
      </h4>

      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
        <div>
          <p className="mono uppercase tracking-widest text-signal/70 mb-1">Opens</p>
          <p className="text-paper/85">{fmtDate(g.opens)}</p>
        </div>
        <div>
          <p className="mono uppercase tracking-widest text-signal/70 mb-1">Closes</p>
          <p className="text-paper/85">{fmtDate(g.closes)}</p>
        </div>
      </div>

      {g.notes && (
        <p className="text-mist text-xs leading-relaxed pt-3 border-t border-signal/10">{g.notes}</p>
      )}
    </motion.article>
  );
};

const AwardCard = ({ g, i }) => {
  const st = STATUS[g.status] || STATUS.awarded;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06 }}
      className="glass-strong rounded-2xl p-6 border border-ember/20 hover:border-ember/40 transition-colors group"
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={st.cls}>{st.label}</span>
        <span className="mono text-xs text-mist">· {g.role}</span>
      </div>
      <p className="mono text-signal text-sm mb-2">{g.program}</p>
      <h4 className="text-lg font-serif font-semibold text-paper mb-4 group-hover:text-ember transition-colors">
        {g.url ? <a href={g.url}>{g.title}</a> : g.title}
      </h4>
      <div className="flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-ember/10">
        <div>
          <p className="mono uppercase tracking-widest text-ember/70 text-xs mb-1">Awarded</p>
          <p className="text-paper/85 text-sm">{fmtDate(g.date)}</p>
        </div>
        <p className="text-2xl font-serif text-ember">{g.amount || 'TBA'}</p>
      </div>
      {g.notes && (
        <p className="text-mist text-xs leading-relaxed mt-4">{g.notes}</p>
      )}
    </motion.article>
  );
};

export default GrantsSection;
