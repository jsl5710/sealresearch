import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });

    const handleMouseOver = (e) => {
      const target = e.target;
      setIsPointer(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        !!target.closest('button') ||
        !!target.closest('a')
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="hidden lg:block">
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-signal rounded-full z-[100] pointer-events-none mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isPointer ? 2.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-signal/60 rounded-full z-[100] pointer-events-none"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isPointer ? 1.6 : 1,
          opacity: isPointer ? 0.35 : 0.7,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      />
    </div>
  );
};

export default CursorEffect;
