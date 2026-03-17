const mongoose = require('mongoose')

const logItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['completed', 'progress', 'blocker', 'note'], default: 'completed' },
}, { _id: false })

const dailyLogSchema = new mongoose.Schema({
  portalId:       { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  date:           { type: Date, required: true },
  title:          { type: String, default: '' },
  items:          [logItemSchema],
  completedTasks: { type: Number, default: 0 },
  bugsFixed:      { type: Number, default: 0 },
  hoursWorked:    { type: Number, default: 0 },
  commits:        { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('DailyLog', dailyLogSchema)
