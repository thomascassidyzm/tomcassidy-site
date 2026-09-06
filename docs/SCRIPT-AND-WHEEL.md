# The Script and the wheel: one selector, three tick rates

> Position paper, 2026-09-06. The question put: the 13x4 wheel coach and the Script have never
> been reconciled. One is cyclical and structural, one is a move-by-move conversational method. Are
> they the same thing at different altitudes, or genuinely two methods? This document takes a
> position and argues it from Tom's own words and from the code as it runs today. Written for Tom
> to redline. Every quote is his unless marked.

---

## 1. The verdict

Same method, different altitudes. Not two methods. But the altitude is time, not abstraction.

The Script is one move: notice what is running, ask what you would choose, put that in instead.
The wheel is the same move with the choosing done in advance and held for a week. The Sausage
Machine is the coupling between the two: what goes in at one altitude comes out at the next.

So the mapping is not "zoom out on the Script and you get a wheel". It is: the Script is the
selector, the wheel is the selector's clock. One selector, three tick rates. Thought, week, year.

Tom has already said this twice without joining the sentences. His Thrive coach, in his own
prose, answers "improvement" with: "There are three layers to mastering anything: First, the
Script. Second, the Sausage Machine. Third, One Thing at a Time." And on 2026-08-04, spoken: "into
this week of being a better listener, what are you putting in?" then "what would you choose to put
in?" That second sentence is the whole reconciliation. It is the Gateway Question fired inside a
wheel slot.

The rest of this document is the argument, the mapping, the places where the analogy honestly
breaks, and what it means for the coach that is half built.

---

## 2. Each one, stated cold

**The Script.** Everything you think, feel or do that you would not choose is not you. It is your
script. The practice is one step: notice. "Step 1: Notice. Step 2: There is no Step 2." The
discriminator is Helpful > True. The gateway is "What WOULD you choose?" The consequence model is
the Sausage Machine: you get out what you put in. The vision it points at is Become, Do, Give.
The fitness function on all of it is Choose easy. It runs at the speed of a thought, and it was
delivered live, in conversation, one move per message, in the 2014 Reasonable Wealth groups.
Wilkins coined the metaphor and Tom credits him.

**The wheel.** Any goal is broken into 13 focus points. One per week, the rest left to their
natural chance. Four laps a year. "MAINTAIN focus. CHANGE routines." It rests on the four dogmas:
marginal gains, one thing at a time, discernment, a reasonable plan. It is minimum will, not zero
will: "It looks like almost doing nothing. It's just focusing." Franklin is the ancestor. Tom ran
it from 1994 and shipped it as the 9x4 in 2012, at school scale, with no Script vocabulary in it
at all. The 9x4 essay contains the word "script" zero times.

Those last two facts matter and I am not hiding them. Each ran alone, and each worked alone. The
Script canon's moves catalogue draws every move from the 2014 groups except one: "One thing at a
time" is sourced from the 9x4 essay, not from the coaching. So the joining is a later synthesis,
not an origin fact. Section 5 comes back to this.

---

## 3. The argument

Four lines of evidence, each from something Tom said or built.

**3.1 He paired the two questions himself, as reason times reasonable.** "success = reason x
reasonable". And: "The meta-questions apply to everything: What would you choose? (Reason,
thinking properly). What are you putting in? (Reasonable, taking action)." The two mistakes are
not thinking properly and not taking action. The Script fixes the first. The wheel fixes the
second. But the pairing is a multiplication, not a list. Either factor at zero and the product is
zero. A selector with no clock fires only when a coach happens to be in the WhatsApp group. A
clock with no selector is a checklist, and a checklist can be run by the script: "I should be a
better listener this week, and I failed again." That is the internal civil war, scheduled weekly.
Tom's join on 2026-08-04 is precisely the fix: the selector is run inside the slot.

**3.2 The wheel's operating requirement is the Script's only step.** The wheel asks for nothing but
focus. "This programme works at the level of focus, requiring no more work than you are currently
doing." Focus on one thing for a week is noticing, held. The Ultimate 13x4 makes this literal:
NOTICE is the hub, week 1, "where every lap begins". Notice is also week 2 of Leadership and week
1 of Success. The one practice the Script has is the one resource the wheel runs on. They are not
two engines sharing a fuel. It is one fuel, and the wheel is the tank that meters it out a week
at a time.

