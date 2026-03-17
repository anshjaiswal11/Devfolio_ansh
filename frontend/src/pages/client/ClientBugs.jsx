import { useEffect, useState } from 'react'
import { bugsApi } from '../../services/clientApi'

const SEV = { critical:{ color:'#ef4444', label:'🔴 Critical' }, high:{ color:'#f97316', label:'🟠 High' }, medium:{ color:'#f59e0b', label:'🟡 Medium' }, low:{ color:'#22c55e', label:'🟢 Low' } }
const STATUS = { open:'🔴 Open', 'in-progress':'🔄 In Progress', resolved:'✅ Resolved', closed:'⚫ Closed' }

export default function ClientBugs() {
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { bugsApi.getMy().then(r => setBugs(r.data)).catch(console.error).finally(() => setLoading(false)) }, [])

  const filtered = filter === 'all' ? bugs : bugs.filter(b => b.status === filter)
  const counts = { all: bugs.length, open: bugs.filter(b=>b.status==='open').length, 'in-progress': bugs.filter(b=>b.status==='in-progress').length, resolved: bugs.filter(b=>b.status==='resolved').length }
  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>🐞 Bug Tracker</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 24px' }}>{bugs.length} total bugs tracked</p>

      {/* Filter pills */}
      <div style={{ display:'flex', gap:10, marginBottom:28, flexWrap:'wrap' }}>
        {[['all','All'],['open','Open'],['in-progress','In Progress'],['resolved','Resolved']].map(([k,v]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding:'8px 18px', borderRadius:20, border:`1px solid ${filter===k ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
            background: filter===k ? 'rgba(99,102,241,0.2)' : 'transparent',
            color: filter===k ? '#a5b4fc' : 'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:13, fontWeight:500,
          }}>{v} <span style={{ opacity:0.6 }}>({counts[k] ?? 0})</span></button>
        ))}
      </div>

      {loading ? <div style={{ textAlign:'center', paddingTop:60, fontSize:32 }}>⏳</div>
       : filtered.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:48 }}>🎉</div>
          <div style={{ color:'rgba(255,255,255,0.4)', marginTop:16 }}>No bugs found!</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {filtered.map(bug => (
            <div key={bug._id} style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${SEV[bug.severity]?.color || '#94a3b8'}22`, borderRadius:14, padding:'18px 22px', borderLeft:`4px solid ${SEV[bug.severity]?.color || '#94a3b8'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8, marginBottom:10 }}>
                <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0' }}>{bug.title}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <span style={{ fontSize:12, padding:'4px 10px', borderRadius:20, fontWeight:600, background:`${SEV[bug.severity]?.color}20`, color: SEV[bug.severity]?.color }}>{SEV[bug.severity]?.label}</span>
                  <span style={{ fontSize:12, padding:'4px 10px', borderRadius:20, fontWeight:600, background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.6)' }}>{STATUS[bug.status]}</span>
                </div>
              </div>
              {bug.description && <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.6, marginBottom:10 }}>{bug.description}</div>}
              <div style={{ display:'flex', gap:20, fontSize:12, color:'rgba(255,255,255,0.35)' }}>
                <span>📅 Reported: {new Date(bug.createdAt).toLocaleDateString('en-IN')}</span>
                {bug.resolvedAt && <span>✅ Resolved: {new Date(bug.resolvedAt).toLocaleDateString('en-IN')}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
