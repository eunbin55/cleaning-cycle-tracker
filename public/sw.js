self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
    .then(() => self.registration.unregister())
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', () => {
  // Let browser fetch normally, bypassing any caching.
  return;
});
