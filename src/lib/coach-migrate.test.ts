import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Same fake-fetch harness as push-store.test.ts: this shim talks to the store
// over PostgREST, so asserting on the requests it makes is asserting on what
// the real database would see.
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';

const { seedLegacySubscriber } = await import('@/lib/coach-migrate');
const { subscriberId } = await import('@/lib/push-store');

interface Call {
  url: string;
  method: string;
  body: any;
}

let calls: Call[] = [];
let responder: (c: Call) => { status?: number; body?: unknown };

function fakeFetch(url: string, init: any = {}) {
  const call: Call = { url, method: init.method ?? 'GET', body: init.body ? JSON.parse(init.body) : null };
  calls.push(call);
  const { status = 200, body = [] } = responder(call);
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === null ? '' : JSON.stringify(body)),
  } as Response);
}

const ENDPOINT = 'https://push.example/legacy';
const SUB_JSON = JSON.stringify({ endpoint: ENDPOINT, keys: { p256dh: 'p', auth: 'a' } });

function envOf(vars: Record<string, string>) {
  return (name: string) => vars[name];
}

beforeEach(() => {
  calls = [];
  responder = () => ({ body: [] });
  vi.stubGlobal('fetch', fakeFetch as unknown as typeof fetch);
});
afterEach(() => vi.unstubAllGlobals());

describe('seedLegacySubscriber — partial-migration recovery', () => {
  it('a fresh env seeds both the subscriber and the goal in one pass', async () => {
    const id = await subscriberId(ENDPOINT);
    // GET subscriber-by-endpoint (none yet), POST upsert, GET goal (none yet), POST goal.
    let getCount = 0;
    responder = (c) => {
      if (c.method === 'GET' && c.url.includes('coach_subscribers')) return { body: [] };
      if (c.method === 'GET' && c.url.includes('coach_goals')) {
        getCount++;
        return { body: [] };
      }
      return { body: null };
    };
    const result = await seedLegacySubscriber(
      envOf({
        PUSH_SUBSCRIPTION: SUB_JSON,
        WEEKLY_GOAL: JSON.stringify({ text: 'walk daily', weekIndex: 2, blessed: true }),
      }),
    );
    expect(result).toBe('seeded');
    const goalWrite = calls.find((c) => c.method === 'POST' && c.url.includes('coach_goals'));
    expect(goalWrite?.body).toMatchObject({ subscriber_id: id, week_index: 2, text: 'walk daily' });
    expect(getCount).toBe(1);
  });

  it('BEFORE the fix would forever skip the goal once the subscriber row exists — the fix finishes it', async () => {
    // Simulates the crash-between-writes case: the subscriber row is already
    // there (upsertSubscriber succeeded on a prior run) but the goal write
    // never happened. Old behaviour: getSubscriberByEndpoint truthy -> return
    // 'exists' immediately, and the goal is never saved, on any future run.
    responder = (c) => {
      if (c.method === 'GET' && c.url.includes('coach_subscribers')) {
        return { body: [{ id: 'existing-id', endpoint: ENDPOINT, p256dh: 'p', auth: 'a', program_slug: 'reasonable-eating', start_ms: '1', last_sent_at: null, last_status: null, fail_count: 0, revoked_at: null }] };
      }
      if (c.method === 'GET' && c.url.includes('coach_goals')) return { body: [] };
      return { body: null };
    };
    const result = await seedLegacySubscriber(
      envOf({
        PUSH_SUBSCRIPTION: SUB_JSON,
        WEEKLY_GOAL: JSON.stringify({ text: 'walk daily', weekIndex: 2, blessed: true }),
      }),
    );
    expect(result).toBe('exists');
    const goalWrite = calls.find((c) => c.method === 'POST' && c.url.includes('coach_goals'));
    expect(goalWrite?.body).toMatchObject({ subscriber_id: 'existing-id', week_index: 2, text: 'walk daily' });
  });

  it('never overwrites a goal that is already stored for that week', async () => {
    responder = (c) => {
      if (c.method === 'GET' && c.url.includes('coach_subscribers')) {
        return { body: [{ id: 'existing-id', endpoint: ENDPOINT, p256dh: 'p', auth: 'a', program_slug: 'reasonable-eating', start_ms: '1', last_sent_at: null, last_status: null, fail_count: 0, revoked_at: null }] };
      }
      if (c.method === 'GET' && c.url.includes('coach_goals')) {
        return { body: [{ subscriber_id: 'existing-id', week_index: 2, text: 'a real goal the person set', blessed: true, set_at_ms: '1' }] };
      }
      return { body: null };
    };
    await seedLegacySubscriber(
      envOf({ PUSH_SUBSCRIPTION: SUB_JSON, WEEKLY_GOAL: JSON.stringify({ text: 'stale env goal', weekIndex: 2 }) }),
    );
    expect(calls.find((c) => c.method === 'POST' && c.url.includes('coach_goals'))).toBeUndefined();
  });
});
