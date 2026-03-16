const ClientProject = require('../models/ClientProject')

// GET /api/client-projects  — public
exports.getAll = async (req, res) => {
  try {
    const projects = await ClientProject.find().sort({ order: 1, createdAt: -1 })
    res.json({ clientProjects: projects, count: projects.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/client-projects  — admin only
exports.create = async (req, res) => {
  try {
    const project = await ClientProject.create(req.body)
    res.status(201).json({ clientProject: project })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/client-projects/:id  — admin only
exports.update = async (req, res) => {
  try {
    const project = await ClientProject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!project) return res.status(404).json({ message: 'Client project not found' })
    res.json({ clientProject: project })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/client-projects/:id  — admin only
exports.remove = async (req, res) => {
  try {
    const project = await ClientProject.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Client project not found' })
    res.json({ message: 'Client project deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
