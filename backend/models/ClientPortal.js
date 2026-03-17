const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const milestoneSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  dueDate:     { type: Date },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { _id: true, timestamps: false })

const clientPortalSchema = new mongoose.Schema({
  clientName:          { type: String, required: true, trim: true },
  gmail:               { type: String, required: true, lowercase: true, trim: true, unique: true },
  passkey:             { type: String, required: true, select: false },
  projectName:         { type: String, required: true, trim: true },
  projectDescription:  { type: String, default: '' },
  githubUsername:      { type: String, default: '' },
  githubRepo:          { type: String, default: '' },
  progressPercent:     { type: Number, default: 0, min: 0, max: 100 },
  estimatedDelivery:   { type: Date },
  milestones:          [milestoneSchema],
  isActive:            { type: Boolean, default: true },
  logoUrl:             { type: String, default: '' },
  accentColor:         { type: String, default: '#6366f1' },
}, { timestamps: true })

// Hash passkey before save
clientPortalSchema.pre('save', async function (next) {
  if (!this.isModified('passkey')) return next()
  this.passkey = await bcrypt.hash(this.passkey, 12)
  next()
})

clientPortalSchema.methods.comparePasskey = async function (candidate) {
  return bcrypt.compare(candidate, this.passkey)
}

module.exports = mongoose.model('ClientPortal', clientPortalSchema)
