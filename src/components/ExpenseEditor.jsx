import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../theme/BudgetContext';
import projectsData from '../data/projects.json';

/**
 * Modal for adding or editing a single expense.
 * Props:
 *   open      — bool
 *   onClose   — () => void
 *   expense   — expense object to edit, or null to add
 */
const ExpenseEditor = ({ open, onClose, expense = null }) => {
  const { budget, addExpense, updateExpense } = useBudget();

  const emptyForm = {
    date: new Date().toISOString().slice(0, 10),
    fundId: budget.funds[0]?.id || '',
    categoryId: budget.funds[0]?.categories[0]?.id || '',
    projectId: '',
    vendor: '',
    description: '',
    amount: '',
    notes: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Reset form when opening or when the editing target changes
  useEffect(() => {
    if (!open) return;
    if (expense) {
      setForm({
        date: expense.date || '',
        fundId: expense.fundId || '',
        categoryId: expense.categoryId || '',
        projectId: expense.projectId || '',
        vendor: expense.vendor || '',
        description: expense.description || '',
        amount: expense.amount != null ? String(expense.amount) : '',
        notes: expense.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, expense]);

  if (!open) return null;

  const fund = budget.funds.find(f => f.id === form.fundId);
  const categories = fund?.categories || [];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      amount: parseFloat(form.amount) || 0,
      // clear projectId if empty
      projectId: form.projectId || undefined,
    };
    if (expense) {
      updateExpense(expense.id, payload);
    } else {
      addExpense(payload);
    }
    setSaving(false);
    onClose();
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
          className="glass-strong rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Budget</p>
          <h3 className="text-2xl font-serif text-paper mb-6">{expense ? 'Edit expense' : 'Add expense'}</h3>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required className={INPUT} />
              </Field>
              <Field label="Amount ($)">
                <input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => set('amount', e.target.value)} required placeholder="0.00" className={INPUT} />
              </Field>
            </div>

            <Field label="Vendor">
              <input type="text" value={form.vendor} onChange={(e) => set('vendor', e.target.value)} required placeholder="e.g. OpenAI" className={INPUT} />
            </Field>

            <Field label="Description">
              <input type="text" value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="What was this for?" className={INPUT} />
            </Field>

            <Field label="Fund">
              <select value={form.fundId} onChange={(e) => { set('fundId', e.target.value); set('categoryId', budget.funds.find(f => f.id === e.target.value)?.categories[0]?.id || ''); }} required className={INPUT}>
                {budget.funds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </Field>

            <Field label="Category">
              <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} required className={INPUT}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>

            <Field label="Project (optional)">
              <select value={form.projectId} onChange={(e) => set('projectId', e.target.value)} className={INPUT}>
                <option value="">— none —</option>
                {projectsData.projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </Field>

            <Field label="Notes (optional)">
              <textarea rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} className={INPUT} />
            </Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-signal/10">
              <button type="button" onClick={onClose} className="text-mist text-sm hover:text-paper transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-40">
                {saving ? 'Saving…' : (expense ? 'Save changes' : 'Add expense')}
              </button>
            </div>

            <p className="mono text-[10px] text-mist/60 pt-2 leading-relaxed">
              Changes apply locally. Click <strong>Save to GitHub</strong> in the Budget section to commit.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block mono text-[10px] uppercase tracking-widest text-signal mb-1.5">{label}</span>
    {children}
  </label>
);

const INPUT = 'w-full px-3 py-2 rounded-lg border border-signal/25 bg-transparent text-paper placeholder:text-mist focus:outline-none focus:border-signal transition-colors text-sm';

export default ExpenseEditor;
