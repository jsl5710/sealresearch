import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import Modal from './Modal';

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

  // Radix manages visibility, so only the admin short-circuit remains here.
  if (isAdmin) return null;

  const submit = (e) => {
    e.preventDefault();
    if (login(password)) {
      closeLogin();
    } else {
      setError('Wrong password.');
    }
  };

  return (
    <Modal
      open={loginOpen}
      onOpenChange={(next) => { if (!next) closeLogin(); }}
      eyebrow="Admin"
      title="Sign in"
    >
      <form onSubmit={submit}>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          autoFocus
          placeholder="Admin password"
          aria-invalid={!!error}
          aria-describedby={error ? 'admin-login-error' : undefined}
          className="w-full px-4 py-3 rounded-full border border-signal/30 bg-transparent text-paper placeholder:text-mist focus:outline-none focus:border-signal transition-colors mb-2"
        />
        {/* role=alert so the failure is announced, not just shown. */}
        {error && (
          <p id="admin-login-error" role="alert" className="text-ember text-xs mb-3">{error}</p>
        )}
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
    </Modal>
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
