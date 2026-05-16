import { getVapidPublicKey, subscribePush } from './api'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export async function initPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) return // already subscribed

    const vapidResponse = await getVapidPublicKey()
    if (!vapidResponse?.data?.publicKey) return

    const applicationServerKey = urlBase64ToUint8Array(vapidResponse.data.publicKey)
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    // send subscription to backend
    await subscribePush({ subscription })
    console.log('Push subscription successful')
  } catch (err) {
    console.error('Push init failed', err)
  }
}

export async function unsubscribePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  if (sub) await sub.unsubscribe()
}
