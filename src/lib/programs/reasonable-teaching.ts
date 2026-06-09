import type { Program } from './types';

/**
 * Reasonable Teaching — developing the nine characteristics of exceptional
 * teaching, one a week, cycling for the 36-week academic year. The programme
 * runs on THE 9×4 engine (its wheel): a genuinely different shape from
 * Reasonable Eating (two halves of four, a Self-Belief keystone that is itself
 * week 1, numerals that run 1..9) rendered through the SAME ProgramWheel from
 * data alone. The teaching content is Tom's (see the essay "The 9×4"); the
 * `coach.wisdom` lines are DRAFT coach copy in his register, for him to finesse.
 *
 * Geometry: domain 0 is the right half (Philosophy), domain 1 the left half
 * (Action) — matching the original wheel's Action-left / Philosophy-right split.
 */
export const reasonableTeaching: Program = {
  slug: 'reasonable-teaching',
  title: 'Reasonable Teaching',
  blurb: 'Developing the nine characteristics of exceptional teaching — one focus a week, across the academic year. Run on the 9×4 engine.',
  essaySlug: 'the-9x4',
  cycles: 4,
  rotationStyle: 'sequential',
  hub: {
    label: ['Self-', 'Belief'],
    algorithmName: 'Self-Belief',
    numeral: '1',
    kicker: 'The keystone · Week 1',
    pigment: 'established',
    inRotation: true,
    coach: {
      wisdom:
        'Everything starts here. Believe you can make the difference and your students will believe it too — it is the keystone the other eight rest on.',
    },
  },
  domains: [
    {
      name: 'PHILOSOPHY',
      question: 'What you believe',
      pigment: 'contested',
      focuses: [
        {
          week: 2,
          name: 'Know why you’re doing it',
          lines: ['know why', 'you’re doing it'],
          coach: {
            wisdom:
              'Teach on purpose. When you’re clear about why this matters, the room feels it — purpose is contagious.',
          },
        },
        {
          week: 4,
          name: 'Think big',
          lines: ['think big'],
          coach: {
            wisdom:
              'Hold the highest possible vision for every child. Aim small and you’ll hit small; aim big and even the misses land high.',
          },
        },
        {
          week: 6,
          name: 'Take risks',
          lines: ['take risks'],
          coach: {
            wisdom:
              'The safe lesson is rarely the memorable one. Dare a little — the best teaching lives just past your comfort zone.',
          },
        },
        {
          week: 8,
          name: 'Reward effort',
          lines: ['reward effort'],
          coach: {
            wisdom:
              'Praise the trying, not just the talent. Effort is the thing they can control, so make it the thing that pays.',
          },
        },
      ],
    },
    {
      name: 'ACTION',
      question: 'What you do',
      pigment: 'derived',
      focuses: [
        {
          week: 3,
          name: 'High energy',
          lines: ['high energy'],
          coach: {
            wisdom:
              'Bring the energy you want back. A class mirrors the front of the room — set the temperature, don’t wait for it.',
          },
        },
        {
          week: 5,
          name: 'Tell your story',
          lines: ['tell your', 'story'],
          coach: {
            wisdom:
              'Facts inform; stories land. Wrap the lesson in something human and it sticks where a bullet point never could.',
          },
        },
        {
          week: 7,
          name: 'Do the basics well',
          lines: ['do the', 'basics well'],
          coach: {
            wisdom:
              'Master the ordinary — clear instructions, good questions, fair routines. Done consistently, the basics ARE outstanding teaching.',
          },
        },
        {
          week: 9,
          name: 'Get out of the way',
          lines: ['get out', 'of the way'],
          coach: {
            wisdom:
              'The goal isn’t to be needed; it’s to be unnecessary. Set it up well, then step back and let them do the learning.',
          },
        },
      ],
    },
  ],
};
