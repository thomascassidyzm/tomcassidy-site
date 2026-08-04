# 13×4 — state of play

Scout pass, 2026-08-04, on `main` at `d0a6012`. Read-only survey: what the 13×4 wheel-coach
actually is today, what is finished, what is scaffolding, and the honest shortest path to
live-on-a-domain. Nothing here was built or changed; this file is the only artefact.

Method notes: completeness is judged against the schema in `src/kit/types.ts` and the invariants in
`src/kit/validate.ts` — which every programme page asserts in frontmatter, so a malformed programme
fails the BUILD. The build passes, so all eight programmes are structurally valid. "Complete" below
therefore means *rich*, not *valid*.

---

## Part 1 — What exists

### Engine (pure logic, server-safe)

| File | Lines | What it does |
|---|---|---|
| `src/lib/coach-engine.ts` | 119 | The rotation maths + line picker. `rotationOrder`, `currentWeekNumber`, `focusForWeek`, `pickCoachLine` (tone-weighted draw: gentle 4, encouraging 3, honestKind 2, playful 2; falls back to `coach.wisdom` when a week has no banks). Mirrors the wheel's arithmetic so push and wheel can't disagree. |
| `src/lib/today.ts` | 49 | Resolves "the one focus live right now" from `PROGRAM_START` (2026-06-22 UTC). Defaults to Reasonable Eating. |
| `src/lib/programs/index.ts` | 33 | The registry — `ALL_PROGRAMS` (eight) + `programBySlug`. |
| `src/lib/push-store.ts` | 93 | Single-subscription persistence. Vercel KV/Upstash when `KV_REST_API_URL`+`KV_REST_API_TOKEN` are set; otherwise read-only env fallback (`PUSH_SUBSCRIPTION` + `PROGRAM_START_DATE`). |

### Kit (the renderer — data in, wheel out)

`src/kit/types.ts` (315) is the contract: `Program` → `hub` + 1–4 `Domain`s → `FocusPoint`s, each
carrying `coach.wisdom`, optional tone `banks`, optional `fast` teaching, optional `diagram`.
`validate.ts` (77) enforces distinct pigments, equal domains on an interleaved wheel, contiguous
week numerals, wisdom present everywhere. `wheel-geometry.ts` (222) computes the slices;
`ProgramWheel.svelte` (542) draws them. Primitives that render sub-diagrams **by data, not import**:
`SortLadder.svelte` (591), `PlotQuadrant.svelte` (494), `ZoneSlider.svelte` (475), dispatched through
`SubDiagram.svelte` (126).

### Surfaces a visitor can actually reach

- `/programmes` — the family index, all eight, with an interactive showcase.
- `/ultimate-13x4`, `/reasonable-eating`, `/reasonable-teaching`, `/reasonable-success`,
  `/reasonable-leadership`, `/conquering-life`, `/agile-results`, `/great-teaching` — one page per
  programme, wheel + written-out focuses. All prerendered.
- `/explore/<slug>` — STUDY mode, generated from the registry for all eight.
- `/reasonable-eating/today` — PRACTICE mode. SSR (`prerender = false`), one screen, this week's
  focus. This is the page a push notification opens.
- `/program-preview`, `/diagram-preview` — dev/authoring surfaces.
- `/writing` + 20 essays, `/about`, `/projects`.
- Nav exposes Home · The Format · Writing · Programmes · Projects · About.

### API routes

- `src/pages/api/guide.ts` (119) — Alexander, the reading companion. Anthropic call is inside `POST`
  only; returns **503 without `ANTHROPIC_API_KEY`**. Billed per request. Mounted via `GuidePanel` in
  `EssayLayout` — i.e. on essays, not on the programme pages.
- `src/pages/api/push/vapid.ts` (19) — serves the VAPID public key, 503 when unset.
- `src/pages/api/push/subscribe.ts` (65) — stores the one subscription; without KV it echoes back a
  `paste` payload for Vercel env.
- `src/pages/api/cron/coach.ts` (70) — the delivery loop. Bearer-checks `CRON_SECRET`, 503s without
  VAPID keys, picks the line, sends one web push tagged `pocket-coach` (replaces, never stacks).

