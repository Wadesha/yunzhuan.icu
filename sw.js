// Service Worker for yunzhuan.icu
// Offline-first caching strategy

const CACHE_NAME = 'yunzhuan-v17-4-0';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/search.html',
    '/manifest.json',
    '/css/theme.css',
    '/js/theme.js',
    '/js/mobile-nav.js',
    '/js/breadcrumbs.js',
    '/search-index.json',
    '/salary.html',
    '/rankings.html',
    '/faq.html',
    '/glossary.html',
    '/guides/index.html',
    '/schools/index.html',
    '/tests/index.html',
    '/essays/index.html',
    '/scholarships/index.html',
    '/interviews/index.html',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(PRECACHE_URLS).catch(function() {
                return Promise.all(
                    PRECACHE_URLS.map(function(url) {
                        return cache.add(url).catch(function() {
                            console.log('Failed to pre-cache:', url);
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
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function(name) {
                        return name !== CACHE_NAME;
                    })
                    .map(function(name) {
                        return caches.delete(name);
                    })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    const request = event.request;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (url.pathname.startsWith('/api/')) return;
    if (url.pathname.startsWith('/search-index.json')) {
        event.respondWith(
            fetch(request).then(function(response) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(request, clone);
                });
                return response;
            }).catch(function() {
                return caches.match(request);
            })
        );
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(request, clone);
                    });
                    return response;
                })
                .catch(function() {
                    return caches.match(request).then(function(cached) {
                        return cached || caches.match('/index.html');
                    });
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(function(cached) {
            if (cached) {
                fetch(request).then(function(response) {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(request, clone);
                        });
                    }
                }).catch(function() {});
                return cached;
            }
            return fetch(request).then(function(response) {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(request, clone);
                    });
                }
                return response;
            }).catch(function() {
                return cached;
            });
        })
    );
});
