/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "anatomy-explorer-v1"
const OFFLINE_URL = "/offline"

// Add list of URLs to cache on install
const urlsToCache = ["/", "/offline", "/favicon.ico", "/logo.png", "/app/globals.css"]

// Install event - cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
            return null
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // For HTML requests, try the network first, fall back to cache, finally the offline page
if (event.request.headers.get("Accept")?.includes("text/html")) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response; // ALWAYS Response
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached; // Response

        const offlineFallback = await caches.match(OFFLINE_URL);
        if (offlineFallback) return offlineFallback; // Response

        // Last resort: return a dummy Response
        return new Response("Offline", {
          headers: { "Content-Type": "text/html" },
          status: 200,
        });
      })
  );
  return;
}


  // For non-HTML requests, try the cache first, fall back to the network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((response) => {
          // Cache the response
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
      )
    }),
  )
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

export {}

