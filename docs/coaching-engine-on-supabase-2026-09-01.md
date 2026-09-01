# The coaching engine on Supabase: it can now coach strangers

*1 September 2026. Branch `feat/coach-supabase-multi-user`, not merged, deployed to a preview.*

## The verdict

It works, and it is proven against the real database rather than against a story about it. Two
tables exist in the estate Supabase; the store, both endpoints, the cron and both pages are
rewritten around one row per device; twenty-six new tests and one live two-subscriber probe say the
loop does what it claims. Nothing is merged, so production is running exactly the code it was
running this morning.

One finding you will want before anything else, because it changes what "don't break Tom's
notifications" means. I now have the Vercel access token, so this was established by trying, three
separate ways:

> **There is no `PUSH_SUBSCRIPTION` anywhere in the Vercel project, and there never has been.**

1. The project's full environment listing — both scopes, one project only — is nine variables:
   `ANTHROPIC_API_KEY`, `CRON_SECRET`, `VAPID_SUBJECT`, `VAPID_PRIVATE_KEY`, `VAPID_PUBLIC_KEY`.
   No `PUSH_SUBSCRIPTION`, no `PROGRAM_START_DATE`, no `WEEKLY_GOAL`, no KV variables.
2. Not just missing now — missing at BUILD time too. The live production deployment serving
   tomcassidy.co, and the four before it, each record which variables existed when they were built.
   None of the five had it. So nothing is baked into the running production bundle either.
3. Production `/api/push/goal` answers `{"goal":null,"canPersist":false}`, and a grep of this
   machine finds the name only in documentation, never in a value.

So there is nothing to migrate — not because I lacked access, but because the row does not exist.
The old cron has had nothing to load and nothing to send to: on every run it returns
`{"skipped":"no subscription stored"}`. Whatever worked when you tested it was not this scheduled
loop in its current state.

That makes the safety question simpler rather than harder. There is no live subscription for me to
break, and none for the shim to lift. Your route onto the new system is now one tap — and the
preview is live and working, so you can take it tonight (section 5).

## 1. The schema — applied, not just written

**Applied.** Both tables exist right now in project `swfvymspfxmnfhevgdkg`, the estate Supabase that
already carries the SSi learning app, Popty and Cowch. Nothing existing was altered or dropped; the
migration creates only `coach_*` objects and is written `create table if not exists` so it can be
re-applied anywhere. It is committed at `supabase/migrations/20260901_coach_subscribers.sql`.

`coach_subscribers` — one row per device: `id` (sha-256 of the endpoint, 32 hex chars), `endpoint`
unique, `p256dh`, `auth`, `program_slug`, `start_ms` (their week one), `created_at`, `last_sent_at`,
`last_status`, `fail_count`, `revoked_at`.

`coach_goals` — one row per person per week: `(subscriber_id, week_index)` as the primary key, plus
`text`, `blessed`, `set_at_ms`. Keyed that way on purpose: this week's goal is a single lookup and
previous weeks are kept rather than overwritten. It is the only record this product will ever have
of what somebody actually said they would do, and it costs nothing to keep.

Verified against the live database, not assumed:

- both tables present with every column as specified;
- `relrowsecurity = true` on both, and **zero policies** — which is the lock, since RLS with no
  policies denies everything and the service role bypasses it;
- the anon key gets `42501 permission denied for table coach_subscribers`;
- the service-role key reads it fine.

A push endpoint plus its keys is a credential — anyone holding it can push to that phone — so the
anon key being locked out is the point, not a detail.

## 2. Your row — the shim, and the honest answer

**The mechanism.** `src/lib/coach-migrate.ts`, called at the top of the cron handler. I picked the
cron over a dedicated `/api/push/migrate` route for one reason: it needs no action from you, and a
route you have to remember to curl is a migration that doesn't happen. It reads `PUSH_SUBSCRIPTION`
(plus `PROGRAM_START_DATE` and `WEEKLY_GOAL` if present) and, when no row exists for that endpoint,
writes one — programme `reasonable-eating`, start date in either epoch-ms or ISO form, falling back
to the `2026-06-22` constant. Any `WEEKLY_GOAL` becomes a `coach_goals` row at the week it names.
Its header says it is a shim to delete.

**What I proved.** Against the real tables: a well-formed subscription seeds a row with start
`2026-06-22T00:00:00.000Z` and its goal at week 2, text and blessing intact. Run a second time with
*deliberately stale keys* in the variable, it returned `exists`, wrote nothing, and left the live
keys alone. That second case is the one that matters — a shim that overwrote a live subscription
with a stale config value would be worse than no shim.

