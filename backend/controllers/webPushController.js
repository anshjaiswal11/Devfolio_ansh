const webpush = require('web-push')
const PushSubscription = require('../models/PushSubscription')

function initWebPush() {
  const pub = process.env.VAPID_PUBLIC_KEY
  const prv = process.env.VAPID_PRIVATE_KEY
  if (!pub || !prv) return false
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    pub,
    prv
  )
  return true
}

exports.getVapidPublicKey = (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) return res.status(500).json({ message: 'VAPID keys not configured' })
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY })
}

exports.subscribe = async (req, res, next) => {
  try {
    const { subscription, portalId } = req.body
    if (!subscription || !subscription.endpoint) return res.status(400).json({ message: 'Invalid subscription' })

    const existing = await PushSubscription.findOne({ endpoint: subscription.endpoint })
    if (existing) return res.json({ ok: true })

    await PushSubscription.create({
      portalId: portalId || null,
      endpoint: subscription.endpoint,
      keys: subscription.keys || {},
    })

    return res.json({ ok: true })
  } catch (err) { next(err) }
}

exports.sendTest = async (req, res, next) => {
  try {
    if (!initWebPush()) return res.status(500).json({ message: 'VAPID keys not configured' })
    const { portalId, title = 'Test', body = 'Hello from server', url = '/' } = req.body

    const subs = await PushSubscription.find(portalId ? { portalId } : {})
    const payload = JSON.stringify({ title, body, url })

    const results = await Promise.allSettled(subs.map(s => webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload)))
    res.json({ sent: results.length })
  } catch (err) { next(err) }
}
