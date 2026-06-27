import type { APIRoute } from 'astro';

// Hands the browser the VAPID PUBLIC key so it can build a push subscription.
// Public by design — only the private key is a secret. SSR-only.
export const prerender = false;

export const GET: APIRoute = () => {
  const key = import.meta.env.VAPID_PUBLIC_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'Push not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ publicKey: key }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
