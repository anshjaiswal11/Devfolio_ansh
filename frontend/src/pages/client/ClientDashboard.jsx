import { useEffect, useState } from 'react'
import { dailyLogsApi, tasksApi, bugsApi } from '../../services/clientApi'

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}30`,
      borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 8,
      boxShadow: `0 4px 24px ${color}18`, transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 28 }}>{icon}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</div>
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '-1px' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{sub}</div>}
    </div>
  )
}

function ProgressRing({ pct, color }) {
  const r = 70, circ = 2 * Math.PI * r
  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
      <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" transform="rotate(-90 90 90)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
      />
      <text x="90" y="85" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="800" fontFamily="Inter">{pct}%</text>
      <text x="90" y="108" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="12" fontFamily="Inter">complete</text>
    </svg>
  )
}

function getPortal() {
  try { return JSON.parse(localStorage.getItem('clientPortal') || '{}') } catch { return {} }
}

export default function ClientDashboard() {
  const portal = getPortal()
  const [logs, setLogs] = useState([])
  const [tasks, setTasks] = useState([])
  const [bugs, setBugs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dailyLogsApi.getMy(), tasksApi.getMy(), bugsApi.getMy()])
      .then(([l, t, b]) => { setLogs(l.data); setTasks(t.data); setBugs(b.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const todayLog = logs.find(l => new Date(l.date).toDateString() === new Date().toDateString())
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const openBugs = bugs.filter(b => b.status === 'open' || b.status === 'in-progress').length
  const resolvedBugs = bugs.filter(b => b.status === 'resolved').length
  const nextMilestone = portal.milestones?.find(m => !m.isCompleted)
  const deliveryDate = portal.estimatedDelivery
    ? new Date(portal.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBD'

  const pageStyle = { padding: '32px 36px', minHeight: '100vh', background: '#0d0d14' }
  const headStyle = { fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: 0 }
  const subStyle  = { fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }
  const sectionStyle = { fontSize: 16, fontWeight: 700, color: '#e2e8f0', margin: '32px 0 16px' }
  const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }

  if (loading) return (
    <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 32 }}>⏳</div>
    </div>
  )

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={headStyle}>👋 Welcome back, {portal.clientName || 'Client'}!</h1>
          <p style={subStyle}>{today} · {portal.projectName}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
          border: '1px solid rgba(99,102,241,0.3)', padding: '10px 18px', borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 500 }}>Project Active</span>
        </div>
      </div>

      {/* Progress + delivery */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <ProgressRing pct={portal.progressPercent || 0} color="#6366f1" />
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Overall Progress</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
          <StatCard icon="✅" label="Tasks Done Today"    value={todayLog?.completedTasks ?? 0} color="#22c55e" sub={`${doneTasks} total completed`} />
          <StatCard icon="🔧" label="Commits Today"       value={todayLog?.commits ?? 0}         color="#6366f1" sub="From dev team" />
          <StatCard icon="🐞" label="Active Bugs"         value={openBugs}                       color="#f59e0b" sub={`${resolvedBugs} resolved`} />
          <StatCard icon="⏱" label="Hours Today"         value={todayLog?.hoursWorked ?? 0}      color="#a855f7" sub="Logged today" />
        </div>
      </div>

      {/* Stats row 2 */}
      <div style={grid2}>
        <StatCard icon="🚀" label="Next Milestone" value={nextMilestone?.title || '–'} color="#38bdf8" sub={nextMilestone?.dueDate ? new Date(nextMilestone.dueDate).toLocaleDateString('en-IN') : ''} />
        <StatCard icon="📅" label="Est. Delivery"  value={deliveryDate} color="#f472b6" />
        <StatCard icon="📋" label="Tasks Total"     value={tasks.length} color="#34d399" sub={`${doneTasks} done · ${tasks.length - doneTasks} remaining`} />
        <StatCard icon="📝" label="Log Entries"     value={logs.length}  color="#fb923c" sub="Daily reports" />
      </div>

      {/* Today's log */}
      {todayLog && (
        <>
          <p style={sectionStyle}>📋 Today's Work Report</p>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>{todayLog.title}</div>
            {todayLog.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems:'flex-start', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.type === 'completed' ? '✅' : item.type === 'progress' ? '🔄' : item.type === 'blocker' ? '🚫' : '📌'}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Milestones */}
      {portal.milestones?.length > 0 && (
        <>
          <p style={sectionStyle}>🎯 Milestones</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {portal.milestones.map((m, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${m.isCompleted ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 12,
              }}>
                <div style={{ fontSize: 20 }}>{m.isCompleted ? '✅' : '⭕'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: m.isCompleted ? '#86efac' : '#e2e8f0', textDecoration: m.isCompleted ? 'line-through' : 'none' }}>{m.title}</div>
                  {m.dueDate && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Due: {new Date(m.dueDate).toLocaleDateString('en-IN')}</div>}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                  background: m.isCompleted ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
                  color: m.isCompleted ? '#86efac' : '#a5b4fc',
                }}>{m.isCompleted ? 'Done' : 'Pending'}</div>
              </div>
            ))}
          </div>
        </>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}
