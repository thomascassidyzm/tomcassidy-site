# Reason-Ability coaching engine: it worked for one person

*1 September 2026. Read-only scout, revised after Tom confirmed the push path genuinely worked
and notifications arrived on his device. That is taken as established fact, not re-tested.*

---

## The headline

It worked for one person, and the thing standing between that and the first stranger is not the
push machinery — that is real and it delivered. **It is that there is no store.** The live server
reports `canPersist: false`, which means Vercel KV is not configured on the current production
deployment, and the only place a subscription can live is a **hand-pasted environment variable**.

That single fact reconciles everything. It explains how it worked for you — you pasted your
phone's subscription into Vercel as `PUSH_SUBSCRIPTION` and redeployed, exactly as the code's own
comment instructs. And it explains why nobody else can ever be subscribed: **the subscriber list
is a config value with one slot in it, editable only by you.**

The second stranger doesn't overwrite the first. The *first* stranger overwrites **you**.

---

## What is deployed

Production is **tomcassidy-site.vercel.app** (Vercel team `zenjin`), serving build
`260825-0327.7f62d14` — the head of `main`, deployed **25 August 2026**. VAPID keys are set and
live; `/api/push/vapid` hands out a real public key. The service worker's push and tap handlers
are correct.

**tomcassidy.com is not this site** — it answers, but it's a GoDaddy parking page and every
programme route on it 404s. The custom domain has never been attached to the Vercel project.

**Reasonable Wealth is not live.** Tonight's commit deployed as a *preview* only. It's visible on
the preview URL at `/explore/reasonable-wealth`; there is no `/reasonable-wealth` page anywhere
yet, and the commit is not in `main`.

---

## 1. Is it still working, or has it silently stopped?

**I could not get positive evidence either way, and I'll say plainly why: the only test that
would settle it is firing the cron, which sends a real push to your phone, and this job was
forbidden from doing that.** There is no `vercel` CLI and no Vercel auth token on this machine,
so the invocation logs are closed to me. Worse, **the cron writes nothing** — it sends and
returns — so even a perfect run leaves no artefact anyone could find afterwards. The loop is
currently unobservable from outside.

What I *can* do is name the three ways it stops silently, and rank them:

**(a) The subscription expired or was revoked. Most likely.** Web push subscriptions die when the
PWA is deleted, when the browser reissues, or on their own. When that happens the cron gets a
404/410, logs it, and returns `sent: false` — and nothing on the site changes, so you'd never
know. Nothing re-subscribes you automatically.

**(b) The store went away.** `canPersist: false` is precise: it means the KV credentials are
**absent from the project environment**, not that KV is unreachable. So either you were always on
the env-var path (very likely), or a KV integration existed and has since been removed or reaped.
Which one is a ten-second look at the dashboard.

**(c) The crons aren't firing as designed.** `vercel.json` declares **three** schedules. Vercel's
Hobby plan allows **two**, and fires them approximately once a day rather than at your chosen
minute. If this project is on Hobby, the 07:47 / 12:13 / 18:09 rhythm you designed is not what is
happening. I couldn't check the plan without CLI access.

**The cheapest evidence in the world is yours, not mine: did anything arrive on your phone
today?** Your answer settles this faster than any log I could pull. If yes, the whole loop is
alive and only the one-user shape is in the way. If no, it's (a) until proven otherwise.

From your Mac, two commands close the rest: `vercel env ls` lists which variables exist (names
only), and `vercel logs` shows whether the cron has been invoked.

## 2. The one-user shape, and exactly what it takes to fix

The file says it out loud: **"SOLO DOGFOOD — one user, no accounts."** The keys are singular —
`pocketcoach:subscription`, `pocketcoach:startMs`, `pocketcoach:goal` — and on the env-var path
it's worse than singular, it's a value you edit by hand and redeploy.

The good news is that **this needs no accounts, no login and no auth system at all**, because the
push subscription already *is* an identity: the endpoint URL the browser generates is unique to
that device. Hash it and you have a user id, for free, with nobody signing up for anything.

What it takes, concretely:

- **Provision KV.** Nothing per-user is possible while the store is an env var. Set
  `KV_REST_API_URL` and `KV_REST_API_TOKEN`; the code then switches backend on its own with no
  changes.
- **Key everything by that id.** `pocketcoach:sub:<id>`, `pocketcoach:start:<id>`,
  `pocketcoach:goal:<id>`, where `<id>` is a hash of the subscription endpoint.
