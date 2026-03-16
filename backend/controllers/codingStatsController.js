const axios = require('axios')
const User = require('../models/User')

// GET /api/coding — returns merged GitHub + LeetCode + GFG stats
exports.getStats = async (req, res) => {
  try {
    // Get usernames from the admin user
    const user = await User.findOne().sort({ updatedAt: -1 }).select('githubUsername leetcodeUsername gfgUsername name')
    if (!user) return res.status(404).json({ message: 'No profile found' })

    const { githubUsername, leetcodeUsername, gfgUsername } = user

    const results = { github: null, leetcode: null, gfg: null }
    const errors = {}

    // Fetch in parallel
    await Promise.allSettled([
      // GitHub stats
      githubUsername
        ? axios.get(`https://api.github.com/users/${githubUsername}`, {
            headers: { 'User-Agent': 'portfolio-app' },
            timeout: 8000,
          }).then(r => {
            results.github = {
              username: r.data.login,
              name: r.data.name,
              avatar: r.data.avatar_url,
              bio: r.data.bio,
              publicRepos: r.data.public_repos,
              followers: r.data.followers,
              following: r.data.following,
              profileUrl: r.data.html_url,
            }
          }).catch(e => { errors.github = e.message })
        : Promise.resolve(),

      // LeetCode stats via reliable API
      leetcodeUsername
        ? Promise.all([
            axios.get(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}`, { timeout: 12000 }),
            axios.get(`https://alfa-leetcode-api.onrender.com/${leetcodeUsername}/solved`, { timeout: 12000 })
          ]).then(([profileRes, solvedRes]) => {
            if (profileRes.data.errors || solvedRes.data.errors) {
              errors.leetcode = 'User not found'; return
            }
            results.leetcode = {
              username: leetcodeUsername,
              totalSolved: solvedRes.data.solvedProblem,
              totalQuestions: 3300, // Appx total on Leetcode
              easySolved: solvedRes.data.easySolved,
              mediumSolved: solvedRes.data.mediumSolved,
              hardSolved: solvedRes.data.hardSolved,
              ranking: profileRes.data.ranking,
              acceptanceRate: null, // Not easily available in this endpoint, omitting to prevent frontend crash
              profileUrl: `https://leetcode.com/${leetcodeUsername}`,
            }
          }).catch(e => { errors.leetcode = e.message })
        : Promise.resolve(),

      // GFG stats via unofficial API
      gfgUsername
        ? axios.get(`https://geeks-for-geeks-stats-api-napiyo.vercel.app/?userName=${gfgUsername}`, { timeout: 8000 })
          .then(r => {
            if (r.data.info) {
              results.gfg = {
                username: gfgUsername,
                name: r.data.info?.userName,
                rank: r.data.info?.rank,
                currentStreak: r.data.info?.currentStreak,
                maxStreak: r.data.info?.maxStreak,
                codingScore: r.data.info?.codingScore,
                totalProblemsSolved: r.data.info?.totalProblemsSolved,
                easy: r.data.solvedStats?.easy?.count || 0,
                medium: r.data.solvedStats?.medium?.count || 0,
                hard: r.data.solvedStats?.hard?.count || 0,
                profileUrl: `https://auth.geeksforgeeks.org/user/${gfgUsername}`,
              }
            } else {
              errors.gfg = 'User not found'
            }
          }).catch(e => { errors.gfg = e.message })
        : Promise.resolve(),
    ])

    res.json({ stats: results, errors, usernames: { githubUsername, leetcodeUsername, gfgUsername } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
