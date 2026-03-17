const Meeting = require('../models/Meeting')

const getByPortal = async (req, res) => {
  try {
    const meetings = await Meeting.find({ portalId: req.params.portalId }).sort({ date: -1 })
    res.json(meetings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ portalId: req.portal._id }).sort({ date: -1 })
    res.json(meetings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const meeting = await Meeting.create(req.body)
    res.status(201).json(meeting)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' })
    res.json(meeting)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await Meeting.findByIdAndDelete(req.params.id)
    res.json({ message: 'Meeting deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getByPortal, getMyMeetings, create, update, remove }
