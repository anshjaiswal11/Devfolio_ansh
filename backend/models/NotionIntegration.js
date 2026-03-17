const mongoose = require('mongoose')

const notionSchema = new mongoose.Schema({
  portalId:     { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPortal', required: true, unique: true },
  embedUrl:     { type: String, default: '' },         // public embed URL for iframe
  notionToken:  { type: String, default: '', select: false }, // integration token
  databaseId:   { type: String, default: '' },         // Notion database ID for task sync
  syncTasks:    { type: Boolean, default: false },
  lastSyncedAt: { type: Date },
  syncedTasks:  [{ notionId: String, title: String, status: String, url: String }],
}, { timestamps: true })

module.exports = mongoose.model('NotionIntegration', notionSchema)
