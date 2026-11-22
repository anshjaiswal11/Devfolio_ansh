const Project = require('../models/Project')

let cachedProjects = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 3 * 60 * 1000 // 3 minutes

const clearCache = () => {
  cachedProjects = null
  cacheTimestamp = 0
}

// GET /api/projects
exports.getAll = async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400')
    
    const now = Date.now()
    if (cachedProjects && (now - cacheTimestamp < CACHE_TTL_MS)) {
      return res.json({ projects: cachedProjects, count: cachedProjects.length })
    }

    const projects = await Project.find().sort({ order: 1, createdAt: -1 })
    cachedProjects = projects
    cacheTimestamp = now

    res.json({ projects, count: projects.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/projects/:slug
exports.getBySlug = async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400')
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
    clearCache()
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
    clearCache()
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
    clearCache()
    res.json({ message: 'Project deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
