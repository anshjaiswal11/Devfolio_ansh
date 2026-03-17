import { useEffect, useState } from 'react'
import { timeEntriesApi } from '../../services/clientApi'

const CAT_COLORS = { development: '#6366f1', design: '#ec4899', meeting: '#f59e0b', review: '#22c55e', testing: '#8b5cf6', deployment: '#06b6d4', other: '#94a3b8' }

export default function ClientTime() {
  const [data, setData] = useState({ entries: [], total: 0, byCategory: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    timeEntriesApi.getMy().then(r => setData(r.data)).catch(console.error).finally(()=>setLoading(false))
  }, [])

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>⏱ Time Tracking</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Total hours logged: <span style={{ color:'#fff', fontWeight:700 }}>{data.total}h</span></p>

      {loading ? <div style={{ textAlign:'center', paddingTop:60, fontSize:32 }}>⏳</div>
       : data.entries.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
          <div style={{ color:'rgba(255,255,255,0.4)' }}>No time logged yet.</div>
        </div>
      ) : (
        <>
          {/* Summary Chart */}
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:32 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', marginBottom:20 }}>Hours by Category</div>
            <div style={{ display:'flex', height:24, borderRadius:20, overflow:'hidden', marginBottom:20 }}>
              {Object.entries(data.byCategory).map(([cat, hrs]) => (
                <div key={cat} style={{ width:`${(hrs/data.total)*100}%`, background:CAT_COLORS[cat]||'#fff', transition:'width 1s' }} title={`${cat}: ${hrs}h`} />
              ))}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>
              {Object.entries(data.byCategory).map(([cat, hrs]) => (
                <div key={cat} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:12, height:12, borderRadius:4, background:CAT_COLORS[cat]||'#fff' }} />
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)', textTransform:'capitalize' }}>{cat}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{hrs}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Entries */}
          <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:16 }}>Log History</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {data.entries.map(e => (
              <div key={e._id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.03)', borderLeft:`4px solid ${CAT_COLORS[e.category]||'#fff'}`, borderRadius:10, padding:'14px 20px' }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:'#e2e8f0', marginBottom:4 }}>{e.description}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', display:'flex', gap:12 }}>
                    <span>📅 {new Date(e.date).toLocaleDateString()}</span>
                    <span style={{ textTransform:'capitalize' }}>🏷 {e.category}</span>
                  </div>
                </div>
                <div style={{ fontSize:20, fontWeight:800, color:CAT_COLORS[e.category]||'#fff' }}>
                  {e.hours}<span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginLeft:2 }}>h</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
