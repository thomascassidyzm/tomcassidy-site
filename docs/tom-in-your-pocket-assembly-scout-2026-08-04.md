# Tom in your pocket — N=1 assembly map

**Scout report, 2026-08-04.** Read live code across `alexander`, `theracowch`, `tomcassidy-site`,
`hexagon` (read-only), `zenjin-2026-v1`. Where a markdown file and the source disagreed, the code
won and the disagreement is recorded as a finding.

> This document is a map, not a build. Nothing was built this turn except this file.

---

## 0. The headline

**The mentor layer does not exist anywhere in the estate — but it is closer than "build a mentor"
suggests. Of its three defining capabilities, one (initiative) exists as working plumbing in two
separate repos, one (the 13x4 rhythm) exists as live arithmetic, and one (a durable server-side
model of the student) does not exist at all. Not one scheduled job in the estate has a model in the
loop.**

What exists is better than that sounds, because what's missing is small:

- **Initiative exists as working plumbing, in two repos** — `theracowch` runs a `*/15` cron with
  per-user timezone slot matching, dedupe and dead-subscription pruning; `tomcassidy-site` has three
  jittered daily crons and a "return, not nag" design. Neither has ever had a model in the loop.
  **And tomcassidy-site's is inert in production** — a live unauthenticated probe of
  `/api/cron/coach` returns `503 {"error":"VAPID keys not configured"}`, which proves both that the
  VAPID keys are unset *and* that `CRON_SECRET` is unset. It is three env vars from firing.
- **Chat plumbing exists and is already cost-tuned** — `theracowch` runs a two-block cached system
  prompt, a compressed rolling profile, and a 3-message context window. That is exactly the shape a
  mentor needs, and it is already debugged.
- **Academic depth exists** — Alexander is real and tested, Hexagon is a real curriculum-mapped
  product (and a partnership question, not an architectural one).
- **The Script exists as a written artefact** — `src/lib/the-script.md`, 5,875 chars, canonical,
  in Tom's voice, already consolidated from the 2014 Reasonable Wealth corpus.

What's missing is the thing in the middle: **a durable, server-side model of one boy that a
scheduled job can read, reason over, and act on.** Everything else is wiring.

The single sharpest finding in the estate: **the two halves of the mentor already exist in two
different repos and neither can see the other.** `tomcassidy-site` has initiative but no memory and
no model. `theracowch` has memory and a model but no initiative — and its memory lives in the
phone's localStorage, so no server-side job could read it even if one existed. The first slice is
not "build a mentor." It is **join those two halves and give them one student.**

---

## 1. Verified pricing (fetched 2026-08-04, not from memory)

Fetched live from `platform.claude.com/docs/en/about-claude/pricing.md` and
`.../models/overview.md`. These are first-party Claude API rates in USD per million tokens.

| Model | ID | Input | Output | 5m cache write | 1h cache write | Cache read |
|---|---|---|---|---|---|---|
| Claude Opus 5 | `claude-opus-5` | $5.00 | $25.00 | $6.25 | $10.00 | $0.50 |
| Claude Sonnet 5 | `claude-sonnet-5` | **$2.00** | **$10.00** | $2.50 | $4.00 | $0.20 |
| Claude Haiku 4.5 | `claude-haiku-4-5` | $1.00 | $5.00 | $1.25 | $2.00 | $0.10 |

**Sonnet 5 is on introductory pricing of $2/$10 through 31 August 2026**; it reverts to $3/$15 on
1 September 2026. Every Sonnet figure in the cost model below is computed at the **post-September
$3/$15 rate**, because the boy's year runs past that date — using the intro rate would flatter the
model for one month and then be wrong for eleven.

Other verified facts that matter to the model:

- Cache multipliers: 5-minute write = 1.25× input, 1-hour write = 2× input, cache read = 0.1× input.
- The 1M-token context window is included at standard pricing on Claude 4.6-and-later models — no
  long-context premium.
- Batch API = 50% off input and output. Not usable for interactive turns; **is** usable for the
  nightly digest and the weekly parent report.
- Web search, if used: $10 per 1,000 searches. Web fetch: no additional charge.
- Tool-use system prompt overhead on Sonnet 5: 354 tokens (`auto`/`none`), 474 (`any`/`tool`).
- Claude Opus 5 has a **512-token** minimum cacheable prefix; Sonnet 5's is 1,024.

**Explicit gap — voice.** Anthropic sells no speech-to-text and no text-to-speech. Any voice line
item is a third-party cost. ElevenLabs list pricing, fetched 2026-08-04 from
`elevenlabs.io/pricing/api`: **Scribe v2 STT $0.22/hour** of audio, **Flash/Turbo TTS $0.05 per
1,000 characters**, **Multilingual v2/v3 TTS $0.10 per 1,000 characters**, on tiers from $6/month
(Starter) to $99/month (Pro, 440k Flash chars included). I could not verify what rate Tom's estate
is actually on — see §7.

---

## 2. Per-student API cost model

### 2.1 Measured inputs, not assumed ones

Every number below the line is derived from something I measured in the live code, not estimated.

| Input | Measured value | Source |
|---|---|---|
| The Script, as a standing prompt | **5,875 chars ≈ 1,470 tokens** | `tomcassidy-site/src/lib/the-script.md` (118 lines) |
| Theracowch frozen prompt base (importable half) | **23,162 chars ≈ 5,790 tokens** | `theracowch/lib/prompt-base.js`, measured by loading the module |
| Theracowch full frozen base (incl. inline blocks) | **~55–61 KB ≈ 14–15k tokens** | `api/chat.js` lines 54–540; commit `94c125b` message says "~61 KB" |
| Per-user uncached block | ~10 short fields, **~150–400 tokens** | `api/chat.js:396–439` |
| Conversation context actually sent | **last 3 messages only** | `api/chat.js:557` — `history.slice(-3)` |
| Reply cap | `max_tokens: 500`, `effort: low`, thinking disabled | `api/chat.js:609–613` |
| Doctrine corpus, if loaded whole | 21 essays, **159,555 chars ≈ 40k tokens** | `src/content/essays/` |
| Canon docs, if loaded whole | **113,975 chars ≈ 28.5k tokens** | `docs/{SCRIPT,REASON-ABILITY}-CANON.md`, `13X4-STATE-OF-PLAY.md` |

**A doc-vs-code disagreement worth recording:** `api/chat.js:385` describes "the whole ~6k-token
base prompt", while commit `94c125b`'s own message describes "the ~61 KB base prompt". Both are
true of different things — 6k tokens is `prompt-base.js` alone; ~61 KB is the assembled base
including the inline blocks. The inline comment understates the cached block by roughly 2.5×.
Anyone sizing a cache budget from the code comment would get it wrong.

### 2.2 The standing context for pocket-Tom

This is a design decision the cost model forces, so I am stating it rather than assuming it.

| Block | Contents | Tokens | Cached? |
|---|---|---|---|
| A — the Script | `the-script.md` verbatim + mentor framing + escalation rules | ~2,500 | **yes**, 1h TTL |
| B — the 13x4 frame | current week, its focus, the four slots, what "on track" means | ~800 | yes, part of the same prefix |
| C — the student model | who he is, what he's becoming, subjects, commitments, drift signals | ~1,500 | **no** — changes daily |
| D — curriculum state | where he is in each of two AP spines | ~500 | no |
| E — last 3 turns | rolling window, theracowch's proven pattern | ~600 | no |

