// KaTeX server-side rendering for the guide's chat replies.
// Copied from configuration-economics / distinction-physics so the guide
// architecture matches its siblings exactly — EXCEPT `trust`, fixed here
// 2026-09-20 (same bug confirmed present in both siblings; port the fix).

import katex from 'katex';

export function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      errorColor: '#cc0000',
      strict: false,
      // `trust: true` enables \href (any scheme, including javascript:) and
      // \includegraphics — and this HTML lands straight in the client via
      // innerHTML (GuidePanel.astro's substituteMath). The LaTeX here is the
      // MODEL'S output, not Tom's own essay source, and a reader can steer
      // model output with an ordinary chat message — this was a live XSS
      // sink. Untrusted math never needs either command; leave KaTeX's
      // default (trust: false) rather than opting back in.
      output: 'html',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return `<span class="math-error" style="color: #cc0000;">Error rendering LaTeX: ${message}</span>`;
  }
}

/**
 * Extract LaTeX math blocks from a string, render each with KaTeX, and
 * replace with non-markdown placeholder tokens. Returns the processed text
 * plus an array of the rendered HTML.
 *
 * Tokens are uppercase ASCII so they don't trigger any markdown rules.
 *
 * Display $$..$$ is processed before inline $..$ so the inline regex
 * doesn't gobble $$ delimiters. The inline regex requires non-space
 * adjacent to delimiters so prose like "It costs $50 and saves $30"
 * isn't treated as math.
 */
export function extractAndRenderMath(text: string): { text: string; math: string[] } {
  const math: string[] = [];

  let processed = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, latex) => {
    const idx = math.length;
    math.push(renderMath(latex.trim(), true));
    return `XXMATH${idx}XX`;
  });

  processed = processed.replace(/\$(\S(?:[^\$\n]*?\S)?)\$/g, (_match, latex) => {
    const idx = math.length;
    math.push(renderMath(latex.trim(), false));
    return `XXMATH${idx}XX`;
  });

  return { text: processed, math };
}
