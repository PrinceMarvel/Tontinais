/**
 * @file sw.js
 * @description Service Worker résilient pour TontiNaïs (v5) : Stale-While-Revalidate, Cache First assets & Timeout mobile 2.5s.
 */

const CACHE_NAME = 'tontinais-cache-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Installation rapide et pré-mise en cache du shell applicatif
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

// Purge instantanée de toutes les anciennes versions de cache
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

// Helper avec timeout réseau pour éviter les blocages sur 3G/4G lente
const timeoutFetch = (request, ms = 2500) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network timeout')), ms);
    fetch(request)
      .then((res) => { clearTimeout(timer); resolve(res); })
      .catch((err) => { clearTimeout(timer); reject(err); });
  });
};

// Stratégie de mise en cache adaptée aux forfaits mobiles réduits
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclure les requêtes d'API, non-GET et schémas non HTTP
  if (
    url.pathname.startsWith('/api') ||
    event.request.method !== 'GET' ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // 1. Navigation HTML : Network First rapide (2.5s) avec repli immédiat sur le cache hors-ligne
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      timeoutFetch(event.request, 2500)
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

  // 2. Fichiers statiques (JS, CSS, SVG, polices) : Cache First & mise à jour en arrière-plan
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = timeoutFetch(event.request, 5000)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      // Si déjà en cache, restitution immédiate à 0ms pour préserver le forfait data (100 Mo)
      return cachedResponse || fetchPromise.then((res) => res || new Response('', { status: 408 }));
    })
  );
});
