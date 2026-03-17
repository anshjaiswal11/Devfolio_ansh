import { useState } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/client/dashboard', icon: '🏠', label: 'Dashboard' },
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
  const navigate = useNavigate()
  const portal = getPortal()

  const logout = () => {
    localStorage.removeItem('clientToken')
    localStorage.removeItem('clientPortal')
    navigate('/client')
  }

  const sidebarW = collapsed ? 70 : 240

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0d0d14', fontFamily:"'Inter',sans-serif", color:'#fff' }}>
      {/* Sidebar */}
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
          {NAV.map(({ to, icon, label }) => (
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
              })}
              title={collapsed ? label : undefined}
            >
              <span style={{ fontSize:18, flexShrink:0 }}>{icon}</span>
              {!collapsed && <span style={{ whiteSpace:'nowrap' }}>{label}</span>}
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

      {/* Main */}
      <main style={{ flex:1, overflow:'auto', minHeight:'100vh' }}>
        <Outlet />
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *::-webkit-scrollbar{width:6px;height:6px} *::-webkit-scrollbar-track{background:transparent}
        *::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}
      `}</style>
    </div>
  )
}
