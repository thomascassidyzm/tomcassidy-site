import { describe, it, expect, vi } from 'vitest';
import { isGone, payloadFor, runSends, type RunDeps } from '@/lib/coach-run';
import type { Subscriber } from '@/lib/push-store';

// The delivery loop, without a phone in sight. What matters here is that each
// person gets THEIR week and THEIR words, and that a dead device is pruned
// rather than taking the run down with it.

const WEEK = 7 * 86_400_000;

function sub(over: Partial<Subscriber> = {}): Subscriber {
  return {
    id: 'a'.repeat(32),
    endpoint: 'https://push.example/a',
    p256dh: 'p',
    auth: 'a',
    programSlug: 'reasonable-eating',
    startMs: 1_750_000_000_000,
    lastSentAt: null,
    lastStatus: null,
    failCount: 0,
    revokedAt: null,
    ...over,
  };
}

describe('payloadFor', () => {
  it('gives two subscribers different weeks from their own start dates', () => {
    const now = 1_750_000_000_000 + 5 * WEEK;
    const tom = payloadFor(sub(), null, now);
    const stranger = payloadFor(sub({ id: 'b', startMs: now }), null, now);
    expect(tom.weekIndex).toBe(5);
    expect(stranger.weekIndex).toBe(0);
    // Different weeks of the rotation, so different focuses.
    expect(tom.line.week).not.toBe(stranger.line.week);
  });

  it('pushes their own blessed words, verbatim, when the goal is for the week they are on', () => {
    const now = 1_750_000_000_000 + 2 * WEEK;
    const out = payloadFor(
      sub(),
      { text: 'walk after lunch', blessed: true, weekIndex: 2, setAtMs: 1 },
      now,
    );
    expect(out.line.source).toBe('goal');
    expect(JSON.parse(out.payload).body).toBe('walk after lunch');
  });

  it('ignores an unblessed goal, and one left over from a previous week', () => {
    const now = 1_750_000_000_000 + 2 * WEEK;
    expect(
      payloadFor(sub(), { text: 'x', blessed: false, weekIndex: 2, setAtMs: 1 }, now).line.source,
    ).toBe('bank');
    expect(
      payloadFor(sub(), { text: 'x', blessed: true, weekIndex: 1, setAtMs: 1 }, now).line.source,
    ).toBe('bank');
  });

  it('resolves each row’s own programme by slug, and lands the tap on that programme', () => {
    const out = payloadFor(sub({ programSlug: 'reasonable-teaching' }), null, Date.now());
    expect(out.program.slug).toBe('reasonable-teaching');
    expect(JSON.parse(out.payload).url).toContain('/reasonable-teaching#week-');
  });

  it('falls back to Reasonable Eating on an unknown slug rather than dropping the person', () => {
    const out = payloadFor(sub({ programSlug: 'not-a-programme' }), null, Date.now());
    expect(out.program.slug).toBe('reasonable-eating');
  });
});

describe('isGone', () => {
  it('is 404 and 410 and nothing else', () => {
    expect(isGone(404)).toBe(true);
    expect(isGone(410)).toBe(true);
    expect(isGone(429)).toBe(false);
    expect(isGone(500)).toBe(false);
    expect(isGone(null)).toBe(false);
  });
});

function deps(send: RunDeps['send']) {
  const marked: Array<[string, number | null, boolean]> = [];
  const revoked: Array<[string, number | null]> = [];
  return {
    marked,
    revoked,
    d: {
      send,
      markSent: async (id, s, ok) => void marked.push([id, s, ok]),
      revoke: async (id, s) => void revoked.push([id, s]),
    } as RunDeps,
  };
}

describe('runSends', () => {
  it('sends to everyone and records every attempt', async () => {
    const subs = [sub({ id: '1' }), sub({ id: '2' }), sub({ id: '3' })];
    const { d, marked } = deps(async () => 201);
    const out = await runSends(subs, d);
    expect(out).toEqual({ attempted: 3, sent: 3, pruned: 0, failed: 0 });
    expect(marked.map((m) => m[0])).toEqual(['1', '2', '3']);
    expect(marked.every((m) => m[1] === 201 && m[2] === true)).toBe(true);
  });

  it('a 410 prunes that one row and everybody else still gets their push', async () => {
    const subs = [sub({ id: 'live-1' }), sub({ id: 'dead' }), sub({ id: 'live-2' })];
    const { d, revoked, marked } = deps(async (s) => {
      if (s.id === 'dead') throw { statusCode: 410 };
      return 201;
    });
    const out = await runSends(subs, d);
    expect(out).toEqual({ attempted: 3, sent: 2, pruned: 1, failed: 0 });
    expect(revoked).toEqual([['dead', 410]]);
    expect(marked.map((m) => m[0]).sort()).toEqual(['live-1', 'live-2']);
  });

  it('a transient failure is recorded but NOT revoked — it retries next cron', async () => {
    const { d, revoked, marked } = deps(async () => {
      throw { statusCode: 500 };
    });
    const out = await runSends([sub({ id: 'x' })], d);
    expect(out).toEqual({ attempted: 1, sent: 0, pruned: 0, failed: 1 });
    expect(revoked).toEqual([]);
    expect(marked).toEqual([['x', 500, false]]);
  });

  it('one hanging endpoint cannot stall the others in a later chunk', async () => {
    // Twenty-five subscribers, chunks of ten: a rejection in chunk one must not
    // stop chunks two and three from being attempted.
    const subs = Array.from({ length: 25 }, (_, i) => sub({ id: `s${i}` }));
    const { d } = deps(async (s) => {
      if (s.id === 's3') throw { statusCode: 410 };
      if (s.id === 's4') throw new Error('network went sideways');
      return 201;
    });
    const out = await runSends(subs, d);
    expect(out.attempted).toBe(25);
    expect(out.sent).toBe(23);
    expect(out.pruned).toBe(1);
    expect(out.failed).toBe(1);
  });

  it('counts a row whose bookkeeping also fails as failed rather than losing it', async () => {
    const out = await runSends([sub({ id: 'x' })], {
      send: async () => 201,
      markSent: async () => {
        throw new Error('database gone');
      },
      revoke: async () => {},
    });
    expect(out).toEqual({ attempted: 1, sent: 0, pruned: 0, failed: 1 });
  });

  it('an empty list is a no-op, not an error', async () => {
    const { d } = deps(async () => 201);
    expect(await runSends([], d)).toEqual({ attempted: 0, sent: 0, pruned: 0, failed: 0 });
  });
});
