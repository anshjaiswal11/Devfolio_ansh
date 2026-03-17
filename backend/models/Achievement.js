const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  issuer: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  credentialUrl: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

module.exports = mongoose.model('Achievement', achievementSchema)
