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
 * at all and returns 'exists'.
 *
 * DELETE THIS FILE, its call in src/pages/api/cron/coach.ts, and the three
 * variables in Vercel, once Tom has confirmed his row is there.
 */
import { PROGRAM_START } from '@/lib/today';
import type { WeeklyGoal } from '@/lib/coach-engine';
import {
  canPersist,
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
  // be replaced with stale ones from a config variable.
  if (await getSubscriberByEndpoint(sub.endpoint)) return 'exists';

  const startRaw = read('PROGRAM_START_DATE');
  const startMs = startRaw ? toMs(startRaw) : 0;
  await upsertSubscriber(sub, startMs > 0 ? startMs : PROGRAM_START.getTime(), 'reasonable-eating');

  // Any goal that was in the environment comes across at the week it names.
  const goalRaw = read('WEEKLY_GOAL');
  if (goalRaw) {
    try {
      const goal = JSON.parse(goalRaw) as WeeklyGoal;
      if (goal?.text && typeof goal.weekIndex === 'number') {
        await saveGoal(await subscriberId(sub.endpoint), {
          text: goal.text,
          blessed: !!goal.blessed,
          weekIndex: goal.weekIndex,
          setAtMs: goal.setAtMs ?? Date.now(),
        });
      }
    } catch {
      console.error('[pocket-coach] WEEKLY_GOAL is set but is not valid JSON — subscriber seeded without it.');
    }
  }

  console.log('[pocket-coach] migration: seeded the legacy config-variable subscriber.');
  return 'seeded';
}
