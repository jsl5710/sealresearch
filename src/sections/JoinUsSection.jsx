import React from 'react';
import { motion } from 'framer-motion';
import openings from '../data/openings.json';
import lab from '../data/lab.json';

const STATUS = {
  open:   { label: 'Recruiting', cls: 'chip' },
  future: { label: 'Future openings', cls: 'chip-ember' },
  paused: { label: 'On hold', cls: 'chip-ember' },
};

const JoinUsSection = () => {
  const active = openings.filter(o => o.status === 'open');
  const future = openings.filter(o => o.status !== 'open');

  return (
    <section id="join" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-6xl mx-auto">
        <p className="section-eyebrow text-center">Join Us</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          We're <span className="italic text-signal">building the team</span>.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-14">
          If you care about AI that works safely and fairly for everyone — not just English speakers — we want to hear from you.
        </p>

        {/* Active roles */}
        {active.length > 0 && (
          <>
            <div className="flex items-baseline gap-4 mb-6">
              <h3 className="text-xl font-serif font-semibold text-paper">Actively recruiting</h3>
              <span className="mono text-xs text-mist">{active.length}</span>
              <div className="flex-1 h-[1px] bg-signal/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
              {active.map((op, i) => (
                <OpeningCard key={op.id} op={op} i={i} />
              ))}
            </div>
          </>
        )}

        {/* Future roles */}
        {future.length > 0 && (
          <>
            <div className="flex items-baseline gap-4 mb-6">
              <h3 className="text-xl font-serif font-semibold text-paper">On the horizon</h3>
              <span className="mono text-xs text-mist">{future.length}</span>
              <div className="flex-1 h-[1px] bg-signal/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {future.map((op, i) => (
                <OpeningCard key={op.id} op={op} i={i} muted />
              ))}
            </div>
          </>
        )}

        {/* Mentorship note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 glass rounded-2xl p-6 md:p-8 max-w-3xl mx-auto"
        >
          <p className="mono text-xs uppercase tracking-widest text-signal mb-3">A note on mentorship</p>
          <p className="text-paper/85 leading-relaxed">
            SEAL is committed to mentoring students from communities historically underrepresented in AI — including
            first-generation students, international students, and researchers from the Global South and small-island
            developing states. Reach out even if you don't fit a "typical" ML profile. What matters is what you want to build,
            and who you want to build it for.
          </p>
        </motion.div>

        <div className="mt-14 text-center">
          <a href={`mailto:${lab.email}`} className="btn-primary">
            Reach out: {lab.email}
          </a>
        </div>
      </div>
    </section>
  );
};

const OpeningCard = ({ op, i, muted = false }) => {
  const st = STATUS[op.status] || STATUS.open;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      className={`glass-strong rounded-2xl p-6 md:p-7 flex flex-col ${muted ? 'opacity-90' : ''}`}
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={st.cls}>{st.label}</span>
        {op.term && <span className="mono text-xs text-mist">· {op.term}</span>}
      </div>
      <p className="mono text-xs uppercase tracking-widest text-signal mb-2">{op.audience}</p>
      <h4 className="text-2xl font-serif font-semibold text-paper mb-4">{op.role}</h4>
      <p className="text-mist text-sm leading-relaxed mb-6 flex-grow">{op.description}</p>
      <div className="pt-4 border-t border-signal/10">
        <p className="mono text-xs uppercase tracking-widest text-signal mb-2">How to apply</p>
        <p className="text-paper/85 text-sm leading-relaxed">{op.howToApply}</p>
      </div>
    </motion.div>
  );
};

export default JoinUsSection;