**The honest answer to "prove his row is present and intact": I cannot, because there is no such
row and no such variable to build one from** — see the finding above, which I established with the
token rather than assumed. A web push subscription only ever exists in two places: the browser that
created it and the push service. It was never written down here.

**So it is one tap, and it now works.** The preview is configured and live. Open
`https://tomcassidy-site-git-feat-coach-supabase-multi-user-zenjin.vercel.app/reasonable-eating` on
your phone, tap the bell, and a real `coach_subscribers` row appears — I proved that exact path
end to end tonight (section 5). Two honest notes on it: a subscription is bound to the origin that
created it, so a preview-created row delivers through the preview's service worker and its taps open
the preview URL; after you merge, tapping the bell once on tomcassidy.co creates the production one.
And the cron that would send to it is scheduled on production, not on the preview, so a preview row
sits there quietly until you merge. The shim stays in place either way, harmlessly returning
`no-env`, in case a `PUSH_SUBSCRIPTION` ever turns up.

## 3. What a second subscriber does that it could not do before

From a live probe against the real database — two synthetic subscribers, created, exercised, and
deleted:

| | subscriber A | subscriber B |
|---|---|---|
| start date | ten weeks ago | today |
| week they're on | `weekIndex 10`, rotation week 11 | `weekIndex 0`, rotation week 1 |
| programme | reasonable-eating | reasonable-teaching |
| what gets pushed | **their own blessed words**: "walk after lunch" | the authored bank line for week 1 of *their* programme |

Before this, both of those people were one config variable. The second one to press the bell
overwrote the first, and the goal box on the Today page was a single server-side value that every
visitor read and wrote. Concretely, what is new:

- **Their own week one.** A stranger who joins today starts at week 1, not at whatever week you are
  on. Re-tapping the bell later keeps their original start date — proven: B re-subscribed with a
  later start and the row kept its own `start_ms` while refreshing its keys.
- **Their own words.** The goal is keyed to them and to the week; A's blessed goal was pushed
  verbatim while B, who had set nothing, correctly got the authored line.
- **Their own programme,** resolved per row through the existing `programBySlug`.
- **A dead phone is pruned, not fatal.** B's send returned 410; the row was stamped `revoked_at` and
  dropped out of `listLiveSubscribers()` on the next read, while A's send was recorded
  (`last_status 201`, `last_sent_at` written) and A stayed live. In the unit tests the same holds at
  scale: twenty-five subscribers, one 410 and one thrown network error in the first chunk of ten,
  and the other twenty-three still got sent to. One uninstalled phone can no longer silence
  everybody.
- **You can tell whether it is still working.** `last_sent_at` and `last_status` are written on every
  attempt, so "has it stopped?" is a glance at a table instead of an investigation. A transient 500
  is recorded but *not* revoked — it retries on the next cron; only 404 and 410 revoke.

## 4. What landed

Six commits on `feat/coach-supabase-multi-user`:

1. **The schema**, committed and applied.
2. **`push-store.ts` rewritten** against Supabase over plain `fetch` — no new dependency, the same
   reason the old file gave for not taking the KV SDK. The env-var fallback is **deleted**, not kept
   as a third path: a silently read-only second backend is exactly what let the page say "You're
   set" over a write that never happened. Identity is sha-256 of the endpoint, always hashed
   server-side; an id accepted from a client would let anyone holding one read and rewrite that
   person's goal.
3. **`subscribe.ts`** — upsert on the endpoint hash, idempotent, refreshes keys, clears a
   revocation, keeps the existing start date. Returns a real **503** when there is nowhere to write.
4. **`goal.ts`** — takes the caller's endpoint (query string on GET, body on POST) and hashes it. The
   set/bless split is untouched: bless still sends no text, so what you confirmed and what gets
   pushed cannot diverge.
5. **`cron/coach.ts`** — a loop. `Promise.allSettled` in chunks of ten, per-row week and goal and
   programme, 404/410 revokes forever, every attempt recorded, and it returns
   `{attempted, sent, pruned, failed, migration}` instead of one boolean. The selection and pruning
   logic lives in `src/lib/coach-run.ts` as pure functions so it can be tested without a phone.
6. **Both pages honest.** The bell only says "You're set" when the server says it saved. The Today
   page does the `serviceWorker.ready` → `getSubscription()` handshake, sends its endpoint with every
   call, and shows a plain "turn the coach on first" state when this device has no subscription —
   with a three-second deadline on the readiness check, because `serviceWorker.ready` never resolves
   when nothing is registered.

**Tests: 56 pass, 26 of them new** (there were none over the store or the cron before). Plus one live
integration probe, described above, whose rows are cleaned up.

