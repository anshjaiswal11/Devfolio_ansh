const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
  portalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  title:       { type: String, required: true, trim: true },
  date:        { type: Date, required: true },
  duration:    { type: Number, default: 0 }, // minutes
  attendees:   [{ type: String }],
  notes:       { type: String, default: '' },
  actionItems: [{ text: String, assignee: String, dueDate: Date, done: { type: Boolean, default: false } }],
  recordingUrl:{ type: String, default: '' },
  meetingLink: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Meeting', meetingSchema)
