const router = require('express').Router()
const { getConfig, upsertConfig, syncTasks } = require('../controllers/notionController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

// Admin
router.put('/:portalId',         protect, adminOnly, upsertConfig)
router.post('/:portalId/sync',   protect, adminOnly, syncTasks)

// Client + Admin can read config (no token exposed)
router.get('/:portalId',         clientAccess, getConfig)

module.exports = router
