/**
 * "What are you like, anyway?" — the engine.
 *
 * Bank, scoring, the URL codec and the pair/guess arithmetic. No DOM and no
 * words a person reads: every sentence lives in skin.ts, so Cowch can take
 * this file later and bring its own skin.
 *
 * The bank is copied verbatim from theracowch
 * (public/questionnaires/data/what-are-you-like-bank.json, bank_version 2.0).
 * A skin may restyle a moment, never reword it — the words are the measurement.
 *
 * One deliberate change from the Cowch scoring: each pick is CENTRED against
 * the mean of that moment's own options before it counts. The Cowch engine
 * summed raw weights, and because the bank's options are mostly positively
 * weighted a random tapper landed around 66–68 of 100 on four axes (purpose
 * study /d/bb57af4a). Centred, a random tapper lands mid-scale, which is the
 * least we owe a scale that only ever speaks about you against yourself.
 * The tanh shape and the "width shrinks with evidence" idea are kept.
 *
 * Answers are RANKINGS (Tom, 2026-10-10: "rank all of them - most to least
 * likely. This is a much better scoring mechanism"). The rank→weight
 * conversion is the Cowch ranked variant's, ported verbatim
 * (theracowch public/assets/js/what-are-you-like-rank.js, scoreRanking):
 * +1, +0.33, −0.33, −1 over 2.66. Those coefficients sum to zero, so a
 * ranking is centred by construction and the random-tapper property holds
 * without any extra step. Pick-one answers ({p, l}) from links made before
 * the switch still decode and still score.
 */
import bankDoc from './bank.json';

export type AxisKey = 'O' | 'C' | 'E' | 'A' | 'N' | 'R';
export const AXIS_KEYS: AxisKey[] = ['O', 'C', 'E', 'A', 'N', 'R'];

export interface Option {
  t: string;
  w: Partial<Record<AxisKey, number>>;
}
export interface Moment {
  id: string;
  s: string;
  opts: Option[];
}

export const MOMENTS: Moment[] = (bankDoc as { questions: Moment[] }).questions;
export const BLOCK = 10;
export const MAX_MOMENTS = MOMENTS.length; // 30

/** A full ranking: option indices, most likely first. */
export interface Ranked {
  o: number[];
}
/** A pick-one answer, from links made before ranking. */
export interface Picked {
  p: number;
  l?: number;
}
/** One answer slot: null = not reached, 'x' = honest exit, else a ranking (or a legacy pick). */
export type Answer = null | 'x' | Ranked | Picked;

export const isRanked = (a: Answer | undefined): a is Ranked => !!a && a !== 'x' && 'o' in a;
/** The option a person put first (or picked). */
export function topOf(a: Answer | undefined): number | undefined {
  if (!a || a === 'x') return undefined;
  return 'o' in a ? a.o[0] : a.p;
}

export interface Person {
  name?: string;
  /** Stated self-placement per axis, 0..4 (five taps). undefined = not asked yet; null entries = skipped. */
  stated?: (number | null)[];
  answers: Answer[];
}

/* ================= SCORING ================= */

export interface AxisRead {
  /** 0..100, 50 = no lean either way. */
  est: number;
  /** Honest half-width on the same 0..100 scale. */
  unc: number;
  /** Raw evidence (sum of half-ranges seen). 0 = this axis never came up. */
  ev: number;
}

const LEAST_WEIGHT = 0.5;
/** Cowch's ranked-variant coefficients: first, second, third, last. */
export const RANK_COEFF = [1.0, 0.33, -0.33, -1.0];
const RANK_NORM = 2.66; // sum of |RANK_COEFF|

function rankSum(vals: number[]): number {
  return vals.reduce((sum, v, pos) => sum + (RANK_COEFF[pos] ?? 0) * v, 0) / RANK_NORM;
}

function axisStats(m: Moment, k: AxisKey) {
  const ws = m.opts.map((o) => o.w[k] ?? 0);
  const mean = ws.reduce((a, b) => a + b, 0) / ws.length;
  const half = (Math.max(...ws) - Math.min(...ws)) / 2;
  return { ws, mean, half };
}

