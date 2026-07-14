import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import handbookMd from '../content/handbook.md?raw';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inline = (s) => {
  let out = escapeHtml(s);
  // Bracketed tags — DECIDE / SEAL-SPECIFIC / OPTIONAL / CU-SPECIFIC (with or without content)
  out = out.replace(/\[DECIDE(?::\s*([^\]]+))?\]/g, (_, c) =>
    `<span class="hb-tag hb-tag-decide">DECIDE${c ? `: ${c}` : ''}</span>`);
  out = out.replace(/\[SEAL-SPECIFIC(?::\s*([^\]]+))?\]/g, (_, c) =>
    `<span class="hb-tag hb-tag-seal">SEAL-SPECIFIC${c ? `: ${c}` : ''}</span>`);
  out = out.replace(/\[OPTIONAL(?::\s*([^\]]+))?\]/g, (_, c) =>
    `<span class="hb-tag">OPTIONAL${c ? `: ${c}` : ''}</span>`);
  out = out.replace(/\[CU-SPECIFIC:\s*([^\]]+)\]/g, (_, c) =>
    `<span class="hb-tag hb-tag-seal">CU-SPECIFIC: ${c}</span>`);
  // Markdown links [text](url) — run after the tag replacements so DECIDE etc. aren't consumed
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="hb-link">$1</a>');
  // Inline code `x`
  out = out.replace(/`([^`]+)`/g, '<code class="hb-code">$1</code>');
  // Bold **x**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="hb-strong">$1</strong>');
  // Italic *x*
  out = out.replace(/\*([^*]+)\*/g, '<em class="hb-em">$1</em>');
  return out;
};

const mdToHtml = (md) => {
  const lines = md.split('\n');
  const out = [];
  let inList = false;
  const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { out.push('<ul class="hb-ul">'); inList = true; }
      out.push(`<li class="hb-li">${inline(line.slice(2))}</li>`);
      continue;
    }
    closeList();

    if (line.startsWith('### ')) {
      out.push(`<h4 class="hb-h4">${inline(line.slice(4))}</h4>`);
    } else if (line.startsWith('## ')) {
      const heading = line.slice(3);
      out.push(`<h3 class="hb-h3" id="hb-${slug(heading)}">${inline(heading)}</h3>`);
    } else if (line.startsWith('# ')) {
      out.push(`<h2 class="hb-h2">${inline(line.slice(2))}</h2>`);
    } else if (line === '---') {
      out.push('<hr class="hb-hr" />');
    } else if (line.trim() === '') {
      out.push('');
    } else {
      out.push(`<p class="hb-p">${inline(line)}</p>`);
    }
  }
  closeList();
  return out.join('\n');
};

const HandbookSection = () => {
  const [expanded, setExpanded] = useState(false);

  const html = useMemo(() => mdToHtml(handbookMd), []);
  const toc = useMemo(() =>
    handbookMd
      .split('\n')
      .filter(l => l.startsWith('## '))
      .map(l => l.slice(3).trim())
      .filter(t => /^\d+\./.test(t)),
  []);

  return (
    <section id="handbook" className="relative py-32 px-6 md:px-12 bg-slate/30">
      <div className="max-w-4xl mx-auto">
        <p className="section-eyebrow text-center">Handbook</p>
        <h2 className="text-4xl md:text-6xl font-serif font-semibold text-paper text-center mb-4 leading-tight">
          How the <span className="italic text-signal">lab works</span>.
        </h2>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <span className="chip-ember">Draft v1</span>
          <span className="chip">Living document</span>
        </div>

        <p className="text-mist text-center max-w-2xl mx-auto mb-12">
          SEAL's operating norms — culture, authorship, communication, project lifecycle, wellbeing,
          data ethics. Items tagged <span className="hb-tag hb-tag-decide">DECIDE</span> are open decisions the PI is still choosing on;
          <span className="hb-tag hb-tag-seal ml-1">SEAL-SPECIFIC</span> marks norms tied to our multilingual and community-facing work.
        </p>

        <div className="glass rounded-2xl p-6 md:p-8">
          <p className="mono text-xs uppercase tracking-widest text-signal mb-3">Contents</p>
          <ol className="text-paper/85 text-sm space-y-2 columns-1 md:columns-2 gap-x-8">
            {toc.map((title) => {
              const m = /^(\d+)\.\s+(.*)$/.exec(title);
              const num = m ? m[1] : '';
              const rest = m ? m[2] : title;
              return (
                <li key={title} className="break-inside-avoid">
                  <a href={`#hb-${slug(title)}`} onClick={() => setExpanded(true)} className="hover:text-signal transition-colors">
                    <span className="text-mist mono text-xs mr-2">{num.padStart(2, '0')}.</span>
                    {rest}
                  </a>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 pt-6 border-t border-signal/10">
            <button
              onClick={() => setExpanded(e => !e)}
              className="mono text-xs uppercase tracking-widest text-signal hover:text-signal-soft transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? '↑ Collapse handbook' : '↓ Expand full handbook'}
            </button>
            <a
              href={`${import.meta.env.BASE_URL}handbook.md`}
              download="SEAL-Handbook-v1-draft.md"
              className="mono text-xs uppercase tracking-widest text-signal hover:text-signal-soft transition-colors"
            >
              ↓ Download markdown
            </a>
            <a
              href="https://github.com/jsl5710/sealresearch/blob/main/public/handbook.md"
              className="mono text-xs uppercase tracking-widest text-signal hover:text-signal-soft transition-colors"
            >
              ↗ View on GitHub
            </a>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="mt-10 glass rounded-2xl p-6 md:p-10">
                <div className="hb-content" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HandbookSection;
