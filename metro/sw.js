const CACHE = 'lr-metro-site-v2';
const ICAO = ['KTEB','KHPN','KMMU','KFRG','KISP','KSWF','KJFK','KEWR','KLGA'];
const FILES = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png']
  .concat(ICAO.map(i => './cbp/CBP-' + i + '-fact-sheet.jpg'));
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('lr-metro-site') && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request)));
});
