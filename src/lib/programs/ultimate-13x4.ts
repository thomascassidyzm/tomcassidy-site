import type { Program } from '@/kit/types';

/**
 * The Ultimate 13×4 — the original life wheel: Health, Wealth and
 * Relationships, four focuses each, with NOTICE at the centre as week 1 —
 * every lap begins by paying attention. Transcribed from Tom's "Ultimate
 * 13x4" wheel; a third wheel SHAPE for the kit (3 domains × 4 + a week-1
 * in-rotation hub, after eating's always-on hub and leadership's week-13
 * review).
 *
 * The slice titles are Tom's, verbatim from the wheel. The `coach.wisdom`
 * lines are DRAFT coach copy in his register — a starting point for him to
 * finesse, not finished prose.
 */
export const ultimate13x4: Program = {
  slug: 'ultimate-13x4',
  title: 'The Ultimate 13×4',
  blurb:
    'The original thirteen — health, wealth and relationships, one focus a week, four laps a year, with Notice at the centre of it all.',
  essaySlug: undefined,
  cycles: 4,
  hub: {
    label: ['NOTICE'],
    algorithmName: 'Notice',
    numeral: '1',
    kicker: 'Week 1 · where every lap begins',
    pigment: 'established',
    inRotation: true,
    coach: {
      wisdom:
        'Everything starts with noticing. What you eat, what you spend, how you speak to people — you can’t change what you haven’t seen. Pay attention first; the other twelve depend on it.',
    },
  },
  domains: [
    {
      name: 'HEALTH',
      question: 'Your health',
      pigment: 'derived',
      focuses: [
        {
          week: 2,
          name: 'Eat Less',
          lines: ['Eat Less'],
          coach: {
            wisdom:
              'Not a diet — a direction. Most of us eat past the point of need most days; just less, today, is the whole instruction.',
          },
        },
        {
          week: 5,
          name: 'Move More',
          lines: ['Move More'],
          coach: {
            wisdom:
              'The body is built to move and rewards you for it. Stairs, walks, carrying the shopping — motion woven through the day beats the occasional heroic workout.',
          },
        },
        {
          week: 8,
          name: 'Breathe Deeply',
          lines: ['Breathe', 'Deeply'],
          coach: {
            wisdom:
              'The one lever on your nervous system you can pull anywhere, for free. A few slow, deep breaths change the state you’re in — use them on purpose.',
          },
        },
        {
          week: 11,
          name: 'Sleep Well',
          lines: ['Sleep Well'],
          coach: {
            wisdom:
              'Sleep is when the repairs happen. Guard the hours, darken the room, park the phone — almost everything else gets easier when this is right.',
          },
        },
      ],
    },
    {
      name: 'WEALTH',
      question: 'Your wealth',
      pigment: 'contested',
      focuses: [
        {
          week: 3,
          name: 'Create Vision of More Life to All',
          lines: ['Create Vision', 'of More Life', 'to All'],
          coach: {
            wisdom:
              'Wealth starts as picture-making. Hold a clear vision of more life — for you and for everyone your work touches — and keep it in view every day.',
          },
        },
        {
          week: 6,
          name: 'Mean It',
          lines: ['Mean It'],
          coach: {
            wisdom:
              'A vision you don’t mean is a daydream. Commit — say it like you mean it, and act like it’s already on its way.',
          },
        },
        {
          week: 9,
          name: 'Believe It',
          lines: ['Believe It'],
          coach: {
            wisdom:
              'Belief is the bridge between the picture and the doing. Expect it to work; doubt quietly starves the whole machine.',
          },
        },
        {
          week: 12,
          name: 'Be Grateful For It',
          lines: ['Be Grateful', 'For It'],
          coach: {
            wisdom:
              'Gratitude in advance and in arrears. Thankful for what’s here and what’s coming — it keeps you connected to the source of all of it.',
          },
        },
      ],
    },
    {
      name: 'RELATIONSHIPS',
      question: 'Your relationships',
      pigment: 'open',
      focuses: [
        {
          week: 4,
          name: 'Love More',
          lines: ['Love More'],
          coach: {
            wisdom:
              'The simplest instruction on the wheel, and the deepest. More warmth, more patience, more benefit of the doubt — given first, not earned.',
          },
        },
        {
          week: 7,
          name: 'Give Impression of Increase',
          lines: ['Give', 'Impression of', 'Increase'],
          coach: {
            wisdom:
              'Let everyone you deal with be a little better off for it. People should leave a conversation with you feeling larger, not smaller.',
          },
        },
        {
          week: 10,
          name: 'Want For Everyone What You Want For Yourself',
          lines: ['Want', 'For Everyone', 'What You Want', 'For Yourself'],
          coach: {
            wisdom:
              'The advancement you want — want it for everybody. Competing shrinks the world; wanting everyone to win grows it.',
          },
        },
        {
          week: 13,
          name: 'Act as a God Among Gods',
          lines: ['Act as a', 'God', 'Among Gods'],
          coach: {
            wisdom:
              'Carry yourself as a creator among creators — and treat everyone else as one too. No grovelling, no lording it; equals, making things.',
          },
        },
      ],
    },
  ],
};
