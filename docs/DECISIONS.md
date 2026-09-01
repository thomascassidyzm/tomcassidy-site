# Decisions

Journal of decisions taken on this site, newest first. Each entry records what
was decided, why it wins on better × simpler × cheaper, and what would
falsify it.

---

## 2026-09-01 — Reasonable Wealth enters the registry as data, inner ring unbound

**Decision.** Reasonable Wealth is added to `ALL_PROGRAMS` as a data file only:
twelve spokes in two interleaved domains (THINKING = odd numerals, the right
half; ACTING = even, the left half), a week-13 in-rotation hub, and the wheel's
inner ring recorded whole on a new optional `Program.innerRing`. No programme
page, no weeks, no coach copy, no FAST teachings — the wheel, and only the wheel.

**Why it wins.** *Better*: the estate's most mature 13×4 specimen — and its only
distinction-form wheel — stops existing solely as an image, and is reachable at
`/explore/reasonable-wealth`. *Simpler*: it is one data file plus one optional
field; the shape it needs (two halves × six, in-rotation hub) is the interleaved
rotation the engine already runs, so no engine, geometry or validator change.
*Cheaper*: the render surface is the existing generated Explore route, so the
new programme costs one file and no new page to maintain.

**The inner ring is UNBOUND, deliberately.** The source gives the twelve lines
in reading-round order, which on an odd-right / even-left wheel is not numeral
order, so it does not establish which line sits under which spoke. Pairing them
would have been an agent guessing at Tom's own methodology, so `innerRing` holds
the list whole and the Explore surface says plainly that it is unpaired. The
smallest honest extension: one optional field, rendered behind a guard, which no
existing programme sets and therefore cannot alter.

**Coach wisdom is a placeholder, not draft prose.** `coach.wisdom` is a
validator requirement and this programme has no coach copy written. Each week
restates its own distinction verbatim rather than inventing lines in Tom's
voice. This is the one programme in the family whose wisdom lines are NOT drafts
to be finessed — they are empty slots wearing the spoke's own words.

**What would falsify it.** Tom saying the inner ring does pair spoke by spoke
(then the twelve lines move into `coach.wisdom` and `innerRing` is deleted), or
that spoke 2 — "REPETITIVE, EMOTIONAL, DETAILED", the one spoke not in X > Y
form — is unfinished rather than a deliberate exception.

---

## 2026-08-25 — Writing search reads bodies, and sees every published page

**Decision.** The /writing search matches full body text, and standalone
published pages join the index alongside the essays collection.

Tom, at four in the morning: *"can we improve search on my own site???? I can't
find the kenyan article anywhere..."* The piece was live the whole time, at
`/community-regeneration`, and unfindable for two independent reasons. First,
`searchBlob()` joined title, summary, topics and series only, so any word that
appears solely inside a piece — "kenya" being the specimen — returned "Nothing
matches that". Second, that page is deliberately not an essays-collection
entry, so the index could not see it at all whatever it searched.

His framing of what this is: *"it is pure findability."* Nothing is published
here that was not already public.

**Shape, and why.** Metadata blobs stay inline as `data-search`; body text
ships as a build-time `/writing-index.json` fetched once by the client. The
bodies are 161KB — inlining them would have taken /writing from 34KB to roughly
195KB for every visitor whether they searched or not. As shipped the page grows
3KB and the index is paid only by browsers that load the page's script, in the
background, after render. Better: the search finds what is actually written.
Simpler: no server, no search service, prerendering intact, one new file and no
new dependency. Cheaper: 3KB on the hot path, and a static JSON on a CDN.

**Standalone pages appear in their own block, hidden until a query matches
inside it.** The page was kept out of the /writing listing on purpose and that
intent still stands; browsing is byte-for-byte the experience it was, and the
block appears the moment he goes looking. Each card carries a plain kind marker
— "Pre-brief — forming" — so a forming piece never reads as a finished essay.
The registry stays the single `STANDALONE_PAGES` home in `essay-context.ts`,
extended in place with card fields; `guide-tools.ts` reads it unchanged.

**Ranking.** Title, summary and topic hits sort above body-only hits via CSS
`order` inside each block. No stemming and no fuzzy matching: plain lowercased
substring, all words present, which is what the site already did and is honest
about its limits.

**What would falsify it.** If the JSON grows past roughly half a megabyte the
fetch-everything shape stops paying and it wants a real inverted index. If
standalone pages ever outnumber the essays, the hidden-until-matched block
becomes a way to lose writing rather than find it, and they should join the
browse view properly.

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
