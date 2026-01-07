const CACHE_NAME = "gelm-control-v5";

const FILES_TO_CACHE = [
  "/control/consignacion_pwa.html",
  "/control/styles.css",
  "/control/manifest-consignacion.json",
  "/control/icons/icon-192.png",
  "/control/icons/icon-512.png"
];

/* ===== INSTALL ===== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

/* ===== ACTIVATE ===== */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ===== FETCH (NETWORK FIRST PARA JS/HTML) ===== */
self.addEventListener("fetch", event => {
  const req = event.request;

  // 🔥 HTML y JS SIEMPRE DESDE RED
  if (req.destination === "document" || req.destination === "script") {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // CSS / ICONOS desde cache
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
