import { useEffect, useState } from 'react'
import { releasesApi } from '../../services/clientApi'

export default function ClientReleases() {
  const [rels, setRels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { releasesApi.getMy().then(r => setRels(r.data)).catch(console.error).finally(()=>setLoading(false)) }, [])

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>📦 Releases</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Version history, feature launches, and changelogs.</p>

      {loading ? <div style={{ textAlign:'center', paddingTop:60, fontSize:32 }}>⏳</div>
       : rels.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
          <div style={{ color:'rgba(255,255,255,0.4)' }}>No releases published yet.</div>
        </div>
      ) : (
        <div style={{ position:'relative', maxWidth:800 }}>
          {/* Vertical timeline line */}
          <div style={{ position:'absolute', top:24, bottom:24, left:16, width:2, background:'rgba(255,255,255,0.06)' }} />

          {rels.map((rel, i) => (
            <div key={rel._id} style={{ display:'flex', gap:20, alignItems:'flex-start', marginBottom:32, position:'relative' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0, zIndex:1, boxShadow:'0 0 16px rgba(99,102,241,0.4)' }}>
                🚀
              </div>
              <div style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                      <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{rel.version}</span>
                      <span style={{ fontSize:11, padding:'4px 10px', borderRadius:20, fontWeight:600, background: rel.type==='major' ? 'rgba(239,68,68,0.15)' : rel.type==='minor' ? 'rgba(56,189,248,0.15)' : 'rgba(34,197,94,0.15)', color: rel.type==='major' ? '#fca5a5' : rel.type==='minor' ? '#bae6fd' : '#86efac', textTransform:'capitalize' }}>{rel.type} Release</span>
                    </div>
                    <div style={{ fontSize:15, color:'#e2e8f0', fontWeight:500 }}>{rel.title}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>{new Date(rel.releaseDate).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                    {rel.liveUrl && <a href={rel.liveUrl} target="_blank" rel="noreferrer" style={{ padding:'6px 12px', borderRadius:8, background:'rgba(255,255,255,0.08)', color:'#fff', textDecoration:'none', fontSize:12, transition:'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.2)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}>View Live ↗</a>}
                  </div>
                </div>

                {rel.description && <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:20 }}>{rel.description}</div>}

                {rel.feats?.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#a5b4fc', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>✨ New Features</div>
                    <ul style={{ margin:0, paddingLeft:20, color:'#e2e8f0', fontSize:14, lineHeight:1.7 }}>
                      {rel.feats.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}
                {rel.fixes?.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#86efac', textTransform:'uppercase', letterSpacing:'1px', marginBottom:8 }}>🐞 Improvments & Fixes</div>
                    <ul style={{ margin:0, paddingLeft:20, color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.7 }}>
                      {rel.fixes.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
