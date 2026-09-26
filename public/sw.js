// Çarpım Tablosu — Service Worker (PWA / çevrimdışı destek)
const CACHE = "carpim-v3";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  var url = new URL(req.url);

  // API isteklerini önbelleğe alma — her zaman ağdan
  if (url.pathname.indexOf("/api/") === 0) return;

  // Sayfa gezinmesi: önce ağ, olmazsa önbellekten (çevrimdışı)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put("/index.html", copy); });
        return r;
      }).catch(function () { return caches.match("/index.html"); })
    );
    return;
  }

  // Diğer varlıklar: önce önbellek, yoksa ağ
  e.respondWith(
    caches.match(req).then(function (r) { return r || fetch(req); })
  );
});
