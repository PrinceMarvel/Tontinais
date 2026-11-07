/**
 * @file sw.js
 * @description Service Worker haute performance pour TontiNaïs : Stale-While-Revalidate & Timeout réseau 3s.
 */

const CACHE_NAME = 'tontinais-cache-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Installation rapide et activation immédiate
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

// Purge instantanée de toutes les versions de cache obsolètes
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

// Helper pour timeout réseau (évite les blocages sur 3G/4G lente)
const timeoutFetch = (request, ms = 3000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network timeout')), ms);
    fetch(request)
      .then((res) => { clearTimeout(timer); resolve(res); })
      .catch((err) => { clearTimeout(timer); reject(err); });
  });
};

// Stratégie de mise en cache intelligente
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclure les appels API, non-GET et schémas non HTTP
  if (
    url.pathname.startsWith('/api') ||
    event.request.method !== 'GET' ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // 1. Navigation HTML : Network First avec timeout de 3s et secours immédiat sur le cache
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      timeoutFetch(event.request, 3000)
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
          return fallback || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // 2. Fichiers statiques (JS, CSS, polices, SVG, images) : Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      // Si présent dans le cache, retour immédiat (0ms de latence sur smartphone)
      return cachedResponse || fetchPromise.then((res) => res || new Response('', { status: 408 }));
    })
  );
});