### Push / PWA / cron

`public/sw.js` — SWR offline cache **scoped to `/reasonable-eating`**, plus `push` and
`notificationclick` handlers. `public/manifest.webmanifest` — name "Reasonable Eating",
`start_url` and `scope` both `/reasonable-eating`. The subscribe button lives in
`src/pages/reasonable-eating.astro` only. `vercel.json` declares three daily crons on
`/api/cron/coach` at 07:47, 12:13, 18:09 UTC.

**The load-bearing fact:** `api/cron/coach.ts` hard-codes `const PROGRAM = reasonableEating`, the
manifest is scoped to Reasonable Eating, and the subscribe UI is on that page alone. What is built
today is *Reasonable Eating in your pocket*, not *the Ultimate 13×4 in your pocket*.

---

## Part 2 — Content-complete versus half-built

Eight programmes, not nine. Census by structure:

| Programme | Shape | Weeks | wisdom | tone banks | FAST | sub-diagrams | Verdict |
|---|---|---|---|---|---|---|---|
| **reasonable-eating** | 4 domains × 3, hub always-on | 12 | 13/13 | **13/13, all four tones** | — | 3 | **The only finished one.** Reference shape. |
| **conquering-life** | 4 domains × 3, sequential | 12 | 13/13 | 0 | 13/13 | 0 | Deep teaching; 15 of 27 story beats still `draft: true`. No banks. |
| **agile-results** | sequential, 4 cycles | 12 | 13/13 | 0 | 13/13 | 0 | Same shape, but **all 26 story beats are `draft: true`** — outlines awaiting the telling. |
| **ultimate-13x4** | 3 domains × 4 + week-1 hub | 13 | 13/13 | 0 | 0 | 0 | **Wheel + one draft line per week. Nothing else.** |
| **great-teaching** | sequential 1..12 + week-13 hub | 13 | 13/13 | 0 | 0 | 0 | Wheel + wisdom only. |
| **reasonable-leadership** | 4 domains × 3 + week-13 review hub | 13 | 13/13 | 0 | 0 | 0 | Wheel + wisdom only. |
| **reasonable-success** | 4 domains × 3 | 12 | 13/13 | 0 | 0 | 0 | Wheel + wisdom only. |
| **reasonable-teaching** | the 9×4: sequential, week-1 hub | 9 | 9/9 | 0 | 0 | 0 | Nine by design, not a stub. Wheel + wisdom only. |

**On the Ultimate 13×4 specifically — the one Tom named.** It is structurally complete and
genuinely correct: NOTICE at the hub as week 1, then Health / Wealth / Relationships four each,
weeks 2–13, slice titles verbatim from Tom's wheel. But its own file header says it plainly: *"The
`coach.wisdom` lines are DRAFT coach copy in his register — a starting point for him to finesse, not
finished prose."* There are no tone banks, no FAST teachings, no sub-diagrams. So it renders a
beautiful wheel and reads well as a page, and it **cannot drive a pocket coach** beyond repeating
one unedited line per week. Compared against `reasonable-eating` (the reference), it has roughly a
fifth of the content depth.

**What "finishing" one programme involves**, using eating as the yardstick: 13 focuses × 4 tone
buckets × 4–5 lines each ≈ **200+ short lines in Tom's voice**, plus a voice pass over the 13 wisdom
lines, plus (optionally) a FAST teaching per week and a sub-diagram where one earns its place.
That is authoring work, not engineering work. The engine already reads all of it the moment it exists.

**Latent bug worth knowing.** `today.ts` computes `totalWeeks = cycles × domains.length`. That is
right for eating (3×4=12) and success, and **wrong for every programme with an in-rotation hub or
uneven domains** — Ultimate 13×4 would read 12 not 13, reasonable-teaching 8 not 9, great-teaching
16 not 13. It bites only when the Today surface is generalised past Reasonable Eating, which is
exactly the next step. `coach-engine.ts` gets this right; `today.ts` should use `rotationOrder()`.

