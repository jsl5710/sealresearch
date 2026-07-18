import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import lab from '../data/lab.json';
import { useTheme } from '../theme/ThemeContext';

const primary = [
  { name: 'Research',     href: '#research' },
  { name: 'People',       href: '#people' },
  { name: 'Publications', href: '#publications' },
  { name: 'Join Us',      href: '#join' },
];

const moreBase = [
  { name: 'Mission',     href: '#mission' },
  { name: 'Projects',    href: '#projects' },
  { name: 'Courses',     href: '#courses' },
  { name: 'News',        href: '#news' },
  { name: 'Grants',      href: '#grants' },
  { name: 'Conferences', href: '#conferences' },
  { name: 'Handbook',    href: '#handbook' },
];

const ADMIN_ENTRIES = [
  { name: 'Budget', href: '#budget' },
];

const Navbar = () => {
  const { isAdmin } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const more = isAdmin ? [...moreBase, ...ADMIN_ENTRIES.map(e => ({ ...e, isAdmin: true }))] : moreBase;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12
      ${isScrolled ? 'glass py-3 shadow-xl shadow-signal/5' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.a
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group"
        >
          <img
            src={`${import.meta.env.BASE_URL}seal-logo.png`}
            alt="SEAL logo"
            className="h-9 w-9 md:h-10 md:w-10 object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-paper">
            {lab.short}
            <span className="text-signal">.</span>
          </span>
        </motion.a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {primary.map((l, i) => (
            <motion.a
              key={l.name}
              href={l.href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="px-4 py-2 rounded-full text-sm font-medium text-paper/80 hover:text-signal hover:bg-signal/5 transition-colors"
            >
              {l.name}
            </motion.a>
          ))}

          <div className="relative">
            <button
              onClick={() => setMoreOpen(o => !o)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 180)}
              className="px-4 py-2 rounded-full text-sm font-medium text-paper/80 hover:text-signal hover:bg-signal/5 transition-colors flex items-center gap-1"
              aria-expanded={moreOpen}
            >
              More
              <motion.span animate={{ rotate: moreOpen ? 180 : 0 }} className="inline-block text-xs">▾</motion.span>
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute right-0 top-full mt-2 min-w-[180px] glass-strong rounded-xl p-2 shadow-xl"
                >
                  {more.map(l => (
                    <a
                      key={l.name}
                      href={l.href}
                      className="flex items-center justify-between px-4 py-2 rounded-lg text-sm text-paper/85 hover:bg-signal/10 hover:text-signal transition-colors"
                    >
                      <span>{l.name}</span>
                      {l.isAdmin && <span className="mono text-[10px] text-ember uppercase">admin</span>}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#contact" className="ml-3 btn-primary text-sm py-2">
            Contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden text-signal focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />}
          </svg>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={mobileOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden glass rounded-b-2xl mt-4"
      >
        <div className="flex flex-col p-6 space-y-2">
          {[...primary, ...more, { name: 'Contact', href: '#contact' }].map(l => (
            <a
              key={l.name}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-paper hover:text-signal py-1"
            >
              {l.name}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
