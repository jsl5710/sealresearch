import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useTheme, THEMES, FONTS, FONT_SIZES,
  BG_INTENSITY_MIN, BG_INTENSITY_MAX,
  AUTO_THEME_SCHEDULE, themeForHour,
} from '../theme/ThemeContext';

/*
 * Fixed bottom-right floating control:
 *   - Non-admin: renders nothing.
 *   - Admin: gear icon. Click opens a panel with the 3 theme cards, plus a logout link.
 * Non-admin visitors get to the login prompt only if they know to add ?admin=<pw>
 * to the URL — same result as visiting a hidden route.
 *
 * There is also a keyboard shortcut: press Shift+A five times in a row to open
 * the login prompt anywhere on the site. This is a convenience so the admin
 * doesn't need to remember the URL param.
 */

// Keystroke shortcut: Shift+A pressed 5x within 2s opens the admin login modal.
// The modal itself lives in AdminLogin.jsx; this component only fires openLogin().
export const AdminKeystrokeListener = () => {
  const { isAdmin, openLogin } = useTheme();
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let last = 0;
    const onKey = (e) => {
      if (isAdmin) return;
      if (e.shiftKey && e.key.toUpperCase() === 'A') {
        const now = Date.now();
        if (now - last > 2000) setCount(1);
        else setCount(c => c + 1);
        last = now;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAdmin]);

  React.useEffect(() => {
    if (count >= 5) {
      openLogin();
      setCount(0);
    }
  }, [count, openLogin]);

  return null;
};

const ThemeSwitcher = () => {
  const {
    theme, setTheme,
    autoTheme, setAutoTheme,
    font, setFont,
    fontSize, setFontSize,
    bgIntensity, setBgIntensity,
    isAdmin, logout,
  } = useTheme();
  const [open, setOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[70] w-12 h-12 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
        aria-label="Theme switcher"
        title="Theme (admin)"
      >
        <svg className="w-5 h-5 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[70] w-80 max-h-[75vh] overflow-y-auto glass-strong rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="mono text-xs uppercase tracking-widest text-signal">Admin · Appearance</p>
                <p className="text-mist text-xs mt-1">Site defaults for all visitors</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-mist hover:text-paper transition-colors" aria-label="Close">
                ✕
              </button>
            </div>

            {/* Auto (time of day) */}
            <div className="mb-5 p-3 rounded-xl border border-signal/15">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-paper text-sm font-medium">Match time of day</p>
                  <p className="text-mist text-[11px] leading-snug mt-0.5">
                    {autoTheme ? <AutoThemeStatus /> : 'Off — theme stays on your manual choice.'}
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={autoTheme}
                  aria-label="Match theme to time of day"
                  onClick={() => setAutoTheme(!autoTheme)}
                  className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
                    autoTheme ? 'bg-signal' : 'bg-mist/30'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-ink transition-transform ${
                      autoTheme ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <SectionLabel>Theme</SectionLabel>
            <div className="space-y-3">
              {THEMES.map(t => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      active
                        ? 'border-signal bg-signal/10'
                        : 'border-signal/15 hover:border-signal/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-paper font-medium text-sm">{t.name}</span>
                      {active && (
                        <span className="mono text-xs text-signal">
                          {autoTheme ? 'active · auto' : 'active'}
                        </span>
                      )}
                    </div>
                    <p className="text-mist text-xs leading-relaxed">{t.tagline}</p>
                    <div className="flex gap-1.5 mt-2">
                      <ThemeSwatch id={t.id} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Typeface */}
            <SectionLabel className="mt-6">Typeface</SectionLabel>
            <div className="space-y-2">
              {FONTS.map(f => {
                const active = font === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFont(f.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition-colors ${
                      active ? 'border-signal bg-signal/10' : 'border-signal/15 hover:border-signal/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-paper text-sm font-medium">{f.name}</span>
                      {active && <span className="mono text-[10px] text-signal">active</span>}
                    </div>
                    <p className="text-mist text-[11px] leading-snug mt-0.5">{f.tagline}</p>
                  </button>
                );
              })}
            </div>

            {/* Text size */}
            <SectionLabel className="mt-6">Text size</SectionLabel>
            <div className="grid grid-cols-4 gap-1.5">
              {FONT_SIZES.map(s => {
                const active = fontSize === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setFontSize(s.id)}
                    title={`${s.name} — ${s.px}`}
                    className={`px-1 py-2 rounded-lg border text-[11px] transition-colors ${
                      active
                        ? 'border-signal bg-signal/10 text-paper'
                        : 'border-signal/15 text-mist hover:border-signal/40'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
            <p className="text-mist text-[11px] leading-snug mt-2">
              Scales the whole layout, not just the text.
            </p>

            {/* Background visibility */}
            <SectionLabel className="mt-6">Background animation</SectionLabel>
            <div className="flex items-center justify-between mb-2">
              <span className="text-mist text-[11px]">
                {bgIntensity === 0 ? 'Off' : `${bgIntensity}% visible`}
              </span>
              {bgIntensity !== 100 && (
                <button
                  onClick={() => setBgIntensity(100)}
                  className="mono text-[10px] text-mist hover:text-signal transition-colors"
                >
                  reset
                </button>
              )}
            </div>
            <input
              type="range"
              min={BG_INTENSITY_MIN}
              max={BG_INTENSITY_MAX}
              step={5}
              value={bgIntensity}
              onChange={(e) => setBgIntensity(e.target.value)}
              aria-label="Background animation visibility"
              className="w-full accent-signal cursor-pointer"
            />
            <p className="text-mist text-[11px] leading-snug mt-2">
              100% is each theme's tuned baseline. 0% removes the canvas entirely,
              which also stops its animation loop.
            </p>

            <div className="mt-6 pt-4 border-t border-signal/10 flex justify-between items-center">
              <p className="mono text-[10px] text-mist/70">Persists per browser</p>
              <button onClick={logout} className="mono text-xs text-mist hover:text-signal transition-colors">
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/*
 * Live status line for auto mode: which theme is showing and when it flips.
 * Ticks each minute so the countdown does not go stale while the panel sits
 * open across a boundary.
 */
const AutoThemeStatus = () => {
  const [now, setNow] = useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const { dayStart, nightStart } = AUTO_THEME_SCHEDULE;
  const hour = now.getHours();
  const isDay = themeForHour(hour) === AUTO_THEME_SCHEDULE.dayTheme;
  const nextHour = isDay ? nightStart : dayStart;
  const label = THEMES.find(t => t.id === themeForHour(hour))?.name || '';
  const fmt = (h) => `${String(h).padStart(2, '0')}:00`;

  return (
    <>
      On — {label} until {fmt(nextHour)}. Follows each visitor's own clock.
    </>
  );
};

const SectionLabel = ({ children, className = '' }) => (
  <p className={`mono text-[10px] uppercase tracking-widest text-mist/80 mb-2 ${className}`}>
    {children}
  </p>
);

// Small color-swatch preview per theme
const SWATCHES = {
  dark:  ['#0B1929', '#1F2937', '#22D3EE', '#F5C147'],
  light: ['#FBFAF7', '#FFFFFF', '#0F62FE', '#F5A623'],
  pro:   ['#FFFFFF', '#F7F7F8', '#1F5AA1', '#6B7280'],
};

const ThemeSwatch = ({ id }) => {
  const colors = SWATCHES[id] || [];
  return (
    <>
      {colors.map((c, i) => (
        <span key={i} className="w-4 h-4 rounded-full border border-signal/20" style={{ background: c }} />
      ))}
    </>
  );
};

export default ThemeSwitcher;
