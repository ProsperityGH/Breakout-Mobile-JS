// 1. Save the files to the user's device
// The "install" event is called when the ServiceWorker starts up.
// All ServiceWorker code must be inside events.
self.addEventListener('install', function(e) {
  console.log('install');
    
  // waitUntil tells the browser that the install event is not finished until we have
  // cached all of our files
  e.waitUntil(
    // Here we call our cache "myonsenuipwa", but you can name it anything unique
    caches.open('myonsenuipwa').then(cache => {
      // If the request for any of these resources fails, _none_ of the resources will be
      // added to the cache.
      return cache.addAll([
        'https://prosperous.dev/breakout/',
        'https://prosperous.dev/breakout/index.html',
        'https://prosperous.dev/breakout/assets/css/style.css',
        'https://prosperous.dev/breakout/assets/js/script.js',
        'https://prosperous.dev/breakout/manifest.json',
      ]);
    })
  );
});

// 2. Intercept requests and return the cached version instead
self.addEventListener('fetch', function(e) {
  e.respondWith(
    // check if this file exists in the cache
    caches.match(e.request)
      // Return the cached file, or else try to get it from the server
      .then(response => response || fetch(e.request))
  );

  navigator.serviceWorker.register('/service-worker.js', {
    scope: '/breakout/'
  });
});