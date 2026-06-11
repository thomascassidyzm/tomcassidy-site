/**
 * wheel-geometry.ts — the single source of truth for how a Reason-Ability wheel
 * is laid out. Pure functions, no DOM, no framework: both the static
 * `.astro` figure and the interactive `ProgramWheel.svelte` island draw from
 * THIS, so they can never drift (the lesson the diagram README warns about).
 *
 * A wheel is N = domains × cycles slices around an annulus, clockwise from 12
 * o'clock, with a hub in the middle (Algorithm Zero). Angles are degrees
 * clockwise from the top; quadrant/domain boundaries fall on the true vertical
 * and horizontal so the structure reads symmetrically.
 */

import type { Program, Pigment, Coach } from './types';

export interface WheelDims {
  cx: number;
  cy: number;
  ro: number; // outer radius of the ring
  ri: number; // inner radius of the ring (hub edge)
  rLab: number; // radius of slice labels
  rNum: number; // radius of slice numerals
  rArc: number; // radius of the domain rim-arc
  numInset: number; // degrees into a slice (from its leading edge) for the numeral
}

/** Matches the existing ReasonableEating.astro proportions. */
export const DEFAULT_DIMS: WheelDims = {
  cx: 360,
  cy: 300,
  ro: 206,
  ri: 86,
  rLab: 150,
  rNum: 190,
  rArc: 214,
  numInset: 6,
};

/** A point on a circle, degrees clockwise from 12 o'clock. */
export function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [+(cx + r * Math.sin(a)).toFixed(2), +(cy - r * Math.cos(a)).toFixed(2)];
}

/** An annular slice (ring sector) between two radii and two angles. */
export function annularSector(
  cx: number,
  cy: number,
  ro: number,
  ri: number,
  a1: number,
  a2: number,
): string {
  const [ox1, oy1] = pt(cx, cy, ro, a1);
  const [ox2, oy2] = pt(cx, cy, ro, a2);
  const [ix2, iy2] = pt(cx, cy, ri, a2);
  const [ix1, iy1] = pt(cx, cy, ri, a1);
  return `M${ox1},${oy1} A${ro},${ro} 0 0,1 ${ox2},${oy2} L${ix2},${iy2} A${ri},${ri} 0 0,0 ${ix1},${iy1} Z`;
}

/**
 * A bare rim arc (for the domain signature stroke). `sweep` 1 draws clockwise
 * a1 → a2; pass 0 (with swapped endpoints) for a counterclockwise arc — used
 * to keep bottom-half textPath labels reading upright.
 */
export function arc(
  cx: number,
  cy: number,
  r: number,
  a1: number,
  a2: number,
  sweep: 0 | 1 = 1,
): string {
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a2);
  // A span past 180° needs the large-arc flag (a single-domain rim is ~358°).
  const largeArc = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M${x1},${y1} A${r},${r} 0 ${largeArc},${sweep} ${x2},${y2}`;
}

export interface WheelSlice {
  week: number;
  name: string;
  lines: string[];
  pigment: Pigment;
  domain: string;
  domainQuestion: string;
  /** 1-based position within its domain (focuses are ordered inner cycle → outer). */
  cycle: number;
  coach: Coach;
  order: number; // draw order around the clock (entrance sequencing)
  path: string;
  lx: number;
  ly: number;
  nx: number;
  ny: number;
}

export interface WheelDomainArc {
  name: string;
  pigment: Pigment;
  arc: string;
  /**
   * The invisible arc the domain TITLE rides as a textPath — just outside the
   * rim arc, reversed in the bottom half so the title never reads upside down
   * (and never overlaps the wheel, whatever its length).
   */
  labelPath: string;
  lx: number;
  ly: number;
}

export interface WheelLayout {
  slices: WheelSlice[];
  domainArcs: WheelDomainArc[];
  dims: WheelDims;
  n: number; // total slices
  sliceAngle: number;
  hub: Program['hub'];
}

/**
 * Lay a program out into renderable geometry. The week numerals are AUTHORED
 * on each focus point (so the Franklin rotation is data, not arithmetic), but
 * each slice's angular position is derived purely from its domain index and
 * its position within that domain — so the same function draws a 13×4, or any
 * other four-domain program, with no per-slice hand-authoring.
 */
export function buildWheel(program: Program, dims: WheelDims = DEFAULT_DIMS): WheelLayout {
  const { cx, cy, ro, ri, rLab, rNum, rArc, numInset } = dims;

  // Every slice is the same width; each domain takes its share of the ring
  // from its OWN focus count — so uneven domains (Great Teaching's 1/4/1/6)
  // and a single continuous ring (one domain) lay out with the same maths,
  // and even wheels render exactly as before.
  const totalFocuses = program.domains.reduce((s, d) => s + d.focuses.length, 0);
  const sliceAngle = 360 / totalFocuses;
  let cursor = 0;
  const spans = program.domains.map((domain) => {
    const span = domain.focuses.length * sliceAngle;
    const base = cursor;
    cursor += span;
    return { domain, base, span };
  });

  const slices: WheelSlice[] = [];
  let order = 0;

  spans.forEach(({ domain, base }) => {
    domain.focuses.forEach((focus, c) => {
      const a1 = base + c * sliceAngle;
      const a2 = a1 + sliceAngle;
      const mid = a1 + sliceAngle / 2;
      const [lx, ly] = pt(cx, cy, rLab, mid);
      const [nx, ny] = pt(cx, cy, rNum, a1 + numInset);
      slices.push({
        week: focus.week,
        name: focus.name,
        lines: focus.lines,
        pigment: domain.pigment,
        domain: domain.name,
        domainQuestion: domain.question,
        cycle: c + 1,
        coach: focus.coach,
        order: order++,
        path: annularSector(cx, cy, ro, ri, a1, a2),
        lx,
        ly,
        nx,
        ny,
      });
    });
  });

  const domainArcs: WheelDomainArc[] = spans.map(({ domain, base, span }) => {
    const mid = base + span / 2;
    const [lx, ly] = pt(cx, cy, rArc + 30, mid);
    // Titles ride a textPath just outside the rim. Bottom-half titles get a
    // REVERSED arc (so they read upright); reversed text hangs its ascenders
    // inward, so the reversed baseline sits a cap-height further out. The
    // label path BLEEDS ±12° past the domain (it's invisible) so a title on
    // a single-slice domain isn't clipped by a too-short path.
    const flip = mid > 90 && mid < 270;
    const rText = flip ? rArc + 26 : rArc + 12;
    const labelSpan = Math.min(span + 24, 352);
    const la1 = mid - labelSpan / 2;
    const la2 = mid + labelSpan / 2;
    const labelPath = flip
      ? arc(cx, cy, rText, la2, la1, 0)
      : arc(cx, cy, rText, la1, la2, 1);
    // inset the arc a touch from the boundaries so the four arcs read as
    // separate signatures, not one continuous ring.
    return {
      name: domain.name,
      pigment: domain.pigment,
      arc: arc(cx, cy, rArc, base + 1.2, base + span - 1.2),
      labelPath,
      lx,
      ly,
    };
  });

  return {
    slices,
    domainArcs,
    dims,
    n: slices.length,
    sliceAngle,
    hub: program.hub,
  };
}

/**
 * Map a week number (1-based) to the slice that holds it, by Franklin rotation:
 * week w sits in domain (w-1) % domainCount, cycle floor((w-1)/domainCount).
 * Returns the matching slice, or undefined if the week is out of range.
 */
export function sliceForWeek(layout: WheelLayout, week: number): WheelSlice | undefined {
  return layout.slices.find((s) => s.week === week);
}
