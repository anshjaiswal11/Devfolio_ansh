import { useState, useEffect } from 'react'
import {
  clientPortalsAdminApi, adminLogsApi, adminTasksApi, adminBugsApi,
  adminMeetingsApi, adminReleasesApi, adminDocsApi, adminNotionApi, adminSlackApi, adminFeedbackApi
} from '../../services/api'
import Loader from '../../components/Loader'

export default function ClientPortalsTab() {
  const [portals, setPortals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePortalId, setActivePortalId] = useState(null)
  
  // Create / Edit Portal Form State
  const [showPortalForm, setShowPortalForm] = useState(false)
  const [editingPortal, setEditingPortal] = useState(null)
  const [portalForm, setPortalForm] = useState({
    gmail: '', passkey: '', clientName: '', projectName: '',
    githubUsername: '', githubRepo: '', progressPercent: 0, estimatedDelivery: ''
  })

  const loadPortals = () => clientPortalsAdminApi.getAll().then(r => setPortals(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { loadPortals() }, [])

  const handlePortalSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPortal) {
        // Passkey is omitted intentionally on edit, handled separately
        await clientPortalsAdminApi.update(editingPortal._id, portalForm)
      } else {
        await clientPortalsAdminApi.create(portalForm)
      }
      setShowPortalForm(false)
      loadPortals()
    } catch (err) { alert(err.response?.data?.message || 'Error saving portal') }
  }

  const openPortalForm = (p = null) => {
    if (p) {
      setEditingPortal(p)
      setPortalForm({
        gmail: p.gmail, passkey: '', clientName: p.clientName, projectName: p.projectName,
        githubUsername: p.githubUsername || '', githubRepo: p.githubRepo || '',
        progressPercent: p.progressPercent || 0, estimatedDelivery: p.estimatedDelivery ? p.estimatedDelivery.split('T')[0] : ''
      })
    } else {
      setEditingPortal(null)
      setPortalForm({ gmail: '', passkey: '', clientName: '', projectName: '', githubUsername: '', githubRepo: '', progressPercent: 0, estimatedDelivery: '' })
    }
    setShowPortalForm(true)
  }

  const handleDeletePortal = async (id) => {
    if(!confirm('Delete this portal and ALL associated data? This cannot be undone.')) return
    try { await clientPortalsAdminApi.delete(id); loadPortals() } catch { alert('Failed to delete') }
  }

  const activePortal = portals.find(p => p._id === activePortalId)

  return (
    <div>
      {/* Portals List View */}
      {!activePortalId && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Client Portals</h2>
            <button onClick={() => openPortalForm()} className="btn-primary text-xs py-2 px-4">+ New Portal</button>
          </div>

          <div className="space-y-3">
            {loading ? <Loader /> : portals.length === 0 ? (
              <div className="card-glass p-10 text-center">
                <p className="text-muted text-sm mb-3">No client portals yet.</p>
                <button onClick={() => openPortalForm()} className="btn-ghost text-xs py-2 px-4">Create first portal</button>
              </div>
            ) : portals.map(p => (
              <div key={p._id} className="card-glass p-4 flex items-center gap-4 hover:border-accent/20 transition-all cursor-pointer" onClick={() => setActivePortalId(p._id)}>
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg flex-shrink-0">🚀</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white text-sm font-medium truncate">{p.projectName} <span className="text-muted text-xs ml-2 font-normal">({p.clientName})</span></h3>
                  <p className="text-muted text-xs truncate mt-1">📧 {p.gmail} • 📈 {p.progressPercent}% • 🔗 /client</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openPortalForm(p)} className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDeletePortal(p._id)} className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Portal Create/Edit Modal */}
          {showPortalForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
              <div className="card-glass w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-white text-lg">{editingPortal ? 'Edit Portal Settings' : 'Create Client Portal'}</h2>
                  <button onClick={() => setShowPortalForm(false)} className="p-1.5 rounded-lg text-muted hover:text-white">✕</button>
                </div>
                <form onSubmit={handlePortalSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1.5">CLIENT NAME</label>
                      <input value={portalForm.clientName} onChange={e=>setPortalForm(f=>({...f,clientName:e.target.value}))} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1.5">PROJECT NAME</label>
                      <input value={portalForm.projectName} onChange={e=>setPortalForm(f=>({...f,projectName:e.target.value}))} className="input-field" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1.5">CLIENT GMAIL</label>
                      <input type="email" value={portalForm.gmail} onChange={e=>setPortalForm(f=>({...f,gmail:e.target.value}))} className="input-field" required />
                    </div>
                    {!editingPortal && (
                      <div>
                        <label className="block text-xs font-mono text-muted mb-1.5">PASSKEY (required for login)</label>
                        <input value={portalForm.passkey} onChange={e=>setPortalForm(f=>({...f,passkey:e.target.value}))} className="input-field" required />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1.5">PROGRESS %</label>
                      <input type="number" value={portalForm.progressPercent} onChange={e=>setPortalForm(f=>({...f,progressPercent:e.target.value}))} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1.5">EST. DELIVERY</label>
                      <input type="date" value={portalForm.estimatedDelivery} onChange={e=>setPortalForm(f=>({...f,estimatedDelivery:e.target.value}))} className="input-field" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1.5">GITHUB USERNAME</label>
                      <input value={portalForm.githubUsername} onChange={e=>setPortalForm(f=>({...f,githubUsername:e.target.value}))} placeholder="Optional" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-muted mb-1.5">GITHUB REPO</label>
                      <input value={portalForm.githubRepo} onChange={e=>setPortalForm(f=>({...f,githubRepo:e.target.value}))} placeholder="Optional" className="input-field" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowPortalForm(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                    <button type="submit" className="btn-primary flex-1 justify-center">{editingPortal ? 'Save Changes' : 'Create Portal'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Single Portal Management View */}
      {activePortalId && (
        <PortalManager 
          portal={activePortal} 
          onBack={() => { setActivePortalId(null); loadPortals() }} 
        />
      )}
    </div>
  )
}

// ─── Sub-Component for Managing a Specific Portal ─────────────────────────────

function PortalManager({ portal, onBack }) {
  const [activeTab, setActiveTab] = useState('logs')

  const TABS = [
    { id: 'logs', label: 'Daily Logs' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'bugs', label: 'Bugs' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'releases', label: 'Releases' },
    { id: 'notion', label: 'Notion' },
    { id: 'slack', label: 'Slack' },
  ]

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="text-muted text-sm hover:text-white mb-4 flex items-center gap-1">
        ← Back to Portals
      </button>

      <div className="card-glass p-5 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl">{portal.projectName}</h2>
          <p className="text-muted text-sm mt-1">{portal.clientName} ({portal.gmail}) • Progress: {portal.progressPercent}%</p>
        </div>
        <div className="text-right">
          <a href="/client" target="_blank" rel="noreferrer" className="btn-ghost text-xs py-1.5 px-3 mb-2 inline-block">↗ Open Client Portal</a>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === t.id ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-muted border border-white/5 hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'logs' && <AdminLogsTab portalId={portal._id} />}
      {activeTab === 'tasks' && <AdminTasksTab portalId={portal._id} />}
      {activeTab === 'feedback' && <AdminFeedbackTab portalId={portal._id} />}
      {activeTab === 'bugs' && <AdminBugsTab portalId={portal._id} />}
      {activeTab === 'meetings' && <AdminMeetingsTab portalId={portal._id} />}
      {activeTab === 'releases' && <AdminReleasesTab portalId={portal._id} />}
      {activeTab === 'notion' && <AdminNotionTab portalId={portal._id} />}
      {activeTab === 'slack' && <AdminSlackTab portalId={portal._id} />}
    </div>
  )
}

function AdminLogsTab({ portalId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({ title: '', date: '', completedTasks: 0, bugsFixed: 0, hoursWorked: 0 })
  const [logItems, setLogItems] = useState([{ text: '', type: 'feature' }])

  const load = () => adminLogsApi.getAll(portalId).then(r => setItems(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { load() }, [portalId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminLogsApi.create(portalId, { ...form, items: logItems.filter(i => i.text.trim()) })
      setShowForm(false)
      load()
    } catch { alert('Error saving log') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if(!confirm('Delete this log?')) return
    try { await adminLogsApi.delete(id); load() } catch { alert('Failed to delete') }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Daily Logs
        </h3>
        <button onClick={() => {
          setForm({ title: `Update for ${new Date().toLocaleDateString()}`, date: new Date().toISOString().split('T')[0], completedTasks: 0, bugsFixed: 0, hoursWorked: 0 })
          setLogItems([{ text: '', type: 'feature' }])
          setShowForm(true)
        }} className="btn-primary py-1 px-3 text-xs">+ Create Log</button>
      </div>

      <div className="space-y-3">
        {loading ? <Loader /> : items.length === 0 ? <p className="text-muted text-sm p-4 text-center border border-dashed border-border rounded-xl">No logs yet.</p> : items.map(log => (
          <div key={log._id} className="card-glass p-4 relative group">
            <button onClick={() => handleDelete(log._id)} className="absolute top-2 right-2 p-1 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400 text-xs font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{new Date(log.date).toLocaleDateString()}</span>
              <h4 className="text-white text-sm font-medium">{log.title}</h4>
            </div>
            {log.items?.length > 0 && (
              <ul className="text-sm text-muted space-y-1 mb-3 pl-1">
                {log.items.map((i, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span className="text-[10px] w-12 text-center uppercase tracking-wider py-0.5 rounded bg-white/5 border border-white/10 hidden sm:inline-block">{i.type}</span>
                    <span className="text-gray-300">{i.text}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-4 text-xs font-mono text-muted border-t border-border pt-2">
              <span>Tasks: <span className="text-white">{log.completedTasks || 0}</span></span>
              <span>Bugs: <span className="text-white">{log.bugsFixed || 0}</span></span>
              <span>Hours: <span className="text-white">{log.hoursWorked || 0}</span></span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-lg p-6">
            <h2 className="text-white font-semibold mb-4">New Daily Log</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-muted mb-1">TITLE</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-field" required/></div>
                <div><label className="block text-xs text-muted mb-1">DATE</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="input-field" required/></div>
              </div>
              
              <div>
                <label className="block text-xs text-muted mb-2">LOG ITEMS</label>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                  {logItems.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <select value={item.type} onChange={e => setLogItems(l => l.map((x, idx) => idx===i ? {...x, type: e.target.value} : x))} className="input-field w-28 !px-2 text-xs">
                        <option value="feature">Feature</option>
                        <option value="fix">Fix</option>
                        <option value="update">Update</option>
                      </select>
                      <input value={item.text} onChange={e => setLogItems(l => l.map((x, idx) => idx===i ? {...x, text: e.target.value} : x))} placeholder="What was done..." className="input-field flex-1 text-sm" />
                      <button type="button" onClick={() => setLogItems(l => l.filter((_, idx) => idx!==i))} className="text-muted hover:text-red-400">✕</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setLogItems(l => [...l, {text:'', type:'feature'}])} className="text-xs text-accent mt-2 hover:underline">+ Add another item</button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                <div><label className="block text-xs text-muted mb-1">TASKS COMPLETED</label><input type="number" value={form.completedTasks} onChange={e=>setForm(f=>({...f,completedTasks:e.target.value}))} className="input-field"/></div>
                <div><label className="block text-xs text-muted mb-1">BUGS FIXED</label><input type="number" value={form.bugsFixed} onChange={e=>setForm(f=>({...f,bugsFixed:e.target.value}))} className="input-field"/></div>
                <div><label className="block text-xs text-muted mb-1">HOURS WORKED</label><input type="number" value={form.hoursWorked} onChange={e=>setForm(f=>({...f,hoursWorked:e.target.value}))} className="input-field"/></div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? '...' : 'Publish Log'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminTasksTab({ portalId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '' })

  const load = () => adminTasksApi.getAll(portalId).then(r => setItems(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { load() }, [portalId])

  const openForm = (task = null) => {
    if (task) {
      setEditId(task._id)
      setForm({ title: task.title, description: task.description||'', status: task.status, priority: task.priority, assignee: task.assignee||'', dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' })
    } else {
      setEditId(null)
      setForm({ title: '', description: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '' })
    }
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) await adminTasksApi.update(editId, form)
      else await adminTasksApi.create(portalId, form)
      setShowForm(false)
      load()
    } catch { alert('Error saving task') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if(!confirm('Delete this task?')) return
    try { await adminTasksApi.delete(id); load() } catch { alert('Failed to delete') }
  }

  const STATUS_COLORS = { todo: 'slate', 'in-progress': 'blue', review: 'yellow', done: 'emerald' }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Tasks Setup
        </h3>
        <button onClick={() => openForm()} className="btn-primary py-1 px-3 text-xs">+ New Task</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {loading ? <Loader /> : items.length === 0 ? <p className="text-muted text-sm p-4 text-center border border-dashed border-border rounded-xl col-span-full">No tasks yet.</p> : items.map(task => (
          <div key={task._id} className="card-glass p-4 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-void/80 backdrop-blur rounded p-1">
              <button onClick={() => openForm(task)} className="p-1 text-muted hover:text-accent">✎</button>
              <button onClick={() => handleDelete(task._id)} className="p-1 text-muted hover:text-red-400">✕</button>
            </div>
            <div className="flex items-start justify-between mb-2 pr-12">
              <h4 className="text-white text-sm font-medium">{task.title}</h4>
            </div>
            <p className="text-xs text-muted mb-3 line-clamp-2">{task.description}</p>
            <div className="flex gap-2 flex-wrap text-[10px] font-mono uppercase tracking-wider">
              <span className={`px-2 py-0.5 rounded border bg-${STATUS_COLORS[task.status]}-500/10 text-${STATUS_COLORS[task.status]}-400 border-${STATUS_COLORS[task.status]}-500/20`}>{task.status.replace('-', ' ')}</span>
              <span className={`px-2 py-0.5 rounded border ${task.priority==='high'?'bg-red-500/10 text-red-400 border-red-500/20':task.priority==='medium'?'bg-yellow-500/10 text-yellow-400 border-yellow-500/20':'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>Pri:{task.priority}</span>
              {task.assignee && <span className="px-2 py-0.5 rounded border bg-white/5 text-gray-300 border-white/10">{task.assignee}</span>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-md p-6">
            <h2 className="text-white font-semibold mb-4">{editId ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-muted mb-1">TITLE</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-field" required/></div>
              <div><label className="block text-xs text-muted mb-1">DESCRIPTION</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} className="input-field resize-none"/></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1">STATUS</label>
                  <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="input-field">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">PRIORITY</label>
                  <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className="input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-muted mb-1">ASSIGNEE (Optional)</label><input value={form.assignee} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))} className="input-field"/></div>
                <div><label className="block text-xs text-muted mb-1">DUE DATE (Optional)</label><input type="date" value={form.dueDate} onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} className="input-field"/></div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? '...' : editId ? 'Save Changes' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminFeedbackTab({ portalId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyId, setReplyId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => adminFeedbackApi.getAll(portalId).then(r => setItems(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { load() }, [portalId])

  const handleReply = async (id) => {
    if (!replyText.trim()) return
    setSaving(true)
    try {
      await adminFeedbackApi.reply(id, replyText)
      setReplyId(null)
      setReplyText('')
      load()
    } catch { alert('Failed to send reply') } finally { setSaving(false) }
  }

  const TYPE_COLORS = { general: 'slate', bug: 'red', feature: 'blue', question: 'yellow' }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Client Feedback
        </h3>
      </div>

      {loading ? <Loader /> : items.length === 0 ? <p className="text-muted text-sm p-4 text-center border border-dashed border-border rounded-xl">No feedback yet.</p> : items.map(fb => (
        <div key={fb._id} className="card-glass p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border bg-${TYPE_COLORS[fb.type]}-500/10 text-${TYPE_COLORS[fb.type]}-400 border-${TYPE_COLORS[fb.type]}-500/20`}>{fb.type}</span>
              <span className="text-muted text-xs ml-2">{new Date(fb.createdAt).toLocaleString()}</span>
            </div>
            {!fb.isRead && <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>}
          </div>
          <p className="text-white text-sm mb-3 whitespace-pre-wrap">{fb.message}</p>
          <div className="text-xs text-muted font-mono mb-4">— {fb.clientName}</div>

          {fb.adminReply ? (
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 ml-4">
              <p className="text-xs text-accent font-semibold mb-1">Your Reply:</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{fb.adminReply}</p>
            </div>
          ) : replyId === fb._id ? (
            <div className="ml-4 flex gap-2">
              <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Type your reply..." className="input-field flex-1 text-sm py-1.5" autoFocus />
              <button disabled={saving} onClick={() => handleReply(fb._id)} className="btn-primary py-1.5 px-3 text-xs">{saving ? '...' : 'Send'}</button>
              <button onClick={() => { setReplyId(null); setReplyText('') }} className="btn-ghost py-1.5 px-3 text-xs">Cancel</button>
            </div>
          ) : (
            <button onClick={() => { setReplyId(fb._id); setReplyText('') }} className="text-xs text-accent hover:underline ml-4">↳ Reply to client</button>
          )}
        </div>
      ))}
    </div>
  )
}
function AdminBugsTab({ portalId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({ title: '', description: '', severity: 'medium', status: 'open' })

  const load = () => adminBugsApi.getAll(portalId).then(r => setItems(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { load() }, [portalId])

  const openForm = (bug = null) => {
    if (bug) {
      setEditId(bug._id)
      setForm({ title: bug.title, description: bug.description||'', severity: bug.severity, status: bug.status })
    } else {
      setEditId(null)
      setForm({ title: '', description: '', severity: 'medium', status: 'open' })
    }
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) await adminBugsApi.update(editId, form)
      else await adminBugsApi.create(portalId, form)
      setShowForm(false)
      load()
    } catch { alert('Error saving bug') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if(!confirm('Delete this bug ticket?')) return
    try { await adminBugsApi.delete(id); load() } catch { alert('Failed to delete') }
  }

  const SEVERITY_COLORS = { low: 'slate', medium: 'yellow', high: 'orange', critical: 'red' }
  const STATUS_COLORS = { open: 'red', 'in-progress': 'blue', resolved: 'emerald', closed: 'slate' }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Bug Tracker
        </h3>
        <button onClick={() => openForm()} className="btn-primary py-1 px-3 text-xs">+ Report Bug</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {loading ? <Loader /> : items.length === 0 ? <p className="text-muted text-sm p-4 text-center border border-dashed border-border rounded-xl col-span-full">No bugs reported yet.</p> : items.map(bug => (
          <div key={bug._id} className="card-glass p-4 relative group hover:border-accent/30 transition-all">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-void/80 backdrop-blur rounded p-1">
              <button onClick={() => openForm(bug)} className="p-1 text-muted hover:text-accent">✎</button>
              <button onClick={() => handleDelete(bug._id)} className="p-1 text-muted hover:text-red-400">✕</button>
            </div>
            
            <div className="flex gap-2 mb-2 items-center">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border bg-${SEVERITY_COLORS[bug.severity]}-500/10 text-${SEVERITY_COLORS[bug.severity]}-400 border-${SEVERITY_COLORS[bug.severity]}-500/20`}>{bug.severity}</span>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border bg-${STATUS_COLORS[bug.status]}-500/10 text-${STATUS_COLORS[bug.status]}-400 border-${STATUS_COLORS[bug.status]}-500/20`}>{bug.status.replace('-', ' ')}</span>
            </div>
            
            <h4 className="text-white text-sm font-medium mb-1 pr-8">{bug.title}</h4>
            <p className="text-xs text-muted line-clamp-2">{bug.description}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-md p-6">
            <h2 className="text-white font-semibold mb-4">{editId ? 'Update Bug' : 'Report Bug'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-muted mb-1">TITLE</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-field" required/></div>
              <div><label className="block text-xs text-muted mb-1">DESCRIPTION</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} className="input-field resize-none"/></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1">SEVERITY</label>
                  <select value={form.severity} onChange={e=>setForm(f=>({...f,severity:e.target.value}))} className="input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">STATUS</label>
                  <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="input-field">
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? '...' : editId ? 'Save Changes' : 'Create Bug'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
function AdminMeetingsTab({ portalId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({ title: '', date: '', attendees: '', notes: '', actionItems: '', recordingUrl: '' })

  const load = () => adminMeetingsApi.getAll(portalId).then(r => setItems(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { load() }, [portalId])

  const openForm = (meeting = null) => {
    if (meeting) {
      setEditId(meeting._id)
      setForm({ 
        title: meeting.title, date: meeting.date ? meeting.date.split('T')[0] : '', 
        attendees: meeting.attendees?.join(', ') || '', 
        notes: meeting.notes || '', 
        actionItems: meeting.actionItems?.join('\n') || '', 
        recordingUrl: meeting.recordingUrl || '' 
      })
    } else {
      setEditId(null)
      setForm({ title: '', date: '', attendees: '', notes: '', actionItems: '', recordingUrl: '' })
    }
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      attendees: form.attendees.split(',').map(a => a.trim()).filter(Boolean),
      actionItems: form.actionItems.split('\n').map(a => a.trim()).filter(Boolean)
    }
    try {
      if (editId) await adminMeetingsApi.update(editId, payload)
      else await adminMeetingsApi.create(portalId, payload)
      setShowForm(false)
      load()
    } catch { alert('Error saving meeting') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if(!confirm('Delete this meeting note?')) return
    try { await adminMeetingsApi.delete(id); load() } catch { alert('Failed to delete') }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          Meetings
        </h3>
        <button onClick={() => openForm()} className="btn-primary py-1 px-3 text-xs">+ Log Meeting</button>
      </div>

      <div className="space-y-3">
        {loading ? <Loader /> : items.length === 0 ? <p className="text-muted text-sm p-4 text-center border border-dashed border-border rounded-xl">No meetings logged yet.</p> : items.map(m => (
          <div key={m._id} className="card-glass p-4 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-void/80 backdrop-blur rounded p-1">
              <button onClick={() => openForm(m)} className="p-1 text-muted hover:text-accent">✎</button>
              <button onClick={() => handleDelete(m._id)} className="p-1 text-muted hover:text-red-400">✕</button>
            </div>
            
            <div className="flex gap-2 mb-2 items-center">
              <span className="text-cyan-400 text-xs font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{new Date(m.date).toLocaleDateString()}</span>
              <h4 className="text-white text-sm font-medium">{m.title}</h4>
            </div>
            {m.notes && <p className="text-xs text-muted mb-3 whitespace-pre-wrap">{m.notes}</p>}
            
            {m.actionItems?.length > 0 && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/5 text-sm mb-3">
                <p className="text-white font-medium text-xs mb-1">Action Items:</p>
                <ul className="text-muted space-y-1 pl-1">
                  {m.actionItems.map((ai, idx) => (
                    <li key={idx} className="flex gap-2 text-xs">
                      <span className="text-accent">☐</span> {ai}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-lg p-6">
            <h2 className="text-white font-semibold mb-4">{editId ? 'Update Meeting' : 'Log Meeting'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-muted mb-1">TITLE</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-field" required/></div>
                <div><label className="block text-xs text-muted mb-1">DATE</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="input-field" required/></div>
              </div>
              <div><label className="block text-xs text-muted mb-1">ATTENDEES (comma-separated)</label><input value={form.attendees} onChange={e=>setForm(f=>({...f,attendees:e.target.value}))} className="input-field"/></div>
              <div><label className="block text-xs text-muted mb-1">NOTES</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={3} className="input-field resize-none"/></div>
              <div><label className="block text-xs text-muted mb-1">ACTION ITEMS (one per line)</label><textarea value={form.actionItems} onChange={e=>setForm(f=>({...f,actionItems:e.target.value}))} rows={3} className="input-field resize-none"/></div>
              <div><label className="block text-xs text-muted mb-1">RECORDING URL</label><input value={form.recordingUrl} onChange={e=>setForm(f=>({...f,recordingUrl:e.target.value}))} className="input-field"/></div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? '...' : editId ? 'Save Changes' : 'Log Meeting'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
function AdminReleasesTab({ portalId }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({ version: '', title: '', type: 'minor', feats: '', fixes: '', releaseDate: '', isPublished: false })

  const load = () => adminReleasesApi.getAll(portalId).then(r => setItems(r.data)).catch(console.error).finally(()=>setLoading(false))
  useEffect(() => { load() }, [portalId])

  const openForm = (release = null) => {
    if (release) {
      setEditId(release._id)
      setForm({ 
        version: release.version, title: release.title, type: release.type, 
        feats: release.feats?.join('\n') || '', 
        fixes: release.fixes?.join('\n') || '', 
        releaseDate: release.releaseDate ? release.releaseDate.split('T')[0] : '',
        isPublished: release.isPublished
      })
    } else {
      setEditId(null)
      setForm({ version: '', title: '', type: 'minor', feats: '', fixes: '', releaseDate: new Date().toISOString().split('T')[0], isPublished: false })
    }
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      feats: form.feats.split('\n').map(a => a.trim()).filter(Boolean),
      fixes: form.fixes.split('\n').map(a => a.trim()).filter(Boolean)
    }
    try {
      if (editId) await adminReleasesApi.update(editId, payload)
      else await adminReleasesApi.create(portalId, payload)
      setShowForm(false)
      load()
    } catch { alert('Error saving release') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if(!confirm('Delete this release?')) return
    try { await adminReleasesApi.delete(id); load() } catch { alert('Failed to delete') }
  }

  const TYPE_COLORS = { major: 'purple', minor: 'blue', patch: 'slate', hotfix: 'red' }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          Releases & Changelog
        </h3>
        <button onClick={() => openForm()} className="btn-primary py-1 px-3 text-xs">+ New Release</button>
      </div>

      <div className="space-y-4">
        {loading ? <Loader /> : items.length === 0 ? <p className="text-muted text-sm p-4 text-center border border-dashed border-border rounded-xl">No releases yet.</p> : items.map(release => (
          <div key={release._id} className="card-glass p-5 relative group border-l-4" style={{borderLeftColor: `rgba(var(--color-${TYPE_COLORS[release.type]}-500), 0.5)`}}>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-void/80 backdrop-blur rounded p-1">
              <button onClick={() => openForm(release)} className="p-1 text-muted hover:text-accent">✎</button>
              <button onClick={() => handleDelete(release._id)} className="p-1 text-muted hover:text-red-400">✕</button>
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-sm font-bold font-mono text-${TYPE_COLORS[release.type]}-400`}>{release.version}</span>
              <h4 className="text-white font-medium text-lg">{release.title}</h4>
              <span className="text-muted text-xs font-mono">{new Date(release.releaseDate).toLocaleDateString()}</span>
              {!release.isPublished && <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20">Draft</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {release.feats?.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-accent mb-2 uppercase tracking-wider">Features & Updates</h5>
                  <ul className="text-muted text-sm space-y-1 pl-1">
                    {release.feats.map((f, i) => <li key={i} className="flex gap-2"><span className="text-accent">•</span> {f}</li>)}
                  </ul>
                </div>
              )}
              {release.fixes?.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wider">Bug Fixes</h5>
                  <ul className="text-muted text-sm space-y-1 pl-1">
                    {release.fixes.map((f, i) => <li key={i} className="flex gap-2"><span className="text-red-400">•</span> {f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-lg p-6">
            <h2 className="text-white font-semibold mb-4">{editId ? 'Edit Release' : 'Draft New Release'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-xs text-muted mb-1">VERSION</label><input value={form.version} onChange={e=>setForm(f=>({...f,version:e.target.value}))} placeholder="v1.0.0" className="input-field" required/></div>
                <div className="col-span-2"><label className="block text-xs text-muted mb-1">TITLE</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="input-field" required/></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted mb-1">TYPE</label>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="input-field">
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="patch">Patch</option>
                    <option value="hotfix">Hotfix</option>
                  </select>
                </div>
                <div><label className="block text-xs text-muted mb-1">RELEASE DATE</label><input type="date" value={form.releaseDate} onChange={e=>setForm(f=>({...f,releaseDate:e.target.value}))} className="input-field" required/></div>
              </div>

              <div><label className="block text-xs text-muted mb-1">FEATURES / UPDATES (one per line)</label><textarea value={form.feats} onChange={e=>setForm(f=>({...f,feats:e.target.value}))} rows={3} className="input-field resize-none"/></div>
              <div><label className="block text-xs text-muted mb-1">BUG FIXES (one per line)</label><textarea value={form.fixes} onChange={e=>setForm(f=>({...f,fixes:e.target.value}))} rows={3} className="input-field resize-none"/></div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="pubRelease" checked={form.isPublished} onChange={e=>setForm(f=>({...f,isPublished:e.target.checked}))} className="w-4 h-4 rounded border-border bg-card/40 accent-accent" />
                <div>
                  <label htmlFor="pubRelease" className="text-text text-sm block">Publish Release</label>
                  <p className="text-[10px] text-muted">A Slack notification will be sent immediately upon publication.</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? '...' : editId ? 'Save Changes' : 'Create Release'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
function AdminNotionTab({ portalId }) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const [form, setForm] = useState({ embedUrl: '', notionToken: '', databaseId: '', syncTasks: false })

  const load = () => adminNotionApi.get(portalId).then(r => {
    setConfig(r.data)
    if(r.data) setForm({ embedUrl: r.data.embedUrl||'', notionToken: '', databaseId: r.data.databaseId||'', syncTasks: r.data.syncTasks||false })
  }).catch(console.error).finally(()=>setLoading(false))
  
  useEffect(() => { load() }, [portalId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminNotionApi.save(portalId, form)
      alert('Notion configuration saved!')
      setForm(f => ({ ...f, notionToken: '' })) // clear token input after save for sec
      load()
    } catch { alert('Error saving config') } finally { setSaving(false) }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await adminNotionApi.sync(portalId)
      alert(`Synced ${res.data.syncedCount} tasks successfully!`)
      load()
    } catch (e) { alert(e.response?.data?.message || 'Sync failed') } finally { setSyncing(false) }
  }

  if (loading) return <Loader />

  return (
    <div className="card-glass p-6 max-w-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-text" viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.76 1.968c-.42-.326-.981-.653-2.148-.606L3.852 2.155c-.234.047-.56.14-.56.42v19.462c0 .28.233.466.56.466l14.475 1.26c.326.046.513-.14.513-.42V6.26c0-.28-.233-.42-.513-.42-.14 0-.327.047-.42.14l-1.961 1.68c-.187.14-.373.42-.373.746v12.275c0 .234-.14.374-.373.374-.187 0-.374-.047-.467-.14l-9.15-10.455v8.54c0 .467.28.84 1.12 1.027l1.727.42V21.13l-4.761-.326v-.654l1.447-.233c.42-.093.607-.373.607-.793V6.26c0-.42-.187-.7-.607-.793l-1.447-.233v-.653l1.54-.373z" /></svg>
            Notion Integration
          </h3>
          <p className="text-muted text-xs">Embed Notion pages and automatically sync tasks from a database to the Kanban board.</p>
        </div>
        {config?.lastSyncedAt && <span className="text-[10px] text-muted font-mono bg-white/5 px-2 py-1 rounded">Last sync: {new Date(config.lastSyncedAt).toLocaleString()}</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-4">
        <div>
          <label className="block text-xs text-muted mb-1">PUBLIC EMBED URL (Optional)</label>
          <input value={form.embedUrl} onChange={e=>setForm(f=>({...f,embedUrl:e.target.value}))} placeholder="https://v1.embednotion.com/..." className="input-field" />
          <p className="text-[10px] text-muted mt-1">If provided, this page will be embedded in the client's Notion tab.</p>
        </div>

        <div className="bg-white/5 p-4 rounded border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="syncTasks" checked={form.syncTasks} onChange={e=>setForm(f=>({...f,syncTasks:e.target.checked}))} className="w-4 h-4 rounded border-border bg-card/40 accent-accent" />
            <label htmlFor="syncTasks" className="text-white text-sm font-medium">Enable Task Sync (1-Way to Dashboard)</label>
          </div>
          
          {form.syncTasks && (
            <>
              <div>
                <label className="block text-xs text-muted mb-1">NOTION INTERNAL INTEGRATION TOKEN</label>
                <input type="password" value={form.notionToken} onChange={e=>setForm(f=>({...f,notionToken:e.target.value}))} placeholder={config?.notionToken ? "•••••••••••••••• (Set to overwrite)" : "secret_..."} className="input-field font-mono text-xs" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">DATABASE ID</label>
                <input value={form.databaseId} onChange={e=>setForm(f=>({...f,databaseId:e.target.value}))} placeholder="e.g. 1a2b3c4d5e..." className="input-field font-mono text-xs" />
                <p className="text-[10px] text-muted mt-1">Ensure your Integration bot is invited to this Database in Notion.</p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="btn-primary py-2 px-4 text-xs">{saving ? 'Saving...' : 'Save Configuration'}</button>
          {(config?.notionToken && config?.databaseId && config?.syncTasks) && (
             <button type="button" onClick={handleSync} disabled={syncing} className="btn-ghost py-2 px-4 text-xs flex items-center gap-1 border border-white/10">
               {syncing ? 'Syncing...' : '🔄 Force Sync Tasks Now'}
             </button>
          )}
        </div>
      </form>
    </div>
  )
}

function AdminSlackTab({ portalId }) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pinging, setPinging] = useState(false)

  const [form, setForm] = useState({ webhookUrl: '', channelName: '', notifyOnFeedback: true, notifyOnLog: true, notifyOnMilestone: true, notifyOnBug: true, notifyOnGithub: true })

  const load = () => adminSlackApi.get(portalId).then(r => {
    setConfig(r.data)
    if(r.data) setForm({ webhookUrl: r.data.webhookUrl||'', channelName: r.data.channelName||'', notifyOnFeedback: !!r.data.notifyOnFeedback, notifyOnLog: !!r.data.notifyOnLog, notifyOnMilestone: !!r.data.notifyOnMilestone, notifyOnBug: !!r.data.notifyOnBug, notifyOnGithub: r.data.notifyOnGithub !== false })
  }).catch(console.error).finally(()=>setLoading(false))
  
  useEffect(() => { load() }, [portalId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminSlackApi.save(portalId, form)
      alert('Slack configuration saved!')
      load()
    } catch { alert('Error saving config') } finally { setSaving(false) }
  }

  const handleTestPing = async () => {
    setPinging(true)
    try {
      await adminSlackApi.testPing(portalId)
      alert('Test ping sent successfully! Check your Slack channel.')
    } catch (e) { alert(e.response?.data?.message || 'Failed to send ping') } finally { setPinging(false) }
  }

  if (loading) return <Loader />

  return (
    <div className="card-glass p-6 max-w-2xl">
      <div className="mb-6">
        <h3 className="text-white font-semibold flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-[#E01E5A]" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.522h2.52v2.522zm1.271 0a2.527 2.527 0 0 1 2.521-2.522 2.527 2.527 0 0 1 2.521 2.522v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.164 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.164 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.164 24a2.528 2.528 0 0 1-2.521-2.522v-2.522h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.522 2.528 2.528 0 0 1 2.521-2.521h6.313A2.528 2.528 0 0 1 24 15.164a2.528 2.528 0 0 1-2.522 2.522h-6.313z" /></svg>
          Slack Webhook Integration
        </h3>
        <p className="text-muted text-xs">Automatically push notifications to a Slack channel when specific actions occur.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-4">
        <div>
          <label className="block text-xs text-muted mb-1">INCOMING WEBHOOK URL</label>
          <input type="password" value={form.webhookUrl} onChange={e=>setForm(f=>({...f,webhookUrl:e.target.value}))} placeholder="https://hooks.slack.com/services/..." className="input-field font-mono text-xs" />
          <p className="text-[10px] text-muted mt-1">This URL is securely stored and never exposed to the client frontend.</p>
        </div>
        
        <div>
          <label className="block text-xs text-muted mb-1">CHANNEL NAME (Used for display purposes on client dash)</label>
          <input value={form.channelName} onChange={e=>setForm(f=>({...f,channelName:e.target.value}))} placeholder="#project-updates" className="input-field" />
        </div>

        <div className="bg-white/5 p-4 rounded border border-white/5 space-y-3">
          <label className="block text-xs text-muted mb-2 font-semibold">NOTIFICATION TRIGGERS</label>
          
          {[
            { id: 'notifyOnFeedback', label: 'New Client Feedback Received' },
            { id: 'notifyOnLog', label: 'Daily Log Published' },
            { id: 'notifyOnBug', label: 'Bug Created or Status Changed' },
            { id: 'notifyOnMilestone', label: 'Release / Milestone Published' },
            { id: 'notifyOnGithub', label: 'GitHub Activity (Push, PR, Issues)' },
          ].map(t => (
            <div key={t.id} className="flex items-center gap-3">
              <input type="checkbox" id={t.id} checked={form[t.id]} onChange={e=>setForm(f=>({...f,[t.id]:e.target.checked}))} className="w-4 h-4 rounded border-border bg-card/40 accent-accent" />
              <label htmlFor={t.id} className="text-gray-300 text-sm">{t.label}</label>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="btn-primary py-2 px-4 text-xs">{saving ? 'Saving...' : 'Save Configuration'}</button>
          {config?.webhookUrl && (
             <button type="button" onClick={handleTestPing} disabled={pinging} className="btn-ghost py-2 px-4 text-xs flex items-center gap-1 border border-white/10 hover:border-text hover:text-white">
               {pinging ? 'Sending...' : '🔔 Send Test Ping'}
             </button>
          )}
        </div>
      </form>
    </div>
  )
}
