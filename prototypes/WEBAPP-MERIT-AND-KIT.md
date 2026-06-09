# Reasonable Eating — does it merit its own webapp? + the 13-family kit

## 1) The verdict

**SOON, not now — and the threshold is concrete.** Reasonable Eating does not merit a separate Vercel app today, and the reason is not timidity — it's that splitting it out now would graduate an empty room. Configuration Economics and Distinction Physics earned their own domains because each is a *finished, standalone treatise*; their own-app value is presence and permanence. Reasonable Eating is the opposite shape: a **kit with exactly one instance and zero shipped interactivity**. The ProgramWheel island, the geometry helper, the schema, and the full reasonable-eating coach data all exist in the working tree — uncommitted past `0211c56`, embedded in no live page. You cannot judge whether something merits its own app until it exists as one coherent surface. Right now it doesn't.

The decisive reframe: **Reasonable Eating's own-app value is ~80% PWA, ~20% funnel/brand, and ~0% "it needs a website."** The marketing job — explaining the framework — is fully served by a hub page. What a hub page *structurally cannot do* is install to a phone, run offline with zero model cost, and push a nudge at each week boundary. That installed-coach mechanic is the entire spine of "one change a week, four laps a year." So the thing that actually graduates is not "an eating site" — it is **"13," the coach-in-your-pocket platform**, with Reasonable Eating as its first published channel.

**Graduate it the moment two gates pass together:** (Phase 3) the wheel is installable with a real push loop proven on-device, AND (Phase 4) a *second* Reasonable-X renders correctly as data only. The first gate builds the one thing the hub can't host; the second proves the chassis is a kit and not a one-off. Until both are green, Reasonable Eating lives on the hub and compounds the shared kit — the cheap place to prove the chassis.

## 2) The case for/against + the tipping signals

**The case FOR its own app (all roads lead to PWA, not to a second marketing site):**
- The wheel is a **date-driven living object** — current week lit, four cycle-ticks, Algorithm Zero ("EAT MORE") always on. Its entire point is to sit installed on a phone and nudge you one change a week. That is install + offline + push, which an essay page cannot deliver.
- **iOS push is gated on PWA install** (16.4+, installed-only). The weekly-focus / drift-nudge reminder — the product's spine — *literally cannot exist* without a dedicated installable surface.
- Tom already runs this exact pattern: siblings get their own Vercel app, and `guide.ts` model IDs are pinned "to match the sibling sites." A Reasonable-X app is a **known, low-novelty move**, not a leap.
- **Commerce wants its own home.** Tier-2 live coach chat bills per message (Haiku default, key-gated, 503 without key — already built). A billed habit-coach needs its own install funnel, streak state, and identity; it doesn't belong stapled to a design-science journal.
- **Audience + tone.** "Minimum willpower, maximum effect" speaks plainly to ordinary eaters — a different register from the hub's epistemic-journal voice. A dedicated app lets it speak without diluting the journal.
- **"13" needs an engine, not an essay.** The meta-product is a publishing platform for the whole Family Robinson. That is an app; Reasonable Eating is its flagship enrolment.

**The case AGAINST (for now):**
- **Zero interactivity shipped.** ProgramWheel (380 lines), `wheel-geometry.ts`, `types.ts`, and the coach data are uncommitted and unembedded. Prove the chassis in the cheap place first.
- **N=1 is not a kit.** The whole claim ("a new app is mostly data + branding") is *unproven* until a second Reasonable-X exists as data only. Spinning out before that risks baking eating-specific assumptions into "shared" code — the exact drift the geometry helper was built to kill. Build #2 as a file first; if it's just a file, the kit is real.
- **Splitting now forks the kit you just unified.** The hub already holds the theme tokens, the diagram house-style spec, the essays collection, and the billed guide endpoint. A second repo today either duplicates these (drift) or needs a shared-package extraction that doesn't exist yet.
- **The coach is an additive *mode*, not a new build.** `guide.ts` already has the tier/billing/503 shape; `GuideContext.mode` already branches. The plan is *one enum value, one context branch* — evolve in place, then lift.
- **Notifications are device-QA-gated and unproven.** Per Tom's own iOS-audio caution, never call push "done" from one simulator run. Don't over-ship the single feature that justifies the app.
- **Two more live apps = two more things to keep demo-rock-solid.** With the Dublin SSi pitch on 24 June consuming the rock-solid budget, a third production surface competes for the same attention. Let it graduate when the kit makes it cost almost nothing.

