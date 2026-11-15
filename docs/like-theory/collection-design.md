**DRAFT design sketch for Tom. NOT built.** Nothing here runs. It's the plan for whoever builds it, once Tom has answered the three questions at the end.

# Building the room: anonymous results, and checking the OCEAN map

## Why collect anything

Two things we can't do without our own players:
1. **The room.** "Out of 100 people, you're around 35 to 55" needs real people to place you among. With no players, any number is made up.
2. **The OCEAN check.** The map (ocean-map.md) says which IPIP items each option shares ground with. Only a measured correlation can say whether a lean actually tracks its OCEAN neighbour.

## What is sent

Nothing leaves the phone until the person says yes (see consent). Then one row per completed section:

| Field | What | Why |
|---|---|---|
| `bank_version` | e.g. `2.0` | Rankings only mean something against the exact moments |
| `answers` | the same compact string the link already carries, **name stripped** | Lets us rescore when the engine changes, instead of storing scores |
| `sections` | 1, 2 or 3 | The room is built per depth (see bands) |
| `host` | `tomcassidy.co`, later `cowch` | Rooms may differ by host; keep them separable |
| `day` | the date, no time | Enough to spot a bad batch; not enough to match a visit |
| `ipip` | optional, 1–5 per item, only if they did the short questionnaire | The correlation |
| `prev_answers` | optional: their earlier answers, if they replayed from a saved link | Gives retest and direction-of-travel data **without any id** |

**Never sent:** the name, the Guess-me friend's data, the stated self-placement, IP address, user agent, any device or account id. The server drops the name field even if a client sends it. No cookie, no tracking. The row isn't linked to anything, so it can't be joined to a push subscription either.

## Consent line

At the result, below the lean lines, an **unticked** box:

> **Add my answers to the room.** No name, nothing that identifies you. It's how we'll be able to show where you stand among everyone who's played.

The draft wording is for Tom to rewrite. Opt-in rather than opt-out, because the October study's point stands: "your answers never leave your phone unless you choose" is a feature to lead with.

## Where it's stored

The site's Supabase is shared with SSi, Popty and Cowch. So it gets the `coach_subscribers` pattern exactly:

- its own table, `like_results`, created by an additive, idempotent migration that touches nothing else;
- **RLS on, with no policies**, so only the server, holding the service-role key, can read or write;
- one server route to insert a row, rate-limited the same way the guide is;
- one route that serves **only aggregates**: per lean, per depth, per host, the sorted distribution in coarse bins. Raw rows are never served to a browser.

The migration is applied by hand in Supabase, like the coach's, and red-team or worker jobs never apply it.

**Health and politics.** UK GDPR treats health data and political opinions as special category (see evidence.md §5). Keep both off the table: never derive or store anything labelled as a health inference from Sensitivity, and never ask IPIP's O6 Liberalism items, which ask how people vote. Anonymous rows with no id are the main protection. The minimal field list above is the second.

## The optional short questionnaire

After the result, and only for people who ticked the consent box, a second offer: *"Got three more minutes? Twenty-eight quick statements help us check our moments against the standard test."*

