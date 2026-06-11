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

/* ————————————————————————————————————————————————————————————————————————
 * The FAST framework — a full teaching per focus point.
 *
 * Some programmes carry more than a wisdom line: each week is a complete
 * standalone teaching in four movements — Focus (the "well, you know how…"
 * hook), Approach (the psychology behind it), Story (the telling that lands
 * it, in the authors' voices), Tool (the one practice for the week). FAST is
 * also the promise: things happen FAST and stick FAST (the FAST of
 * steadFAST). The teaching stays the same every cycle; the practice deepens
 * (see Program.cycleDepths).
 * ———————————————————————————————————————————————————————————————————————— */

/** One voice's turn in a Story section — a co-authored programme has several. */
export interface StoryBeat {
  /** Who tells it, e.g. 'Edward' or 'Tom'; omit for unattributed narration. */
  voice?: string;
  /** Paragraphs. */
  text: string[];
  /** True while the beat is an outline awaiting the author's telling. */
  draft?: boolean;
}

export interface FastFrame {
  /** F — the hook and what this skill IS. Paragraphs. */
  focus: string[];
  /** A — the psychology and the thinking behind it. Paragraphs. */
  approach: string[];
  /** S — the stories that land it. */
  story: StoryBeat[];
  /** T — the named tool and this week's practice. Paragraphs. */
  tool: { name?: string; practice: string[] };
}

export interface FocusPoint {
  /** The programme week — the numeral in the well, and the rotation key. */
  week: number;
  /** Short name of the algorithm (for the coach panel + a11y label). */
  name: string;
  /** The mnemonic as it sits in the slice, multi-line. */
  lines: string[];
  coach: Coach;
  /** The full FAST teaching for this focus, when the programme carries one. */
  fast?: FastFrame;
  /**
   * The interactive instrument this focus expands into, named BY DATA — the
   * page renders it through primitives/SubDiagram.svelte, never by import.
   */
  diagram?: PrimitiveRef;
}

/* ————————————————————————————————————————————————————————————————————————
 * Sub-diagram primitives — the standard interactive diagram TYPES.
 *
 * A focus point carries a PrimitiveRef: pure declarative data (axes, tiers,
 * zones, verdict copy, formula parameters) that one of the standard kit
 * components renders. A new programme gets working instruments by writing
 * data, not components; `preset` is the escape hatch for the rare kinetic
 * idea no standard type can carry.
 * ———————————————————————————————————————————————————————————————————————— */

/** A rung of a SortLadder (kind: 'scale'). Ordered best (top) → worst. */
export interface ScaleTier {
  n: number;
  pigment: Pigment;
  title: string;
  /** Small mono subtitle, e.g. "Most natural · best". */
  sub: string;
  /** This rung's contribution to the aggregate meter, 0..100. */
  score: number;
}

/** A card the learner sorts onto a rung. */
export interface ScaleCard {
  id: string;
  label: string;
  /** The rung this card truly belongs on (ScaleTier.n). */
  tier: number;
}

/** A ladder of tiers + cards to sort onto the right rung, with a live meter. */
export interface ScaleSpec {
  kind: 'scale';
  /** The instruction strip, e.g. "Eat nearer the top — did it grow into its shape?". */
  cue: string;
  /** Label over the live aggregate read-out, e.g. "How natural is your plate?". */
  meterLabel: string;
  tiers: ScaleTier[];
  /** Author these pre-mixed — they are dealt into the tray in this order. */
  cards: ScaleCard[];
  trayLabel?: string;
  /** Feedback copy in the programme's voice; the primitive has plain defaults. */
  praise?: string[];
  nudgeUp?: string[];
  nudgeDown?: string[];
}

export interface QuadrantAxis {
  /** e.g. "Energy · calories". */
  name: string;
  low: string;
  high: string;
}

/** Verdict copy for a score band; `{name}` is replaced by the active point's name. */
export interface QuadrantBand {
  /** This band applies when score ≥ min (bands ordered highest first). */
  min: number;
  word: string;
  line: string;
}

/** A preset point on the plane (both values 0..100). */
export interface QuadrantPoint {
  name: string;
  x: number;
  y: number;
}

/** A two-axis plane with a draggable marker, preset points and a live score. */
export interface QuadrantSpec {
  kind: 'quadrant';
  xAxis: QuadrantAxis;
  yAxis: QuadrantAxis;
  /** The corner that wins (washed + labelled), e.g. 'tl' = low x, high y. */
  winCorner: 'tl' | 'tr' | 'bl' | 'br';
  winLabel: string;
  score: {
    /** Read-out kicker, e.g. "NERD · nutrition ÷ energy". */
    kicker: string;
    max: number;
    /** score = 1 + (max−1)·(1 − e^(−k·ratio)), ratio = y / max(x, xFloor). */
    formula: { type: 'ratio'; xFloor?: number; k?: number };
    /** Ordered highest `min` first. */
    bands: QuadrantBand[];
    /** Tint thresholds: ≥ win → derived, ≥ mid → contested, else open. */
    tones?: { win: number; mid: number };
  };
  points: QuadrantPoint[];
  /** Index into points to open on (sell the win corner). */
  initialPoint?: number;
  hint?: string;
}

