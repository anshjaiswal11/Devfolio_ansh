import { useEffect, useState } from 'react'
import { meetingsApi } from '../../services/clientApi'

export default function ClientMeetings() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { meetingsApi.getMy().then(r => setMeetings(r.data)).catch(console.error).finally(()=>setLoading(false)) }, [])

  const P = { padding:'32px 36px', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif" }

  return (
    <div style={P}>
      <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.5px' }}>🗓 Meetings & Notes</h1>
      <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:'0 0 32px' }}>Meeting notes, action items, and call recordings.</p>

      {loading ? <div style={{ textAlign:'center', paddingTop:60, fontSize:32 }}>⏳</div>
       : meetings.length === 0 ? (
        <div style={{ textAlign:'center', paddingTop:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🎙</div>
          <div style={{ color:'rgba(255,255,255,0.4)' }}>No meeting notes yet.</div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:900 }}>
          {meetings.map((m) => {
            const date = new Date(m.date)
            return (
              <div key={m._id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:20 }}>
                  <div>
                    <div style={{ fontSize:18, fontWeight:700, color:'#e2e8f0', marginBottom:6 }}>{m.title}</div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', display:'flex', gap:16, alignItems:'center' }}>
                      <span>📅 {date.toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})} at {date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
                      <span>⏱ {m.duration} mins</span>
                      {m.attendees?.length > 0 && <span>👥 {m.attendees.join(', ')}</span>}
                    </div>
                  </div>
                  {(m.recordingUrl || m.meetingLink) && (
                    <div style={{ display:'flex', gap:10 }}>
                      {m.meetingLink && <a href={m.meetingLink} target="_blank" rel="noreferrer" style={{ padding:'8px 16px', borderRadius:8, background:'rgba(34,197,94,0.15)', color:'#86efac', textDecoration:'none', fontSize:13, fontWeight:600 }}>Join Link ↗</a>}
                      {m.recordingUrl && <a href={m.recordingUrl} target="_blank" rel="noreferrer" style={{ padding:'8px 16px', borderRadius:8, background:'rgba(99,102,241,0.15)', color:'#a5b4fc', textDecoration:'none', fontSize:13, fontWeight:600 }}>Recording 🔴</a>}
                    </div>
                  )}
                </div>

                {m.notes && (
                  <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'16px', fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:16, whiteSpace:'pre-wrap' }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#a5b4fc', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>Agenda & Notes</div>
                    {m.notes}
                  </div>
                )}

                {m.actionItems?.length > 0 && (
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}><span>⚡</span> Action Items</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {m.actionItems.map((ai, i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:8, padding:'10px 14px' }}>
                          <span style={{ fontSize:14 }}>{ai.done ? '✅' : '⭕'}</span>
                          <span style={{ flex:1, fontSize:14, color: ai.done ? 'rgba(255,255,255,0.3)' : '#e2e8f0', textDecoration: ai.done ? 'line-through' : 'none' }}>{ai.text}</span>
                          {ai.assignee && <span style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'2px 8px', borderRadius:12, color:'rgba(255,255,255,0.5)' }}>👤 {ai.assignee}</span>}
                          {ai.dueDate && <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Due {new Date(ai.dueDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>}
                        </div>
                      ))}
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
