import type { APIRoute } from 'astro';
import webpush from 'web-push';
import { reasonableEating } from '@/lib/programs/reasonable-eating';
import { pickCoachLine } from '@/lib/coach-engine';
import { getStored } from '@/lib/push-store';

// The delivery loop. Vercel cron hits this 2–3×/day at jittered times (see
// vercel.json). It computes the program's CURRENT week from the stored start
// date, draws one tone-weighted line from that week's coach banks, and sends a
// single web push. Return, not nag — no streaks, no "did you do it?". SSR-only.
export const prerender = false;

const PROGRAM = reasonableEating;
// Where tapping the push lands — the PWA's start_url; the wheel opens on the
// week you're actually on. A hash makes the intent explicit.
const ORIGIN_PATH = '/reasonable-eating';

export const GET: APIRoute = async ({ request }) => {
  // Vercel sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
  const secret = import.meta.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return json({ error: 'Unauthorized' }, 401);
    }
  }

  const pub = import.meta.env.VAPID_PUBLIC_KEY;
  const priv = import.meta.env.VAPID_PRIVATE_KEY;
  const subject = import.meta.env.VAPID_SUBJECT || 'mailto:tomcassidy@mac.com';
  if (!pub || !priv) {
    return json({ error: 'VAPID keys not configured' }, 503);
  }

  const { subscription, startMs } = await getStored();
  if (!subscription) return json({ skipped: 'no subscription stored' }, 200);
  if (!startMs) return json({ skipped: 'no start date stored' }, 200);

  const line = pickCoachLine(PROGRAM, startMs, Date.now());
  webpush.setVapidDetails(subject, pub, priv);

  const payload = JSON.stringify({
    title: PROGRAM.title,
    body: line.text,
    // Tag so a second push replaces the first rather than stacking — return,
    // not a pile of unread nags.
    tag: 'pocket-coach',
    url: `${ORIGIN_PATH}#week-${line.week}`,
    week: line.week,
    tone: line.tone,
  });

  try {
    await webpush.sendNotification(subscription as webpush.PushSubscription, payload);
    return json({ sent: true, week: line.week, tone: line.tone }, 200);
  } catch (e: unknown) {
    const err = e as { statusCode?: number; body?: string };
    // 404/410 = the subscription is dead (app uninstalled / expired). Report it
    // so the next subscribe can replace it; nothing to retry here.
    console.error('[pocket-coach] push failed', err.statusCode, err.body);
    return json({ sent: false, statusCode: err.statusCode ?? null }, 200);
  }
};

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
