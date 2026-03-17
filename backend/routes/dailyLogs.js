const router = require('express').Router()
const { getByPortal, getMyLogs, create, update, remove } = require('../controllers/dailyLogController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

// Admin routes
router.get('/portal/:portalId', protect, adminOnly, getByPortal)
router.post('/',                protect, adminOnly, create)
router.put('/:id',              protect, adminOnly, update)
router.delete('/:id',           protect, adminOnly, remove)

// Client routes
router.get('/my',               clientAccess, getMyLogs)

module.exports = router
