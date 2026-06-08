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

import type { Program, Pigment, Coach } from './programs/types';

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

/** A bare rim arc (for the domain signature stroke). */
export function arc(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a2);
  return `M${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2}`;
}

export interface WheelSlice {
  week: number;
  name: string;
  lines: string[];
  pigment: Pigment;
  domain: string;
  domainQuestion: string;
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
  const domainCount = program.domains.length;
  const quadSpan = 360 / domainCount;
  const sliceAngle = quadSpan / program.cycles;

  const slices: WheelSlice[] = [];
  let order = 0;

  program.domains.forEach((domain, d) => {
    const base = d * quadSpan;
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

  const domainArcs: WheelDomainArc[] = program.domains.map((domain, d) => {
    const base = d * quadSpan;
    const mid = base + quadSpan / 2;
    const [lx, ly] = pt(cx, cy, rArc + 30, mid);
    // inset the arc a touch from the boundaries so the four arcs read as
    // separate signatures, not one continuous ring.
    return {
      name: domain.name,
      pigment: domain.pigment,
      arc: arc(cx, cy, rArc, base + 1.2, base + quadSpan - 1.2),
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
