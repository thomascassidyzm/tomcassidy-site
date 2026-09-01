# Reason-Ability coaching engine: it worked for one person

*1 September 2026, revised. The scout half is unchanged except where Tom has since corrected it;
the new part is section 2 — the named fix, written against the actual code, not against a guess.*

---

## The headline

It worked for one person, and the thing standing between that and the first stranger is not the
push machinery — that is real and it has delivered. It is that **there is no store**. Production
reports `canPersist: false`, so the only place a subscription can live is a hand-pasted
environment variable.

That single fact reconciles everything. It explains how it worked for you: you pasted your
phone's subscription into Vercel as `PUSH_SUBSCRIPTION` and redeployed, exactly as the code's own
comment instructs. And it explains why nobody else can ever be subscribed — the subscriber list is
a config value with one slot in it, editable only by you.

**The second stranger doesn't overwrite the first. The first stranger overwrites you.**

## Three corrections to the earlier version

1. **The plan is Vercel Pro**, estate-wide. The earlier finding that three cron schedules exceed a
   two-cron Hobby cap was **wrong** — drop it. All three schedules in `vercel.json`
   (07:47 / 12:13 / 18:09) are fine as declared.
2. **The backend is Supabase, not Vercel KV.** Supabase is already the datastore for the SSi
   learning app, for Popty and for Cowch on this estate. Provisioning Vercel KV for this one site
   would be a second datastore to run, key, back up and remember. Everything below is written
   against Supabase.
3. **Whether your phone received a push today is still UNRESOLVED.** You have not confirmed it
   either way, and I am not assuming it in either direction. The cron writes nothing when it
   succeeds, so there is no artefact to find; and the one runtime probe that would settle it sends
   a real push, which this job was not asked to do. Treat liveness as an open question — one that
   section 2 permanently closes, because the fix records every send.

---

## 1. What the code actually is

Five files carry the whole loop. I read all of them.

- **`src/lib/push-store.ts` (133 lines)** — the store. Three singular keys,
  `pocketcoach:subscription`, `pocketcoach:startMs`, `pocketcoach:goal`, over one of two backends
  chosen automatically: Vercel KV / Upstash REST when `KV_REST_API_URL` + `KV_REST_API_TOKEN` are
  set, otherwise a **read-only env-var fallback** (`PUSH_SUBSCRIPTION`, `PROGRAM_START_DATE`,
  `WEEKLY_GOAL`). `canPersist()` is literally "are the KV credentials present" — and in production
  it is false, which is the env-var path. The file says the shape out loud in its own header:
  *"SOLO DOGFOOD — one user, no accounts."*
- **`src/pages/api/push/subscribe.ts`** — takes `{subscription, startMs}`, writes it when KV is
  configured, and when it isn't, echoes back a `paste` payload of env values for you to hand-enter.
- **`src/pages/api/push/goal.ts`** — set/bless of the weekly goal. **Carries no notion of who is
  asking.** There is one goal on the server and every visitor reads and writes that same one.
- **`src/pages/api/push/vapid.ts`** — hands out the public VAPID key. Correct, nothing to change.
- **`src/pages/api/cron/coach.ts` (73 lines)** — the sender. `const PROGRAM = reasonableEating` at
  module scope, one `getStored()`, one `selectPayload()`, one `webpush.sendNotification`. On a
  404/410 — the code that means "this device is gone" — it logs and returns. Nothing is pruned,
  nothing is recorded.

Plus two client pages: `src/pages/reasonable-eating.astro` (the bell — subscribes and posts to
`/api/push/subscribe`) and `src/pages/reasonable-eating/today.astro` (the set-and-bless goal box,
posting to `/api/push/goal`).

The engine itself, `src/lib/coach-engine.ts`, is genuinely programme-agnostic and needs no change
for any of this. The separation you described is real.

---

## 2. The named fix — off the env var, into Supabase rows

**No login, no accounts, no auth system**, because the push subscription already *is* an identity:
the endpoint URL the browser generates is unique to that device and unguessable. Hash it and you
have a user id for free, with nobody signing up for anything.

### The tables

Two tables, in the estate's existing Supabase, service-role access only.

