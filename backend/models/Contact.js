const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true, maxlength: 80 },
  email:   { type: String, required: true, lowercase: true, trim: true },
  message: { type: String, required: true, minlength: 20, maxlength: 2000 },
  read:    { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Contact', contactSchema)
