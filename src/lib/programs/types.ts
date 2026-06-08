/**
 * The Reason-Ability program schema — the kit's contract.
 *
 * ONE program = ONE typed data object. The same object is the wheel diagram,
 * the curriculum (one focus a week, cycling the domains), AND the coach script
 * (each week's word of wisdom co-located with its focus point). They cannot
 * drift, because there is only one of them. Author a new "Reasonable X" by
 * writing one of these — near-zero new code.
 *
 * The four `pigment` values are the site's categorical colour language; a
 * four-domain program uses each exactly once, so colour always means the same
 * thing across every program in the family.
 */

export type Pigment = 'derived' | 'established' | 'contested' | 'open';

export interface Coach {
  /** The word of wisdom for this focus — the line the pocket-coach leads with. */
  wisdom: string;
  /** Optional Socratic opener for live coach mode (Alexander), later. */
  prompt?: string;
  /** Optional keep-on-track quip, in Tom's voice. */
  humour?: string;
}

export interface FocusPoint {
  /** The programme week — the numeral in the well, and the rotation key. */
  week: number;
  /** Short name of the algorithm (for the coach panel + a11y label). */
  name: string;
  /** The mnemonic as it sits in the slice, multi-line. */
  lines: string[];
  coach: Coach;
}

export interface Domain {
  /** "HOW" | "WHEN" | "WHY" | "WHAT" — the one-word domain label on the rim. */
  name: string;
  /** A short human gloss, e.g. "How you eat". */
  question: string;
  /** The ONE place colour-by-meaning is declared for this domain. */
  pigment: Pigment;
  /** Exactly `cycles` focus points, ordered inner cycle → outer. */
  focuses: FocusPoint[];
}

export interface Program {
  /** Permalink + coach-channel id, e.g. 'reasonable-eating'. */
  slug: string;
  title: string;
  /** One-line description for the page. */
  blurb: string;
  /** Algorithm Zero — the always-on central focus that never rotates. */
  hub: {
    /** Hub label, multi-line, e.g. ['EAT', 'MORE']. */
    label: string[];
    /** Algorithm Zero's name, e.g. 'Eat more'. */
    algorithmName: string;
    coach: Coach;
  };
  /** Cycles per domain: 3 → a 13×4 (4×3 + hub), over 13 weeks × 4 = the year. */
  cycles: number;
  /** Exactly four domains, one per pigment, in clockwise order from the top. */
  domains: [Domain, Domain, Domain, Domain];
  /** Optional link to the essay that introduces the programme. */
  essaySlug?: string;
}
