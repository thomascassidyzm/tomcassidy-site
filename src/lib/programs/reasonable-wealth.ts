import type { Program } from '@/kit/types';

/**
 * Reasonable Wealth — the programme built on Wallace Wattles' "The Science of
 * Getting Rich", run for years on Udemy. Structurally it is the most mature
 * specimen of the 13×4 on the estate, and the only wheel whose spokes are
 * written as DISTINCTIONS (X > Y) rather than instructions: each week names
 * the thing to move TOWARDS and the thing it replaces.
 *
 * Shape: twelve spokes on the rim in two halves — ODD numerals are THINKING
 * (the right half), EVEN are ACTING (the left half) — plus a hub numbered 13,
 * itself a weekly stop. That is the standard interleaved (Franklin) rotation
 * over two domains: week W sits in domain (W−1) % 2, so the year alternates
 * thinking, acting, thinking, acting. Same engine, same renderer, no new code.
 *
 * PROVENANCE — read this before trusting anything below. Every spoke title,
 * the hub, and the inner-ring lines are TRANSCRIBED from Tom's own Reasonable
 * Wealth wheel diagram on 2026-09-01. They do NOT come from a prior artefact
 * in this repo; nothing here was reconstructed from the Ultimate 13×4's Wealth
 * domain or from Reasonable Success, both of which draw on the same Wattles
 * source but are separate programmes with their own words.
 *
 * WHAT IS NOT AUTHORED HERE. `coach.wisdom` is required by the kit's
 * validator, and this programme has no coach copy written for it. Rather than
 * invent lines in Tom's voice, each week's wisdom restates its own distinction
 * verbatim — a faithful placeholder, not draft prose. When the coach copy is
 * written, these are the slots it goes in. There are likewise no weeks, no
 * FAST teachings and no sub-diagrams: this file is the wheel, and only the
 * wheel.
 *
 * TWO THINGS FOR TOM, both flagged in the report that shipped this file:
 *  1. Spoke 2 is NOT in X > Y form — it reads "REPETITIVE, EMOTIONAL,
 *     DETAILED". Recorded exactly as given. Whether that is a deliberate
 *     exception (three qualities of how to hold the vision) or an unfinished
 *     spoke is his call, not an agent's.
 *  2. The inner ring is recorded WHOLE and UNBOUND on `program.innerRing`,
 *     in the order it reads round the wheel. Reading-round order is not the
 *     same as numeral order on an odd-right / even-left wheel, so the source
 *     does not establish which line belongs to which spoke. Pairing them would
 *     have been guesswork; it is one word from him away.
 */
export const reasonableWealth: Program = {
  slug: 'reasonable-wealth',
  title: 'Reasonable Wealth',
  blurb:
    'Twelve distinctions for getting rich reasonably, after Wallace Wattles — thinking on one side of the wheel, acting on the other, one focus a week.',
  essaySlug: undefined,
  cycles: 6,
  // Interleaved is the default and is what makes odd = thinking, even = acting.
  rotationStyle: 'interleaved',
  hub: {
    label: ['HELPFUL >', 'TRUE'],
    algorithmName: 'Helpful > True',
    numeral: '13',
    kicker: 'Week 13 · the hub',
    pigment: 'established',
    inRotation: true,
    coach: {
      // The hub's own inner-ring line — the one inner-ring line whose home is
      // unambiguous, because the hub has no siblings to confuse it with.
      wisdom: 'It’s based on science.',
    },
  },
  domains: [
    {
      // Domain 0 takes the first half of the ring clockwise from 12 o'clock =
      // the RIGHT half, matching the wheel's thinking-right / acting-left split.
      name: 'THINKING',
      question: 'How you think about wealth',
      pigment: 'contested',
      focuses: [
        {
          week: 1,
          name: 'Fulfilling potential > playing small',
          lines: ['FULFILLING', 'POTENTIAL >', 'PLAYING SMALL'],
          coach: { wisdom: 'Fulfilling potential > playing small.' },
        },
        {
          week: 3,
          name: 'Abundance > scarcity',
          lines: ['ABUNDANCE >', 'SCARCITY'],
          coach: { wisdom: 'Abundance > scarcity.' },
        },
        {
          week: 5,
          name: 'Creating > waiting',
          lines: ['CREATING >', 'WAITING'],
          coach: { wisdom: 'Creating > waiting.' },
        },
        {
          week: 7,
          name: 'Creative > competitive',
          lines: ['CREATIVE >', 'COMPETITIVE'],
          coach: { wisdom: 'Creative > competitive.' },
        },
        {
          week: 9,
          name: 'Grateful > indifferent',
          lines: ['GRATEFUL >', 'INDIFFERENT'],
          coach: { wisdom: 'Grateful > indifferent.' },
        },
        {
          week: 11,
          name: 'Following the wheel > reinventing the wheel',
          lines: ['FOLLOWING', 'THE WHEEL >', 'REINVENTING', 'THE WHEEL'],
          coach: { wisdom: 'Following the wheel > reinventing the wheel.' },
        },
      ],
    },
    {
      // Domain 1 = the LEFT half of the ring.
      name: 'ACTING',
      question: 'How you act on wealth',
      pigment: 'derived',
      focuses: [
        {
          // NOT in X > Y form on the diagram. Transcribed as given — see the
          // header note; forcing it into a distinction to tidy the set would
          // be an agent editing Tom's methodology.
          week: 2,
          name: 'Repetitive, emotional, detailed',
          lines: ['REPETITIVE,', 'EMOTIONAL,', 'DETAILED'],
          coach: { wisdom: 'Repetitive, emotional, detailed.' },
        },
        {
          week: 4,
          name: 'Reasonable > maniacal',
          lines: ['REASONABLE >', 'MANIACAL'],
          coach: { wisdom: 'Reasonable > maniacal.' },
        },
        {
          week: 6,
          name: 'Get to > got to',
          lines: ['GET TO >', 'GOT TO'],
          coach: { wisdom: 'Get to > got to.' },
        },
        {
          week: 8,
          name: 'We > me',
          lines: ['WE > ME'],
          coach: { wisdom: 'We > me.' },
        },
        {
          week: 10,
          name: 'Use value > cash value',
          lines: ['USE VALUE >', 'CASH VALUE'],
          coach: { wisdom: 'Use value > cash value.' },
        },
        {
          week: 12,
          name: 'Advancing life > death and decay',
          lines: ['ADVANCING', 'LIFE > DEATH', 'AND DECAY'],
          coach: { wisdom: 'Advancing life > death and decay.' },
        },
      ],
    },
  ],
  /**
   * The inner ring, verbatim, in the order it reads round the wheel. Twelve
   * lines for twelve spokes — but see the header: the source does not say
   * which line sits under which spoke, so they are recorded unbound.
   */
  innerRing: [
    'It’s your duty to get rich',
    'There’s plenty for everyone',
    'Thoughts create things',
    'Reasonable wealth increases the net worth of humanity',
    'Gratitude is the gateway',
    'Riches proportional to Vision × Purpose × Faith × Gratitude',
    'Give the impression of increase',
    'Create more life to all',
    'Invoke all power',
    'More than fill your current place',
    'Purpose to realise vision',
    'Have a definite vision',
  ],
};