Recommended set, 28 items, all public domain:
- **Mini-IPIP, 20 items** for the five domains ([key](https://ipip.ori.org/MiniIPIPKey.htm)). Short, and it has no political items.
- **C6 Cautiousness, 4 items, and E5 Excitement-seeking, 4 items**, from the IPIP-NEO-120 ([key](https://ipip.ori.org/30FacetNEO-PI-RItems.htm)). These give Risk appetite something to be tested against, which the Mini-IPIP alone doesn't.

The 120 is too long for a phone and carries the political items. The 50-item Big Five is a reasonable middle option if the Mini-IPIP's low reliability (alphas .65–.77) turns out to blur the correlations.

## How many people

**For the correlation**, between one of our leans and its IPIP domain, measured on the same people:

| If the true correlation is around | to know it within ±0.15 | within ±0.10 |
|---|---|---|
| 0.3 | ~145 people | ~320 |
| 0.4 | ~125 | ~275 |
| 0.5 | ~100 | ~220 |

That's standard arithmetic for a 95% interval, worked out here rather than quoted. In practice: **a first read at about 150 who did the short questionnaire, and a settled answer at about 350.** Expect the numbers to come out lower than the true link, because neither measure is perfectly reliable. With the Mini-IPIP's alphas, and if our leans turn out about .6 reliable (unmeasured), a true link of .7 would show as about .45.

**For the room bands.** A person's band has two blurs:
1. **Their own blur, from how many moments they answered.** It is fixed by the engine, and it's the same for everyone at the same depth. On the 0–100 scale, the engine's half-width today is:

   | After | O | C | E | A | N | R |
   |---|---|---|---|---|---|---|
   | 10 moments | ±16 | ±13 | ±15 | ±17 | ±16 | ±21 |
   | 20 | ±13 | ±10 | ±12 | ±14 | ±11 | ±14 |
   | 30 | ±11 | ±8 | ±10 | ±11 | ±9 | ±11 |

   These widths are the engine's own rule of thumb, not a measured interval. Retest data, from `prev_answers`, is how we'd replace them with measured ones.
2. **The room's blur, from how many players.** Near the middle of the room, a place out of 100 is uncertain by about ±10 places with 100 players, ±5 with 400, and ±3 with 1,000.

So **past about 400 players per depth, more players barely narrow your band, and more moments do.** That's the honest reason behind "10 is ok, more is better". Your band is your own blur, carried across the room's shape. How many places that covers depends on how spread out the room is, and the first ~200 players will show that. A band should only be shown when it's narrower than about half the room. Otherwise say "near the middle".

**Build a room per depth.** People who answered 10 moments must be placed among others who answered 10, because scores from fewer moments scatter more widely, so the two rooms have different shapes.

**The wording has to fit what it is:** "out of 100 people who've played", never "out of 100 people". Our players aren't everyone. The skin bans "of 100" today. Lifting that ban is a copy change for Tom, made only once bands exist.

## What would show the mapping is wrong

The map makes predictions. These results would break them:
- **C, E or N below about r = .3** with their IPIP domain at 350 people. The map calls these close, so a weak link means the moments or the weights don't do what the map says.
- **A lean matches a different domain better than its own**, for example our A tracking IPIP Neuroticism more than IPIP Agreeableness. Then the label is wrong, whatever the number.
- **The ⚠ sign options** (moments 9d, 22c, 28c in the map): if people who pick them score in the *opposite* direction on the IPIP facet from our weight, the weight is wrong and gets flipped or zeroed.
- **R.** If R tracks reversed Cautiousness above about .7, it's mostly C6, not a sixth lean. If it tracks neither C6 nor E5, it may be its own thing, but then it's unchecked, and the result screen should say so more quietly.
- **Retest.** If people who replay within a few weeks, using `prev_answers`, land far apart on a lean, beyond the blur above, that lean is noise before it's anything else.

A low A correlation alone would **not** break the map. The map already predicts it, because our low pole is candour, "saying the plain thing", and IPIP's is hostility.

## Cost

One migration, one insert route, one aggregate route, one consent box, one optional 28-item page. No new service, no accounts, nothing running between visits. Cowch can reuse the same table, separated by `host`.

---

## Three questions for Tom

1. **Consent:** an unticked "Add my answers to the room" box at the result, wording yours? *My recommendation: yes, opt-in, unticked.*
2. **Ask the IPIP at all?** *My recommendation: yes, as a second opt-in after the result. Mini-IPIP plus 4 Cautiousness and 4 Excitement-seeking items, 28 in all, on tomcassidy.co only, until about 350 people have done it. Then switch it off.*
3. **When does the room appear?** *My recommendation: per depth, once 400 people have played to that depth, shown as a band, with "near the middle" when the band is wider than half the room.*
