import { useEffect, useState } from 'react'
import { githubApi } from '../../services/clientApi'

function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

export default function ClientGitHub() {
  const portal = getPortal()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const username = portal.githubUsername
  const repo = portal.githubRepo

  useEffect(() => {
    if (!username) { setLoading(false); return }
    githubApi.getActivity(username, repo)
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to fetch'))
      .finally(() => setLoading(false))
  }, [username, repo])

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }
  const H = { fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }

  if (!username) return (
    <div style={P}><h1 style={H}>🔧 GitHub Activity</h1>
      <div style={{ marginTop:60, textAlign:'center' }}>
        <div style={{ fontSize:48 }}>🔒</div>
        <div style={{ color:'rgba(255,255,255,0.4)', marginTop:16 }}>GitHub not configured for this project.</div>
      </div>
    </div>
  )

  return (
    <div style={P}>
      <h1 style={H}>🔧 GitHub Activity</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>
        {username}/{repo || '(all repos)'} ·{' '}
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" style={{ color:'#6366f1' }}>View on GitHub ↗</a>
      </p>

      {loading && <div style={{ textAlign:'center', paddingTop:80, fontSize:32 }}>⏳</div>}
      {error && <div style={{ color:'#f87171', background:'rgba(239,68,68,0.1)', padding:'16px 20px', borderRadius:12 }}>❌ {error}</div>}

      {data && (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:32 }}>
            {[
              { icon:'🔥', label:'Commits Today', value: data.commitsToday, color:'#f97316' },
              { icon:'📦', label:'Recent Commits', value: data.commits?.length || 0, color:'#6366f1' },
              { icon:'📡', label:'Recent Events', value: data.events?.length || 0, color:'#a855f7' },
              { icon:'👤', label:'Developer', value: username, color:'#22c55e', small:true },
            ].map((s,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${s.color}25`, borderRadius:16, padding:'20px 22px' }}>
                <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}><span style={{ fontSize:22 }}>{s.icon}</span><span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{s.label}</span></div>
                <div style={{ fontSize: s.small ? 16 : 32, fontWeight:800, color:s.color, wordBreak:'break-all' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Recent commits */}
          {data.commits?.length > 0 && (
            <>
              <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:14 }}>📝 Recent Commits</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
                {data.commits.slice(0,15).map((c,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'14px 18px', display:'flex', gap:14, alignItems:'flex-start' }}>
                    <code style={{ fontSize:12, background:'rgba(99,102,241,0.2)', color:'#a5b4fc', padding:'3px 8px', borderRadius:6, flexShrink:0, fontFamily:'monospace' }}>{c.sha}</code>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, color:'#e2e8f0', lineHeight:1.4 }}>{c.message.split('\n')[0]}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:5, display:'flex', gap:16 }}>
                        <span>👤 {c.author}</span>
                        <span>🕐 {new Date(c.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                      </div>
                    </div>
                    {c.url && <a href={c.url} target="_blank" rel="noreferrer" style={{ color:'#6366f1', fontSize:12, textDecoration:'none', flexShrink:0 }}>↗</a>}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Events */}
          {data.events?.length > 0 && (
            <>
              <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:14 }}>⚡ Activity Feed</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {data.events.slice(0,20).map(ev => {
                  const icon = ev.type === 'PushEvent' ? '🔧' : ev.type === 'PullRequestEvent' ? '🔀' : ev.type === 'IssuesEvent' ? '🐛' : '✨'
                  const desc = ev.type === 'PushEvent' ? `Pushed ${ev.payload.commits} commit(s) to ${ev.payload.ref?.replace('refs/heads/','')}` :
                    ev.type === 'PullRequestEvent' ? `${ev.payload.action} PR: ${ev.payload.title}` : ev.type
                  return (
                    <div key={ev.id} style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10 }}>
                      <span style={{ fontSize:18 }}>{icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)' }}>{desc}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:3 }}>{ev.repo} · {new Date(ev.date).toLocaleDateString('en-IN')}</div>
                      </div>
                      {ev.payload.url && <a href={ev.payload.url} target="_blank" rel="noreferrer" style={{ color:'#6366f1', fontSize:12 }}>↗</a>}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