**3.3 The no-civil-war doctrine is identical on both sides and it is thermodynamic.** Script side:
"not make it a problem to be in the script". Make it OK. Nothing wrong with you. Wheel side: "You
get to Wednesday and you haven't really done much of it that week. It's okay. You don't lose
heart. It's not about streaks." The argument is the same argument: guilt re-ignites the war, the
war burns the energy, and the energy was the whole point. "If they can avoid the internal civil
war, then their energy is free to do all the good stuff." Two methods invented separately would
not share a thermodynamics this exactly. One method at two tick rates would.

**3.4 The code already runs one selector at two of the three rates, and never lets them meet.**
The wheel tick is in `coach-engine.ts`: which focus is live, and the blessed weekly goal. Look at
what a blessed goal is. "The one thing you said you'd do this week, in your own words. Verbatim.
Never rewritten." That is the person's answer to "what would you choose to put in?" at week
altitude, frozen for the week. The thought tick is in `the-script.md`, wired verbatim into
`guide-prompt.ts`. But that prompt is attached to Alexander on the essay pages. The push loop
never sees the Script; the Script never sees the week. The gap in the product is exactly the gap
in the doctrine this document closes. Section 6 says what to do about it.

---

## 4. The mapping

One row per Script move. The wheel column is what that move becomes when the choosing is held for
a week or a year rather than a thought.

| Script move, at thought speed | The same move on the wheel | Altitude |
|---|---|---|
| Notice. Step 1, no step 2. | Focus. The week's one thing is what you notice. NOTICE as the hub of the Ultimate 13x4. The push reminder is a prompt to notice, not a task. | week |
| What WOULD you choose? | Become, Do, Give. The goal is the Gateway Question asked of a life. Dogma 4 breaks the answer into 13. | year |
| What WOULD you choose? | Pre-answered. The wheel chose this week's thing so you spend no will re-choosing. Frozen value. The blessed goal is your own words for what you would choose to put in. | week |
| What are you putting in? | "Into this week of being a better listener, what are you putting in?" The push, the day check-in, the "how's it going". | day |
| Helpful > True. "Science is about: well, so far THIS seems to work." | Discernment. "There is no proof, only evidence." Read the people who already have it, keep what works. Same epistemology, pointed outward. | year |
| Choose easy. "Hard is hard. Who'd choose that?" | A reasonable plan. Low floor, high ceiling. Minimum will. The brother-in-law test. The plan fails when it was "just too hard to stick to". Same fitness function. | year |
| Make it OK. Nothing wrong with you. | No streaks. Wednesday is fine. Leave the other twelve to their natural chance. | week |
| The 70% rule. | Marginal gains. One thing at a time, the rest to chance, is a 70% rule on a calendar. | week |
| Closer or further away? Buy the ticket or don't. | Week 13, the review. "What's going well? What can you learn from?" | cycle |
| Feelings are the compass. | "How are you feeling today?" is the opener Tom gave for the reminder itself. | day |
| Success is only a feeling; feel it now. | "It's a double win. You feel better NOW and you get results FASTER." Enjoy the future before it happens. | year |

The Sausage Machine has no row because it is not a move at one altitude. It is the statement
that the altitudes are joined. What you put in at thought speed is what comes out of the day.
What you put into the week is what comes out of the year. That is why Tom calls it "a universal
principle": it is the same law at every scale, and it is the reason a change at the smallest tick
rate is worth making at all.

---

## 5. Where the analogy breaks, honestly

Three places. None of them overturns the verdict. All of them matter for the product.

**5.1 Content.** The Script has none. It never tells you what to want or what to focus on. The
wheel cannot run without 13 points, and those come from discernment: six months reading nutrition
before Reasonable Eating had a wheel. So at year altitude the selector is not enough on its own.
Dogma 3 is a separate operation that the Script does not contain. This is the strongest case for
"two methods" and it is real. The answer is that discernment supplies the wheel's content and the
Script supplies its operation, and neither replaces the other.

