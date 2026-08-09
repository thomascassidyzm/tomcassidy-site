import type { APIRoute } from 'astro';
import type { WeeklyGoal } from '@/lib/coach-engine';
import { canPersist, currentGoal, currentWeekIndex, saveGoal } from '@/lib/push-store';

// The one thing you said you'd do this week — captured, then blessed.
//
// Two writes, deliberately separate:
//   { action: 'set', text }  → stores it UNBLESSED. Nothing will ever push this.
//   { action: 'bless' }      → blesses whatever is stored, verbatim.
//
// `bless` sends no text on purpose: the server blesses the exact string it
// already holds, so what gets confirmed and what gets pushed cannot diverge.
//
// SOLO DOGFOOD — one user, no accounts, no auth beyond the site itself.
export const prerender = false;

export const GET: APIRoute = async () => {
  return json({ goal: await currentGoal(), canPersist: canPersist() }, 200);
};

export const POST: APIRoute = async ({ request }) => {
  let body: { action?: string; text?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const wi = await currentWeekIndex();

  let goal: WeeklyGoal;
  if (body.action === 'set') {
    const text = (body.text ?? '').trim();
    if (!text) return json({ error: 'Say the one thing first.' }, 400);
    if (text.length > 280) return json({ error: 'One sentence is plenty — keep it under 280.' }, 400);
    goal = { text, blessed: false, weekIndex: wi, setAtMs: Date.now() };
  } else if (body.action === 'bless') {
    const existing = await currentGoal();
    if (!existing) return json({ error: 'Nothing to confirm for this week.' }, 409);
    goal = { ...existing, blessed: true };
  } else {
    return json({ error: 'Unknown action' }, 400);
  }

  if (canPersist()) {
    try {
      await saveGoal(goal);
      return json({ ok: true, persisted: 'kv', goal }, 200);
    } catch (e) {
      console.error('Goal: KV write failed', e);
      return json({ error: 'Could not store the goal' }, 500);
    }
  }

  // No KV — nothing can be written at runtime. Say so honestly and hand back the
  // exact env value to paste, the way subscribe does.
  console.log('[pocket-coach] WEEKLY_GOAL=', JSON.stringify(goal));
  return json(
    {
      ok: true,
      persisted: 'manual',
      goal,
      paste: { WEEKLY_GOAL: JSON.stringify(goal) },
    },
    200,
  );
};

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
