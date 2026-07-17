import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, THEMES } from '../theme/ThemeContext';

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

export const AdminKeystrokeListener = () => {
  const { isAdmin, login } = useTheme();
  const [count, setCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      setShowLogin(true);
      setCount(0);
    }
  }, [count]);

  if (isAdmin || !showLogin) return null;

  const submit = (e) => {
    e.preventDefault();
    if (login(password)) {
      setShowLogin(false);
      setPassword('');
      setError('');
    } else {
      setError('Wrong password.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-8 max-w-sm w-full"
      >
        <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Admin</p>
        <h3 className="text-2xl font-serif text-paper mb-4">Sign in</h3>
        <form onSubmit={submit}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoFocus
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-full border border-signal/30 bg-transparent text-paper placeholder:text-mist focus:outline-none focus:border-signal transition-colors mb-2"
          />
          {error && <p className="text-ember text-xs mb-3">{error}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setShowLogin(false)} className="text-mist text-sm hover:text-paper transition-colors">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm py-2">
              Enter
            </button>
          </div>
        </form>
        <p className="mono text-xs text-mist/70 mt-6 leading-relaxed">
          Tip: you can also unlock via <span className="text-signal-soft">?admin=&lt;password&gt;</span> in the URL.
          Auth is client-side only — see the code for details.
        </p>
      </motion.div>
    </div>
  );
};

const ThemeSwitcher = () => {
  const { theme, setTheme, isAdmin, logout } = useTheme();
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
            className="fixed bottom-24 right-6 z-[70] w-80 glass-strong rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="mono text-xs uppercase tracking-widest text-signal">Admin · Theme</p>
                <p className="text-mist text-xs mt-1">Site defaults for all visitors</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-mist hover:text-paper transition-colors" aria-label="Close">
                ✕
              </button>
            </div>

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
                      {active && <span className="mono text-xs text-signal">active</span>}
                    </div>
                    <p className="text-mist text-xs leading-relaxed">{t.tagline}</p>
                    <div className="flex gap-1.5 mt-2">
                      <ThemeSwatch id={t.id} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-signal/10 flex justify-between items-center">
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
