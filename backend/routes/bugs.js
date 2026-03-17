const router = require('express').Router()
const { getByPortal, getMyBugs, create, update, remove } = require('../controllers/bugController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

router.get('/portal/:portalId', protect, adminOnly, getByPortal)
router.post('/',                protect, adminOnly, create)
router.put('/:id',              protect, adminOnly, update)
router.delete('/:id',           protect, adminOnly, remove)

router.get('/my',               clientAccess, getMyBugs)

module.exports = router
