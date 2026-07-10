import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="mb-8"
      >
        <svg width="88" height="88" viewBox="0 0 24 24" fill="none" className="text-signal">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 5" opacity="0.5" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl font-serif font-semibold text-paper tracking-widest uppercase"
      >
        SEAL<span className="text-signal">.</span>
      </motion.h1>

      <motion.div className="mt-6 w-56 h-[2px] bg-signal/20 relative overflow-hidden">
        <motion.div
          animate={{ x: [-200, 240] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-1/2 bg-signal"
        />
      </motion.div>

      <p className="mt-5 text-xs mono text-mist tracking-widest uppercase">Initializing_secure_channel</p>
    </motion.div>
  );
};

export default LoadingScreen;
