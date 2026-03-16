const router = require('express').Router()
const { signup, login, logout, profile } = require('../controllers/authController')
const { protect } = require('../middleware/auth')
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many auth attempts, please try again later' },
})

router.post('/signup',  authLimiter, signup)
router.post('/login',   authLimiter, login)
router.post('/logout',  protect, logout)
router.get('/profile',  protect, profile)

module.exports = router
