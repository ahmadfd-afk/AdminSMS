/* ════════════════════════════════════════════════════════════════════════
   SMS Santri Lite — Service Worker (PWA)
   Version: 1.0.0
   - App shell: cache-first
   - CDN scripts (localforage, html5-qrcode, JsBarcode, FontAwesome, qrcodejs):
     network-first, fallback to cache when offline
   - Supabase /rest/v1/: NEVER cached (always network)
   ════════════════════════════════════════════════════════════════════════ */

const SW_VERSION = 'sms-santri-lite-v1.0.0';
const APP_SHELL_CACHE = `${SW_VERSION}-shell`;
const CDN_CACHE = `${SW_VERSION}-cdn`;

// Local app shell files (precached on install)
const APP_SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

// CDN origins that we are allowed to cache
const CDN_ORIGINS = [
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'cdn.jsdelivr.net'
];

// Domains we must NEVER cache (auth/API/cloud)
function isSupabaseRequest(url) {
  return url.includes('/rest/v1/') ||
         url.includes('supabase.co') ||
         url.includes('supabase.io') ||
         url.includes('/auth/v1/') ||
         url.includes('/storage/v1/');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      // Use addAll but tolerate individual failures
      return Promise.all(
        APP_SHELL_FILES.map((file) =>
          cache.add(file).catch((err) => console.warn('[SW] Failed to cache', file, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== APP_SHELL_CACHE && key !== CDN_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache Supabase / API calls — always network
  if (isSupabaseRequest(req.url)) {
    event.respondWith(fetch(req).catch(() =>
      new Response(JSON.stringify({ error: 'offline' }), {
        status: 503, headers: { 'Content-Type': 'application/json' }
      })
    ));
    return;
  }

  // CDN scripts: network-first, fallback to cache
  if (CDN_ORIGINS.includes(url.hostname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CDN_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || new Response('', { status: 504 })))
    );
    return;
  }

  // App shell & same-origin: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(APP_SHELL_CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() =>
        caches.match('./index.html').then((fallback) =>
          fallback || new Response('Offline', { status: 503 })
        )
      );
    })
  );
});

// Allow page to trigger immediate skipWaiting on update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
