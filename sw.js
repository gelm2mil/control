const CACHE_NAME = "gelm-control-v3";

const FILES_TO_CACHE = [
  "/control/",
  "/control/consignacion_pwa.html",
  "/control/index.html",
  "/control/styles.css",
  "/control/manifest-consignacion.json",
  "/control/icons/icon-192.png",
  "/control/icons/icon-512.png"
];

// INSTALACIÓN
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .catch(err => console.error("Cache error:", err))
  );
  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // fallback simple
        if (event.request.mode === "navigate") {
          return caches.match("/control/consignacion_pwa.html");
        }
      });
    })
  );
});
