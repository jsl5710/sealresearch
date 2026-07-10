import React from 'react';
import { motion } from 'framer-motion';
import lab from '../data/lab.json';

const MissionSection = () => {
  return (
    <section id="mission" className="relative py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-eyebrow text-center"
        >
          Our Mission
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-12 leading-tight"
        >
          Safety is a{" "}
          <span className="italic text-signal">design constraint</span>,
          not a downstream patch.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-mist leading-relaxed text-center max-w-3xl mx-auto"
        >
          {lab.mission}
        </motion.p>

        {/* Signal band */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.5 }}
          className="mt-16 h-[1px] bg-gradient-to-r from-transparent via-signal to-transparent origin-left"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { k: "79", v: "Languages studied" },
            { k: "12+", v: "Published papers" },
            { k: "1", v: "Social Impact Award" },
          ].map((stat, i) => (
            <motion.div
              key={stat.v}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
              className="text-center"
            >
              <div className="text-5xl font-serif text-signal mb-2">{stat.k}</div>
              <div className="mono text-sm uppercase tracking-widest text-mist">{stat.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
