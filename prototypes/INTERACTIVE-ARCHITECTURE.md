# Beyond the book — an interactive architecture for the Reasonable-X family

## 1. The reframe

The wheel stops being a picture of the program and becomes the program's living object. One state-bound component — current week → derived domain → derived focus — is simultaneously the **diagram** (the mnemonic, drawn from data), the **navigator** (every slice a door into its week's essay and sub-diagram), and the **coach** (this-week mode lights one slice, the always-on hub speaks, the four cycle-ticks track your Franklin laps). You are no longer "making the book look good on screen." You are building the chassis that *is* every Reasonable-X program, with the book as one read of it and the coach in your pocket as another.

## 2. Architecture recommendation

**The firm call: keep Astro, add Svelte islands, add MDX. Do not adopt a new framework.** The premise that you need a "new interactive-book framework" is false — Astro *is* one. You have already paid its setup cost and it is compounding: server output on Vercel, an essays content-collection with the epistemic-status schema, the four-pigment token theme that flips light/dark, an inline-SVG diagram house-style with a written spec, and a working billed Socratic guide (`/api/guide.ts`) with per-essay context. A migration to Next/Nuxt/SvelteKit would throw all of that away to acquire client interactivity that Astro grants *additively* — its entire reason to exist is "static HTML by default, hydrate only the touched component," which is the exact shape of "many prose essays with a few draggable wheels." A SPA framework would invert that, shipping a runtime onto pages that are 95% text.

**Island-framework choice: Svelte** (`@astrojs/svelte`). For tiny self-contained SVG-with-a-slider viz it wins on every axis you care about: it compiles to a few-KB vanilla-DOM bundle with no runtime payload, its template is the closest thing to your existing inline-SVG `.astro` components (porting a wheel is near copy-paste plus reactive bindings), and scoped `<style>` lets you keep writing `var(--derived)` so islands inherit the theme flip for free.

**Migration steps (additive, ~half a day to first interactive diagram):**
1. `npx astro add svelte` — appends the integration; your server/Vercel/build-number config is untouched.
2. `npx astro add mdx` — so essays can place islands inline beside prose. Widen the essays glob to `**/*.{md,mdx}`.
3. Extract `pt`/`sector`/`arcPath`/`NUM_INSET` from the diagram README into `src/lib/wheel-geometry.ts` so `.astro` and `.svelte` draw identically — **do this before porting the second diagram** to prevent geometry drift.
4. Port ONE diagram first to prove the contract, reusing the same token CSS vars, wrapped in `prefers-reduced-motion` guards.
5. Embed with `client:visible` so it ships **zero JS** until scrolled into view; the static `.astro` SVG stays as the no-JS / print baseline. Interactivity is progressive enhancement.

**Reversibility: very high.** Islands are opt-in per embed; the static diagrams render exactly as today. Backing out is `astro remove svelte` plus deleting the interactive components — essays, schema, theme, and guide are untouched. Astro runs multiple framework integrations side by side, so the geometry/token layer stays framework-agnostic. The new-framework path, by contrast, is effectively irreversible without a second rewrite — the strongest argument against it.

> **THE ONE GENUINE FORK — yours to decide: Svelte vs Vue.** Svelte gives the smallest island bundle and the cleanest port from your `.astro` SVG. **But SSi runs Vue.** If single-stack across your whole world matters more than a few KB per island, pick Vue (`@astrojs/vue`) and accept the heavier island — the architecture above works identically. My recommendation is **Svelte** because the book's diagrams are tiny and visual, not app-shaped, and the bundle discipline protects the prose-first budget; the SSi reuse argument is real but lives in a separate repo. This is a values call (bundle weight vs cognitive single-stack), not a technical one — which is why it's yours.

## 3. The reusable kit

**One program = one typed data object.** Lift the data currently hard-coded inside `ReasonableEating.astro`'s `QUADS` array out into a new `programs` content collection so the components become generic. The data *is* the diagram AND the curriculum AND the coach script — they cannot drift, because there is only one of them. Build-time zod refinements enforce the invariants: exactly 4 domains, each pigment used once, a contiguous `1..weeks` set, `focuses.length === cycles` per domain.

