import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import projectsData from '../data/projects.json';
import themes from '../data/themes.json';
import grantsData from '../data/grants.json';
import publications from '../data/publications.json';

const STATUS = {
  planning:     { label: 'Planning',     cls: 'chip' },
  active:       { label: 'Active',       cls: 'chip-ember' },
  'wrapping-up':{ label: 'Wrapping up',  cls: 'chip' },
  archived:     { label: 'Archived',     cls: 'chip' },
};

const themeShort = (t) => t.short || t.title.split(' and ')[0].split(':')[0];

const ProjectCard = ({ p, i }) => {
  const themesOf = (p.themeIds || []).map(id => themes.find(t => t.id === id)).filter(Boolean);
  const grantsOf = (p.grantIds || []).map(id => grantsData.grants.find(g => g.id === id)).filter(Boolean);
  const outputsOf = (p.outputIds || []).map(id => publications.find(x => x.id === id)).filter(Boolean);
  const st = STATUS[p.status] || STATUS.planning;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.06 }}
      className="glass-strong rounded-2xl p-6 md:p-8"
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={st.cls}>{st.label}</span>
        {p.start && <span className="mono text-xs text-mist">· Started {p.start}</span>}
        {p.end && <span className="mono text-xs text-mist">· Ended {p.end}</span>}
      </div>

      <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper mb-3">
        {p.url ? <a href={p.url} className="hover:text-signal transition-colors">{p.title}</a> : p.title}
      </h3>

      {p.direction && (
        <p className="text-paper/85 leading-relaxed mb-4 italic">{p.direction}</p>
      )}

      {p.summary && (
        <p className="text-mist text-sm leading-relaxed mb-5">{p.summary}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-signal/10 text-sm">
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Themes</p>
          <div className="flex flex-wrap gap-2">
            {themesOf.map(t => (
              <a key={t.id} href="#research" className={t.accent === 'ember' ? 'chip-ember' : 'chip'}>
                {themeShort(t)}
              </a>
            ))}
            {themesOf.length === 0 && <span className="text-mist/60 text-xs">—</span>}
          </div>
        </div>
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Funding</p>
          <ul className="space-y-1">
            {grantsOf.map(g => (
              <li key={g.id}>
                <a href="#grants" className="text-signal-soft hover:text-signal transition-colors text-xs">
                  {g.program}
                </a>
              </li>
            ))}
            {grantsOf.length === 0 && <span className="text-mist/60 text-xs">—</span>}
          </ul>
        </div>
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Outputs</p>
          {outputsOf.length > 0 ? (
            <p className="text-paper/85 text-xs">
              <a href="#publications" className="hover:text-signal transition-colors">
                {outputsOf.length} publication{outputsOf.length === 1 ? '' : 's'} →
              </a>
            </p>
          ) : (
            <span className="text-mist/60 text-xs">In progress</span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const EmptyState = () => {
  const [showSchema, setShowSchema] = useState(false);

  return (
    <div className="glass-strong rounded-3xl p-8 md:p-14">
      <div className="text-center mb-10">
        <div className="mx-auto w-14 h-14 rounded-full border border-signal/40 flex items-center justify-center mb-6">
          <span className="mono text-signal text-xl">∅</span>
        </div>
        <p className="mono text-xs uppercase tracking-widest text-signal mb-4">No projects yet</p>
        <h3 className="text-3xl font-serif font-semibold text-paper mb-3">
          Where <span className="italic text-signal">themes meet reality</span>.
        </h3>
        <p className="text-mist max-w-2xl mx-auto leading-relaxed">
          Each project on this page will connect one or more research themes to the funding that makes it possible
          and the papers, datasets, and tools it produces. We're standing up the lab now — the first project
          lands here soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">
        {themes.map(t => (
          <div key={t.id} className={`glass rounded-xl p-4 border-l-2 ${t.accent === 'ember' ? 'border-ember' : 'border-signal'}`}>
            <p className={`mono text-xs uppercase tracking-widest mb-2 ${t.accent === 'ember' ? 'text-ember' : 'text-signal'}`}>
              Theme
            </p>
            <p className="text-paper/90 text-sm font-medium leading-snug">{themeShort(t)}</p>
            <p className="mono text-xs text-mist mt-3">Awaiting project</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowSchema(s => !s)}
          className="mono text-xs uppercase tracking-widest text-signal hover:text-signal-soft transition-colors"
          aria-expanded={showSchema}
        >
          {showSchema ? '↑ Hide project schema' : '↓ Show project schema (for future edits)'}
        </button>

        <AnimatePresence>
          {showSchema && (
            <motion.pre
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 overflow-auto text-left text-xs font-mono text-paper/80 bg-ink/60 rounded-xl p-5 border border-signal/10"
            >{`{
  "id": "kebab-case-id",
  "title": "Project title",
  "status": "planning | active | wrapping-up | archived",
  "direction": "1–3 sentence direction / hypothesis",
  "summary": "Longer paragraph.",
  "start": "YYYY-MM",
  "end": null,
  "themeIds": ["multilingual", "integrity"],
  "grantIds": ["cub-startup-2026"],
  "leadIds": ["pi"],
  "outputIds": ["dia-harm-acl26"],
  "collaboratorNames": ["Adaku Uchendu (MIT LL)"],
  "url": "https://..."
}`}</motion.pre>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const { projects } = projectsData;
  const active = projects.filter(p => p.status !== 'archived');
  const archived = projects.filter(p => p.status === 'archived');

  return (
    <section id="projects" className="relative py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="section-eyebrow text-center">Projects</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          Themes, funding, <span className="italic text-signal">outputs</span> — in one place.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-14">
          Each project ties one or more research themes to the grants funding it and the papers, datasets,
          and tools it produces.
        </p>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {active.length > 0 && (
              <div className="space-y-6 mb-14">
                {active.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
              </div>
            )}
            {archived.length > 0 && (
              <>
                <div className="flex items-baseline gap-4 mb-6">
                  <h3 className="text-xl font-serif font-semibold text-paper">Archived</h3>
                  <span className="mono text-xs text-mist">{archived.length}</span>
                  <div className="flex-1 h-[1px] bg-signal/10" />
                </div>
                <div className="space-y-6">
                  {archived.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
