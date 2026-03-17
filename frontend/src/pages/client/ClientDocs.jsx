import { useEffect, useState } from 'react'
import { documentsApi } from '../../services/clientApi'

const TYPE_ICONS = { technical:'🛠', api:'🔌', architecture:'🏗', design:'🎨', database:'🗄', other:'📄' }

export default function ClientDocs() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { documentsApi.getMy().then(r => setDocs(r.data)).catch(console.error).finally(()=>setLoading(false)) }, [])

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>📄 Documentation</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Access project documentation, architecture diagrams, and APIs.</p>

      {loading ? <div style={{ textAlign:'center', paddingTop:60, fontSize:32 }}>⏳</div>
       : docs.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📂</div>
          <div style={{ color:'rgba(255,255,255,0.4)' }}>No documents uploaded yet.</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
          {docs.map(doc => (
            <a key={doc._id} href={doc.url} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
              <div style={{
                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16,
                padding:'20px 24px', transition:'all 0.2s', display:'flex', flexDirection:'column', height:'100%', boxSizing:'border-box',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.transform='translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.transform='translateY(0)' }}
              >
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'rgba(99,102,241,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
                    {TYPE_ICONS[doc.type] || '📄'}
                  </div>
                  <span style={{ fontSize:11, padding:'4px 10px', borderRadius:20, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', fontWeight:600 }}>
                    {doc.fileType || 'Link'}
                  </span>
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:6, lineHeight:1.3 }}>{doc.name}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', flex:1, marginBottom:16, lineHeight:1.5 }}>
                  {doc.description || 'No description provided.'}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto', paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>{new Date(doc.createdAt).toLocaleDateString('en-IN')}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#6366f1' }}>Open ↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
