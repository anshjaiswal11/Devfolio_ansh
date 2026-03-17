const router = require('express').Router()
const { getAll, getOne, create, update, remove, resetPasskey } = require('../controllers/clientPortalController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/',           protect, adminOnly, getAll)
router.get('/:id',        protect, adminOnly, getOne)
router.post('/',          protect, adminOnly, create)
router.put('/:id',        protect, adminOnly, update)
router.delete('/:id',     protect, adminOnly, remove)
router.patch('/:id/reset-passkey', protect, adminOnly, resetPasskey)

module.exports = router
