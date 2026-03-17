const mongoose = require('mongoose')

const releaseSchema = new mongoose.Schema({
  portalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  version:     { type: String, required: true, trim: true }, // e.g. "v1.2.0"
  title:       { type: String, required: true, trim: true },
  type:        { type: String, enum: ['major', 'minor', 'patch', 'hotfix'], default: 'minor' },
  description: { type: String, default: '' },
  feats:       [{ type: String }],
  fixes:       [{ type: String }],
  breaking:    [{ type: String }],
  releaseDate: { type: Date, required: true },
  isPublished: { type: Boolean, default: false },
  liveUrl:     { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Release', releaseSchema)
