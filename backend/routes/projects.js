const router = require('express').Router()
const { getAll, getBySlug, create, update, remove } = require('../controllers/projectController')
const { protect, adminOnly } = require('../middleware/auth')

router.get('/',       getAll)
router.get('/:slug',  getBySlug)
router.post('/',      protect, adminOnly, create)
router.put('/:id',    protect, adminOnly, update)
router.delete('/:id', protect, adminOnly, remove)

module.exports = router
