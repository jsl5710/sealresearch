import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/*
 * Three-theme system with admin-gated switcher.
 *
 * - Any visitor sees whichever theme was last set (localStorage), falling back to DEFAULT.
 * - The switcher UI is only rendered when isAdmin === true.
 * - Admin state = correct password entered → stored in localStorage.
 *
 * SECURITY NOTE: this is client-side auth. The password lives in JS the browser
 * can read, so it is bypassable via DevTools. It is Phase 1 gating — good enough
 * to keep the switcher out of casual visitors' way. For real access control,
 * wrap the site with Cloudflare Access or Auth0 (Phase 2).
 *
 * Change the admin password by editing ADMIN_PASSWORD below. To rotate it
 * without redeploying, use the URL escape hatch: ?admin=<password>
 */

export const THEMES = [
  {
    id: 'dark',
    name: 'Dark Cinematic',
    tagline: 'Original SEAL — deep navy, cyan signal, glass surfaces, drifting data-nodes',
  },
  {
    id: 'light',
    name: 'Light Editorial',
    tagline: 'PAIR-inspired — warm canvas, serif display, geometric hero, hairline cards',
  },
  {
    id: 'pro',
    name: 'Professional & Simple',
    tagline: 'Institutional — white, single sans-serif, deep-blue accent, minimal motion',
  },
];

/*
 * Typeface presets. Applied to <html data-font=...>; the CSS in index.css
 * swaps the --font-* tokens. Independent of theme, so any pairing works
 * with any color scheme.
 */
export const FONTS = [
  { id: 'editorial', name: 'Editorial', tagline: 'Fraunces headings over Inter body — the shipped look' },
  { id: 'modern',    name: 'Modern Sans', tagline: 'Inter throughout; clean and neutral, no serif' },
  { id: 'classic',   name: 'Classic Serif', tagline: 'Old-style serif everywhere — reads like a printed paper' },
  { id: 'system',    name: 'System Native', tagline: "The visitor's own OS font; fastest to render" },
];

/*
 * Type scale. Applied to <html data-fontsize=...>; scales the root
 * font-size, which rescales the whole rem-based layout proportionally.
 */
export const FONT_SIZES = [
  { id: 'compact', name: 'Compact', px: '15px' },
  { id: 'normal',  name: 'Normal',  px: '16px' },
  { id: 'large',   name: 'Large',   px: '17.5px' },
  { id: 'xlarge',  name: 'X-Large', px: '19px' },
];

const DEFAULT_THEME = 'dark';
const DEFAULT_FONT = 'editorial';
const DEFAULT_FONT_SIZE = 'normal';

// Background animation visibility, as a percentage of each theme's tuned
// baseline. 0 turns the animation off entirely (no canvas, no rAF loop).
const DEFAULT_BG_INTENSITY = 100;
export const BG_INTENSITY_MIN = 0;
export const BG_INTENSITY_MAX = 150;

const ADMIN_PASSWORD = 'SEAL2026'; // Change to rotate. Also override via ?admin=<value>

const STORAGE_THEME = 'seal_theme';
const STORAGE_ADMIN = 'seal_admin';
const STORAGE_FONT = 'seal_font';
const STORAGE_FONT_SIZE = 'seal_fontsize';
const STORAGE_BG = 'seal_bg_intensity';

const clampIntensity = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return DEFAULT_BG_INTENSITY;
  return Math.min(BG_INTENSITY_MAX, Math.max(BG_INTENSITY_MIN, Math.round(v)));
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [font, setFontState] = useState(DEFAULT_FONT);
  const [fontSize, setFontSizeState] = useState(DEFAULT_FONT_SIZE);
  const [bgIntensity, setBgIntensityState] = useState(DEFAULT_BG_INTENSITY);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    // Read persisted theme
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME);
      if (savedTheme && THEMES.find(t => t.id === savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch { /* localStorage disabled — silently fall back to default */ }

    // Read persisted typography + background settings
    try {
      const savedFont = localStorage.getItem(STORAGE_FONT);
      if (savedFont && FONTS.find(f => f.id === savedFont)) setFontState(savedFont);
    } catch {}
    try {
      const savedSize = localStorage.getItem(STORAGE_FONT_SIZE);
      if (savedSize && FONT_SIZES.find(s => s.id === savedSize)) setFontSizeState(savedSize);
    } catch {}
    try {
      const savedBg = localStorage.getItem(STORAGE_BG);
      if (savedBg !== null) setBgIntensityState(clampIntensity(savedBg));
    } catch {}

    // Read persisted admin
    try {
      if (localStorage.getItem(STORAGE_ADMIN) === 'true') {
        setIsAdmin(true);
      }
    } catch {}

    // URL param escape hatch — ?theme=light and/or ?admin=<password>
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    if (themeParam && THEMES.find(t => t.id === themeParam)) {
      setThemeState(themeParam);
      try { localStorage.setItem(STORAGE_THEME, themeParam); } catch {}
    }
    const fontParam = params.get('font');
    if (fontParam && FONTS.find(f => f.id === fontParam)) {
      setFontState(fontParam);
      try { localStorage.setItem(STORAGE_FONT, fontParam); } catch {}
    }
    const sizeParam = params.get('fontsize');
    if (sizeParam && FONT_SIZES.find(s => s.id === sizeParam)) {
      setFontSizeState(sizeParam);
      try { localStorage.setItem(STORAGE_FONT_SIZE, sizeParam); } catch {}
    }
    const bgParam = params.get('bg');
    if (bgParam !== null && bgParam !== '') {
      const v = clampIntensity(bgParam);
      setBgIntensityState(v);
      try { localStorage.setItem(STORAGE_BG, String(v)); } catch {}
    }

    const adminParam = params.get('admin');
    if (adminParam === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try { localStorage.setItem(STORAGE_ADMIN, 'true'); } catch {}
    }
  }, []);

  // Apply theme to <html data-theme=...>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Typography attributes drive the --font-* token swaps in index.css
  useEffect(() => {
    document.documentElement.setAttribute('data-font', font);
  }, [font]);

  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize);
  }, [fontSize]);

  const setTheme = useCallback((next) => {
    if (!THEMES.find(t => t.id === next)) return;
    setThemeState(next);
    try { localStorage.setItem(STORAGE_THEME, next); } catch {}
  }, []);

  const setFont = useCallback((next) => {
    if (!FONTS.find(f => f.id === next)) return;
    setFontState(next);
    try { localStorage.setItem(STORAGE_FONT, next); } catch {}
  }, []);

  const setFontSize = useCallback((next) => {
    if (!FONT_SIZES.find(s => s.id === next)) return;
    setFontSizeState(next);
    try { localStorage.setItem(STORAGE_FONT_SIZE, next); } catch {}
  }, []);

  const setBgIntensity = useCallback((next) => {
    const v = clampIntensity(next);
    setBgIntensityState(v);
    try { localStorage.setItem(STORAGE_BG, String(v)); } catch {}
  }, []);

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try { localStorage.setItem(STORAGE_ADMIN, 'true'); } catch {}
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try { localStorage.removeItem(STORAGE_ADMIN); } catch {}
  }, []);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      font, setFont,
      fontSize, setFontSize,
      bgIntensity, setBgIntensity,
      isAdmin, login, logout, loginOpen, openLogin, closeLogin,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
