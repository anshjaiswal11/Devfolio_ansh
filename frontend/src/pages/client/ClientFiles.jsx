import { useEffect, useState } from 'react'
import { sharedFilesApi } from '../../services/clientApi'
import toast from 'react-hot-toast'

export default function ClientFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', url: '', description: '' })

  const load = () => sharedFilesApi.getMy().then(r => setFiles(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.url) return toast.error('Name and URL link are required')
    setUploading(true)
    try {
      await sharedFilesApi.upload({ ...form, mimeType: 'link' })
      toast.success('File shared successfully!')
      setForm({ name: '', url: '', description: '' })
      load()
    } catch { toast.error('Failed to share file') }
    finally { setUploading(false) }
  }

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }
  const inpStyle = { width:'100%', boxSizing:'border-box', padding:'12px 16px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', outline:'none', fontSize:14, marginBottom:14 }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>📁 File Sharing</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Share assets, logos, notes, or links securely with your developer.</p>

      {/* Upload Form */}
      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px dashed rgba(99,102,241,0.4)', borderRadius:16, padding:'28px 32px', marginBottom:36 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:18, display:'flex', alignItems:'center', gap:10 }}><span>📤</span> Upload & Share File</div>
        <form onSubmit={handleSubmit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
          <div>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>File Name *</label>
            <input style={inpStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Brand Logo, API Keys" required />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>File URL / Drive Link *</label>
            <input style={inpStyle} type="url" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://drive.google.com/..." required />
          </div>
          <div style={{ gridColumn:'1 / -1' }}>
            <label style={{ display:'block', fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Description (Optional)</label>
            <input style={inpStyle} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Brief context about this file..." />
          </div>
          <div style={{ gridColumn:'1 / -1', marginTop:6 }}>
            <button type="submit" disabled={uploading} style={{ padding:'12px 28px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'#fff', fontWeight:600, cursor:uploading?'not-allowed':'pointer' }}>
              {uploading ? '⏳ Sharing...' : 'Share File'}
            </button>
          </div>
        </form>
      </div>

      {loading ? <div style={{ textAlign:'center', paddingTop:40, fontSize:28 }}>⏳</div>
       : files.length === 0 ? <div style={{ color:'rgba(255,255,255,0.3)', fontSize:14, textAlign:'center' }}>No files shared yet.</div>
       : (
         <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
           {files.map(f => (
             <div key={f._id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'16px 20px' }}>
               <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                 <div style={{ width:40, height:40, borderRadius:10, background: f.uploadedBy==='admin' ? 'rgba(168,85,247,0.15)' : 'rgba(34,197,94,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
                   {f.uploadedBy==='admin' ? '💻' : '👤'}
                 </div>
                 <div>
                   <div style={{ fontSize:15, fontWeight:600, color:'#e2e8f0', display:'flex', alignItems:'center', gap:10 }}>
                     {f.name}
                     <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)' }}>By {f.uploadedByName}</span>
                   </div>
                   {f.description && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{f.description}</div>}
                 </div>
               </div>
               <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                 <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textAlign:'right' }}>
                   {new Date(f.createdAt).toLocaleDateString()}<br/>{new Date(f.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                 </div>
                 <a href={f.url} target="_blank" rel="noreferrer" style={{ padding:'8px 16px', borderRadius:8, background:'rgba(99,102,241,0.15)', color:'#a5b4fc', textDecoration:'none', fontSize:13, fontWeight:600, transition:'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.25)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(99,102,241,0.15)'}>
                   Open ↗
                 </a>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  )
}
