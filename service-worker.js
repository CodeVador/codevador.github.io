const cacheName = 'SW-v1.0.3';

const cacheAssets = [
    './',
    './icons/manifest-icon-192.maskable.png',
    './icons/manifest-icon-512.maskable.png',
    './favicon.ico',
    './index.html',
    './logo.png',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js'
];

// Call Install Event.
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('[Service Worker] Caching all content');
            return cache.addAll(cacheAssets);
        })
    );
});

// Call Activate Event.
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('[Service Worker] Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Call Fetch Event. Using stale while revalidate strategy.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(response => {
                console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
                const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                        console.log(`[Service Worker] Network resource: ${event.request.url}`);
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    })
                return response || fetchPromise;
            })
        })
    );
});
