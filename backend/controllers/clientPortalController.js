const ClientPortal = require('../models/ClientPortal')

const getAll = async (req, res) => {
  try {
    const portals = await ClientPortal.find().sort({ createdAt: -1 })
    res.json(portals)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getOne = async (req, res) => {
  try {
    const portal = await ClientPortal.findById(req.params.id)
    if (!portal) return res.status(404).json({ message: 'Portal not found' })
    res.json(portal)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const portal = new ClientPortal(req.body)
    await portal.save()
    const saved = await ClientPortal.findById(portal._id) // no passkey
    res.status(201).json(saved)
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'A portal with this Gmail already exists' })
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const { passkey, ...rest } = req.body
    const portal = await ClientPortal.findById(req.params.id).select('+passkey')
    if (!portal) return res.status(404).json({ message: 'Portal not found' })

    Object.assign(portal, rest)
    // Only update passkey if explicitly provided
    if (passkey) portal.passkey = passkey

    await portal.save()
    const updated = await ClientPortal.findById(portal._id)
    res.json(updated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await ClientPortal.findByIdAndDelete(req.params.id)
    res.json({ message: 'Portal deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Reset passkey only — admin endpoint
const resetPasskey = async (req, res) => {
  try {
    const { passkey } = req.body
    if (!passkey) return res.status(400).json({ message: 'New passkey required' })
    const portal = await ClientPortal.findById(req.params.id).select('+passkey')
    if (!portal) return res.status(404).json({ message: 'Portal not found' })
    portal.passkey = passkey
    await portal.save()
    res.json({ message: 'Passkey reset successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAll, getOne, create, update, remove, resetPasskey }
