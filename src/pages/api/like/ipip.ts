import type { APIRoute } from 'astro';
import {
  buildIpipRow, canPersist, insertIpip, isSameOrigin, json, rateLimited, readBody, StoreError,
} from '@/lib/like-store';

// One IPIP row: the 28 responses, 1-5, in ITEMS order, joined to its result row
// ONLY by the random result_key the browser held in memory. Whitelisted exactly
// like the result row; the table's foreign key refuses a key with no result.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!isSameOrigin(request)) return json({ error: 'Forbidden' }, 403);
  const wait = rateLimited(request, 'like-ipip', 4);
  if (wait) return json({ error: 'Too many requests' }, 429, { 'Retry-After': String(wait) });
  const body = await readBody(request);
  if (!body) return json({ error: 'Expected a small JSON object' }, 400);
  const row = buildIpipRow(body);
  if (typeof row === 'string') return json({ error: row }, 400);
  if (!canPersist()) return json({ error: 'The room isn’t configured yet, so nothing was saved.' }, 503);
  try {
    await insertIpip(row);
    return json({ ok: true }, 201);
  } catch (e) {
    const s = e instanceof StoreError ? e.status : 500;
    console.error('[like] ipip insert failed', e instanceof Error ? e.message : 'unknown');
    return json({ error: 'Nothing was saved.' }, s === 409 || s === 400 ? 409 : 500);
  }
};
