import { useEffect, useState } from 'react'
import { tasksApi } from '../../services/clientApi'

const COLS = [
  { id: 'todo',        label: '📋 To Do',      color: '#94a3b8' },
  { id: 'in-progress', label: '🔄 In Progress', color: '#6366f1' },
  { id: 'done',        label: '✅ Done',        color: '#22c55e' },
  { id: 'blocked',     label: '🚫 Blocked',     color: '#ef4444' },
]

const PRIORITY = {
  critical: { color: '#ef4444', label: 'Critical' },
  high:     { color: '#f97316', label: 'High' },
  medium:   { color: '#f59e0b', label: 'Medium' },
  low:      { color: '#22c55e', label: 'Low' },
}

export default function ClientTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tasksApi.getMy().then(r => setTasks(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const byStatus = id => tasks.filter(t => t.status === id)

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh', background: '#0d0d14', fontFamily: "'Inter',sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>✅ Kanban Board</h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '0 0 32px' }}>Read-only view of all project tasks</p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><div style={{ fontSize: 32, animation: 'spin 1s linear infinite' }}>⏳</div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'start' }}>
          {COLS.map(col => (
            <div key={col.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${col.color}20`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', background: `${col.color}12`, borderBottom: `1px solid ${col.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: col.color }}>{col.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, background: `${col.color}25`, color: col.color, padding: '3px 10px', borderRadius: 20 }}>{byStatus(col.id).length}</span>
              </div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {byStatus(col.id).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No tasks</div>
                )}
                {byStatus(col.id).map(task => (
                  <div key={task._id} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '14px 16px',
                    borderLeft: `3px solid ${PRIORITY[task.priority]?.color || '#94a3b8'}`,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 8, lineHeight: 1.4 }}>{task.title}</div>
                    {task.description && (
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10, lineHeight: 1.5 }}>{task.description}</div>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                        background: `${PRIORITY[task.priority]?.color}20`, color: PRIORITY[task.priority]?.color || '#94a3b8' }}>
                        {PRIORITY[task.priority]?.label}
                      </span>
                      {task.assignee && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6 }}>👤 {task.assignee}</span>}
                      {task.dueDate && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>📅 {new Date(task.dueDate).toLocaleDateString('en-IN')}</span>}
                    </div>
                    {task.tags?.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {task.tags.map((tag, i) => (
                          <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
