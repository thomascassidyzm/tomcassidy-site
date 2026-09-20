import { describe, it, expect } from 'vitest';
import { renderMath, extractAndRenderMath } from '@/lib/math';

// This HTML is inserted verbatim via innerHTML by GuidePanel.astro's
// substituteMath — the LaTeX comes from the MODEL's reply, which a reader can
// steer with an ordinary chat message. `trust: true` in KaTeX is documented
// as enabling \href with arbitrary URL schemes (including javascript:), which
// is a genuine stored/reflected-XSS-shaped sink once that HTML reaches
// innerHTML. Untrusted math must render with KaTeX's default (untrusted).
describe('renderMath — untrusted input must not reach an active URL scheme (claim 12 finding)', () => {
  it('does not turn \\href{javascript:...} into a clickable javascript: link', () => {
    const html = renderMath('\\href{javascript:alert(1)}{click me}', false);
    expect(html).not.toContain('javascript:alert');
  });

  it('does not render \\includegraphics at all for untrusted input', () => {
    const html = renderMath('\\includegraphics{https://evil.example/track.png}', false);
    expect(html).not.toContain('evil.example');
  });

  it('ordinary math still renders (this is not just breaking everything)', () => {
    const html = renderMath('x^2 + y^2 = z^2', false);
    expect(html).toContain('katex');
  });
});

describe('extractAndRenderMath', () => {
  it('the end-to-end path a model reply takes also stays safe', () => {
    const { math } = extractAndRenderMath('Here: $\\href{javascript:alert(document.cookie)}{go}$');
    expect(math.join('')).not.toContain('javascript:alert');
  });
});