---

## Part 3 — Does it build and run?

`node_modules` was absent. `npm ci` — clean, exit 0.

- `npm run build` — **passes**, exit 0, **6.4s**. 40 static routes prerendered. Every programme page
  runs `assertValidProgram` in frontmatter, so this is also a full validator pass on all eight.
  One benign line: `/exceptional-teaching/index.html (file not created, response body was empty)` —
  that is the configured redirect to `/reasonable-teaching` behaving as designed.
- `npm run check` (astro check) — **passes**, exit 0, **5.8s**. `Result (60 files): 0 errors,
  0 warnings, 0 hints`.

No dev server was started. No API key was set. No Anthropic call was made.

---

## Part 4 — Deploy setup

**Verified live.** No `vercel` CLI exists on this Linux box, so this was established through the
GitHub deployments API and read-only HTTP probes.

- Vercel's GitHub app is connected: `vercel[bot]` has created deployments for this repo since at
  least 2026-06-11. The most recent is **Production, sha `d0a6012` (head of main), 2026-07-14
  16:03 UTC, state `success`**, target `https://tomcassidy-site-hpzivx6wy-zenjin.vercel.app`.
  Vercel team slug is `zenjin`.
- Three aliases answer 200: `tomcassidy-site.vercel.app`, `tomcassidy-site-zenjin.vercel.app`,
  `tomcassidy-site-git-main-zenjin.vercel.app`. `tomcassidy.vercel.app` is 404 (not this project).
- The live HTML carries build stamp **`260714-1602.d0a6012`** — production is exactly main's head.
  Nothing is stale.
- Routes probed on production, all 200: `/`, `/ultimate-13x4`, `/explore/ultimate-13x4`,
  `/reasonable-eating`, `/reasonable-eating/today`, `/programmes`, `/manifest.webmanifest`, `/sw.js`.
- **`/api/push/vapid` returns 503 on production.** That is definitive: **VAPID keys are not set in
  Vercel env**, so the push loop is inert today. The three crons are firing on schedule and hitting
  a route that 503s before it does anything.

### Environment variables that would need to exist in Vercel

| Var | For | State |
|---|---|---|
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | push | **Confirmed absent** (vapid route 503s live) |
| `VAPID_SUBJECT` | push | Defaults to `mailto:tomcassidy@mac.com` if unset |
| `CRON_SECRET` | cron auth | Unverifiable from outside; optional but recommended |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | subscription persistence (option A) | Unverifiable from outside |
| `PUSH_SUBSCRIPTION`, `PROGRAM_START_DATE` | subscription persistence (option B) | Unverifiable from outside |
| `ANTHROPIC_API_KEY` | the billed guide | **GAP — see below** |

### Explicit gaps

1. **Whether `ANTHROPIC_API_KEY` is set in Vercel is UNKNOWN.** Determining it from outside requires
   POSTing a real message to `/api/guide`, which would spend money if the key *is* set. I did not.
   (A `POST {}` returned `{"error":"Message is required"}` — proving the route is deployed and live,
   without reaching the key check.) To close: Vercel dashboard → Project → Settings → Environment
   Variables, or `vercel env ls` from Tom's Mac.
2. **`CRON_SECRET` and the KV variables are likewise unverifiable** without dashboard access. Same
   fix: `vercel env ls`, or read the dashboard.
3. **Whether a custom domain is already attached** to the Vercel project cannot be seen from here
   (aliases enumerate only via `vercel ls` / the dashboard). All three candidate domains failed to
   respond to HTTPS, consistent with none being registered or attached.

---

## Part 5 — The shortest honest path to live-on-a-domain

### (a) Site simply live on a domain — **an afternoon at most, most of it already done**

The site is already built, deployed, and green on `tomcassidy-site.vercel.app` at main's head. The
remaining work is:

1. Tom picks the domain. **His call, and only his.** (5 minutes.)
2. Register it. (10 minutes.)
3. Vercel dashboard → Project → Domains → add it; set the two DNS records Vercel prints; wait for
   the certificate. (15 minutes + propagation.)

