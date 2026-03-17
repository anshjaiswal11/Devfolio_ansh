const router = require('express').Router()
const { getActivity } = require('../controllers/githubActivityController')
const { clientAccess } = require('../middleware/clientPortalAuth')
const { protect, adminOnly } = require('../middleware/auth')

// Both admin and client can access
router.get('/:username/:repo', protect, getActivity)
router.get('/client/:username/:repo', clientAccess, getActivity)
router.get('/client/:username', clientAccess, getActivity)

module.exports = router