**The tipping signals (graduate when these fire):**
1. **PROOF-OF-KIT (the hard gate):** a second Reasonable-X renders correctly as a new `programs/*.ts` file + a manifest entry, **zero new components** (at most one ProcessSim preset). The day app #2 is *just a file*, graduate eating into app #1.
2. **PWA-COMPLETE:** installable (manifest + offline SW pre-caching wheel/sub-diagrams/date-logic/wisdom bank) AND a real-device push loop passes on iOS 16.4+ installed and Android — weekly-focus + drift-nudge actually fire.
3. **RETENTION on the hub-embedded version:** people return week-over-week and walk the Franklin rotation (cycle-ticks accumulate across visits). Returning intent to be reminded = demand for an installed home.
4. **BILLED-COACH DEMAND:** Tier-2 "talk it through" gets real usage / anyone asks to pay. A commerce funnel is a reason for an app with its own identity.
5. **SHARED-LAYER PACKAGED:** geometry + tokens + ProgramWheel + schema + guide-coach-mode extracted into a reusable package so a sibling repo consumes them without duplication. Until this exists, a split forks the kit; once it exists, splitting is cheap and reversible.
6. **CONTENT-READY:** the real thirteen algorithms + per-week wisdom/humour/nudge bank are authored in Tom's voice. An app shell with stub copy isn't ready to graduate.

## 3) The shared-kit extraction architecture

**The call: one published, semver'd npm package — `@reasonable/kit` — consumed by thin per-app Astro repos. Not a monorepo (near-term). Not a git submodule.**

This is forced by a fact you can't wish away: the three existing siblings are *already* separate repos, separate Vercel projects, on Astro 5 while the hub is Astro 6. A package adds sharing **without touching the live apps** — they keep their repos, domains, and deploy cadence, and could add the dependency later, one at a time. It also promotes Tom's *own* established pattern: distinction-physics already pulls a canonical Alexander artifact from another repo via `sync-pedagogy.mjs` and commits the generated output. The kit is that idea promoted from copy-script to a real, versioned package — version skew becomes explicit (`@reasonable/kit@^1`) instead of silent drift.

**What lives in the kit (`@reasonable/kit`):**
- **Geometry — pure TS, zero deps, framework-agnostic:** all of `wheel-geometry.ts` — `pt()`, `annularSector()`, `arc()`, `buildWheel()`, `sliceForWeek()`, `DEFAULT_DIMS`, and the `WheelDims`/`WheelSlice`/`WheelDomainArc`/`WheelLayout` types. This is the single source of truth that guarantees the static `.astro` figure and the Svelte island can never drift.
- **Schema + types:** `programs/types.ts` — `Program`, `Domain`, `FocusPoint`, `Coach`, `Pigment` — plus a **zod schema** encoding the build-time invariants (exactly 4 domains, each pigment used once, `focuses.length === cycles`, contiguous `1..weeks`). Every app validates its own data file against the same rules at build.
- **`ProgramWheel.svelte`** — the living-object island (diagram + navigator + coach surface). It already takes a `Program` prop and emits selection state: import-and-render, no per-app code.
- **Sub-diagram primitives, generalised + prop-driven:** `Quadrant` (NERD / body-vs-taste-buds), `Scale` (generalised FoodScale), `DragSlider` (pole-to-pole continuum), and the sorters (`GrowIntoShape`, `HungerMeter`). Keyed by a `PrimitiveRef` union in the schema so a focus point names a sub-diagram **by data, not by import**.
- **Coach client + persona:** `guide-prompt.ts` (Alexander `BASE_PROMPT`, the epistemic contract, `GuideContext` with the new `'coach'` mode) and a typed fetch client for `/api/guide`. Alexander is **one shared character across all sites** — the prompt belongs in the kit so every app speaks the same voice with the same 503-without-key discipline.
- **Token CONTRACT (names, not values):** the CSS-variable surface the kit depends on (`--derived/--established/--contested/--open` + `-wash/-chip`, `--text-*`, `--hairline`, `--bg-elevated`, `--depth-3`, `--font-display/body/mono`), documented, plus a default `tokens.css` an app can import or override. The kit reads tokens via `var()` and never hardcodes hex — theming stays the app's job.
- **The diagram house-style README** as the kit's spec doc, so every new primitive is built in the same vocabulary.

