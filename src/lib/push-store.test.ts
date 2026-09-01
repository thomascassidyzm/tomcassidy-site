import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// The store talks PostgREST over plain fetch, so a faked fetch is the whole test
// harness: we assert on the REQUESTS it makes, which is what the real database
// would see.
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';

const {
  canPersist,
  subscriberId,
  upsertSubscriber,
  getSubscriber,
  listLiveSubscribers,
  getGoal,
  saveGoal,
  markSent,
  revoke,
  weekIndexFor,
  currentGoal,
  toMs,
  toPushSubscription,
} = await import('@/lib/push-store');

interface Call {
  url: string;
  method: string;
  body: any;
  headers: Record<string, string>;
}

let calls: Call[] = [];
let responder: (c: Call) => { status?: number; body?: unknown };

function fakeFetch(url: string, init: any = {}) {
  const call: Call = {
    url,
    method: init.method ?? 'GET',
    body: init.body ? JSON.parse(init.body) : null,
    headers: init.headers ?? {},
  };
  calls.push(call);
  const { status = 200, body = [] } = responder(call);
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === null ? '' : JSON.stringify(body)),
  } as Response);
}

const ROW = {
  id: 'aaa',
  endpoint: 'https://push.example/one',
  p256dh: 'p1',
  auth: 'a1',
  program_slug: 'reasonable-eating',
  start_ms: '1750000000000',
  last_sent_at: null,
  last_status: null,
  fail_count: 0,
  revoked_at: null,
};

beforeEach(() => {
  calls = [];
  responder = () => ({ body: [] });
  vi.stubGlobal('fetch', fakeFetch as unknown as typeof fetch);
});
afterEach(() => vi.unstubAllGlobals());

describe('identity', () => {
  it('is the sha-256 of the endpoint, hex, 32 chars — stable and endpoint-specific', async () => {
    const a = await subscriberId('https://push.example/one');
    const b = await subscriberId('https://push.example/one');
    const c = await subscriberId('https://push.example/two');
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe('canPersist', () => {
  it('is true when both Supabase variables are present', () => {
    expect(canPersist()).toBe(true);
  });
});

describe('upsertSubscriber', () => {
  it('creates a row keyed on the endpoint hash, with THEIR start date', async () => {
    responder = (c) => (c.method === 'GET' ? { body: [] } : { body: null });
    const id = await upsertSubscriber(
      { endpoint: 'https://push.example/one', keys: { p256dh: 'p1', auth: 'a1' } },
      1_750_000_000_000,
    );
    expect(id).toBe(await subscriberId('https://push.example/one'));
    const write = calls.find((c) => c.method === 'POST')!;
    expect(write.url).toContain('coach_subscribers?on_conflict=id');
    expect(write.headers.Prefer).toContain('merge-duplicates');
    expect(write.body.start_ms).toBe(1_750_000_000_000);
    expect(write.body.revoked_at).toBeNull();
  });

  it('re-tapping the bell keeps the existing start date — nobody gets sent back to week one', async () => {
    responder = (c) => (c.method === 'GET' ? { body: [ROW] } : { body: null });
    await upsertSubscriber(
      { endpoint: 'https://push.example/one', keys: { p256dh: 'NEW', auth: 'NEW' } },
      Date.now(),
    );
    const write = calls.find((c) => c.method === 'POST')!;
    expect(write.body.start_ms).toBe(1_750_000_000_000);
    // …but the keys ARE refreshed, and any revocation cleared.
    expect(write.body.p256dh).toBe('NEW');
    expect(write.body.revoked_at).toBeNull();
  });

  it('throws when Supabase says no, so the endpoint can report a real failure', async () => {
    responder = (c) => (c.method === 'GET' ? { body: [] } : { status: 401, body: { message: 'nope' } });
    await expect(
      upsertSubscriber({ endpoint: 'https://push.example/x', keys: { p256dh: 'p', auth: 'a' } }, 1),
    ).rejects.toThrow(/401/);
  });
});

describe('listLiveSubscribers', () => {
  it('asks only for rows that have not been revoked', async () => {
    responder = () => ({ body: [ROW, { ...ROW, id: 'bbb', endpoint: 'https://push.example/two' }] });
    const subs = await listLiveSubscribers();
    expect(calls[0].url).toContain('revoked_at=is.null');
    expect(subs).toHaveLength(2);
    expect(subs[0].startMs).toBe(1_750_000_000_000);
  });
});

describe('goals', () => {
  it('reads this person’s goal at this person’s week', async () => {
    responder = () => ({
      body: [{ subscriber_id: 'aaa', week_index: 3, text: 'walk after lunch', blessed: true, set_at_ms: '5' }],
    });
    const g = await getGoal('aaa', 3);
    expect(calls[0].url).toContain('subscriber_id=eq.aaa');
    expect(calls[0].url).toContain('week_index=eq.3');
    expect(g).toEqual({ text: 'walk after lunch', blessed: true, weekIndex: 3, setAtMs: 5 });
  });

  it('upserts on (subscriber, week), so previous weeks survive', async () => {
    responder = () => ({ body: null });
    await saveGoal('aaa', { text: 'x', blessed: false, weekIndex: 2, setAtMs: 9 });
    expect(calls[0].url).toContain('on_conflict=subscriber_id,week_index');
    expect(calls[0].body).toMatchObject({ subscriber_id: 'aaa', week_index: 2, text: 'x' });
  });

  it('currentGoal asks for the week the subscriber is actually on', async () => {
    responder = () => ({ body: [] });
    const sub = { id: 'aaa', startMs: 1_750_000_000_000 } as any;
    const now = 1_750_000_000_000 + 21 * 86_400_000; // three weeks in
    expect(weekIndexFor(sub, now)).toBe(3);
    await currentGoal(sub, now);
    expect(calls[0].url).toContain('week_index=eq.3');
  });
});

describe('send bookkeeping', () => {
  it('markSent records the status and clears fail_count on success', async () => {
    responder = () => ({ body: null });
    await markSent('aaa', 201, true);
    expect(calls[0].method).toBe('PATCH');
    expect(calls[0].url).toContain('id=eq.aaa');
    expect(calls[0].body.last_status).toBe(201);
    expect(calls[0].body.fail_count).toBe(0);
  });

  it('revoke stamps revoked_at, which is what drops the row out of the run', async () => {
    responder = () => ({ body: null });
    await revoke('aaa', 410);
    expect(calls[0].body.revoked_at).toBeTruthy();
    expect(calls[0].body.last_status).toBe(410);
  });
});

describe('odds and ends', () => {
  it('getSubscriber returns null rather than throwing on an unknown id', async () => {
    responder = () => ({ body: [] });
    expect(await getSubscriber('nope')).toBeNull();
  });

  it('toMs takes epoch ms or an ISO date', () => {
    expect(toMs('1750000000000')).toBe(1_750_000_000_000);
    expect(toMs('2026-06-22T00:00:00Z')).toBe(Date.parse('2026-06-22T00:00:00Z'));
    expect(toMs('rubbish')).toBe(0);
  });

  it('rebuilds the web-push shape from a row', () => {
    expect(toPushSubscription({ endpoint: 'e', p256dh: 'p', auth: 'a' } as any)).toEqual({
      endpoint: 'e',
      keys: { p256dh: 'p', auth: 'a' },
    });
  });
});
