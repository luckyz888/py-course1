// Service Worker: 缓存 Pyodide 文件，加速二次访问
const CACHE_NAME = 'pyodide-cache-v1';
const PYODIDE_PREFIX = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 只缓存 Pyodide 相关文件
  if (url.startsWith(PYODIDE_PREFIX)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
  }
});
