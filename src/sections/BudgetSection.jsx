import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import budget from '../data/budget.json';
import { useTheme } from '../theme/ThemeContext';

const fmtMoney = (n, opts = {}) => {
  const { compact = false } = opts;
  if (n == null || isNaN(n)) return '—';
  if (compact && Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const fmtDate = (d) => {
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m[2],10)-1]} ${parseInt(m[3],10)}, ${m[1]}`;
};

const CategoryBar = ({ cat, spent }) => {
  const pct = cat.allocated > 0 ? Math.min(100, (spent / cat.allocated) * 100) : 0;
  const remaining = cat.allocated - spent;
  const overbudget = remaining < 0;

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
          <span className="text-paper text-sm font-medium">{cat.label}</span>
        </div>
        <span className={`mono text-xs ${overbudget ? 'text-ember' : 'text-mist'}`}>
          {fmtMoney(spent, { compact: true })} / {fmtMoney(cat.allocated, { compact: true })}
        </span>
      </div>

      <div className="relative h-2 rounded-full overflow-hidden bg-signal/10 mb-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: cat.color, opacity: 0.85 }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-mist">{pct.toFixed(0)}% spent</span>
        <span className={overbudget ? 'text-ember font-medium' : 'text-signal-soft'}>
          {overbudget ? `Over by ${fmtMoney(Math.abs(remaining))}` : `${fmtMoney(remaining)} left`}
        </span>
      </div>
    </div>
  );
};

const FundCard = ({ fund, expenses, i }) => {
  const spentByCategory = useMemo(() => {
    const m = new Map();
    for (const e of expenses) {
      if (e.fundId === fund.id) {
        m.set(e.categoryId, (m.get(e.categoryId) || 0) + e.amount);
      }
    }
    return m;
  }, [fund.id, expenses]);

  const totalAllocated = fund.categories.reduce((s, c) => s + c.allocated, 0);
  const totalSpent = fund.categories.reduce((s, c) => s + (spentByCategory.get(c.id) || 0), 0);
  const totalRemaining = fund.totalAmount - totalSpent;
  const unallocated = fund.totalAmount - totalAllocated;
  const overallPct = fund.totalAmount > 0 ? (totalSpent / fund.totalAmount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="glass-strong rounded-2xl p-6 md:p-8 mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Fund</p>
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-paper mb-1">{fund.name}</h3>
          <p className="mono text-mist text-xs">
            {fmtDate(fund.startDate)}{fund.endDate ? ` – ${fmtDate(fund.endDate)}` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="mono text-xs uppercase tracking-widest text-signal/70 mb-1">Total</p>
          <p className="text-3xl font-serif text-ember">{fmtMoney(fund.totalAmount)}</p>
        </div>
      </div>

      {/* Rollup */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-signal/10">
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal/70 mb-1">Spent</p>
          <p className="text-xl font-serif text-paper">{fmtMoney(totalSpent)}</p>
        </div>
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal/70 mb-1">Remaining</p>
          <p className={`text-xl font-serif ${totalRemaining < 0 ? 'text-ember' : 'text-signal'}`}>
            {fmtMoney(totalRemaining)}
          </p>
        </div>
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal/70 mb-1">Unallocated</p>
          <p className="text-xl font-serif text-mist">{fmtMoney(unallocated)}</p>
        </div>
      </div>

      {/* Overall bar */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="mono text-xs uppercase tracking-widest text-signal">Overall burn</span>
          <span className="mono text-xs text-mist">{overallPct.toFixed(1)}%</span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden bg-signal/10">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-signal to-ember rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, overallPct)}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <p className="mono text-xs uppercase tracking-widest text-signal mb-3">Categories</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fund.categories.map(cat => (
          <CategoryBar key={cat.id} cat={cat} spent={spentByCategory.get(cat.id) || 0} />
        ))}
      </div>

      {fund.notes && (
        <p className="text-mist text-xs italic mt-6 pt-4 border-t border-signal/10 leading-relaxed">
          {fund.notes}
        </p>
      )}
    </motion.div>
  );
};

const ExpenseTable = ({ expenses, funds }) => {
  const [fundFilter, setFundFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = useMemo(() => {
    return [...expenses]
      .filter(e => fundFilter === 'all' || e.fundId === fundFilter)
      .filter(e => categoryFilter === 'all' || e.categoryId === categoryFilter)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [expenses, fundFilter, categoryFilter]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const fundChips = [{ id: 'all', label: 'All Funds' }, ...funds.map(f => ({ id: f.id, label: f.name.split(' — ').pop() || f.name }))];

  // Category chips derived from the currently-selected fund (or union across funds)
  const availableCats = fundFilter === 'all'
    ? Array.from(new Map(funds.flatMap(f => f.categories.map(c => [c.id, c]))).values())
    : (funds.find(f => f.id === fundFilter)?.categories || []);
  const catChips = [{ id: 'all', label: 'All Categories' }, ...availableCats.map(c => ({ id: c.id, label: c.label }))];

  return (
    <div className="glass-strong rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-6">
        <div>
          <p className="mono text-xs uppercase tracking-widest text-signal mb-2">Expenses</p>
          <h3 className="text-2xl font-serif font-semibold text-paper">Detailed breakdown</h3>
        </div>
        <div className="text-right">
          <p className="mono text-xs text-mist mb-1">{filtered.length} record{filtered.length === 1 ? '' : 's'}</p>
          <p className="text-xl font-serif text-paper">{fmtMoney(total)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {fundChips.map(c => (
            <button
              key={c.id}
              onClick={() => { setFundFilter(c.id); setCategoryFilter('all'); }}
              className={`px-3 py-1.5 rounded-full text-xs mono transition-all
                ${fundFilter === c.id ? 'bg-signal text-ink font-medium' : 'border border-signal/30 text-signal-soft hover:bg-signal/10'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="w-px bg-signal/20 self-stretch" />
        <div className="flex flex-wrap gap-2">
          {catChips.map(c => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs mono transition-all
                ${categoryFilter === c.id ? 'bg-signal text-ink font-medium' : 'border border-signal/30 text-signal-soft hover:bg-signal/10'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-mist text-sm mono text-center py-8">No expenses match this filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-signal/10">
                <th className="mono text-xs uppercase tracking-widest text-signal/70 pb-2 pr-4">Date</th>
                <th className="mono text-xs uppercase tracking-widest text-signal/70 pb-2 pr-4">Vendor</th>
                <th className="mono text-xs uppercase tracking-widest text-signal/70 pb-2 pr-4">Description</th>
                <th className="mono text-xs uppercase tracking-widest text-signal/70 pb-2 pr-4">Category</th>
                <th className="mono text-xs uppercase tracking-widest text-signal/70 pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const fund = funds.find(f => f.id === e.fundId);
                const cat = fund?.categories.find(c => c.id === e.categoryId);
                return (
                  <tr key={e.id} className="border-b border-signal/5 hover:bg-signal/5 transition-colors">
                    <td className="py-3 pr-4 mono text-xs text-mist">{fmtDate(e.date)}</td>
                    <td className="py-3 pr-4 text-paper">{e.vendor}</td>
                    <td className="py-3 pr-4 text-mist">{e.description}</td>
                    <td className="py-3 pr-4">
                      {cat && (
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                          <span className="text-signal-soft">{cat.label}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 mono text-paper text-right">{fmtMoney(e.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mono text-xs text-mist/70 mt-6 leading-relaxed">
        Records are hand-entered in <span className="text-signal-soft">src/data/budget.json</span>.
        For the authoritative accounting record, cross-check with CU Boulder Concur / Marketplace exports.
      </p>
    </div>
  );
};

const BudgetSection = () => {
  const { isAdmin } = useTheme();
  if (!isAdmin) return null;

  const { funds, expenses } = budget;

  return (
    <section id="budget" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="chip-ember">🔒 Admin only</span>
        </div>
        <p className="section-eyebrow text-center">Budget</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          Where the <span className="italic text-signal">funds go</span>.
        </h2>
        <p className="text-mist text-center max-w-2xl mx-auto mb-14">
          Per-fund allocations across categories, running spend totals, and a detailed expense ledger.
          Hidden from public visitors.
        </p>

        {funds.map((f, i) => (
          <FundCard key={f.id} fund={f} expenses={expenses} i={i} />
        ))}

        <ExpenseTable expenses={expenses} funds={funds} />
      </div>
    </section>
  );
};

export default BudgetSection;