**What each app owns:**
- **Program DATA** — its own `src/data/program.ts`: the one typed `Program` object that *is* the whole curriculum.
- **Branding / token OVERRIDES** — its own `tokens.css` layered over the kit's required names, so shared components re-pigment for free.
- **Domain + Vercel project** — e.g. `reasonable-wealth.vercel.app`, its own env vars (`ANTHROPIC_API_KEY`), its own deploy cadence — exactly like the siblings today.
- **Content / prose** — its essays/MDX (Tom's voice, his to write). The kit supplies geometry and validation, never prose.
- **PWA manifest + service worker** — its own `manifest.json` and offline SW pre-caching *its* wheel, sub-diagrams, date logic, and frozen wisdom bank, so each Reasonable-X is independently installable.
- **Optional bespoke ProcessSim preset** — the documented escape hatch for novel motion a static figure can't teach.
- **App shell** — BaseLayout, nav, homepage register, cross-links back to the hub and siblings.

**Why not the alternatives:** A **monorepo** (pnpm/turbo) is the textbook answer for "many apps, one kit" and gives instant cross-package edits with no publish step — but adopting it *now* means re-homing three independently-deployed Vercel projects into one repo and reconciling Astro 5↔6 for zero new-app benefit. Keep it as an **optional end-state**, not an entry cost. A **degit starter** is *complementary*, not an alternative: degit scaffolds a new app once; the package delivers ongoing shared updates. Using degit alone (copying kit source into each app) is **rejected** — it reintroduces the exact drift the geometry helper kills. **Git submodules** are **rejected** — painful on Vercel's shallow clones, brittle for a solo author; a versioned package is strictly better.

## 4) How Tom spins up sibling app #2

To stand up **Reasonable Wealth**:
1. `npx degit thomascassidyzm/reasonable-x-starter reasonable-wealth` — scaffolds an Astro 6 + Svelte app with `@reasonable/kit` already in `package.json`, a `BaseLayout`, a tokens-override stub, and an example program data file.
2. `npm install` — pulls the kit.
3. Write `src/data/reasonable-wealth.ts` — the one `Program` object: hub Algorithm Zero, four domains mapped one-to-one onto the four pigments, twelve `FocusPoint`s with week numerals + mnemonic lines + draft `coach.wisdom`. **Tom writes the real thirteen wealth algorithms; the prose is his.** The kit's zod schema validates at build — wrong pigment count or a gap in `1..weeks` fails the *build*, not production.
4. Drop into a page: `<ProgramWheel program={reasonableWealth} client:visible />` plus any sub-diagrams referenced by data. The static `.astro` figure stays the no-JS/print baseline.
5. Edit `tokens.css` to the wealth palette/accent — the kit re-pigments via `var()` for free.
6. Add `manifest.json` + service-worker stub for installability; set `ANTHROPIC_API_KEY` in Vercel if enabling billed coach mode.
7. Add the program to a `programs` manifest (mirroring `series.ts`) and a card to the hub's `/projects` "siblings" grid.
8. Create the Vercel project, point the domain — ship.

**Net new engineering ≈ zero components.** The work is data + branding + (Tom's) words. That *is* the target.

## 5) Migration path from today (kit-in-hub) to shared-kit

Four additive steps, no big-bang:

- **STEP 0 — today (done):** the kit lives co-located in the hub (`src/lib/programs`, `src/lib/wheel-geometry.ts`, `ProgramWheel.svelte`, sub-diagrams). Keep building and proving it there. The hub is the kit's proving ground and Reasonable Eating's first home.
- **STEP 1 — extract in place:** move the kit files into a clearly-bounded `src/kit/` folder with a single `index.ts` barrel and zero hub-specific imports (it already has none — geometry is pure, ProgramWheel takes only a `Program`). Add the zod schema next to `types.ts`. The boundary becomes real without publishing.
- **STEP 2 — prove the boundary with app #2:** scaffold Reasonable Wealth and, *before any registry publish*, consume the kit via a local `file:../tomcassidy-site/src/kit` or `npm link` dependency. **If Wealth is genuinely just-a-data-file against the linked kit, the boundary is proven.**
- **STEP 3 — publish:** cut `@reasonable/kit@1.0.0` from that folder (its own `package.json` + build) to GitHub Packages; repoint hub and Wealth to the published version; pin `^1`. New apps now degit-and-install.
- **STEP 4 — optional, later:** *if* the publish/bump loop becomes friction across many apps, consolidate into a pnpm/turbo monorepo and bring siblings in one at a time at natural maintenance moments — **never as a prerequisite.**

Independently, **retire the standalone `13` static-PWA prototype** by rebuilding "13" as a thin app on the same kit — its coach is just `GuideContext.mode='coach'` over the shared Alexander endpoint — so the meta-product and the family share one engine.

**Mitigate the known risks as you go:** stay on `npm link`/`file:` while the kit churns (publish-loop friction); keep the kit *core* (geometry + schema + coach client) pure TS with zero Astro/Svelte coupling so Astro 5↔6 skew never bites — only `ProgramWheel.svelte` and the `.astro` primitives are version-sensitive, and don't promise the v5 siblings consume the kit until they upgrade (they don't need it); ship the token names as a documented contract + a dev-time check that the variables resolve (token drift); and bake one shared coach-endpoint contract (503-without-key, Haiku default, never auto-send) into the kit client before more than one app enables billed chat (cost-surface sprawl). And set the honest expectation: **the saving is engineering, not authorship** — each Reasonable-X still needs its real thirteen algorithms, and the wisdom lines are Tom's.

## 6) What to build next to prove it

The decisive finding from the repo: **the expensive engineering is already DONE and compiling — it's just scattered.** The schema, the framework-agnostic geometry helper (with `sliceForWeek()` already present), the full ProgramWheel island (click-select, Play rotation, keyboard nav, theme-aware coach panel, cycle readout), and **three complete interactive sub-diagrams (~1,640 lines: NerdQuadrant, GrowIntoShape, HungerMeter)** all exist uncommitted on main. The sub-diagrams are *orphaned* — embedded nowhere. So the highest-leverage work is **assembly and wiring**, not construction. Build in this exact order — each step is chosen to prove one leg of app-worthiness:

1. **[S] Assemble the real `/reasonable-eating` page.** One linked Astro page stacking the lede, the `ProgramWheel` island, and four domain sections — each embedding its already-built sub-diagram beside its week's prose. *This is wiring, not construction* — the three diagrams compile but are embedded nowhere. **Proves:** does the assembled whole cross "this is a product, not a book page"? The core go/no-go. (Note: **MDX is NOT installed and NOT needed** — Astro embeds `.astro`/`.svelte` islands in a `.astro` page directly. Defer MDX until an essay needs inline islands.)
2. **[S] Add date-derived "this week" coach mode to ProgramWheel.** A prop (`startDate`/`weekOverride`) computes the current week from today via the existing `sliceForWeek()`, opens with that slice promoted instead of the hub, and renders its `coach.wisdom` as a standing "This week" card above the wheel. Persist an opt-in start date in `localStorage`. *Wiring date-math into existing machinery — not new architecture.* **Proves:** is there a **recurring-use reason to open this weekly**? The retention crux — the single strongest app-worthiness signal. A book is read once; an app earns re-opens.
3. **[M] Ship a Tier-0 PWA shell over the program page.** Web manifest (name "13" / "Reasonable Eating", theme-token colours, icons), offline-first service worker pre-caching the wheel + three sub-diagrams + date logic + frozen wisdom bank, "Add to home screen." No model calls, no account, no push yet — **zero per-user cost**. **Proves:** does it survive the **install test** — Reasonable Eating on a phone home screen, opened offline on a Monday, feel like a product someone keeps? The literal proof of "merits its own webapp."
4. **[M] Prove the chassis: author program #2 as DATA ONLY.** A second Reasonable-X (Wealth or Shape) as a new `programs/*.ts` file + a one-line manifest entry mirroring `series.ts`, rendered through the *same* ProgramWheel and page template with **zero new components** (one optional bespoke sub-diagram at most). Tom writes the real thirteen + wisdom. **Proves:** is the kit a genuine reusable engine or a one-off dressed as a framework? If #2 renders from data alone, the entire multi-sibling-webapp thesis is validated and every further Reasonable-X costs only authoring. **This is the hard gate from §1.**
5. **[M] Add `'coach'` mode to the existing Alexander guide.** Extend `GuideContext` (it already carries a string mode), branch `buildPromptWithContext` to inject live **program state** (program, cycle, this-week focus + domain, Algorithm Zero) where it currently injects essay markdown, and add a "Talk it through" affordance on the this-week card handing `{slug, week, focus}` to the existing `/api/guide.ts`. *One enum value, one context branch — reuses the endpoint wholesale (billing guard, 503-without-key, Haiku default, no auto-send).* **Verify by build/check only — do NOT live-test; it's billed.** Sequenced **last** because it costs money to exercise and only matters once the free tiers prove there's a product worth talking to a coach about. **Proves:** the business-model leg — is there a billable conversation worth having?

**The throughline:** assemble the page (is it a product whole?) → date-lit this-week (is there a weekly re-open?) → PWA shell (does it survive install?) → program #2 as data (is the kit real?) → billed coach (is there a paid edge?). Ship fast and read the install/re-open signal — that is the evidence that flips the verdict from "soon" to "now." Don't agonise over whether it qualifies in the abstract; the parts are built, the move is wiring, and the signal is one assembled page away.
