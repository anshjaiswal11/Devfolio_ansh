const mongoose = require('mongoose')

const pushSubscriptionSchema = new mongoose.Schema({
  portalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', index: true },
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String },
    auth: { type: String },
  },
}, { timestamps: true })

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema)
