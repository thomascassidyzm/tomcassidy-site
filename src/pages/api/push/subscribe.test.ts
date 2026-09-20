import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Route-level tests for the anonymous subscription endpoint's SSRF allowlist
// (claim 3) and its validation/throttle (claim 4).
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';

const { POST, isAllowedPushEndpoint } = await import('./subscribe');

let calls: Array<{ url: string; method: string }> = [];

function fakeFetch(url: string, init: any = {}) {
  calls.push({ url, method: init.method ?? 'GET' });
  return Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(''),
  } as Response);
}

beforeEach(() => {
  calls = [];
  vi.stubGlobal('fetch', fakeFetch as unknown as typeof fetch);
});
afterEach(() => vi.unstubAllGlobals());

function req(body: unknown, ip = '203.0.113.1') {
  return POST({
    request: new Request('https://x/api/push/subscribe', {
      method: 'POST',
      headers: { 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    }),
  } as any);
}

const validSub = {
  subscription: {
    endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
    keys: { p256dh: 'p'.repeat(87), auth: 'a'.repeat(22) },
  },
};

describe('isAllowedPushEndpoint (claim 3 — SSRF allowlist)', () => {
  it('accepts the real browser push services', () => {
    expect(isAllowedPushEndpoint('https://fcm.googleapis.com/fcm/send/x')).toBe(true);
    expect(isAllowedPushEndpoint('https://updates.push.services.mozilla.com/wpush/v2/x')).toBe(true);
    expect(isAllowedPushEndpoint('https://web.push.apple.com/x')).toBe(true);
    expect(isAllowedPushEndpoint('https://wns2-abc.notify.windows.com/x')).toBe(true);
  });

  it('rejects an attacker-chosen internal/arbitrary host', () => {
    expect(isAllowedPushEndpoint('https://169.254.169.254/latest/meta-data')).toBe(false);
    expect(isAllowedPushEndpoint('https://internal.evil.example/collect')).toBe(false);
    // Not fooled by a lookalike suffix without the dot boundary.
    expect(isAllowedPushEndpoint('https://evilfcm.googleapis.com.attacker.example/x')).toBe(false);
  });

  it('rejects non-https', () => {
    expect(isAllowedPushEndpoint('http://fcm.googleapis.com/fcm/send/x')).toBe(false);
  });
});

describe('POST /api/push/subscribe — SSRF allowlist wired into the route', () => {
  it('stores a real push-service endpoint', async () => {
    const res = await req(validSub);
    expect(res.status).toBe(200);
  });

  it('refuses an arbitrary attacker-chosen endpoint rather than storing it for the cron to later fetch', async () => {
    const res = await req({
      subscription: { endpoint: 'https://internal-service.local/admin', keys: { p256dh: 'p', auth: 'a' } },
    });
    expect(res.status).toBe(400);
    // Never even reached the store.
    expect(calls.length).toBe(0);
  });
});

describe('POST /api/push/subscribe — validation (claim 4)', () => {
  it('rejects a non-string endpoint (JSON null-shaped payloads) instead of storing it', async () => {
    const res = await req({ subscription: { endpoint: null, keys: { p256dh: 'p', auth: 'a' } } });
    expect(res.status).toBe(400);
  });

  it('rejects an oversized endpoint', async () => {
    const res = await req({
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/' + 'x'.repeat(3000),
        keys: { p256dh: 'p', auth: 'a' },
      },
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/push/subscribe — throttle (claim 4)', () => {
  it('caps anonymous subscription creation per IP', async () => {
    const ip = '198.51.100.7';
    let last;
    for (let i = 0; i < 25; i++) {
      last = await req(validSub, ip);
    }
    expect(last!.status).toBe(429);
  });
});