```ts
// src/content/config.ts — new collection beside `essays`
type Pigment = 'derived' | 'established' | 'contested' | 'open';

type PrimitiveRef =                 // names a reusable sub-diagram + its data
  | { kind: 'quadrant'; xAxis:[string,string]; yAxis:[string,string];
      cells:{tl:Cell;tr:Cell;bl:Cell;br:Cell}; highlight:'tl'|'tr'|'bl'|'br'; pigment:Pigment }
  | { kind: 'scale';  cue:string; tiers:{title:string;eg:string;pigment:Pigment}[] }
  | { kind: 'slider'; poles:[string,string]; markerLabel:string; pigment:Pigment }
  | { kind: 'simulator'; preset:string };

interface Cell { score?:string; lines?:string[] }

interface FocusPoint {              // ONE weekly slice of the wheel
  week: number;                     // numeral in the well; also the rotation key
  lines: string[];                  // the mnemonic, multi-line
  coach: {                          // coach payload co-located with the slice
    wisdom: string;                 // word of wisdom for the week
    prompt: string;                 // the Socratic opener the pocket-coach leads with
    humour?: string;                // optional keep-on-track quip (Tom's voice)
  };
  diagram?: PrimitiveRef;           // the sub-diagram this focus expands into
}

interface Domain {
  name: string;                     // "HOW" | "WHEN" | "WHY" | "WHAT"
  pigment: Pigment;                 // the ONE place colour-by-meaning is declared
  base: number;                     // start angle (geometry, not authored per-slice)
  focuses: FocusPoint[];            // exactly `cycles` of them (3 for 13×4, 2 for 9×4)
}

interface Program {
  slug: string;                     // 'reasonable-eating' — permalink + coach channel id
  title: string;
  noun: string;                     // "EAT" — drives hub + verb-templated coach copy
  hub: { label: string[]; coach: FocusPoint['coach'] };   // Algorithm Zero, always-on
  cycles: number;                   // 3 → 13×4, 2 → 9×4 ; weeks = domains*cycles
  rotation: 'by-domain';            // 1,5,9 HOW / 2,6,10 WHEN …
  domains: [Domain,Domain,Domain,Domain];   // four, one per pigment — invariant
  essaySlug?: string;
}
```

**The interactive primitives** (static-by-default Astro SVG, with `client:visible` Svelte only on the interactive layer):

