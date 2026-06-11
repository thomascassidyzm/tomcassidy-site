import type { Program } from '@/kit/types';

/**
 * Agile Results 13/4 — JD Meier's system for getting stuff done, drawn as a
 * 13×4 wheel by Tom. A single continuous ring (the first ONE-domain wheel):
 * twelve practices run sequentially, with the Review Cycle as the week-13
 * in-rotation hub — the system that improves the system.
 *
 * Practice names are verbatim from the wheel. The coach.wisdom lines are
 * DRAFT distillations of JD's system in Tom's register — for Tom (and JD) to
 * finesse, not finished prose.
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
        },
        {
          week: 2,
          name: 'Monday Vision · Daily Wins · Friday Reflection',
          lines: ['Mon Vision', 'Daily Wins', 'Fri Reflection'],
          coach: {
            wisdom:
              'The weekly rhythm: Monday, picture the week’s wins; daily, name today’s; Friday, look back and learn. The loop that keeps the whole system honest.',
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
        },
        {
          week: 4,
          name: '3 Wins for Today',
          lines: ['3 Wins for', 'TODAY'],
          coach: {
            wisdom:
              'Each morning, choose today’s three. Not tasks — wins. The day gets a shape, and you get to win it.',
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
        },
        {
          week: 6,
          name: 'TimeBoxing',
          lines: ['TimeBoxing'],
          coach: {
            wisdom:
              'Give work a box, not an open road. Fix the time, flex the scope — the box does the prioritising for you.',
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
        },
        {
          week: 8,
          name: 'Triage',
          lines: ['Triage'],
          coach: {
            wisdom:
              'When it all lands at once: do it, defer it, delegate it, or drop it. Triage isn’t giving up — it’s choosing what wins.',
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
        },
        {
          week: 10,
          name: 'Growth Mindset',
          lines: ['Growth', 'Mindset'],
          coach: {
            wisdom:
              'Results are feedback, not verdicts. Treat every miss as data, change the approach, go again.',
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
        },
        {
          week: 12,
          name: 'Reference Collections',
          lines: ['Reference', 'Collections'],
          coach: {
            wisdom:
              'A home for everything worth keeping — notes, checklists, ideas — out of your head and findable. Collect once, use forever.',
          },
        },
      ],
    },
  ],
};
