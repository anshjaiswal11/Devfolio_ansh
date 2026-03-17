const mongoose = require('mongoose')

const timeEntrySchema = new mongoose.Schema({
  portalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  date:        { type: Date, required: true },
  description: { type: String, required: true },
  hours:       { type: Number, required: true, min: 0, max: 24 },
  category:    { type: String, enum: ['development', 'design', 'meeting', 'review', 'testing', 'deployment', 'other'], default: 'development' },
}, { timestamps: true })

module.exports = mongoose.model('TimeEntry', timeEntrySchema)
