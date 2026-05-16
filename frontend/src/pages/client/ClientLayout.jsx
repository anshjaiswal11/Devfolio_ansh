import { useState, useEffect } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { notificationsApi } from '../../services/clientApi'

const NAV = [
  { to: '/client/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/client/notifications', icon: '🔔', label: 'Notifications', isBell: true },
  { to: '/client/progress',  icon: '📈', label: 'Progress' },
  { to: '/client/tasks',     icon: '✅', label: 'Tasks' },
  { to: '/client/logs',      icon: '📋', label: 'Daily Logs' },
  { to: '/client/github',    icon: '🔧', label: 'GitHub' },
  { to: '/client/notion',    icon: '📝', label: 'Notion' },
  { to: '/client/feedback',  icon: '💬', label: 'Feedback' },
  { to: '/client/bugs',      icon: '🐞', label: 'Bugs' },
  { to: '/client/docs',      icon: '📄', label: 'Docs' },
  { to: '/client/files',     icon: '📁', label: 'Files' },
  { to: '/client/time',      icon: '⏱', label: 'Time' },
  { to: '/client/meetings',  icon: '🗓', label: 'Meetings' },
  { to: '/client/releases',  icon: '📦', label: 'Releases' },
  { to: '/client/slack',     icon: '💼', label: 'Slack' },
]

function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

