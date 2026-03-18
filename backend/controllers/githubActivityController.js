const axios = require('axios')
const { notifySlack } = require('../utils/slackNotify')

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
            } : e.type === 'IssuesEvent' ? {
              action: e.payload.action,
              title:  e.payload.issue?.title,
              url:    e.payload.issue?.html_url,
            } : e.type === 'CreateEvent' ? {
              ref: e.payload.ref,
              ref_type: e.payload.ref_type,
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

// POST /api/github-activity/webhook/:portalId
const handleWebhook = async (req, res) => {
  try {
    const { portalId } = req.params;
    const event = req.headers['x-github-event'];
    const payload = req.body;

    if (event === 'push') {
      const commitCount = payload.commits?.length || 0;
      const ref = payload.ref?.replace('refs/heads/', '') || 'branch';
      const repoName = payload.repository?.name || 'repo';
      const message = `Pushed ${commitCount} commit(s) to ${ref} in ${repoName}`;
      
      const details = payload.commits?.slice(0, 3).map(c => `- ${c.message}`).join('\n') + (commitCount > 3 ? `\n...and ${commitCount - 3} more` : '');

      await notifySlack(portalId, 'github', `🔧 GitHub Code Push: ${repoName}`, details);
    } 
    else if (event === 'issues') {
      const action = payload.action; // opened, closed, etc.
      const issueTitle = payload.issue?.title || 'Unknown Issue';
      const repoName = payload.repository?.name || 'repo';

      await notifySlack(portalId, 'github', `🐛 GitHub Issue ${action}: ${issueTitle} (${repoName})`, payload.issue?.html_url || '');
    }
    else if (event === 'pull_request') {
      const action = payload.action;
      const prTitle = payload.pull_request?.title || 'Unknown PR';
      const repoName = payload.repository?.name || 'repo';

      await notifySlack(portalId, 'github', `🔀 GitHub PR ${action}: ${prTitle} (${repoName})`, payload.pull_request?.html_url || '');
    }

    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('[GitHub Webhook Error]', err.message);
    res.status(500).send('Error processing webhook');
  }
}

module.exports = { getActivity, handleWebhook }
