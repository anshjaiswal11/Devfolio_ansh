const mongoose = require('mongoose')

const slackSchema = new mongoose.Schema({
  portalId:          { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, unique: true },
  webhookUrl:        { type: String, default: '', select: false },
  channelName:       { type: String, default: '' },
  notifyOnFeedback:  { type: Boolean, default: true },
  notifyOnLog:       { type: Boolean, default: true },
  notifyOnMilestone: { type: Boolean, default: true },
  notifyOnBug:       { type: Boolean, default: false },
  notifyOnRelease:   { type: Boolean, default: true },
  isActive:          { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('SlackIntegration', slackSchema)
