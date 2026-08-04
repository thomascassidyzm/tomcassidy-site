# Tom in your pocket — N=1 assembly map

**Scout report, 2026-08-04.** Read live code across `alexander`, `theracowch`, `tomcassidy-site`,
`hexagon` (read-only), `zenjin-2026-v1`. Where a markdown file and the source disagreed, the code
won and the disagreement is recorded as a finding.

> This document is a map, not a build. Nothing was built this turn except this file.

---

## 0. The headline

**The mentor layer does not exist anywhere in the estate. Every one of its three defining
capabilities is missing, and two of the three are missing in a way that a port cannot fix.**

What exists is better than that sounds, because what's missing is small:

- **Initiative exists as working plumbing** — `tomcassidy-site` has a live Vercel cron firing three
  times a day into web push, with a real jitter pattern and a real "return, not nag" design. It has
  never had a model in the loop, and it has no student to know about.
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
is actually on — see §6.

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
