# Decisions

Journal of decisions taken on this site, newest first. Each entry records what
was decided, why it wins on better × simpler × cheaper, and what would
falsify it.

---

## 2026-08-24 — Alexander goes live on tomcassidy.co

**Decision.** The reading-companion guide is enabled in production. The
`ANTHROPIC_API_KEY` environment variable is set on the `tomcassidy-site` Vercel
project across production, preview and development, sourced from the same key
that already powers Alexander on zenjin.app and dp.tomcassidy.co, so all three
bill to one place.

Tom's ruling, verbatim: *"that's the point of a living epistemic work with a
built in epistemic guide — zenjin.app uses it properly so let's copy what we
did there, also for DP."* The `.env.example` note warning against configuring a
key casually predates this ruling and is superseded by it. The site's guide is
not a resting state to be preserved; the no-key 503 was simply missing config.

**Why it wins.**

- *Better*: the essays now carry the guide they were written to have. A reader
  on `/community-regeneration` can ask about the page and get an answer from
  the page's own text.
- *Simpler*: no new code paths, no new service. One environment variable plus
  a guard fix that deletes a divergence between this repo and its two siblings.
- *Cheaper*: spend is bounded by guards that already existed and are now
  actually correct — a 15-request-per-5-minute per-IP sliding window, a
  same-origin refusal for cross-site callers, a 50 kB body cap, and a
  server-side-only model constant no caller can influence.

## 2026-08-24 — Port the Vercel-proxy same-origin fix from distinction-physics

**Decision.** `src/pages/api/guide.ts` gets `allowedHosts()` and the corrected
`isSameOrigin()`, taken verbatim from
`distinction-physics/src/pages/api/guide.ts` (commit `2815360`, 2026-08-11),
comment included.

**The defect.** The old check compared the caller's `Origin` against
`new URL(request.url).host`. Behind Vercel's proxy that is the *internal
invocation host*, not the public hostname. Every real browser fetch from the
site's own page therefore 403s, while `curl` — which sends no `Origin` and is
deliberately let through — sees a perfectly healthy endpoint. This is the
failure Tom hit before ("last time it was CORS errors"), and it would have bitten
again the moment the key was set, because the probe that says "it works" is
exactly the probe the bug cannot fail.

The fix reads the public hostname from `x-forwarded-host` and `host` as well.
That does not widen the guard: browsers set `Host` themselves and refuse
`x-forwarded-host` as a forbidden header, and Vercel's edge overwrites both, so
a genuine cross-site caller still fails on its own `Origin`. Verified live:
`Origin: https://example.com` is refused 403 on both sites.

**Also.** `isRateLimited` moves to the shared `(ip, log, max)` signature that
distinction-physics and zenjin use, so the three implementations read the same.
This endpoint has a single tier, so it has one log and one budget; the
escalated sub-limit those siblings carry stays *dormant* rather than inventing a
deep-answer tier this site does not have. Adding one is a product change, not a
guard fix. The richer `Retry-After` here — counted from the oldest request still
in the window rather than a flat window — is kept, as it is strictly better than
the sibling behaviour.

**Open, for Tom.** This site's guide runs `claude-haiku-4-5-20251001`; zenjin's
runs `claude-sonnet-5` at low effort. "Copy what we did there" could be read as
including the model, but that is a spend increase and a taste call about how
the companion reads, so the model was left unchanged. It is a one-constant
change if he wants it.
