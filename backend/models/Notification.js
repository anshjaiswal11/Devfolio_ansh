const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  portalId:  { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  title:     { type: String, required: true, trim: true },
  message:   { type: String, required: true },
  type:      { type: String, enum: ['update', 'milestone', 'release', 'bug_fix', 'general'], default: 'update' },
  isRead:    { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)
