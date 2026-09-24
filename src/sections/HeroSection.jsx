import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import lab from '../data/lab.json';

/*
 * Hero logo with a light "AI" treatment, built from the same vocabulary as
 * the site's DataFlow background: cyan signal, drifting nodes, thin lines.
 *
 *   - a breathing halo behind the mark
 *   - a ring of orbiting nodes
 *
 * Deliberately no sweep or shimmer across the mark itself: motion sits
 * around the logo, never on it, so the logo always reads as the logo.
 *
 * Colors come from the signal token, so the effect re-tints per theme
 * instead of hardcoding cyan onto the light themes.
 *
 * All of it collapses to a static logo under prefers-reduced-motion: this
 * is the first thing on the page, and a perpetual pulse is exactly what
 * that setting exists to prevent.
 */
const HeroLogo = () => {
  const reduce = useReducedMotion();
  const src = `${import.meta.env.BASE_URL}seal-logo.png`;


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.15 }}
      /* Sized against viewport HEIGHT, not width: the hero is min-h-screen
         with overflow-hidden, so a fixed-height logo would push the headline
         and buttons out of frame on a short laptop window and they would be
         clipped rather than scrollable. */
      className="relative mx-auto w-[clamp(7rem,17vh,15rem)] aspect-square
                 mb-[clamp(1.75rem,5vh,4rem)]"
    >
      {/* Halo */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-18%] rounded-full bg-signal/20 blur-2xl"
        animate={reduce ? undefined : { opacity: [0.3, 0.65, 0.3], scale: [0.92, 1.06, 0.92] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbiting nodes — same motif as the DataFlow background */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-[-12%] rounded-full border border-signal/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 120, 240].map(deg => (
            /* Rotate a full-size wrapper and pin the node to its top edge --
               simpler and more reliable than composing translate offsets. */
            <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
              <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2
                               rounded-full bg-signal shadow-[0_0_8px_var(--color-signal)]" />
            </div>
          ))}
        </motion.div>
      )}

      <img src={src} alt="" aria-hidden="true"
           className="relative z-10 h-full w-full object-contain
                      drop-shadow-[0_6px_28px_rgba(0,0,0,0.45)]" />

    </motion.div>
  );
};

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
          /* Self-hosted rather than hot-linked from Unsplash: a third-party
             image can be blocked by tracking protection or an ad blocker,
             and it silently blanks the hero when that happens. Serving it
             ourselves also drops a cross-origin request on first paint.
             Source: Unsplash photo-1451187580459-43490279c0fa (Unsplash
             License). */
          src={`${import.meta.env.BASE_URL}hero-earth.jpg`}
          alt=""
          aria-hidden="true"
          className="hero-media w-full h-full object-cover"
        />
        <div className="hero-scrim absolute inset-0" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <HeroLogo />

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