/** Signed push of one answer on one axis, centred on the moment's own options. */
export function pushOf(m: Moment, a: Answer, k: AxisKey): { d: number; r: number } {
  if (!a || a === 'x') return { d: 0, r: 0 };
  const { ws, mean, half } = axisStats(m, k);
  if (half === 0) return { d: 0, r: 0 };
  if ('o' in a) {
    // d: this ranking's push. r: the push of the ideal ranking for this axis,
    // so a ranking that orders the axis perfectly reads as exactly ±1.
    const d = rankSum(a.o.map((i) => ws[i] - mean));
    const r = rankSum(ws.map((w) => w - mean).sort((x, y) => y - x));
    return { d, r };
  }
  let d = ws[a.p] - mean;
  let r = half;
  if (a.l !== undefined && a.l !== a.p) {
    d += LEAST_WEIGHT * (mean - ws[a.l]);
    r += LEAST_WEIGHT * half;
  }
  return { d, r };
}

export function readAxis(answers: Answer[], k: AxisKey): AxisRead {
  let num = 0;
  let den = 0;
  answers.forEach((a, i) => {
    const m = MOMENTS[i];
    if (!m) return;
    const { d, r } = pushOf(m, a, k);
    num += d;
    den += r;
  });
  if (den === 0) return { est: 50, unc: 40, ev: 0 };
  const score = num / den; // -1..1
  const est = 50 + 45 * Math.tanh(1.6 * score);
  const unc = Math.max(8, 36 / Math.sqrt(1 + 2 * den));
  return { est, unc, ev: den };
}

export function readAll(answers: Answer[]): Record<AxisKey, AxisRead> {
  const out = {} as Record<AxisKey, AxisRead>;
  for (const k of AXIS_KEYS) out[k] = readAxis(answers, k);
  return out;
}

/** The five stated taps map to these positions on the 0..100 scale. */
export const STATED_POS = [10, 30, 50, 70, 90];

export type Side = -1 | 0 | 1;
export function sideOf(pos: number, dead = 10): Side {
  return pos >= 50 + dead ? 1 : pos <= 50 - dead ? -1 : 0;
}

export interface Gap {
  k: AxisKey;
  stated: number;
  revealed: number;
  /** revealed − stated */
  delta: number;
  statedSide: Side;
  revealedSide: Side;
  /** index of the moment whose pick pushed hardest in the direction of the gap */
  evidence?: number;
}

