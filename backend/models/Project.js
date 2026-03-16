const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, maxlength: 1000 },
  longDescription: { type: String, maxlength: 5000, default: '' },
  techStack: [{ type: String, trim: true }],
  githubLink: { type: String, default: '' },
  liveDemoLink: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true })

// Auto-generate slug from title if not provided
projectSchema.pre('validate', function (next) {
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

module.exports = mongoose.model('Project', projectSchema)
