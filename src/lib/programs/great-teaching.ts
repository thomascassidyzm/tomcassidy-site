import type { Program } from '@/kit/types';

/**
 * Great Teaching 13/4 — the Great Teaching Toolkit findings (a 72-page
 * evidence review, greatteaching.com · @ProfCoe) distilled by Tom into a
 * single wheel. The twelve elements, read clockwise from the top, spell
 * G-R-E-A-T-T-E-A-C-H-I-N — and the hub is the G that completes
 * GREAT TEACHING.
 *
 * The first UNEVEN wheel: the four research dimensions hold 1 / 4 / 1 / 6
 * elements, so each takes its share of the ring from its own count. Domain
 * descriptions are verbatim from Tom's diagram; element names verbatim; the
 * coach.wisdom lines are DRAFTS (leaning on the diagram's own glosses where
 * it has them) for Tom to finesse.
 */
export const greatTeaching: Program = {
  slug: 'great-teaching',
  title: 'Great Teaching',
  byline: 'Tom Cassidy · from the Great Teaching Toolkit findings (greatteaching.com · @ProfCoe)',
  blurb:
    'A 72-page evidence review as one wheel — twelve elements that spell out the craft, one focus a week, with the G that completes GREAT TEACHING at the centre.',
  essaySlug: undefined,
  cycles: 4,
  rotationStyle: 'sequential',
  hub: {
    label: ['G'],
    algorithmName: 'Great Teaching',
    numeral: '13',
    kicker: 'Week 13 · the G that completes the word',
    inRotation: true,
    coach: {
      wisdom:
        'Twelve elements, one word: the hub is the G that completes GREAT TEACHING. Hold the whole word in mind and the elements stop being a checklist and become a craft.',
    },
  },
  domains: [
    {
      name: 'CONTENT',
      question: '1 · Understanding the content',
      description:
        'A subject genius understands the content, how it is learnt, the curriculum context, typical misconceptions and the common friction points along the learning journey.',
      pigment: 'contested',
      focuses: [
        {
          week: 1,
          name: 'Genius',
          lines: ['Genius'],
          coach: {
            wisdom:
              'Be a subject genius: know the content, how it is learnt, where it sits in the curriculum, the typical misconceptions and the friction points along the learning journey.',
          },
        },
      ],
    },
    {
      name: 'ENVIRONMENT',
      question: '2 · A supportive environment',
      description:
        'Great teachers set high expectations and create relationships of deep trust and respect between all parties. Students feel learning autonomy and are motivated, supported and challenged effectively.',
      pigment: 'derived',
      focuses: [
        {
          week: 2,
          name: 'Relationships',
          lines: ['Relationships'],
          coach: {
            wisdom:
              'Relationships of deep trust and respect between all parties — the ground every other element stands on.',
          },
        },
        {
          week: 3,
          name: 'Expectations',
          lines: ['Expectations'],
          coach: {
            wisdom:
              'Set high expectations and mean them: students rise to the level you genuinely believe they can reach.',
          },
        },
        {
          week: 4,
          name: 'Autonomy',
          lines: ['Autonomy'],
          coach: {
            wisdom:
              'Students feel learning autonomy — supported and challenged, but holding the steering wheel themselves.',
          },
        },
        {
          week: 5,
          name: 'Trust',
          lines: ['Trust'],
          coach: {
            wisdom:
              'Students feel safe to try, fail and ask. Without trust, challenge reads as threat; with it, challenge reads as respect.',
          },
        },
      ],
    },
    {
      name: 'LEARNING',
      question: '3 · Maximising learning',
      description:
        'Great teachers use techniques of managing resources and people such that learning time and opportunity are maximised. Systems and procedures are clear, strongly reinforced and anticipatory.',
      pigment: 'established',
      focuses: [
        {
          week: 6,
          name: 'Techniques',
          lines: ['Techniques'],
          coach: {
            wisdom:
              'Manage resources and people so learning time and opportunity are maximised — systems and procedures clear, strongly reinforced, anticipatory.',
          },
        },
      ],
    },
    {
      name: 'HARD THINKING',
      question: '4 · Activating hard thinking',
      description:
        'Great teaching involves activating high neurological function: working the brain hard, thinking about the learning process, metacognition & metalearning. Inquiring — questioning. Hardwiring — embedding. Coherence — structuring. Assessing — interacting, feedback, guidance. Explaining.',
      pigment: 'open',
      focuses: [
        {
          week: 7,
          name: 'Explaining',
          lines: ['Explaining'],
          coach: {
            wisdom:
              'Connect new ideas to what students already know; make the abstract concrete; say it clearly, then check it landed.',
          },
        },
        {
          week: 8,
          name: 'Assessing',
          lines: ['Assessing'],
          coach: {
            wisdom:
              'Interacting, feedback, guidance — finding out what students actually think, and responding to it.',
          },
        },
        {
          week: 9,
          name: 'Coherence',
          lines: ['Coherence'],
          coach: {
            wisdom:
              'Structuring: the pieces connect and accumulate — every lesson knows where it sits in the journey.',
          },
        },
        {
          week: 10,
          name: 'Hardwiring',
          lines: ['Hardwiring'],
          coach: {
            wisdom:
              'Embedding: practice, retrieval and spacing until knowledge is automatic enough to build on.',
          },
        },
        {
          week: 11,
          name: 'Inquiring',
          lines: ['Inquiring'],
          coach: {
            wisdom:
              'Questioning: the brain works hard when it has to answer. Ask more, tell less.',
          },
        },
        {
          week: 12,
          name: 'Neurofunction',
          lines: ['Neuro-', 'function'],
          coach: {
            wisdom:
              'Work the brain hard — and think about the learning process itself: metacognition and metalearning.',
          },
        },
      ],
    },
  ],
};
