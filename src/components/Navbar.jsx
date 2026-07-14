import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import lab from '../data/lab.json';

const navLinks = [
  { name: 'Mission', href: '#mission' },
  { name: 'Research', href: '#research' },
  { name: 'Projects', href: '#projects' },
  { name: 'People', href: '#people' },
  { name: 'Publications', href: '#publications' },
  { name: 'Courses', href: '#courses' },
  { name: 'News', href: '#news' },
  { name: 'Grants', href: '#grants' },
  { name: 'Join Us', href: '#join' },
  { name: 'Handbook', href: '#handbook' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-4 px-6 md:px-12
        ${isScrolled ? 'glass py-3 shadow-xl shadow-signal/5' : 'bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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
        <div className="hidden md:flex items-center space-x-7">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="font-medium text-sm text-paper/80 hover:text-signal transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-signal focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden glass rounded-b-2xl mt-4"
      >
        <div className="flex flex-col p-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-paper hover:text-signal"
            >
              {link.name}
            </a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
