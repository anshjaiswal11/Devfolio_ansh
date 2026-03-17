const SlackIntegration = require('../models/SlackIntegration')
const axios = require('axios')

/**
 * Send a Slack notification for a portal event.
 * Silently fails if Slack is not configured or the event type is disabled.
 */
const notifySlack = async (portalId, eventType, message, details = '') => {
  try {
    const slack = await SlackIntegration.findOne({ portalId, isActive: true }).select('+webhookUrl')
    if (!slack || !slack.webhookUrl) return

    // Check event-level toggles
    const toggleMap = {
      feedback:  slack.notifyOnFeedback,
      log:       slack.notifyOnLog,
      milestone: slack.notifyOnMilestone,
      bug:       slack.notifyOnBug,
      release:   slack.notifyOnRelease,
    }
    if (toggleMap[eventType] === false) return

    const emoji = {
      feedback:  '💬',
      log:       '📋',
      milestone: '🚀',
      bug:       '🐞',
      release:   '📦',
      test:      '✅',
    }[eventType] || '📌'

    const payload = {
      text: `${emoji} *Client Portal Update*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${emoji} *${message}*${details ? `\n${details}` : ''}`,
          },
        },
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: `Posted by Client Portal System • ${new Date().toLocaleString()}` },
          ],
        },
      ],
    }

    await axios.post(slack.webhookUrl, payload, { timeout: 5000 })
  } catch (err) {
    console.error('[Slack] notify failed:', err.message)
  }
}

module.exports = { notifySlack }
