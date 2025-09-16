// Service Worker for PWA functionality
const CACHE_NAME = 'wayne-ai-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/pages/auth.html',
    '/pages/mainchat.html',
    '/pages/settings.html',
    '/pages/docs.html',
    '/pages/about.html',
    '/css/main.css',
    '/css/setting.css',
    '/css/docs.css',
    '/css/about.css',
    '/js/main.js',
    '/js/setting.js',
    '/js/docs.js',
    '/js/about.js',
    '/js/utils.js',
    '/js/auth.js',
    '/js/api.js',
    '/js/chat.js',
    '/assets/logo/wayne-ai-logo.svg'
];

// Install the service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request because it's a stream and can only be consumed once
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response because it's a stream and can only be consumed once
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Update the service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle push notifications
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const title = data.title || 'Wayne AI';
        const options = {
            body: data.body || 'You have a new message',
            icon: '/assets/logo/wayne-ai-logo.svg',
            badge: '/assets/logo/wayne-ai-logo.svg',
            data: {
                url: data.url || '/'
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

// Handle notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});