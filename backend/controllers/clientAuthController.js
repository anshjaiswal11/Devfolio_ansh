const jwt = require('jsonwebtoken')
const ClientPortal = require('../models/ClientPortal')

// POST /api/client-auth/access
// Body: { gmail, passkey }
const accessPortal = async (req, res) => {
  const { gmail, passkey } = req.body
  if (!gmail || !passkey) {
    return res.status(400).json({ message: 'Gmail and passkey are required' })
  }
  try {
    const portal = await ClientPortal.findOne({ gmail: gmail.toLowerCase().trim(), isActive: true }).select('+passkey')
    if (!portal) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const match = await portal.comparePasskey(passkey)
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { portalId: portal._id, type: 'client', gmail: portal.gmail },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { passkey: _, ...portalData } = portal.toObject()
    res.json({ token, portal: portalData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/client-auth/me  (client token required)
const getMe = async (req, res) => {
  res.json({ portal: req.portal })
}

module.exports = { accessPortal, getMe }
