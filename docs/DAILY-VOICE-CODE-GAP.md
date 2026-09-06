# The daily voice as the user's own words: what the code does today, and what is missing

> Report, 2026-09-06. Companion to the ruling recorded at `docs/SCRIPT-AND-WHEEL.md` §0 and in
> `docs/DECISIONS.md`. Tom ruled that the daily line is the user's own words, given back to them,
> as an output of their own WAYL assessment. This document reports what is actually in the code —
> in this repo and in `~/theracowch`, where WAYL lives — and says plainly what would have to change.
> **Nothing here was built.** It is a trace, not a plan. The theracowch half was audited by worker
> #935; nothing in that repo was modified.

---

## The one-line answer

The user's own words are **kept in this repo** — verbatim, with a confirm-back — and the daily push
already prefers them over Tom's authored lines. They are **not kept in WAYL**. The two halves of
Tom's sentence are in different states: "their own words" exists and works; "as an output from the
WAYL assessment" does not exist at all, in either repo, and the raw material for it has to be built
rather than found.

So the ruling is not a rewrite. It is a **join** — and the joint is missing at the WAYL end, not at
the delivery end.

---

## 1. Where the daily push text comes from today

One path, three files, no model call.

`src/pages/api/cron/coach.ts:69-70` reads this subscriber's goal for the week they are on and calls
`payloadFor` (`src/lib/coach-run.ts`), which calls `selectPayload` (`src/lib/coach-engine.ts:162`).
That function is the whole decision:

- **If** there is a goal for this exact `weekIndex`, it is `blessed`, and its text is non-empty →
  the push body IS that text, tagged `source: 'goal'` (line 176).
- **Otherwise** → a tone-weighted line drawn from the programme's authored banks, `source: 'bank'`.

The week arithmetic is per person, off their own `start_ms`, not a global calendar
(`weekIndexFor`, `src/lib/push-store.ts:251`). Nothing is generated at send time; the cron posts a
stored string.

**Read against the ruling:** the delivery mechanism is already correct. The `source` field even
records, per push, whose voice went out. That is a ready-made measure of how often the ruling is
actually being honoured in production.

---

## 2. Is the user's own phrasing retained? In this repo, yes

`coach_goals` (`supabase/migrations/20260901_coach_subscribers.sql`) is one row per person per week:
`subscriber_id`, `week_index`, `text`, `blessed`, `set_at_ms`. `text` is the string the person typed.

The write path is deliberately two steps (`src/pages/api/push/goal.ts`):

- `{action: 'set', text}` stores it **unblessed**. Nothing will ever push an unblessed goal.
- `{action: 'bless'}` sends **no text** — the server blesses the exact string it already holds, so
  what was confirmed and what gets pushed cannot diverge.

Identity is the push endpoint, hashed server-side; a client-supplied id is never accepted. RLS is on
with no policies, so the tables are reachable only with the service-role key.

The contract is stated in the code, at `src/lib/coach-engine.ts:142`:

> *"Verbatim. Never rewritten, tidied, capitalised or wrapped in encouragement."*

**Read against the ruling:** this was written as a courtesy under a coach-voice design. Under the
ruling it is the product, and it is already enforced end to end — including the confirm-back loop,
which is the part that makes it *theirs* rather than *what we heard*.

**The limits, stated plainly.** Capture exists on exactly one page — `src/pages/reasonable-eating/today.astro`
— a textarea capped at 280 characters, then "Is this exactly what you said?" → "Yes, that's it". One
sentence, one week, one programme. There is no second sentence, no history surfaced back, and no
other programme has the page.

---

## 3. Is the wheel generated from WAYL? No — not anywhere

`grep -rlni "wayl|what are you like" src/ docs/ supabase/` in this repo returns **nothing**.

The thirteen points are hand-authored static TypeScript: nine files in `src/lib/programs/`, typed by
`src/kit/types.ts`, where the coach banks are described in the source as *"DRAFTS in Tom's voice, for
him to edit."* The only per-user state in the entire engine is two columns on `coach_subscribers`:
`program_slug` and `start_ms`. A person **picks a published wheel** at
`src/pages/api/push/subscribe.ts:45`, defaulting to `reasonable-eating`. Nothing is derived, scored,
or assembled for them.