```sql
create table coach_subscribers (
  id            text primary key,          -- sha-256(endpoint), hex, first 32 chars
  endpoint      text not null unique,
  p256dh        text not null,
  auth          text not null,
  program_slug  text not null default 'reasonable-eating',
  start_ms      bigint not null,           -- THEIR week one, not yours
  created_at    timestamptz not null default now(),
  last_sent_at  timestamptz,
  last_status   int,                       -- the web-push status code, 201 on success
  fail_count    int not null default 0,
  revoked_at    timestamptz                -- null = live; set on 404/410
);

create table coach_goals (
  subscriber_id text not null references coach_subscribers(id) on delete cascade,
  week_index    int  not null,             -- the ABSOLUTE ordinal from weekIndex()
  text          text not null,
  blessed       bool not null default false,
  set_at_ms     bigint not null,
  primary key (subscriber_id, week_index)
);
```

Two tables rather than a JSON blob on the subscriber row, for one reason: the primary key
`(subscriber_id, week_index)` makes "this week's goal" a single lookup **and keeps the previous
weeks instead of overwriting them**. The goal history is the only record this product will ever
have of what somebody actually said they'd do, and it costs nothing to keep.

Enable RLS with **no policies**, and reach it only with `SUPABASE_SERVICE_ROLE_KEY` from the server.
A push endpoint plus its keys is a credential — anyone holding it can push to that device — so the
anon key must never be able to read this table.

### The files that change

1. **`src/lib/push-store.ts` — rewritten** (the biggest single piece, and still small). The
   KV-or-env switch goes; `canPersist()` becomes "are `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` present". The REST calls stay plain `fetch` against PostgREST —
   **no new dependency**, exactly the reason the file gave for not taking the KV SDK. The singular
   accessors become id-keyed ones:
   `subscriberId(endpoint)` (sha-256 via `crypto.subtle`), `upsertSubscriber(sub, startMs)` →
   id, `getSubscriber(id)`, `listLiveSubscribers()`, `getGoal(id, weekIndex)`,
   `saveGoal(id, goal)`, `markSent(id, status)`, `revoke(id)`. `currentWeekIndex()` and
   `currentGoal()` gain an id argument.
   **Delete the env-var fallback outright** rather than keeping it as a third path — two backends
   with one silently read-only is precisely what let the UI say "You're set" when nothing was
   saved.
2. **`src/pages/api/push/subscribe.ts`** — the `paste` branch goes. Upsert on endpoint (so
   re-tapping the bell is idempotent and refreshes the keys), return `{ok: true, id}`. When
   Supabase isn't configured, return a real **503 with an honest message** — never a success shape.
3. **`src/pages/api/push/goal.ts`** — gains identity. The client sends its **endpoint**; the server
   hashes it to the id. Hash server-side, never accept a client-supplied id: an id passed in the
   clear would let anyone who obtained one read and rewrite that person's goal.
   `GET /api/push/goal?endpoint=…`, and the endpoint travels in the POST body for set/bless.
4. **`src/pages/api/cron/coach.ts` — becomes a loop.** `const PROGRAM = reasonableEating`
   disappears; each row names its own `program_slug`, resolved through the existing
   `programBySlug()` in `src/lib/programs/index.ts`. For each live subscriber: compute *their*
   week from *their* `start_ms`, fetch *their* blessed goal for that week index, send. Then the
   three things it has never done — `Promise.allSettled` in chunks of ~10 so one dead endpoint
   can't stall the run; on 404/410 set `revoked_at` and stop sending to that row forever; write
   `last_sent_at` / `last_status` on every attempt. Return a summary
   `{attempted, sent, pruned, failed}` instead of a single boolean.
5. **`src/pages/reasonable-eating.astro`** — after subscribing, only say "You're set" when the
   server actually says it persisted; otherwise say plainly that it didn't. Twenty minutes, and it
   stops the loop burning the first people who try it.
6. **`src/pages/reasonable-eating/today.astro`** — the one non-trivial client change. It currently
   calls the goal API with no identity at all. It must first do
   `navigator.serviceWorker.ready` → `pushManager.getSubscription()` to get its own endpoint, send
   that with every call, and show a "turn the coach on first" state when there is no subscription.
7. **Environment**: add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel (the estate's
   existing names). Remove `PUSH_SUBSCRIPTION`, `PROGRAM_START_DATE`, `WEEKLY_GOAL` once migrated.
   **The migration of the one existing subscriber is: you tap the bell on your phone again.** No
   data-move script, no backfill.

### One sharp edge, worth knowing before you start