**The choice of `.ai` vs `.coach` vs `.me` changes nothing technical whatsoever.** Vercel treats all
three identically; the certificate, the build, the routing, the crons and the PWA are unaffected. It
is purely a register/identity call. Probed 2026-08-04: `.ai`, `.coach` and `.me` gave no HTTPS
response (consistent with available); `.com` answered 200 (taken, as known).

### (b) 13×4 genuinely usable by someone who lands on it — **the real work, and it is authoring**

This is where the honest answer is unwelcome. **The engineering is done; the content is roughly a
third finished, and the programme Tom named is the thinnest of the substantial ones.**

1. **Voice pass on the Ultimate 13×4's 13 wisdom lines.** They are self-declared drafts. Only Tom
   can do this. *Half a day of his time.* — the single highest-leverage thing on this list.
2. **Tone banks for the Ultimate 13×4** — 13 focuses × 4 tones × ~4 lines ≈ 200 lines. Draftable
   against the eating banks as the template, then Tom edits. *A worker day to draft, a few hours of
   Tom to finesse.*
3. **Generalise the Today surface past Reasonable Eating** — `/[slug]/today`, and fix the
   `totalWeeks` bug in `today.ts` while doing it. *Half a day of engineering.*
4. **A start-the-programme affordance.** Right now the start date is a constant in `today.ts` plus
   whatever the wheel keeps locally; a visitor has no "begin" button. *A day.*
5. Optional depth, not blocking: FAST teachings and sub-diagrams for the Ultimate 13×4; finishing
   the 26 draft story beats in agile-results and 15 in conquering-life.

### (c) "Tom in your pocket" firing on his phone — **half a day, and it is nearly all config**

1. `npx web-push generate-vapid-keys`; set both keys + `VAPID_SUBJECT` + a random `CRON_SECRET` in
   Vercel Production. *15 minutes.* This alone flips `/api/push/vapid` from 503 to live.
2. Choose persistence: provision Vercel KV (recommended — subscribing from the phone writes
   straight through) or take the paste path. *15 minutes.*
3. Open the programme page on a real iPhone (16.4+), Add to Home Screen — **iOS only grants web push
   to an installed PWA** — grant notifications, press subscribe. *10 minutes.*
4. Verify a real nudge lands. The crons fire three times daily, so worst case is a few hours' wait;
   otherwise hit the cron route once with the Bearer secret. *Tom's call — it is his device and his
   deployment.*
5. Note the scoping: the manifest installs as **"Eating"**, not as Tom's flagship. If the pocket app
   is to be the Ultimate 13×4 or a multi-programme shell, the manifest, the SW scope and the cron's
   hard-coded `PROGRAM` all need rescoping. *A day.*

### The one-line summary

**The site could be on a chosen domain this afternoon, and the push loop could be firing the same
day — but the Ultimate 13×4 behind it is a wheel with thirteen unedited draft lines, and only
Reasonable Eating is finished enough to actually coach anybody.** The domain is not the blocker.
The writing is.

---

## Recommended follow-up commissions (not done here — this was a scout)

| Commission | Size |
|---|---|
| Draft the Ultimate 13×4 tone banks against the eating template, for Tom to edit | ~1 worker day |
| Generalise `/[slug]/today` + fix `today.ts` `totalWeeks` | ~half a day |
| Rescope the PWA manifest / SW / cron off the Reasonable-Eating hard-coding | ~1 day |
| Finish the `draft: true` story beats in agile-results (26) and conquering-life (15) | Tom's voice — his |

## Needs Tom

- **The domain choice.** His and only his. Nothing technical rides on which of the three.
- **The voice pass on the Ultimate 13×4 wisdom lines.** Nobody else can write these.
- Whether the pocket app should stay Reasonable Eating or become the Ultimate 13×4 / a shell.

## Branch landing state

Two branches exist. `git cherry main origin/13-engine-preview` returns **nothing**, and the diff
from main to the preview branch is **571 deletions across 3 files, 0 additions**. The preview branch
is strictly BEHIND main and carries no unlanded content — it is merged residue, safe to delete.
