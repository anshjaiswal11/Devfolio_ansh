const Project = require('../models/Project')

// GET /api/projects
exports.getAll = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 })
    res.json({ projects, count: projects.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/projects/:slug
exports.getBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ project })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/projects  (admin only)
exports.create = async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json({ project })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Slug already exists' })
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/projects/:id  (admin only)
exports.update = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ project })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/projects/:id  (admin only)
exports.remove = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
