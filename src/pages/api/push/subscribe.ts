import type { APIRoute } from 'astro';
import { canPersist, upsertSubscriber, type PushSubscriptionJSON } from '@/lib/push-store';

// Which hostnames a real browser's push subscription endpoint can actually
// have. Anything else stored here is handed straight to web-push by the cron
// (see coach.ts), which is a server making an outbound HTTPS request to a URL
// an anonymous caller chose — a blind SSRF primitive if unchecked.
//
// Deliberately generous: an omission here silently kills reminders for
// everyone on that browser, which is worse than the risk this guards against.
// Suffix-matched, so a vendor's regional/versioned subdomains
// (`wns2-xyz.notify.windows.com`, autopush shards under
// `*.push.services.mozilla.com`) are covered without enumerating them.
export const ALLOWED_PUSH_HOST_SUFFIXES = [
  'fcm.googleapis.com', // Chrome, Edge, Opera, Brave, Samsung Internet, Chrome-based Android
  'android.googleapis.com', // legacy GCM-era Android endpoints, still seen from old service workers
  'push.services.mozilla.com', // Firefox (autopush), includes updates.push.services.mozilla.com
  'web.push.apple.com', // Safari 16+ (macOS and iOS)
  'notify.windows.com', // Edge Legacy / UWP
];

export function isAllowedPushEndpoint(endpoint: string): boolean {
  let host: string;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== 'https:') return false;
    host = url.hostname.toLowerCase();
  } catch {
    return false;
  }
  return ALLOWED_PUSH_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

// Field bounds — generous relative to what a real subscription looks like
// (endpoints run well under 512 chars in practice; p256dh/auth are short
// fixed-size base64url values), tight enough that a large payload can't be
// stored as an "anonymous subscription" for free.
const MAX_ENDPOINT_LENGTH = 2048;
const MAX_KEY_LENGTH = 256;
const MAX_PROGRAM_SLUG_LENGTH = 64;

// Sliding-window per-IP throttle: registering a subscription is free and
// anonymous (no proof this is a real push subscription beyond the shape
// check below), so without a cap it's an unbounded row-creation endpoint.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  for (const [key, timestamps] of requestLog) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) requestLog.delete(key);
    else requestLog.set(key, fresh);
  }
  const timestamps = requestLog.get(ip) ?? [];
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) return true;
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
}

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
  if (isRateLimited(getClientIp(request))) {
    return json({ error: 'Too many requests' }, 429);
  }

  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { subscription, startMs, programSlug } = body;
  if (
    typeof subscription?.endpoint !== 'string' ||
    typeof subscription?.keys?.p256dh !== 'string' ||
    typeof subscription?.keys?.auth !== 'string' ||
    !subscription.endpoint ||
    !subscription.keys.p256dh ||
    !subscription.keys.auth
  ) {
    return json({ error: 'A valid push subscription is required' }, 400);
  }

  if (
    subscription.endpoint.length > MAX_ENDPOINT_LENGTH ||
    subscription.keys.p256dh.length > MAX_KEY_LENGTH ||
    subscription.keys.auth.length > MAX_KEY_LENGTH ||
    (typeof programSlug === 'string' && programSlug.length > MAX_PROGRAM_SLUG_LENGTH)
  ) {
    return json({ error: 'A valid push subscription is required' }, 400);
  }

  // Never store a destination the cron would later hand to web-push if it
  // isn't a real browser push service — this endpoint is otherwise a
  // deferred, blind SSRF primitive (an anonymous caller choosing what a
  // server later makes an outbound HTTPS request to).
  if (!isAllowedPushEndpoint(subscription.endpoint)) {
    return json({ error: 'That does not look like a real push subscription endpoint' }, 400);
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
