const CACHE = "sherif-pharmacy-v3";
const IMAGE_ASSETS = [
  "./assets/logo.png",
  "./assets/favicon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/instapay.png",
  "./assets/vodafone.svg",
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(IMAGE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

function isAppShell(url) {
  if (url.origin !== self.location.origin) return false;
  const path = url.pathname;
  return (
    path.endsWith("/") ||
    path.endsWith(".html") ||
    path.endsWith(".css") ||
    path.endsWith(".js") ||
    path.endsWith("manifest.webmanifest") ||
    path.endsWith("sw.js")
  );
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Never serve stale HTML/CSS/JS from cache (Safari is especially sticky)
  if (isAppShell(url)) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" }).catch(() => caches.match(event.request))
    );
    return;
  }

  // Images: cache-first is fine
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
