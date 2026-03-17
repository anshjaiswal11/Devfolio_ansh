const SharedFile = require('../models/SharedFile')

const getByPortal = async (req, res) => {
  try {
    const files = await SharedFile.find({ portalId: req.params.portalId }).sort({ createdAt: -1 })
    res.json(files)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyFiles = async (req, res) => {
  try {
    const files = await SharedFile.find({ portalId: req.portal._id }).sort({ createdAt: -1 })
    res.json(files)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin upload
const adminUpload = async (req, res) => {
  try {
    const { portalId, name, url, size, mimeType, description } = req.body
    const file = await SharedFile.create({ portalId, name, url, size, mimeType, description, uploadedBy: 'admin', uploadedByName: 'Admin' })
    res.status(201).json(file)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Client upload
const clientUpload = async (req, res) => {
  try {
    const { name, url, size, mimeType, description } = req.body
    const file = await SharedFile.create({
      portalId: req.portal._id,
      name, url, size, mimeType, description,
      uploadedBy: 'client',
      uploadedByName: req.portal.clientName,
    })
    res.status(201).json(file)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await SharedFile.findByIdAndDelete(req.params.id)
    res.json({ message: 'File deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getByPortal, getMyFiles, adminUpload, clientUpload, remove }
