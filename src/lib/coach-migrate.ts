/**
 * MIGRATION SHIM — one-shot, idempotent, and safe to delete.
 *
 * Before there was a store, the single subscriber lived in a config variable:
 * PUSH_SUBSCRIPTION, with PROGRAM_START_DATE and WEEKLY_GOAL beside it. This
 * moves that one subscriber into `coach_subscribers` the first time the cron
 * runs in an environment that still has those variables set, so Tom's phone
 * keeps its notifications without him doing anything.
 *
 * It is the ONLY place in this codebase that reads those variables. It never
 * overwrites a live row: if a row already exists for that endpoint — because he
 * re-tapped the bell, which is the belt-and-braces fallback — it does nothing
 * to the subscriber row itself and returns 'exists'.
 *
 * DELETE THIS FILE, its call in src/pages/api/cron/coach.ts, and the three
 * variables in Vercel, once Tom has confirmed his row is there.
 */
import { PROGRAM_START } from '@/lib/today';
import type { WeeklyGoal } from '@/lib/coach-engine';
import {
  canPersist,
  getGoal,
  getSubscriberByEndpoint,
  saveGoal,
  subscriberId,
  toMs,
  upsertSubscriber,
  type PushSubscriptionJSON,
} from '@/lib/push-store';

export type SeedResult = 'no-env' | 'exists' | 'seeded' | 'bad-env';

function env(name: string): string | undefined {
  const fromImport = (import.meta.env as Record<string, string | undefined>)[name];
  const fromProcess =
    typeof process !== 'undefined' ? (process.env as Record<string, string | undefined>)[name] : undefined;
  return fromImport || fromProcess;
}

export async function seedLegacySubscriber(read: (n: string) => string | undefined = env): Promise<SeedResult> {
  if (!canPersist()) return 'no-env';
  const raw = read('PUSH_SUBSCRIPTION');
  if (!raw) return 'no-env';

  let sub: PushSubscriptionJSON;
  try {
    sub = JSON.parse(raw) as PushSubscriptionJSON;
  } catch {
    console.error('[pocket-coach] PUSH_SUBSCRIPTION is set but is not valid JSON — not seeded.');
    return 'bad-env';
  }
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) return 'bad-env';

  // Never touch a row that already exists: a live subscription's keys must not
  // be replaced with stale ones from a config variable. But an existing row is
  // not necessarily a COMPLETE migration — if the process died between the
  // subscriber upsert and the goal save below, the row exists forever after,
  // and this early-return used to mean the goal never got a second chance.
  // Finish the goal half before declaring 'exists', so a partial migration
  // self-heals on the next cron rather than staying half-done permanently.
  const existing = await getSubscriberByEndpoint(sub.endpoint);
  if (existing) {
    await seedGoalIfMissing(existing.id, read);
    return 'exists';
  }

  const startRaw = read('PROGRAM_START_DATE');
  const startMs = startRaw ? toMs(startRaw) : 0;
  await upsertSubscriber(sub, startMs > 0 ? startMs : PROGRAM_START.getTime(), 'reasonable-eating');

  await seedGoalIfMissing(await subscriberId(sub.endpoint), read);

  console.log('[pocket-coach] migration: seeded the legacy config-variable subscriber.');
  return 'seeded';
}

/**
 * The goal half of the migration, on its own so it can be retried against an
 * already-existing subscriber row without touching the subscriber itself.
 * Only fills in a goal for the week WEEKLY_GOAL actually names, and only when
 * nothing is stored for that subscriber/week yet — it never overwrites a real
 * goal the person has since set through the app.
 */
async function seedGoalIfMissing(id: string, read: (n: string) => string | undefined): Promise<void> {
  const goalRaw = read('WEEKLY_GOAL');
  if (!goalRaw) return;

  let goal: WeeklyGoal;
  try {
    goal = JSON.parse(goalRaw) as WeeklyGoal;
  } catch {
    console.error('[pocket-coach] WEEKLY_GOAL is set but is not valid JSON — subscriber seeded without it.');
    return;
  }
  if (!goal?.text || typeof goal.weekIndex !== 'number') return;

  if (await getGoal(id, goal.weekIndex)) return;

  await saveGoal(id, {
    text: goal.text,
    blessed: !!goal.blessed,
    weekIndex: goal.weekIndex,
    setAtMs: goal.setAtMs ?? Date.now(),
  });
}
