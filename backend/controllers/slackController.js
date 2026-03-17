const SlackIntegration = require('../models/SlackIntegration')
const axios = require('axios')

const getConfig = async (req, res) => {
  try {
    const slack = await SlackIntegration.findOne({ portalId: req.params.portalId })
    if (!slack) return res.json({ isActive: false, channelName: '', notifyOnFeedback: true, notifyOnLog: true, notifyOnMilestone: true, notifyOnBug: false, notifyOnRelease: true })
    const { webhookUrl: _, ...safe } = slack.toObject()
    res.json(safe)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const upsertConfig = async (req, res) => {
  try {
    const { portalId } = req.params
    const { webhookUrl, channelName, notifyOnFeedback, notifyOnLog, notifyOnMilestone, notifyOnBug, notifyOnRelease, isActive } = req.body
    const slack = await SlackIntegration.findOneAndUpdate(
      { portalId },
      { webhookUrl, channelName, notifyOnFeedback, notifyOnLog, notifyOnMilestone, notifyOnBug, notifyOnRelease, isActive },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    const { webhookUrl: _, ...safe } = slack.toObject()
    res.json({ message: 'Slack config saved', ...safe })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Admin: send test ping
const testPing = async (req, res) => {
  try {
    const slack = await SlackIntegration.findOne({ portalId: req.params.portalId }).select('+webhookUrl')
    if (!slack || !slack.webhookUrl) {
      return res.status(400).json({ message: 'Slack webhook not configured' })
    }
    await axios.post(slack.webhookUrl, {
      text: '✅ *Test ping from Client Portal!* Your Slack integration is working perfectly.',
    }, { timeout: 5000 })
    res.json({ message: 'Test ping sent successfully' })
  } catch (err) {
    res.status(502).json({ message: 'Failed to send test ping', error: err.message })
  }
}

module.exports = { getConfig, upsertConfig, testPing }
