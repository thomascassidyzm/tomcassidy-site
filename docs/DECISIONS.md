# Decisions

Journal of decisions taken on this site, newest first. Each entry records what
was decided, why it wins on better × simpler × cheaper, and what would
falsify it.

---

## 2026-09-06 — The daily voice is the user, quoting themselves

**Decision.** The daily coaching line is the USER'S OWN WORDS given back to them. Not
Alexander, not Tom. Tom, ruling after two options were put to him and he took neither:
*"I think we moved towards the voice is the user themselves as a result of creating their
own wheel, as an output from the WAYL assessment"*. The wheel is an output of the person's
own assessment, so what is on it is already theirs; the daily tick reflects their commitment
rather than advising on it. This is the Gateway Question — what WOULD you choose? — with a
week between the asking and the arriving.

**What it settles in the doctrine.** It closes the seam `docs/SCRIPT-AND-WHEEL.md` §5.2
flagged as the strongest honest break in "the Script and the wheel are one selector": that
the wheel pre-commits and the Script never does. That is a break only while the
pre-commitment belongs to somebody else. A pre-commitment in the user's own words is the
Script deferred — the same selection, made on Sunday, delivered on Wednesday. Same mechanism,
different latency, and latency is the axis the whole paper is organised on. §5.1 (content
comes from discernment) and §5.3 (lineage) stand unchanged. Recorded in that document as §0.

**Why it wins.** Better: nobody is being coached at by a persona, so the line cannot be
wrong about them — it is a quotation, and its authority is their own. Simpler: no voice to
design, no persona to keep consistent, no register call per programme. Cheaper: a day tick
that quotes has nothing to generate, so the push loop's zero model calls stops being an
efficiency and becomes a correctness property.

**What it changes in the code's status, not yet its shape.** `coach-engine.ts`'s verbatim
rule — *"Never rewritten, tidied, capitalised or wrapped in encouragement"* — was a courtesy
and is now the product. The authored tone banks in `src/lib/programs/*.ts` are Tom's voice,
which is what the daily line is now *not*; they stay as the honest fallback for a week where
the person has said nothing, and every time one fires is a week the machine failed to get
their words.

**The gap this exposes, reported not built.** The site already keeps the user's own words for
one sentence a week — `coach_goals.text`, blessed by confirm-back — and already prefers it
over the bank. What it does not have is any link to WAYL: the thirteen points are
hand-authored programme data, a subscriber picks a published wheel, and no wheel is generated
from any assessment. WAYL lives in a different repo and its retention was audited separately.

**What would falsify it.** A daily line that lands as cold or accusing precisely *because* it
is the person's own sentence — the Wednesday-guilt failure the no-civil-war doctrine exists to
prevent. If quoting someone back reliably re-ignites the internal civil war, the voice is
wrong however clean the doctrine is.

---

## 2026-09-06 — The Script and the wheel are one method at three tick rates

**Decision.** The 13x4 wheel coach and the Script are not two methods. They are one
selector run at three tick rates: thought, week, year. The Script is the selector.
The wheel is the same selector with the choosing done in advance and held for a
week. The Sausage Machine is the coupling between altitudes. Full argument and
the move-by-move mapping in `docs/SCRIPT-AND-WHEEL.md`.

**Why it wins.** Better: one voice and one move for the coach, instead of a
coaching mode and a reminder mode that never meet. Simpler: the conversation
becomes the Script run inside this week's slot, which needs three inputs that
all already exist in code. Cheaper: no new doctrine, no new persona, and the
push loop stays free of model calls.

**What it does not decide.** Who the daily voice is, Alexander or Tom, stays
Tom's call. Discernment is a separate setup operation that the Script does not
contain.

**What would falsify it.** A Script move that has no counterpart at week or year
altitude, or a wheel behaviour that cannot be read as a held selection. The
mapping table lists every move; a row that will not fill is the test.

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
