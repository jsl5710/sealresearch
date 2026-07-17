import React, { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';

/**
 * DataFlow background: drifting nodes connected by faint signal lines.
 * Adapts to the current theme — density, colors, and canvas opacity
 * shift so the effect works on dark navy, warm off-white, and pure white.
 */

const THEME_CONFIG = {
  dark: {
    nodeCount: 55,
    linkDistance: 140,
    canvasOpacity: 0.60,
    dotAlphaMul: 1.0,
    lineAlphaMul: 1.0,
    signal: [34, 211, 238],   // cyan
    ember:  [245, 193, 71],   // gold
    emberChance: 0.15,
  },
  light: {
    nodeCount: 45,
    linkDistance: 130,
    canvasOpacity: 0.45,
    dotAlphaMul: 0.7,
    lineAlphaMul: 0.5,
    signal: [15, 98, 254],    // deep blue
    ember:  [245, 166, 35],   // amber
    emberChance: 0.25,
  },
  pro: {
    nodeCount: 32,
    linkDistance: 150,
    canvasOpacity: 0.40,
    dotAlphaMul: 0.55,
    lineAlphaMul: 0.35,
    signal: [31, 90, 161],    // pro deep blue
    ember:  [107, 114, 128],  // grey (no ember in pro)
    emberChance: 0.10,
  },
};

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cfg = THEME_CONFIG[theme] || THEME_CONFIG.dark;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const nodes = [];
    const { nodeCount, linkDistance, dotAlphaMul, lineAlphaMul, signal, ember, emberChance } = cfg;
    const [sr, sg, sb] = signal;
    const [er, eg, eb] = ember;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Node {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
        this.opacity = (Math.random() * 0.5 + 0.2) * dotAlphaMul;
        this.hue = Math.random() < emberChance ? 'ember' : 'signal';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const [r, g, b] = this.hue === 'ember' ? [er, eg, eb] : [sr, sg, sb];
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < nodeCount; i++) nodes.push(new Node());

    const drawLinks = () => {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.15 * lineAlphaMul;
            ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => { n.update(); n.draw(); });
      drawLinks();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const cfg = THEME_CONFIG[theme] || THEME_CONFIG.dark;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
      style={{ opacity: cfg.canvasOpacity }}
    />
  );
};

export default ParticleBackground;
