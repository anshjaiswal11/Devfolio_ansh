const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
  portalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type:        { type: String, enum: ['technical', 'api', 'architecture', 'design', 'database', 'other'], default: 'other' },
  url:         { type: String, required: true },
  fileType:    { type: String, default: '' }, // pdf, png, md, etc.
  size:        { type: Number, default: 0 }, // bytes
}, { timestamps: true })

module.exports = mongoose.model('Document', documentSchema)
