const router = require('express').Router()
const { getActivity, handleWebhook } = require('../controllers/githubActivityController')
const { clientAccess } = require('../middleware/clientPortalAuth')
const { protect, adminOnly } = require('../middleware/auth')

// Both admin and client can access general activity logs
router.get('/:username/:repo', protect, getActivity)
router.get('/client/:username/:repo', clientAccess, getActivity)
router.get('/client/:username', clientAccess, getActivity)

// GitHub Webhook Integration 
router.post('/webhook/:portalId', handleWebhook)

module.exports = router
