/**
 * The delivery run, as pure logic — so the multi-subscriber loop and the
 * prune-on-410 path can be tested without sending anything to a real phone.
 *
 * The cron route supplies the effects (send, record, revoke); everything about
 * WHO gets WHAT, and what happens when a device is gone, lives here.
 */
import { selectPayload } from '@/lib/coach-engine';
import { programBySlug } from '@/lib/programs/index';
import { reasonableEating } from '@/lib/programs/reasonable-eating';
import { weekIndexFor, type Subscriber } from '@/lib/push-store';
import type { WeeklyGoal } from '@/lib/coach-engine';

/** Tapping the push lands on the programme's own page, on the week they're on. */
export function originPath(slug: string): string {
  return `/${slug}`;
}

/**
 * What to push to ONE person: their programme, their week off their own start
 * date, their own blessed goal if they set one for that week.
 *
 * An unknown programme slug falls back to Reasonable Eating rather than
 * skipping them — it is the only programme with tone banks, and a nudge from
 * the wrong rotation beats silence from a typo.
 */
export function payloadFor(sub: Subscriber, goal: WeeklyGoal | null, nowMs: number, rng?: () => number) {
  const program = programBySlug(sub.programSlug) ?? reasonableEating;
  const line = selectPayload(program, sub.startMs, nowMs, goal, rng);
  return {
    program,
    weekIndex: weekIndexFor(sub, nowMs),
    line,
    payload: JSON.stringify({
      title: program.title,
      body: line.text,
      // Tag so a second push replaces the first rather than stacking — return,
      // not a pile of unread nags.
      tag: 'pocket-coach',
      url: `${originPath(program.slug)}#week-${line.week}`,
      week: line.week,
      tone: line.tone,
      source: line.source,
    }),
  };
}

/** 404 and 410 are the push services saying "this device is gone". Nothing else is. */
export function isGone(status: number | null | undefined): boolean {
  return status === 404 || status === 410;
}

export interface RunDeps {
  /** Send one push. Resolves with the status code; rejects with `{statusCode}` on failure. */
  send: (sub: Subscriber) => Promise<number | null>;
  markSent: (id: string, status: number | null, ok: boolean) => Promise<void>;
  revoke: (id: string, status: number | null) => Promise<void>;
}

export interface RunSummary {
  attempted: number;
  sent: number;
  pruned: number;
  failed: number;
}

/**
 * Send to everyone, in chunks, with `Promise.allSettled` — so one dead endpoint
 * can neither stall the run nor take it down. A 404/410 revokes that row
 * forever; anything else is recorded and retried on the next cron.
 */
export async function runSends(
  subs: Subscriber[],
  deps: RunDeps,
  chunkSize = 10,
): Promise<RunSummary> {
  const summary: RunSummary = { attempted: subs.length, sent: 0, pruned: 0, failed: 0 };

  for (let i = 0; i < subs.length; i += chunkSize) {
    const chunk = subs.slice(i, i + chunkSize);
    const results = await Promise.allSettled(
      chunk.map(async (sub) => {
        try {
          const status = await deps.send(sub);
          await deps.markSent(sub.id, status ?? 201, true);
          return 'sent' as const;
        } catch (e) {
          const status = (e as { statusCode?: number }).statusCode ?? null;
          if (isGone(status)) {
            await deps.revoke(sub.id, status);
            return 'pruned' as const;
          }
          await deps.markSent(sub.id, status, false);
          return 'failed' as const;
        }
      }),
    );
    for (const r of results) {
      // A rejected settle means even the bookkeeping failed — count it failed
      // rather than losing it.
      if (r.status === 'rejected') summary.failed++;
      else if (r.value === 'sent') summary.sent++;
      else if (r.value === 'pruned') summary.pruned++;
      else summary.failed++;
    }
  }

  return summary;
}
