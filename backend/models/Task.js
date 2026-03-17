const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  portalId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, index: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status:      { type: String, enum: ['todo', 'in-progress', 'done', 'blocked'], default: 'todo' },
  priority:    { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  assignee:    { type: String, default: '' },
  dueDate:     { type: Date },
  tags:        [{ type: String }],
  order:       { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
