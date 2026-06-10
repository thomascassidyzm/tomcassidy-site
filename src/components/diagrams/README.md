# Diagrams — the house style

Every diagram on this site is an inline **SVG component** drawn entirely from the
site's design tokens, so it is sharp at any size, weighs almost nothing, and
**re-pigments itself** when the theme flips (warm-charcoal dark ↔ warm-paper
light) with no separate art. Reference implementations: `NineByFour.astro` (the
9×4 teaching wheel) and `ReasonableEating.astro` (the 13×4 eating wheel).

When you add a figure, follow these rules so it looks *of* the journal, not
imported.

## 1. Colour is meaning, and it is always a token

- **Never hardcode a hex value.** Use the CSS custom properties (`--derived`,
  `--contested`, `--established`, `--open`, their `-wash`/`-chip` variants,
  `--text-primary/secondary/muted`, `--hairline`, `--bg-elevated`, `--depth-3`,
  surfaces). This is what makes a diagram theme-aware for free.
- **Pigment-code by meaning, not decoration.** The four epistemic pigments are
  the site's categorical language, so use them to carry the structure:
  - 9×4 — Action = `--derived` (green), Philosophy = `--contested` (amber),
    Self-Belief hub = `--established` (blue).
  - 13×4 — the four domains map one-to-one onto the four pigments
    (HOW=derived, WHEN=contested, WHY=open, WHAT=established); the neutral
    central focus uses `--depth-3` + a muted numeral so the coloured domains
    do the talking.
- Fills are **low-alpha washes** (`--*-wash`); strokes/edges are **hairlines**
  (`--hairline`); the pigment shows in numerals, rim-arcs and labels.

## 2. The marks

- **Divisions:** 1px hairline strokes. No heavy "sketch" borders.
- **Numerals:** mono (`--font-mono`), pigment-coloured, in a small circled
  "well" (`fill: --bg-elevated`, 1–1.25px pigment stroke). Every number is
  circled, including the hub. They sit at the **same relative corner** of every
  slice — the clockwise-leading edge, a few degrees in — so they read evenly as
  you go round the clock. The centre of each slice is left clear for its label.
- **Labels:** the idea/instruction in the body serif (`--font-body`), multi-line
  and vertically centred in the slice. Quadrant/half labels and the hub use the
  display serif (`--font-display`); small labels and numerals use mono.
- Keep the *whole* mnemonic where it matters — a wheel is an aide-mémoire, so
  full instructions ("Stop when no longer hungry", not "Stop when full") earn
  their space. Shrink the type before you abbreviate the idea.

## 3. Geometry

Compute it in the component frontmatter, don't hand-author path data. The two
wheels share three helpers (copy them):

```ts
const pt = (r, deg) => [cx + r * Math.sin(deg*π/180), cy - r * Math.cos(deg*π/180)]; // deg clockwise from top
const sector  = (a1, a2) => `M… A${ro}… L… A${ri}… Z`;   // an annular slice
const arcPath = (a1, a2, r) => `M… A${r}…`;              // a rim arc
```

`viewBox` + `width:auto` makes it scale fluidly. Angles are measured **clockwise
from 12 o'clock**, and the 0°/180° (or quadrant) boundaries are placed on the
true vertical so the structure reads symmetrically.

## 4. Motion & a11y

- **One quiet entrance:** slices bloom outward in sequence (`animation-delay:
  calc(var(--i) * Nms)`), then settle. Nothing else moves.
- Wrap all motion in `@media (prefers-reduced-motion: no-preference)`.
- Give the `<svg>` a `role`, a `<title>` and a descriptive `<desc>`.

## 5. Diagrams are figures — they break out, and NOTHING sits beside them

A wheel is not body text. Break out **wider than the reading column** so it reads
as a centrepiece, centred on the column's own centre so it overhangs
symmetrically.

**Never the sidecar.** No explainer, readout or coach panel ever shares a row
with the diagram — a sidecar caps the diagram's size and demotes it to an
illustration. The diagram is the main story at full width; callouts speak from
a **full-width band beneath it** (the coach lectern under the ProgramWheel, the
score band under the PlotQuadrant are the reference patterns).

```css
.figure {
  width: min(960px, 94vw);
  margin: 3.25rem 0;
  position: relative; left: 50%; transform: translateX(-50%);
}
```

(When embedding inside `EssayLayout`, tune the breakout to respect the 400px
guide panel on wide screens.)

---

*Two reference wheels exist; extend their language rather than inventing a new
one. If a future diagram needs a shape these don't cover, add it in this same
vocabulary — tokens, hairlines, pigment-by-meaning, circled mono numerals.*
