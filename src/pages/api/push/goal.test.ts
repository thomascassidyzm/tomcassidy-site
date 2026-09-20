import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Route-level tests for the goal endpoint's atomic bless (claim 11) and type
// guards (claim 9's cheap half). Same fake-fetch harness as push-store.test.ts.
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';

const { GET, POST } = await import('./goal');
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

const ENDPOINT = 'https://push.example/goal-route';
let SUB_ID: string;

beforeEach(async () => {
  calls = [];
  responder = () => ({ body: [] });
  vi.stubGlobal('fetch', fakeFetch as unknown as typeof fetch);
  SUB_ID = await subscriberId(ENDPOINT);
});
afterEach(() => vi.unstubAllGlobals());

function post(body: unknown) {
  return POST({ request: new Request('https://x/api/push/goal', { method: 'POST', body: JSON.stringify(body) }) } as any);
}

const SUB_ROW = {
  id: '',
  endpoint: ENDPOINT,
  p256dh: 'p',
  auth: 'a',
  program_slug: 'reasonable-eating',
  start_ms: '1',
  last_sent_at: null,
  last_status: null,
  fail_count: 0,
  revoked_at: null,
};

describe('POST /api/push/goal — type guards (claim 9)', () => {
  it('a non-string endpoint (e.g. JSON null, or an object) is rejected rather than reaching subscriberId', async () => {
    const res = await post({ action: 'set', text: 'x', endpoint: { not: 'a string' } });
    expect(res.status).toBe(400);
    // Never even looked up a subscriber for it.
    expect(calls.find((c) => c.url.includes('coach_subscribers'))).toBeUndefined();
  });

  it('a non-string `text` on `set` (e.g. a number) is rejected rather than throwing at .trim()', async () => {
    responder = (c) => (c.url.includes('coach_subscribers') ? { body: [{ ...SUB_ROW, id: SUB_ID }] } : { body: [] });
    const res = await post({ action: 'set', text: 12345, endpoint: ENDPOINT });
    expect(res.status).toBe(400);
    const j = await res.json();
    expect(j.error).toBeTruthy();
  });
});

describe('POST /api/push/goal — atomic bless (claim 11)', () => {
  it('blesses when the text has not moved since it was read', async () => {
    responder = (c) => {
      if (c.url.includes('coach_subscribers')) return { body: [{ ...SUB_ROW, id: SUB_ID }] };
      if (c.method === 'GET' && c.url.includes('coach_goals')) {
        return { body: [{ subscriber_id: SUB_ID, week_index: 0, text: 'walk daily', blessed: false, set_at_ms: '1' }] };
      }
      if (c.method === 'PATCH' && c.url.includes('coach_goals')) {
        return { body: [{ subscriber_id: SUB_ID, week_index: 0, text: 'walk daily', blessed: true, set_at_ms: '1' }] };
      }
      return { body: null };
    };
    const res = await post({ action: 'bless', endpoint: ENDPOINT });
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.goal.blessed).toBe(true);
  });

  it('a `set` that lands between the read and the bless makes the bless fail with 409, not silently confirm stale text', async () => {
    responder = (c) => {
      if (c.url.includes('coach_subscribers')) return { body: [{ ...SUB_ROW, id: SUB_ID }] };
      if (c.method === 'GET' && c.url.includes('coach_goals')) {
        // What bless reads: the OLD text.
        return { body: [{ subscriber_id: SUB_ID, week_index: 0, text: 'old text', blessed: false, set_at_ms: '1' }] };
      }
      if (c.method === 'PATCH' && c.url.includes('coach_goals')) {
        // The conditional WHERE (text=eq.'old text') matches nothing because
        // a concurrent `set` already changed the row to 'new text'.
        return { body: [] };
      }
      return { body: null };
    };
    const res = await post({ action: 'bless', endpoint: ENDPOINT });
    expect(res.status).toBe(409);
  });
});

describe('GET /api/push/goal', () => {
  it('rejects a missing endpoint cleanly', async () => {
    const res = await GET({ url: new URL('https://x/api/push/goal') } as any);
    expect(res.status).toBe(400);
  });
});
