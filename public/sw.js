/**
 * Reasonable Eating — Tier-0 offline service worker.
 *
 * Scope is /reasonable-eating only (registered with an explicit scope), so the
 * rest of the journal is untouched. Strategy: stale-while-revalidate for GET
 * requests — serve instantly from cache, refresh in the background — so once
 * you've opened the programme online, the wheel and its sub-diagrams work on a
 * phone with no network and zero model cost. API calls (/api/*) are never
 * intercepted.
 */
const CACHE = 'reasonable-eating-v1';
// Only non-redirecting static assets are precached. The programme page itself
// is cached at runtime on first visit (stale-while-revalidate below) — which
// avoids addAll() choking on a trailing-slash redirect and still gives full
// offline use after the first online open.
const PRECACHE = [
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never cache or intercept the billed guide endpoint (or any API).
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          // Cache successful basic/cors responses + opaque cross-origin (fonts).
          if (res && (res.ok || res.type === 'opaque')) {
            cache.put(req, res.clone());
          }
          return res;
        })
        .catch(() => cached);
      // Stale-while-revalidate: cached first if present, else wait on network.
      return cached || network;
    }),
  );
});
