const CACHE_NAME = 'rifa-generator-v1';
const ASSETS_TO_CACHE = [
  '/generadorlinda/',
  '/generadorlinda/index.html',
  '/generadorlinda/style.css',
  '/generadorlinda/script.js',
  '/generadorlinda/icon-192.png',
  '/generadorlinda/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
