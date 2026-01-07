const CACHE_NAME = "gelm-control-v4";

/* ⚠️ SOLO ARCHIVOS LOCALES, NADA EXTERNO */
const FILES_TO_CACHE = [
  "/control/consignacion_pwa.html",
  "/control/styles.css",
  "/control/manifest-consignacion.json",
  "/control/icons/icon-192.png",
  "/control/icons/icon-512.png"
];

/* ===== INSTALACIÓN ===== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

/* ===== ACTIVACIÓN ===== */
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

/* ===== FETCH ===== */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
