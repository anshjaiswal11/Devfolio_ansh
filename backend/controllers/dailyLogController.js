const DailyLog = require('../models/DailyLog')
const { notifySlack } = require('../utils/slackNotify')

// Admin: get all logs for a portal
const getByPortal = async (req, res) => {
  try {
    const { portalId } = req.params
    const logs = await DailyLog.find({ portalId }).sort({ date: -1 })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Client: get own portal logs
const getMyLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find({ portalId: req.portal._id }).sort({ date: -1 })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const { portalId, ...rest } = req.body
    const log = await DailyLog.create({ portalId, ...rest })
    // Slack notify
    const dateStr = new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    notifySlack(portalId, 'log', `📋 Daily Log Published: ${log.title || dateStr}`,
      `${log.completedTasks} tasks completed • ${log.hoursWorked}h worked • ${log.bugsFixed} bugs fixed`)
    res.status(201).json(log)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const log = await DailyLog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!log) return res.status(404).json({ message: 'Log not found' })
    res.json(log)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await DailyLog.findByIdAndDelete(req.params.id)
    res.json({ message: 'Log deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getByPortal, getMyLogs, create, update, remove }
