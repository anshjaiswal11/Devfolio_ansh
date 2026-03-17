const Release = require('../models/Release')
const { notifySlack } = require('../utils/slackNotify')

const getByPortal = async (req, res) => {
  try {
    const releases = await Release.find({ portalId: req.params.portalId }).sort({ releaseDate: -1 })
    res.json(releases)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Clients only see published releases
const getMyReleases = async (req, res) => {
  try {
    const releases = await Release.find({ portalId: req.portal._id, isPublished: true }).sort({ releaseDate: -1 })
    res.json(releases)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const release = await Release.create(req.body)
    if (release.isPublished) {
      notifySlack(req.body.portalId, 'release',
        `📦 New Release: ${release.version} — ${release.title}`,
        `${release.feats.length} new features • ${release.fixes.length} fixes`)
    }
    res.status(201).json(release)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const existing = await Release.findById(req.params.id)
    const release = await Release.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!release) return res.status(404).json({ message: 'Release not found' })
    // Notify when publishing for the first time
    if (!existing.isPublished && release.isPublished) {
      notifySlack(release.portalId, 'release',
        `📦 Release Published: ${release.version} — ${release.title}`,
        `${release.feats.length} new features • ${release.fixes.length} fixes`)
    }
    res.json(release)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    await Release.findByIdAndDelete(req.params.id)
    res.json({ message: 'Release deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getByPortal, getMyReleases, create, update, remove }
