const router = require('express').Router()
const { send } = require('../controllers/contactController')
const rateLimit = require('express-rate-limit')

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many messages sent. Please wait before trying again.' },
})

router.post('/', contactLimiter, send)

module.exports = router
