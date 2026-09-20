# CLAUDE.md — tomcassidy-site

Tom Cassidy's personal hub (tomcassidy.co). Astro 6 in **server** mode on Vercel,
with a Svelte island for the programme wheel, an Anthropic-backed reading guide
("Alexander"), and a web-push "pocket coach" backed by Supabase.

`README.md` describes the site's structure, the `essays` content collection, the
design tokens and the proposal microsites, and it is accurate on those. This file
covers what it does not: the live state of the billed guide, the guide's tool loop
and model ladder, the pocket coach, and how to run and test the thing.

Sibling repos, referenced throughout the source: `~/distinction-physics` and
`~/configuration-economics`. Alexander, `guide-tools.ts` and the same-origin guard
are **ports** — the reference implementation is distinction-physics, and the house
rule written into the comments is: change the shape there first, then port here.

---

## Commands

Everything is in `package.json`; there is no scripts directory.

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Local dev server (`astro dev`)                |
| `npm run build`     | Production build                              |
| `npm run preview`   | Preview the build                             |
| `npm run check`     | `astro check` — types across `.astro` too     |
| `npm run typecheck` | `tsc --noEmit`                                |
| `npm test`          | `vitest run` — the unit tests, one pass       |

Tests are `src/lib/*.test.ts` (currently the guide prompt, the guide request/ladder,
the push store and the coach run). They are pure-function tests: no API key, no
network, no database. `vitest.config.ts` exists only to teach vitest the `@/ → src/`
alias that `tsconfig.json` declares.

This repo is not a pnpm workspace and has no monorepo. In a `cs` worktree
`node_modules` is a symlink to the shared checkout's — do not `npm install` inside
a worktree.

## Deploy

Vercel, `@astrojs/vercel`, `output: 'server'` — most pages are prerendered, and
anything with `export const prerender = false` (the API routes,
`/reasonable-eating/today`) runs as a function. Production is `main`.

`vercel.json` schedules three daily cron hits on `/api/cron/coach` (07:47, 12:13,
18:09 UTC — jittered on purpose), and carries a build-skip rule that limits preview
builds to a named set of branches. Push an arbitrary feature branch and Vercel may
skip the build; that is deliberate, not a fault. Treat that rule as estate policy —
do not edit it to get a preview.

`astro.config.mjs` injects `__BUILD_NUMBER__` (UTC stamp + short git hash) via
`vite.define`, read through `src/lib/version.ts`. It also holds the one redirect:
`/exceptional-teaching → /reasonable-teaching`.

---

## The guide (Alexander) — LIVE AND BILLED

**Every request to `/api/guide` costs real money.** Do not load-test it, do not
loop over it, do not "just check it works" against production.

State of play, and be precise about what is and is not verified:

- `docs/DECISIONS.md`, 2026-08-24, records the guide as **enabled in production**:
  `ANTHROPIC_API_KEY` set on the `tomcassidy-site` Vercel project across
  production, preview and development, sharing the key that powers Alexander on
  zenjin.app and dp.tomcassidy.co.
- `README.md` and `.env.example` carried the older "wired but not enabled — do not
  wire a real key" warning. That warning **predates the ruling and is superseded by
  it**. Both were rewritten on 2026-09-20 to say so.
- **Settled live, once, on 2026-09-20:** nothing in the source can prove what is
  set in Vercel's environment, so the question was closed with the one probe that
  can close it — a single `POST /api/guide`, which returned 200 with a real
  Anthropic answer and non-zero usage. The key is SET and the guide is live. That
  call is spent; do not spend another to re-confirm it. See `docs/DECISIONS.md`,
  2026-09-20.
- What *is* verified live (free GETs, 2026-09-20): `https://tomcassidy.co/` serves
  200; `/api/push/vapid` returns a public key, so the VAPID vars are set in
  production; `/api/cron/coach` returns 401 unauthenticated, so `CRON_SECRET` is
  set too.

With no key the endpoint returns 503 and `GuidePanel.astro` shows "The guide is not
enabled yet on this site." That is a missing-config state, not a resting state.

### Where the guide lives

| File | Job |
| ---- | --- |
| `src/pages/api/guide.ts` | The endpoint: guards, tool loop, the Anthropic call |
| `src/lib/guide-request.ts` | `MODEL`, `selectTier()`, `buildSystemBlocks()`, `buildUserTurn()` — pure, unit-tested |
| `src/lib/guide-tools.ts` | `read_section` tool, the generated catalogue, the bounds |
| `src/lib/guide-prompt.ts` | Alexander's persona + epistemic contract + the Script |
| `src/lib/the-script.md` | Tom's canonical coaching voice, imported `?raw` |
| `src/lib/essay-context.ts` | Live essay text + `STANDALONE_PAGES` registry |
| `src/lib/math.ts` | Server-side KaTeX render of maths in replies |
| `src/components/GuidePanel.astro` | The reading companion UI; mounted only by `EssayLayout.astro` |

