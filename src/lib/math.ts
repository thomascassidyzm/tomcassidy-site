// KaTeX server-side rendering for the guide's chat replies.
// Copied from configuration-economics / distinction-physics so the guide
// architecture matches its siblings exactly.

import katex from 'katex';

export function renderMath(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      errorColor: '#cc0000',
      strict: false,
      trust: true,
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
