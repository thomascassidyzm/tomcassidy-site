import type { APIRoute } from 'astro';
import type { WeeklyGoal } from '@/lib/coach-engine';
import {
  canPersist,
  currentGoal,
  getSubscriberByEndpoint,
  saveGoal,
  weekIndexFor,
  type Subscriber,
} from '@/lib/push-store';

// The one thing you said you'd do this week — captured, then blessed.
//
// Two writes, deliberately separate:
//   { action: 'set', text }  → stores it UNBLESSED. Nothing will ever push this.
//   { action: 'bless' }      → blesses whatever is stored, verbatim.
//
// `bless` sends no text on purpose: the server blesses the exact string it
// already holds, so what gets confirmed and what gets pushed cannot diverge.
//
// Identity is the caller's own push ENDPOINT, which the server hashes to an id.
// Never accept a client-supplied id: an id in the clear would let anyone holding
// one read and rewrite that person's goal.
export const prerender = false;

async function resolve(endpoint: string | null | undefined): Promise<Subscriber | Response> {
  if (!canPersist()) {
    return json({ error: 'The coach store isn’t configured yet, so nothing was saved.' }, 503);
  }
  if (!endpoint) return json({ error: 'Turn the coach on first.' }, 400);
  let sub: Subscriber | null;
  try {
    sub = await getSubscriberByEndpoint(endpoint);
  } catch (e) {
    console.error('[pocket-coach] goal lookup failed', e);
    return json({ error: 'Could not reach the coach store.' }, 500);
  }
  if (!sub) return json({ error: 'Turn the coach on first.' }, 404);
  return sub;
}

export const GET: APIRoute = async ({ url }) => {
  const sub = await resolve(url.searchParams.get('endpoint'));
  if (sub instanceof Response) return sub;
  try {
    return json({ goal: await currentGoal(sub), weekIndex: weekIndexFor(sub) }, 200);
  } catch (e) {
    console.error('[pocket-coach] goal read failed', e);
    return json({ error: 'Could not reach the coach store.' }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: { action?: string; text?: string; endpoint?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const sub = await resolve(body.endpoint);
  if (sub instanceof Response) return sub;

  const wi = weekIndexFor(sub);

  let goal: WeeklyGoal;
  try {
    if (body.action === 'set') {
      const text = (body.text ?? '').trim();
      if (!text) return json({ error: 'Say the one thing first.' }, 400);
      if (text.length > 280) return json({ error: 'One sentence is plenty — keep it under 280.' }, 400);
      goal = { text, blessed: false, weekIndex: wi, setAtMs: Date.now() };
    } else if (body.action === 'bless') {
      const existing = await currentGoal(sub);
      if (!existing) return json({ error: 'Nothing to confirm for this week.' }, 409);
      goal = { ...existing, blessed: true };
    } else {
      return json({ error: 'Unknown action' }, 400);
    }

    await saveGoal(sub.id, goal);
    return json({ ok: true, goal }, 200);
  } catch (e) {
    console.error('[pocket-coach] goal write failed', e);
    return json({ error: 'Could not store the goal — nothing was saved.' }, 500);
  }
};

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