### The model tier ladder

Undocumented anywhere before this file. Read `guide-request.ts` for the detail; the
shape:

- **One model, `claude-sonnet-5`, at every rung.** Caches are model-scoped, so a
  model switch would void the whole cached prefix; `effort` is not part of the
  prefix at all. The ladder is therefore built from effort, not models. Opus is not
  reachable from this endpoint at all.
- Rungs: `low` (base, 2048 max tokens) → `high` (8192) → `xhigh` (12288).
- **Server-side only.** The caller never names a model or a tier; a body carrying
  `model` or `tier` is refused with a 400 rather than silently ignored. The only
  thing taken from the client is `escalate: true` (the "Deeper" button), on strict
  equality.
- Auto-escalation: the server infers a dearer rung from the reader's own words —
  a cross-section comparison (two slugs/§refs, or a comparison verb about a named
  target) → `high`; repeated confusion, corroborated by history → `high`. Explicit
  Deeper → `xhigh`.
- Escalation is a property of *this turn*, never a latch on the session.
- Tier-specific instructions (`DEPTH_PASS`, `COMPARISON_PASS`) ride the **user
  turn**, deliberately — anything appended to the system prompt would throw the
  cache away at the exact moment the request got expensive.

### Prompt caching layout

`tools` → `system[0]` (global: persona, contract, generated catalogue — identical
for every reader, breakpoint here) → `system[1]` (the page the reader has open,
breakpoint here) → `messages` (history, question, tool results — never cached).
Both breakpoints are 5-minute ephemeral. A section under the ~1024-token minimum
simply will not cache, silently — do not report a saving that did not happen. The
endpoint logs `[guide] model=… cache_read=…`; if `cache_read` stays at zero across
identical-prefix requests, something has crept into the prefix.

### The tool loop

Alexander carries the **catalogue** of Tom's writing in the prompt and reads the
**text** on demand, so publishing an essay and updating the guide are the same act.

- One tool, `read_section`, taking a slug — never a URL or a path. The registry
  (published essays from the collection + `STANDALONE_PAGES`) **is** the allowlist;
  drafts are excluded. Resolution is in-process, no network hop.
- An unknown slug returns the catalogue rather than an error, so the model recovers
  by looking again.
- Bounded twice: `MAX_TOOL_ROUNDS` rounds and `MAX_TOOL_CHARS_TOTAL` characters of
  fetched text per user message (current values in `guide-tools.ts` — read them
  there rather than trusting a number quoted here). When either bound is hit the
  final call goes out with `tool_choice: {type:'none'}` rather than with the
  `tools` array dropped, because `tools` render at position 0 of the cached prefix.
- Tool rounds sit inside one already-rate-limited request. A question that makes
  Alexander read costs more than one that does not.
- The response returns `reads` (which slugs he actually opened), `tier`,
  `tierReason` and a `usage` total accumulated across all rounds — that is how you
  tell "he read it" from "he talked about it" without spending again.

### Guards, and the bug that bit before

- **Same-origin:** `allowedHosts()` reads `x-forwarded-host` / `host`, **not**
  `new URL(request.url).host` — behind Vercel's proxy the latter is the internal
  invocation host, so comparing against it 403s every real browser fetch while
  `curl` (no `Origin`) sails through. That is the failure mode to remember: the
  probe that says "it works" is exactly the probe the bug cannot fail. Missing
  `Origin` is allowed through to the other defences.
- Rate limits are per-IP sliding windows in a module-level `Map` (per serverless
  instance): one budget for chat, a tighter **sub-limit** for deep answers. Every
  deep answer spends from both. When the deep budget is gone, an *explicit* Deeper
  429s; an *inferred* escalation quietly declines to base.
- 50 kB body cap, 4000-char message cap, 20-turn history cap.

---

## The pocket coach ("Tom in your pocket")

The newest subsystem, September 2026, and barely mentioned in the README. Web push
that sends one line a day from the programme the person is on — "return, not nag":
no streaks, no "did you do it?".

- `supabase/migrations/20260901_coach_subscribers.sql` — two tables,
  `coach_subscribers` (one row per device) and `coach_goals` (one row per person
  per week). Additive and idempotent; it touches nothing else in the database,
  which is shared with the SSi learning app, Popty and Cowch. **RLS on with no
  policies**: the rows are reachable only with the service-role key, because a push
  endpoint plus its keys *is* a credential. Apply migrations by hand in Supabase —
  nothing in this repo applies them.
