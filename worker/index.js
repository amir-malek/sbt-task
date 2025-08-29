// Manual PWA Service Worker
// No Workbox dependencies - complete control over caching behavior

const CACHE_VERSION = 'blog-pwa-v2.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const OFFLINE_CACHE = `${CACHE_VERSION}-offline`;

// Cache all precached assets on install
self.addEventListener('install', event => {
  console.log('Service worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache static assets from manifest
        const staticCache = await caches.open(STATIC_CACHE);
        const urlsToCache = self.__PRECACHE_MANIFEST?.map(entry => entry.url) || [];
        
        if (urlsToCache.length > 0) {
          await staticCache.addAll(urlsToCache);
          console.log(`Precached ${urlsToCache.length} static assets`);
        }
        
        // Ensure offline page is cached
        const offlineCache = await caches.open(OFFLINE_CACHE);
        try {
          await offlineCache.add('/offline');
          console.log('Offline page cached successfully');
        } catch (error) {
          console.warn('Could not cache offline page:', error);
        }
        
        // Force activation
        self.skipWaiting();
        
      } catch (error) {
        console.error('Service worker install failed:', error);
      }
    })()
  );
});

// Take control and clean up old caches
self.addEventListener('activate', event => {
  console.log('Service worker activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, OFFLINE_CACHE];
      
      await Promise.all(
        cacheNames.map(async cacheName => {
          if (!currentCaches.some(current => cacheName.startsWith(current.split('-')[0]))) {
            console.log('Deleting old cache:', cacheName);
            await caches.delete(cacheName);
          }
        })
      );
      
      // Take control of all clients
      await self.clients.claim();
      console.log('Service worker activated and took control');
    })()
  );
});

// Handle all fetch events
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests and chrome-extension requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Handle different types of requests
    if (request.mode === 'navigate') {
      return await handleNavigationRequest(request);
    } else if (url.pathname.startsWith('/api/') || url.origin.includes('realworld.show')) {
      return await handleApiRequest(request);
    } else if (request.destination === 'image' || request.destination === 'font') {
      return await handleAssetRequest(request);
    } else {
      return await handleStaticRequest(request);
    }
  } catch (error) {
    console.error('Request failed:', request.url, error);
    
    // Return offline page for navigation failures
    if (request.mode === 'navigate') {
      return await getOfflinePage();
    }
    
    return new Response('Network Error', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Handle navigation requests (pages)
async function handleNavigationRequest(request) {
  console.log('Handling navigation:', request.url);
  
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 3000)
      )
    ]);
    
    if (networkResponse.ok) {
      // Cache successful navigation responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    console.log('Network failed, trying cache:', error.message);
    
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Return offline page as fallback
    console.log('Serving offline page fallback');
    return await getOfflinePage();
  }
}

// Handle API requests
async function handleApiRequest(request) {
  console.log('Handling API request:', request.url);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    // Return cached API response if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('Serving API from cache:', request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle static assets (images, fonts, etc.)
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
    // Return a placeholder or let it fail gracefully
    throw error;
  }
}

// Handle other static requests
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

// Get offline page
async function getOfflinePage() {
  try {
    const offlineResponse = await caches.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Fallback if offline page not cached
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Blog Platform</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: system-ui; text-align: center; padding: 2rem;">
          <h1>📡 You're offline</h1>
          <p>Your internet connection is unavailable.</p>
          <button onclick="location.reload()">Try Again</button>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    });
  } catch (error) {
    console.error('Failed to serve offline page:', error);
    return new Response('Offline', { status: 200 });
  }
}

// Handle background sync
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('Processing background sync...');
  // Implementation for queued requests when connection is restored
  // This can be expanded based on your needs
}

// Handle messages from the main thread
self.addEventListener('message', event => {
  const { type, data } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_URLS':
      // Allow manual caching of URLs
      if (data && Array.isArray(data)) {
        event.waitUntil(cacheUrls(data));
      }
      break;
    default:
      console.log('Received message:', event.data);
  }
});

async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('Manually cached URLs:', urls);
  } catch (error) {
    console.error('Failed to cache URLs:', error);
  }
}

console.log('Service Worker loaded successfully!');