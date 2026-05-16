const router = require('express').Router()
const { create, getByPortal, remove, getMyNotifications, getUnreadCount, markRead, markAllRead } = require('../controllers/notificationController')
const { getVapidPublicKey, subscribe, sendTest } = require('../controllers/webPushController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

// Client routes (must be before parameterized routes)
router.get('/my',              clientAccess, getMyNotifications)
router.get('/my/unread-count', clientAccess, getUnreadCount)
router.patch('/my/read-all',   clientAccess, markAllRead)

// Admin routes
router.post('/',               protect, adminOnly, create)
router.get('/portal/:portalId', protect, adminOnly, getByPortal)
router.delete('/:id',          protect, adminOnly, remove)

// Client mark single read
router.patch('/:id/read',     clientAccess, markRead)

// Web Push helper endpoints
router.get('/vapidPublicKey', getVapidPublicKey)
router.post('/subscribe', subscribe)
router.post('/send-test', sendTest)

module.exports = router
