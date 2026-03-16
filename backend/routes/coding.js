const router = require('express').Router()
const { getStats } = require('../controllers/codingStatsController')

router.get('/', getStats)

module.exports = router
