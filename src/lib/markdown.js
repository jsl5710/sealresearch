/*
 * Minimal Markdown -> HTML for the lab's long-form documents (handbook,
 * joining statement). Deliberately small: these documents are ours, so the
 * renderer only needs the subset of Markdown we actually write, and that
 * avoids pulling a parser into the bundle for two pages of prose.
 *
 * Extracted from HandbookSection so the joining statement renders
 * identically rather than drifting into a second style.
 */
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

export { mdToHtml, slug };
