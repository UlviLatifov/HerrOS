// ══ HerrOS Service Worker ══════════════════
const CACHE = 'herros-v1';
const FILES = ['/'];

// Quraşdırma — əsas faylı keşlə
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// Aktivləşmə — köhnə keşi təmizlə
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Sorğu — əvvəlcə şəbəkə, olmasa keş
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) {
          c.put(e.request, copy);
        });
        return res;
      })
      .catch(function () {
        return caches.match(e.request);
      })
  );
});
