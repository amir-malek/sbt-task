"use strict";
(() => {
  // worker/manifest.js
  self.__PRECACHE_MANIFEST = [
    {
      "url": "/default-avatar.png",
      "revision": "7d70d0aa"
    },
    {
      "url": "/default-avatar.svg",
      "revision": "bfb19ed7"
    },
    {
      "url": "/file.svg",
      "revision": "d09f9520"
    },
    {
      "url": "/globe.svg",
      "revision": "2aaafa6a"
    },
    {
      "url": "/icon-192x192.png",
      "revision": "7d70d0aa"
    },
    {
      "url": "/icon-512x512.png",
      "revision": "7d70d0aa"
    },
    {
      "url": "/icon.svg",
      "revision": "bc9cf19a"
    },
    {
      "url": "/manifest.json",
      "revision": "a352b8ce"
    },
    {
      "url": "/next.svg",
      "revision": "8e061864"
    },
    {
      "url": "/screenshot-desktop.png",
      "revision": "7d70d0aa"
    },
    {
      "url": "/screenshot-mobile.png",
      "revision": "7d70d0aa"
    },
    {
      "url": "/sw.js",
      "revision": "127f5b58"
    },
    {
      "url": "/vercel.svg",
      "revision": "c0af2f50"
    },
    {
      "url": "/window.svg",
      "revision": "a2760511"
    },
    {
      "url": "/",
      "revision": "ba3988db"
    },
    {
      "url": "/articles",
      "revision": "dba5d918"
    },
    {
      "url": "/offline",
      "revision": "27a21354"
    }
  ];

  // worker/index.js
  var CACHE_VERSION = "blog-pwa-v2.0.0";
  var STATIC_CACHE = `${CACHE_VERSION}-static`;
  var DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
  var API_CACHE = `${CACHE_VERSION}-api`;
  var OFFLINE_CACHE = `${CACHE_VERSION}-offline`;
  self.addEventListener("install", (event) => {
    console.log("Service worker installing...");
    event.waitUntil(
      (async () => {
        try {
          const staticCache = await caches.open(STATIC_CACHE);
          const urlsToCache = self.__PRECACHE_MANIFEST?.map((entry) => entry.url) || [];
          if (urlsToCache.length > 0) {
            await staticCache.addAll(urlsToCache);
            console.log(`Precached ${urlsToCache.length} static assets`);
          }
          const offlineCache = await caches.open(OFFLINE_CACHE);
          try {
            await offlineCache.add("/offline");
            console.log("Offline page cached successfully");
          } catch (error) {
            console.warn("Could not cache offline page:", error);
          }
          self.skipWaiting();
        } catch (error) {
          console.error("Service worker install failed:", error);
        }
      })()
    );
  });
  self.addEventListener("activate", (event) => {
    console.log("Service worker activating...");
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, OFFLINE_CACHE];
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            if (!currentCaches.some((current) => cacheName.startsWith(current.split("-")[0]))) {
              console.log("Deleting old cache:", cacheName);
              await caches.delete(cacheName);
            }
          })
        );
        await self.clients.claim();
        console.log("Service worker activated and took control");
      })()
    );
  });
  self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
      return;
    }
    event.respondWith(handleRequest(request));
  });
  async function handleRequest(request) {
    const url = new URL(request.url);
    try {
      if (request.mode === "navigate") {
        return await handleNavigationRequest(request);
      } else if (url.pathname.startsWith("/api/") || url.origin.includes("realworld.show")) {
        return await handleApiRequest(request);
      } else if (request.destination === "image" || request.destination === "font") {
        return await handleAssetRequest(request);
      } else {
        return await handleStaticRequest(request);
      }
    } catch (error) {
      console.error("Request failed:", request.url, error);
      if (request.mode === "navigate") {
        return await getOfflinePage();
      }
      return new Response("Network Error", {
        status: 503,
        statusText: "Service Unavailable"
      });
    }
  }
  async function handleNavigationRequest(request) {
    console.log("Handling navigation:", request.url);
    try {
      const networkResponse = await Promise.race([
        fetch(request),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Network timeout")), 3e3)
        )
      ]);
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
      throw new Error("Network response not ok");
    } catch (error) {
      console.log("Network failed, trying cache:", error.message);
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log("Serving from cache:", request.url);
        return cachedResponse;
      }
      console.log("Serving offline page fallback");
      return await getOfflinePage();
    }
  }
  async function handleApiRequest(request) {
    console.log("Handling API request:", request.url);
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(API_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log("Serving API from cache:", request.url);
        return cachedResponse;
      }
      throw error;
    }
  }
  async function handleAssetRequest(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      throw error;
    }
  }
  async function handleStaticRequest(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }
  async function getOfflinePage() {
    try {
      const offlineResponse = await caches.match("/offline");
      if (offlineResponse) {
        return offlineResponse;
      }
      return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Blog Platform</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: system-ui; text-align: center; padding: 2rem;">
          <h1>\u{1F4E1} You're offline</h1>
          <p>Your internet connection is unavailable.</p>
          <button onclick="location.reload()">Try Again</button>
        </body>
      </html>
    `, {
        headers: { "Content-Type": "text/html" },
        status: 200
      });
    } catch (error) {
      console.error("Failed to serve offline page:", error);
      return new Response("Offline", { status: 200 });
    }
  }
  self.addEventListener("sync", (event) => {
    console.log("Background sync triggered:", event.tag);
    if (event.tag === "background-sync") {
      event.waitUntil(handleBackgroundSync());
    }
  });
  async function handleBackgroundSync() {
    console.log("Processing background sync...");
  }
  self.addEventListener("message", (event) => {
    const { type, data } = event.data || {};
    switch (type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      case "CACHE_URLS":
        if (data && Array.isArray(data)) {
          event.waitUntil(cacheUrls(data));
        }
        break;
      default:
        console.log("Received message:", event.data);
    }
  });
  async function cacheUrls(urls) {
    try {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.addAll(urls);
      console.log("Manually cached URLs:", urls);
    } catch (error) {
      console.error("Failed to cache URLs:", error);
    }
  }
  console.log("Service Worker loaded successfully!");
})();
//# sourceMappingURL=sw.js.map
