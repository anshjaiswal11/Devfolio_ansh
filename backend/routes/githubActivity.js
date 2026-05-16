const router = require('express').Router()
const { getActivity, handleWebhook, getRepoInfo } = require('../controllers/githubActivityController')
const { clientAccess } = require('../middleware/clientPortalAuth')
const { protect, adminOnly } = require('../middleware/auth')

// Full repo transparency — must be declared BEFORE the parameterized routes
router.get('/client/:username/:repo/info', clientAccess, getRepoInfo)

// Both admin and client can access general activity logs
router.get('/:username/:repo', protect, getActivity)
router.get('/client/:username/:repo', clientAccess, getActivity)
router.get('/client/:username', clientAccess, getActivity)

// GitHub Webhook Integration 
router.post('/webhook/:portalId', handleWebhook)

module.exports = router
