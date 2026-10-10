import { describe, expect, it } from 'vitest';
import { AXIS_KEYS, readAll, type AxisRead, type AxisKey } from './engine';
import { paint, toSvg } from './painting';

const reads = (est: Partial<Record<AxisKey, number>>) =>
  Object.fromEntries(AXIS_KEYS.map((k) => [k, { est: est[k] ?? 50, unc: 11, ev: est[k] === undefined ? 0 : 4 } as AxisRead])) as Record<AxisKey, AxisRead>;

describe('after Mondrian', () => {
  it('draws the same painting from the same answers', () => {
    const a = readAll([{ o: [0, 1, 2, 3] }, { o: [3, 2, 1, 0] }, { o: [1, 0, 3, 2] }]);
    expect(toSvg(paint(a), 'x')).toBe(toSvg(paint(a), 'x'));
  });
  it('tiles the canvas exactly, one field per axis', () => {
    const p = paint(reads({ O: 90, C: 20, E: 55, A: 70 }));
    expect(p.fields).toHaveLength(6);
    expect(p.fields.reduce((s, f) => s + f.area, 0)).toBeCloseTo(1, 6);
  });
  it('gives the clearest lean the biggest field, in red; the middle stays white', () => {
    const p = paint(reads({ O: 92, C: 25, E: 52 }));
    const big = [...p.fields].sort((a, b) => b.area - a.area)[0];
    expect(big.k).toBe('O');
    expect(big.hue).toBe('red');
    expect(p.fields.find((f) => f.k === 'C')!.hue).toBe('blue');
    expect(p.fields.find((f) => f.k === 'E')!.hue).toBe('white');
  });
  it('thins the lines as evidence sharpens', () => {
    const blurry = paint({ ...reads({ O: 80 }), O: { est: 80, unc: 30, ev: 1 } });
    const sharp = paint({ ...reads({ O: 80 }), O: { est: 80, unc: 8, ev: 20 } });
    expect(sharp.line).toBeLessThan(blurry.line);
  });
});

describe('painting and lean text share one threshold', () => {
  it('an axis the painting leaves white is never worded as a plain lean', async () => {
    const { paintedAxes, readAll, sideOf, AXIS_KEYS, MOMENTS } = await import('./engine');
    const { paint } = await import('./painting');
    const { leanLine, AXES } = await import('./skin');
    let seed = 7;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
    let sawSlight = false;
    for (let t = 0; t < 60; t++) {
      const answers = MOMENTS.slice(0, 6 + (t % 20)).map((m) => ({ p: Math.floor(rnd() * m.opts.length) }));
      const reads = readAll(answers);
      const painted = paintedAxes(reads);
      const p = paint(reads);
      for (const f of p.fields) expect(f.hue !== 'white').toBe(painted.includes(f.k));
      for (const k of AXIS_KEYS.filter((k) => reads[k].ev > 0)) {
        const line = leanLine(k, sideOf(reads[k].est), false, painted.includes(k));
        if (!painted.includes(k)) {
          expect(line).not.toMatch(/^You lean/);
          if (sideOf(reads[k].est) !== 0) { sawSlight = true; expect(line).toMatch(/^Near the middle, slightly towards/); }
        }
        void AXES;
      }
    }
    expect(sawSlight).toBe(true);
  });
});
