import { useEffect, useState } from 'react'
import { notionApi } from '../../services/clientApi'

function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

const STATUS_COLOR = {
  'Not started': '#94a3b8', 'In progress': '#3b82f6', 'Done': '#22c55e',
  'To Do': '#94a3b8', 'Doing': '#3b82f6', 'Completed': '#22c55e',
}

export default function ClientNotion() {
  const portal = getPortal()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notionApi.getConfig(portal._id).then(r => setConfig(r.data)).catch(console.error).finally(()=>setLoading(false))
  }, [portal._id])

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  if (loading) return <div style={{...P, textAlign:'center', paddingTop:80, fontSize:32}}>⏳</div>

  if (!config?.embedUrl && !config?.syncTasks) return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>📝 Notion Integration</h1>
      <div style={{ textAlign:'center', paddingTop:80 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📝</div>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:16 }}>Notion is not linked for this project.</div>
      </div>
    </div>
  )

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>📝 Notion Workspace</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Embedded Notion docs and synced database tasks.</p>

      {/* Embedded Iframe */}
      {config.embedUrl && (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, overflow:'hidden', marginBottom:40, height:600, boxShadow:'0 16px 32px rgba(0,0,0,0.5)' }}>
          <iframe src={config.embedUrl} width="100%" height="100%" frameBorder="0" style={{ display:'block' }} title="Notion Embed" />
        </div>
      )}

      {/* Synced tasks */}
      {config.syncTasks && config.syncedTasks?.length > 0 && (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700, color:'#e2e8f0', margin:0 }}>✅ Synced Notion Tasks</h2>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Last synced: {config.lastSyncedAt ? new Date(config.lastSyncedAt).toLocaleString('en-IN') : 'Never'}</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:16, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
              <thead>
                <tr style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding:'14px 20px', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)' }}>Task Name</th>
                  <th style={{ padding:'14px 20px', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', width:150 }}>Status</th>
                  <th style={{ padding:'14px 20px', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', width:100, textAlign:'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {config.syncedTasks.map(t => (
                  <tr key={t.notionId} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding:'16px 20px', fontSize:15, fontWeight:500, color:'#fff' }}>{t.title}</td>
                    <td style={{ padding:'16px 20px' }}>
                      <span style={{ fontSize:12, padding:'4px 12px', borderRadius:20, background:`${STATUS_COLOR[t.status]||'#a5b4fc'}25`, color: STATUS_COLOR[t.status]||'#a5b4fc', fontWeight:600 }}>{t.status}</span>
                    </td>
                    <td style={{ padding:'16px 20px', textAlign:'right' }}>
                      <a href={t.url} target="_blank" rel="noreferrer" style={{ fontSize:13, color:'#6366f1', textDecoration:'none', fontWeight:600 }}>Open ↗</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
