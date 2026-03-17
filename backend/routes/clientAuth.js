const router = require('express').Router()
const { accessPortal, getMe } = require('../controllers/clientAuthController')
const { clientAccess } = require('../middleware/clientPortalAuth')

router.post('/access', accessPortal)
router.get('/me', clientAccess, getMe)

module.exports = router
