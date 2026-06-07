// Series manifest — how the Writing page groups and orders the work.
//
// The four `series` values in essay frontmatter are the "bigger groupings".
// This file gives each one a descriptor, a deliberate internal order, and —
// where the pieces form a genuine sequence (the Dogmas) — numbered parts.
// Editing order or blurbs here re-renders /writing; nothing in the essays
// themselves changes. Slugs that exist in a series but aren't placed here are
// appended automatically (featured first), so adding an essay never breaks the
// page — it just lands at the end until you slot it in.

export type SeriesKind = 'framework' | 'collection' | 'single';

export interface SeriesDef {
  /** Must match the `series` frontmatter value exactly. */
  name: string;
  kind: SeriesKind;
  /** One line; editorial — tweak freely. */
  blurb: string;
  /** Slug of the entry/overview piece, rendered as the "start here" door. */
  lead?: string;
  /** A genuinely ordered sub-set, rendered as a numbered sequence. */
  sequence?: {
    label: string;
    parts: { numeral: string; slug: string }[];
  };
  /** Slugs shown after the sequence, in this order (for frameworks). */
  related?: string[];
}

export const SERIES: SeriesDef[] = [
  {
    name: 'Reason-Ability',
    kind: 'framework',
    blurb: 'A framework for reasoning and acting well — an overview, four dogmas, and the doubt that keeps it honest.',
    lead: 'reason-ability-an-overview',
    sequence: {
      label: 'The Four Dogmas',
      parts: [
        { numeral: 'I', slug: 'first-dogma-marginal-gains' },
        { numeral: 'II', slug: 'second-dogma-one-thing-at-a-time' },
        { numeral: 'III', slug: 'third-dogma-discernment' },
        { numeral: 'IV', slug: 'fourth-dogma-a-reasonable-plan' },
      ],
    },
    related: ['what-is-reason-ability', 'reasonable-doubt'],
  },
  {
    name: 'The Art of Learning',
    kind: 'framework',
    blurb: 'Methods for learning deliberately and fast — and for teaching so it lands.',
    lead: 'the-cassidy-method',
    related: [
      'architect-your-learning',
      'the-learning-sprint',
      'teach-to-six',
      'a-continuous-development-framework',
    ],
  },
  {
    name: 'Philosophy & Leadership',
    kind: 'collection',
    blurb: 'Standalone essays on how to see, decide, and lead — a collection rather than a single arc.',
  },
  {
    name: 'The Format',
    kind: 'single',
    blurb: 'The living-epistemic-work format this site is built to demonstrate.',
  },
];
