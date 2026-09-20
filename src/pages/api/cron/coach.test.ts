import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Route-level test for claim 1: an unset CRON_SECRET must fail CLOSED, not
// let an unauthenticated GET trigger a send to every subscriber.
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
process.env.VAPID_PUBLIC_KEY = 'pub';
process.env.VAPID_PRIVATE_KEY = 'priv';

vi.mock('web-push', () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(async () => ({ statusCode: 201 })),
  },
}));

let calls: Array<{ url: string; method: string }> = [];

function fakeFetch(url: string, init: any = {}) {
  calls.push({ url, method: init.method ?? 'GET' });
  // One live subscriber, so a successful (mis-)auth would actually attempt a send.
  const body = url.includes('coach_subscribers')
    ? [
        {
          id: 'a'.repeat(32),
          endpoint: 'https://fcm.googleapis.com/fcm/send/x',
          p256dh: 'p',
          auth: 'a',
          program_slug: 'reasonable-eating',
          start_ms: '1750000000000',
          last_sent_at: null,
          last_status: null,
          fail_count: 0,
          revoked_at: null,
        },
      ]
    : [];
  return Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);
}

beforeEach(() => {
  calls = [];
  delete process.env.CRON_SECRET;
  vi.stubGlobal('fetch', fakeFetch as unknown as typeof fetch);
});
afterEach(() => vi.unstubAllGlobals());

describe('GET /api/cron/coach — fail closed on a missing CRON_SECRET (claim 1)', () => {
  it('refuses to run at all when CRON_SECRET is not configured, even with no Authorization header', async () => {
    const { GET } = await import('./coach');
    const res = await GET({ request: new Request('https://x/api/cron/coach') } as any);
    expect(res.status).toBe(503);
    // Never even listed subscribers, let alone sent to one.
    expect(calls.some((c) => c.url.includes('coach_subscribers'))).toBe(false);
  });

  it('still runs normally once CRON_SECRET is set and the header matches', async () => {
    process.env.CRON_SECRET = 'the-real-secret';
    const { GET } = await import('./coach');
    const res = await GET({
      request: new Request('https://x/api/cron/coach', {
        headers: { authorization: 'Bearer the-real-secret' },
      }),
    } as any);
    expect(res.status).toBe(200);
    delete process.env.CRON_SECRET;
  });
});