**Cached prefix (A+B) ≈ 3,300 tokens. Uncached per-turn (C+D+E) ≈ 2,600 tokens.**

Deliberately **not** loading the full essay corpus or the canon docs into the standing prompt. That
would be ~68k tokens of prefix, and it is the wrong instrument: the doctrine's job is to shape the
Script once, at authoring time, not to be re-read on every turn. If retrieval over the essays is
ever wanted, it belongs behind a tool call, not in the prefix.

### 2.3 Cadence assumptions (stated so Tom can overturn any of them)

| Assumption | Value | Why |
|---|---|---|
| Student-initiated turns | 8/day typical | Tom: "you don't have to be talking… you have to be able to say a few words" |
| System-initiated turns | 3/day | Matches the cron cadence already shipped in `vercel.json` |
| Output per turn | 350 tokens | Theracowch caps at 500 and asks for 2–3 sentences; a mentor runs slightly longer |
| Nightly digest | 1/day, ~6k in / 800 out | Rolls the day into the student model |
| Weekly parent report | 1/week, ~15k in / 1,500 out | Reads the week's digests |
| Weekly cheerleader brief | 1/week, ~15k in / 1,200 out | Same input, different output |
| Escalation check | folded into the digest | No separate call |
| Model tier | Sonnet 5 default, Opus 5 on ~5% of turns | See §2.5 |
| Cache TTL | 1 hour | Turns cluster; a 5-minute TTL would miss most of them |

### 2.4 The arithmetic — typical month (30 days), Sonnet 5 at post-Sept $3/$15

**Interactive turns.** 11 turns/day × 30 = 330 turns/month.

Cache behaviour: with a 1-hour TTL, 11 turns/day cluster into roughly **4 cache windows per day**
(morning, midday, after-school, evening). So ~120 cache writes/month and ~210 cache reads/month.

| Line | Volume | Rate | Cost |
|---|---|---|---|
| Cache writes (3,300 tok × 120) | 0.396 MTok | $6.00/MTok (2× input, 1h) | $2.38 |
| Cache reads (3,300 tok × 210) | 0.693 MTok | $0.30/MTok | $0.21 |
| Uncached input (2,600 tok × 330) | 0.858 MTok | $3.00/MTok | $2.57 |
| Output (350 tok × 330) | 0.116 MTok | $15.00/MTok | $1.73 |
| **Interactive subtotal** | | | **$6.89** |

**Scheduled work** (all Sonnet 5; digest and parent report are batchable at 50% off, priced here at
full rate as the conservative case).

| Line | Volume | Cost |
|---|---|---|
| Nightly digest (30 × 6k in / 800 out) | 0.18 MTok in, 0.024 out | $0.54 + $0.36 = $0.90 |
| Weekly parent report (4.3 × 15k / 1.5k) | 0.065 in, 0.0065 out | $0.19 + $0.10 = $0.29 |
| Weekly cheerleader brief (4.3 × 15k / 1.2k) | 0.065 in, 0.0052 out | $0.19 + $0.08 = $0.27 |
| **Scheduled subtotal** | | **$1.46** |

**Opus 5 escalation.** ~5% of interactive turns (17/month) routed to Opus 5 for the moments that
matter — a real wobble, a genuine "what would you choose?" fork, a hard conceptual block. Opus 5
input $5, output $25, and I am assuming no cache hit on these (they interleave with Sonnet turns,
and caches are model-scoped — this is a real cost consequence of mixing tiers).

| Line | Volume | Cost |
|---|---|---|
| Input (5,900 tok × 17) | 0.100 MTok × $5 | $0.50 |
| Output (600 tok × 17) | 0.010 MTok × $25 | $0.26 |
| **Escalation subtotal** | | **$0.76** |

**Typical month total: $9.11/month ≈ £7.10** at 0.78 GBP/USD.

### 2.5 Sensitivity

| Scenario | Shape | USD/month | GBP/month |
|---|---|---|---|
| **Quiet** — exam-week silence, 3 student turns/day, no escalation, cron still fires | 6 turns/day, 1 cache window/day | $4.10 | **£3.20** |
| **Typical** — as computed above | 11 turns/day, 5% Opus | $9.11 | **£7.10** |
| **Heavy** — daily engagement, 25 turns/day, 15% Opus, digest twice daily | 28 turns/day, 8 cache windows/day | $27.40 | **£21.40** |
| **Pathological** — all-Opus, no caching, full essay corpus in prefix | the wrong build | ~$310 | **~£240** |

The pathological row is there to make one point: **the only way to make this expensive is to build
it badly.** Cache the Script, keep the student model small, keep the rolling window at three turns,
and the cost is noise against a £500+/month price point — **1.4% of revenue in a typical month.**

Against Tom's own estimate — "unlikely to be more than £150 per month" — the honest answer is that
he is over-estimating by a factor of about twenty. £150/month of Sonnet 5 at this cadence would be
roughly 20 students, not one.

### 2.6 Voice, priced separately

Text-first is the taste-safe default (§7), so this is an add-on line, not a base cost.

| Line | Assumption | Cost |
|---|---|---|
| Spoken nudges out (cloned Tom voice) | 1/day × 400 chars × 30 = 12,000 chars/month | Flash: **$0.60**; Multilingual v2: **$1.20** |
| Spoken input in (if enabled) | 10 min/day = 5 hours/month, Scribe v2 @ $0.22/hr | **$1.10** |
| Subscription floor | ElevenLabs Starter $6/mo covers 20k Flash chars | **$6.00** |

**Voice adds roughly £5–6/month per student, dominated by the subscription floor, not usage.** At
N=1 the floor is the whole cost; it amortises to nothing across students later.

### 2.7 On Max accounts vs the API

