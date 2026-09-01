/**
 * The coaching engine's store: one row per subscribed device in Supabase.
 *
 * There are no accounts, because the push subscription already IS an identity —
 * the endpoint URL the browser generates is unique to that device and
 * unguessable. Hash it and you have a user id, with nobody signing up for
 * anything.
 *
 * ONE backend, deliberately. The previous version had two (Vercel KV, and a
 * read-only env-var fallback), and the silently-read-only one is exactly what
 * let the UI say "You're set" when nothing had been saved. When Supabase is not
 * configured, every accessor here throws and the endpoints return an honest 503.
 *
 * No SDK: PostgREST speaks over plain fetch, which is the same reason the old
 * file gave for not taking the KV SDK.
 *
 * `import.meta.env.X ?? process.env.X` on every read, because Astro may inline
 * `import.meta.env` at BUILD time — which would mean a credential set in Vercel
 * did nothing until the next deploy. The process.env half reads at request time.
 */
import { weekIndex, type WeeklyGoal } from '@/lib/coach-engine';

/** Minimal shape of a serialized PushSubscription (we only forward it to web-push). */
export interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
}

/** A row of `coach_subscribers`, as the rest of the app wants to read it. */
export interface Subscriber {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  programSlug: string;
  startMs: number;
  lastSentAt: string | null;
  lastStatus: number | null;
  failCount: number;
  revokedAt: string | null;
}

interface SubscriberRow {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  program_slug: string;
  start_ms: number | string;
  last_sent_at: string | null;
  last_status: number | null;
  fail_count: number;
  revoked_at: string | null;
}

interface GoalRow {
  subscriber_id: string;
  week_index: number;
  text: string;
  blessed: boolean;
  set_at_ms: number | string;
}

function env(name: string): string | undefined {
  const fromImport = (import.meta.env as Record<string, string | undefined>)[name];
  const fromProcess =
    typeof process !== 'undefined' ? (process.env as Record<string, string | undefined>)[name] : undefined;
  return fromImport || fromProcess;
}

function supabaseConfig(): { url: string; key: string } | null {
  const url = env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  return url && key ? { url: url.replace(/\/+$/, ''), key } : null;
}

/** True when we can read AND write at runtime. There is no read-only mode. */
export function canPersist(): boolean {
  return supabaseConfig() !== null;
}

/** One PostgREST call. Throws on anything that isn't a 2xx — silence is the bug we're fixing. */
async function rest(
  path: string,
  init: RequestInit & { prefer?: string } = {},
): Promise<unknown> {
  const cfg = supabaseConfig();
  if (!cfg) throw new Error('Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).');
  const { prefer, ...rest_ } = init;
  const res = await fetch(`${cfg.url}/rest/v1/${path}`, {
    ...rest_,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
      ...(rest_.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status} on ${path}: ${await res.text()}`);
  }
  const body = await res.text();
  return body ? JSON.parse(body) : null;
}

/**
 * The user id: sha-256 of the endpoint, hex, first 32 chars. Always computed
 * SERVER-side from the endpoint — never accepted from a client, because an id
 * in the clear would let anyone holding one read and rewrite that person's goal.
 */
export async function subscriberId(endpoint: string): Promise<string> {
  const bytes = new TextEncoder().encode(endpoint);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

function toSubscriber(row: SubscriberRow): Subscriber {
  return {
    id: row.id,
    endpoint: row.endpoint,
    p256dh: row.p256dh,
    auth: row.auth,
    programSlug: row.program_slug,
    startMs: Number(row.start_ms),
    lastSentAt: row.last_sent_at,
    lastStatus: row.last_status,
    failCount: row.fail_count,
    revokedAt: row.revoked_at,
  };
}

/** The web-push shape, rebuilt from the row. */
export function toPushSubscription(sub: Subscriber): PushSubscriptionJSON {
  return { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } };
}

/**
 * Subscribe, or re-subscribe. Upsert on the primary key so re-tapping the bell
 * is idempotent and refreshes the keys — and clears any revocation, because a
 * device that has just handed us a fresh subscription is plainly not dead.
 *
 * `startMs` is THEIR week one. An existing row keeps its own start date: the
 * whole point of a per-person start is that re-tapping the bell in week 9 must
 * not send them back to week 1.
 */
export async function upsertSubscriber(
  sub: PushSubscriptionJSON,
  startMs: number,
  programSlug = 'reasonable-eating',
): Promise<string> {
  const id = await subscriberId(sub.endpoint);
  const existing = await getSubscriber(id);
  const row = {
    id,
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
    program_slug: existing?.programSlug ?? programSlug,
    start_ms: existing?.startMs ?? startMs,
    revoked_at: null,
    fail_count: 0,
  };
  await rest('coach_subscribers?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify(row),
    prefer: 'resolution=merge-duplicates,return=minimal',
  });
  return id;
}

export async function getSubscriber(id: string): Promise<Subscriber | null> {
  const rows = (await rest(
    `coach_subscribers?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
  )) as SubscriberRow[];
  return rows?.length ? toSubscriber(rows[0]) : null;
}

