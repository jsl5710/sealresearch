import React from 'react';
import { motion } from 'framer-motion';
import people from '../data/people.json';

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
        {person.links && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mono">
            {person.links.website && <a href={person.links.website} className="text-signal hover:text-signal-soft transition-colors">website</a>}
            {person.links.scholar && <a href={person.links.scholar} className="text-signal hover:text-signal-soft transition-colors">scholar</a>}
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
            <h3 className="mono text-signal text-xs uppercase tracking-widest text-center mb-6">Students & Researchers</h3>
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