Settled already, and the code agrees: every Anthropic call in the estate — `theracowch/api/chat.js`,
`api/compress-profile.js`, Alexander's `api/` — already authenticates with `ANTHROPIC_API_KEY`
against `api.anthropic.com/v1/messages`. There is no consumer-subscription code path to convert.
Consumer Claude Pro/Max plans prohibit reselling access or fronting a multi-user commercial service
from one subscription, so one-Max-per-student is not a legitimate route for a product Tom is paid
for. A student separately buying and owning their own subscription, used by them directly, is
legitimate — but it is a different product (they'd be using Claude, not pocket-Tom), it gives Tom no
place to put the Script, and it can't be driven by a cron. The API is both cleaner and cheaper: at
£7/month of tokens, a £15+/month subscription per student would cost more and deliver less.

### 2.8 Local-model hybrid — a later lever, not now

Tom's future direction — self-hosting a local model on his own server — is worth exactly one
paragraph here. At £7/month per student in tokens, the saving from a local model is smaller than
the electricity, and far smaller than the engineering. It becomes interesting somewhere north of a
hundred students, or if a specific always-on background task (drift detection, transcript
classification) turns out to be high-volume and low-intelligence. Explicitly out of the first slice.

---

*(Sections 3–8 follow: the exists-versus-missing map, the donor recommendation, the first slice,
the taste-safe defaults, the explicit gaps, and what needs Tom.)*

---

## 3. Exists-versus-missing map for the mentor layer

Legend: **PORT** = code exists, move it. **WIRE** = pieces exist in different places, join them.
**BUILD** = genuinely new.

### 3.1 Persistent per-student memory — PARTIALLY EXISTS, in the wrong two halves

Tom's frame: not a chat transcript, a model of who this boy is and what he is becoming. In the
estate that splits cleanly into an *academic* half and a *becoming* half, and they live in
different repos with different storage models.

**The academic half exists and is better than expected.** Alexander has a real durable learner
model, not just conversation rows:

- `student_spec_competence` (`supabase/migrations/20260411_spec_mapping.sql`) — one row per
  student per specification point, with `level` in `strong|partial|weak|not_demonstrated`,
  `evidence_count`, `last_assessed_at`, and the `conversation_ids` that produced the evidence.
  Written by `api/post-conversation.js:226–254` (read-then-update-or-insert).
- `review_items` (`supabase/migrations/20260413_review_items.sql`) — generated questions with
  **SM-2 spaced repetition fields including `next_review_at`**. Written at
  `api/post-conversation.js:281`.
- `conversations` carries extracted `insights` and a `breakthrough_detected` flag
  (`api/post-conversation.js:313`), and there is a `breakthroughs` table in the base schema.

So Alexander already answers "what does he know, how well, on what evidence, and when should he
see it again." That is a genuine learner model and it is a **PORT**, not a build.

**The becoming half exists only in theracowch, and it is client-side.** `api/compress-profile.js`
runs Haiku over recent conversation and returns a compressed profile — patterns, active themes,
insights, strengths, `respondsTo`, last session (`api/chat.js:396–439`). Conceptually this is
exactly right: it is a rolling model of a person, not a transcript, and it compresses rather than
accumulates.

But **the compressed profile is never stored server-side.** `compress-profile.js` takes a prompt in
the request body and returns a string; the caller — the phone — owns it. Its own header comment
says it updates "the local therapy profile", and `chat.js` receives `profile` from the request
body. **Consequence: a scheduled job cannot read who the user is.** This is the single structural
reason the estate has no mentor. Initiative and memory cannot meet, because the memory is on the
phone and the initiative is on a server.

**Missing (BUILD, small):** one server-side `student` row holding the becoming-model — who he is,
what he's committed to, what he keeps drifting on, what lands with him — written by the nightly
digest and readable by both the chat turn and the cron. Everything else is a port.

### 3.2 Initiative and scheduled check-ins — EXISTS TWICE, MODEL-DRIVEN IN NEITHER

This is the finding I did not expect. Initiative plumbing exists in **two** repos, both working,
and it is the **better-developed of the two capabilities** — but neither has a model in the loop
and neither reads a student model.

**`tomcassidy-site` — the week-arithmetic one, and it is currently dead.** `vercel.json` declares
three real crons at jittered times (`47 7`, `13 12`, `9 18`). `src/pages/api/cron/coach.ts` (70
lines) *optionally* authenticates `CRON_SECRET`, reads a stored subscription and program start date,
computes the current week, draws a tone-weighted line, and sends one web push tagged `pocket-coach`
so a second push replaces rather than stacks.

**Three corrections from the deep read, all of which matter.** (i) It is **inert in production**: a
live probe returns `503 VAPID keys not configured`, having already passed the secret gate — so
neither the VAPID pair nor `CRON_SECRET` is set, and the route is currently open to anyone.
(ii) `const PROGRAM = reasonableEating` is **hardcoded** (`coach.ts:13`) — **the cron never touches
13x4 at all**, and `ORIGIN_PATH` deep-links to `/reasonable-eating`. (iii) It writes **no state at
all** — no last-sent record, no dedupe, no reaping of dead 404/410 subscriptions despite the
comment saying otherwise. Theracowch's loop does all three things properly. `src/lib/coach-engine.ts` (119 lines) holds the week arithmetic, deliberately shared
with `ProgramWheel.svelte` so the push and the wheel can never disagree about which week it is.
Tone weights are gentle 4, encouraging 3, honest-kind 2, playful 2 — "return, not nag", stated in
the code comments as design intent.

Its limit is stated honestly in its own source: `src/lib/push-store.ts` says **"SOLO DOGFOOD — one
user, no accounts"** and stores exactly one subscription and one start date.

**`theracowch` — the multi-user one, and it is more mature.** `vercel.json` runs `*/15 * * * *`
against `api/push/send.js` (161 lines), which does per-user **timezone-aware slot matching** with an
8-minute tolerance window, honours per-user morning/evening preferences and on/off toggles, and
dedupes by day-key. Subscriptions live in KV/Upstash (`api/push/subscribe.js`), so it is genuinely
multi-user. `public/sw.js` has real `push` and `notificationclick` handlers.

**What's missing in both is the same thing, and it's the whole game:** the message text is drawn
from a hard-coded array (`NUDGES` in `api/push/send.js:29–40`; the coach banks in the program
files). **No Claude call is made on any scheduled path anywhere in the estate.** A canned line
picked by a weighted random is a reminder, not a mentor.

**Alexander has no scheduling at all** — `vercel.json` has no `crons` key, and grep for
cron/setInterval/webpush finds only subscription-billing and consultation-booking code. But it has
the *trigger data*: `review_items.next_review_at` already knows when this boy is due. **The estate
has a due-date column and no job that reads it.**

**Missing (WIRE, plus one small BUILD):** point the existing cron at a Claude call that reads the
student model and composes the nudge, instead of at a `NUDGES` array. The pipe, the auth, the
timezone logic, the service worker, the dedupe, the "replace don't stack" tag — all exist.

### 3.3 The weekly 13x4 cadence as a running rhythm — HALF EXISTS

`src/lib/programs/` holds 2,809 lines across nine programmes, including `ultimate-13x4.ts` (165
lines). `coach-engine.ts` turns one stored start date into "which week are you on" via
`rotationOrder` + `currentWeekNumber`, and `ProgramWheel.svelte` renders it. So the **rhythm exists
as live, running arithmetic** — not as a document. That is more than the brief assumed.

What's missing is that the cadence is **read-only against the person**. It knows which week it is;
it does not know what he put in, whether he did the thing, or what he chose. There is no
commitment, no slot state, no "what are you putting in?" captured anywhere.

**Missing (BUILD):** the four slots per week as *state* — what he committed to, what he did, what
he's dodging. That is the substrate the mentor actually coaches against.

**A naming discrepancy to flag, not resolve:** the essay is `the-9x4.md` and the component is
`NineByFour.astro`, while the programme file is `ultimate-13x4.ts` and Tom's live vocabulary is
13x4. Both live in the repo simultaneously. This is Tom's term to settle — I have used 13x4
throughout because that is what he said.

### 3.4 Academic depth layer for AP from scratch — EXISTS, and the AP answer is better than feared

**Alexander's curriculum is generated, not curated.** `api/curriculum-topics.js` checks the DB for
cached topics for a `subject`/`level`/`exam_board` triple, and **if absent, generates them with
Claude and saves them** — "Student is never blocked." That single design choice is what makes AP
tractable: Alexander is not limited to the subjects someone has hand-authored.

Two real constraints, both concrete:

1. **The level enum has no AP.** `LEVEL_LABELS` covers `gcse | alevel | university | exploring`.
   Adding `ap` is a small change, but it is a change.
2. **The spec-point tree is UK-board-shaped** — `exam_spec_points` is keyed on
   `(board, qualification, subject, spec_point_id)` with `is_paper2_only` and `is_practical` flags.
   College Board AP has units and learning objectives, not boards and papers. The table will hold
   AP with `board='College Board'`, but the semantics are a slight lie and the flags don't apply.

Subjects actually referenced in code are `mathematics`, `physics`, `chemistry` — which is exactly
where two AP spines would sit most naturally (AP Calculus + AP Physics, or AP Chemistry). If
Alexander's existing coverage is to inform the choice, **that is the pair I would pick.**

`api/post-conversation.js` is the piece that makes it a depth layer rather than a chatbot: after a
conversation it maps what happened onto spec points, updates competence, and generates review items.
Summoning Alexander as a callable depth layer means calling `alexander-coaching` (or `alexander`)
for the teaching turn and `post-conversation` for the extraction — both are already HTTP endpoints
with their own auth, so **the API boundary is clean enough to call from another app.**

Two notes for whoever builds: every Alexander endpoint reads `process.env.CLAUDE_API_KEY` (12
occurrences), not `ANTHROPIC_API_KEY` as the rest of the estate does; and its pinned models are
`claude-sonnet-4-6`, `claude-sonnet-4-5-20250929`, `claude-opus-4-6`, `claude-opus-4-5-20251101`,
`claude-haiku-4-5-20251001` — **nothing on the 5 family.** Neither blocks anything; both are worth
knowing before the first invoice.

### 3.5 The conversational surface — EXISTS (see §4)

### 3.6 Voice, in and out — DOES NOT EXIST anywhere in scope

Grep for `elevenlabs|deepgram|whisper|SpeechRecognition` across all five repos returns **one hit,
and it is a false positive** (`chat-script.js:3386`, the word "whisper" in a sing-along prompt).
There is no TTS, no STT, no audio pipeline, and no cloned-voice asset in any repo in scope.

The estate does have ElevenLabs experience — but it is in **SSi**, which is Aran's project, and
`ELEVENLABS_API_KEY` sits in SSi's own secrets vault. **That key must not be borrowed for this
product.** Pocket-Tom needs its own ElevenLabs account and its own cloned-voice model of Tom's
voice, which does not exist yet.

**Missing: everything. BUILD, and deliberately out of the first slice** (§7).

### 3.7 Parent-visible progress reporting — BARELY EXISTS, and the one hit is misleading

Alexander has a `parents` table — **but it is a CRM table, not a reporting surface.** Its columns
are `lead_id`, `occupation`, `household_income`, `previous_tutoring`, `referral_source`: this is
lead scoring for sales, not a parent's view of their child. Anyone reading the table name and
assuming a parent surface exists would be wrong. There is also a `communication_log` table.

`api/generate-report.js` is the real asset and it is genuinely useful: "Alexander Proof of Work
Report Generator", producing print-ready HTML. But it is **stateless** — it takes an `analysis`
object in the POST body and returns HTML. It fetches nothing, schedules nothing, and sends nothing.

**Missing (WIRE + small BUILD):** the weekly job that assembles the analysis from competence rows
and digests, calls the existing renderer, and emails it. Given the buyer is the dad paying £500+ a
month, this is not optional and it is cheap — one Sonnet call a week (§2.4).

### 3.8 The weekly human cheerleader's brief — DOES NOT EXIST

Nothing in the estate produces a briefing for a third party. What the system owes that person,
concretely: **what he actually did this week, what he said he'd do and didn't, one thing to be
genuinely delighted about, one thing to poke at, and the exact words he used** — so the call opens
with recognition rather than interrogation. Same input as the parent report, different output and
different register: the parent report is evidence, the cheerleader brief is ammunition. One extra
Sonnet call a week, £0.20/month. **BUILD, but trivially.**

### 3.9 The escalation path to Tom — DOES NOT EXIST

No repo has any concept of escalating to a human. The nearest thing is Alexander's
`breakthrough_detected` flag — a signal that gets written and never routed.

Given the ZERO-LIVE-TOM-TIME spec, this needs to be a narrow, high-bar channel: not "Tom reviews
weekly", but "these three specific conditions reach Tom, everything else never does." Tom authors
the conditions once; the digest evaluates them nightly and does nothing 99% of the time.
**BUILD, small.** The delivery pipe already exists — it is the same web push.

### 3.10 Summary table

| Capability | State | Where | Port / Wire / Build |
|---|---|---|---|
| Academic learner model | **Exists** | `alexander` competence + review_items + SM-2 | PORT |
| Becoming-model (who he is) | Exists, client-side only | `theracowch/api/compress-profile.js` | BUILD (server-side store) |
| Initiative pipe | **Exists ×2** | `theracowch` (mature) + `tomcassidy-site` (13x4-aware) | PORT |
| Model-driven nudge content | **Missing** | canned arrays in both | WIRE |
| 13x4 week arithmetic | **Exists** | `coach-engine.ts` + `ProgramWheel.svelte` | PORT |
| 13x4 slot state / commitments | Missing | — | BUILD |
| AP academic depth | Exists, generated | `curriculum-topics.js` + `post-conversation.js` | PORT + small BUILD (AP level) |
| Phone surface | **Exists** | `theracowch` PWA | PORT |
| The Script as standing prompt | **Exists** | `src/lib/the-script.md` | PORT |
| Voice in / out | Missing entirely | — | BUILD (deferred) |
| Parent report renderer | Exists, stateless | `alexander/api/generate-report.js` | WIRE |
| Parent report job | Missing | — | BUILD (small) |
| Cheerleader brief | Missing | — | BUILD (trivial) |
| Escalation to Tom | Missing | — | BUILD (small) |

---

## 4. Recommended donor codebase for the phone surface

### The recommendation

**Fork `theracowch`'s chat surface. Graft `tomcassidy-site`'s cron and coach-engine onto it. Call
Alexander over HTTP. Do not fork Alexander's front end, and do not start fresh.**

Stated as one narrative rather than a survey:

**Better.** The mentor's defining capability is INITIATIVE, and initiative on a phone means web
push, which means a service worker. **Theracowch is the only candidate that has one.**
`public/sw.js` (188 lines) has working `push` and `notificationclick` handlers; `api/push/` has
subscribe, unsubscribe, keys and a send path with per-user timezone slot matching. Alexander has a
`manifest.json` and **no service worker at all** — so as a donor it cannot do the one thing the
product is for, and adding push to it is not a port, it's the build. Theracowch is also already
running the right chat economics (§2.1): two-block cached system prompt, compressed profile, three-
message window. That is not a coincidence — it is the shape a mentor needs, and it is already
debugged in production.

**Simpler.** Theracowch's surface is 4,072 lines of vanilla JS plus a 188-line service worker — no
framework, no build step for the chat, one file to read. Alexander's front end is 17,468 lines of
Vue with a **4,228-line single chat component**, entangled with Stripe checkout, credit tiers,
subscription management, OTP auth and an admin console. Porting that means carrying a payments
system into an N=1 product with one user who isn't paying through the app.

**Cheaper, total cost.** The maintenance question decides it. Alexander is Tom's live tutoring
product with real users and a payments path; forking its front end forks that liability and creates
a second thing to keep in sync. Theracowch's chat surface is comparatively self-contained — the
baggage is *content*, not *architecture* (therapy prose in the system prompt, the Mandy persona,
cow branding, and ~10 marketing HTML pages under `public/`), and content is deleted, not untangled.
The plumbing underneath — chat endpoint, cache split, profile compression, push, SW, KV — is
domain-neutral. And critically: leaving Alexander **behind an HTTP boundary** means it keeps
shipping as its own product while pocket-Tom calls it. One codebase, not two forks.

**What I'd strip for parts from the ones I didn't pick:**

- From **`tomcassidy-site`**: `src/lib/coach-engine.ts` (the week arithmetic, near-verbatim),
  `src/pages/api/cron/coach.ts` (the cron shape and `CRON_SECRET` handling), and **the Script**
  (`src/lib/the-script.md`) as the standing prompt. Its `push-store.ts` I would *not* take —
  theracowch's KV store is strictly better (multi-user, preference-aware).
- From **Alexander**: nothing ported. Two endpoints called over HTTP — the coaching turn and
  `post-conversation` — plus `generate-report.js` as the parent-report renderer. Its competence and
  review-item schema is the reference design for the academic half of the student model.
- From **theracowch**: strip the Mandy persona, the therapy/crisis-safeguarding prose (a homeschool
  mentor needs its own, different safeguarding), the cow branding, the marketing HTML, IMAGINE
  framework content, and the `[[MOOD: x]]` hidden-tag mechanism — though that last one is a *good
  idea worth reimplementing* as a drift signal rather than a mood signal.

**Why not fresh.** A fresh build would have to write, from nothing: a service worker with push, a
VAPID key path, subscribe/unsubscribe, a KV-backed subscription store, timezone slot matching, a
cached two-block prompt assembly, profile compression, and an offline fallback. That is the bulk of
theracowch's chat plumbing and it is all already debugged against a real phone. Fresh is only
cheaper if the existing thing is wrong, and it isn't — it's just wearing the wrong clothes.

**Honest caveat.** The result is genuinely a *new repo assembled from two donors*, not a clean
single fork, because the surface donor and the initiative-cadence donor are different repos. I'd
name it as such rather than pretend it's a tidy port.

**Hosting and stack:** Vercel + Upstash/KV + Supabase — every donor already uses exactly this, no
new infrastructure, no Better×Simpler×Cheaper narrative needed because nothing changes.

---

## 5. Proposed first slice

**What it is:** a phone web app the boy installs, that talks to him in Tom's voice, knows what week
of the 13x4 he's on, remembers who he is across weeks, starts the conversation three times a day
without being asked, and can go deep on two AP subjects by calling Alexander. His dad gets an email
every Sunday.

**Repo:** new — `tom-in-your-pocket`, seeded from `theracowch`'s chat surface. Not a branch on
theracowch (that's Tom's live wellbeing product), not on tomcassidy-site (Astro content site, wrong
shape), and nothing in `hexagon` (co-owned, read-only).
**Branch:** `main` from the seed commit, feature branches per step below.
**Built by:** workers on the estate, not Tom.

### The order, and why it's this order

| # | Step | Size | Why here |
|---|---|---|---|
| 1 | Seed the repo: fork theracowch chat surface, strip Mandy/therapy/cow/marketing, keep chat.js + push/ + sw.js + KV. | ~1 day | Everything else needs a surface to land on. Deletion, not writing. |
| 2 | **Move the profile server-side.** One `student` row in Supabase; `chat.js` reads it instead of taking it from the request body. | ~1 day | **The keystone.** Nothing that follows works while memory lives on the phone. |
| 3 | Swap the system prompt for the Script. `the-script.md` verbatim as the cached block, mentor framing + escalation rules appended. Two-block cache preserved. | ~half day | Makes it Tom rather than generic. Cheapest step with the biggest felt change. |
| 4 | Port `coach-engine.ts`; add 13x4 slot state (committed / did / dodged) to the student row. | ~1 day | Gives the mentor something to coach *against*. |
| 5 | **Model-driven nudges.** Point theracowch's `*/15` cron at a Sonnet call that reads the student row and the current week and writes the push text, instead of the `NUDGES` array. | ~1 day | This is the moment it stops being a reminder app and becomes a mentor. |
| 6 | Nightly digest: one Sonnet call rolls the day's turns into the student row; evaluates Tom's escalation conditions. | ~1 day | Makes memory *compound* rather than accumulate. |
| 7 | Alexander as depth: call `alexander-coaching` + `post-conversation` over HTTP for the two AP subjects; add `ap` to `LEVEL_LABELS`. | ~2 days | Last, because the mentor is the differentiator and the tutor is the commodity. |
| 8 | Sunday jobs: parent email via Alexander's `generate-report.js`; cheerleader brief to whoever runs the weekly call. | ~1 day | The buyer must see it working; the human needs ammunition. |

**Roughly 8–9 working days of worker time.** Steps 1–5 alone (~4.5 days) are already a usable
product: a mentor in Tom's voice that remembers him and starts conversations. If the year is
tight, **ship after step 5 and put it in front of the boy** — steps 6–8 improve it, they don't
gate it.

### What it deliberately does NOT do yet

- **No voice, in or out.** Text-first (§7). Cloned voice is a later delight, not a first slice.
- **No multi-tenancy.** One student row, one dad, one cheerleader. No org model, no roles, no
  billing in the app. Tom invoices the dad directly.
- **No auth system.** The simplest thing for N=1 — a single-device install with a shared secret, or
  Alexander's existing OTP/email pattern if a login screen is genuinely wanted.
- **No more than two AP subject spines.** Two, plus the mentor.
- **No Hexagon.** Read for structure only (§8).
- **No Zenjin.** Later-phase asset.
- **No local model.** §2.8.
- **No product identity or branding.** "Tom in your pocket" is a working title, and the persona
  framing is Tom's call, not a worker's.

---

## 6. Taste-safe defaults applied — overturn any of these with one sentence

1. **Text-first.** Occasional spoken nudges in Tom's cloned voice modelled as an add-on line item
   (§2.6) and deferred out of the first slice. Tom said most of it is text.
2. **Two AP subject spines maximum**, plus the mentor. On Alexander's existing coverage
   (`mathematics`, `physics`, `chemistry`) I'd propose **AP Calculus + AP Physics** — but which
   subjects the boy is actually sitting is a fact I don't have (§7).
3. **Cost modelled at Sonnet 5's post-September $3/$15**, not the $2/$10 intro rate, because the
   boy's year runs past 31 August 2026.
4. **Opus 5 escalation set at 5% of turns.** A guess, and the single most sensitive cost input —
   at 15% the bill roughly doubles (still trivial).
5. **1-hour cache TTL, not 5-minute.** Turns cluster into ~4 windows/day; a 5-minute TTL would miss
   most of them.
6. **Doctrine corpus stays out of the standing prompt.** ~68k tokens of essays and canon shape the
   Script once at authoring time; they are not re-read every turn.
7. **Vercel + Supabase + Upstash KV**, because every donor already uses exactly that.
8. **Simplest N=1 identity** — single-device install or Alexander's existing OTP pattern. No auth
   system designed.
9. **"Tom in your pocket" as working title only.** Persona framing and product identity flagged as
   Tom's call, not invented.
10. **Cheerleader brief and parent report share one input, differ in register** — parent gets
    evidence, cheerleader gets ammunition.

---

## 7. Explicit gaps — things I could not verify, stated rather than papered over

1. **Nothing was run live.** No dev servers, no database queries, no API calls. Every claim about
   the data model comes from reading migrations and the code that writes to them, not from
   inspecting rows. **I do not know how much real data is in any of these tables.**
2. **Which AP subjects the boy is taking is unknown.** The two-spine recommendation is derived from
   Alexander's existing coverage, not from the actual case. This is a one-sentence answer from the
   dad that changes step 7 of the first slice.
3. **Tom's cloned voice does not exist as an asset** anywhere in scope, and the estate's ElevenLabs
   experience sits in **SSi, which is Aran's project**. I priced ElevenLabs list rates; I could not
   verify what tier the estate is on, and **SSi's key must not be borrowed for this product.**
4. **Deployment state unverified.** I did not check whether the tomcassidy-site crons are actually
   firing in production, whether theracowch's `*/15` cron requires a Vercel Pro tier (its own code
   comment says Hobby needs a different interval), or whether either has a live subscription stored.
