import React from 'react';
import { motion } from 'framer-motion';
import news from '../data/news.json';

const tagColor = (tag) => {
  switch (tag) {
    case 'Award': return 'chip-ember';
    case 'Paper': return 'chip';
    case 'Announcement': return 'chip';
    default: return 'chip';
  }
};

const NewsSection = () => {
  return (
    <section id="news" className="relative py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <p className="section-eyebrow text-center">News</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-16 leading-tight">
          What we've been up to.
        </h2>

        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-signal/20 -translate-x-1/2" aria-hidden="true" />

          <div className="space-y-10">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`relative flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-6`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-signal border-4 border-ink -translate-x-1/2 mt-1 md:mt-0" />

                <div className="ml-12 md:ml-0 md:w-1/2 glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={tagColor(item.tag)}>{item.tag}</span>
                    <span className="mono text-mist text-xs">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-paper mb-2">{item.title}</h3>
                  <p className="text-mist text-sm leading-relaxed">{item.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