/** Stated vs revealed, axis by axis. Only gaps wider than the honest width count. */
export function gaps(p: Person): Gap[] {
  if (!p.stated) return [];
  const reads = readAll(p.answers);
  const out: Gap[] = [];
  AXIS_KEYS.forEach((k, i) => {
    const s = p.stated![i];
    if (s === null || s === undefined) return;
    const r = reads[k];
    if (r.ev === 0) return;
    const stated = STATED_POS[s];
    const delta = r.est - stated;
    if (Math.abs(delta) < Math.max(20, r.unc)) return;
    const dir = Math.sign(delta);
    let best = -1;
    let bestD = 0;
    p.answers.forEach((a, idx) => {
      const { d } = pushOf(MOMENTS[idx], a, k);
      if (d * dir > bestD) {
        bestD = d * dir;
        best = idx;
      }
    });
    out.push({
      k,
      stated,
      revealed: r.est,
      delta,
      statedSide: sideOf(stated),
      revealedSide: sideOf(r.est),
      evidence: best >= 0 ? best : undefined,
    });
  });
  return out.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

/** Two people on one axis: level unless the difference clears both widths combined. */
export function compareAxis(a: AxisRead, b: AxisRead): Side {
  if (a.ev === 0 || b.ev === 0) return 0;
  const diff = b.est - a.est;
  const width = Math.sqrt(a.unc * a.unc + b.unc * b.unc);
  return Math.abs(diff) < width ? 0 : diff > 0 ? 1 : -1;
}

export function answeredCount(answers: Answer[]): number {
  return answers.filter((a) => a !== null && a !== undefined).length;
}

/** Five of someone's moments for a friend to guess: substantive picks, spread across the run. */
export function guessMoments(p: Person, n = 5): number[] {
  const subs: number[] = [];
  p.answers.forEach((a, i) => {
    if (a && a !== 'x') subs.push(i);
  });
  if (subs.length <= n) return subs;
  const out: number[] = [];
  const step = subs.length / n;
  for (let i = 0; i < n; i++) out.push(subs[Math.floor(i * step)]);
  return out;
}

/* ================= THE LINK IS THE SAVE =================
   Everything lives in the URL fragment, which browsers never send to a
   server. Compact on purpose so a shared link survives being pasted:
   a person is  name~stated~answers  where stated is six chars (0-4, or '-'
   for a skipped axis; empty = not asked yet) and answers are two chars per
   moment: pick (0-3, 'x' exit, '.' not reached) then least (0-3 or '-').
   Guesses are  <moment index base36><pick>  pairs.

   RANKED (2026-10-10): answers start with 'r' and take ONE char per moment —
   the ranking's index among the 24 orderings of four (0-9 a-n), 'x' exit,
   '.' not reached, and A-T for a legacy pick carried over (p*5 + l+1).
   Ranked guesses also start with 'r': <moment index base36><ordering char>. */

export interface State {
  me?: Person;
  them?: Person;
  /** I was sent a guess-me link and haven't finished guessing yet / at all. */
  ask?: boolean;
  /** my guesses of them: moment index -> ranking (or a legacy pick) */
  gt?: Record<number, Guess>;
  /** their guesses of me */
  gm?: Record<number, Guess>;
  /** how many moments I'm aiming for (10, 20, 30) */
  t?: number;
}

/** A guess at someone's moment: their ranking as you think it went (a number = legacy pick). */
export type Guess = number[] | number;

const PERM_CHARS = '0123456789abcdefghijklmn';
const PERMS: number[][] = (() => {
  const out: number[][] = [];
  const go = (pre: number[], rest: number[]) => {
    if (!rest.length) return void out.push(pre);
    rest.forEach((x, i) => go([...pre, x], [...rest.slice(0, i), ...rest.slice(i + 1)]));
  };
  go([], [0, 1, 2, 3]);
  return out;
})();
const permChar = (o: number[]) => PERM_CHARS[PERMS.findIndex((q) => q.every((v, i) => v === o[i]))] ?? '.';
const charPerm = (c: string) => (PERM_CHARS.includes(c) ? PERMS[PERM_CHARS.indexOf(c)].slice() : undefined);
const LEGACY = 'ABCDEFGHIJKLMNOPQRST';

export function encodePerson(p: Person): string {
  const stated = p.stated ? p.stated.map((s) => (s === null || s === undefined ? '-' : String(s))).join('') : '';
  if (p.answers.some(isRanked)) {
    const ans = p.answers
      .map((a) =>
        a === null || a === undefined ? '.'
        : a === 'x' ? 'x'
        : 'o' in a ? permChar(a.o)
        : LEGACY[a.p * 5 + (a.l === undefined ? 0 : a.l + 1)],
      )
      .join('')
      .replace(/\.+$/, '');
    return [(p.name ?? '').replace(/~/g, ''), stated, 'r' + ans].join('~');
  }
  let ans = p.answers
    .map((a) => (a === null || a === undefined ? '..' : a === 'x' ? 'x-' : `${(a as Picked).p}${(a as Picked).l ?? '-'}`))
    .join('');
  ans = ans.replace(/(\.\.)+$/, '');
  return [(p.name ?? '').replace(/~/g, ''), stated, ans].join('~');
}

export function decodePerson(s: string): Person | undefined {
  const parts = s.split('~');
  if (parts.length !== 3) return undefined;
  const [name, st, ans] = parts;
  const p: Person = { answers: [] };
  if (name) p.name = name.slice(0, 40);
  if (st.length === AXIS_KEYS.length) {
    p.stated = st.split('').map((c) => (/[0-4]/.test(c) ? Number(c) : null));
  }
  if (ans.startsWith('r')) {
    for (const c of ans.slice(1, 1 + MAX_MOMENTS)) {
      const o = charPerm(c);
      const L = LEGACY.indexOf(c);
      if (c === 'x') p.answers.push('x');
      else if (o) p.answers.push({ o });
      else if (L >= 0) {
        const a: Picked = { p: Math.floor(L / 5) };
        if (L % 5 && L % 5 - 1 !== a.p) a.l = (L % 5) - 1;
        p.answers.push(a);
      } else p.answers.push(null);
    }
    return p;
  }
  for (let i = 0; i < ans.length && i / 2 < MAX_MOMENTS; i += 2) {
    const c = ans[i];
    const l = ans[i + 1];
    const nOpts = MOMENTS[i / 2].opts.length;
    if (c === 'x') p.answers.push('x');
    else if (/[0-9]/.test(c) && Number(c) < nOpts) {
      const a: { p: number; l?: number } = { p: Number(c) };
      if (l && /[0-9]/.test(l) && Number(l) < nOpts && l !== c) a.l = Number(l);
      p.answers.push(a);
    } else p.answers.push(null);
  }
  return p;
}

function encodeGuesses(g: Record<number, Guess>): string {
  const ranked = Object.values(g).some(Array.isArray);
  return (
    (ranked ? 'r' : '') +
    Object.entries(g)
      .map(([i, v]) => Number(i).toString(36) + (Array.isArray(v) ? permChar(v) : ranked ? LEGACY[v * 5] : v))
      .join('')
  );
}
function decodeGuesses(s: string): Record<number, Guess> {
  const out: Record<number, Guess> = {};
  if (s.startsWith('r')) {
    for (let i = 1; i + 1 < s.length; i += 2) {
      const idx = parseInt(s[i], 36);
      if (!(idx < MAX_MOMENTS)) continue;
      const o = charPerm(s[i + 1]);
      const L = LEGACY.indexOf(s[i + 1]);
      if (o) out[idx] = o;
      else if (L >= 0) out[idx] = Math.floor(L / 5);
    }
    return out;
  }
  for (let i = 0; i + 1 < s.length; i += 2) {
    const idx = parseInt(s[i], 36);
    const p = Number(s[i + 1]);
    if (idx < MAX_MOMENTS && p >= 0 && p < 4) out[idx] = p;
  }
  return out;
}

export function encodeState(st: State): string {
  const q = new URLSearchParams();
  if (st.me) q.set('me', encodePerson(st.me));
  if (st.them) q.set('them', encodePerson(st.them));
  if (st.ask) q.set('ask', '1');
  if (st.gt && Object.keys(st.gt).length) q.set('gt', encodeGuesses(st.gt));
  if (st.gm && Object.keys(st.gm).length) q.set('gm', encodeGuesses(st.gm));
  if (st.t && st.t !== BLOCK) q.set('t', String(st.t));
  return q.toString();
}

export function decodeState(hash: string): State {
  const q = new URLSearchParams(hash.replace(/^#/, ''));
  const st: State = {};
  const me = q.get('me');
  const them = q.get('them');
  if (me) st.me = decodePerson(me);
  if (them) st.them = decodePerson(them);
  if (q.get('ask') === '1' && st.them) st.ask = true;
  const gt = q.get('gt');
  const gm = q.get('gm');
  if (gt) st.gt = decodeGuesses(gt);
  if (gm) st.gm = decodeGuesses(gm);
  const t = Number(q.get('t'));
  if (t === 20 || t === 30) st.t = t;
  return st;
}

/** The link you send a friend: your name, your stated taps, your picks — and a request to be guessed. */
export function guessMeState(me: Person): State {
  return { them: me, ask: true };
}

/** The link the friend sends back: the original person's record, the friend's, and the friend's guesses. */
export function returnState(st: State): State {
  return { me: st.them, them: st.me, gm: st.gt, t: undefined };
}
