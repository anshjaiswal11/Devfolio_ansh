const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const experienceSchema = new mongoose.Schema({
  role:    { type: String, default: '' },
  company: { type: String, default: '' },
  period:  { type: String, default: '' },
  desc:    { type: String, default: '' },
}, { _id: false })

const educationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  school: { type: String, default: '' },
  year:   { type: String, default: '' },
  note:   { type: String, default: '' },
}, { _id: false })

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true, maxlength: 80 },
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:       { type: String, required: true, minlength: 8, select: false },
  bio:            { type: String, maxlength: 2000, default: '' },
  tagline:        { type: String, maxlength: 200, default: '' },
  location:       { type: String, maxlength: 100, default: '' },
  profileImage:   { type: String, default: '' },
  resumeUrl:      { type: String, default: '' },
  skills:         [{ type: String }],
  tools:          [{ type: String }],
  role:           { type: String, enum: ['user', 'admin'], default: 'user' },
  socialLinks: {
    github:   { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter:  { type: String, default: '' },
    website:  { type: String, default: '' },
  },
  experience:  [experienceSchema],
  education:   [educationSchema],
  // Coding platform usernames for stats
  githubUsername:   { type: String, default: '' },
  leetcodeUsername: { type: String, default: '' },
  gfgUsername:      { type: String, default: '' },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('User', userSchema)
