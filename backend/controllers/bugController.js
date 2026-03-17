const Bug = require('../models/Bug')
const { notifySlack } = require('../utils/slackNotify')

const getByPortal = async (req, res) => {
  try {
    const bugs = await Bug.find({ portalId: req.params.portalId }).sort({ createdAt: -1 })
    res.json(bugs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({ portalId: req.portal._id }).sort({ createdAt: -1 })
    res.json(bugs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const bug = await Bug.create(req.body)
    notifySlack(req.body.portalId, 'bug',
      `🐞 New Bug: ${bug.title}`,
      `Severity: ${bug.severity} • Status: ${bug.status}`)
    res.status(201).json(bug)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const existing = await Bug.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Bug not found' })

    const updateData = { ...req.body }
    if (req.body.status === 'resolved' && existing.status !== 'resolved') {
      updateData.resolvedAt = new Date()
    }

    const bug = await Bug.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (req.body.status && req.body.status !== existing.status) {
      notifySlack(bug.portalId, 'bug',
        `🐞 Bug Status Updated: ${bug.title}`,
        `Status changed to: *${bug.status}*`)
    }
    res.json(bug)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id)
    res.json({ message: 'Bug deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getByPortal, getMyBugs, create, update, remove }
