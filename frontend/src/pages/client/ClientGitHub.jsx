import { useEffect, useState } from 'react'
import { githubApi, clientAuthApi } from '../../services/clientApi'

function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
  'C++': '#f34b7d', C: '#555555', 'C#': '#178600', Go: '#00ADD8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c', Shell: '#89e051', Lua: '#000080',
  Vue: '#41b883', Svelte: '#ff3e00', Elixir: '#6e4a7e', Haskell: '#5e5086',
}

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatBytes(kb) {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

// Parse GitHub URL or plain repo name into just the repo name
// e.g. "https://github.com/anshjaiswal11/portfolio_Anshjaiswal" → "portfolio_Anshjaiswal"
// e.g. "portfolio_Anshjaiswal" → "portfolio_Anshjaiswal"
function parseGithubRepo(raw) {
  if (!raw) return ''
  const trimmed = raw.trim().replace(/\/+$/, '') // remove trailing slashes
  // Match GitHub URLs: https://github.com/user/repo or github.com/user/repo
  const match = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^/]+\/([^/?#]+)/)
  if (match) return match[1]
  // If it contains slashes, take the last segment (e.g. "user/repo" → "repo")
  if (trimmed.includes('/')) return trimmed.split('/').filter(Boolean).pop() || ''
  return trimmed
}

// Also extract username from a GitHub URL if the admin stored a URL in the username field
function parseGithubUsername(raw) {
  if (!raw) return ''
  const trimmed = raw.trim().replace(/\/+$/, '')
  const match = trimmed.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)/)
  if (match) return match[1]
  return trimmed
}

