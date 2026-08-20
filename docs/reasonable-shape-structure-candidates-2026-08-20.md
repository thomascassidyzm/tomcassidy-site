# Reasonable Shape — candidate wheel architectures

> Structure scout, 2026-08-20. Five candidate architectures for Reasonable Shape, each as a
> complete sketch with every focus-point slot filled. **This is options-for-selection.** Tom is the
> selector. Nothing here is a recommendation, nothing here is built, and no hub copy is written —
> hub wording is his taste call, not mine.
>
> Read against `docs/REASON-ABILITY-CANON.md`, `src/lib/programs/reasonable-eating.ts`,
> `src/lib/programs/ultimate-13x4.ts` and `src/kit/validate.ts`. Where a candidate needs Tom's own
> movement principles, the gap is named as a gap and not filled with invention.

---

## The brief, as ruled

Tom's settled rulings, carried verbatim, because the structures have to obey them.

**On the shape of the wheel.** "We want some components that domains should probably be three or
four with either four or three parts to them, focus points to them each, terms of symmetry." And:
"It makes sense to probably have three domains if we can do it."

**On what Shape is for.** "the actual whole reasonable plan, for reasonable people, it's a reasonable
implementation. It's not something that is going to require fanaticism."

**On what Shape contains.** "my thinking was that reasonable shape would incorporate the main
principles of reasonable eating. It would also layer in ideas that relate to movement and relate to
sleeping. And potentially other areas, potentially breathing as well."

**On eating's place in it.** "I know that we need some component of eating in there, because really,
eating is probably the biggest shortcut to actually getting into good shape. And getting control of
your eating is the gateway to everything else". And on why eating leads the whole method: "It's the
University of the Will. If you learn to control your desire for food, then, I mean, okay, you could
learn to control your desire for oxygen as well, and maybe that's, you know, being able to manage
that."

**On the eating compression.** "we could easily reduce the eating program to just three, which would
be the how, the when, and the what. We don't really need the why to be in the overall reasonable
shape program as well."

**On breathing.** "we could fold in breathing as part of the moving or part of the sleeping. There
are ways to be clever about this."

**On the named grammar.** "There's a book, I think, called Eat Sleep Move, which so that these are
the things you need to pay attention to."

**On the search.** "everything is up for grabs."

---

## Two things found in the estate that change the problem

**1. Tom's own Ultimate 13×4 already contains this programme in miniature.**
`src/lib/programs/ultimate-13x4.ts` has a HEALTH domain of exactly four focuses: **Eat Less** (week
2), **Move More** (week 5), **Breathe Deeply** (week 8), **Sleep Well** (week 11). So the
Eat / Move / Breathe / Sleep grammar is not borrowed from a book — it is already Tom's, sitting on a
shipped wheel, one domain wide. Reasonable Shape is that domain promoted to a whole wheel. Every
candidate below is, in effect, a different way of blowing up that single quadrant.

**2. Shape's hub has an inversion already sitting in the estate, waiting.** That same wheel's
eating algorithm is **Eat Less**. Reasonable Eating's hub is **EAT MORE** — and its whole genius is
that it inverts the field's dominant script in two words. Shape's dominant script is not restriction;
it is **fanaticism** — shape as gym-punishment, earned through suffering, deserved by the disciplined.
Every candidate below names its inversion target and the direction of travel. None of them writes the
words. That is Tom's.

---

## What "complete sketch" is being measured against

`src/kit/validate.ts` enforces the structure at build time, so a candidate that fails it is not a
candidate. The binding invariants:

- **1 to 4 domains**, and domain **pigments must be distinct** — there are exactly four pigments
  (`derived`, `established`, `contested`, `open`), so a four-domain wheel uses the full house.
- On the **default interleaved rotation, every domain must have exactly `cycles` focuses.** Uneven
  domains are legal only under `rotationStyle: 'sequential'` (Great Teaching runs 1/4/1/6).
- Every focus needs a `name`, at least one **mnemonic line**, and `coach.wisdom`. The hub needs
  `coach.wisdom`.
- Weeks must be **contiguous 1..N with no duplicates**, counting the hub only when
  `hub.inRotation` is true.

So two symmetric shapes are available, and both come out at thirteen algorithms:

