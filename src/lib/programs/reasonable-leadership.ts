import type { Program } from '@/kit/types';

/**
 * Reasonable Leadership — a science-based programme to develop the
 * characteristics of exceptional leadership, so every participant can improve
 * their capacity to create greater life for all. The canonical Franklin 13×4:
 * four domains (BELIEVE / THINK / ACT / INTERACT) of three focus points,
 * cycling weeks 1–12, then a 13th week — the End-of-Cycle Review — that closes
 * the loop. Repeated four times = the 52-week year.
 *
 * Unlike Reasonable Eating's always-on hub, here the 13th point IS a weekly
 * stop (`inRotation`), at the END of the cycle. Authored as data; the words are
 * Tom's, distilled to the coach format. Domain → pigment by meaning:
 * Believe = ink-blue (established), Think = plum (open), Act = green (derived),
 * Interact = amber (contested).
 */
export const reasonableLeadership: Program = {
  slug: 'reasonable-leadership',
  title: 'Reasonable Leadership',
  blurb: 'Developing the characteristics of exceptional leadership — so every leader can improve their capacity to create greater life for all.',
  cycles: 3,
  hub: {
    label: ['CYCLE', 'REVIEW'],
    algorithmName: 'End of Cycle Review',
    numeral: '13',
    kicker: 'Week 13 · End-of-cycle review',
    inRotation: true,
    coach: {
      wisdom:
        'Notice how far you’ve come. What’s going well? What can you learn from? What learning will you carry into the next cycle? — reinforcing the Do / Investigate / Adapt continuous-development loop.',
    },
  },
  domains: [
    {
      name: 'BELIEVE',
      question: 'What to believe',
      pigment: 'established',
      focuses: [
        {
          week: 1,
          name: 'The Arrow of the Universe',
          lines: ['The Arrow of', 'the Universe'],
          coach: {
            wisdom:
              'The universe runs from disorder to order — energy ordering into matter, then cells, organisms, humans, and finally thoughts, each step a more elegant complexity. Our role is to be the universe’s local information-gatherers and problem-solvers, from cosmic energy to great ideas. On Spaceship Earth we are not passengers, we are crew — your contribution is not optional.',
          },
        },
        {
          week: 5,
          name: 'Your Identity',
          lines: ['Your', 'Identity'],
          coach: {
            wisdom:
              'See yourself as an emergent property of Universe — the sum of all your possible future paths, not the sum of your past results. The universe spent considerable energy to get you to today; the unique “pattern integrity” you perceive as yourself is both necessary and unique.',
          },
        },
        {
          week: 9,
          name: 'Your contribution',
          lines: ['Your', 'contribution'],
          coach: {
            wisdom:
              'Spend as much of your physical and metaphysical resources as you can at the intersection of what you love, what you’re good at, and what’s valuable to people. Look for the hardest problem you feel most uniquely qualified to solve — one you have, or can acquire, the wisdom, willingness and wherewithal to crack.',
          },
        },
      ],
    },
    {
      name: 'THINK',
      question: 'How to think',
      pigment: 'open',
      focuses: [
        {
          week: 2,
          name: 'Notice',
          lines: ['Notice'],
          coach: {
            wisdom:
              'Notice your thoughts, your energy, your feelings, your results. Just notice — tune in to what’s actually going on, and resist the temptation to change it. The degree to which you can raise your own consciousness will determine your agency.',
          },
        },
        {
          week: 6,
          name: 'The Script',
          lines: ['The Script'],
          coach: {
            wisdom:
              'Ask “What would you choose?” to tell whether the voice in your head is your intuition or the script you inherited from past experience. Any thought, feeling or energy that isn’t helpful, you can simply name as script — not intuition — and let it go.',
          },
        },
        {
          week: 10,
          name: 'The Sausage Machine',
          lines: ['The Sausage', 'Machine'],
          coach: {
            wisdom:
              'Ask “What are you putting in?” across every area of your life — relationships, career, health, identity. Whenever you catch yourself feeding in what the script chose, replace it with what you WOULD choose. Like karma, it gives you instant agency, and it appears to be a universal principle.',
          },
        },
      ],
    },
    {
      name: 'ACT',
      question: 'How to act',
      pigment: 'derived',
      focuses: [
        {
          week: 3,
          name: 'Agile Results',
          lines: ['Agile', 'Results'],
          coach: {
            wisdom:
              'Practise the Rule of 3, Monday Vision / Friday Reflection, Life Hot Spots and Themes, and the Pomodoro technique for maximum effectiveness. The fundamental aim: make sure you bring your best energy to your best work.',
          },
        },
        {
          week: 7,
          name: 'Discernment',
          lines: ['Discernment'],
          coach: {
            wisdom:
              'Discernment is making sound, nuanced judgments — going past mere perception to weigh something’s real qualities. Do your own thinking; don’t just take anyone’s word, including mine. Perceiving information well, making sense of it, and acting wisely upon it is the gateway to high agency.',
          },
        },
        {
          week: 11,
          name: 'Balance',
          lines: ['Balance'],
          coach: {
            wisdom:
              'Tend to all aspects of your humanity to keep the vital life force your best work needs — mental, physical, spiritual and emotional, all functioning well. Sleep well, eat well and move well to get the foundations sorted; that physical platform supports everything metaphysical.',
          },
        },
      ],
    },
    {
      name: 'INTERACT',
      question: 'How to interact',
      pigment: 'contested',
      focuses: [
        {
          week: 4,
          name: 'Be the example',
          lines: ['Be the', 'example'],
          coach: {
            wisdom:
              'Be the example of everything you want to create in the world. Do everything, however small, with the spirit of greatness — people will be drawn to you, want to follow you, and copy your practices. You can start now, and greatness will soon be thrust upon you.',
          },
        },
        {
          week: 8,
          name: 'Give the impression of increase',
          lines: ['Give impression', 'of increase'],
          coach: {
            wisdom:
              'Want for everyone what you want for yourself — the same success, joy, peace, love and happiness. Everybody wants MORE in their lives, and people will come to you in throngs when they perceive you can bring more to them.',
          },
        },
        {
          week: 12,
          name: 'Act to accelerate the completion of the world',
          lines: ['Accelerate the', 'completion'],
          coach: {
            wisdom:
              'Create greater life for all current and future agents, and less to none. We live in an improving world; don’t despair at what’s wrong or judge those at a lower level of awareness. Work as if a god among gods — as great as the greatest but better than none — to accelerate an improving world to completion.',
          },
        },
      ],
    },
  ],
};
