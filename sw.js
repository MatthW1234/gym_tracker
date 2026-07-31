const CACHE = "iron-log-v2";
const ASSETS = [
  "./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./vendor/react.production.min.js",
  "./vendor/react-dom.production.min.js",
  "./vendor/babel.min.js",
  "./vendor/html5-qrcode.min.js",
  "./vendor/fonts/bebas-neue-latin-400-normal.woff2",
  "./vendor/fonts/inter-latin-400-normal.woff2",
  "./vendor/fonts/inter-latin-500-normal.woff2",
  "./vendor/fonts/inter-latin-600-normal.woff2",
  "./vendor/fonts/inter-latin-700-normal.woff2",
  "./vendor/fonts/ibm-plex-mono-latin-400-normal.woff2",
  "./vendor/fonts/ibm-plex-mono-latin-500-normal.woff2",
  "./vendor/fonts/ibm-plex-mono-latin-600-normal.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