- **`ProgramWheel`** — generic replacement for `NineByFour.astro` AND `ReasonableEating.astro`. Angles derive from `domains.length * cycles`, so the SAME component draws a 9×4, a 13×4, or a future 11×4. Slices emit `focus:select`. *(The 9×4 and 13×4 falling out as `cycles:2` vs `cycles:3` instances proves the kit by retrofitting what already ships.)*
- **`Quadrant`** — already prop-driven, so already a kit primitive. Add optional `draggableMarker` (NERD plot, Body-vs-Taste-Buds); static fallback = today's highlighted goal cell.
- **`Scale`** — generalised `FoodScale`; tiers from props so wealth/faith reuse the ladder with different rungs.
- **`DragSlider`** — the "sliders you drag, things that respond" primitive: pole-to-pole continuum with live token-pigmented response copy.
- **`ProcessSim`** — the ONE primitive expected to occasionally need a bespoke preset per program (kinetic principles a static figure can't teach). Keeps bespoke art to one small file per preset.
- **`FocusCard`** — the pocket-coach surface: renders `FocusPoint.coach` under a mini `ProgramWheel` with the active slice lit. "Talk it through" hands `{program.slug, week, FocusPoint}` to the existing Alexander endpoint.

**Net new code for a brand-new Reasonable-X: typically ZERO components — just the data file** (plus one optional `ProcessSim` preset if a principle needs novel motion). Add the program to a `programs.ts` manifest mirroring `series.ts` and it slots into navigation automatically.

## 4. The reimagined diagrams

The wheel itself is a continuous near-still life: keep the existing one-time entrance bloom, then the **only thing that moves at rest is a slow ~4s breathing pulse on the live slice and the always-on hub**. The week-hand eases between slices on state change; rotate-to-reading-position and scrub are interaction-driven. All of it under `prefers-reduced-motion: no-preference` — reduced-motion drops the pulse, jumps the hand, and promotes by static saturation swap.

| Wk | Algorithm | Interactive treatment | Effort |
|----|-----------|----------------------|--------|
| — | **THE 13×4 WHEEL** | Live state-machine clock-face: current-week slice promoted, hub always lit, four cycle-ticks accumulating, draggable week-hand to time-travel through domains. Navigator + coach home + progress ring in one. | M |
| 0 | EAT MORE (Algorithm Zero) | Hub is the only always-lit element — perpetual faint pulse; scrub all 52 weeks and it *never* dims (you can't turn it off). Plate fills UP, not shrinks. | S |
| 4 | Did it grow into its shape? | **Processing REWIND** — drag a slider backwards: loaf → dough → flour → grain → wheat ear, each snapping to a ladder rung. | M |
| 5 | Eat slow | **Satiety-lag PACE simulator** — tempo slider vs a ~20-min fullness curve; eat fast and watch your own overshoot band appear. | L |
| 8 | Eat a high NERD | **Live computed quadrant + fill-a-plate** — two sliders recompute `NERD = nutrition/energy`; compose a plate, watch aggregate NERD move. | M |
| 3 | Eat for body & taste buds | Make the quadrant **draggable** — place foods, get gently corrected, a bias heatmap builds. | M |
| 1 | Chew until liquid | Tap-to-chew counter; blob de-resolves to liquid; "swallow" gated until actually liquid; ghost "most people stop here (~5)" marker. | M |
| 2 | Hunger >> Appetite | Two-pan **balance/sort game** — drag eating cues to HUNGER vs APPETITE; appetite pan piles heavy, live ratio makes the `>>` real. | M |
| 6 | Stop when no longer hungry | Graded **hunger dial** — feel the gap between "no longer hungry" and "full"; catch your own overshoot. | M |
| 7 | Eat for a long life | **Time-horizon slider** — drag tonight → lifetime; two near-identical choices fan apart by compounding. | M |
| 9 | Savour the flavour | Press-and-hold **mindful-bite player** — sustain attention, flavour curve stays high, tasting-notes bloom. | M |
| 10 | Eat naturally, not continuously | **Paint a 24h day** with meals; digestive state-line gets rest vs (grazer preset) pinned permanently ON. | M |
| 11 | Eat for fun | **Guilt→joy toggle** — flip off "guilt" and the whole plate re-saturates grey→colour. Tonal pivot. | S |
| 12 | Eat what YOU control | **Control-attribution dials** — slide home→packaged and watch dials lock out of your reach. | L |

**First 3–4 to build** (highest leverage / most demo-able):
1. **The 13×4 wheel in this-week/coach mode** — the reusable chassis; every other treatment plugs into it. Highest leverage even at minimal scope (week-scrub + promoted slice + hub coach copy).
2. **Week 4 — processing REWIND** — builds on the existing FoodScale; the loaf→wheat morph is the single most demo-able "aha," one slider, instant wow.
3. **Week 5 — satiety-lag PACE simulator** — the flagship: simulates an *invisible temporal mechanism* no book can show. Worth the L effort.
4. **Week 8 — live NERD quadrant** — reuses the existing quadrant; turns a static ratio into a thing you operate. Strong impact-per-effort.

## 5. "13" — the coach in your pocket

**13 is the 13×4 made portable**: a coach for whichever Reasonable-X you enrolled in, plus the engine that publishes new programs. One change a week, four laps a year, minimum willpower for maximum effect. It **extends Alexander — it does not fork him.** He is already the single shared character across your sites; coach is a new *corpus and mode*, not a new persona. Keep `BASE_PROMPT` and the epistemic contract verbatim. `GuideContext.mode` already holds `essay/writing/home/projects` — add `coach`, and where `buildPromptWithContext` injects live ESSAY markdown, in coach mode inject live PROGRAM STATE (program, cycle, week, this-week focus + domain, Algorithm Zero). The build is **one enum value, one context branch, one welcome surface.** `api/guide.ts` is reused wholesale — same billing guard, 503-without-key, Haiku default, no auto-send.

| Tier | Capability | Honest cost |
|------|-----------|-------------|
| **0 — The Wheel** (free, offline PWA) | Interactive 13×4 wheel, current week lit, hub Algorithm Zero, cycle dots, draggable sub-diagrams. The whole product for most. | **Zero.** Date math + existing SVG. No model call. |
| **1 — Reminder Coach** (free) | Weekly local push naming this week's focus + domain colour; hand-authored bank of wisdom, humour, drift-nudges keyed by week. | **~Zero per user.** Web Push needs no model; wisdom frozen in the build. |
| **2 — Live Coach Chat** (billed) | The same Alexander, coach mode: talk about *your* week, same Socratic discipline pointed at your habit. | **Per-message API.** Haiku default, key-gated, 503 without a key, never auto-sends. The premium edge — chat bills per user, so the free reminder tiers carry the everyday product. |

**PWA mechanics:** installable via web manifest (name "13", hexagonal Alexander mark, theme-respecting colour) — install is also the *gate* for iOS notifications. Offline-first service worker pre-caches the wheel, sub-diagrams, date logic, and wisdom bank so the coach works with no network and no cost. Local weekly-focus and drift-nudge Web Push at week boundaries (Android, **iOS 16.4+ when installed** — a real-device QA loop, per the SSi iOS-audio caution, not "done from one simulator run"). Local streak state in storage, no account for free tiers.

**What I won't oversell:** identical notifications across iOS/Android without device testing; that authoring each new Reasonable-X is free (each needs its *real* thirteen algorithms written and pigment-mapped — and per the "Tom's writing is his" rule, the wisdom lines are yours; the kit supplies geometry, tokens, validation); or that live chat is ever free at scale.

## 6. Build roadmap

Each phase is independently shippable.

- **Phase 1 — This week (cheap, now): the chassis + first reveal.** `astro add svelte` + `mdx`; extract `wheel-geometry.ts`; lift `QUADS` into the `programs` collection with zod invariants; build the live `ProgramWheel` (week-scrub + promoted slice + hub coach copy + cycle ticks) and the Week-4 processing REWIND. *Ships: an interactive Reasonable Eating page.*
- **Phase 2 — Cheap, now: the felt mechanisms + PWA shell.** Port Week-5 PACE simulator and Week-8 live NERD quadrant; add the manifest + offline service worker; ship the hand-authored per-week wisdom/humour/nudge bank in `FocusCard`. Still no model, still free. *Ships: an installable, offline Tier 0 + Tier 1.*
- **Phase 3 — Moderate, device-QA-gated: notifications.** Wire Web Push for weekly-focus + drift-nudge reminders; budget an iOS-16.4+ installed-PWA testing loop. *Ships: the free reminder coach.*
- **Phase 4 — Billed, later: Alexander coach mode + the family.** Add `coach` to `GuideContext.mode`, branch `buildPromptWithContext` to inject program state, surface via `GuidePanel`. Then prove the chassis by authoring **program #2** (Reasonable Wealth / Faith / Shape) as *data only* — if it's just a file, the kit is real. *Ships: the product, and the engine that publishes the rest.*

## 7. What I'm building you right now

Alongside this memo I'm assembling an **openable interactive explorer prototype** of Reasonable Eating's *real* 13 algorithms — theme-aware (the four epistemic pigments, light/dark flip, tokens never hex), with a draggable week-scrub that walks the wheel through HOW/WHEN/WHY/WHAT, the always-on EAT MORE hub, the four cycle-ticks, and at least one clickable sub-diagram made live (the NERD quadrant or the processing rewind). It's a standalone proof of the chassis — the thing Phase 1 turns into production islands — so you can feel the wheel-as-living-object before a single line of it touches the site.
