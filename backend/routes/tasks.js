const router = require('express').Router()
const { getByPortal, getMyTasks, create, update, remove } = require('../controllers/taskController')
const { protect, adminOnly } = require('../middleware/auth')
const { clientAccess } = require('../middleware/clientPortalAuth')

router.get('/portal/:portalId', protect, adminOnly, getByPortal)
router.post('/',                protect, adminOnly, create)
router.put('/:id',              protect, adminOnly, update)
router.delete('/:id',           protect, adminOnly, remove)

router.get('/my',               clientAccess, getMyTasks)

module.exports = router