5. **Alexander's live subject/topic counts are unknown** — the curriculum is DB-cached and
   generated, so counts are a runtime fact, not a repo fact.
6. **Token estimates use 4 chars/token.** Claude 4.7-and-later models use a newer tokenizer that
   produces ~30% more tokens for the same text. Sonnet 5 is in that family, so **the cost model's
   input token counts may be understated by up to ~30%** — which moves the typical month from £7.10
   to about £9. Worth one `count_tokens` call against the real assembled prompt before anyone
   quotes a number externally.
7. **Hexagon and Zenjin were read shallowly** (§9) — enough to establish stack, scheduled jobs,
   delivery layer and shape, not enough to judge their data models in detail. Hexagon was read
   strictly read-only; `git status` was clean before and after.

---

## 8. Needs Tom

Four things, each answerable in a sentence.

1. **The Script as standing prompt — is `src/lib/the-script.md` the version pocket-Tom speaks
   from?** It exists, it is canonical, and it is 5,875 chars. `docs/SCRIPT-CANON.md` explicitly
   describes itself as an audit "built for Tom to redline, not to be believed." Someone has to say
   which one the product uses. Everything else in the build is downstream of this answer.
2. **The escalation rules.** What are the three conditions that reach Tom? This is the whole of his
   ongoing time commitment and only he can write it.
