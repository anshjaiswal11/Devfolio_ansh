const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true, maxlength: 200 },
  slug:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt:    { type: String, maxlength: 500, default: '' },
  content:    { type: String, required: true },
  coverImage: { type: String, default: '' },
  tags:       [{ type: String, trim: true }],
  published:  { type: Boolean, default: false },
  readTime:   { type: Number, default: 0 },
}, { timestamps: true })

// Auto-generate or sanitize slug
blogSchema.pre('validate', function (next) {
  if (this.title) {
    const textToSlugify = this.slug || this.title
    this.slug = textToSlugify
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  // Auto compute read time (avg 200 words per minute)
  if (this.content) {
    const words = this.content.split(/\s+/).length
    this.readTime = Math.max(1, Math.ceil(words / 200))
  }
  next()
})

module.exports = mongoose.model('Blog', blogSchema)
