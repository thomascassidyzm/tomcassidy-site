import type { Program } from '@/kit/types';

/**
 * Reasonable Eating — the flagship 13×4. Algorithm Zero (EAT MORE) at the hub,
 * twelve weekly focus points in four domains, cycling HOW → WHEN → WHY → WHAT,
 * over 13 weeks × 4 cycles = the 52-week Franklin year.
 *
 * The mnemonics are Tom's. The `coach.wisdom` lines are DRAFT coach copy in his
 * register — a starting point for him to finesse, not finished prose.
 */
export const reasonableEating: Program = {
  slug: 'reasonable-eating',
  title: 'Reasonable Eating',
  blurb: 'Thirteen reasonable algorithms for how, when, why and what you eat — one focus a week, four laps a year.',
  essaySlug: undefined,
  cycles: 3,
  hub: {
    label: ['EAT', 'MORE'],
    algorithmName: 'Eat more',
    coach: {
      wisdom:
        'Start from abundance, not restriction. Reasonable eating adds good things; it doesn’t police you. Eat more — of the right things, in the right way.',
    },
  },
  domains: [
    {
      name: 'HOW',
      question: 'How you eat',
      pigment: 'derived',
      focuses: [
        {
          week: 1,
          name: 'Chew until liquid',
          lines: ['Chew until', 'liquid'],
          coach: {
            wisdom:
              'Let your teeth do the work your gut shouldn’t have to. Chew it to a drink and digestion is half done before you swallow.',
          },
        },
        {
          week: 5,
          name: 'Eat slow',
          lines: ['Eat slow'],
          coach: {
            wisdom:
              'There’s no prize for finishing first. Slow down and the meal lasts longer, satisfies sooner, and you taste all of it.',
          },
        },
        {
          week: 9,
          name: 'Savour the flavour',
          lines: ['Savour the', 'flavour'],
          coach: {
            wisdom:
              'Actually notice what’s in your mouth. Pleasure paid attention to goes a very long way — and a little becomes plenty.',
          },
        },
      ],
    },
    {
      name: 'WHEN',
      question: 'When you eat',
      pigment: 'contested',
      focuses: [
        {
          week: 2,
          name: 'Hunger >> Appetite',
          lines: ['Hunger >>', 'Appetite'],
          coach: {
            wisdom:
              'Appetite is the menu in your head; hunger is the signal in your body. Wait for the body to ask, and let it lead.',
          },
        },
        {
          week: 6,
          name: 'Stop when no longer hungry',
          lines: ['Stop when', 'no longer', 'hungry'],
          coach: {
            wisdom:
              'Aim for “not hungry,” not “full.” Lay the fork down a few bites early and your body catches up grateful, never stuffed.',
          },
        },
        {
          week: 10,
          name: 'Eat naturally, not continuously',
          lines: ['Eat naturally', 'not', 'continuously'],
          coach: {
            wisdom:
              'You’re built to eat in rhythm, not to graze all day. Give the body real gaps and meals mean something again.',
          },
        },
      ],
    },
    {
      name: 'WHY',
      question: 'Why you eat',
      pigment: 'open',
      focuses: [
        {
          week: 3,
          name: 'Eat for the body & the taste buds',
          lines: ['Eat for the', 'body & the', 'taste buds'],
          coach: {
            wisdom:
              'You don’t have to choose between good-for-you and good-tasting. Aim for both — the best food earns its place on both counts.',
          },
        },
        {
          week: 7,
          name: 'Eat for a long life',
          lines: ['Eat for a', 'long life'],
          coach: {
            wisdom:
              'Ask of a plate: would this carry me to a strong old age? Eat as if you intend to be here, and well, for the long run.',
          },
        },
        {
          week: 11,
          name: 'Eat for fun',
          lines: ['Eat for fun'],
          coach: {
            wisdom:
              'Joy is a real reason to eat — guilt is not. Choose the treat openly, enjoy it fully, and move on lightly.',
          },
        },
      ],
    },
    {
      name: 'WHAT',
      question: 'What you eat',
      pigment: 'established',
      focuses: [
        {
          week: 4,
          name: 'Did it grow into its shape?',
          lines: ['Did it grow', 'into its', 'shape?'],
          coach: {
            wisdom:
              'An apple looks like an apple; a crisp looks like a factory. The closer a food is to how it grew, the better it tends to be.',
          },
        },
        {
          week: 8,
          name: 'Eat a high NERD',
          lines: ['Eat a high', 'NERD'],
          coach: {
            wisdom:
              'NERD = Nutrition-to-Energy Ratio. Broccoli scores ten, a doughnut scores one. Chase the high-NERD foods and the rest takes care of itself.',
          },
        },
        {
          week: 12,
          name: 'Eat what YOU control',
          lines: ['Eat what', 'YOU control'],
          coach: {
            wisdom:
              'When you make it, you own every ingredient. Cook it yourself more often and you quietly decide what your body gets.',
          },
        },
      ],
    },
  ],
};
