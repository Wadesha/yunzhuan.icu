// PWA Service Worker Registration

(function() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').then(
                function(registration) {
                    console.log('PWA: ServiceWorker registered');
                    registration.onupdatefound = function() {
                        const newWorker = registration.installing;
                        newWorker.onstatechange = function() {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                if (confirm('New version available! Refresh to update?')) {
                                    window.location.reload();
                                }
                            }
                        };
                    };
                },
                function(err) {
                    console.warn('PWA: ServiceWorker registration failed:', err);
                }
            );
        });
    }
})();
