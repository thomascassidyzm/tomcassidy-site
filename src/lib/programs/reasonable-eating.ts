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
      banks: {
        gentle: [
          'No rules today. Just eat more of the good stuff.',
          'This isn’t about taking away. It’s about adding.',
          'Abundance, not restriction. That’s the whole spirit.',
          'Nothing’s forbidden. Some things are just better, and there’s more of them.',
          'Be on your own side today.',
        ],
        encouraging: [
          'You get to eat MORE. Honestly, that’s the deal.',
          'Add a good thing today and you’re already doing it.',
          'This one’s generous — lean into it.',
          'Good food, more of it. You’ve got this.',
          'Every good thing you add counts. All of them.',
        ],
        honestKind: [
          'Diets fail because they take. This adds — that’s why it lasts.',
          'You don’t need less willpower. You need a kinder plan.',
          'Restriction makes you tired and cross. Abundance doesn’t.',
          'The right things, the right way — that’s reasonable, not strict.',
        ],
        playful: [
          'Eat more? Don’t mind if I do.',
          'A diet that says “more” — finally one I like.',
          'Plot twist: the coach wants you to eat.',
          'More of the good stuff. Terrible hardship, I know.',
        ],
      },
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
            banks: {
              gentle: [
                'Just a few extra chews this week. That’s all.',
                'Chew it soft before it goes down.',
                'Let the teeth do the work, not the gut.',
                'One mouthful, well chewed. Then the next.',
                'Soft as a drink before you swallow — no rush.',
              ],
              encouraging: [
                'A few more chews and digestion’s half done. Easy win.',
                'You already know how to chew — just a little longer.',
                'Small thing, big payoff. Keep at it.',
                'Every mouthful you chew well is the body thanking you.',
              ],
              honestKind: [
                'Swallowing in lumps makes the gut do your teeth’s job.',
                'You taste more when you chew more. Genuinely.',
                'Fast swallowing is a habit, not a need — and habits soften.',
                'Half of “eating slow” is just chewing properly first.',
              ],
              playful: [
                'Chew it till it’s a smoothie. Roughly.',
                'Your teeth called. They’d like more to do.',
                'Liquid lunch — but the chewy way.',
                'Thirty-two teeth, standing idle. Put them to work.',
              ],
            },
          },
        },
        {
          week: 5,
          name: 'Eat slow',
          lines: ['Eat slow'],
          coach: {
            wisdom:
              'There’s no prize for finishing first. Slow down and the meal lasts longer, satisfies sooner, and you taste all of it.',
            banks: {
              gentle: [
                'No rush today. The food isn’t going anywhere.',
                'Put the fork down between bites if you like.',
                'Slow is allowed. Slow is the point.',
                'Let the meal take the time it takes.',
                'A breath between mouthfuls. That’s the whole move.',
              ],
              encouraging: [
                'Slow down and the meal gives you more. Lovely.',
                'You’ve got time for this one. Take it.',
                'Easing off the pace — that’s you doing it right.',
                'Slower means more taste and more ease. Win-win.',
              ],
              honestKind: [
                'There’s no prize for finishing first. Never was.',
                'Eating fast skips the part you actually wanted: the meal.',
                'Fullness arrives late — slow gives it time to catch you.',
                'You’re not behind. The hurry is borrowed, not yours.',
              ],
              playful: [
                'It’s dinner, not a race. No medals here.',
                'Slow food, the unofficial version.',
                'Last one to finish wins. New rule.',
                'Savour mode: engaged.',
              ],
            },
          },
        },
        {
          week: 9,
          name: 'Savour the flavour',
          lines: ['Savour the', 'flavour'],
          coach: {
            wisdom:
              'Actually notice what’s in your mouth. Pleasure paid attention to goes a very long way — and a little becomes plenty.',
            banks: {
              gentle: [
                'Notice this mouthful. Really taste it.',
                'What’s actually in your mouth right now?',
                'Let yourself enjoy it on purpose.',
                'A little, properly tasted, is plenty.',
                'Pleasure counts. Pay it some attention.',
              ],
              encouraging: [
                'Taste it fully and a little goes a long way. Nice.',
                'You’re allowed to love your food. Do.',
                'Noticing the flavour — that’s the skill, and you’ve got it.',
                'Savour one bite well and you’ve done the week.',
              ],
              honestKind: [
                'Eating on autopilot, you miss the bit you wanted.',
                'Flavour ignored isn’t saved — it’s just lost.',
                'You can’t feel satisfied by food you didn’t taste.',
                'Attention is what turns a little into enough.',
              ],
              playful: [
                'Taste buds: deploy.',
                'Be a food critic for one mouthful.',
                'Close your eyes. Make it dramatic. Taste it.',
                'Slow-mo this bite.',
              ],
            },
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
            banks: {
              gentle: [
                'Is that hunger, or just the menu in your head?',
                'Let the body ask first.',
                'Appetite talks loud. Hunger waits quietly.',
                'No need to answer every craving the moment it speaks.',
                'Check in with the body before the kitchen.',
              ],
              encouraging: [
                'You can tell the two apart — just pause and feel.',
                'Waiting for real hunger is a quiet superpower. Use it.',
                'Letting the body lead — that’s you trusting yourself.',
                'One pause is all it takes to know which one it is.',
              ],
              honestKind: [
                'Most “hungry” is appetite wearing hunger’s coat.',
                'The fridge didn’t call you. A thought did.',
                'Hunger is patient. If it can’t wait, it might not be hunger.',
                'Your body knows. The head just talks over it.',
              ],
              playful: [
                'Hunger or boredom? Be honest now.',
                'The menu in your head is doing a hard sell.',
                'Belly says nothing, brain says snacks. Hmm.',
                'Appetite: the world’s pushiest waiter.',
              ],
            },
          },
        },
        {
          week: 6,
          name: 'Stop when no longer hungry',
          lines: ['Stop when', 'no longer', 'hungry'],
          coach: {
            wisdom:
              'Aim for “not hungry,” not “full.” Lay the fork down a few bites early and your body catches up grateful, never stuffed.',
            banks: {
              gentle: [
                'Aim for “not hungry,” not “full.”',
                'You can stop a few bites early. Nothing’s lost.',
                'No longer hungry is the finish line.',
                'The plate can wait. So can the last few bites.',
                'Comfortable is plenty. You don’t owe it stuffed.',
              ],
              encouraging: [
                'Lay the fork down a touch early — the body thanks you.',
                'You’ll feel lighter for it. Trust that.',
                'Stopping at “enough” is a real skill, and it’s yours.',
                'A few bites left behind is a quiet little win.',
              ],
              honestKind: [
                'Fullness shows up late — stop before it has to shout.',
                'Cleaning the plate is a habit, not a need.',
                'Stuffed isn’t a reward. It’s just past the good bit.',
                'The leftovers aren’t wasted if your body didn’t need them.',
              ],
              playful: [
                'The plate is not a deadline.',
                'Leave a couple bites. Live dangerously.',
                'No prize for a clean plate, sorry.',
                'Stop at “ahh,” not “oof.”',
              ],
            },
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
            banks: {
              gentle: [
                'Eat in rhythm, not all day long.',
                'A real gap between meals is a kindness to the body.',
                'Let hunger come back before the next one.',
                'Meals, not a constant trickle.',
                'Space them out and each one means more.',
              ],
              encouraging: [
                'Give the body a real gap — it loves the rhythm.',
                'A proper meal beats all-day nibbling, and you know it.',
                'Letting hunger return makes the next meal a joy.',
                'One clear gap today is the whole practice.',
              ],
              honestKind: [
                'Grazing all day means never quite hungry, never quite satisfied.',
                'The constant snack isn’t a meal — it’s background noise.',
                'You’re built for rhythm. All-day eating fights it.',
                'A gap isn’t deprivation. It’s how the next meal gets its taste back.',
              ],
              playful: [
                'The kitchen isn’t a buffet open till midnight.',
                'Give the snacks an interval.',
                'Hunger’s allowed to visit — let it knock.',
                'Three meals, not thirty nibbles.',
              ],
            },
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
            banks: {
              gentle: [
                'Good for you and good to eat — ask for both.',
                'Pleasure and nourishment aren’t enemies.',
                'The best food pleases the body and the taste buds.',
                'You don’t have to pick a side here.',
                'Aim for both, gently.',
              ],
              encouraging: [
                'Both at once — that’s the sweet spot, and it’s reachable.',
                'Tasty and good for you exist together. Go find them.',
                'You can have the joy and the nourishment. Really.',
                'Pick a food that ticks both boxes today — easy.',
              ],
              honestKind: [
                '“Healthy but joyless” doesn’t last. Neither does “tasty but empty.”',
                'You don’t have to suffer to eat well.',
                'Food that only does one job isn’t the best food.',
                'Bland virtue and guilty pleasure both miss the point.',
              ],
              playful: [
                'Why not both?',
                'Delicious AND virtuous. Greedy, in the best way.',
                'Taste buds and body, hand in hand.',
                'The food that wins on both counts is out there. Hunt it.',
              ],
            },
          },
        },
        {
          week: 7,
          name: 'Eat for a long life',
          lines: ['Eat for a', 'long life'],
          coach: {
            wisdom:
              'Ask of a plate: would this carry me to a strong old age? Eat as if you intend to be here, and well, for the long run.',
            banks: {
              gentle: [
                'Would this plate carry you to a strong old age?',
                'Eat like you intend to stick around.',
                'A small kindness now to the you of later.',
                'Think long game, gently.',
                'Food is a letter to your future self.',
              ],
              encouraging: [
                'Every good plate is a deposit in the long run. Nice one.',
                'You’re building the strong old you, one meal at a time.',
                'Eating for the long life — that’s playing the wise game.',
                'Future you is already grateful.',
              ],
              honestKind: [
                'The body keeps the receipts. Be kind to it now.',
                'Quick fuel and long health aren’t always the same food.',
                'You’re not just eating for today — you’re eating for eighty.',
                'A strong old age is built decades early, in plates like this.',
              ],
              playful: [
                'Snack like a future centenarian.',
                'Old-you is watching. Wave.',
                'Eat for the long haul, not just the lunch.',
                'Investing in the strong, sprightly, ninety-year-old version of you.',
              ],
            },
          },
        },
        {
          week: 11,
          name: 'Eat for fun',
          lines: ['Eat for fun'],
          coach: {
            wisdom:
              'Joy is a real reason to eat — guilt is not. Choose the treat openly, enjoy it fully, and move on lightly.',
            banks: {
              gentle: [
                'Joy is a perfectly good reason to eat.',
                'If you have the treat, have it gladly.',
                'Choose it openly. Enjoy it fully.',
                'No guilt on the menu today.',
                'Pleasure is allowed. It always was.',
              ],
              encouraging: [
                'Pick the treat on purpose and enjoy every bit. That’s the skill.',
                'Eating for fun, guilt-free — you’ve earned the ease.',
                'Choose it, love it, move on light. Beautifully done.',
                'Delight is part of eating well, not against it.',
              ],
              honestKind: [
                'Guilt doesn’t make the treat healthier — just sadder.',
                'A treat eaten ashamed isn’t even a treat.',
                'Decide before, enjoy during, no rerun after.',
                'The problem was never the cake. It was the guilt chaser.',
              ],
              playful: [
                'Eat the cake. Mean it.',
                'Fun food, zero apology.',
                'Treat yourself — properly, not sheepishly.',
                'Guilt: uninvited. Joy: front and centre.',
              ],
            },
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
            banks: {
              gentle: [
                'Did it grow into its shape?',
                'Closer to how it grew is usually better.',
                'Does it still look like where it came from?',
                'One little question, that’s all: did it grow this way?',
                'Nearer the plant, nearer the point.',
              ],
              encouraging: [
                'Ask the one question and the answer’s usually easy. Nice.',
                'You can spot real food at a glance — trust that eye.',
                'Picking the thing that grew into its shape — well chosen.',
                'Simple test, good food. You’ve got this.',
              ],
              honestKind: [
                'An apple looks like an apple. A crisp looks like a factory.',
                'The longer the ingredients list, the further from the field.',
                'If it grew into its shape, it rarely needs a label to defend it.',
                'Most of “eat well” is just: eat things that look like themselves.',
              ],
              playful: [
                'Did it grow, or was it manufactured? Roll tape.',
                'Apple: yes. Apple-flavoured: hmm.',
                'If it’s got an ingredients list as long as your arm…',
                'Would a farmer recognise it? Good sign.',
              ],
            },
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
            banks: {
              gentle: [
                'Chase the high-NERD foods — lots of good for little energy.',
                'More nutrition per bite is the whole idea.',
                'Pick the food that gives more than it costs.',
                'High NERD today, gently.',
                'Nourishment first, energy second.',
              ],
              encouraging: [
                'Go for the high scorers and the rest sorts itself. Easy.',
                'You can feel which foods give more — follow that.',
                'Picking high-NERD is you working smart, not hard.',
                'One nutrient-dense choice and you’ve done the week.',
              ],
              honestKind: [
                'Broccoli scores ten; a doughnut scores one. That’s the gap.',
                'Empty calories cost you and give little back.',
                'It’s not about less food — it’s about food that pays its way.',
                'Energy with no nutrition is a loan you repay later.',
              ],
              playful: [
                'Be a food NERD. Embrace it.',
                'Maximum nutrition, minimum fluff.',
                'Broccoli: a perfect ten. Who knew.',
                'Pick the overachiever on the plate.',
              ],
            },
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
            banks: {
              gentle: [
                'When you make it, you choose what’s in it.',
                'Cook one thing yourself this week.',
                'Your kitchen, your ingredients.',
                'A meal made by you is a meal you understand.',
                'Take the wheel, gently — make it yourself.',
              ],
              encouraging: [
                'Cook it yourself and you quietly run the show. Nice.',
                'You’re more capable in the kitchen than you think.',
                'Every meal you make is one you got to decide. That’s power.',
                'One home-cooked thing today — you’ve got it.',
              ],
              honestKind: [
                'Someone chose those ingredients. Better it’s you.',
                'A packet decides for you. A pan lets you decide.',
                'You don’t need to cook everything — just more than nothing.',
                'Control isn’t restriction here. It’s knowing what you’re eating.',
              ],
              playful: [
                'Be the head chef of you.',
                'Whoever cooks, controls. Grab the spatula.',
                'Homemade: the ultimate inside job.',
                'You vs the ready-meal. You win.',
              ],
            },
          },
        },
      ],
    },
  ],
};
