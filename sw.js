// Service Worker - SGD CLUB ATLETICO EXCURSIONISTAS
// Generado por SGD Instalador

var VERSION = 'sgd-v1';

var scope = self.registration.scope;
var APP = scope.includes('datos') ? 'datos' : scope.includes('profes') ? 'profes' : 'admin';
var CACHE_NAME = 'sgd-' + APP + '-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      var assets = [
        'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap'
      ];
      if (APP === 'admin')  assets.push('./admin.html');
      if (APP === 'profes') assets.push('./profes.html');
      if (APP === 'datos')  assets.push('./datos.html');
      return cache.addAll(assets).catch(function(e){ console.log('Cache:', e); });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('script.google.com')) return;
  if (e.request.url.includes('script.googleusercontent.com')) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(e.request, clone); });
        return response;
      }).catch(function(){ return cached; });
    })
  );
});
