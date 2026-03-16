const Blog = require('../models/Blog')

// GET /api/blogs
exports.getAll = async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { published: true }
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).select('-content')
    res.json({ blogs, count: blogs.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/blogs/:slug
exports.getBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ blog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/blogs  (admin only)
exports.create = async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.status(201).json({ blog })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Slug already exists' })
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/blogs/:id  (admin only)
exports.update = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ blog })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/blogs/:id  (admin only)
exports.remove = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ message: 'Blog deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