Every one of these values is read through `import.meta.env`. In Astro that can be **inlined at
build time**, not read at request time — which would mean setting the Supabase credentials in
Vercel does nothing until the next deploy, and rotating the service-role key silently keeps the
old one live. Write the new reads as ``import.meta.env.X ?? process.env.X`` and verify with a
one-line diagnostic route before trusting anything. It is also a candidate explanation for
`canPersist: false` that has nothing to do with the dashboard, and it costs ten minutes to rule
out.

### Honest size

The earlier estimate was half a day. **Against the actual code, half a day is right for the server
half only** — store rewrite, subscribe, cron loop, table creation. It did not account for:

- the identity plumbing in `today.astro` (service-worker handshake before any goal call),
- the honest-failure UI states on both pages,
- the `import.meta.env` question above,
- and there are currently **no tests over `push-store.ts` or the cron** — the only vitest files in
  the repo are `guide-prompt.test.ts` and `guide-request.test.ts` — so the multi-subscriber loop
  and the prune-on-410 path would ship unverified unless a small fetch-faked test pass is included.

**Call it one focused day of build, plus about half an hour of Supabase and Vercel configuration
that needs dashboard access.** Half a day is achievable only if you accept shipping the cron loop
without tests and leave the Today page's identity for a second pass — which is a real option, since
nothing links to that page today anyway.

### What this fix does NOT include

`/[slug]/today` routing, the missing link to the Today page, coach banks for the other eight
programmes, the iPhone add-to-Home-Screen gate, and anything joining a PDF to the app. Those stay
exactly as listed below.

---

## 3. The journey for someone who is not you

They land on `/reasonable-eating`, see the wheel and a "🔔 Tom in your pocket" button, press it,
grant permission. The browser builds a genuine subscription against the live VAPID key and posts it
to the server.

That is where it breaks, on the first press. The server has nowhere to write, so it returns a
"paste this into Vercel and redeploy" payload — and the page tells them *"You're set. I'll bring
this week's one thing to mind, gently, a couple of times a day."* It is a promise the system cannot
keep, and they have no way to know it was never kept except by the silence afterwards.

Two further breaks sit behind that one. **The Today page is unreachable** — nothing on the site
links to `/reasonable-eating/today`; it is designed to be opened by tapping a push, so the
set-and-bless capture, the one thing in this codebase that serves noticing rather than knowing, is
a screen no visitor can find. And **on iPhone, push needs the site on the Home Screen first**;
a first-timer who presses the bell in Safari gets nothing.

On the engine: `coach-engine.ts` is programme-agnostic, but everything using it hard-wires one
programme, and **Reasonable Eating is the only one of the nine with tone banks** — the other eight
have a single wisdom line per week, so pointing the engine at wealth today gives the same sentence
every day for a week.

---

## 4. The gaps, ranked by what blocks the first stranger

1. **No store, so no stranger can ever subscribe.** Section 2 is this.
2. **One slot, and the newcomer takes yours.** Also section 2 — no accounts needed.
3. **The UI lies when the save fails.** The bell says "You're set" regardless. Twenty minutes.
4. **The noticing screen is unreachable.** Needs a link and a `/[slug]/today` route.
5. **Nothing records a send, so you cannot tell it has stopped.** Section 2's `last_sent_at`
   turns "is it still working?" from an investigation into a glance.
6. **Eight of nine programmes have no coach banks.** Roughly 13 focuses × 4 tones each. Blocks
   pointing a lead magnet at anything but eating.
7. **No per-person start date.** A stranger needs to be on *their* week one. Section 2's
   `start_ms` column.
8. **Nothing joins a PDF to the app.** Named last so it isn't mistaken for something half-built.

---

## 5. What I could not settle, and why — explicit gaps

- **Whether the loop is live today.** Unresolved, in both directions. No Vercel CLI and no auth
  token on this machine, the cron writes nothing on success, and the only runtime probe sends a
  real push. Your phone answers this faster than any log I could pull.
- **Whether `PUSH_SUBSCRIPTION` and `CRON_SECRET` exist in the project environment.**
  `vercel env ls` from your Mac lists the names without exposing values.
- **Which Supabase project this should live in** — an existing estate project with `coach_`-
  prefixed tables, or its own. One-line taste call; the schema is identical either way. My
  recommendation: an existing project, because a second project is a second thing to key and back
  up for two tables.
- **Whether `import.meta.env` resolves at runtime or at build on this adapter** — see the sharp
  edge in section 2. Unverified; I did not run the site.

I ran nothing, sent nothing, and changed no code. This is a read of the repository as it stands.
