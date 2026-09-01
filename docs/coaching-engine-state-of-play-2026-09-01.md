# Reason-Ability coaching engine: what is actually alive

*1 September 2026. Read-only scout. Every claim below is from a live probe of production, the
GitHub deployments API, or the code itself.*

---

## The verdict

**Half-alive, and the missing half is the half you care about.** The engine is deployed, the
service worker is real, and — this changed since the last audit — the VAPID push keys are now
genuinely set in production, so the browser side can build a subscription. But **there is no
store configured in production**, and I can prove it: the live server itself reports
`canPersist: false`. That means the moment anyone presses the button and subscribes, the server
has nowhere to write their subscription — it hands back a blob of JSON for you to paste into
Vercel by hand, while the page cheerfully says *"You're set."*

So: written, deployed, and never closed. I found **no evidence anywhere on this box that a push
notification has ever been delivered to a real device**, and I could not obtain any either way —
the only test that would settle it is firing the cron, which would send to your phone, and this
job was read-only.

---

## 1. Is it deployed, and where?

Yes. Production is **tomcassidy-site.vercel.app** (Vercel team `zenjin`), currently serving
build `260825-0327.7f62d14` — the head of `main`, deployed **25 August 2026, 03:27 UTC**.

**tomcassidy.com is not this site.** It answers 200, but it is a GoDaddy parking page — every
Reason-Ability route on it 404s. The custom domain is not attached to the Vercel project.

**Reasonable Wealth is not live.** Tonight's commit went out as a *preview* deployment only
(14:00 UTC). It is visible at the preview URL under `/explore/reasonable-wealth`, but there is
no `/reasonable-wealth` page anywhere — it is registry data plus the Explore route, not yet a
programme page. `git cherry main` shows the commit as `+`, i.e. not in main.

## 2. Does the cron actually fire?

**No evidence of a run, and I could not get any.** The three schedules are declared in
`vercel.json`, and Vercel only honours crons on production deployments — the current production
deployment does carry that file, so they *should* exist. But I could not confirm they are
registered on the host: the `vercel` CLI is not installed on this Linux box, and function
invocation logs are only reachable through it or the dashboard.

Worse, **the cron leaves no trace even when it works.** It sends and returns; it writes nothing
to any store, so there is no artefact to find. The loop is currently unobservable from outside.

One flag worth your attention: `vercel.json` declares **three** cron schedules. Vercel's Hobby
plan allows **two**, and triggers them only approximately once a day. If the project is on
Hobby, the 07:47 / 12:13 / 18:09 rhythm you designed is not what is happening. I could not check
the plan without CLI access.

## 3. Has a push ever genuinely reached a phone?

**No evidence that it has.** Positively:

- VAPID keys **are** set in production — `/api/push/vapid` returns a real public key. (It was
  503ing as recently as the 4 August audit, so this got done.)
- The service worker's `push` and `notificationclick` handlers are real and correct — it shows
  the notification and taps land you on the right week.

Against:

- No commit message, doc, log or note anywhere in the repo records a delivery to a device.
- Nothing in the code writes a record of a send, so there is nothing that *could* record one.
- The only remaining test is hitting the cron endpoint, which sends a real push to whatever
  subscription is stored. I did not do that.

**Honest statement: as far as any evidence on this box shows, the subscribe path has never been
exercised end to end.** To settle it in ten seconds: on your phone, open
`tomcassidy-site.vercel.app/reasonable-eating` and press "🔔 Tom in your pocket". If the reply
is anything other than a clean save, you have your answer — see the next section for why it
will not be.

## 4. Where does state persist? It doesn't.

`push-store.ts` picks between Vercel KV and a read-only env-var fallback. Production has
**neither KV nor a subscription store you can write to**: the live endpoint reports
`canPersist: false`.

In your terms: **someone who subscribes from their phone is not subscribed.** The server takes
their subscription, cannot save it, and returns a "paste this into Vercel and redeploy" payload.
The button then tells them "You're set. I'll bring this week's one thing to mind." That sentence
is currently false for everybody, including you.

Same for the weekly goal. The Today page will accept your one thing, show it back for blessing,
and warn in small text "there's no store configured — it won't survive." It doesn't survive.

And the scale ceiling is baked in and stated in the file's own header: **SOLO DOGFOOD — one
user, no accounts.** The keys are singular — `pocketcoach:subscription`, `pocketcoach:startMs`,
`pocketcoach:goal`. Even with KV switched on tomorrow, the second person to subscribe overwrites
the first.

## 5. What does the engine actually decide, and is it separated from the content?

