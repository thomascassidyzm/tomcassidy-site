// /writing-index.json — the full-text body index, built at build time and
// served as a static file. The /writing page fetches it once and matches
// against it in the browser: no server, no search service.
//
// It lives out here rather than inline on the page because the bodies are
// ~181KB of prose; inlining them would take /writing/index.html from 34KB to
// roughly 205KB, paid by every visitor whether they search or not.

import type { APIRoute } from 'astro';
import { buildBodyIndex } from '@/lib/search-index';

export const prerender = true;

export const GET: APIRoute = async () => {
  const index = await buildBodyIndex();
  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
