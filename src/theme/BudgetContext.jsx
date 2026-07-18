import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import initialBudget from '../data/budget.json';
import { getFile, putFile, testToken } from '../lib/githubApi';

/*
 * Budget state + GitHub-backed persistence for admin CRUD.
 *
 *   Working state lives in React state (+ localStorage cache so a refresh
 *   doesn't lose in-progress edits before a commit lands).
 *
 *   Save flow:
 *     1. Admin adds/edits/deletes → local state updates immediately (optimistic)
 *     2. Save button (or auto-save) calls saveToGitHub()
 *     3. GET current SHA, PUT new content, get commit hash back
 *     4. Deploy runs (~60-90s); until it lands, visitors see the pre-commit JSON
 *     5. Post-deploy, this browser will import the fresh budget.json on refresh
 *
 *   Security posture: token in localStorage. Any JS on the page can read it.
 *   Use a fine-grained PAT scoped to jsl5710/sealresearch, Contents: read/write.
 *   NEVER a classic PAT with account-wide scope.
 */

const STORAGE_TOKEN = 'seal_gh_token';
const STORAGE_BUDGET_DRAFT = 'seal_budget_draft';
const BUDGET_PATH = 'src/data/budget.json';

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(() => {
    try {
      const draft = localStorage.getItem(STORAGE_BUDGET_DRAFT);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed && Array.isArray(parsed.funds) && Array.isArray(parsed.expenses)) return parsed;
      }
    } catch {}
    return initialBudget;
  });

  const [token, setTokenState] = useState(() => {
    try { return localStorage.getItem(STORAGE_TOKEN) || ''; } catch { return ''; }
  });
  const [tokenInfo, setTokenInfo] = useState(null); // { name, permissions }
  const [tokenChecking, setTokenChecking] = useState(false);
  const [tokenError, setTokenError] = useState('');

  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [statusMsg, setStatusMsg] = useState('');
  const saveInFlight = useRef(false);

  // Persist working budget to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_BUDGET_DRAFT, JSON.stringify(budget)); } catch {}
  }, [budget]);

  // Verify token whenever it changes
  useEffect(() => {
    if (!token) { setTokenInfo(null); return; }
    let cancelled = false;
    setTokenChecking(true);
    setTokenError('');
    testToken(token)
      .then(info => { if (!cancelled) { setTokenInfo(info); setTokenChecking(false); } })
      .catch(err => { if (!cancelled) { setTokenError(err.message); setTokenInfo(null); setTokenChecking(false); } });
    return () => { cancelled = true; };
  }, [token]);

  const connectToken = useCallback((t) => {
    const trimmed = (t || '').trim();
    if (!trimmed) return;
    try { localStorage.setItem(STORAGE_TOKEN, trimmed); } catch {}
    setTokenState(trimmed);
  }, []);

  const disconnectToken = useCallback(() => {
    try { localStorage.removeItem(STORAGE_TOKEN); } catch {}
    setTokenState('');
    setTokenInfo(null);
    setTokenError('');
  }, []);

  // Save the working budget to GitHub. Returns { ok, message }.
  const saveToGitHub = useCallback(async (commitMessage) => {
    if (saveInFlight.current) return { ok: false, message: 'Save already in progress' };
    if (!token) return { ok: false, message: 'Not connected — paste a GitHub token first' };
    saveInFlight.current = true;
    setStatus('saving');
    setStatusMsg('Saving to GitHub…');
    try {
      const { sha } = await getFile(BUDGET_PATH, token);
      await putFile(BUDGET_PATH, budget, sha, commitMessage || 'Budget: update via admin panel', token);
      // Clear draft on successful save — repo is now source of truth
      try { localStorage.removeItem(STORAGE_BUDGET_DRAFT); } catch {}
      setStatus('saved');
      setStatusMsg('Committed. Deploy running (~60s).');
      setTimeout(() => setStatus('idle'), 5000);
      return { ok: true, message: 'Committed' };
    } catch (err) {
      setStatus('error');
      setStatusMsg(err.message);
      setTimeout(() => setStatus('idle'), 8000);
      return { ok: false, message: err.message };
    } finally {
      saveInFlight.current = false;
    }
  }, [budget, token]);

  const discardDraft = useCallback(() => {
    try { localStorage.removeItem(STORAGE_BUDGET_DRAFT); } catch {}
    setBudget(initialBudget);
  }, []);

  const hasDraft = JSON.stringify(budget) !== JSON.stringify(initialBudget);

  // --- Mutations ---

  const addExpense = useCallback((exp) => {
    const id = exp.id || `exp-${Date.now()}`;
    setBudget(b => ({ ...b, expenses: [...b.expenses, { ...exp, id }] }));
  }, []);

  const updateExpense = useCallback((id, updates) => {
    setBudget(b => ({
      ...b,
      expenses: b.expenses.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const deleteExpense = useCallback((id) => {
    setBudget(b => ({ ...b, expenses: b.expenses.filter(e => e.id !== id) }));
  }, []);

  const updateCategoryAllocation = useCallback((fundId, categoryId, allocated) => {
    setBudget(b => ({
      ...b,
      funds: b.funds.map(f => f.id !== fundId ? f : {
        ...f,
        categories: f.categories.map(c => c.id === categoryId ? { ...c, allocated: Number(allocated) || 0 } : c),
      }),
    }));
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        budget,
        hasDraft,
        addExpense,
        updateExpense,
        deleteExpense,
        updateCategoryAllocation,
        token,
        tokenInfo,
        tokenChecking,
        tokenError,
        connectToken,
        disconnectToken,
        saveToGitHub,
        discardDraft,
        status,
        statusMsg,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used inside BudgetProvider');
  return ctx;
};
