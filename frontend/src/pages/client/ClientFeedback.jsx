import { useEffect, useState } from 'react'
import { feedbackApi } from '../../services/clientApi'
import toast from 'react-hot-toast'

function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

const TYPES = ['general','bug','feature','question','approval']
const TYPE_ICON = { general:'💬', bug:'🐛', feature:'✨', question:'❓', approval:'✅' }

export default function ClientFeedback() {
  const portal = getPortal()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [type, setType] = useState('general')
  const [submitting, setSubmitting] = useState(false)

  const load = () => feedbackApi.getMy().then(r => setList(r.data)).catch(console.error).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!msg.trim()) return toast.error('Please enter a message')
    setSubmitting(true)
    try {
      await feedbackApi.submit({ message: msg, type })
      toast.success('Feedback sent!')
      setMsg('')
      load()
    } catch { toast.error('Failed to send') }
    finally { setSubmitting(false) }
  }

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>💬 Feedback</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Share feedback, report issues, or ask questions.</p>

      {/* Submit form */}
      <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:18, padding:'28px 32px', marginBottom:36 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', marginBottom:20 }}>✍️ Send New Feedback</div>
        <form onSubmit={submit}>
          {/* Type selector */}
          <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
            {TYPES.map(t => (
              <button key={t} type="button" onClick={() => setType(t)} style={{
                padding:'7px 16px', borderRadius:20, border:`1px solid ${type===t ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
                background: type===t ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: type===t ? '#a5b4fc' : 'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:13, fontWeight:500,
                transition:'all 0.15s',
              }}>{TYPE_ICON[t]} {t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
          <textarea
            value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Write your feedback, question, or comment here..."
            rows={5} style={{
              width:'100%', boxSizing:'border-box', padding:'14px 16px', background:'rgba(255,255,255,0.06)',
              border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#fff', fontSize:14,
              outline:'none', resize:'vertical', fontFamily:'inherit', lineHeight:1.6,
            }}
            onFocus={e => e.target.style.borderColor='rgba(99,102,241,0.6)'}
            onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
          />
          <button type="submit" disabled={submitting} style={{
            marginTop:14, padding:'12px 28px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'#fff', fontSize:14, fontWeight:600,
            cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.7:1, boxShadow:'0 4px 16px rgba(99,102,241,0.3)',
          }}>{submitting ? '📤 Sending...' : '📤 Send Feedback'}</button>
        </form>
      </div>

      {/* Past feedback */}
      <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:16 }}>📬 My Feedback History</div>
      {loading ? <div style={{ textAlign:'center', paddingTop:40, fontSize:28 }}>⏳</div>
       : list.length === 0 ? <div style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>No feedback sent yet.</div>
       : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {list.map(f => (
            <div key={f._id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'18px 22px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, gap:10 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:18 }}>{TYPE_ICON[f.type]}</span>
                  <span style={{ fontSize:11, padding:'3px 10px', borderRadius:20, fontWeight:600,
                    background:'rgba(99,102,241,0.15)', color:'#a5b4fc' }}>
                    {f.type.charAt(0).toUpperCase()+f.type.slice(1)}
                  </span>
                  {!f.isRead && <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:'rgba(239,68,68,0.2)', color:'#f87171', fontWeight:600 }}>New</span>}
                </div>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{new Date(f.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
              </div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)', lineHeight:1.6, marginBottom: f.adminReply ? 14 : 0 }}>{f.message}</div>
              {f.adminReply && (
                <div style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:10, padding:'12px 16px', display:'flex', gap:10 }}>
                  <span style={{ fontSize:18 }}>💬</span>
                  <div>
                    <div style={{ fontSize:12, color:'#a5b4fc', fontWeight:600, marginBottom:5 }}>Developer Reply</div>
                    <div style={{ fontSize:14, color:'rgba(255,255,255,0.75)', lineHeight:1.6 }}>{f.adminReply}</div>
                    {f.repliedAt && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:6 }}>{new Date(f.repliedAt).toLocaleDateString()}</div>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