**5.2 Pre-commitment.** The wheel decides in advance and holds. The Script never does. Every
thought is a fresh selection. That is a genuine difference in mechanism, and it is the reason the
wheel exists: live selection at thought speed is exhausting if you also have to select what to
select. The wheel is the Script with the expensive part paid up front. Frozen value at week
scale, live selection at thought scale. Not a contradiction. A division of labour by cost.

**5.3 Lineage.** Franklin, 1994, 2012. Wilkins, 2014. Two ancestors, two decades, two audiences.
The 9x4 shipped to twenty thousand teachers with no Script in it. The 2014 groups coached
hundreds of people with no wheel in sight. The synthesis is Tom's, and it is recent: the Thrive
"three layers" answer, the 2026-08-04 spoken join, and the 2026-08-24 finding that the Script's
graph is a wheel because "selection is a practice not a possession". The canon should say the
joining is his, and dated, rather than pretend the two were always one.

The one apparent oddity that is not a break: the Script is a slice on the Leadership wheel, week
6, and the Sausage Machine is week 10. If the Script were the wheel at another altitude, how can
it be a slot on it? Easily. The wheel is a container for practices. The Script is a practice. A
week spent on the Script is the wheel scheduling attention onto its own selector. That is not a
contradiction, it is the proof the container is general: it can hold the thing it runs on.

---

## 6. What each is for

Even as one method, each altitude has a home, and the product should respect the homes.

**The Script is for the moment.** In a conversation, in a thought, in the thirty seconds after
the boss criticises you. Reveal the script, ask what you would choose, leave it there. It needs a
voice and a reply. It cannot be a push notification, because a notification cannot listen.

**The wheel is for the year.** Adherence. "Most people forget in the business of the day." The
wheel's job is that the choosing does not need to be redone every morning, and that you will
come back to everything: "there's a safety in that." It needs a start date and a clock. It does
not need a conversation, which is why the push loop works with no model call at all.

**The Sausage Machine is for the join.** It is the sentence the coach says at the week tick that
makes the week a Script move rather than a task: "This week, X. What are you putting in? What
would you choose to put in?"

**Discernment is for the setup.** Choosing the 13 from the wisdom of people who already have it.
Tom's own split on 2026-08-04 gives this to Alexander, the Socratic teacher, and gives the daily
companion to someone else. That fork is still his to rule, and this document does not rule it.
But the mapping supports the split: setup is understanding, and the daily coach is choosing.

---

## 7. What it means for the coach

One consequence, stated once. The coach conversation should be the Script running inside the
wheel's current slot. Concretely, the thing that talks to a person should carry three things it
does not carry today:

- this week's focus, from the wheel arithmetic that already exists;
- the person's blessed goal for this week, verbatim, if they set one;
- the Script method, from the file that is already the canonical home for it.

Today the first two live in the push loop and the third lives in the reading companion, and no
code path holds all three. That is a wiring job, not a doctrine job, and it is small. It is the
2026-08-04 join rendered as a system prompt. Not built here: this document is the argument. It
is journaled in `docs/DECISIONS.md` as the position the build should follow.

Two things it does not change. The push stays a bank line or a blessed goal with no model call.
And the taste call on who the voice is stays with Tom.

---

## 8. Sources

All in this repo unless pathed.

- `docs/SCRIPT-CANON.md`, the Script and Sausage Machine assembled from every telling, with the
  2014 primary quotes. The "three layers" line is at `~/thrive-work/api/tom-coaching.js`.
- `docs/REASON-ABILITY-CANON.md`, the four dogmas, the minimum-will week, the no-civil-war
  doctrine, and the 2026-08-04 spoken join at section 1.3.
- `src/content/essays/the-9x4.md`, the 2012 wheel with no Script in it.
- `src/content/essays/reason-ability-an-overview.md`, reason times reasonable, the two mistakes,
  the 13x4 definition.
- `src/lib/coach-engine.ts`, the wheel tick and the blessed goal.
- `src/lib/the-script.md` and `src/lib/guide-prompt.ts`, the thought tick and where it is wired.
- `src/lib/programs/ultimate-13x4.ts`, `reasonable-leadership.ts`, `reasonable-success.ts`,
  `conquering-life.ts`, where Notice, the Script and the Sausage Machine appear as slices.
- `~/command-surface/doctrine-heads/`, the 2026-08-24 finding that the Script's graph is a wheel.
