import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../theme/BudgetContext';

/**
 * Admin-only modal to paste a GitHub fine-grained PAT.
 * Rendered inline (not from context) — mounted where it's needed.
 */
const GitHubTokenModal = ({ open, onClose }) => {
  const { token, tokenInfo, tokenChecking, tokenError, connectToken, disconnectToken } = useBudget();
  const [input, setInput] = useState('');

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    connectToken(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-2xl p-8 max-w-lg w-full"
        >
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Admin · GitHub</p>
          <h3 className="text-2xl font-serif text-paper mb-4">Connect GitHub</h3>

          {token && tokenInfo && (
            <div className="mb-6 p-4 glass rounded-xl">
              <p className="mono text-xs text-mist mb-1">Connected to</p>
              <p className="text-paper text-sm font-medium mb-2">{tokenInfo.name}</p>
              <p className="mono text-[10px] text-mist">
                Token …{token.slice(-4)} · {Object.entries(tokenInfo.permissions || {})
                  .filter(([, v]) => v).map(([k]) => k).join(', ') || 'no permissions reported'}
              </p>
              <button onClick={disconnectToken} className="mt-3 mono text-xs text-ember hover:text-ember/70 transition-colors">
                Disconnect token
              </button>
            </div>
          )}

          {token && tokenChecking && <p className="text-mist text-sm mb-4">Verifying token…</p>}
          {token && tokenError && (
            <div className="mb-6 p-4 rounded-xl border border-ember/40 bg-ember/10">
              <p className="mono text-xs text-ember mb-1">Token verification failed</p>
              <p className="text-paper/85 text-sm">{tokenError}</p>
            </div>
          )}

          <form onSubmit={submit}>
            <label className="block mono text-xs uppercase tracking-widest text-signal mb-2">
              Paste a fine-grained PAT
            </label>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="github_pat_..."
              className="w-full px-4 py-3 rounded-xl border border-signal/30 bg-transparent text-paper placeholder:text-mist focus:outline-none focus:border-signal transition-colors mb-3 font-mono text-xs"
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="text-mist text-sm hover:text-paper transition-colors">
                Close
              </button>
              <button type="submit" disabled={!input.trim()} className="btn-primary text-sm py-2 disabled:opacity-40">
                {token ? 'Replace' : 'Connect'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-signal/10">
            <p className="mono text-xs uppercase tracking-widest text-signal mb-2">How to create a token</p>
            <ol className="text-mist text-xs space-y-1 leading-relaxed list-decimal ml-5">
              <li>
                Go to <a href="https://github.com/settings/personal-access-tokens/new" className="text-signal underline">github.com/settings/personal-access-tokens/new</a>
              </li>
              <li>Name it "SEAL Budget CRUD", 90-day expiration.</li>
              <li>Repository access → Only select <span className="mono text-signal-soft">jsl5710/sealresearch</span></li>
              <li>Permissions → Repository → <span className="mono text-signal-soft">Contents: Read and write</span></li>
              <li>Generate, copy, paste above.</li>
            </ol>
            <p className="mono text-[10px] text-mist/70 mt-4 leading-relaxed">
              Token is stored in this browser's localStorage. Any JS on this domain can read it —
              only paste on a device you trust. Disconnect when done.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GitHubTokenModal;
