const router = require('express').Router()
const { create, getByPortal, remove, getMyNotifications, getUnreadCount, markRead, markAllRead } = require('../controllers/notificationController')
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

module.exports = router
