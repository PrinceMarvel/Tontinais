/**
 * @file sw.js
 * @description Service Worker résilient pour TontiNaïs PWA : Network First universel et purge automatique des caches.
 */

const CACHE_NAME = 'tontinais-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Installation du Service Worker et pré-mise en cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pré-mise en cache partielle :', err);
      });
    })
  );
  self.skipWaiting();
});

// Activation et purge immédiate de TOUTES les versions antérieures de cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie réseau : Network First systématique pour garantir la fraîcheur des scripts et images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne pas intercepter les requêtes API, non-GET ou protocoles spécifiques (data:, blob:)
  if (
    url.pathname.startsWith('/api') ||
    event.request.method !== 'GET' ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // Navigation HTML principale : Network First avec secours sur index.html en cache
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const fallback = (await caches.match('/index.html')) || (await caches.match('/'));
          return fallback;
        })
    );
    return;
  }

  // Fichiers statiques et médias : Network First avec secours sur le cache local
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        return new Response('', { status: 408, statusText: 'Offline asset' });
      })
  );
});
