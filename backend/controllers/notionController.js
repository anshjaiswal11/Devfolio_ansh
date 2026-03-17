const NotionIntegration = require('../models/NotionIntegration')
const axios = require('axios')

const getConfig = async (req, res) => {
  try {
    const notion = await NotionIntegration.findOne({ portalId: req.params.portalId })
    if (!notion) return res.json({ embedUrl: '', syncTasks: false, syncedTasks: [], lastSyncedAt: null, databaseId: '' })
    // Don't expose token to client
    const { notionToken: _, ...safe } = notion.toObject()
    res.json(safe)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const upsertConfig = async (req, res) => {
  try {
    const { portalId } = req.params
    const { embedUrl, notionToken, databaseId, syncTasks } = req.body
    const notion = await NotionIntegration.findOneAndUpdate(
      { portalId },
      { embedUrl, notionToken, databaseId, syncTasks },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    res.json({ message: 'Notion config saved', embedUrl: notion.embedUrl, syncTasks: notion.syncTasks })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Admin: sync tasks from Notion database
const syncTasks = async (req, res) => {
  try {
    const notion = await NotionIntegration.findOne({ portalId: req.params.portalId }).select('+notionToken')
    if (!notion || !notion.notionToken || !notion.databaseId) {
      return res.status(400).json({ message: 'Notion token and database ID are required' })
    }

    const response = await axios.post(
      `https://api.notion.com/v1/databases/${notion.databaseId}/query`,
      { page_size: 100 },
      {
        headers: {
          'Authorization': `Bearer ${notion.notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    )

    const syncedTasks = response.data.results.map(page => {
      const titleProp = Object.values(page.properties).find(p => p.type === 'title')
      const statusProp = Object.values(page.properties).find(p => p.id === 'status' || p.type === 'status' || p.type === 'select')
      return {
        notionId: page.id,
        title:    titleProp?.title?.[0]?.plain_text || 'Untitled',
        status:   statusProp?.status?.name || statusProp?.select?.name || 'Unknown',
        url:      page.url,
      }
    })

    notion.syncedTasks = syncedTasks
    notion.lastSyncedAt = new Date()
    await notion.save()

    res.json({ message: `Synced ${syncedTasks.length} tasks from Notion`, syncedTasks, lastSyncedAt: notion.lastSyncedAt })
  } catch (err) {
    console.error('[Notion]', err.message)
    res.status(502).json({ message: 'Failed to sync from Notion', error: err.response?.data?.message || err.message })
  }
}

module.exports = { getConfig, upsertConfig, syncTasks }
