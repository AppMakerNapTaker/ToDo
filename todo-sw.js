const CACHE_NAME = 'tasks-v4';
const FILES_TO_CACHE = [
  './todo.html',
  './todo-manifest.json',
  './todo-icon.svg'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(evt.request).then(response =>
        response || fetch(evt.request).then(networkResponse => {
          cache.put(evt.request, networkResponse.clone());
          return networkResponse;
        })
      )
    )
  );
});
