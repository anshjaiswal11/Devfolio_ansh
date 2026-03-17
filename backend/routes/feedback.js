const router = require('express').Router()
const { submit, getMyFeedback, getByPortal, reply, markRead } = require('../controllers/feedbackController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

// Client routes
router.post('/my',              clientAccess, submit)
router.get('/my',               clientAccess, getMyFeedback)

// Admin routes
router.get('/portal/:portalId', protect, adminOnly, getByPortal)
router.patch('/:id/reply',      protect, adminOnly, reply)
router.patch('/:id/read',       protect, adminOnly, markRead)

module.exports = router
