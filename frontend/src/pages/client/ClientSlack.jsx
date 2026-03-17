import { useEffect, useState } from 'react'
import { slackApi } from '../../services/clientApi'

function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

export default function ClientSlack() {
  const portal = getPortal()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    slackApi.getConfig(portal._id).then(r => setConfig(r.data)).catch(console.error).finally(()=>setLoading(false))
  }, [portal._id])

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>💼 Slack Notifications</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>See which project events are broadcasted to your team's Slack channel.</p>

      {loading ? <div style={{ textAlign:'center', paddingTop:60, fontSize:32 }}>⏳</div> :
       !config?.isActive ? (
        <div style={{ textAlign:'center', paddingTop:60, maxWidth:500, margin:'0 auto' }}>
          <div style={{ display:'inline-block', padding:24, background:'rgba(255,255,255,0.03)', borderRadius:24, marginBottom:20, border:'1px solid rgba(255,255,255,0.08)' }}>
            <svg viewBox="0 0 24 24" width="64" height="64" fill="url(#slackGrad)"><defs><linearGradient id="slackGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e5a823"/><stop offset="50%" stopColor="#e01e5a"/><stop offset="100%" stopColor="#36c5f0"/></linearGradient></defs><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.522v-2.522h2.523zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.523-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
          </div>
          <h2 style={{ fontSize:22, color:'#fff', margin:'0 0 10px' }}>Slack is not configured</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', lineHeight:1.6 }}>Your developer has not linked a Slack channel for this project yet. If you'd like automatic updates sent to your team's Slack, ask them to set it up.</p>
        </div>
      ) : (
        <div style={{ maxWidth:600 }}>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'28px', marginBottom:32 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <svg viewBox="0 0 24 24" width="40" height="40" fill="#e01e5a"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.522v-2.522h2.523zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.523-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:'#fff' }}>Connected to Slack</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', marginTop:2 }}>Target channel: <span style={{ color:'#a5b4fc' }}>#{config.channelName || 'general'}</span></div>
              </div>
            </div>
            
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:24 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16 }}>Active Notification Triggers</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { k:'notifyOnLog', icon:'📋', title:'Daily Logs Published' },
                  { k:'notifyOnMilestone', icon:'🚀', title:'Milestones Reached' },
                  { k:'notifyOnFeedback', icon:'💬', title:'New Feedback Submitted' },
                  { k:'notifyOnRelease', icon:'📦', title:'Releases Published' },
                  { k:'notifyOnBug', icon:'🐞', title:'Bug Status Changed' },
                ].map(t => (
                  <div key={t.k} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'rgba(255,255,255,0.02)', borderRadius:12 }}>
                    <span style={{ fontSize:20 }}>{t.icon}</span>
                    <span style={{ flex:1, fontSize:15, color:'#e2e8f0', fontWeight:500 }}>{t.title}</span>
                    <div style={{ width:44, height:24, borderRadius:20, background: config[t.k] ? '#22c55e' : 'rgba(255,255,255,0.1)', position:'relative', transition:'all 0.3s' }}>
                      <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left: config[t.k] ? 22 : 3, transition:'all 0.3s', boxShadow:'0 2px 4px rgba(0,0,0,0.2)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:24, fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center' }}>To change these settings, please contact your developer.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
