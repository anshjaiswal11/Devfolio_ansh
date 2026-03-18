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
  imageUrl:   { type: String, default: '' },
  slug:       { type: String, unique: true, lowercase: true, trim: true, sparse: true },
  longDescription: { type: String, maxlength: 5000, default: '' },
  order:      { type: Number, default: 0 },
}, { timestamps: true })

// Auto-generate slug from title if not provided
clientProjectSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  next()
})

module.exports = mongoose.model('ClientProject', clientProjectSchema)
