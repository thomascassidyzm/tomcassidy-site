import type { APIRoute } from 'astro';
import { canPersist, saveSubscription, type PushSubscriptionJSON } from '@/lib/push-store';

// Stores THE single push subscription + program start date. SSR-only.
//
// When KV is configured this writes it and you're done. When it isn't, there's
// nowhere to write at runtime, so we echo the subscription back with a
// `paste` payload — drop it into Vercel env (PUSH_SUBSCRIPTION + the
// PROGRAM_START_DATE) and redeploy. Either way the phone is now subscribed.
export const prerender = false;

interface SubscribeBody {
  subscription: PushSubscriptionJSON;
  /** Epoch ms — the same start date the wheel stores in localStorage. */
  startMs?: number;
}

export const POST: APIRoute = async ({ request }) => {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { subscription, startMs } = body;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return json({ error: 'A valid push subscription is required' }, 400);
  }

  // Default the start date to now if the client didn't send one.
  const start = typeof startMs === 'number' && startMs > 0 ? startMs : Date.now();

  if (canPersist()) {
    try {
      await saveSubscription(subscription, start);
      return json({ ok: true, persisted: 'kv' }, 200);
    } catch (e) {
      console.error('Subscribe: KV write failed', e);
      return json({ error: 'Could not store subscription' }, 500);
    }
  }

  // No KV — give Tom the exact env values to paste, then redeploy.
  console.log('[pocket-coach] PUSH_SUBSCRIPTION=', JSON.stringify(subscription));
  console.log('[pocket-coach] PROGRAM_START_DATE=', start);
  return json(
    {
      ok: true,
      persisted: 'manual',
      paste: {
        PUSH_SUBSCRIPTION: JSON.stringify(subscription),
        PROGRAM_START_DATE: String(start),
      },
    },
    200,
  );
};

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
