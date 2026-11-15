import type { APIRoute } from 'astro';
import {
  buildResultRow, canPersist, insertResult, isSameOrigin, json, rateLimited, readBody, StoreError,
} from '@/lib/like-store';

// One anonymous result row, sent ONLY when the person ticked "Add my answers to
// the room". The row is rebuilt from a whitelist in like-store.ts: a name, a
// stated placement or any unknown field is dropped, host and day are stamped
// here. Answers 201 with nothing in the body worth keeping; never echoes a row.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOrigin(request)) return json({ error: 'Forbidden' }, 403);
  const wait = rateLimited(request, 'like-result', 6);
  if (wait) return json({ error: 'Too many requests' }, 429, { 'Retry-After': String(wait) });
  const body = await readBody(request);
  if (!body) return json({ error: 'Expected a small JSON object' }, 400);
  const row = buildResultRow(body);
  if (typeof row === 'string') return json({ error: row }, 400);
  if (!canPersist()) return json({ error: 'The room isn’t configured yet, so nothing was saved.' }, 503);
  try {
    await insertResult(row);
    return json({ ok: true }, 201);
  } catch (e) {
    const status = e instanceof StoreError && e.status === 409 ? 409 : 500;
    console.error('[like] result insert failed', e instanceof Error ? e.message : 'unknown');
    return json({ error: 'Nothing was saved.' }, status);
  }
};
