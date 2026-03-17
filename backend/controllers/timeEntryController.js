const TimeEntry = require('../models/TimeEntry')

const getByPortal = async (req, res) => {
  try {
    const entries = await TimeEntry.find({ portalId: req.params.portalId }).sort({ date: -1 })
    res.json(entries)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyEntries = async (req, res) => {
  try {
    const entries = await TimeEntry.find({ portalId: req.portal._id }).sort({ date: -1 })

    // Aggregate totals
    const total = entries.reduce((sum, e) => sum + e.hours, 0)
    const byCategory = {}
    entries.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.hours
    })

    res.json({ entries, total, byCategory })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const entry = await TimeEntry.create(req.body)
    res.status(201).json(entry)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const entry = await TimeEntry.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!entry) return res.status(404).json({ message: 'Entry not found' })
    res.json(entry)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await TimeEntry.findByIdAndDelete(req.params.id)
    res.json({ message: 'Entry deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getByPortal, getMyEntries, create, update, remove }