- **3 domains × 4 focuses** = 12 weeks + hub. With an always-on hub the weeks run 1..12; with a
  week-1 in-rotation hub they run 1..13 (the Ultimate 13×4's shape exactly).
- **4 domains × 3 focuses** = 12 weeks + always-on hub (Reasonable Eating's shape exactly).

Tom leans three domains. Four of the five candidates below are 3 × 4; one is 4 × 3, and it is the one
where the eating compression lands with no strain at all.

**The three-into-four problem, stated once.** The eating material compresses to HOW / WHEN / WHAT —
three. A three-domain wheel needs **four** focuses per domain. So any candidate that keeps eating as
one domain has a fourth eating slot to fill, and there are only three honest ways to fill it: split
one of the three, re-admit the WHY Tom set aside, or promote something from the hub. Each candidate
below says which it does. This is the single most consequential mechanical consequence of preferring
three domains, and it is worth Tom seeing it in the open rather than discovering it in the build.

---

# Candidate 1 — EAT · MOVE · SLEEP

**Organising principle:** shape is made by three inputs to the body, and each input is a domain.

The named grammar, taken straight. Three domains, four focuses each, breathing folded in rather than
standing alone — which is the "ways to be clever about this" Tom pointed at. Twelve weeks, always-on
hub, thirteen algorithms.

### EAT — *How you feed the body* · pigment `derived`

Weeks 1, 4, 7, 10.

- **Chew until liquid** — the HOW. Let the teeth do the work the gut shouldn't have to. Lifted
  wholesale from Reasonable Eating week 1.
- **Hunger >> Appetite** — the WHEN. Appetite is the menu in your head; hunger is the signal in the
  body. Wait for the body to ask.
- **Did it grow into its shape?** — the WHAT. An apple looks like an apple; a crisp looks like a
  factory.
- **Stop when no longer hungry** — the fourth slot. Aim for "not hungry", not "full".

*Where eating lives:* as one intact domain, using Tom's HOW / WHEN / WHAT compression for the first
three slots. The fourth slot is filled by **splitting WHEN** — "when to start" and "when to stop" are
genuinely different practices, and the stop algorithm already ships with its own interactive slider,
so it is the cheapest fourth to build. **What is lost:** the WHY domain goes, and with it *Eat for
fun* — the guilt-free-treat algorithm. In a programme whose entire enemy is fanaticism, dropping the
one algorithm that explicitly licenses pleasure is a real cost, not a rounding error.

### MOVE — *How you move the body* · pigment `contested`

Weeks 2, 5, 8, 11.

- **Move More** — Tom's own, verbatim from the Ultimate 13×4. Motion woven through the day beats the
  occasional heroic workout.
- **Carry something heavy** — the strength leg, in one reasonable weekly instruction rather than a
  programme.
- **Breathe through the nose** — breathing folded into MOVE. Nasal breathing is the one movement cue
  that costs nothing and passes the brother-in-law test without a gym in sight.
- **Get up more often** — the sitting algorithm. Interrupt the sit; the interruption is the practice,
  not the workout.

> **EXPLICIT GAP.** Tom has said: "I've been doing a lot of the exercise on the physical and the
> movement stuff, and I've got some principles already." **I have not seen those principles.** The
> four titles above are placeholders drawn from what is already in the estate (`ultimate-13x4.ts`)
> and from the level of common ground that dogma 3 would find in any three popular books. **This slot
> is where Tom's existing movement principles go**, and they should replace these outright rather
> than be reconciled with them. The same gap applies to the MOVE content in every candidate below and
> is not repeated.

### SLEEP — *How you recover* · pigment `open`

Weeks 3, 6, 9, 12.

- **Sleep Well** — Tom's own, verbatim from the Ultimate 13×4. The umbrella algorithm.
- **Same window** — a consistent sleep window beats a longer one. The rhythm is the intervention.
- **Dim before dark** — light down in the last hour. Cheapest possible lever on sleep onset.
- **Put the day down** — the wind-down algorithm; the second natural home for a breathing focus if
  Tom would rather breathing lived here than in MOVE.

*Where breathing lives:* **folded into MOVE**, as one focus point ("Breathe through the nose"), with
SLEEP's "Put the day down" as the declared alternative home. It does not get a domain, because giving
it one forces the four-domain shape and Tom leans three.

**Hub — inversion target.** The script this hub must invert is **fanaticism**: that shape is earned
through suffering, that the gym is the price and the body is the receipt. Direction of travel: from
*punishment* to *provision* — the body is not a debt to be paid down, it is a system you supply.
Eating's hub inverts restriction with abundance; Shape's hub has to invert punishment with something
that reads as generous in the same two beats. *Hub wording is Tom's call, not mine — I am naming the
target, not the words.*

**Hub role:** **always-on Algorithm Zero**, as eating's EAT MORE. The structure implies it because
the three domains are three *ongoing* supply lines, not three stages — nothing here happens once, so
nothing wants a week of its own.

**Against the dogmas.** *Marginal gains:* strong — twelve small levers, none of which alone changes
anything. *One thing at a time:* strong — the rotation gives you eating one week, moving the next,
sleeping the next, and by design you never work two at once. *Discernment:* strong — this is exactly
the shape the popular literature converges on, so it is the easiest to defend and the least
distinctive. *A reasonable plan:* grokable instantly by anyone; the brother-in-law test passes on
every slot. **Weakness:** it is the obvious answer, and it does not teach anything the person did not
already know they should do. Its whole value is the rotation and the reminders. It is also the
candidate that most makes Reasonable Eating look like a *component* rather than the gateway Tom says
it is — one of three peers, not the University of the Will.

**Kit-validity:** passes `validate.ts` clean. 3 domains, 3 distinct pigments, 4 focuses each,
`cycles: 4`, weeks 1..12 contiguous, `hub.inRotation` absent.

---

# Candidate 2 — HOW · WHEN · WHAT (the eating grammar, generalised)

**FRAME-BREAKER.** **Organising principle:** the domains are not areas of behaviour, they are the
three *questions* — and each question is asked of the whole body rather than only of food.

This is the candidate that treats the 13×4 as a genuine chassis. Reasonable Eating cuts one area four
ways. Instead of abandoning that move for Shape, this generalises it: HOW you do it, WHEN you do it,
WHAT you do it with — asked of eating, moving, sleeping *and* breathing. That gives a perfect 3 × 4
matrix, and breathing gets full parity without costing a domain.

|  | HOW | WHEN | WHAT |
|---|---|---|---|
| **eat** | Chew until liquid | Hunger >> Appetite | Did it grow into its shape? |
| **move** | Move well before more | Move through the day | Carry something heavy |
| **sleep** | Put the day down | Same window | Dark, cool, quiet |
| **breathe** | Through the nose | Slow when it counts | Fill the bottom first |

### HOW — *How you do it* · pigment `derived`

Weeks 1, 4, 7, 10.

- **Chew until liquid** — quality of execution, applied to food.
- **Move well before more** — quality of execution, applied to movement: the shape of the movement
  before the amount of it.
- **Put the day down** — quality of execution, applied to sleep: how you arrive at sleep decides most
  of it.
- **Through the nose** — quality of execution, applied to breath.

### WHEN — *When you do it* · pigment `contested`

Weeks 2, 5, 8, 11.

- **Hunger >> Appetite** — timing, applied to food. The signal, not the menu.
- **Move through the day** — timing, applied to movement: spread rather than concentrated.
- **Same window** — timing, applied to sleep: the rhythm beats the total.
- **Slow when it counts** — timing, applied to breath: the deliberate slow breath at the moment of
  stress.

### WHAT — *What you do it with* · pigment `open`

Weeks 3, 6, 9, 12.

- **Did it grow into its shape?** — substrate, applied to food.
- **Carry something heavy** — substrate, applied to movement: what kind of load, not how long.
- **Dark, cool, quiet** — substrate, applied to sleep: the room is an input.
- **Fill the bottom first** — substrate, applied to breath: what a full breath actually is.

*Where eating lives:* **distributed, one focus per domain**, and the HOW / WHEN / WHAT compression is
used *as the domain names themselves*. This is the only candidate where Tom's compression is the
architecture rather than a squeeze. No fourth-eating-slot problem exists here, because eating takes
exactly three of the twelve weeks — one per domain.

*Where breathing lives:* **as the fourth row of the matrix**, one focus in every domain. It gets
equal weight to eating, moving and sleeping without a domain of its own. This is the cleverest
available answer to Tom's "there are ways to be clever about this."

**Hub — inversion target.** The script to invert here is **that shape is a project you undertake**.
Direction of travel: from *project* to *manner* — you are already eating, moving, sleeping and
breathing today; the only question is how, when and with what. Nothing is being added to the day.
That is also the strongest possible statement of minimum will. *Wording is Tom's.*

**Hub role:** **always-on Algorithm Zero.** The three questions never stop being live, so the hub is
the standing instruction to keep asking them.

**Against the dogmas.** *Marginal gains:* strongest of the five — it is literally twelve one-percent
adjustments to things you already do. *One thing at a time:* strong. *Discernment:* strong, and the
matrix makes it auditable — you can see instantly whether a claimed principle is a HOW, a WHEN or a
WHAT, and whether a cell is weak. *A reasonable plan:* here is the **weakness, and it is the real
one**. "HOW / WHEN / WHAT" is grokable when the subject is *eating* — the question line "How you eat"
does the work. Applied to the whole body, the domain reads "How you… do what?" A person landing on
the wheel cold sees three abstract question-words rather than three parts of their life. The wheel
becomes elegant to the author and vague to the user. That is a real risk in a programme whose fourth
dogma is *easy to grok*.

**Kit-validity:** passes `validate.ts` clean. 3 domains, distinct pigments, 4 focuses each,
`cycles: 4`, weeks 1..12. It also has a property no other candidate has: the four-row matrix means
**adding a fifth area later is impossible without breaking symmetry**, which is either a discipline
or a cage depending on your view.

---

# Candidate 3 — EAT · MOVE · SLEEP · BREATHE

**Organising principle:** the same three inputs as Candidate 1, plus breath at parity — four domains,
three focuses each, and eating's compression lands exactly with nothing left over.

This is the 4 × 3 candidate, and it is included because it is the *only* shape in which Tom's own
compression ruling fits with zero strain: HOW, WHEN, WHAT — three focuses, three slots, done. It is
Reasonable Eating's exact structural shape, so it is also the cheapest thing in the estate to build,
and it takes the full four-pigment house.

### EAT — *How you feed the body* · pigment `derived`

Weeks 1, 5, 9.

- **Chew until liquid** — the HOW.
- **Hunger >> Appetite** — the WHEN.
- **Did it grow into its shape?** — the WHAT.

### MOVE — *How you move the body* · pigment `contested`

Weeks 2, 6, 10.

- **Move More** — Tom's own, verbatim from the Ultimate 13×4.
- **Carry something heavy** — the strength leg in one instruction.
- **Get up more often** — interrupt the sit.

### SLEEP — *How you recover* · pigment `established`

Weeks 3, 7, 11.

- **Sleep Well** — Tom's own, verbatim from the Ultimate 13×4.
- **Same window** — the rhythm beats the total.
- **Dim before dark** — light down in the last hour.

### BREATHE — *How you settle* · pigment `open`

Weeks 4, 8, 12.

- **Breathe Deeply** — Tom's own, verbatim from the Ultimate 13×4.
- **Through the nose** — the default-setting algorithm.
- **Slow when it counts** — the deliberate breath at the moment it matters.

*Where eating lives:* one domain, exactly three focuses, the compression used precisely as Tom stated
it. Nothing is split, nothing is re-admitted, nothing is lost except the WHY — which he ruled out.

*Where breathing lives:* **its own domain.** The argument for it is not that breath is as
consequential as food; it plainly is not. The argument is that breath is the only one of the four
that is **available every second and costs nothing**, which makes it the natural home of the
minimum-will claim, and the one domain a person can practise in a meeting.

**Hub — inversion target.** Same script as Candidate 1 — **fanaticism** — but the structure suggests a
different angle of attack: **that shape is about food and the gym**. Direction of travel: from *two
levers* to *four*, and specifically toward the two nobody counts as effort. *Wording is Tom's.*

**Hub role:** **always-on Algorithm Zero**, for the same reason as Candidate 1 — four standing supply
lines, no stages.

**Against the dogmas.** *Marginal gains:* strong. *One thing at a time:* strong. *Discernment:*
strong, though the breath domain is the one where the popular literature is thinnest and the
enthusiasm is thickest — the discernment work there is real. *A reasonable plan:* very grokable. Four
words, four parts of a life. **Weakness:** it disobeys Tom's stated lean toward three domains, and it
gives breath the same rim-share as eating, which overstates it — Tom's own words put eating as "the
biggest shortcut" and "the gateway to everything else", and a four-way symmetric wheel says the
opposite of that in the most visible way a wheel can. It buys mechanical ease at the cost of a
weighting Tom explicitly holds.

**Kit-validity:** passes `validate.ts` clean, and uses all four pigments exactly once, which is the
case the kit was designed around. `cycles: 3`, weeks 1..12, always-on hub. Of the five, this is the
lowest-risk build.

---

# Candidate 4 — MORNING · DAY · NIGHT

**FRAME-BREAKER.** **Organising principle:** the domains are stretches of the clock, not behaviours —
shape is the residue of a well-shaped day, so the wheel is cut by *when* rather than by *what*.

Eating, moving, sleeping and breathing all appear, but none of them owns a domain; each sits in the
part of the day where it is actually decided. The claim underneath is that people do not fail at
"eating" or "movement" in the abstract — they fail at four o'clock, or at eleven at night, and a
programme that names the hour is a programme that reaches them at it.

### MORNING — *How the day starts* · pigment `derived`

Weeks 1, 4, 7, 10.

- **Light first** — daylight before screen. Sets the sleep clock at the other end of the day.
- **Move before you sit** — the day's movement banked before the day can take it.
- **Break the fast on purpose** — the first meal chosen rather than defaulted.
- **Through the nose** — breathing folded in here as the day's default setting, established while
  it is quiet.

### DAY — *How the middle goes* · pigment `contested`

Weeks 2, 5, 8, 11.

- **Hunger >> Appetite** — the eating WHEN, and it lives here because the middle of the day is where
  appetite does its work.
- **Get up more often** — interrupt the sit.
- **Did it grow into its shape?** — the eating WHAT, at the point of purchase and the point of lunch.
- **Slow when it counts** — the deliberate breath at the stressed moment, which is a daytime event.

### NIGHT — *How the day ends* · pigment `open`

Weeks 3, 6, 9, 12.

- **Chew until liquid** — the eating HOW, placed at the evening meal, the one most people actually
  sit down to.
- **Stop when no longer hungry** — the evening stop; the algorithm that most decides the day's total.
- **Dim before dark** — light down in the last hour.
- **Put the day down** — the wind-down, and the hand-off into sleep.

*Where eating lives:* **spread across all three domains**, and the HOW / WHEN / WHAT compression
survives *intact but scattered* — WHEN in the DAY, WHAT in the DAY, HOW at NIGHT. All three of Tom's
retained eating algorithms are present; they simply do not sit together on the rim. **What is lost:**
the visible statement that eating is the gateway. A reader of this wheel cannot see that eating is
the shortcut, because eating is not a shape on the diagram.

*Where breathing lives:* **as one focus in each of MORNING and DAY** — established in the morning as
a default, deployed in the day as a tool. It cannot have a domain here; the axis forbids it.

**Hub — inversion target.** The script to invert is **that shape is a thing you do to your day** —
sessions, windows, plans bolted on. Direction of travel: from *bolted on* to *built in* — the day
already has a morning, a middle and an end; nothing new is being scheduled. *Wording is Tom's.*

**Hub role:** **always-on Algorithm Zero.** The day repeats; there is no stage to open or close.

**Product note, and it is not small.** The pocket coach already fires **three daily crons**
(`vercel.json`, per `docs/REASON-ABILITY-CANON.md` §2.2 RA-29). This is the only candidate whose
domains map one-to-one onto the delivery mechanism that already exists — morning nudge, midday nudge,
evening nudge, each in the domain that owns that hour. Every other candidate sends three reminders a
day about one focus; this one could send the *right* reminder at the right hour, all year. That is a
better × simpler × cheaper argument sitting in the structure rather than in the copy.

**Against the dogmas.** *Marginal gains:* strong. *One thing at a time:* strong, and arguably the
most forgiving — a focus attached to a specific hour is easier to remember and easier to forgive
missing. *Discernment:* **weakest of the five.** The literature is organised by behaviour, not by
hour, so every focus point has to be re-homed by judgement, and there is no body of evidence about
"the morning" as such to discern from. The chronobiology that does exist is real but thin and
contested. *A reasonable plan:* extremely grokable — three words a child understands. **Weakness
beyond discernment:** it hides the eating gateway, and it will fit badly for shift workers, parents of
small children and anyone whose day is not shaped like a standard day, which is a large fraction of
the people who most want the programme.

**Kit-validity:** passes `validate.ts` clean. 3 domains, distinct pigments, 4 focuses each,
`cycles: 4`, weeks 1..12.

---

# Candidate 5 — HUNGER · TIREDNESS · RESTLESSNESS

**FRAME-BREAKER, and the most method-native of the five.** **Organising principle:** the domains are
the body's three signals, and the practice is learning to tell each signal from its counterfeit — so
Shape becomes the Script method applied to the body, rather than a health programme with the Script
bolted on.

The body asks three things: *feed me*, *rest me*, *move me*. Every one of them arrives with a
counterfeit that the script supplies instead — appetite counterfeits hunger, stimulation counterfeits
rest, fidget-and-scroll counterfeits movement. Reasonable Eating already contains this move in its
purest form: **Hunger >> Appetite**. This candidate takes that single algorithm and makes it the
architecture of the whole wheel.

Each domain runs the **same inner arc of four**, which is what makes the wheel read as symmetric to a
human even though the subject matter differs:

1. **Hear it** — notice the signal at all.
2. **Tell it apart** — distinguish the signal from its counterfeit.
3. **Answer it reasonably** — the actual behaviour, in one instruction.
4. **Make it easy to hear** — the environmental change that raises the signal-to-noise.

### HUNGER — *What the body asks for* · pigment `derived`

Weeks 1, 4, 7, 10.

- **Hunger >> Appetite** — tell the signal from the counterfeit. Straight from Reasonable Eating.
- **Stop when no longer hungry** — hear the signal *ending*, which is the harder half.
- **Did it grow into its shape?** — answer it reasonably: what you answer hunger with.
- **Chew until liquid** — make it easy to hear. Eating slowly is what lets the signal reach you
  before the plate is gone.

### TIREDNESS — *What the body asks for at the end* · pigment `established`

Weeks 2, 5, 8, 11.

- **Tired >> Wired** — tell the signal from the counterfeit: tiredness masked by stimulation is the
  exact analogue of hunger masked by appetite.
- **Go when it says go** — hear it, and act on the first wave rather than the third.
- **Same window** — answer it reasonably.
- **Dim before dark** — make it easy to hear. Light is the noise; turn the noise down.

### RESTLESSNESS — *What the body asks for in the middle* · pigment `open`

Weeks 3, 6, 9, 12.

- **Restless >> Distracted** — tell the signal from its counterfeit. The urge to move gets answered
  with a screen, and the body's request goes unread.
- **Get up more often** — hear it, and answer the small ones as they come.
- **Carry something heavy** — answer it reasonably. The body's request, taken seriously once a week.
- **Breathe through the nose** — make it easy to hear. Breath is the instrument you read all three
  signals with, and it sits here because this is the domain where the body is loudest.

*Where eating lives:* **as one whole domain, HUNGER**, and the HOW / WHEN / WHAT compression is used
but **re-ordered by function rather than by grammar** — WHEN becomes "tell it apart", WHAT becomes
"answer it", HOW becomes "make it easy to hear", and the fourth slot is filled by **splitting WHEN**
into start and stop, exactly as Candidate 1 does. Eating keeps its own domain and keeps the gateway
position, because HUNGER is the first domain on the rim and the one whose worked example teaches the
pattern the other two copy. This is the candidate that best preserves Tom's "University of the Will"
reading: eating is where you learn the move, and then you run the same move on tiredness and
restlessness.

*Where breathing lives:* **one focus in RESTLESSNESS**, as the reading instrument. Not a domain, and
deliberately so — under this frame, breath is not a fourth signal, it is how you hear the other three.

**Hub — inversion target.** The script to invert is the deepest one in the field: **that the body is
an opponent to be overridden** — willpower against appetite, discipline against laziness, the
internal civil war that Tom's whole doctrine says burns the energy. Direction of travel: from
*override* to *listen* — the body is not the problem, the counterfeit is; and noticing the difference
is the entire practice. This is the same move as EAT MORE, run one level deeper. *Wording is Tom's
call, not mine.*

**Hub role:** **week-1 opener, in rotation** — as the Ultimate 13×4's NOTICE. The structure forces
it: if all twelve focuses are variations on *notice which signal you are answering*, then noticing
must be taught once, explicitly, at the start of the lap, and not left as ambient wallpaper. This is
also the candidate that makes Shape the **second** programme to take the week-1 hub role, which is
useful evidence for canon §3.2's open fork.

**Against the dogmas.** *Marginal gains:* strong. *One thing at a time:* strong. *Discernment:*
mixed — the *behaviours* are the same evidence-backed ones as every other candidate, so the evidence
base is identical, but the *framing* is Tom's rather than the field's, which means it cannot be
sourced from three popular books and has to be defended on its own. *A reasonable plan:* the
brother-in-law test passes beautifully — "I'm learning to tell whether I'm actually hungry" is
unmockable in a way that "I'm doing a fitness programme" is not. **Weakness:** the domain names are
abstractions, and two of the three ("tiredness", "restlessness") are less immediately legible than
"sleep" and "move". A person may not know that RESTLESSNESS is where the exercise lives. It also
asks more of the coach copy than any other candidate — the whole thing only works if the
signal-versus-counterfeit teaching lands, and that is Tom's prose, not a data file.

**Kit-validity:** passes `validate.ts` clean, with one thing to note: `cycles: 4`, hub
`inRotation: true` with `numeral: '1'`, so weeks run **1..13** and the twelve focuses take 2..13 in
the interleaved rotation (HUNGER 2/5/8/11, TIREDNESS 3/6/9/12, RESTLESSNESS 4/7/10/13). That is
precisely `ultimate-13x4.ts`'s shape, so it is proven in the kit already.

---

# Comparison

| | Domains | Where eating sits |
|---|---|---|
| **1 · Eat Move Sleep** | 3 × 4 | Own domain, WHEN split for the 4th |
| **2 · How When What** | 3 × 4 | One focus per domain |
| **3 · Eat Move Sleep Breathe** | 4 × 3 | Own domain, exact fit |
| **4 · Morning Day Night** | 3 × 4 | Scattered across all three |
| **5 · Three Signals** | 3 × 4 | Own domain, and it leads |

| | Breathing | Hub role |
|---|---|---|
| **1 · Eat Move Sleep** | One focus in MOVE | Always-on |
| **2 · How When What** | Fourth row, all domains | Always-on |
| **3 · Eat Move Sleep Breathe** | Own domain | Always-on |
| **4 · Morning Day Night** | Two focuses, by hour | Always-on |
| **5 · Three Signals** | One focus, as the instrument | Week-1 opener |

| | Inverts | Main weakness |
|---|---|---|
| **1 · Eat Move Sleep** | Punishment → provision | Obvious; eating demoted to a peer |
| **2 · How When What** | Project → manner | Domain names read abstract |
| **3 · Eat Move Sleep Breathe** | Two levers → four | Four domains; overstates breath |
| **4 · Morning Day Night** | Bolted on → built in | Thin evidence base; hides eating |
| **5 · Three Signals** | Override → listen | Abstract names; leans on Tom's prose |

**Where I think the real choice turns.** Not on which areas are in — every candidate carries eating,
movement, sleep and breath, and they carry very nearly the same twelve behaviours. It turns on
**whether the wheel's rim shows the person the areas of their life or the move they are learning.**
Candidates 1, 3 and 4 put the areas on the rim and let the method be invisible. Candidates 2 and 5
put the method on the rim and let the areas be implied. That is one taste call, and it decides four
other things by itself.

---

# Open questions

Each answerable in a sentence.

1. **Does eating keep a domain of its own, or does the gateway claim survive being distributed?** Tom
   has said eating is "the biggest shortcut" and "the gateway to everything else" — is that a claim
   the wheel has to *show*, or only a claim the coach has to *say*?

2. **Is the fourth eating slot filled by splitting WHEN, or by re-admitting WHY?** Three domains
   force a fourth eating focus; the WHY that got cut is the only place *Eat for fun* lives, and it is
   the one algorithm that explicitly licenses pleasure in an anti-fanaticism programme.

3. **Which hub role does Shape take — always-on Algorithm Zero, or week-1 opener?** Canon §3.2 flags
   this as an open fork with no written rule; Shape is the second programme that forces the ruling,
   and four of these five candidates want always-on while the fifth structurally requires week 1.

---

## Gaps, stated plainly

- **Tom's existing movement principles have not been seen.** Every MOVE / RESTLESSNESS focus title in
  this document is a placeholder, drawn from `ultimate-13x4.ts` and from the level of common ground
  dogma 3 would find in the popular literature. They are there so the wheel visibly fills, not
  because they are right. Tom's own principles replace them.
- **The Reasonable Eating book manuscript is still not on this machine** (canon §5.4). All eating
  material above is taken from `src/lib/programs/reasonable-eating.ts`, which is the shipped data
  file, not the book. If the book's thirteen algorithms differ from the shipped twelve, this document
  inherits that difference.
- **No coach copy, no hub wording, no mnemonic line-breaks are proposed here.** Those are authorship,
  and they are Tom's.
