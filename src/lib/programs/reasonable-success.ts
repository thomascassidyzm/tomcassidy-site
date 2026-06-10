import type { Program } from '@/kit/types';

/**
 * Reasonable Success — winning the inner game of entrepreneurship. A 13×4:
 * Algorithm Zero ("It's an inside job") at the hub, twelve weekly focus points
 * across four domains — MIND / BODY / SOUL / PEOPLE — cycling for the year.
 *
 * Authored ENTIRELY as data from Tom's text summary — no component or schema
 * changes — the proof that a new "Reasonable X" is a data file, not engineering.
 * The words are Tom's, lightly fitted to the coach format.
 *
 * Domain → pigment, by meaning: Mind = ink-blue (established), Body = green
 * (derived), Soul = plum (open), People = amber (contested).
 */
export const reasonableSuccess: Program = {
  slug: 'reasonable-success',
  title: 'Reasonable Success',
  blurb: 'Winning the inner game of entrepreneurship. Success: it’s an inside job.',
  cycles: 3,
  hub: {
    label: ['INSIDE', 'JOB'],
    algorithmName: 'It’s an inside job',
    coach: {
      wisdom:
        'Success is an inside job. Win the inner game — mind, body, soul and people — and the outer game follows. Everything on this wheel works from the inside out.',
    },
  },
  domains: [
    {
      name: 'MIND',
      question: 'How to think',
      pigment: 'established',
      focuses: [
        {
          week: 1,
          name: 'Notice',
          lines: ['Notice'],
          coach: {
            wisdom:
              'Notice your thoughts, your energy, your feelings, your results. Just notice — tune in to what’s actually going on in the moment. Resist the temptation to change anything. Just notice.',
          },
        },
        {
          week: 5,
          name: 'Deliberate thoughts',
          lines: ['Deliberate', 'thoughts'],
          coach: {
            wisdom:
              'Whenever you notice, deliberately choose the thoughts that serve you. Think about what you want, not about what you don’t. What are you putting in? Is it helpful? What WOULD you choose — if you could?',
          },
        },
        {
          week: 9,
          name: 'Have a definite vision',
          lines: ['Have a', 'definite vision'],
          coach: {
            wisdom:
              'Spend every conscious moment thinking in definite terms about your vision — for yourself, for your life, for your business.',
          },
        },
      ],
    },
    {
      name: 'BODY',
      question: 'How to be well',
      pigment: 'derived',
      focuses: [
        {
          week: 2,
          name: 'Eat well',
          lines: ['Eat well'],
          coach: {
            wisdom:
              'The four basics of eating well: chew your food until liquid; eat for hunger, not appetite; eat for fun, taste and health; and eat what grew into its shape.',
          },
        },
        {
          week: 6,
          name: 'Sleep well',
          lines: ['Sleep well'],
          coach: {
            wisdom:
              'Boss your sleep. Go to bed early, keep a standard wind-down routine, make the room dark, get plenty of fresh air, and control the ambient noise.',
          },
        },
        {
          week: 10,
          name: 'Move well',
          lines: ['Move well'],
          coach: {
            wisdom:
              'Keep agile. Stretch often, take the stairs, stand at a vertical desk, walk — build regular movement into the necessary parts of your day. Low impact, low cardio is better for a long life.',
          },
        },
      ],
    },
    {
      name: 'SOUL',
      question: 'How to create value',
      pigment: 'open',
      focuses: [
        {
          week: 3,
          name: 'Agile results',
          lines: ['Agile', 'results'],
          coach: {
            wisdom:
              'Practise the Rule of 3, Monday Vision / Friday Reflection, and Life Hot Spots and Themes — a light system for creating value without grinding.',
          },
        },
        {
          week: 7,
          name: 'The daily practice',
          lines: ['The daily', 'practice'],
          coach: {
            wisdom:
              'Algorithms to make you a creative powerhouse — like the 8 Ideas: every day, take 8 minutes to create 8 ideas on one aspect of your business. Over time it makes you a creative genius. Quantity has a quality all its own.',
          },
        },
        {
          week: 11,
          name: 'Move from the ME to the WE',
          lines: ['From the ME', 'to the WE'],
          coach: {
            wisdom:
              'In everything you create, harness the creative powers of the universe by bringing greater life to all and less to none. The creative spirit comes to those working to secure advantage for all — not just for themselves and their own.',
          },
        },
      ],
    },
    {
      name: 'PEOPLE',
      question: 'How to be with people',
      pigment: 'contested',
      focuses: [
        {
          week: 4,
          name: 'Do small things in a great way',
          lines: ['Do small things', 'in a great way'],
          coach: {
            wisdom:
              'Do everything you do, however small, with the spirit of greatness — and people will be drawn to you.',
          },
        },
        {
          week: 8,
          name: 'Give the impression of increase',
          lines: ['Give impression', 'of increase'],
          coach: {
            wisdom:
              'Want for everyone what you want for yourself. The same success, joy, peace, love and happiness you want for you — want it for everybody.',
          },
        },
        {
          week: 12,
          name: 'Act to complete an improving world',
          lines: ['Complete the', 'improving world'],
          coach: {
            wisdom:
              'Create greater life for all — current and future — and less to none. Don’t despair at what’s wrong, or judge those at a lower level of awareness. Work as a god among gods, as great as the greatest but better than none, to accelerate an improving world to completion.',
          },
        },
      ],
    },
  ],
};