**Live on the preview** — first with the Supabase variables absent, which is how the honest-failure
states were proved:

- `POST /api/push/subscribe` with a valid subscription → **503**, "The coach store isn't configured
  yet, so nothing was saved. Nobody is subscribed." That is the old bug, dead: it used to answer
  `{"ok":true}` here.
- `POST /api/push/subscribe` with rubbish → 400. `GET /api/push/goal` → 503. `GET /api/cron/coach`
  without the secret → 401. `/api/push/vapid` → 200. The Today page renders. Then I set the
  variables and re-ran the whole loop for real — see section 5.

**The `import.meta.env` sharp edge is real, and it is ruled out.** In the built output,
`import.meta.env` is a frozen build-time object containing only Astro's own keys — no project
variables at all. Anything reading a credential through it literally would read `undefined` at
runtime forever. Every new read is a computed `import.meta.env[name] || process.env[name]`, and I
confirmed in `.vercel/output` that the `process.env` half survives the bundle, so a key set in Vercel
takes effect on the next request rather than the next deploy, and rotating it actually rotates it.
One leftover: `src/pages/api/push/vapid.ts` still reads its key the literal way. It works today
because Vercel exposes env at build time and the value gets inlined — but it means a VAPID rotation
would need a redeploy. I left it alone since it is outside this job and currently working; say the
word and it is a two-line change.

## 5. Configuration — done, not delegated

With the Vercel token I set both variables myself, on **Preview only**:

| name | environments | how I proved it |
|---|---|---|
| `SUPABASE_URL` | preview | created via the REST API, confirmed on the project |
| `SUPABASE_SERVICE_ROLE_KEY` | preview | same; the **service role** key, never the anon one |

Values come from the estate Supabase (project `swfvymspfxmnfhevgdkg`) and no value appears anywhere
in this document or in any log I wrote. Then I forced a fresh preview deployment so the new
variables were injected, and drove the whole loop against it from the outside:

```
POST /api/push/subscribe   → 200 {"ok":true,"id":"f1f6f843…"}      a real row appeared
GET  /api/push/goal        → 200 {"goal":null,"weekIndex":2}       their week, from their start date
POST /api/push/goal set    → 200 goal stored, blessed:false
POST /api/push/goal bless  → 200 goal blessed, same text, verbatim
GET  /api/push/goal        → 200 the blessed goal comes back
GET  /api/push/goal ?nobody→ 404 "Turn the coach on first."
```

I then read the rows straight out of Supabase — subscriber row with its own `start_ms` and
`program_slug`, goal row at `(subscriber, week 2)`, blessed — and deleted my synthetic subscriber,
which cascade-deleted the goal. **Both tables are empty right now**, waiting for the first real tap.

**Production is deliberately untouched.** No Supabase variables there, no merge, so it runs exactly
the code and config it ran this morning. When you want production live it is the same two variables
on the Production environment, and one call from me — say the word.

**Three flags, one line each:**

- **Seed mechanism: the cron, not a route.** It needs nothing from you; a route you have to remember
  to call is a migration that doesn't happen.
- **Supabase project: the estate's existing one.** Your ruling was "use Supabase, don't add a second
  datastore", the two tables are additive, and nothing in the code names a project — it is one
  environment variable if you ever want it elsewhere.
- **I sent no push to your phone.** Liveness is proven by row state instead. The 07:47 cron on
  production is unaffected, because none of this is merged.

## 6. Left undone, deliberately

- **The Today page's week header still comes from the global `PROGRAM_START`**, not the subscriber's
  own start date. The *push* is per-person; that one line of page furniture is not yet. It needs the
  programme data resolved per visitor and was outside this job's scope — worth naming rather than
  leaving for you to notice.
- Everything the brief put in the drawer: `/[slug]/today` routing, the missing link to the Today
  page, coach banks for the other eight programmes, the iPhone Home-Screen gate, anything joining a
  PDF to the app.
- The state-of-play doc and the Reasonable Wealth registry entry live on `docs/coaching-engine-state-of-play`, not on `main`. This branch is off `main`, so it does not carry them. Nothing here depends on either; you may just want them merged at some point.

---

**Landing line:** the seven commits are on branch `feat/coach-supabase-multi-user`, pushed to
origin; **not merged** — `main` and production are untouched and still running the old
config-variable code; deployed to the Vercel preview at
`tomcassidy-site-git-feat-coach-supabase-multi-user-zenjin.vercel.app`, where I configured the two
Supabase variables on Preview only and verified the full subscribe → set → bless → read loop live
against the real database, then cleaned my rows up. The two tables are applied and verified in the
live estate Supabase.
