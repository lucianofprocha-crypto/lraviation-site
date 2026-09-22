const CACHE = 'oceanic-natla-v9';
const FILES = ['./', './index.html', './oceanic_data.js', './bulletins/checklist-2026-09-18.pdf', './bulletins/2017-004-r2.pdf', './bulletins/2019-003-r5.pdf', './bulletins/2023-001-r6.pdf', './bulletins/2024-001.pdf', './bulletins/2025-001.pdf', './bulletins/2026-001-oesb.pdf', './jspdf.umd.min.js', './jspdf.plugin.autotable.min.js', './manifest.json',
  './icon-180.png', './icon-192.png', './icon-512.png'];
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
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});
