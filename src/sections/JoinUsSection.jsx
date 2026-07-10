import React from 'react';
import { motion } from 'framer-motion';
import openings from '../data/openings.json';
import lab from '../data/lab.json';

const JoinUsSection = () => {
  return (
    <section id="join" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-5xl mx-auto">
        <p className="section-eyebrow text-center">Join Us</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          We're <span className="italic text-signal">building the team</span>.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-16">
          If you care about AI that works safely and fairly for everyone — not just English speakers — we want to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {openings.map((op, i) => (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-6 flex flex-col"
            >
              <p className="mono text-xs uppercase tracking-widest text-signal mb-2">{op.audience}</p>
              <h3 className="text-2xl font-serif font-semibold text-paper mb-4">{op.role}</h3>
              <p className="text-mist text-sm leading-relaxed mb-6 flex-grow">{op.description}</p>
              <div className="pt-4 border-t border-signal/10">
                <p className="mono text-xs uppercase tracking-widest text-signal mb-2">How to apply</p>
                <p className="text-paper/80 text-sm leading-relaxed">{op.howToApply}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href={`mailto:${lab.email}`} className="btn-primary">
            Reach out: {lab.email}
          </a>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;
