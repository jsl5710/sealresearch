import React from 'react';
import { motion } from 'framer-motion';
import courses from '../data/courses.json';

const statusChip = (status) => {
  const map = {
    upcoming: { label: 'Upcoming', cls: 'chip-ember' },
    active: { label: 'In Session', cls: 'chip' },
    past: { label: 'Past', cls: 'chip' },
  };
  const s = map[status] || map.past;
  return <span className={s.cls}>{s.label}</span>;
};

const CoursesSection = () => {
  return (
    <section id="courses" className="relative py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="section-eyebrow text-center">Courses</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          Teaching at <span className="italic text-signal">CU Boulder</span>.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-16">
          Coursework taught by SEAL faculty. Syllabi and materials are shared here when available.
        </p>

        <div className="space-y-6">
          {courses.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-strong rounded-2xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {statusChip(c.status)}
                  <span className="mono text-signal text-sm">{c.term}</span>
                  {c.level && <span className="mono text-mist text-xs">· {c.level}</span>}
                </div>
                {c.code && <span className="mono text-mist text-xs">{c.code}</span>}
              </div>

              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper mb-3">
                {c.title}
              </h3>

              {(c.instructor || c.meetingDays || c.location) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-signal/10">
                  {c.instructor && (
                    <div>
                      <p className="mono text-[10px] uppercase tracking-widest text-signal/70 mb-1">Instructor</p>
                      <p className="text-paper/90 text-sm">{c.instructor}</p>
                    </div>
                  )}
                  {(c.meetingDays || c.meetingTime) && (
                    <div>
                      <p className="mono text-[10px] uppercase tracking-widest text-signal/70 mb-1">When</p>
                      <p className="text-paper/90 text-sm">
                        {c.meetingDays}{c.meetingDays && c.meetingTime ? ' · ' : ''}{c.meetingTime}
                      </p>
                    </div>
                  )}
                  {c.location && (
                    <div>
                      <p className="mono text-[10px] uppercase tracking-widest text-signal/70 mb-1">Where</p>
                      <p className="text-paper/90 text-sm">{c.location}</p>
                    </div>
                  )}
                </div>
              )}

              {c.summary && (
                <p className="text-paper/80 leading-relaxed mb-6">{c.summary}</p>
              )}

              {c.topics && c.topics.length > 0 && (
                <div className="mb-6">
                  <p className="mono text-xs uppercase tracking-widest text-signal mb-3">Topics</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-mist">
                    {c.topics.map(t => (
                      <li key={t} className="flex items-start gap-2">
                        <span className="text-signal mt-1">›</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(c.syllabusUrl || c.canvasUrl) && (
                <div className="flex flex-wrap gap-4 pt-4 border-t border-signal/10 text-xs mono">
                  {c.syllabusUrl && <a href={c.syllabusUrl} className="text-signal hover:text-signal-soft transition-colors">syllabus →</a>}
                  {c.canvasUrl && <a href={c.canvasUrl} className="text-signal hover:text-signal-soft transition-colors">canvas →</a>}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