3. **9x4 or 13x4?** Both are live in the repo simultaneously — `the-9x4.md` and `NineByFour.astro`
   against `ultimate-13x4.ts`. I've used 13x4 throughout because that's his current word.
4. **Hexagon is a PARTNERSHIP QUESTION, not an architectural one.** If the academic spine ought to
   be Hexagon-shaped, that is a conversation with Dom before it is a line of code. Nothing was
   written to that repo and nothing assumes it.


---

## 9. Hexagon and Zenjin

### 9.1 Hexagon — read-only, and it changes the picture more than expected

**No writes were made to `/home/tomcassidy/hexagon`. `git status` was clean before and after.**

Read purely as a structural template, Hexagon turns out to hold the one thing neither theracowch nor
tomcassidy-site has: **a working scheduled job that composes and delivers a report to a human by
email.** `vercel.json` declares two crons —

```
{ "path": "/api/weekly-digest",       "schedule": "0 17 * * 5" }   // Fridays 17:00
{ "path": "/api/reengagement-email",  "schedule": "0 10 * * *" }   // daily 10:00
```

— backed by `api/weekly-digest.js` (195 lines), `api/reengagement-email.js` (117), and
`api/progress-report.js` (234), all delivering through **Resend** (`RESEND_API_KEY`). That is
§3.7's missing parent-report job and §3.2's initiative loop, already built, already scheduled,
already delivering to an inbox.