export async function getSubscriberByEndpoint(endpoint: string): Promise<Subscriber | null> {
  return getSubscriber(await subscriberId(endpoint));
}

/** Everyone the cron should send to: every row that has not been revoked. */
export async function listLiveSubscribers(): Promise<Subscriber[]> {
  const rows = (await rest(
    'coach_subscribers?revoked_at=is.null&select=*&order=created_at.asc',
  )) as SubscriberRow[];
  return (rows ?? []).map(toSubscriber);
}

export async function getGoal(id: string, week: number): Promise<WeeklyGoal | null> {
  const rows = (await rest(
    `coach_goals?subscriber_id=eq.${encodeURIComponent(id)}&week_index=eq.${week}&select=*&limit=1`,
  )) as GoalRow[];
  if (!rows?.length) return null;
  const r = rows[0];
  return { text: r.text, blessed: r.blessed, weekIndex: r.week_index, setAtMs: Number(r.set_at_ms) };
}

/**
 * Save this week's goal. Keyed on (subscriber, week), so previous weeks are kept
 * rather than overwritten — the goal history is the only record this product
 * will ever have of what somebody actually said they'd do.
 */
export async function saveGoal(id: string, goal: WeeklyGoal): Promise<void> {
  await rest('coach_goals?on_conflict=subscriber_id,week_index', {
    method: 'POST',
    body: JSON.stringify({
      subscriber_id: id,
      week_index: goal.weekIndex,
      text: goal.text,
      blessed: goal.blessed,
      set_at_ms: goal.setAtMs,
    }),
    prefer: 'resolution=merge-duplicates,return=minimal',
  });
}

/** Record every attempt, success or not — this is what turns "is it still working?" into a glance. */
export async function markSent(id: string, status: number | null, ok: boolean): Promise<void> {
  const row: Record<string, unknown> = {
    last_sent_at: new Date().toISOString(),
    last_status: status,
  };
  if (ok) row.fail_count = 0;
  await rest(`coach_subscribers?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(row),
    prefer: 'return=minimal',
  });
}

/** A 404/410 means that device is gone. Stop sending to it, forever, quietly. */
export async function revoke(id: string, status: number | null): Promise<void> {
  await rest(`coach_subscribers?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      revoked_at: new Date().toISOString(),
      last_sent_at: new Date().toISOString(),
      last_status: status,
    }),
    prefer: 'return=minimal',
  });
}

/** Which absolute week THIS subscriber is on, from THEIR start date. */
export function weekIndexFor(sub: Subscriber, nowMs: number = Date.now()): number {
  return weekIndex(sub.startMs, nowMs);
}

/** This person's goal for the week they are actually on, or null. */
export async function currentGoal(
  sub: Subscriber,
  nowMs: number = Date.now(),
): Promise<WeeklyGoal | null> {
  return getGoal(sub.id, weekIndexFor(sub, nowMs));
}

/** PROGRAM_START_DATE accepts epoch ms or an ISO date; accept either. */
export function toMs(v: string): number {
  const n = Number(v);
  if (!Number.isNaN(n) && n > 0) return n;
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t;
}