export default function ClientGitHub() {
  const [portal, setPortal] = useState(getPortal())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showFullReadme, setShowFullReadme] = useState(false)
  const [isFullMode, setIsFullMode] = useState(false)

  // Refresh portal data from API on mount so GitHub fields are always up-to-date
  useEffect(() => {
    clientAuthApi.me()
      .then(r => {
        const fresh = r.data.portal
        if (fresh) {
          setPortal(fresh)
          localStorage.setItem('clientPortal', JSON.stringify(fresh))
        }
      })
      .catch(() => {}) // Silently fail, will use stale data from localStorage
  }, [])

  // Parse raw fields — handles full GitHub URLs, "user/repo", or plain names
  const username = parseGithubUsername(portal.githubUsername)
  const repo = parseGithubRepo(portal.githubRepo)

  useEffect(() => {
    if (!username) { setLoading(false); return }

    setLoading(true) // Reset loading when GitHub fields change (e.g. after portal refresh)
    setError(null)

    if (repo) {
      setIsFullMode(true)
      githubApi.getRepoInfo(username, repo)
        .then(r => setData(r.data))
        .catch(e => {
          console.error(e)
          setError(e.response?.data?.message || 'Failed to fetch repository data')
        })
        .finally(() => setLoading(false))
    } else {
      setIsFullMode(false)
      githubApi.getActivity(username)
        .then(r => setData(r.data))
        .catch(e => {
          console.error(e)
          setError(e.response?.data?.message || 'Failed to fetch GitHub data')
        })
        .finally(() => setLoading(false))
    }
  }, [username, repo])

  const S = {
    page: { padding: '32px 36px', minHeight: '100vh', background: '#0d0d14', fontFamily: "'Inter',sans-serif" },
    h1: { fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' },
    cardSmall: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px' },
    muted: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
    sectionTitle: { fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 },
  }

  if (!username) return (
    <div style={S.page}><h1 style={S.h1}>🔧 GitHub Transparency</h1>
      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 16, fontSize: 16 }}>GitHub not configured for this project.</div>
      </div>
    </div>
  )

  if (loading) return (
    <div style={S.page}>
      <h1 style={S.h1}>🔧 GitHub Transparency</h1>
      <div style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 40 }}>⏳</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>Loading repository data...</div>
      </div>
    </div>
  )

  if (error) return (
    <div style={S.page}><h1 style={S.h1}>🔧 GitHub Transparency</h1>
      <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '16px 20px', borderRadius: 12, marginTop: 24 }}>❌ {error}</div>
    </div>
  )

  const r = data?.repo
  const TABS = isFullMode
    ? [
        { id: 'overview', label: '📊 Overview' },
        { id: 'commits', label: '📝 Commits' },
        { id: 'activity', label: '⚡ Activity' },
        { id: 'readme', label: '📖 README' },
      ]
    : [
        { id: 'commits', label: '📝 Commits' },
        { id: 'activity', label: '⚡ Activity' },
      ]

  const currentTab = isFullMode ? activeTab : (activeTab === 'overview' || activeTab === 'readme' ? 'commits' : activeTab)

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={S.h1}>🔧 GitHub Transparency</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Full visibility into <span style={{ color: '#a5b4fc' }}>{username}{repo ? `/${repo}` : ' (all repos)'}</span> ·{' '}
            <a href={r?.htmlUrl || `https://github.com/${username}${repo ? `/${repo}` : ''}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>View on GitHub ↗</a>
          </p>
        </div>
        {r && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {r.isPrivate && <span style={{ fontSize: 11, background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>🔒 Private</span>}
            {r.license && <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>📄 {r.license}</span>}
            {r.isFork && <span style={{ fontSize: 11, background: 'rgba(168,85,247,0.15)', color: '#a855f7', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>🍴 Fork</span>}
          </div>
        )}
      </div>

      {/* Stat Cards — Full Mode */}
      {isFullMode && r && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { icon: '⭐', label: 'Stars', value: r.stars, color: '#f59e0b' },
            { icon: '🍴', label: 'Forks', value: r.forks, color: '#a855f7' },
            { icon: '👁', label: 'Watchers', value: r.watchers, color: '#3b82f6' },
            { icon: '🐛', label: 'Open Issues', value: r.openIssues, color: '#ef4444' },
            { icon: '🔥', label: 'Commits Today', value: data.commitsToday, color: '#f97316' },
            { icon: '📦', label: 'Size', value: formatBytes(r.size), color: '#22c55e', small: true },
          ].map((s, i) => (
            <div key={i} style={{ ...S.cardSmall, borderColor: `${s.color}20` }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: s.small ? 18 : 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Stat Cards — Basic Mode (no repo, only username) */}
      {!isFullMode && data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { icon: '🔥', label: 'Commits Today', value: data.commitsToday, color: '#f97316' },
            { icon: '📦', label: 'Recent Commits', value: data.commits?.length || 0, color: '#6366f1' },
            { icon: '📡', label: 'Recent Events', value: data.events?.length || 0, color: '#a855f7' },
            { icon: '👤', label: 'Developer', value: username, color: '#22c55e', small: true },
          ].map((s, i) => (
            <div key={i} style={{ ...S.cardSmall, borderColor: `${s.color}20` }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: s.small ? 16 : 28, fontWeight: 800, color: s.color, wordBreak: 'break-all' }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Repo Description + Topics (full mode only) */}
      {isFullMode && r?.description && (
        <div style={{ ...S.card, marginBottom: 20 }}>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>{r.description}</p>
          {r.topics?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
              {r.topics.map(t => (
                <span key={t} style={{ fontSize: 11, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: currentTab === t.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
            background: currentTab === t.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
            color: currentTab === t.id ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
            whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW TAB (full mode only) ── */}
      {currentTab === 'overview' && isFullMode && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Tech Stack */}
          {data?.languages?.length > 0 && (
            <div>
              <div style={S.sectionTitle}><span>💻</span> Tech Stack & Languages</div>
              <div style={{ display: 'flex', height: 10, borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
                {data?.languages.map(l => (
                  <div key={l.name} style={{ width: `${l.percentage}%`, background: LANG_COLORS[l.name] || '#6366f1', minWidth: 2 }} title={`${l.name}: ${l.percentage}%`} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                {data?.languages.map(l => (
                  <div key={l.name} style={{ ...S.cardSmall, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: LANG_COLORS[l.name] || '#6366f1', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{l.name}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: LANG_COLORS[l.name] || '#a5b4fc' }}>{l.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contributors */}
          {data?.contributors?.length > 0 && (
            <div>
              <div style={S.sectionTitle}><span>👥</span> Contributors ({data?.contributors.length})</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {data?.contributors.map(c => (
                  <a key={c.login} href={c.profileUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{ ...S.cardSmall, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', transition: 'all 0.2s', cursor: 'pointer' }}>
                      <img src={c.avatar} alt={c.login} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.3)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{c.login}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.contributions} commits</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Repo Details */}
          {r && (
            <div>
              <div style={S.sectionTitle}><span>📋</span> Repository Details</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {[
                  { label: 'Default Branch', value: r.defaultBranch, icon: '🌿' },
                  { label: 'Primary Language', value: r.language || 'N/A', icon: '💻' },
                  { label: 'Created', value: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: '📅' },
                  { label: 'Last Updated', value: timeAgo(r.updatedAt), icon: '🕐' },
                  { label: 'Last Push', value: timeAgo(r.pushedAt), icon: '🚀' },
                  { label: 'Repository Size', value: formatBytes(r.size), icon: '💾' },
                ].map((item, i) => (
                  <div key={i} style={{ ...S.cardSmall, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginTop: 2 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── COMMITS TAB ── */}
      {currentTab === 'commits' && (
        <div>
          <div style={S.sectionTitle}><span>📝</span> Recent Commits ({data?.commits?.length || 0})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(!data?.commits || data.commits.length === 0) ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No commits found.</div>
            ) : data.commits.map((c, i) => (
              <div key={i} style={{ ...S.cardSmall, display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 18px' }}>
                {c.authorAvatar && (
                  <img src={c.authorAvatar} alt={c.author} style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginTop: 2 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <code style={{ fontSize: 11, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace', flexShrink: 0 }}>{c.sha}</code>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{timeAgo(c.date)}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.5, wordBreak: 'break-word' }}>{c.message.split('\n')[0]}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 5, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span>👤 {c.author}</span>
                    {c.additions != null && <span style={{ color: '#22c55e' }}>+{c.additions}</span>}
                    {c.deletions != null && <span style={{ color: '#ef4444' }}>-{c.deletions}</span>}
                  </div>
                </div>
                {c.url && <a href={c.url} target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontSize: 14, textDecoration: 'none', flexShrink: 0, padding: '4px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.1)' }}>↗</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ── */}
      {currentTab === 'activity' && (
        <div>
          <div style={S.sectionTitle}><span>⚡</span> Activity Feed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(!data?.events || data.events.length === 0) ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No recent activity.</div>
            ) : data.events.map(ev => {
              let icon = '✨', desc = ev.type, color = '#a5b4fc'
              if (ev.type === 'PushEvent') {
                icon = '🔧'; desc = `Pushed ${ev.payload.commits} commit(s) to ${ev.payload.ref?.replace('refs/heads/','')}` ; color = '#22c55e'
              } else if (ev.type === 'PullRequestEvent') {
                icon = '🔀'; desc = `${ev.payload.action === 'opened' ? 'Opened' : ev.payload.action} PR: ${ev.payload.title}`; color = '#a855f7'
              } else if (ev.type === 'IssuesEvent') {
                icon = '🐛'; desc = `${ev.payload.action === 'opened' ? 'Opened' : ev.payload.action} Issue: ${ev.payload.title}`; color = '#ef4444'
              } else if (ev.type === 'CreateEvent') {
                icon = '🎉'; desc = `Created ${ev.payload.ref_type} ${ev.payload.ref || ''}`; color = '#f59e0b'
              }

              return (
                <div key={ev.id} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{desc}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{ev.repo} · {timeAgo(ev.date)}</div>
                  </div>
                  {ev.payload.url && <a href={ev.payload.url} target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontSize: 12, textDecoration: 'none', padding: '4px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.1)' }}>↗</a>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── README TAB (full mode only) ── */}
      {currentTab === 'readme' && isFullMode && (
        <div>
          <div style={S.sectionTitle}><span>📖</span> README.md</div>
          {data?.readme ? (
            <div style={{ ...S.card, position: 'relative' }}>
              <pre style={{
                fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                wordBreak: 'break-word', fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                maxHeight: showFullReadme ? 'none' : 500, overflow: 'hidden', margin: 0,
              }}>
                {data.readme}
              </pre>
              {data.readme.length > 1500 && !showFullReadme && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(transparent, rgba(13,13,20,0.95))', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 16, borderRadius: '0 0 16px 16px' }}>
                  <button onClick={() => setShowFullReadme(true)} style={{
                    padding: '8px 24px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.15)',
                    color: '#a5b4fc', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>Show Full README</button>
                </div>
              )}
              {showFullReadme && data.readme.length > 1500 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button onClick={() => setShowFullReadme(false)} style={{
                    padding: '6px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer',
                  }}>Collapse</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
              No README found in this repository.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
