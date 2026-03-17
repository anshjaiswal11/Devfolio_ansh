const mongoose = require('mongoose')

const bugSchema = new mongoose.Schema({
  portalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  severity:    { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status:      { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  reportedBy:  { type: String, default: 'admin' },
  resolvedAt:  { type: Date },
  stepsToReproduce: { type: String, default: '' },
  environment: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Bug', bugSchema)