- **Keep an index.** One set, `pocketcoach:subs`, holding the ids — because the cron needs
  something to iterate. Upstash speaks set operations over the same plain REST fetch the file
  already uses, so this adds no dependency.
- **Make the cron a loop.** Read the index, and for each subscriber compute *their* week from
  *their* start date and send *their* blessed goal. Today it computes one week for one person.
- **Prune on delivery failure.** The sender already sees the 404/410 that means "this device is
  gone" and currently just logs it. Delete that id instead, and the list stays clean by itself —
  which also fixes silent-stop (a) for everyone but you.
- **Let the Today page know who's asking.** It reads the single goal today. The browser can hand
  it its own subscription endpoint, so the page shows *your* one thing without a login.

That is a focused half-day, and it is the whole difference between a dogfood and a product.

## 3. The journey for someone who is not you

They land on `/reasonable-eating`, see the wheel and a "🔔 Tom in your pocket" button, press it,
grant permission. The browser builds a genuine subscription against the live VAPID key and posts
it to the server.

**That is where it breaks, on the first press.** The server has nowhere to write, so it returns a
"paste this into Vercel and redeploy" payload — and the page tells them: *"You're set. I'll bring
this week's one thing to mind, gently, a couple of times a day."* It's a promise the system
cannot keep, and they have no way to know it was never kept except by the silence afterwards.

Two further breaks sit behind that one:

- **The Today page is unreachable.** Nothing on the site links to `/reasonable-eating/today`. It
  is designed to be opened by tapping a push. So the set-and-bless capture — the own-voice
  interrupt, the one thing in this codebase that serves *noticing* rather than knowing — is a
  screen no visitor can find.
- **On iPhone, push needs the site on the Home Screen first.** There's an install prompt on the
  page, but a first-timer who just presses the bell in Safari gets nothing.

And on the engine itself: `coach-engine.ts` is genuinely programme-agnostic — the separation you
described is real, it takes any programme and works out the rotation, the live week and a
tone-weighted line. But everything that *uses* it hard-wires one programme: the cron opens with
`const PROGRAM = reasonableEating`, and the Today page is `/reasonable-eating/today` rather than
`/[slug]/today`. **Reasonable Eating is also the only one of the nine programmes with tone
banks** — the other eight have a single wisdom line per week, so pointing the engine at wealth
today gives the same sentence every day for a week.

---

## The gaps, ranked by what blocks the first stranger

**1. No store, so no stranger can ever subscribe.** The two-backend store and the subscribe
endpoint both work; what's missing is KV provisioned. Until it is, every signup silently fails
while being told it succeeded.

**2. One slot, and the newcomer takes yours.** Single keys, a single env value. Fixed by the
per-user shape above — no accounts needed, the subscription endpoint is the identity.

**3. The UI lies when the save fails.** Subscribe returns `persisted: 'manual'` and the button
still says "You're set." The Today page's goal box handles this honestly; the bell doesn't. This
one is twenty minutes and it stops the loop burning the first people who try it.

**4. The noticing screen is unreachable.** The Today page needs a link and a `/[slug]/today`
route. Without it, the product experience is a notification and nothing to arrive at.

**5. Nothing records a send, so you cannot tell it has stopped.** The cron leaves no trace. One
timestamp written per run turns "is it still working?" from an investigation into a glance.

**6. Eight of nine programmes have no coach banks.** Roughly 13 focuses × 4 tones each. This
blocks pointing the lead magnet at anything but eating — the PDF would promise a wealth programme
the app can't yet speak in.

**7. No per-person start date.** The start is a constant in code plus whatever the browser keeps.
A stranger needs to be on *their* week one, not yours.

**8. Nothing joins the PDF to the app.** No questionnaire, no profile, no PDF, no handover — named
last only so it isn't mistaken for something half-built. Everything above has to be true first,
because what they're signing up for is the remembering.

---

## What I could not settle, and why

- **Whether the loop is still live today.** No CLI, no token, no logs, and the cron writes nothing
  — and the one available runtime probe sends a real push, which I was forbidden to do. Your own
  phone answers this better than I can.
- **Whether `PUSH_SUBSCRIPTION` and `CRON_SECRET` exist in the project environment.**
  `vercel env ls` from your Mac lists the names without exposing values.
- **Whether the crons are registered on the host and which plan the project is on** — and so
  whether three schedules exceeds Hobby's limit of two.
