// Practice Center Service Worker - cache-first strategy
const CACHE_NAME = 'practice-center-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './manifest.json',
  '../../js/practice-engine.js',
  '../../js/app-data.js',
  '../../js/syllabus-data.js',
  '../../favicon.svg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_ASSETS).catch(function() {
        return Promise.all(
          CORE_ASSETS.map(function(url) {
            return cache.add(url).catch(function() {
              console.log('SW: Failed to cache:', url);
            });
          })
        );
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) {
          return caches.delete(k);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) return cached;
      return fetch(request).then(function(response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match('./index.html');
      });
    })
  );
});