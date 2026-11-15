import type { APIRoute } from 'astro';
import { IPIP_TARGET, canPersist, ipipCount, isSameOrigin, json, rateLimited } from '@/lib/like-store';

// Is the short-questionnaire offer still open? Fewer than IPIP_TARGET rows in
// like_ipip. Answers a yes/no only — never the count, never a row. Asked by the
// page only AFTER a ticked share succeeded.
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!isSameOrigin(request)) return json({ error: 'Forbidden' }, 403);
  const wait = rateLimited(request, 'like-ipip-open', 10);
  if (wait) return json({ error: 'Too many requests' }, 429, { 'Retry-After': String(wait) });
  if (!canPersist()) return json({ error: 'The room isn’t configured yet.' }, 503);
  try {
    return json({ open: (await ipipCount()) < IPIP_TARGET }, 200);
  } catch (e) {
    console.error('[like] ipip count failed', e instanceof Error ? e.message : 'unknown');
    return json({ error: 'Could not tell.' }, 500);
  }
};
