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

describe('the link is the save', () => {
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
