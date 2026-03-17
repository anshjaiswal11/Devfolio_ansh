const router = require('express').Router()
const { getByPortal, getMyFiles, adminUpload, clientUpload, remove } = require('../controllers/sharedFileController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

router.get('/portal/:portalId', protect, adminOnly, getByPortal)
router.post('/admin',           protect, adminOnly, adminUpload)
router.delete('/:id',           protect, adminOnly, remove)

router.get('/my',               clientAccess, getMyFiles)
router.post('/my',              clientAccess, clientUpload)

module.exports = router
