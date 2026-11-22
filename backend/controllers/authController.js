const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'devfolio-jwt-secret-key-2026', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

const isAdminEmail = (email) => {
  if (!email) return false
  const lower = email.toLowerCase().trim()
  return (
    lower === 'anshjaiswal1804@gmail.com' ||
    lower.includes('anshjaiswal') ||
    (process.env.ADMIN_EMAIL && lower === process.env.ADMIN_EMAIL.toLowerCase().trim())
  )
}

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const cleanEmail = email.toLowerCase().trim()
    const existing = await User.findOne({ email: cleanEmail })
    if (existing) return res.status(409).json({ message: 'Email already registered' })

    const role = isAdminEmail(cleanEmail) ? 'admin' : (req.body.role || 'user')
    const user = await User.create({ name, email: cleanEmail, password, role })
    const token = signToken(user._id)
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const cleanEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: cleanEmail }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    
    // Elevate admin rights automatically for Ansh Jaiswal
    if (isAdminEmail(cleanEmail) && user.role !== 'admin') {
      user.role = 'admin'
      await user.save()
    }

    const token = signToken(user._id)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' })
}

// GET /api/auth/profile
exports.profile = async (req, res) => {
  res.json({ user: req.user })
}
