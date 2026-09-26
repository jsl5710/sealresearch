import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import people from '../data/people.json';
import courses from '../data/courses.json';

/*
 * ORCID iD mark, inlined. ORCID's own embed snippet hot-links the icon
 * from orcid.org; that is the same third-party pattern that tracking
 * protection blocks, so the path data lives here instead.
 *
 * rel="me" is ORCID's documented recommendation: it asserts that this
 * page and the ORCID record refer to the same person.
 */
const OrcidIcon = () => (
  <svg viewBox="0 0 256 256" aria-hidden="true" className="inline-block h-[1em] w-[1em] align-[-0.125em]">
    <circle cx="128" cy="128" r="128" fill="#A6CE39" />
    <path fill="#FFF" d="M86.3 186.2H70.9V79.1h15.4v107.1z" />
    <path fill="#FFF" d="M108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7 0-21.5-13.7-39.7-43.7-39.7h-23.7v79.4z" />
    <path fill="#FFF" d="M88.7 56.8c0 5.5-4.5 10.1-10.1 10.1s-10.1-4.6-10.1-10.1c0-5.6 4.5-10.1 10.1-10.1s10.1 4.6 10.1 10.1z" />
  </svg>
);

const fmtPeriod = (start, end) => {
  const format = (s) => {
    if (!s) return '';
    const m = /^(\d{4})-(\d{2})$/.exec(s);
    if (!m) return s;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m[2],10)-1]} ${m[1]}`;
  };
  const s = format(start);
  const e = end ? format(end) : 'Present';
  return s && e ? `${s} – ${e}` : s || e;
};

const AppointmentsBlock = ({ appointments }) => {
  const [open, setOpen] = useState(false);
  if (!appointments || appointments.length === 0) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="mono text-xs uppercase tracking-widest text-signal hover:text-signal-soft transition-colors flex items-center gap-2"
        aria-expanded={open}
      >
        Appointments &amp; Trajectory
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >→</motion.span>
        <span className="text-mist normal-case tracking-normal">({appointments.length})</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 pl-4 border-l border-signal/20 mt-2 space-y-4">
              {appointments.map((a, i) => (
                <div key={i} className="text-sm">
                  <div className="flex flex-wrap items-baseline gap-x-2 mb-1">
                    <span className="text-paper font-medium">{a.role}</span>
                    {a.program && <span className="text-signal-soft">· {a.program}</span>}
                  </div>
                  <p className="text-mist text-xs mb-1">{a.organization}{a.location ? ` — ${a.location}` : ''}</p>
                  <p className="mono text-xs text-signal/80 mb-2">{fmtPeriod(a.start, a.end)}</p>
                  {a.description && <p className="text-mist text-xs leading-relaxed mb-2">{a.description}</p>}
                  {a.links && a.links.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mono">
                      {a.links.map(l => (
                        <a key={l.url} href={l.url} className="text-signal hover:text-signal-soft transition-colors">
                          {l.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PersonCard = ({ person, isPI }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`glass rounded-2xl p-6 ${isPI ? 'md:col-span-2' : ''}`}
  >
    <div className={`flex ${isPI ? 'flex-col md:flex-row md:gap-8' : 'flex-col'} gap-4`}>
      <div className={`${isPI ? 'md:w-1/3' : 'w-full'} aspect-square rounded-xl overflow-hidden bg-slate flex items-center justify-center border border-signal/20`}>
        {person.photo ? (
          <img
            src={`${import.meta.env.BASE_URL}${person.photo}`}
            alt={person.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span className="mono text-signal/60 text-sm">Photo</span>
        )}
      </div>
      <div className={`${isPI ? 'md:w-2/3' : 'w-full'}`}>
        <h3 className="text-2xl font-serif font-semibold text-paper">{person.name}</h3>
        <p className="mono text-xs uppercase tracking-widest text-signal mt-1 mb-2">{person.role}</p>
        {person.title && <p className="text-sm text-mist mb-3">{person.title}</p>}
        {person.affiliation && <p className="text-sm text-mist mb-3">{person.affiliation}</p>}
        <p className="text-mist leading-relaxed text-sm mb-4">{person.bio}</p>
        {person.teachesCourseIds && person.teachesCourseIds.length > 0 && (
          <div className="mb-4">
            <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Teaches</p>
            <ul className="text-sm text-paper/85 space-y-1">
              {person.teachesCourseIds
                .map(id => courses.find(c => c.id === id))
                .filter(Boolean)
                .map(c => (
                  <li key={c.id}>
                    <a href="#courses" className="hover:text-signal transition-colors">
                      {c.title} <span className="text-mist">— {c.term}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <AppointmentsBlock appointments={person.appointments} />
        {person.links && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mono">
            {person.links.website && <a href={person.links.website} className="text-signal hover:text-signal-soft transition-colors">website</a>}
            {person.links.scholar && <a href={person.links.scholar} className="text-signal hover:text-signal-soft transition-colors">scholar</a>}
            {person.links.orcid && (
              <a
                href={person.links.orcid}
                rel="me noopener noreferrer"
                target="_blank"
                title={person.links.orcid}
                className="inline-flex items-center gap-1 text-signal hover:text-signal-soft transition-colors"
              >
                <OrcidIcon />orcid
              </a>
            )}
            {person.links.github && <a href={person.links.github} className="text-signal hover:text-signal-soft transition-colors">github</a>}
            {person.links.twitter && <a href={person.links.twitter} className="text-signal hover:text-signal-soft transition-colors">twitter</a>}
            {person.links.email && <a href={`mailto:${person.links.email}`} className="text-signal hover:text-signal-soft transition-colors">email</a>}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const PeopleSection = () => {
  return (
    <section id="people" className="relative py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <p className="section-eyebrow text-center">People</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-16 leading-tight">
          The <span className="italic text-signal">humans</span> behind the work.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <PersonCard person={people.pi} isPI />
        </div>

        {people.students.length > 0 && (
          <>
            <h3 className="mono text-signal text-xs uppercase tracking-widest text-center mb-6">Students &amp; Researchers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {people.students.map(s => <PersonCard key={s.name} person={s} />)}
            </div>
          </>
        )}

        {people.collaborators.length > 0 && (
          <>
            <h3 className="mono text-signal text-xs uppercase tracking-widest text-center mb-6">Collaborators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {people.collaborators.map(c => (
                <div key={c.name} className="glass rounded-xl p-5">
                  <p className="text-paper font-medium">{c.name}</p>
                  <p className="mono text-xs uppercase tracking-widest text-signal mt-1">{c.role}</p>
                  {c.affiliation && <p className="text-mist text-sm mt-1">{c.affiliation}</p>}
                  {c.links?.website && <a href={c.links.website} className="mono text-xs text-signal hover:text-signal-soft transition-colors mt-2 inline-block">website →</a>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PeopleSection;
