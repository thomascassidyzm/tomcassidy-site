import type { APIRoute } from 'astro';
import webpush from 'web-push';
import { payloadFor, runSends } from '@/lib/coach-run';
import { seedLegacySubscriber } from '@/lib/coach-migrate';
import {
  canPersist,
  currentGoal,
  listLiveSubscribers,
  markSent,
  revoke,
  toPushSubscription,
} from '@/lib/push-store';

// The delivery loop. Vercel cron hits this 2–3×/day at jittered times (see
// vercel.json). For EVERY live subscriber it computes their week from their own
// start date, draws one tone-weighted line from that week's coach banks — or
// their own blessed words if they set them — and sends one web push.
//
// Return, not nag: no streaks, no "did you do it?". SSR-only.
export const prerender = false;

function env(name: string): string | undefined {
  const fromImport = (import.meta.env as Record<string, string | undefined>)[name];
  const fromProcess =
    typeof process !== 'undefined' ? (process.env as Record<string, string | undefined>)[name] : undefined;
  return fromImport || fromProcess;
}

export const GET: APIRoute = async ({ request }) => {
  // Vercel sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
  const secret = env('CRON_SECRET');
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return json({ error: 'Unauthorized' }, 401);
    }
  }

  const pub = env('VAPID_PUBLIC_KEY');
  const priv = env('VAPID_PRIVATE_KEY');
  const subject = env('VAPID_SUBJECT') || 'mailto:tomcassidy@mac.com';
  if (!pub || !priv) return json({ error: 'VAPID keys not configured' }, 503);
  if (!canPersist()) return json({ error: 'Coach store not configured' }, 503);

  // MIGRATION SHIM — see src/lib/coach-migrate.ts. Does nothing once the row
  // exists; delete both once Tom has confirmed his subscription is in the table.
  let migration: string;
  try {
    migration = await seedLegacySubscriber();
  } catch (e) {
    console.error('[pocket-coach] migration seed failed', e);
    migration = 'error';
  }

  let subs;
  try {
    subs = await listLiveSubscribers();
  } catch (e) {
    console.error('[pocket-coach] could not list subscribers', e);
    return json({ error: 'Could not reach the coach store' }, 503);
  }
  if (!subs.length) return json({ attempted: 0, sent: 0, pruned: 0, failed: 0, migration }, 200);

  webpush.setVapidDetails(subject, pub, priv);
  const now = Date.now();

  const summary = await runSends(subs, {
    async send(sub) {
      const goal = await currentGoal(sub, now);
      const { payload } = payloadFor(sub, goal, now);
      const res = await webpush.sendNotification(
        toPushSubscription(sub) as unknown as webpush.PushSubscription,
        payload,
      );
      return res?.statusCode ?? 201;
    },
    markSent,
    revoke,
  });

  return json({ ...summary, migration }, 200);
};

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
