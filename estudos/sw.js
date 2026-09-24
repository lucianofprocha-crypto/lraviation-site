const CACHE = 'g550-estudos-v3';
const FILES = ['./', './index.html', './content.js', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png',
  './img/cold-weather-ops-1.jpg', './img/cold-weather-ops-2.jpg', './img/cold-weather-ops-3.jpg', './img/cold-weather-ops-4.jpg', './img/cold-weather-ops-5.jpg', './img/flex-takeoff-1.jpg'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(function(r){ return r || fetch(e.request); }));
});
