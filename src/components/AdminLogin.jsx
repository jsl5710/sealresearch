import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

/**
 * Modal that shows the admin login form. Rendered once at the root of the
 * app; visibility is controlled by the ThemeContext (loginOpen state).
 * Triggered by:
 *   - AdminLoginLink (visible in the footer)
 *   - AdminKeystrokeListener (Shift+A x5)
 *   - Direct URL param ?admin=<password> auto-logs in without the modal
 */
const AdminLoginModal = () => {
  const { isAdmin, loginOpen, closeLogin, login } = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loginOpen) {
      setPassword('');
      setError('');
    }
  }, [loginOpen]);

  if (isAdmin || !loginOpen) return null;

  const submit = (e) => {
    e.preventDefault();
    if (login(password)) {
      closeLogin();
    } else {
      setError('Wrong password.');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeLogin}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
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
              <button type="button" onClick={closeLogin} className="text-mist text-sm hover:text-paper transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-sm py-2">
                Enter
              </button>
            </div>
          </form>
          <p className="mono text-xs text-mist/70 mt-6 leading-relaxed">
            Client-side gate for admin-only UI (theme switcher).
            Sign-in persists per browser.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Small text link — drop into the Footer.
 * Hides itself when admin (shows "Sign out" instead).
 */
export const AdminLoginLink = ({ className = '' }) => {
  const { isAdmin, openLogin, logout } = useTheme();
  if (isAdmin) {
    return (
      <button onClick={logout} className={`mono text-[10px] uppercase tracking-widest text-mist/60 hover:text-signal transition-colors ${className}`}>
        Admin · Sign out
      </button>
    );
  }
  return (
    <button onClick={openLogin} className={`mono text-[10px] uppercase tracking-widest text-mist/60 hover:text-signal transition-colors ${className}`}>
      Admin sign in
    </button>
  );
};

export default AdminLoginModal;
