var CACHE_NAME = 'monaca-website-cache-v1';
var urlsToCache = [
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      Promise.all(
        keys.map(function (key) {
          if (key === CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    }).then(function () {
      console.log('Deleted old caches to update');
      caches.open(CACHE_NAME)
        .then(function (cache) {
          return cache.addAll(urlsToCache);
          console.log('Caches were up to date')
        })
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // DevTools opening will trigger these o-i-c requests, which this SW can't handle.
        // It shouldn't cause any issues, but it causes an error message in console.
        // This is here to get rid of the error message.
        // if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
