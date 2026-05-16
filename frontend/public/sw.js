const CACHE_NAME = 'client-portal-v1'
const STATIC_ASSETS = ['/client/dashboard']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Network-first strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
    return
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  )
})

// Push notification handler
self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data.json() } catch (e) { data = { title: 'Notification', body: event.data?.text() || '' } }

  const title = data.title || 'New Notification'
  const options = {
    body: data.body || '',
    icon: data.icon || '/pwa-192.png',
    data: data.url || '/',
    badge: data.badge || '/pwa-192.png',
    vibrate: [100, 50, 100],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data || '/'
  event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (const client of windowClients) {
      if (client.url === url && 'focus' in client) return client.focus()
    }
    if (clients.openWindow) return clients.openWindow(url)
  }))
})
