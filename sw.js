const CACHE_NAME = 'qr-tools-cache-v1';
const urlsToCache = [
  '/',
  '/QR_code_generator_and_QR_decoder-/index.html',
  '/QR_code_generator_and_QR_decoder-/manifest.json',
  '/QR_code_generator_and_QR_decoder-/icon-192.png',
  '/QR_code_generator_and_QR_decoder-/icon-512.png',
  '/QR_code_generator_and_QR_decoder-/style.css',
  '/QR_code_generator_and_QR_decoder-/decoder.css',
  '/QR_code_generator_and_QR_decoder-/qrcode.min.js',
  '/QR_code_generator_and_QR_decoder-/profile.min.js',
  '/QR_code_generator_and_QR_decoder-/index.min.js',
  '/QR_code_generator_and_QR_decoder-/decoder.mi.js',
  '/QR_code_generator_and_QR_decoder-/QR Decoder.html',
  '/QR_code_generator_and_QR_decoder-/profile.html',
  '/QR_code_generator_and_QR_decoder-/screenshot1.png',
  '/QR_code_generator_and_QR_decoder-/screenshot2.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Network-first for navigations, cache-first for others
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/QR_code_generator_and_QR_decoder-/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Optionally return a fallback asset
        return caches.match('/QR_code_generator_and_QR_decoder-/index.html');
      });
    })
  );
});