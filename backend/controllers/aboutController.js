const User = require('../models/User')

let cachedAbout = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// GET /api/about — returns the portfolio owner's public profile
exports.getAbout = async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400')
    
    const now = Date.now()
    if (cachedAbout && (now - cacheTimestamp < CACHE_TTL_MS)) {
      return res.json({ about: cachedAbout })
    }

    let user = await User.findOne({
      $or: [
        { email: 'anshjaiswal1804@gmail.com' },
        { name: /Ansh Jaiswal/i }
      ]
    }).select(
      'name tagline bio location profileImage skills tools socialLinks experience education resumeUrl githubUsername leetcodeUsername gfgUsername'
    )

    if (!user) {
      user = await User.findOne({ role: 'admin' }).select(
        'name tagline bio location profileImage skills tools socialLinks experience education resumeUrl githubUsername leetcodeUsername gfgUsername'
      )
    }

    if (!user) {
      user = await User.findOne().sort({ updatedAt: -1 }).select(
        'name tagline bio location profileImage skills tools socialLinks experience education resumeUrl githubUsername leetcodeUsername gfgUsername'
      )
    }

    if (!user) return res.status(404).json({ message: 'No profile found' })

    cachedAbout = user
    cacheTimestamp = now

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
    
    // Invalidate cache
    cachedAbout = null
    cacheTimestamp = 0

    res.json({ about: user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
