/**
 * "After Mondrian" — a painting drawn FROM a person's answers, never assigned
 * to them (Tom, 2026-10-10: "It's never about categorisation - much more about
 * indications"). Pure and deterministic: the six axis reads are the only
 * input, so the same link always draws the same painting. No DOM, no words.
 *
 * The mapping:
 *  - one field per axis; its AREA grows with how far that axis leans;
 *  - the three clearest leans are coloured red, blue, yellow in that order;
 *    everything nearer the middle stays white;
 *  - which side of the canvas a field takes follows the direction it leans;
 *  - LINE WEIGHT is the blur: fewer moments, heavier lines. Sharpen, and the
 *    lines get finer.
 */
import { AXIS_KEYS, sideOf, type AxisKey, type AxisRead, type Side } from './engine';

export type Hue = 'red' | 'blue' | 'yellow' | 'white';
export const HUES: Record<Hue, string> = {
  red: '#c63a2c',
  blue: '#24438f',
  yellow: '#efc23a',
  white: '#f6f2ea',
};
const LINE = '#1b1a18';
const ORDER: Hue[] = ['red', 'blue', 'yellow'];

export interface Field {
  k: AxisKey;
  x: number;
  y: number;
  w: number;
  h: number;
  hue: Hue;
  side: Side;
  /** share of the canvas, 0..1 */
  area: number;
}
export interface Painting {
  fields: Field[];
  /** line weight in canvas units (canvas is 100 × 100) */
  line: number;
}

const leanOf = (a: AxisRead) => (a.ev === 0 ? 0 : Math.min(1, Math.abs(a.est - 50) / 45));

export function paint(reads: Record<AxisKey, AxisRead>): Painting {
  const items = AXIS_KEYS.map((k, i) => ({ k, i, lean: leanOf(reads[k]), side: reads[k].ev ? sideOf(reads[k].est) : (0 as Side) }))
    .map((it) => ({ ...it, weight: 0.35 + it.lean }))
    .sort((a, b) => b.lean - a.lean || a.i - b.i);
  const total = items.reduce((s, it) => s + it.weight, 0);

  let c = 0;
  const hueOf = (side: Side): Hue => (side !== 0 && c < ORDER.length ? ORDER[c++] : 'white');

  const fields: Field[] = [];
  let x = 0, y = 0, w = 100, h = 100, left = total;
  items.forEach((it, n) => {
    const hue = hueOf(it.side);
    const last = n === items.length - 1;
    const share = last ? 1 : it.weight / left;
    left -= it.weight;
    const vertical = w >= h; // cut across the longer side
    // a lean towards the "hi" end takes the left/top; towards "lo" the right/bottom;
    // the middle alternates by axis so a balanced reader still gets a composition
    const first = it.side === 0 ? it.i % 2 === 0 : it.side > 0;
    let f: Omit<Field, 'k' | 'hue' | 'side' | 'area'>;
    if (vertical) {
      const fw = w * share;
      f = { x: first ? x : x + w - fw, y, w: fw, h };
      if (first) x += fw;
      w -= fw;
    } else {
      const fh = h * share;
      f = { x, y: first ? y : y + h - fh, w, h: fh };
      if (first) y += fh;
      h -= fh;
    }
    fields.push({ ...f, k: it.k, hue, side: it.side, area: (f.w * f.h) / 10000 });
  });

  const seen = AXIS_KEYS.map((k) => reads[k]).filter((a) => a.ev > 0);
  const meanUnc = seen.length ? seen.reduce((s, a) => s + a.unc, 0) / seen.length : 40;
  const line = Math.min(3.2, Math.max(1.1, 1.1 + (meanUnc - 8) * 0.13));
  return { fields, line };
}

/** The painting as an SVG string. Lines are the black ground showing between inset fields. */
export function toSvg(p: Painting, label: string): string {
  const half = p.line / 2;
  const e = 0.001;
  const rects = p.fields
    .map((f) => {
      const l = f.x < e ? 0 : half;
      const t = f.y < e ? 0 : half;
      const r = f.x + f.w > 100 - e ? 0 : half;
      const b = f.y + f.h > 100 - e ? 0 : half;
      return `<rect x="${(f.x + l).toFixed(2)}" y="${(f.y + t).toFixed(2)}" width="${Math.max(0, f.w - l - r).toFixed(2)}" height="${Math.max(0, f.h - t - b).toFixed(2)}" fill="${HUES[f.hue]}"/>`;
    })
    .join('');
  const safe = label.replace(/[&<>"]/g, '');
  return `<svg class="mondrian" viewBox="0 0 100 100" role="img" aria-label="${safe}" preserveAspectRatio="xMidYMid meet"><rect width="100" height="100" fill="${LINE}"/>${rects}</svg>`;
}
