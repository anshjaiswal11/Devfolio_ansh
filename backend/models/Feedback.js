const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  portalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  clientName:  { type: String, required: true },
  message:     { type: String, required: true, maxlength: 2000 },
  type:        { type: String, enum: ['general', 'bug', 'feature', 'question', 'approval'], default: 'general' },
  isRead:      { type: Boolean, default: false },
  adminReply:  { type: String, default: '' },
  repliedAt:   { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)