- `src/lib/push-store.ts` — the store, over PostgREST on plain `fetch`, no SDK.
  Identity is `sha-256(endpoint)`: no accounts, nobody signs up. Reads are
  `import.meta.env.X ?? process.env.X` on purpose, because Astro may inline
  `import.meta.env` at build time and a credential set in Vercel would otherwise do
  nothing until the next deploy. If Supabase is unconfigured every accessor throws
  and the endpoints return an honest 503 — never a success shape.
- `src/lib/coach-engine.ts` — pure week arithmetic, mirroring exactly what
  `ProgramWheel.svelte` computes, so the wheel and the push can never disagree
  about which focus it is. `weekIndex()` is the absolute ordinal (the goal key);
  `currentWeekNumber()` laps the rotation.
- `src/lib/coach-run.ts` — who gets what, and what happens when a device is gone
  (404/410 = revoke). Pure, so the loop is testable without sending anything.
- `src/pages/api/push/subscribe.ts` (register a device), `push/vapid.ts` (hands the
  browser the public key), `push/goal.ts` (set → bless, two deliberately separate
  writes: nothing unblessed is ever pushed, and `bless` carries no text so what is
  confirmed and what is pushed cannot diverge).
- `src/pages/api/cron/coach.ts` — the delivery loop, Bearer-authed against
  `CRON_SECRET`, hit by the three Vercel crons.
- `src/pages/reasonable-eating/today.astro` — the practice screen and the page a
  push opens; SSR so it never shows a stale week. The goal box loads client-side,
  because whose goal it is depends on which device is asking.
- `public/sw.js` — service worker scoped to `/reasonable-eating` only,
  stale-while-revalidate, never intercepts `/api/*`.

**Live migration shim, still present:** `src/lib/coach-migrate.ts` lifts the
solo-dogfood `PUSH_SUBSCRIPTION` env var into `coach_subscribers` on the cron's
first run. The code and `.env.example` both say to delete it, and the three
`PUSH_SUBSCRIPTION` / `PROGRAM_START_DATE` / `WEEKLY_GOAL` vars with it, once the
row is confirmed. **Whether that row is confirmed is not knowable from this repo** —
check Supabase before deleting anything.

Env vars the coach needs, all in `.env.example`: `VAPID_PUBLIC_KEY`,
`VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `CRON_SECRET`, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`. Plus `ANTHROPIC_API_KEY` for the guide.

---

## The rest of the shape

- **Essays** — `src/content/essays/*.md`, schema in `src/content.config.ts`. Slug
  is authored, not derived from the filename. `draft: true` hides a piece from the
  site, the search index **and** the guide's registry. Get the current list with
  `ls src/content/essays` — don't trust a count in prose.
- **Standalone prose pages** — a page that deliberately sits outside the collection
  (`/community-regeneration` is the specimen) registers in `STANDALONE_PAGES` in
  `essay-context.ts`. That one registry feeds the guide's read registry *and* the
  /writing search; there is no second copy.
- **Search** — metadata blobs inline as `data-search`; bodies ship as a prerendered
  `/writing-index.json` (`src/pages/writing-index.json.ts` + `src/lib/search-index.ts`)
  fetched once by the client. Plain lowercased substring, no stemming. See the
  2026-08-25 entry in `docs/DECISIONS.md` for why, and for what would falsify it.
- **Programmes** — one typed `Program` object per programme in
  `src/lib/programs/*.ts`, all listed in `index.ts`; the same object is the wheel
  diagram, the curriculum and the coach script. `src/kit/` is the future
  `@reasonable/kit`, extracted in place: it imports only from inside itself, so the
  package boundary is already real. It reads design tokens by name, never by hex.
  See `src/kit/README.md`.
- **Proposals** — `/proposals/<slug>`, unlisted and noindexed. Data, not markup:
  add a file under `src/lib/proposals/`, list it in `index.ts`. See the README.
- **Design tokens** — `src/styles/tokens.css` is the single source of truth.
- **Docs** — `docs/DECISIONS.md` is the decision journal (newest first: what was
  decided, why, and what would falsify it); add an entry for any non-trivial call.
  `docs/REASON-ABILITY-CANON.md` and `docs/SCRIPT-CANON.md` are large source
  material, not engineering docs. `prototypes/` is exactly that — prototypes and
  design notes, not shipped code.

## Working here

- British English throughout, in prose and in the site's own copy.
- Tom's authored prose (essays, the Script, programme wisdom, proposals) is his.
  Proof-read it; do not edit it.
- Never spend against the Anthropic key to satisfy curiosity. `npm run build`,
  `npm run check`, `npm run typecheck` and `npm test` verify everything about the
  guide except that the remote model replies.
- When a document and the code disagree, the code wins and the document gets
  fixed in the same commit.
