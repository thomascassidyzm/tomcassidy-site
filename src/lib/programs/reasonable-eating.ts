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
          diagram: {
            kind: 'slider',
            kicker: 'Hunger >> Appetite',
            ariaLabel:
              'A meter from Starving to Stuffed. Drag along it: the body’s hunger falls away early while appetite lingers, and a lit band marks the one reasonable place to stop.',
            axis: { low: '← less eaten', high: 'more eaten →' },
            stops: [
              { v: 0.0, label: 'Starving' },
              { v: 0.3, label: 'No longer hungry' },
              { v: 0.52, label: 'Comfortable' },
              { v: 0.78, label: 'Full' },
              { v: 1.0, label: 'Stuffed' },
            ],
            band: { lo: 0.18, hi: 0.42, cap: 'stop here' },
            curves: [
              { id: 'hunger', label: 'hunger', pigment: 'established', fall: { zeroAt: 0.3, power: 2 } },
              { id: 'appetite', label: 'appetite', pigment: 'contested', fall: { zeroAt: 1, power: 0.6 } },
            ],
            gap: { top: 'appetite', bottom: 'hunger' },
            thumbRides: 'appetite',
            initial: 0.3,
            resetLabel: '↺ back to the sweet spot',
            zones: [
              {
                upTo: 0.18,
                tone: 'ok',
                verdict: 'still hungry',
                say: 'Your body still <em>needs</em> this. Keep going — you are not there yet.',
                sub: 'Real hunger is the body asking. Honour it. The discipline isn’t to eat less here; it’s to notice the moment it’s answered.',
              },
              {
                upTo: 0.42,
                tone: 'ok',
                verdict: 'the reasonable stop',
                say: 'Hunger is met. <em>Stop here</em> — this is the reasonable place to stop.',
                sub: 'No longer hungry, well before full. Your body’s need has gone quiet; everything past this is appetite, not hunger. This is the whole algorithm.',
              },
              {
                upTo: 0.62,
                tone: 'over',
                verdict: 'appetite now',
                say: 'You’re comfortable. That extra bite? <em>Appetite talking</em> — not hunger.',
                sub: 'The need ended a moment ago. What’s pulling you on now is desire, habit, the taste still on the fork. Reasonable, gentle — but notice the line you just crossed.',
              },
              {
                upTo: 0.86,
                tone: 'far',
                verdict: 'past full',
                say: 'Full, and still eating. This is <em>appetite running the show</em>.',
                sub: 'Hunger has been at zero for a while. The gap you see lit beneath the curves is exactly how far appetite has carried you past what the body asked for.',
              },
              {
                upTo: 1,
                tone: 'far',
                verdict: 'stuffed',
                say: 'Stuffed. Heavy, slowed, a little sorry. <em>None of this was hunger.</em>',
                sub: 'The last stretch had nothing to do with need. Next time, the move is small and reasonable: stop one band to the left, where hunger ends and appetite begins.',
              },
            ],
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
          diagram: {
            kind: 'scale',
            cue: 'Eat nearer the top — did it grow into its shape?',
            meterLabel: 'How natural is your plate?',
            trayLabel: 'The tray — drag a food onto its rung',
            tiers: [
              { n: 1, pigment: 'derived', title: 'Unchanged from its natural state', sub: 'Most natural · best', score: 100 },
              { n: 2, pigment: 'derived', title: 'Rearranged, chemically identical', sub: 'Still whole', score: 78 },
              { n: 3, pigment: 'contested', title: 'Changed, but structurally intact', sub: 'Cooked · dried · roasted', score: 48 },
              { n: 4, pigment: 'contested', title: 'Changed beyond all relation', sub: 'Has an ingredients list · worst', score: 12 },
            ],
            // pre-mixed: this is the order the tray deals them in
            cards: [
              { id: 'bread', label: 'White bread', tier: 4 },
              { id: 'apple', label: 'Apple', tier: 1 },
              { id: 'chicken', label: 'Grilled chicken', tier: 3 },
              { id: 'cola', label: 'Cola', tier: 4 },
              { id: 'milk', label: 'Fresh milk', tier: 1 },
              { id: 'slaw', label: 'Coleslaw', tier: 2 },
              { id: 'cake', label: 'Cake', tier: 4 },
              { id: 'nuts', label: 'Roasted nuts', tier: 3 },
            ],
            praise: ['Right rung.', 'Exactly.', 'That is its shape.', 'Spot on.', 'Yes — that belongs there.'],
            nudgeUp: [
              'Nearer the top — this is more natural than that.',
              'Closer to natural than you placed it.',
              'This grew more into its shape — move it up.',
            ],
            nudgeDown: [
              'Lower down — this has been changed more than that.',
              'It is further from natural — nudge it down.',
              'More processed than that rung — move it down.',
            ],
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
          diagram: {
            kind: 'quadrant',
            xAxis: { name: 'Energy · calories', low: 'Low', high: 'High' },
            yAxis: { name: 'Nutrition', low: 'Low', high: 'High' },
            winCorner: 'tl',
            winLabel: 'High NERD',
            score: {
              kicker: 'NERD · nutrition ÷ energy',
              max: 10,
              formula: { type: 'ratio', xFloor: 5, k: 1.05 },
              tones: { win: 6.5, mid: 3.5 },
              bands: [
                { min: 9.3, word: 'A perfect 10', line: '{name} — heaps of nourishment for almost no energy. This is the corner you want to live in.' },
                { min: 7.8, word: 'Excellent', line: '{name} pays its way: real nutrition, energy kept in check. Eat freely.' },
                { min: 6, word: 'Decent', line: '{name} earns its place — good food, just be aware of the energy it carries.' },
                { min: 4, word: 'Middling', line: '{name} is carrying more energy than nutrition. Fine sometimes; not the foundation.' },
                { min: 2.3, word: 'Poor', line: '{name} is mostly energy with little to show for it. A treat, not a staple.' },
                { min: 1, word: 'A 1', line: '{name} — all energy, no nutrition. The bottom-right corner: everything the NERD warns against.' },
              ],
            },
            // x = energy, y = nutrition (both 0..100)
            points: [
              { name: 'Broccoli', x: 12, y: 96 },
              { name: 'Salmon', x: 46, y: 82 },
              { name: 'Apple', x: 36, y: 70 },
              { name: 'White bread', x: 60, y: 26 },
              { name: 'Donut', x: 92, y: 10 },
              { name: 'Soda', x: 86, y: 3 },
            ],
            initialPoint: 0,
            hint: 'Drag the dot anywhere · tap a food to fly it there',
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
