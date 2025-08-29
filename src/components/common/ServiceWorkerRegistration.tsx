'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
    ) {
      const registerServiceWorker = async () => {
        try {
          console.log('Registering manual PWA service worker...')
          
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })
          
          console.log('Service worker registered successfully:', registration.scope)
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            console.log('Service worker update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('Service worker state changed:', newWorker.state)
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New service worker available, consider showing update prompt')
                  // You could show an update notification here
                }
              })
            }
          })
          
          // Check if there's a waiting worker on page load
          if (registration.waiting) {
            console.log('Service worker waiting, ready to update')
          }
          
          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            const { type, data } = event.data || {}
            
            switch (type) {
              case 'BACKGROUND_SYNC_SUCCESS':
                console.log('Background sync successful:', data)
                break
              case 'CACHE_UPDATED':
                console.log('Cache updated:', data)
                break
              default:
                console.log('Service worker message:', event.data)
            }
          })
          
        } catch (error) {
          console.error('Service worker registration failed:', error)
        }
      }
      
      registerServiceWorker()
    } else {
      console.log('Service worker not supported or not in secure context')
    }
  }, [])

  return null
}