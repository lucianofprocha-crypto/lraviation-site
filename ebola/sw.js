/* LR Aviation · US Ebola Attestation — offline cache */
const CACHE = 'lr-ebola-v1.1.0';
const ASSETS = ['./', 'index.html', 'app.js', 'i18n.js', 'manifest.webmanifest', 'cdc-attestation-form.pdf',
  'gendec.js', 'vendor/pdf-lib.min.js', 'vendor/pdf.min.js', 'vendor/pdf.worker.min.js', 'vendor/jsQR.js', 'vendor/qrcode.js', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('lr-ebola-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// cache-first, refresh in background
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
