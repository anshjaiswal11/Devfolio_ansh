const Notification = require('../models/Notification')
const { notifySlack } = require('../utils/slackNotify')

// POST /api/notifications — Admin creates a notification for a portal
const create = async (req, res) => {
  try {
    const { portalId, title, message, type } = req.body
    if (!portalId || !title || !message) {
      return res.status(400).json({ message: 'portalId, title and message are required' })
    }
    const notification = await Notification.create({ portalId, title, message, type: type || 'update' })

    // Also send Slack notification if configured
    try {
      const TYPE_EMOJI = { update: '🔄', milestone: '🚀', release: '📦', bug_fix: '🐞', general: '📌' }
      await notifySlack(portalId, 'log', `${TYPE_EMOJI[type] || '📌'} ${title}`, message)
    } catch {} // Silently fail

    res.status(201).json(notification)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// GET /api/notifications/portal/:portalId — Admin gets all notifications for a portal
const getByPortal = async (req, res) => {
  try {
    const items = await Notification.find({ portalId: req.params.portalId }).sort('-createdAt')
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/notifications/:id — Admin deletes a notification
const remove = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/notifications/my — Client gets their notifications
const getMyNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ portalId: req.portal._id }).sort('-createdAt').limit(50)
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/notifications/my/unread-count — Client gets unread badge count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ portalId: req.portal._id, isRead: false })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PATCH /api/notifications/:id/read — Client marks one as read
const markRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, portalId: req.portal._id },
      { isRead: true },
      { new: true }
    )
    if (!notif) return res.status(404).json({ message: 'Not found' })
    res.json(notif)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PATCH /api/notifications/my/read-all — Client marks all as read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ portalId: req.portal._id, isRead: false }, { isRead: true })
    res.json({ message: 'All marked as read' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { create, getByPortal, remove, getMyNotifications, getUnreadCount, markRead, markAllRead }
