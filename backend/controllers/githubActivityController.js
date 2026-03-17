const axios = require('axios')

// GET /api/github-activity/:username/:repo?page=1
const getActivity = async (req, res) => {
  const { username, repo } = req.params
  const { page = 1 } = req.query

  if (!username) return res.status(400).json({ message: 'GitHub username required' })

  try {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [commitsRes, eventsRes] = await Promise.allSettled([
      // Recent commits from a specific repo
      repo ? axios.get(`https://api.github.com/repos/${username}/${repo}/commits?per_page=20&page=${page}`, { headers, timeout: 8000 }) : Promise.resolve(null),
      // User events
      axios.get(`https://api.github.com/users/${username}/events?per_page=30`, { headers, timeout: 8000 }),
    ])

    const commits = (commitsRes.status === 'fulfilled' && commitsRes.value)
      ? commitsRes.value.data.map(c => ({
          sha:     c.sha?.substring(0, 7),
          message: c.commit.message,
          author:  c.commit.author.name,
          date:    c.commit.author.date,
          url:     c.html_url,
          additions: c.stats?.additions,
          deletions:  c.stats?.deletions,
        }))
      : []

    const events = eventsRes.status === 'fulfilled'
      ? eventsRes.value.data
          .filter(e => ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type))
          .map(e => ({
            id:      e.id,
            type:    e.type,
            repo:    e.repo.name,
            date:    e.created_at,
            payload: e.type === 'PushEvent' ? {
              commits: e.payload.commits?.length || 0,
              ref:     e.payload.ref,
            } : e.type === 'PullRequestEvent' ? {
              action: e.payload.action,
              title:  e.payload.pull_request?.title,
              url:    e.payload.pull_request?.html_url,
            } : {},
          }))
      : []

    // Quick stats
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const commitsToday = events.filter(e =>
      e.type === 'PushEvent' && new Date(e.date) >= today
    ).reduce((s, e) => s + (e.payload.commits || 0), 0)

    res.json({ commits, events, commitsToday, username, repo })
  } catch (err) {
    console.error('[GitHub]', err.message)
    res.status(502).json({ message: 'Failed to fetch GitHub data', error: err.message })
  }
}

module.exports = { getActivity }
