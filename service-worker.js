/* =========================================================
   SERVICE WORKER — CONSIGNACIÓN PMT | GELM 2026
   Prioridad: consignacion.html / consignacion_pwa.html
   Seguro para firmas, PDF, Word, Excel
========================================================= */

const CACHE_NAME = "gelm-consignacion-v2";

/* SOLO archivos críticos */
const STATIC_ASSETS = [
  "./",
  "./consignacion.html",
  "./consignacion_pwa.html",
  "./styles.css",
  "./manifest.json",
  "./manifest-consignacion.json"
];

/* ===== INSTALL ===== */
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

/* ===== ACTIVATE ===== */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ===== FETCH ===== */
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  /* ❌ NO tocar generación de archivos ni firmas */
  if (
    req.method !== "GET" ||
    url.protocol === "blob:" ||
    url.protocol === "data:" ||
    url.pathname.endsWith(".pdf") ||
    url.pathname.endsWith(".doc") ||
    url.pathname.endsWith(".docx") ||
    url.pathname.endsWith(".xlsx")
  ) {
    return;
  }

  /* ✅ PRIORIDAD: consignación */
  if (
    url.pathname.endsWith("/consignacion.html") ||
    url.pathname.endsWith("/consignacion_pwa.html")
  ) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  /* ✅ Network first seguro */
  event.respondWith(
    fetch(req)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