So today the wheel is Tom's and the sentence is theirs. The ruling's premise — that the wheel is
*their* output, which is what makes quoting it back legitimate rather than presumptuous — is not yet
true in the code.

---

## 4. What WAYL actually keeps (audited in `~/theracowch`, worker #935)

The finding that matters, first: **there is no durable record anywhere in theracowch of a user's own
phrasing of something they committed to, reachable by a daily-line generator.** Flatly, no.

What is there:

- **Free text is almost absent.** The only free-text capture in WAYL is an optional "honest exit"
  note on the single-choice variant (`public/assets/js/what-are-you-like.js:344-368`) — an
  *"it depends"* aside a person can leave when a forced choice doesn't fit. It is a caveat, not a
  commitment. The ranked variant (`what-are-you-like-rank.js`) has **zero** free text. Everything
  else is forced choice against a fixed item bank
  (`public/questionnaires/data/what-are-you-like-bank.json`).
- **Raw answers do survive completion — on the device only.** Item-level responses and the typed
  note persist to `localStorage['cowch-q-wayl']`. That key never leaves the browser. It is
  explicitly excluded — by code comment *and* by enforced logic — from `therapy-profile.js` and
  `lib/questionnaire-context.js`, the one pipe that carries WAYL output anywhere server-adjacent.
  So it is not lost, but it is unreachable from any server, any other device, and any cron.
- **A wheel-building flow exists, and it is the closest thing in the estate to the ruling** — an
  **unlinked prototype**: `public/build-your-wheel.html` with `public/assets/js/wellness-wheel.js`,
  where a person edits statements **into their own words** and those edits are genuinely retained
  verbatim in `localStorage['cowch-wheel-build']`. Nothing reads that key. Not the app, not Mandy's
  chat. It is not in the navigation.
- **The daily line in theracowch is unrelated to any of it** — a hardcoded rotation of 30 quotes in
  `app.js`.

Full trace with file:line evidence: https://watson-1.tail4968cb.ts.net/d/f2e5c804

---

## 5. The gap, stated as the four things that would have to change

Not a build plan — the honest list of what stands between the code and the ruling, roughly in order
of how much is missing.

1. **A commitment step that captures the person's own phrasing at assessment time.** This is the
   real gap and it is a product gap, not a wiring gap. WAYL today asks a person to *choose between
   written options*; it never asks them to *say* anything. The ruling needs a sentence they authored.
   The `build-your-wheel` prototype already does exactly this — it is the only place in either repo
   where a person writes their own version of a focus point — so the shape exists and is orphaned.
2. **A durable, cross-device home for those words.** Both WAYL's answers and the wheel-build edits
   live in `localStorage` on one browser. A daily push is sent by a cron on a server to a device that
   may not be the one that took the assessment. Anything device-local cannot reach it, by
   construction. This repo already has the pattern that solves it — endpoint-hashed identity with no
   signup (`push-store.ts`) — and it is a genuinely good fit, but nothing in theracowch uses it.
3. **A wheel that is an output rather than a menu choice.** `coach_subscribers` carries a
   `program_slug`. For the wheel to be theirs, it has to carry, or point at, thirteen points derived
   for them — which also means the thirteen carry *their* wording per point, not one sentence per
   week typed later against someone else's wording.
4. **A bridge between two repos and, currently, two products.** WAYL is in `~/theracowch` (Cowch,
   Mandy). The coach engine is here. They share a Supabase instance, which is the cheap way across,
   but no code path in either repo crosses today.

What does **not** need to change: the delivery half. `selectPayload`, the verbatim rule, the
confirm-back bless loop, the per-person week arithmetic, and the zero-model-call push are all already
what the ruling asks for. The authored tone banks stay as the honest fallback for a week where a
person has said nothing — silence is worse — and `source: 'bank'` in the push payload is the honest
measure of how often that is happening.

---

## 6. What this means for the doctrine

The ruling survives the code contact intact, and one thing gets sharper. §0 of
`docs/SCRIPT-AND-WHEEL.md` argues that a pre-commitment in the user's own words is the Script
deferred. This trace says where the deferral currently breaks: **the asking never happens.** The
Gateway Question is never actually put to the person by the assessment — they are given options and
scored. A quotation with no original utterance behind it is not a quotation.

That is the finding. The daily line cannot be the user's own words until something, somewhere, asks
them for words.
