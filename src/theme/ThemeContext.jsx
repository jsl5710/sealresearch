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

const DEFAULT_THEME = 'dark';
const ADMIN_PASSWORD = 'SEAL2026'; // Change to rotate. Also override via ?admin=<value>

const STORAGE_THEME = 'seal_theme';
const STORAGE_ADMIN = 'seal_admin';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
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

  const setTheme = useCallback((next) => {
    if (!THEMES.find(t => t.id === next)) return;
    setThemeState(next);
    try { localStorage.setItem(STORAGE_THEME, next); } catch {}
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
    <ThemeContext.Provider value={{ theme, setTheme, isAdmin, login, logout, loginOpen, openLogin, closeLogin }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
