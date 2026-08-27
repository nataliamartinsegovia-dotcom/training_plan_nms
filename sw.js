const CACHE = 'nms-training-v3';
const ASSETS = [
  '/training_plan_nms/',
  '/training_plan_nms/index.html',
  '/training_plan_nms/manifest.json',
  '/training_plan_nms/icon192.png',
  '/training_plan_nms/icon512.png',
  '/training_plan_nms/logotipo-pauta.svg',
  '/training_plan_nms/logotipo-pauta-inv.svg',
  '/training_plan_nms/favicon.svg',
  '/training_plan_nms/tokens.css'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isHTML = e.request.mode === 'navigate' ||
                 url.pathname.endsWith('.html') ||
                 url.pathname === '/training_plan_nms/' ||
                 url.pathname === '/training_plan_nms';

  if (isHTML) {
    // Network-first: always load fresh app code, fall back to cache when offline
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for static assets: fast loads, background update
    e.respondWith(
      caches.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
        return cached || network;
      })
    );
  }
});
