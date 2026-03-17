import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clientAuthApi } from '../../services/clientApi'
import toast from 'react-hot-toast'

export default function ClientAccess() {
  const [gmail, setGmail]       = useState('')
  const [passkey, setPasskey]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [showKey, setShowKey]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!gmail || !passkey) return toast.error('Please enter both Gmail and passkey')
    setLoading(true)
    try {
      const res = await clientAuthApi.access({ gmail, passkey })
      localStorage.setItem('clientToken', res.data.token)
      localStorage.setItem('clientPortal', JSON.stringify(res.data.portal))
      toast.success(`Welcome back, ${res.data.portal.clientName}!`)
      navigate('/client/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated orbs */}
      <div style={{ position:'absolute', top:'15%', left:'10%', width:380, height:380, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter:'blur(40px)', animation:'pulse 6s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'8%', width:300, height:300, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter:'blur(40px)', animation:'pulse 8s ease-in-out infinite reverse' }} />

      <div style={{
        width: '100%', maxWidth: 440, margin: '0 auto', padding: '48px 40px',
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo / header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 28,
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>🚀</div>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Client Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 8 }}>
            Access your project dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Gmail */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display:'block', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:500, marginBottom:8 }}>
              Gmail Address
            </label>
            <input
              id="client-gmail"
              type="email"
              value={gmail}
              onChange={e => setGmail(e.target.value)}
              placeholder="you@gmail.com"
              autoComplete="email"
              style={{
                width: '100%', padding: '14px 16px', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor='rgba(99,102,241,0.7)'}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'}
            />
          </div>

          {/* Passkey */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ display:'block', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:500, marginBottom:8 }}>
              Passkey
            </label>
            <div style={{ position:'relative' }}>
              <input
                id="client-passkey"
                type={showKey ? 'text' : 'password'}
                value={passkey}
                onChange={e => setPasskey(e.target.value)}
                placeholder="Enter your passkey"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '14px 48px 14px 16px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, color: '#fff', fontSize: 15, outline: 'none',
                  transition: 'border 0.2s',
                }}
                onFocus={e => e.target.style.borderColor='rgba(99,102,241,0.7)'}
                onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.12)'}
              />
              <button type="button" onClick={() => setShowKey(v => !v)} style={{
                position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontSize:18,
              }}>{showKey ? '🙈' : '👁'}</button>
            </div>
          </div>

          <button
            id="client-access-btn"
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 'none',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#fff', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)', transition: 'opacity 0.2s, transform 0.1s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseDown={e => !loading && (e.target.style.transform='scale(0.98)')}
            onMouseUp={e => e.target.style.transform='scale(1)'}
          >
            {loading ? '⏳ Accessing...' : '🚀 Access Dashboard'}
          </button>
        </form>

        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:12, marginTop:28 }}>
          🔒 Secured access · Provided by your developer
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
      `}</style>
    </div>
  )
}
