import { useEffect, useState } from 'react'
import { notificationsApi } from '../../services/clientApi'

const TYPE_EMOJIS = { update: '🔄', milestone: '🚀', release: '📦', bug_fix: '🐞', general: '📌' }
const TYPE_COLORS = { update: '#6366f1', milestone: '#a855f7', release: '#22c55e', bug_fix: '#f59e0b', general: '#64748b' }

function timeAgo(dateStr) {
  const d = new Date(dateStr), now = new Date(), diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ClientNotifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => notificationsApi.getMy().then(r => setItems(r.data)).catch(console.error).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleMarkRead = async (id) => {
    try {
      await notificationsApi.markRead(id)
      setItems(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch {}
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead()
      setItems(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch {}
  }

  const unreadCount = items.filter(n => !n.isRead).length

  const S = {
    page: { padding: '32px 36px', minHeight: '100vh', background: '#0d0d14', fontFamily: "'Inter',sans-serif" },
    h1: { fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' },
  }

  if (loading) return (
    <div style={S.page}>
      <h1 style={S.h1}>🔔 Notifications</h1>
      <div style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 40 }}>⏳</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>Loading notifications...</div>
      </div>
    </div>
  )

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={S.h1}>🔔 Notifications</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} style={{
            padding: '8px 18px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>✓ Mark All as Read</button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No notifications yet.</div>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 8 }}>Your developer will notify you when updates are ready.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(n => {
            const color = TYPE_COLORS[n.type] || '#6366f1'
            return (
              <div key={n._id} onClick={() => !n.isRead && handleMarkRead(n._id)} style={{
                display: 'flex', gap: 16, padding: '18px 22px',
                background: n.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.06)',
                border: `1px solid ${n.isRead ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.18)'}`,
                borderRadius: 14, cursor: n.isRead ? 'default' : 'pointer',
                transition: 'all 0.2s', position: 'relative',
              }}>
                {/* Unread indicator */}
                {!n.isRead && (
                  <div style={{ position: 'absolute', top: 20, left: 8, width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1' }} />
                )}

                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${color}15`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>
                  {TYPE_EMOJIS[n.type] || '📌'}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700,
                      padding: '2px 8px', borderRadius: 6, background: `${color}18`, color: color,
                    }}>{n.type?.replace('_', ' ')}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{timeAgo(n.createdAt)}</span>
                    {!n.isRead && (
                      <span style={{ fontSize: 10, color: '#a5b4fc', fontWeight: 600, marginLeft: 'auto' }}>● New</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: n.isRead ? 'rgba(255,255,255,0.7)' : '#fff', margin: '0 0 4px' }}>{n.title}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{n.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