export type SliderTone = 'ok' | 'over' | 'far';

/** A stretch of the continuum and what the coach says inside it. */
export interface SliderZone {
  /** Zone applies while the value ≤ upTo (zones ordered left to right). */
  upTo: number;
  tone: SliderTone;
  verdict: string;
  /** May carry <em> for the pigment-tinted emphasis. */
  say: string;
  sub: string;
}

/** A model curve over the continuum: value(v) = max(0, 1 − v/zeroAt)^power. */
export interface SliderCurve {
  id: string;
  label: string;
  pigment: Pigment;
  fall: { zeroAt: number; power: number };
}

/** A pole-to-pole continuum with stops, tone zones and optional model curves. */
export interface SliderSpec {
  kind: 'slider';
  /** e.g. "Hunger >> Appetite". */
  kicker: string;
  axis: { low: string; high: string };
  stops: { v: number; label: string }[];
  zones: SliderZone[];
  /** Opening value 0..1 (the emotional centre). */
  initial: number;
  /** The lit sweet-spot band. */
  band?: { lo: number; hi: number; cap: string };
  curves?: SliderCurve[];
  /** Fill the area between two curve ids up to the read-out, toned by zone. */
  gap?: { top: string; bottom: string };
  /** Curve id the thumb rides; defaults to the floor. */
  thumbRides?: string;
  ariaLabel?: string;
  resetLabel?: string;
}

/** Escape hatch: a bespoke component registered by name in SubDiagram.svelte. */
export interface PresetRef {
  kind: 'preset';
  name: string;
}

export type PrimitiveRef = ScaleSpec | QuadrantSpec | SliderSpec | PresetRef;

export interface Domain {
  /** "HOW" | "WHEN" | "WHY" | "WHAT" — the one-word domain label on the rim. */
  name: string;
  /** A short human gloss, e.g. "How you eat". */
  question: string;
  /** A fuller paragraph (e.g. a research dimension's summary), page-rendered. */
  description?: string;
  /** The ONE place colour-by-meaning is declared for this domain. */
  pigment: Pigment;
  /**
   * The focus points, ordered inner cycle → outer. Exactly `cycles` of them
   * in a Franklin (interleaved) wheel; a sequential wheel may have UNEVEN
   * domains — each domain's share of the ring derives from its own count.
   */
  focuses: FocusPoint[];
}

export interface Program {
  /** Permalink + coach-channel id, e.g. 'reasonable-eating'. */
  slug: string;
  title: string;
  /** Credit line when the programme is co-authored, e.g. 'Edward Orman & Tom Cassidy'. */
  byline?: string;
  /** One-line description for the page. */
  blurb: string;
  /**
   * What each successive lap of the year asks of you (index = cycle − 1),
   * e.g. Awareness → Minimum Action → Intentional Practice → Integration.
   * The teaching stays the same; the practice deepens.
   */
  cycleDepths?: { name: string; instruction: string }[];
  /** The standing questions the whole programme keeps returning to. */
  metaQuestions?: { question: string; gloss?: string }[];
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
    /** The hub's own FAST teaching, when it is a weekly stop with one. */
    fast?: FastFrame;
  };
  /**
   * Focus points per domain: 3 → Reasonable Eating's 13 (4 domains × 3);
   * 4 → a 9×4 (2 halves × 4) or the Ultimate 13×4 (3 domains × 4 + a week-1 hub).
   */
  cycles: number;
  /**
   * How Play / the week-readout walk the wheel:
   *  - 'interleaved' (default): week W sits in domain (W-1)%domains — the
   *    Franklin rotation that cycles the domains (Reasonable Eating).
   *  - 'sequential': the numerals run in order (the 9×4's 1..9).
   */
  rotationStyle?: 'interleaved' | 'sequential';
  /**
   * One to four domains, clockwise from the top. One = a single continuous
   * ring (Agile Results); two = halves; three = thirds; four = quadrants.
   * Domains may hold UNEVEN focus counts on a sequential wheel (Great
   * Teaching: 1/4/1/6) — each takes its share of the ring from its count.
   */
  domains:
    | [Domain]
    | [Domain, Domain]
    | [Domain, Domain, Domain]
    | [Domain, Domain, Domain, Domain];
  /** Optional link to the essay that introduces the programme. */
  essaySlug?: string;
}
