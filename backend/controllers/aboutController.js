const User = require('../models/User')

// GET /api/about — returns the first admin user's public profile
exports.getAbout = async (req, res) => {
  try {
    const user = await User.findOne().sort({ updatedAt: -1 }).select(
      'name tagline bio location profileImage skills tools socialLinks experience education resumeUrl githubUsername leetcodeUsername gfgUsername'
    )
    if (!user) return res.status(404).json({ message: 'No profile found' })
    res.json({ about: user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/about — admin updates their own profile
exports.updateAbout = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'tagline', 'bio', 'location', 'profileImage',
      'skills', 'tools', 'socialLinks', 'experience', 'education', 'resumeUrl',
      'githubUsername', 'leetcodeUsername', 'gfgUsername',
    ]
    const update = {}
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) update[f] = req.body[f]
    })
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true })
    res.json({ about: user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
