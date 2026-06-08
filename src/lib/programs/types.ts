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
  /** The central focus at the hub (Algorithm Zero for eating; the keystone for 9×4). */
  hub: {
    /** Hub label, multi-line, e.g. ['EAT', 'MORE']. */
    label: string[];
    /** The hub algorithm's name, e.g. 'Eat more' or 'Self-Belief'. */
    algorithmName: string;
    /** Numeral shown in the hub well. Default '0' (Algorithm Zero). 9×4 uses '1'. */
    numeral?: string;
    /** Coach-panel kicker for the hub. Default 'Algorithm Zero · always on'. */
    kicker?: string;
    /** If set, the hub takes this pigment (9×4's blue keystone); absent → neutral. */
    pigment?: Pigment;
    /** True when the hub is itself a weekly stop in the rotation (9×4 week 1). */
    inRotation?: boolean;
    coach: Coach;
  };
  /** Focus points per domain: 3 → a 13×4 (4 domains × 3); 4 → a 9×4 (2 halves × 4). */
  cycles: number;
  /**
   * How Play / the week-readout walk the wheel:
   *  - 'interleaved' (default): week W sits in domain (W-1)%domains — the
   *    Franklin rotation that cycles the domains (Reasonable Eating).
   *  - 'sequential': the numerals run in order (the 9×4's 1..9).
   */
  rotationStyle?: 'interleaved' | 'sequential';
  /** Two domains (halves) or four (quadrants), in clockwise order from the top. */
  domains: [Domain, Domain] | [Domain, Domain, Domain, Domain];
  /** Optional link to the essay that introduces the programme. */
  essaySlug?: string;
}