export default function ClientLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const navigate = useNavigate()
  const portal = getPortal()

  const logout = () => {
    localStorage.removeItem('clientToken')
    localStorage.removeItem('clientPortal')
    navigate('/client')
  }

  // Poll unread notification count every 30 seconds
  useEffect(() => {
    const fetchCount = () => {
      notificationsApi.getUnreadCount()
        .then(r => setUnreadCount(r.data.count || 0))
        .catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // track mobile layout
  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth < 768) }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const sidebarW = collapsed ? 70 : 240

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif", color:'#fff', position: 'relative' }}>
      {/* Desktop Sidebar (hidden on mobile) */}
      {!isMobile && (
        <aside style={{
          width: sidebarW, minHeight:'100vh', background:'rgba(255,255,255,0.03)',
          borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column',
          transition:'width 0.25s ease', overflow:'hidden', position:'sticky', top:0, height:'100vh',
          backdropFilter:'blur(12px)', flexShrink:0,
        }}>
        {/* Header */}
        <div style={{ padding: collapsed ? '20px 12px' : '24px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:12, justifyContent: collapsed ? 'center' : 'space-between' }}>
          {!collapsed && (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🚀</div>
              <div style={{ overflow:'hidden' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#fff', whiteSpace:'nowrap' }}>Client Portal</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:130 }}>{portal.projectName || 'My Project'}</div>
              </div>
            </div>
          )}
          {collapsed && <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🚀</div>}
          <button onClick={() => setCollapsed(v=>!v)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:18, padding:4, borderRadius:6, flexShrink:0 }}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 8px', overflowY:'auto' }}>
          {NAV.map(({ to, icon, label, isBell }) => (
            <NavLink key={to} to={to}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:12,
                padding: collapsed ? '10px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius:10, marginBottom:2, textDecoration:'none',
                background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.55)',
                fontWeight: isActive ? 600 : 400,
                fontSize:14, transition:'all 0.15s',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                position: 'relative',
              })}
              title={collapsed ? label : undefined}
            >
              <span style={{ fontSize:18, flexShrink:0, position: 'relative' }}>
                {icon}
                {/* Notification badge */}
                {isBell && unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -6,
                    minWidth: 16, height: 16, borderRadius: 8,
                    background: '#ef4444', color: '#fff',
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px', lineHeight: 1,
                    boxShadow: '0 0 8px rgba(239,68,68,0.5)',
                    animation: 'pulse 2s infinite',
                  }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </span>
              {!collapsed && (
                <span style={{ whiteSpace:'nowrap', display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  {label}
                  {isBell && unreadCount > 0 && !collapsed && (
                    <span style={{
                      marginLeft: 'auto', minWidth: 20, height: 18, borderRadius: 9,
                      background: 'rgba(239,68,68,0.2)', color: '#f87171',
                      fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0 6px',
                    }}>{unreadCount}</span>
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Client info / logout */}
        <div style={{ padding: collapsed ? '12px 8px' : '16px 12px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          {!collapsed && (
            <div style={{ marginBottom:10, padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:10 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#c4b5fd', marginBottom:2 }}>{portal.clientName || 'Client'}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{portal.gmail || ''}</div>
            </div>
          )}
          <button onClick={logout} style={{
            width:'100%', padding: collapsed ? '10px 0' : '10px 12px', borderRadius:10, border:'none',
            background:'rgba(239,68,68,0.12)', color:'#f87171', cursor:'pointer', fontSize:13, fontWeight:500,
            display:'flex', alignItems:'center', gap:8, justifyContent: collapsed ? 'center' : 'flex-start',
            transition:'background 0.15s',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.22)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.12)'}
          >
            <span>🚪</span>{!collapsed && 'Sign Out'}
          </button>
        </div>
        </aside>
      )}

      {/* Mobile topbar */}
      {isMobile && (
        <header style={{ position: 'fixed', top:0, left:0, right:0, height:56, display:'flex', alignItems:'center', gap:12, padding:'0 12px', background:'rgba(13,13,20,0.85)', backdropFilter:'blur(8px)', zIndex:60, borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
          <button onClick={() => setMobileNavOpen(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.8)', fontSize:22 }} aria-label="Open menu">☰</button>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🚀</div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:180 }}>{portal.projectName || 'Client Portal'}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>{portal.clientName || ''}</div>
            </div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)' }}>🏠</button>
          </div>
        </header>
      )}

      {/* Main */}
      <main style={{ flex:1, overflow:'auto', minHeight:'100vh', paddingTop: isMobile ? 56 : 0, paddingBottom: isMobile ? 72 : 0 }}>
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav style={{ position:'fixed', left:0, right:0, bottom:0, height:64, display:'flex', alignItems:'center', justifyContent:'space-around', background:'rgba(13,13,20,0.95)', borderTop:'1px solid rgba(255,255,255,0.03)', zIndex:60 }}>
          {NAV.slice(0,5).map(({ to, icon, label, isBell }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textDecoration:'none', color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.6)', fontSize:12 })}>
              <div style={{ fontSize:20 }}>{icon}</div>
              <div style={{ fontSize:11, marginTop:4 }}>{label}</div>
              {isBell && unreadCount > 0 && (<span style={{ position:'absolute', top:6, right:20, minWidth:16, height:16, background:'#ef4444', color:'#fff', borderRadius:8, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center' }}>{unreadCount>9?'9+':unreadCount}</span>)}
            </NavLink>
          ))}
          <button onClick={() => setMobileNavOpen(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', display:'flex', flexDirection:'column', alignItems:'center' }}> 
            <div style={{ fontSize:20 }}>⋯</div>
            <div style={{ fontSize:11 }}>More</div>
          </button>
        </nav>
      )}

      {/* Mobile nav overlay */}
      {isMobile && mobileNavOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:70, display:'flex', justifyContent:'flex-end' }} onClick={() => setMobileNavOpen(false)}>
          <div style={{ width:280, background:'#0b0b10', padding:16, overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ width:36, height:36, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center' }}>🚀</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{portal.projectName || 'Client Portal'}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>{portal.clientName || ''}</div>
                </div>
              </div>
              <button onClick={() => setMobileNavOpen(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)' }}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {NAV.map(({ to, icon, label, isBell }) => (
                <NavLink key={to} to={to} onClick={() => setMobileNavOpen(false)} style={({ isActive }) => ({ display:'flex', gap:12, alignItems:'center', padding:'10px 8px', borderRadius:8, textDecoration:'none', color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.8)' })}>
                  <div style={{ fontSize:18 }}>{icon}</div>
                  <div style={{ fontSize:14 }}>{label}</div>
                  {isBell && unreadCount > 0 && (<span style={{ marginLeft:'auto', background:'#ef4444', color:'#fff', padding:'2px 8px', borderRadius:10, fontSize:11 }}>{unreadCount>9?'9+':unreadCount}</span>)}
                </NavLink>
              ))}
            </div>
            <div style={{ marginTop:16 }}>
              <button onClick={logout} style={{ width:'100%', padding:'10px', borderRadius:8, background:'rgba(239,68,68,0.12)', color:'#f87171', border:'none' }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *::-webkit-scrollbar{width:6px;height:6px} *::-webkit-scrollbar-track{background:transparent}
        *::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      `}</style>
    </div>
  )
}