**The separation is real in the engine and absent in the wiring.**

`coach-engine.ts` is genuinely programme-agnostic: every function takes a `Program` and works
out the rotation order, which week is live, the focus for that week, and a tone-weighted line
drawn from that focus's banks — falling back to the focus's single wisdom line where banks
aren't authored yet. Point it at wealth or teaching and it works, untouched. That is the
compiler you described.

But the two things that *use* it both hard-wire one programme. The cron opens with
`const PROGRAM = reasonableEating`. The Today page imports the same one, and lives at
`/reasonable-eating/today` rather than `/[slug]/today`. And **Reasonable Eating is the only one
of the nine programmes with tone banks** — the other eight have a single wisdom line per week,
so pointing the engine at them today gives you the same sentence repeated all week.

Also still present, from the August audit: `today.ts` computes total weeks as
cycles × domains, which is right for eating and wrong for any programme with a hub in rotation
(Ultimate 13×4 would read 12, not 13). `coach-engine.ts` gets it right; the Today page doesn't
use it. It bites the day you generalise.

## 6. The real journey, and where it breaks

Someone lands on `/reasonable-eating`. They see the wheel and a "🔔 Tom in your pocket" button.
They press it, grant permission, the browser builds a subscription against a real VAPID key,
and it posts to the server.

**That is where it breaks.** The server cannot store it, returns the paste payload, and the
button says "You're set." It is not set. No cron will ever push to them, because nothing knows
they exist.

Two further breaks behind that one, both real:

- **The Today page is unreachable.** Nothing on the site links to `/reasonable-eating/today`.
  It is designed to be opened by tapping a push — which never arrives. So the goal capture, the
  own-voice interrupt that is the whole point, is a screen no user can find.
- **On iPhone, push requires the site added to the Home Screen first.** The page carries an
  install prompt, but a first-time visitor who just presses the bell on Safari gets nothing.

---

## The gaps, ranked by what blocks a first real user

**1. There is no store. Nothing survives a subscribe.**
What exists: a complete two-backend store and a subscribe endpoint that both work. What's
missing: KV provisioned and `KV_REST_API_URL` + `KV_REST_API_TOKEN` set in production. This
blocks literally everything else — until it's done, no one but you can ever be reminded of
anything, and the UI lies to them while failing.

**2. One subscription slot, for one person.**
What exists: working single-user persistence. What's missing: a key per subscriber and something
to key it by. `pocketcoach:subscription` is a single value; the second lead-magnet signup
deletes the first. This blocks the loop having more than one customer, which is to say it blocks
the loop.

**3. Nobody can find the noticing screen.**
What exists: the Today page, with the set-and-bless loop, which is the best thing in this
codebase — it serves noticing rather than knowing, exactly as the 70% rule asks. What's missing:
a link to it, and a generalised `/[slug]/today` route. This blocks anyone experiencing the
product at all without a working push first.

**4. No proof of delivery, and no way to get proof.**
What exists: a correct sender and a correct service worker. What's missing: any record that a
push has ever landed, and any log the cron writes. This is written but never run, and it stays
that way until someone deliberately closes the loop once and writes down that it worked.

**5. Eight of nine programmes have no coach banks.**
What exists: an engine that reads banks from any programme, and one fully voiced programme.
What's missing: tone banks for wealth and the rest — roughly 13 focuses × 4 tones each. This
blocks pointing the lead magnet at anything other than eating; the PDF can promise a wealth
programme that the app cannot yet speak in.

**6. No "start my programme" step.**
What exists: a start date that is a constant in code, plus whatever the wheel keeps in the
browser. What's missing: a per-person start date captured when they sign up. This blocks a
personalised 13×4 being on *their* week one rather than yours.

**7. Nothing joins the PDF to the app.**
What exists: nothing yet — no questionnaire, no profile, no PDF, no handover. Named here only so
it isn't mistaken for something already half-built. Everything above must be true first, because
the thing they are signing up for is the remembering.

---

## What I could not settle, and why

- **Whether the crons are registered on the Vercel host, and whether any has ever run.** No
  `vercel` CLI on this machine; invocation logs are CLI/dashboard-only. `vercel logs` from your
  Mac closes this in one command.
- **Which Vercel plan the project is on** — and therefore whether three crons is over the Hobby
  limit of two.
- **Whether `PUSH_SUBSCRIPTION`, `CRON_SECRET` or the KV variables exist in the project
  environment.** `vercel env ls` from your Mac lists the names without exposing values. The only
  probe available from here was the cron endpoint, which would have sent a real push.
