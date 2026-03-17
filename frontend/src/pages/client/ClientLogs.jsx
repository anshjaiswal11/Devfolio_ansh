import { useEffect, useState } from 'react'
import { dailyLogsApi } from '../../services/clientApi'

const TYPE_ICON = { completed: '✅', progress: '🔄', blocker: '🚫', note: '📌' }

export default function ClientLogs() {
  const [logs, setLogs] = useState([])
  const [open, setOpen] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dailyLogsApi.getMy().then(r => {
      setLogs(r.data)
      if (r.data[0]) setOpen({ [r.data[0]._id]: true })
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const toggle = id => setOpen(v => ({ ...v, [id]: !v[id] }))

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh', background: '#0d0d14', fontFamily: "'Inter',sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>📋 Daily Development Logs</h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 32px' }}>{logs.length} entries · Updated daily by your developer</p>

      {loading ? <div style={{ textAlign:'center', paddingTop:80, fontSize:32 }}>⏳</div>
       : logs.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:80 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:16 }}>No logs yet — your developer will add daily reports here.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {logs.map(log => {
            const date = new Date(log.date)
            const label = date.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
            const isToday = date.toDateString() === new Date().toDateString()
            const isOpen = open[log._id]
            return (
              <div key={log._id} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${isToday ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius:16, overflow:'hidden' }}>
                <button onClick={() => toggle(log._id)} style={{
                  width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px',
                  background:'none', border:'none', cursor:'pointer', color:'#fff', textAlign:'left',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:12,
                      background: isToday ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.07)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                      {isToday ? '⭐' : '📅'}
                    </div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0' }}>
                        {log.title || label} {isToday && <span style={{ fontSize:11, background:'rgba(99,102,241,0.2)', color:'#a5b4fc', padding:'2px 8px', borderRadius:20, marginLeft:8 }}>TODAY</span>}
                      </div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:3 }}>{label}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:18, fontWeight:800, color:'#22c55e' }}>{log.completedTasks}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>tasks</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:18, fontWeight:800, color:'#6366f1' }}>{log.commits}</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>commits</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:18, fontWeight:800, color:'#a855f7' }}>{log.hoursWorked}h</div>
                      <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>hours</div>
                    </div>
                    <span style={{ fontSize:18, color:'rgba(255,255,255,0.3)', transition:'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{ padding:'0 24px 20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ paddingTop:16, display:'flex', flexDirection:'column', gap:10 }}>
                      {log.items?.length === 0 && <div style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>No details added.</div>}
                      {log.items?.map((item, i) => (
                        <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                          <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{TYPE_ICON[item.type] || '📌'}</span>
                          <div style={{ fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6 }}>{item.text}</div>
                        </div>
                      ))}
                      {log.bugsFixed > 0 && (
                        <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.12)', padding:'6px 14px', borderRadius:8 }}>
                          <span>🐞</span><span style={{ fontSize:13, color:'#fca5a5' }}>{log.bugsFixed} bug{log.bugsFixed > 1 ? 's' : ''} fixed</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