**But the parent surface is thinner than the marketing.** There is **no parent role and no parent
email field** — `AccountSettings.vue:24-25` hardcodes `role: 'parent'` as mock data, `/parent`
redirects to `/progress`, and both the Friday digest (`api/weekly-digest.js:108`) and the on-demand
report mail **the student's own auth address**. `PricingPage.vue:59` promises reports "sent directly
to parents", which only works if the account was registered with the parent's address. So Hexagon
has solved *scheduled email delivery*, not *parent identity*. Correcting my own earlier framing:
it is the delivery rail that transfers, not a parent surface.

Hexagon also has a real durable learner model — `hexagon.user_topic_mastery`
(`supabase/migrations/009_topic_mastery.sql`) with SM-2 in `src/services/spacedRepetition.ts`,
written from the chat and retrieval-practice components and read by `CoachPage`, `ParentDashboard`
and `weekly-digest.js`. **And its coach never reads it.** `api/coaching.js` fetches nothing before
building a prompt — no history, no mastery, no prior attempts; context is the client's last 10–16
messages. So Hexagon is the third instance of the same estate-wide shape: memory and initiative both
exist, and they are wired to each other through *email templates* rather than through the model.

**It confirms the estate-wide pattern rather than breaking it.** I grepped all three of those
jobs for `anthropic|claude|model:` and got **zero hits**. Hexagon's digests are template-composed
from database rows, exactly as tomcassidy-site's coach lines and theracowch's `NUDGES` array are
hard-coded text. So across three independent repos, five scheduled jobs, and two delivery channels:
**every scheduled thing in Tom's estate is template-driven, and not one has a model in the loop.**
That is the single most consistent finding in this scout, and it is precisely the gap between a
reminder system and a mentor.

Stack is Vue + Supabase + Stripe + Resend on Vercel — same family as the rest of the estate, so
nothing here argues for new infrastructure.

**The most valuable transferable structure** is the delivery layer: Resend + a cron + a report
composer is exactly what step 8 of the first slice needs, and Hexagon has already made every
mistake in building it once.

**PARTNERSHIP QUESTION FOR TOM AND DOM.** Hexagon is co-owned. If its academic spine or its digest
machinery is the right foundation for pocket-Tom, that is a conversation to have with Dom before it
is a line of code. **Nothing in the recommended architecture assumes Hexagon.** The first slice can
be built end to end without it — Resend is a fifteen-minute integration from scratch. I am flagging
it because the honest finding is that Hexagon solved the reporting problem first, not because the
build needs it.

### 9.2 Zenjin — a later-phase asset, and I'd not spend the year's budget on it

Small share of the scout, per the brief. `main` at `e6c4c41` (2026-07-17) — no movement in seven
weeks, consistent with Tom's own "not developed completely yet."

What's there: a Svelte monorepo, ~251 TypeScript/Svelte files, with a real `packages/engine`
carrying graph logic (`src/graph/factorout.ts` with tests). **No Claude or Anthropic usage anywhere
in the repo** — it is a client-side progression engine, not an AI product. Content is thin: a
`docs/zucs/` class-factorisation JSON, not a curriculum.

**Position: later-phase asset, and the reason is shape, not maturity.** Zenjin's ambition —
"counting to university engineering" — is a *many-year mastery ladder*. The boy's problem is the
opposite: **one specific year, two AP exams, a fixed May deadline.** Even a finished Zenjin would
be the wrong instrument for a twelve-month sprint, and an unfinished one would consume the year's
build budget. Alexander's generated-curriculum path (§3.4) fits the deadline; Zenjin fits the decade.

