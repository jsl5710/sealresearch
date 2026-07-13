import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import themes from '../data/themes.json';

const ResearchThemes = () => {
  const [active, setActive] = useState(themes[0].id);
  const activeTheme = themes.find(t => t.id === active);

  return (
    <section id="research" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-eyebrow text-center"
        >
          Research Themes
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight"
        >
          Four questions we're working on.
        </motion.h2>

        <p className="text-mist text-center max-w-2xl mx-auto mb-16">
          Every project in the lab lives inside one — often more than one — of these four areas.
        </p>

        {/* Theme selector chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-5 py-2.5 rounded-full text-sm mono transition-all
                ${active === t.id
                  ? 'bg-signal text-ink font-medium'
                  : 'border border-signal/30 text-signal-soft hover:bg-signal/10'}`}
            >
              {t.short || t.title.split(' and ')[0].split(':')[0]}
            </button>
          ))}
        </div>

        {/* Active theme panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-strong rounded-3xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="md:w-1/3">
                <div className={`inline-block mono text-xs uppercase tracking-widest mb-3 ${activeTheme.accent === 'ember' ? 'text-ember' : 'text-signal'}`}>
                  {activeTheme.eyebrow}
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-semibold text-paper leading-tight">
                  {activeTheme.title}
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-paper/90 leading-relaxed mb-6">
                  {activeTheme.summary}
                </p>
                <p className="text-mist leading-relaxed mb-6">
                  {activeTheme.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeTheme.keywords.map(k => (
                    <span key={k} className={activeTheme.accent === 'ember' ? 'chip-ember' : 'chip'}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ResearchThemes;
