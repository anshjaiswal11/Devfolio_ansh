const mongoose = require('mongoose')

const sharedFileSchema = new mongoose.Schema({
  portalId:       { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  name:           { type: String, required: true, trim: true },
  originalName:   { type: String, default: '' },
  url:            { type: String, required: true },
  size:           { type: Number, default: 0 },
  mimeType:       { type: String, default: '' },
  uploadedBy:     { type: String, enum: ['admin', 'client'], required: true },
  uploadedByName: { type: String, default: '' },
  description:    { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('SharedFile', sharedFileSchema)
