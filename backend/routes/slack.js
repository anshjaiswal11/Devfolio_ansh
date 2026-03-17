const router = require('express').Router()
const { getConfig, upsertConfig, testPing } = require('../controllers/slackController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

// Admin
router.put('/:portalId',          protect, adminOnly, upsertConfig)
router.post('/:portalId/test',    protect, adminOnly, testPing)

// Client can see config (no webhook URL)
router.get('/:portalId',          clientAccess, getConfig)

module.exports = router
