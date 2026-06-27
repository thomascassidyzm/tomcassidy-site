import type { FocusPoint, Program } from '@/kit/types';
import { reasonableEating } from '@/lib/programs/reasonable-eating';

/**
 * The "Today" resolver — the one piece of state the pocket-coach needs.
 *
 * A program is a flat rotation of weekly focuses. Given a start date, the
 * current week is just how many whole weeks have elapsed, wrapped around the
 * rotation. No tracking, no streaks, no per-user state: the calendar alone
 * decides which one focus is live today.
 */

/** When Tom began the rotation (UTC midnight, a Monday). The single dial. */
export const PROGRAM_START = new Date('2026-06-22T00:00:00Z');

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** The weekly focuses, flattened into rotation order (week 1 → week 12). */
function focusesByWeek(program: Program): Map<number, FocusPoint> {
  const map = new Map<number, FocusPoint>();
  for (const domain of program.domains) {
    for (const focus of domain.focuses) map.set(focus.week, focus);
  }
  return map;
}

export interface TodayFocus {
  /** 1-based week within the rotation. */
  week: number;
  /** How many weeks the rotation runs before it laps. */
  totalWeeks: number;
  focus: FocusPoint;
  domain: string;
}

/** The one focus that is live right now. */
export function todaysFocus(
  program: Program = reasonableEating,
  now: Date = new Date(),
): TodayFocus {
  const totalWeeks = program.cycles * program.domains.length;
  const elapsed = Math.floor((now.getTime() - PROGRAM_START.getTime()) / WEEK_MS);
  const week = ((elapsed % totalWeeks) + totalWeeks) % totalWeeks + 1;

  const domain = program.domains.find((d) => d.focuses.some((f) => f.week === week));
  const focus = focusesByWeek(program).get(week)!;

  return { week, totalWeeks, focus, domain: domain?.name ?? '' };
}
