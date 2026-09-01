import type { APIRoute } from 'astro';
import { canPersist, upsertSubscriber, type PushSubscriptionJSON } from '@/lib/push-store';

// Registers ONE device. Upsert on the endpoint hash, so re-tapping the bell is
// idempotent: it refreshes the keys, clears any revocation, and keeps the start
// date the row already had.
//
// There is no "paste this into Vercel" branch any more. When there is nowhere to
// write, this says so with a 503 — never a success shape. A page that says
// "You're set" over a failed write is the bug this endpoint used to ship.
export const prerender = false;

interface SubscribeBody {
  subscription: PushSubscriptionJSON;
  /** Epoch ms — the same start date the wheel keeps in localStorage. THEIR week one. */
  startMs?: number;
  /** Which programme they subscribed to; defaults to the only one with coach banks. */
  programSlug?: string;
}

export const POST: APIRoute = async ({ request }) => {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { subscription, startMs, programSlug } = body;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return json({ error: 'A valid push subscription is required' }, 400);
  }

  if (!canPersist()) {
    return json(
      { error: 'The coach store isn’t configured yet, so nothing was saved. Nobody is subscribed.' },
      503,
    );
  }

  // Default the start date to now if the client didn't send one.
  const start = typeof startMs === 'number' && startMs > 0 ? startMs : Date.now();

  try {
    const id = await upsertSubscriber(subscription, start, programSlug || 'reasonable-eating');
    return json({ ok: true, id }, 200);
  } catch (e) {
    console.error('[pocket-coach] subscribe failed', e);
    return json({ error: 'Could not store the subscription — nothing was saved.' }, 500);
  }
};

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
