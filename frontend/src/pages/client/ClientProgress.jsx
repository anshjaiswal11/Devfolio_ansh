function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

export default function ClientProgress() {
  const portal = getPortal()
  const pct = portal.progressPercent || 0
  const milestones = portal.milestones || []
  const done = milestones.filter(m => m.isCompleted).length

  const delivery = portal.estimatedDelivery
    ? new Date(portal.estimatedDelivery)
    : null

  const daysLeft = delivery
    ? Math.max(0, Math.ceil((delivery - Date.now()) / 86400000))
    : null

  const pageStyle = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>📈 Project Progress</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Live progress for {portal.projectName}</p>

      {/* Big progress bar */}
      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:20, padding:'32px 36px', marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16 }}>
          <span style={{ fontSize:18, fontWeight:700, color:'#e2e8f0' }}>Overall Completion</span>
          <span style={{ fontSize:42, fontWeight:900, color:'#6366f1', letterSpacing:'-2px' }}>{pct}<span style={{ fontSize:24 }}>%</span></span>
        </div>
        <div style={{ height:18, background:'rgba(255,255,255,0.07)', borderRadius:100, overflow:'hidden', marginBottom:10 }}>
          <div style={{ height:'100%', width:`${pct}%`, borderRadius:100,
            background:'linear-gradient(90deg,#6366f1,#a855f7,#ec4899)',
            transition:'width 1.5s cubic-bezier(.4,0,.2,1)',
            boxShadow:'0 0 16px rgba(99,102,241,0.5)',
          }} />
        </div>
        <div style={{ display:'flex', gap:32 }}>
          <div><span style={{ fontSize:24, fontWeight:800, color:'#22c55e' }}>{done}</span><span style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginLeft:6 }}>milestones completed</span></div>
          <div><span style={{ fontSize:24, fontWeight:800, color:'#94a3b8' }}>{milestones.length - done}</span><span style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginLeft:6 }}>remaining</span></div>
          {daysLeft !== null && <div><span style={{ fontSize:24, fontWeight:800, color:'#f59e0b' }}>{daysLeft}</span><span style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginLeft:6 }}>days left</span></div>}
        </div>
      </div>

      {/* Delivery card */}
      {delivery && (
        <div style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.12))', border:'1px solid rgba(99,102,241,0.25)', borderRadius:16, padding:'20px 24px', marginBottom:28, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>🎯 Estimated Delivery</div>
            <div style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{delivery.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Time remaining</div>
            <div style={{ fontSize:22, fontWeight:800, color:daysLeft < 7 ? '#ef4444' : '#22c55e' }}>{daysLeft} days</div>
          </div>
        </div>
      )}

      {/* Milestone timeline */}
      <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:16 }}>🎯 Milestone Timeline</div>
      {milestones.length === 0 && <div style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>No milestones added yet.</div>}
      <div style={{ position:'relative', paddingLeft:32 }}>
        {/* Vertical line */}
        {milestones.length > 1 && (
          <div style={{ position:'absolute', left:10, top:12, bottom:12, width:2, background:'rgba(255,255,255,0.08)' }} />
        )}
        {milestones.map((m, i) => {
          const isNext = !m.isCompleted && milestones.slice(0,i).every(x=>x.isCompleted)
          return (
            <div key={i} style={{ position:'relative', marginBottom:20, display:'flex', gap:18, alignItems:'flex-start' }}>
              <div style={{
                width:22, height:22, borderRadius:'50%', flexShrink:0, marginTop:2,
                border: `2px solid ${m.isCompleted ? '#22c55e' : isNext ? '#6366f1' : 'rgba(255,255,255,0.2)'}`,
                background: m.isCompleted ? '#22c55e' : isNext ? 'rgba(99,102,241,0.25)' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:12,
                boxShadow: isNext ? '0 0 12px rgba(99,102,241,0.5)' : 'none',
              }}>{m.isCompleted ? '✓' : isNext ? '●' : ''}</div>
              <div style={{
                flex:1, background:'rgba(255,255,255,0.04)', border:`1px solid ${m.isCompleted ? 'rgba(34,197,94,0.2)' : isNext ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius:12, padding:'14px 18px',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                  <span style={{ fontSize:14, fontWeight:600, color: m.isCompleted ? '#86efac' : '#e2e8f0', textDecoration: m.isCompleted ? 'line-through' : 'none' }}>{m.title}</span>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600,
                    background: m.isCompleted ? 'rgba(34,197,94,0.15)' : isNext ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                    color: m.isCompleted ? '#86efac' : isNext ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                  }}>{m.isCompleted ? '✅ Completed' : isNext ? '🔄 Next Up' : '⏳ Upcoming'}</span>
                </div>
                {m.dueDate && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6 }}>📅 Due: {new Date(m.dueDate).toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</div>}
                {m.completedAt && <div style={{ fontSize:12, color:'#86efac', marginTop:4 }}>✅ Completed: {new Date(m.completedAt).toLocaleDateString('en-IN')}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
