const Feedback = require('../models/Feedback')
const { notifySlack } = require('../utils/slackNotify')

// Client: submit feedback
const submit = async (req, res) => {
  try {
    const { message, type } = req.body
    const feedback = await Feedback.create({
      portalId:   req.portal._id,
      clientName: req.portal.clientName,
      message,
      type: type || 'general',
    })
    notifySlack(req.portal._id, 'feedback',
      `💬 New Feedback from ${req.portal.clientName}`,
      `Type: ${feedback.type}\n"${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`)
    res.status(201).json(feedback)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Client: get own feedback
const getMyFeedback = async (req, res) => {
  try {
    const items = await Feedback.find({ portalId: req.portal._id }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin: get all feedback for a portal
const getByPortal = async (req, res) => {
  try {
    const items = await Feedback.find({ portalId: req.params.portalId }).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin: reply to feedback
const reply = async (req, res) => {
  try {
    const { adminReply } = req.body
    const item = await Feedback.findByIdAndUpdate(
      req.params.id,
      { adminReply, isRead: true, repliedAt: new Date() },
      { new: true }
    )
    if (!item) return res.status(404).json({ message: 'Feedback not found' })
    res.json(item)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Admin: mark as read
const markRead = async (req, res) => {
  try {
    const item = await Feedback.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { submit, getMyFeedback, getByPortal, reply, markRead }
