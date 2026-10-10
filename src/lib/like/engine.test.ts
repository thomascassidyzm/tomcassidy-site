import { describe, expect, it } from 'vitest';
import {
  AXIS_KEYS,
  MOMENTS,
  decodeState,
  encodeState,
  gaps,
  readAll,
  returnState,
  type Answer,
  type Person,
} from './engine';

function randomAnswers(n: number, rnd: () => number): Answer[] {
  return MOMENTS.slice(0, n).map((m) => ({ p: Math.floor(rnd() * m.opts.length) }));
}

function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

describe('scoring', () => {
  it('a random tapper lands mid-scale on every axis (the Cowch scoring leaned ~66-68)', () => {
    const rnd = lcg(7);
    for (const k of AXIS_KEYS) {
      const ests: number[] = [];
      for (let i = 0; i < 2000; i++) ests.push(readAll(randomAnswers(30, rnd))[k].est);
      ests.sort((a, b) => a - b);
      const median = ests[ests.length >> 1];
      expect(Math.abs(median - 50)).toBeLessThan(6);
    }
  });

  it('picking the most outgoing option at every turn leans clearly towards people', () => {
    const answers: Answer[] = MOMENTS.slice(0, 10).map((m) => {
      const ws = m.opts.map((o) => o.w.E ?? 0);
      return { p: ws.indexOf(Math.max(...ws)), l: ws.indexOf(Math.min(...ws)) };
    });
    expect(readAll(answers).E.est).toBeGreaterThan(70);
  });

  it('a stated "very outgoing" against reserved picks is a gap, with evidence', () => {
    const answers: Answer[] = MOMENTS.slice(0, 10).map((m) => {
      const ws = m.opts.map((o) => o.w.E ?? 0);
      return { p: ws.indexOf(Math.min(...ws)) };
    });
    const p: Person = { stated: [2, 2, 4, 2, 2, 2], answers };
    const g = gaps(p).find((x) => x.k === 'E');
    expect(g).toBeDefined();
    expect(g!.delta).toBeLessThan(0);
    expect(g!.evidence).toBeTypeOf('number');
  });
});

function shuffle(n: number, rnd: () => number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let j = n - 1; j > 0; j--) {
    const r = Math.floor(rnd() * (j + 1));
    [a[j], a[r]] = [a[r], a[j]];
  }
  return a;
}

describe('ranked scoring (Cowch coefficients)', () => {
  it('a random ranker lands mid-scale on every axis', () => {
    const rnd = lcg(11);
    for (const k of AXIS_KEYS) {
      const ests: number[] = [];
      for (let i = 0; i < 2000; i++) ests.push(readAll(MOMENTS.map((m) => ({ o: shuffle(m.opts.length, rnd) })))[k].est);
      ests.sort((a, b) => a - b);
      expect(Math.abs(ests[ests.length >> 1] - 50)).toBeLessThan(6);
    }
  });

  it('ranking most-outgoing first at every turn leans clearly towards people; the reverse leans away', () => {
    const byE = (dir: 1 | -1): Answer[] =>
      MOMENTS.slice(0, 10).map((m) => ({
        o: m.opts.map((_, i) => i).sort((a, b) => dir * ((m.opts[b].w.E ?? 0) - (m.opts[a].w.E ?? 0))),
      }));
    expect(readAll(byE(1)).E.est).toBeGreaterThan(70);
    expect(readAll(byE(-1)).E.est).toBeLessThan(30);
  });

  it('only the full order counts: the same first choice with a different tail reads differently', () => {
    const m = MOMENTS[0];
    const k = AXIS_KEYS.find((x) => new Set(m.opts.map((o) => o.w[x] ?? 0)).size > 2)!;
    const ws = m.opts.map((o) => o.w[k] ?? 0);
    const asc = ws.map((_, i) => i).sort((a, b) => ws[a] - ws[b]);
    const top = asc[3];
    const good = [top, asc[2], asc[1], asc[0]];
    const bad = [top, asc[0], asc[1], asc[2]];
    expect(readAll([{ o: good }])[k].est).toBeGreaterThan(readAll([{ o: bad }])[k].est);
  });
});

describe('older links that carry a skip', () => {
  it('still open and score, the skipped moment counting as no data', () => {
    const withSkip = decodeState('#me=' + encodeURIComponent('Tom~~rax.b')).me!;
    const without: Person = { name: 'Tom', answers: [withSkip.answers[0], null, null, withSkip.answers[3]] };
    expect(withSkip.answers[1]).toBe('x');
    expect(readAll(withSkip.answers)).toEqual(readAll(without.answers));
  });
});

describe('the link is the save', () => {
  it('round-trips rankings at one char per moment, with exits and gaps', () => {
    const me: Person = { name: 'Tom', stated: [0, 1, 2, 3, 4, null], answers: [{ o: [2, 0, 3, 1] }, 'x', null, { o: [3, 2, 1, 0] }] };
    const st = { me, gt: { 0: [1, 2, 3, 0], 4: [0, 1, 2, 3] } };
    const h = encodeState(st);
    expect(new URLSearchParams(h).get('me')).toMatch(/^Tom~01234-~r[0-9a-n]x\.[0-9a-n]$/);
    const back = decodeState('#' + h);
    expect(back.me).toEqual(me);
    expect(back.gt).toEqual(st.gt);
  });

  it('a pick-one link made before ranking still decodes, and survives gaining ranked moments', () => {
    const old = decodeState('#me=' + encodeURIComponent('Sam~~1302x-'));
    expect(old.me!.answers).toEqual([{ p: 1, l: 3 }, { p: 0, l: 2 }, 'x']);
    old.me!.answers.push({ o: [1, 0, 2, 3] });
    expect(decodeState('#' + encodeState(old)).me).toEqual(old.me);
  });

  it('round-trips a pair state through the fragment', () => {
    const me: Person = { name: 'Sam', stated: [0, 1, null, 3, 4, 2], answers: [{ p: 1, l: 3 }, 'x', null, { p: 2 }] };
    const them: Person = { name: 'Tom', stated: [2, 2, 2, 2, 2, 2], answers: [{ p: 0 }, { p: 3 }] };
    const st = { me, them, gt: { 0: 2, 1: 3 }, t: 20 };
    const back = decodeState('#' + encodeState(st));
    expect(back.me).toEqual(me);
    expect(back.them).toEqual(them);
    expect(back.gt).toEqual({ 0: 2, 1: 3 });
    expect(back.t).toBe(20);
  });

  it('the return link puts the original person back in the "me" seat', () => {
    const tom: Person = { name: 'Tom', answers: [{ p: 0 }] };
    const sam: Person = { name: 'Sam', answers: [{ p: 1 }] };
    const r = returnState({ me: sam, them: tom, gt: { 0: 1 } });
    expect(r.me).toBe(tom);
    expect(r.them).toBe(sam);
    expect(r.gm).toEqual({ 0: 1 });
  });

  it('ignores junk rather than throwing', () => {
    expect(() => decodeState('#me=%%%&them=a~b')).not.toThrow();
  });
});
