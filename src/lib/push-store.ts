/**
 * The simplest persistence that survives serverless: a single push subscription
 * and a single program start date. SOLO DOGFOOD — one user, no accounts.
 *
 * Two backends, picked automatically:
 *  1. Vercel KV / Upstash (when KV_REST_API_URL + KV_REST_API_TOKEN are set) —
 *     read AND write at runtime, so subscribing from the phone Just Works.
 *  2. Env-var fallback (PUSH_SUBSCRIPTION + PROGRAM_START_DATE) — read-only,
 *     for when you'd rather paste the subscription into Vercel env than stand up
 *     a KV store. The subscribe endpoint hands you the JSON to paste.
 *
 * No SDK: KV's REST API speaks over plain fetch, so there's no extra dependency.
 */

export interface StoredPush {
  /** The PushSubscription JSON the browser produced. */
  subscription: PushSubscriptionJSON | null;
  /** Program start date as epoch ms (the same value the wheel stores locally). */
  startMs: number | null;
}

// Minimal shape of a serialized PushSubscription (we only forward it to web-push).
export interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
}

const KEY_SUB = 'pocketcoach:subscription';
const KEY_START = 'pocketcoach:startMs';

function kvConfig() {
  const url = import.meta.env.KV_REST_API_URL;
  const token = import.meta.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function kvGet(key: string): Promise<string | null> {
  const cfg = kvConfig();
  if (!cfg) return null;
  const res = await fetch(`${cfg.url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${cfg.token}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: string | null };
  return data.result ?? null;
}

async function kvSet(key: string, value: string): Promise<void> {
  const cfg = kvConfig();
  if (!cfg) throw new Error('No KV configured — cannot persist at runtime.');
  const res = await fetch(`${cfg.url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'text/plain' },
    body: value,
  });
  if (!res.ok) throw new Error(`KV set failed: ${res.status} ${await res.text()}`);
}

/** True when we can write at runtime (KV is configured). */
export function canPersist(): boolean {
  return kvConfig() !== null;
}

export async function getStored(): Promise<StoredPush> {
  // KV first; fall back to env vars when KV isn't configured.
  if (canPersist()) {
    const [subRaw, startRaw] = await Promise.all([kvGet(KEY_SUB), kvGet(KEY_START)]);
    return {
      subscription: subRaw ? (JSON.parse(subRaw) as PushSubscriptionJSON) : null,
      startMs: startRaw ? Number(startRaw) : null,
    };
  }
  const envSub = import.meta.env.PUSH_SUBSCRIPTION;
  const envStart = import.meta.env.PROGRAM_START_DATE;
  return {
    subscription: envSub ? (JSON.parse(envSub) as PushSubscriptionJSON) : null,
    // PROGRAM_START_DATE may be epoch ms or an ISO date; accept either.
    startMs: envStart ? toMs(envStart) : null,
  };
}

export async function saveSubscription(sub: PushSubscriptionJSON, startMs: number): Promise<void> {
  await kvSet(KEY_SUB, JSON.stringify(sub));
  await kvSet(KEY_START, String(startMs));
}

function toMs(v: string): number {
  const n = Number(v);
  if (!Number.isNaN(n) && n > 0) return n;
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t;
}
