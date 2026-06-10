# The Reason-Ability kit (`src/kit/`)

The future `@reasonable/kit` package, **extracted in place** — migration STEP 1
of `prototypes/WEBAPP-MERIT-AND-KIT.md`. Everything in this folder imports only
from inside this folder, so the package boundary is real before anything is
published. When app #2 arrives, this folder is what it consumes (first via
`file:`/`npm link`, then as a published package).

## What lives here

| File | What it is |
|------|------------|
| `types.ts` | The Program schema — one typed data object per programme; the same object is the wheel diagram, the curriculum, and the coach script. Includes `PrimitiveRef`, the data-side name for a sub-diagram. |
| `validate.ts` | `assertValidProgram()` — plain-TS build-time invariants (pigments distinct, focuses = cycles, weeks contiguous, wisdom present). Called from page frontmatter, so a bad data file fails the **build**. |
| `wheel-geometry.ts` | Pure geometry (no DOM, no framework). The static `.astro` figures and the Svelte island both draw from this, so they cannot drift. |
| `ProgramWheel.svelte` | The wheel as a living object: diagram + navigator + coach panel, Play rotation, "this week" enrolment. Renders any Program from data alone. |
| `primitives/` | The standard interactive sub-diagram types — data-driven instruments a focus point names **by data, not by import** (see below). |

## What the app owns (NOT kit)

- **Program data** — `src/lib/programs/*.ts`. The curriculum, mnemonics and
  wisdom are authored content (Tom's words), one typed object per programme.
- **Pages, layout, nav, theme token values** — the kit reads tokens by NAME
  (`--derived`, `--hairline`, `--font-mono`…), never hex; theming is the app's.
- **PWA shell** — manifest, service worker, icons.

## The primitives

A `FocusPoint` may carry `diagram?: PrimitiveRef`. The page renders it through
`primitives/SubDiagram.svelte`, which dispatches on `kind`:

- `scale` → `SortLadder.svelte` — a ladder of tiers + cards you drag onto the
  right rung; praise/nudge copy and a live aggregate meter. (Generalises the
  "Did it grow into its shape?" sorter.)
- `quadrant` → `PlotQuadrant.svelte` — a two-axis plane with a draggable
  marker, preset points, a parameterised ratio score and verdict bands.
  (Generalises the NERD quadrant.)
- `slider` → `ZoneSlider.svelte` — a pole-to-pole continuum with named stops,
  tone zones with verdict copy, optional declarative curves and a sweet-spot
  band. (Generalises the hunger-vs-appetite meter.)
- `preset` → an escape hatch: a bespoke component registered by name in
  `SubDiagram.svelte`, for kinetic ideas no standard primitive can carry.

**Standard affordances, every primitive:** pointer drag AND tap/click-to-set,
keyboard operation, a reset, `aria` roles + live labels, one quiet entrance
under `prefers-reduced-motion: no-preference`, every colour a theme token,
figure breakout per the diagram house style (`src/components/diagrams/README.md`).

## House rules

- Colour is meaning: the four pigments are declared once per domain in data;
  components route them through a `--pig` CSS-variable channel (never a
  dynamic class name — Svelte's CSS pruner strips those).
- Keep this folder pure: no imports from `@/components`, `@/layouts`, or
  `@/lib`. If a primitive needs something from outside, it arrives as a prop.
