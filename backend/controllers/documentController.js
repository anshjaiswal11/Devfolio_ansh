const Document = require('../models/Document')

const getByPortal = async (req, res) => {
  try {
    const docs = await Document.find({ portalId: req.params.portalId }).sort({ createdAt: -1 })
    res.json(docs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyDocs = async (req, res) => {
  try {
    const docs = await Document.find({ portalId: req.portal._id }).sort({ createdAt: -1 })
    res.json(docs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const doc = await Document.create(req.body)
    res.status(201).json(doc)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!doc) return res.status(404).json({ message: 'Document not found' })
    res.json(doc)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id)
    res.json({ message: 'Document deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getByPortal, getMyDocs, create, update, remove }
