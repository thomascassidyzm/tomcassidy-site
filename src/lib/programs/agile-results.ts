import type { Program } from '@/kit/types';

/**
 * Agile Results 13/4 — JD Meier's system for getting stuff done, drawn as a
 * 13×4 wheel by Tom. A single continuous ring (the first ONE-domain wheel):
 * twelve practices run sequentially, with the Review Cycle as the week-13
 * in-rotation hub — the system that improves the system.
 *
 * Practice names are verbatim from the wheel. EVERYTHING ELSE — the wisdom
 * lines and the full FAST deep dives — is DRAFT: researched from JD's
 * published system (gettingresults.com, "Getting Results the Agile Way",
 * his "12 Practices of Agile Results") and drafted on the FAST pattern for
 * JD and Tom to make their own. JD's story beats are outlines pointing at
 * documented territory (the system was forged shipping software at
 * Microsoft; he ran it publicly as 30 Days of Getting Results) — not
 * finished tellings.
 */
export const agileResults: Program = {
  slug: 'agile-results',
  title: 'Agile Results',
  byline: 'JD Meier & Tom Cassidy',
  blurb:
    'JD Meier’s system for getting stuff done — three wins at every scale, one practice a week, four laps a year.',
  essaySlug: undefined,
  cycles: 4,
  rotationStyle: 'sequential',
  hub: {
    label: ['REVIEW', 'CYCLE'],
    algorithmName: 'Review Cycle',
    numeral: '13',
    kicker: 'Week 13 · the system that improves the system',
    inRotation: true,
    coach: {
      wisdom:
        'Step back and review the lap: what worked, what didn’t, what to carry forward. The Review Cycle is how the system improves the system.',
    },
    fast: {
      focus: [
        'Well, you know how systems quietly rot? The list you stop reading, the habit that drifts, the ritual that becomes a chore you skip without deciding to?',
        'A system that can’t see itself can’t last.',
        'The Review Cycle is the system reviewing the system: at the end of each lap of the twelve practices, you step back and ask what worked, what didn’t, and what to change — then start the next lap lighter.',
      ],
      approach: [
        'Here’s the thinking: the whole of Agile Results runs on one loop — do it, review it, improve it. Friday Reflection runs that loop on the week. The Review Cycle runs it on the system itself.',
        'JD builds continuous improvement into the method on purpose: drop what isn’t working, travel light, carry forward only what earns its place. The review is what makes the other twelve durable — without it they’re twelve good ideas slowly going stale; with it they’re a system that fits you better every lap.',
        'And it’s forgiving by design. Progress, not perfection: the lap review isn’t an exam you can fail, it’s a fresh start you can steer.',
      ],
      story: [
        {
          voice: 'JD',
          draft: true,
          text: [
            'How the system itself survived by self-editing — practices that earned their keep across years of use, and the ones that got dropped along the way. The method outlasted the circumstances it was built in because the review kept remaking it.',
          ],
        },
        {
          voice: 'Tom',
          draft: true,
          text: [
            'Week 13 exists so the other twelve don’t have to be perfect. You get four goes at this a year — which means nothing has to be right first time, it just has to be reviewed.',
          ],
        },
      ],
      tool: {
        name: 'The Lap Review',
        practice: [
          'This week, run The Lap Review.',
          'Three questions, three lines:',
          'What worked this lap? (Keep it.) What didn’t? (Drop it — travel light.) What will I try next lap? (One change, not five.)',
          'Write the three lines down. Then start lap two — fresh.',
        ],
      },
    },
  },
  domains: [
    {
      name: 'AGILE RESULTS',
      question: 'Getting stuff done',
      pigment: 'established',
      focuses: [
        {
          week: 1,
          name: 'The Rule of 3',
          lines: ['The Rule', 'of 3'],
          coach: {
            wisdom:
              'Three is the magic number: three wins for the day, the week, the month, the year. Constraint creates focus — pick three and begin.',
          },
          fast: {
            focus: [
              'Well, you know how your to-do list has forty items, and at the end of the day you’ve somehow done none of the ones that mattered? How you can be busy from morning to night and still feel like you lost?',
              'That’s activity without outcomes. The list was running you.',
              'The Rule of 3 is the discipline of biting off three things — three wins for the day, three for the week, three for the month, three for the year — and letting the vital few lead.',
            ],
            approach: [
              'Here’s the thinking: your working memory holds about three or four things — three fits in your head with no list, no app, no system overhead. You can hold today’s three while you’re in the corridor, in the meeting, in the queue.',
              'Three is also scope management, which is where JD’s software roots show: a release ships because somebody decided what it is NOT. A day is a release. Forty items isn’t a plan, it’s a wish; three outcomes is a plan.',
              'And the rule is fractal — the same move works at every scale. Three for today nests inside three for the week, inside three for the month, inside three for the year. One discipline, every horizon.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'How the Rule of 3 was forged shipping software at Microsoft — scoping a release down to the three things that must be true, then noticing the same scoping discipline worked on a week, and on a day. Under pressure, three is what survives.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'This is the same physics as the whole 13×4: one focus a week, three wins a day — constraint as kindness. You don’t need more willpower; you need a smaller, sharper ask.',
                ],
              },
            ],
            tool: {
              name: 'Pick Your Three',
              practice: [
                'This week, practice Pick Your Three.',
                'Each morning — before email, before your phone, before anyone else’s agenda — write down three wins for today.',
                'Wins, not tasks: “ship the draft,” not “work on the draft.”',
                'That’s the whole tool. If you do nothing else from this system all week, do this once a day.',
              ],
            },
          },
        },
        {
          week: 2,
          name: 'Monday Vision · Daily Wins · Friday Reflection',
          lines: ['Mon Vision', 'Daily Wins', 'Fri Reflection'],
          coach: {
            wisdom:
              'The weekly rhythm: Monday, picture the week’s wins; daily, name today’s; Friday, look back and learn. The loop that keeps the whole system honest.',
          },
          fast: {
            focus: [
              'Well, you know how weeks just… happen to you? Monday arrives, the inbox sets the agenda, Friday closes without a verdict, and next Monday it all repeats?',
              'That’s a week without a rhythm — seven days of weather.',
              'Monday Vision, Daily Wins, Friday Reflection is the heartbeat of Agile Results: Monday you envision, each day you win, Friday you reflect. Plan, act, learn — every single week.',
            ],
            approach: [
              'Here’s the thinking: this is a feedback loop run at the smallest sustainable cadence. On Monday you ask one question: “what three things would I want to have achieved by Friday?” Each day you name the day’s three. On Friday you ask two more: three things going well, three things to improve.',
              'The Friday reflection is what turns a list into a SYSTEM — do it, review it, improve it. Without the review, you just repeat your weeks; with it, your weeks compound.',
              'And the pattern hands you a fresh start every Monday. Whatever last week was, you drop what isn’t working, travel light, and begin again. You can’t fall irrecoverably behind in a system that restarts every seven days.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'How the pattern brought agile software rhythms — the sprint, the retrospective — down to the scale of one person’s week, and why this one pattern is the heart of the whole system: everything else hangs off it.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'The Friday Reflection is a cycle review in miniature — the same move the 13×4 makes at week thirteen, made every week. Rhythm beats resolve.',
                ],
              },
            ],
            tool: {
              name: 'The Bookends',
              practice: [
                'This week, install The Bookends.',
                'Two ten-minute calendar anchors: Monday morning — write the week’s three wins, say them out loud. Friday afternoon — write three things that went well and three to improve.',
                'Don’t optimise the middle of the week yet. Just install the bookends and let the week hang between them.',
              ],
            },
          },
        },
        {
          week: 3,
          name: '3 Wins for the Week',
          lines: ['3 Wins', 'For The', 'WEEK'],
          coach: {
            wisdom:
              'On Monday, ask: if this week were over, which three results would make it a good one? Write them down — they steer everything else.',
          },
          fast: {
            focus: [
              'Well, you know how by Wednesday you can’t remember what this week was supposed to be FOR? The days are full, but the week has no plot?',
              'A week with no named wins is a week that gets narrated afterwards — by whatever happened to fill it.',
              '3 Wins for the Week gives the week a story in advance: the three outcomes that would make you glad on Friday.',
            ],
            approach: [
              'Here’s the thinking: the week is the perfect unit — big enough for meaningful work, small enough to see whole. A year is too far to feel; a day is too small to carry a real result. The week is where intention and reality actually meet.',
              'Wins are outcomes, not activities. “Have the difficult conversation” is a win; “think about the difficult conversation” is an activity wearing a win’s clothes. JD’s test is simple: would Friday-you point at it and say THAT happened?',
              'And when the week floods — it will — the three wins are what pull you back. Overwhelm is mostly the absence of a shortlist.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'How naming the week’s three changes people who are drowning in task lists — the moment the forty-item backlog reorganises itself behind three named results, and the noise becomes negotiable.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'The week is the natural unit of change — it’s why the 13×4 deals in weeks, not days or months. Name the week’s three and you’ve given the week a spine.',
                ],
              },
            ],
            tool: {
              name: 'Friday’s Verdict',
              practice: [
                'This week, write Friday’s Verdict — on Monday.',
                'Complete the sentence: “By Friday, I’ll be glad if ___, ___ and ___.”',
                'Put it where you’ll see it every day — top of your notebook, a sticky on the monitor.',
                'When something shiny lands midweek, hold it against the sentence. The sentence gets a vote.',
              ],
            },
          },
        },
        {
          week: 4,
          name: '3 Wins for Today',
          lines: ['3 Wins for', 'TODAY'],
          coach: {
            wisdom:
              'Each morning, choose today’s three. Not tasks — wins. The day gets a shape, and you get to win it.',
          },
          fast: {
            focus: [
              'Well, you know how some days you only find out what the day was about by what it took from you? You were in it from seven till eleven, and somehow it was never yours?',
              'A day with no named wins belongs to whoever asks first.',
              '3 Wins for Today gives the day a shape before the world does: three outcomes, chosen by you, first thing.',
            ],
            approach: [
              'Here’s the thinking: deciding once, in the morning, beats deciding forty times all day. Every “what should I do now?” moment costs willpower; three named wins answer most of those moments in advance.',
              'It’s also a fresh start, every single day. Yesterday’s wreckage doesn’t carry: you wake up, you pick three, the scoreboard is clean. A bad day costs exactly one day.',
              'And wins put a finish line on the day. “Inbox zero forever” is a treadmill; “these three, today” is a race you can actually run — and winning days, daily, is how momentum is made.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'The morning ritual as he teaches it — state your three out loud or write them down before the day starts asking, and let the day’s decisions fall in line behind them.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'Minimum willpower, maximum effect: the three-wins morning is a decision you make once that then makes a hundred small decisions for you.',
                ],
              },
            ],
            tool: {
              name: 'Three Before Anything',
              practice: [
                'This week, practice Three Before Anything.',
                'Before email, before your phone, before the news: write today’s three wins.',
                'In the evening, tick what landed — and if something else won the day instead, just notice what it was. No judgement; that’s data for Friday.',
              ],
            },
          },
        },
        {
          week: 5,
          name: 'Scannable Outcomes',
          lines: ['Scannable', 'Outcomes'],
          coach: {
            wisdom:
              'Write outcomes you can take in at a glance — short, visible, results-first. If you can’t see it in five seconds, it won’t steer you.',
          },
          fast: {
            focus: [
              'Well, you know how your goals live in seventeen places — three apps, two notebooks, a drawer, your head — and therefore, effectively, nowhere?',
              'What you can’t see can’t steer you.',
              'Scannable Outcomes is your whole game at a glance: the results you want, organised by the areas of your life, on one page you can read in five seconds.',
            ],
            approach: [
              'Here’s the thinking: JD organises outcomes by hot spots — the heat map of your life. Work hot spots, personal hot spots, and the life set: mind, body, emotions, career, finance, relationships, fun. Under each, the few outcomes you actually want.',
              'The glance is the point. This isn’t a filing system, it’s a dashboard — it exists so that while you grind the small stuff, the big picture stays in view. A glance a day quietly re-aims a hundred small choices.',
              'And the hot-spot layout makes neglect visible. Life is a portfolio; the scan shows you which holding is starving before the starving becomes a crisis.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'Hot spots as portfolio thinking — investing attention across life areas the way you’d balance any portfolio, and how the at-a-glance list catches the starving categories early.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'A wheel is a scannable outcome — it’s the entire reason the 13×4 is a single diagram and not a chapter list. If you can’t see the whole thing at once, you don’t have a system, you have a pile.',
                ],
              },
            ],
            tool: {
              name: 'One Page of Hot Spots',
              practice: [
                'This week, build One Page of Hot Spots.',
                'List your hot spots — work, personal, and the life set (mind, body, emotions, career, finance, relationships, fun). Under each, one to three outcomes you want. All of it on ONE page or one screen.',
                'If it doesn’t fit on one page, it isn’t scannable — cut until it is.',
                'Then scan it each morning, right after your three wins. Five seconds. That’s the practice.',
              ],
            },
          },
        },
        {
          week: 6,
          name: 'TimeBoxing',
          lines: ['TimeBoxing'],
          coach: {
            wisdom:
              'Give work a box, not an open road. Fix the time, flex the scope — the box does the prioritising for you.',
          },
          fast: {
            focus: [
              'Well, you know how a task expands to fill whatever time you give it? And a day with no walls becomes one long task you never finish?',
              'Open-ended work is a lie you tell your calendar.',
              'TimeBoxing is the fix: fix the time, flex the scope. The work gets a box; the box gets a wall; the wall does the work.',
            ],
            approach: [
              'Here’s the thinking: a deadline is a forcing function. Inside a fixed box, you instinctively do the most important part first — the box does the prioritising for you. Without a box, polish eats the schedule.',
              'Boxes also protect breadth. JD boxes administration, execution, think time, AND relationships — because the alternative is that one hot spot quietly eats the others. The box isn’t just how work gets done; it’s how the rest of your life keeps existing while it does.',
              'And boxes end. A day made of boxes finishes; a day made of open roads just stops, somewhere, exhausted. “Good enough for now, shipped from inside the box” beats “perfect, never.”',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'Timeboxing a shipping schedule — fixed dates, flexible scope — and discovering the same trade works on a Tuesday: the date doesn’t move, the scope does, and somehow the right things ship.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'Same physics as the Rule of 3: the constraint is the engine. You don’t rise to open-ended time; you sink into it.',
                ],
              },
            ],
            tool: {
              name: 'One Box a Day',
              practice: [
                'This week, run One Box a Day.',
                'Pick the piece of work that drifts the most. Give it a box: forty-five to ninety minutes, in the calendar, with a hard end.',
                'Start when the box starts. Stop when it ends — actually stop. Ship whatever exists.',
                'Notice what the wall made you do first. That’s the box doing your prioritising.',
              ],
            },
          },
        },
        {
          week: 7,
          name: 'Strong Week',
          lines: ['Strong', 'Week'],
          coach: {
            wisdom:
              'Design the week around your energy: strong starts, batched friction, real recovery. A strong week is built, not hoped for.',
          },
          fast: {
            focus: [
              'Well, you know how two equally “productive” days can leave you flying after one and hollow after the other? Same hours, same effort — completely different you at six o’clock?',
              'That’s because the budget that matters isn’t time. It’s energy.',
              'Strong Week is designing the week around what makes you strong: in JD’s words, spend more time on activities that make you strong, and less on activities that make you weak.',
            ],
            approach: [
              'Here’s the thinking: it’s not the time you spend, it’s the energy you leverage. An hour of your strongest work in your strongest slot is worth a morning of fog — so find your power hours and spend them on the work that matters most, not on email.',
              'Weak-making work can’t always be dropped — but it can be contained: batched, scheduled early while resolve is high, and capped. JD’s rule of thumb is to keep it to around twenty percent of the week.',
              'This is strengths-based design, not weakness-fixing. You don’t become great by sanding down every flaw; you become great by arranging the week so your strengths get the prime slots — and the rest gets a box.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'Noticing which hours were his best creative hours — and the discipline of refusing to spend them on administration. The week changed when the best energy finally met the most important work.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'A strong week is built, not hoped for. Hope says “maybe this week will be better”; design says “Tuesday 9–11 is for the real work, and the expenses go in Friday’s box.”',
                ],
              },
            ],
            tool: {
              name: 'The Energy Audit',
              practice: [
                'This week, run The Energy Audit.',
                'For three days, mark each block of your day + or − : did it make you stronger or drain you?',
                'Then move ONE thing: batch a draining task into a single early box, or reserve one power hour — your best slot — for the work that matters most.',
                'One move. Next week, another. That’s how the strong week gets built.',
              ],
            },
          },
        },
        {
          week: 8,
          name: 'Triage',
          lines: ['Triage'],
          coach: {
            wisdom:
              'When it all lands at once: do it, defer it, delegate it, or drop it. Triage isn’t giving up — it’s choosing what wins.',
          },
          fast: {
            focus: [
              'Well, you know how everything arrives claiming to be urgent? And treating it all equally means the genuinely important queues behind the merely loud?',
              'An inbox without a door policy runs your day for you.',
              'Triage is the front door: every incoming item gets a fast verdict — MUST, SHOULD or COULD — and a route: do it now, queue it, schedule it, delegate it, or delete it.',
            ],
            approach: [
              'Here’s the thinking: triage is deciding, not doing. The cost of an undecided item isn’t the work it represents — it’s the ambient guilt of carrying it unread and unresolved. A one-minute verdict ends that.',
              'The queue is a feature, not a failure. Deferring something WITH a place it lives beats both doing everything now and silently dropping things. SHOULD and COULD go to the queue; the weekly review re-opens the queue on your terms.',
              'And triage is what protects the Rule of 3. Your three wins die without a door policy — every untriaged arrival is a candidate thief of the day you already chose.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'Handling incoming at Microsoft scale — where without explicit triage the loudest request always won — and how MUST/SHOULD/COULD turned a flood into a queue.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'Triage is the bodyguard of your three wins. The morning chooses the day; triage defends the choice.',
                ],
              },
            ],
            tool: {
              name: 'The Door Policy',
              practice: [
                'This week, enforce The Door Policy.',
                'Every incoming item — email, message, request, idea — gets a verdict in under a minute: MUST, SHOULD or COULD.',
                'Then a route: do it now (only if it’s a two-minute MUST), queue it, schedule it, delegate it, or delete it.',
                'Nothing stays unread-and-undecided. Decided is the new done.',
              ],
            },
          },
        },
        {
          week: 9,
          name: 'Monthly Sprints',
          lines: ['Monthly', 'Sprints'],
          coach: {
            wisdom:
              'Pick one improvement and sprint it for a month. Thirty days of focus beats a year of intentions.',
          },
          fast: {
            focus: [
              'Well, you know how new skills die in the gap between a weekend of enthusiasm and a year of vague intention? Too short to stick, too long to start?',
              'The month is the missing middle.',
              'Monthly Sprints: pick ONE thing to improve — a skill, a habit, a hot spot — and sprint it for thirty days.',
            ],
            approach: [
              'Here’s the thinking: thirty days is long enough to actually experiment — to try, fail, adjust and see real movement — and short enough to commit to honestly. Nobody can promise a year; anybody can promise a month.',
              'One sprint at a time. The improvement gets your spare attention all month, which is how it survives the third week, where enthusiasm usually goes to die.',
              'And the month-end is a fresh start with three legitimate exits: continue (it’s working), switch (something matters more), stop (it told you what you needed to know). All three are wins — the sprint’s job was to find out.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'Running his own system in public as 30 Days of Getting Results — one practice a day for a month — and what a month of consecutive small reps does that a year of intention doesn’t.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'The sprint is the proving ground. The 13×4 runs laps of weeks; the sprint runs a lap of days — same shape, smaller orbit, faster verdict.',
                ],
              },
            ],
            tool: {
              name: 'Name One Sprint',
              practice: [
                'This week, Name One Sprint.',
                'Pick one thing to get better at this month. Define what “better” looks like in thirty days — one sentence.',
                'Choose the smallest daily rep that moves it. Do the rep.',
                'Put a note in your diary thirty days out: continue, switch, or stop?',
              ],
            },
          },
        },
        {
          week: 10,
          name: 'Growth Mindset',
          lines: ['Growth', 'Mindset'],
          coach: {
            wisdom:
              'Results are feedback, not verdicts. Treat every miss as data, change the approach, go again.',
          },
          fast: {
            focus: [
              'Well, you know how “I’m just not good at this” ends the conversation with yourself before it starts? How one bad result can feel like a verdict on who you are?',
              'Verdicts close cases. And you’re not a closed case.',
              'Growth Mindset is the working assumption the whole system runs on: ability is buildable, results are feedback, and the next rep changes you.',
            ],
            approach: [
              'Here’s the thinking: every practice in Agile Results assumes you can improve through practice — that’s what the reflections, reviews and sprints are FOR. Friday Reflection is pointless if results are verdicts; it’s priceless if results are data.',
              'JD’s framing is progress, not perfection. The system is deliberately forgiving — fresh start daily, weekly, monthly — because a system you can fail permanently is a system you’ll quit.',
              'And action creates inspiration, not the other way round. You don’t think your way into believing you can improve; you rep your way into it. The belief follows the evidence, and you manufacture the evidence.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'The system as a practice loop — “the more you practice, the better you get” built into its bones — and how treating misses as data turned hard weeks from indictments into iterations.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'Four laps a year means every miss gets another go. A system with that much forgiveness built in doesn’t need you to be brilliant — it needs you to stay in the game.',
                ],
              },
            ],
            tool: {
              name: 'The Yet Edit',
              practice: [
                'This week, practice The Yet Edit.',
                'Catch one “I can’t do X” — out loud or in your head — and append the word: “yet.”',
                'Then name the next rep: the one small action that moves X.',
                'One word, one rep. That’s a growth mindset in working clothes.',
              ],
            },
          },
        },
        {
          week: 11,
          name: 'Action Lists',
          lines: ['Action', 'Lists'],
          coach: {
            wisdom:
              'Keep doing separate from storing: today’s actions on one short list, everything else somewhere else. Lists you act on, not lists you fear.',
          },
          fast: {
            focus: [
              'Well, you know how one list holds “buy milk,” “restructure the department” and “maybe learn Spanish”? And how a list like that helps with none of them?',
              'A list that mixes horizons breeds avoidance — you scan it, flinch, and open email instead.',
              'Action Lists keep doing separate from storing: short, current, actionable lists you work FROM — today’s three wins and their supporting actions — with everything else living somewhere else.',
            ],
            approach: [
              'Here’s the thinking: a list you act on has rules. Short — it fits a card. Current — it’s today’s, not the archaeological record of every intention you’ve ever had. Actionable — every line starts with a verb you could do right now.',
              'Today’s list is disposable on purpose. You write it fresh each morning and let yesterday’s version go — the fresh start applies to the paperwork too. The queue (from Triage) holds the rest; the weekly review reopens the queue.',
              'JD goes one step further with scripts: recurring work written once as a step-by-step sequence, so the list thinks so you don’t have to. The system works for you — you’re the driver.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'Scripts — turning repeating work into written step sequences — and the day a “list” stopped being a guilt ledger and became an instrument you pick up, play, and put down.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'A list is a tool, not a conscience. The moment a list starts judging you instead of serving you, it’s storing — and storing belongs somewhere you don’t look every hour.',
                ],
              },
            ],
            tool: {
              name: 'The Two-List Split',
              practice: [
                'This week, run The Two-List Split.',
                'One card or screen for TODAY: your three wins plus the few actions that serve them. Nothing else.',
                'Everything else goes to the queue — which you review weekly, not hourly.',
                'Rewrite today’s list fresh each morning. Throw yesterday’s away. It finished when the day did.',
              ],
            },
          },
        },
        {
          week: 12,
          name: 'Reference Collections',
          lines: ['Reference', 'Collections'],
          coach: {
            wisdom:
              'A home for everything worth keeping — notes, checklists, ideas — out of your head and findable. Collect once, use forever.',
          },
          fast: {
            focus: [
              'Well, you know how good ideas die of homelessness? The quote you loved, the link you’d definitely read later, the insight from the meeting — gone, because they had nowhere to live?',
              'Your head is for having ideas, not for housing them.',
              'Reference Collections are the homes: organised places for the non-actionable-but-valuable — insights, ideas, quotes, notes, checklists — out of your head and findable when you need them.',
            ],
            approach: [
              'Here’s the thinking: reference is the opposite of action, and mixing them ruins both. Action lists stay short because reference has somewhere else to go; reference stays rich because it isn’t pretending to be a to-do.',
              'Collections support decisions. When the question comes — what worked last time, what was that idea, where’s the checklist — you consult instead of reconstruct. Collect once, use forever.',
              'And collections compound. A year of captured insights is a private library in your own voice; five years of it is a second brain that knows your patterns better than you remember them.',
            ],
            story: [
              {
                voice: 'JD',
                draft: true,
                text: [
                  'Decades of public collections — the notes and checklists that became books, sites and the system itself. Agile Results is, among other things, a reference collection that grew up.',
                ],
              },
              {
                voice: 'Tom',
                draft: true,
                text: [
                  'A good collection is compound interest on attention. Every wheel on this site started life as a captured note that had a home to grow in.',
                ],
              },
            ],
            tool: {
              name: 'Three Homes',
              practice: [
                'This week, build Three Homes.',
                'Create (or clean out) three collections: IDEAS, REFERENCE (notes and checklists), and INSPIRATION (quotes and sparks).',
                'Then the rule: every keeper you meet this week goes into its home within a minute of meeting it.',
                'A minute to file, forever to find. That’s the trade.',
              ],
            },
          },
        },
      ],
    },
  ],
};
