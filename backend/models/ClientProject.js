const mongoose = require('mongoose')

const clientProjectSchema = new mongoose.Schema({
  clientName: { type: String, required: true, trim: true, maxlength: 120 },
  clientRole: { type: String, trim: true, default: '' },
  title:      { type: String, required: true, trim: true, maxlength: 150 },
  description:{ type: String, required: true, maxlength: 2000 },
  techStack:  [{ type: String, trim: true }],
  projectType:{ type: String, trim: true, default: '' },
  year:       { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['Shipped', 'Live', 'In Progress'],
    default: 'Shipped',
  },
  liveLink:   { type: String, default: '' },
  order:      { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('ClientProject', clientProjectSchema)
