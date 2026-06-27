/**
 * The pocket-coach engine — pure, server-safe logic shared by the cron sender.
 *
 * It mirrors EXACTLY how ProgramWheel.svelte computes "this week" from the one
 * stored start date: order = the sorted rotation of week numbers, and the week
 * you are on is `order[floor(daysSince / 7) % order.length]`. The wheel and the
 * push must never disagree about which focus it is, so the arithmetic lives
 * here once and both read it.
 *
 * No Svelte, no DOM — importable from an API route.
 */
import type { Program, FocusPoint } from '@/kit/types';

const DAY_MS = 86_400_000;

/** The rotation order of week numbers, low → high (hub excluded unless in rotation). */
export function rotationOrder(program: Program): number[] {
  const nums = program.domains
    .flatMap((d) => d.focuses.map((f) => f.week))
    .sort((a, b) => a - b);
  if (program.hub.inRotation) {
    // A hub that is itself a weekly stop slots in at its numeral's position.
    const hubNum = Number(program.hub.numeral ?? '0');
    let idx = nums.findIndex((w) => w > hubNum);
    if (idx < 0) idx = nums.length;
    nums.splice(idx, 0, hubNum);
  }
  return nums;
}

/** Which week number the program is on, given the start date and "now". */
export function currentWeekNumber(program: Program, startMs: number, nowMs: number): number {
  const order = rotationOrder(program);
  const days = Math.floor((nowMs - startMs) / DAY_MS);
  const idx = Math.floor(Math.max(0, days) / 7) % order.length;
  return order[idx];
}

/** The focus point for a given week number — or the hub, when week === hub numeral. */
export function focusForWeek(program: Program, week: number): FocusPoint | 'hub' {
  const hubNum = Number(program.hub.numeral ?? '0');
  if (week === hubNum) return 'hub';
  for (const d of program.domains) {
    const f = d.focuses.find((x) => x.week === week);
    if (f) return f;
  }
  return 'hub';
}

export type Tone = 'gentle' | 'encouraging' | 'honestKind' | 'playful';

/**
 * The default tone mix — gentle and encouraging carry the load (return, not
 * nag); honest-but-kind and playful are the seasoning. Weights, not percentages.
 */
const DEFAULT_TONE_WEIGHTS: Record<Tone, number> = {
  gentle: 4,
  encouraging: 3,
  honestKind: 2,
  playful: 2,
};

/** Deterministic-free pick: a float in [0,1). Injectable for tests. */
type Rng = () => number;

function weightedTone(rng: Rng, weights = DEFAULT_TONE_WEIGHTS): Tone {
  const tones = Object.keys(weights) as Tone[];
  const total = tones.reduce((s, t) => s + weights[t], 0);
  let r = rng() * total;
  for (const t of tones) {
    r -= weights[t];
    if (r < 0) return t;
  }
  return tones[0];
}

export interface CoachLine {
  /** The week number this line belongs to. */
  week: number;
  /** Short name of the focus (for logging / fallback title). */
  name: string;
  /** The tone bucket the line was drawn from. */
  tone: Tone;
  /** The line itself — what the notification body says. */
  text: string;
}

/**
 * Pick one tone-weighted line for the program's current week. Falls back to the
 * focus's `coach.wisdom` when that week has no tone banks yet, so the loop keeps
 * working while the banks are still being authored.
 */
export function pickCoachLine(
  program: Program,
  startMs: number,
  nowMs: number,
  rng: Rng = Math.random,
): CoachLine {
  const week = currentWeekNumber(program, startMs, nowMs);
  const target = focusForWeek(program, week);
  const coach = target === 'hub' ? program.hub.coach : target.coach;
  const name = target === 'hub' ? program.hub.algorithmName : target.name;

  const banks = coach.banks;
  if (banks) {
    // Only draw a tone that actually has lines; re-roll past empty buckets.
    const available = (Object.keys(banks) as Tone[]).filter((t) => banks[t]?.length);
    if (available.length) {
      const filtered = Object.fromEntries(
        available.map((t) => [t, DEFAULT_TONE_WEIGHTS[t]]),
      ) as Record<Tone, number>;
      const tone = weightedTone(rng, filtered);
      const lines = banks[tone];
      const text = lines[Math.floor(rng() * lines.length)];
      return { week, name, tone, text };
    }
  }
  return { week, name, tone: 'gentle', text: coach.wisdom };
}