Revisit it when the product has a second student and a longer horizon.


---

## 10. Corrections and additions from the deep reads

Six parallel read-only scouts went into the repos after the first pass above. Where they corrected
me, the correction is recorded here rather than quietly patched, because a scout that hides its own
errors is worth less than one that doesn't.

### 10.1 Corrections to my own claims

**(a) The cached base is 16.5k tokens, and the code comment is wrong by 2.7×, not 2.5×.** Measured
precisely: `prompt-base.js` 23,162 chars + three inline chunks (26,920 + 10,182 + 779) =
**61,043 chars ≈ 16.5k tokens ±1k**. Not verified against `count_tokens` — that is a paid call and
the scout was read-only.

**(b) A cost trap I under-weighted: theracowch's cache is 5-minute, not 1-hour.** `cache_control:
{type:'ephemeral'}` with no `ttl` defaults to 5 minutes. Break-even is 2 messages inside 5 minutes.
For a live back-and-forth that is a ~10× win from turn 2 — but **for a student who opens the app
once and sends one message, every message is a cache write, and the split makes it ~25% *more*
expensive than not caching at all.** My model already assumed a 1-hour TTL, so the arithmetic in §2
stands; but this is now a **specific, named fix in the fork**, not a preference: set `ttl: "1h"`, or
drop `cache_control` entirely if the real cadence turns out to be genuinely single-shot.

**(c) Alexander's device-side learner model is dead code, and the sync drops the live half.**
`updateProfileFromConversation()` (`learningStore.ts:329`) — which would populate `masteredConcepts`,
`currentlyLearning`, `struggles` — **has no callers anywhere in `src/`**. What *is* populated is
`communicationStyle` and `thinkingGaps`. And `compressProfile()` (`cloudSync.ts:152`) **drops exactly
those two fields** before syncing. Net: the only populated fields are the only unsynced fields, and
what lands in Supabase `learning_profiles` is an empty shell plus counters.

**This does not change §3.1's conclusion — it sharpens it.** `student_spec_competence` and
`review_items`, written server-side by `post-conversation.js`, are still real and still accumulating.
That remains the one genuine durable learner model in the estate. But `review_items` has exactly one
reader — `api/admin-user-detail.js:59-67`, an admin dashboard — so nothing reads it **back into a
coaching conversation**, and `student_paper_progress` is fully dead. **The competence store is
write-only from the student's point of view.**

**(d) Hexagon has no parent surface** (corrected inline in §9.1) and its coach reads none of its own
learner model.

**(e) I understated Zenjin.** It is not scaffolding: `packages/engine` is 104 graph source files,
109 test files, **803 `it()` blocks / 12,253 test lines**, and `apps/web` is a deployable SvelteKit 5
player with a complete loop — pack picker, countdown, MC at rungs 1–5, keypad at 6–7, red-shake with
canonical reveal and forced re-drill, localStorage resume. **~325–330 playable atoms across 92
packs.** My verdict is unchanged but the reasoning gets sharper (§10.3).

### 10.2 Additions that change the build

**The 13x4 programme has no coach banks.** `grep -c 'banks:'` is **zero** for every programme file
except `reasonable-eating.ts`, which has 13. So `ultimate-13x4.ts` carries one `coach.wisdom` line
per focus and nothing else, and there is no push CTA, no service-worker registration and no manifest
identity for 13x4 anywhere. **The 13x4 cadence content for coaching does not exist yet.** In the
first slice this is a feature, not a blocker — pocket-Tom composes its nudges with a model reading
the Script, so it needs no banks. It does mean there is nothing to port as *content*.

**A latent week-arithmetic bug.** `src/lib/today.ts:57` computes `totalWeeks = program.cycles *
program.domains.length`. For Reasonable Eating (3 domains × 4) that gives 12 and is correct. For
`ultimate13x4` (4 cycles × 3 domains) it also gives 12 — **but the programme has 13 weeks**, so week
13 would be unreachable and every week after the first lap mis-indexed. Latent only: `today.ts` is
never called with 13x4. `coach-engine.ts` computes the order correctly. **Port `coach-engine.ts`,
not `today.ts`.**

**Theracowch is even cleaner as a donor than §4 argued.** Its `CLAUDE.md` names Clerk, Supabase and
Stripe; the code has **none of them**. `package.json` has exactly two runtime dependencies —
`@upstash/redis` and `web-push` — and greps for clerk/supabase/stripe across `public api lib` return
nothing. No auth, no database, no payments, no migrations. That is a *stronger* donor argument than
I made: there is no billing or auth liability to strip, only content.

**Two security notes for whoever forks it.** The origin allowlist in `api/chat.js:19` **passes when
there is no `Origin` header at all**, so a plain `curl` reaches a billed key. And
`api/push/send.js:86` only enforces `CRON_SECRET` **if the env var is set**. Both are one-line fixes
and both should be made on day one of the fork, not later.

**AP is easier than §3.4 concluded.** `curriculum_topics` has free-text `subject`/`level`/
`exam_board` with **no CHECK constraint**, and migration `007_curriculum_topics.sql:15-16` explicitly
anticipates non-board use. `parse-paper.js` and `admin-upload-paper.js` interpolate whatever strings
they are given. **Pointing the ingestion pipeline at College Board / AP requires no schema change and
no code change — only rows.** The `LEVEL_LABELS` addition remains a nicety for prompt wording, not a
gate.

**One live hazard to guard if the checkpoint feature is carried over:** with no matching question
bank, `bankKey()` returns `''`, `getQuestionsForTopic` returns `[]`, and `startCheckpoint()`
(`learningCheckpointService.ts:64-90`) proceeds with **zero questions and no guard**. Any AP subject
hits this immediately. Alexander's hand-authored content is 210 questions across 12 banks, all
UK-board; topic maps cover 7 of the 12.

**Alexander's repo carries two unrelated products.** Product A is Alexander (live). Product B is a
"Hexagon" CRM/marketplace — `api/leads.ts`, `dashboard.ts`, `consultations.ts` against a `hexagon.*`
Postgres schema, **no table of which is queried by any live code path**. There are also three
competing generations of the credits system, of which only `20260415_credits_system.sql` is
canonical, and `create-credit-checkout.ts` reads columns that don't exist in it. **This is the
strongest argument yet for the mentor app standing alone rather than sitting on Alexander's Supabase
estate** — which is what §4 recommends and what the Alexander scout independently concluded.

### 10.3 Zenjin, re-stated with the better reasoning

The blocker is not content volume, it is **the answer layer**. The ladder terminates in a numeric
keypad and the MC rungs are 2-option (a 50% guess floor). **Calculus answers are expressions, not
integers**, so extending Zenjin to AP is engine work plus a new input modality, not atom authoring.
Content reach stops at FOIL and factoring out an HCF — nothing for quadratics, functions, exp/log,
trig, limits, derivatives or integrals. And nothing in the repo *teaches*: there is no worked
solution beyond a one-line canonical reveal.

**But there is a role for it from day one that I missed:** the **automaticity floor underneath** the
AP year — arithmetic, fractions, decimals, percent, ratio, index laws, expansion. That is precisely
the layer that sinks AP Calculus students, and it is built and tested today. Still out of the first
slice; worth a look the moment the boy's algebra fluency turns out to be the actual bottleneck.

Two honest gaps from that scout: there is no `vercel.json` and no deployment URL in the repo, so
**nobody has confirmed Zenjin is live anywhere**; and `node_modules` was absent, so no tests were
run — the green claim rests on CI, not an executed run.

### 10.4 Three things in Hexagon that are Tom-and-Dom's to call

Found while reading; **nothing was touched, and `git status` was clean throughout.**

1. **`.github/workflows/auto-merge-claude.yml` auto-merges any `claude/**` push straight to `main`
   with `contents: write`.** On a co-owned repo that is worth knowing about.
2. **`/api/coaching` has no rate limit and no credit gate.** `RATE_LIMITING.md` claims 10/hr; the
   file imports no middleware. The only credit-deduction code (`deepDomIntegration.ts`) is imported
   by nothing. So the most expensive endpoint is the only unmetered one, and CORS admits
   origin-less server-to-server calls. An open cost tap.
3. **`api/progress-report.js` emails a full progress report to any address supplied in an
   unauthenticated POST body**, CORS `*`, no ownership check.

Also: `api/admin-data.js:126,214` pins `claude-sonnet-4-20250514`, retired seven weeks ago. Admin
analytics only.

None of these is pocket-Tom's problem. All three are Dom's repo, two touch billing or outbound mail,
and I did not scope fixes.

---

## 11. Hexagon, read properly — and why it settles the academic-spine question

The final scout went deep on Hexagon. **No writes; nothing created, modified, committed or branched;
no builds, no queries, no paid calls.** Two contested claims were re-verified against source before
inclusion.

### 11.1 The content is enormous, and it is deep in exactly the wrong place

Hexagon's curriculum is **static TypeScript compiled into the client bundle** — not a database,
not generated. 192,469 lines across seven directories in `src/data/`:

| Asset | Count |
|---|---|
| Specification files → modules → topics | 18 → 154 → **760** |
| Past papers / paper questions / mark-scheme fields | 506 / **6,014** / 20,931 |
| Bank exam questions | 496 across 13 banks (13 of 30 registered board slugs have none) |
| Prerequisite entries / diagnostic questions | 677 / **1,973** |
| Worked examples / annotated steps | ~693 / 1,585 |
| KS2/KS3 units / sections | 317 / 1,353 |

For scale: **Hexagon has roughly thirty times Alexander's hand-authored question content** (496 + 6,014
against 210). That is a serious asset and I under-described it in §9.

**And it settles the spine question in the opposite direction to what the size suggests.** All of it
is UK maths — Edexcel/AQA/OCR, IAL and GCSE, modules named `P1`/`S2`/`M1`, KS2/KS3 units. The boy is
sitting **College Board AP in twelve months**. Hexagon's depth is in the wrong syllabus, the wrong
awarding body and the wrong country, and none of it is portable by configuration — it is 192k lines
of hand-authored board-specific TypeScript.

**Contrast that with Alexander, which has almost no content and the right mechanism**: a generated
curriculum with no CHECK constraint on `subject`/`level`/`exam_board` (§10.2). For a one-year AP
sprint, **the generator beats the library.** That is the whole argument, and it means the §4/§5
recommendation stands unchanged: Alexander over HTTP as the depth layer, Hexagon as a partnership
conversation and a structural reference, not as the spine.

### 11.2 What Hexagon does have that is worth copying

**The one closed loop in the entire estate.** `hexagon.user_topic_mastery` (`009_topic_mastery.sql:4`)
— `mastery_level 0-5`, `ease_factor`, `interval_days`, `next_review_due`, `streak`, unique on
`(user_id, spec_id, topic_id)`, with SM-2 authoritative in the SQL RPC `hexagon.update_topic_mastery`
and `spacedRepetition.ts` an explicitly-labelled client mirror. It is wired **both ways**: written
from the chat and retrieval-practice components, read by `CoachPage`, `ParentDashboard`,
`CancelSave` and `weekly-digest.js`.

**Attempt → mastery → SM-2 interval → due-review surface → outbound email is a complete circuit, and
it is the only one in the estate.** That circuit — not the content — is the transferable design.

### 11.3 A live data bug in Dom's product — the most valuable single thing this scout found

**`spec_id` is written and read with different values, and it is part of the uniqueness key.**

- Write: `const specId = examContext.value?.board ?? 'edexcel-int'` — the bare board slug
  (`SimpleChatV2.vue:758`).
- Read: a suffixed key — `` `${selectedBoard.value}-gcse` ``, `-ks2`, `-ks3`, `-fm`
  (`CoachPage.vue:743-752`).

**Consequence: every GCSE, KS2, KS3 and Further Maths student's mastery silently reads back empty.**
A-level is unaffected, because those slugs take no suffix. Nothing errors; the data is being written
correctly and simply never found again.

This is Dom's to fix and I have not touched it, but it is worth telling him today — it is silent,
it affects the majority of his cohort, and it will keep quietly discarding evidence for as long as
it runs.

### 11.4 Three more things that are dead, and one that may not be running

- **The prerequisite DAG is dead as a graph.** 677 entries with `prerequisiteTopicIds`, and **no code
  anywhere walks transitive prerequisites** — the only reader displays one entry's diagnostics.
  Edges are unvalidated strings. This is the most under-used asset in the repo.
- **`breakthrough_achieved` is never set.** The logger doesn't pass `conceptual_breakthrough`, so the
  trigger at `005_conversation_logging_system.sql:231` never fires and **every breakthrough counter
  reads zero.** (Alexander has the same shape of problem from the other end — it sets the flag and
  never routes it.)
- **`student_paper_progress` has full RLS and zero application references** — built as a proper
  table, then implemented in localStorage instead. Same pattern as theracowch and Alexander: the
  durable store gets designed, the shipping code goes to the device.
- **Five mutually incompatible schema lineages**, with two migrations colliding on number `007`.

**And the estate-wide pattern extends to the crons themselves.** Neither `CRON_SECRET` nor
`WEBHOOK_RETRY_SECRET` appears in Hexagon's `.env.example`, and its cron auth **fails closed**
(`reengagement-email.js:16-19`). Combined with tomcassidy-site's cron proven inert in production
(§3.2), the honest position is: **the estate has four scheduled jobs across two repos and I cannot
confirm that any of them has ever successfully fired.** That is not a claim they haven't — it is a
claim nobody has checked, and it is checkable in about ten minutes in the Vercel dashboard.

**Doc-vs-code, one more time:** `HEXAGON-MATHS-SPECIFICATION.apml` (34KB, root) is referenced by
**zero** source files, and `src/apml/` (2,310 lines of parser and reverse-compiler) appears in live
code only as a comment. The APML pipeline the root markdown describes is **not wired in**;
`src/data/*.ts` is the real model.

### 11.5 What this changes in the recommendation

**Nothing structural.** The donor call (§4), the first slice (§5) and the cost model (§2) are
unchanged. What changes is confidence: three independent repos have now been read to the bottom and
all three show the identical shape — **a durable learner model that something writes, an initiative
loop that something schedules, and no model in between.** Pocket-Tom's first slice is the first
thing in the estate that would close that circuit.

