import React from 'react';
import { motion } from 'framer-motion';
import lab from '../data/lab.json';

const HeroSection = () => {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Layered gradient + slow zoom on a subtle abstract image */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: "linear" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="section-eyebrow"
        >
          {lab.institution} · Established {lab.founded}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-5xl md:text-8xl font-serif font-semibold text-paper mb-6 leading-[1.02] tracking-tight"
        >
          Secure &amp; Ethical <br />
          <span className="italic font-normal text-signal">AI Lab</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-lg md:text-2xl text-mist font-light mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          {lab.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a href="#research" className="btn-primary">Explore our research</a>
          <a href="#join" className="text-paper font-medium hover:text-signal transition-colors flex items-center gap-2 group">
            Join the lab
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >→</motion.span>
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-mist text-xs mono tracking-widest uppercase"
      >
        Scroll to explore
      </motion.div>
    </section>
  );
};

export default HeroSection;
