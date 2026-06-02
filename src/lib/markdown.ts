// Helpers for the hero "IDE" preview — turning raw post markdown into the
// lightly-highlighted HTML shown in the fake editor on the landing page.

/** Escape HTML-significant characters so raw markdown renders as text. */
export const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Format a date as `YYYY-MM-DD`. */
export const toYmd = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Produce a short, lightly-highlighted HTML preview of a post body:
 * skips leading import/export lines and standalone images, caps at 13 lines,
 * and tints markdown headings with the primary color.
 */
export const highlightBody = (raw: string) => {
  const lines = (raw ?? '').replace(/\r/g, '').split('\n');
  let start = 0;
  while (start < lines.length && (lines[start].trim() === '' || /^(import|export)\b/.test(lines[start].trim())))
    start++;
  const out: string[] = [];
  for (let i = start; i < lines.length && out.length < 13; i++) {
    const line = lines[i];
    if (/^\s*!\[[^\]]*\]\([^)]*\)\s*$/.test(line)) continue; // drop standalone images
    if (out.length === 0 && line.trim() === '') continue;
    const e = escapeHtml(line);
    out.push(/^\s*#{1,6}\s/.test(line) ? `<span style="color: var(--color-primary)">${e}</span>` : e);
  }
  return out.join('\n');
};
