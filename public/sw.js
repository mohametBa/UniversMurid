const CACHE_NAME = 'khassida-v2';
const urlsToCache = [
  '/',
  '/audio',
  '/khassida',
  '/langues',
  '/partager',
  '/contact',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/LogoUm.png',
  '/khassaid.png',
  '/Serigne.png',
  '/serigneTouba.png',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🔧 Service Worker - Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('❌ Erreur lors de l\'ouverture du cache:', error);
      })
  );
  self.skipWaiting();
});

// Récupération des ressources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la ressource depuis le cache si elle existe
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Mise à jour du cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});