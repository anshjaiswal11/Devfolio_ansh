const jwt = require('jsonwebtoken')
const ClientPortal = require('../models/ClientPortal')

/**
 * Middleware: verifies x-client-token JWT, attaches req.portal
 */
const clientAccess = async (req, res, next) => {
  const token = req.headers['x-client-token']
  if (!token) {
    return res.status(401).json({ message: 'No client token provided' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.type !== 'client') {
      return res.status(401).json({ message: 'Invalid token type' })
    }
    const portal = await ClientPortal.findById(decoded.portalId)
    if (!portal || !portal.isActive) {
      return res.status(401).json({ message: 'Portal not found or inactive' })
    }
    req.portal = portal
    next()
  } catch {
    res.status(401).json({ message: 'Client token invalid or expired' })
  }
}

module.exports = { clientAccess }
