// Service Worker v2 — cache static assets, network-first for API
const CACHE = 'inv-sgc-v2';
const STATIC = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Hapus cache lama
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // JANGAN cache API calls dan CSV exports
  if (url.includes('script.google.com') || url.includes('export?format=csv') ||
      url.includes('openrouter.ai')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Static assets: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
