import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { projectsApi, blogsApi, aboutApi, clientProjectsApi } from '../services/api'
import Loader from '../components/Loader'

// ─── Helpers ────────────────────────────────────────────────────────────────

function toBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result)
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}

// ─── Projects Tab ─────────────────────────────────────────────────────────

const EMPTY_PROJECT = { title: '', slug: '', description: '', techStack: '', githubLink: '', liveDemoLink: '', imageUrl: '', featured: false }

function ProjectsTab() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_PROJECT)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const imgRef = useRef()

  const load = () => projectsApi.getAll()
    .then(r => setProjects(r.data.projects || r.data))
    .catch(() => setProjects([]))
    .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY_PROJECT); setEditId(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ title: p.title, slug: p.slug, description: p.description, techStack: p.techStack?.join(', ') || '', githubLink: p.githubLink || '', liveDemoLink: p.liveDemoLink || '', imageUrl: p.imageUrl || '', featured: p.featured || false })
    setEditId(p._id)
    setShowForm(true)
  }

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await toBase64(file)
    setForm(f => ({ ...f, imageUrl: b64 }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editId) await projectsApi.update(editId, payload)
      else await projectsApi.create(payload)
      setShowForm(false); load()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving project')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await projectsApi.delete(id); setDeleteConfirm(null); load() }
    catch { alert('Failed to delete project') }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: projects.length },
          { label: 'Live Demo', value: projects.filter(p => p.liveDemoLink).length },
          { label: 'Open Source', value: projects.filter(p => p.githubLink).length },
        ].map(s => (
          <div key={s.label} className="card-glass p-4 text-center">
            <div className="font-bold text-2xl gradient-text">{s.value}</div>
            <div className="text-muted text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Projects</h2>
        <button onClick={openCreate} className="btn-primary text-xs py-2 px-4">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <Loader /> : projects.length === 0 ? (
          <div className="card-glass p-10 text-center">
            <p className="text-muted text-sm mb-3">No projects yet.</p>
            <button onClick={openCreate} className="btn-ghost text-xs py-2 px-4">Add first project</button>
          </div>
        ) : projects.map(p => (
          <div key={p._id} className="card-glass p-4 flex items-center gap-4 hover:border-accent/20 transition-all">
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.title} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-white text-sm font-medium truncate">{p.title}</h3>
              <p className="text-muted text-xs font-mono">/projects/{p.slug}</p>
            </div>
            <div className="flex flex-wrap gap-1 flex-shrink-0 hidden sm:flex">
              {p.techStack?.slice(0, 2).map(t => <span key={t} className="tech-badge text-xs">{t}</span>)}
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => setDeleteConfirm(p._id)} className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-white text-lg">{editId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-muted hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'title', label: 'TITLE', placeholder: 'My Project', required: true },
                { key: 'slug', label: 'SLUG', placeholder: 'my-project', required: true },
                { key: 'githubLink', label: 'GITHUB URL', placeholder: 'https://github.com/...' },
                { key: 'liveDemoLink', label: 'LIVE DEMO URL', placeholder: 'https://...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="input-field" required={!!f.required} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">TECH STACK</label>
                <input value={form.techStack} onChange={e => setForm(p => ({ ...p, techStack: e.target.value }))}
                  placeholder="React, Node.js, MongoDB" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">DESCRIPTION</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} placeholder="Project description..." className="input-field resize-none" required />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">PROJECT IMAGE</label>
                <input ref={imgRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                {form.imageUrl ? (
                  <div className="relative">
                    <img src={form.imageUrl} alt="Preview" className="w-full aspect-video object-cover rounded-xl border border-border mb-2" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-void/80 text-red-400 hover:bg-red-400/10 transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => imgRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-accent/40 hover:bg-accent/3 transition-all cursor-pointer">
                    <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-muted text-xs">Click to upload image</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-border bg-card/40 accent-accent" />
                <label htmlFor="featured" className="text-text text-sm">Mark as featured project</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? '...' : editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Delete project?</h3>
            <p className="text-muted text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1 justify-center">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Blog Tab ──────────────────────────────────────────────────────────────

const EMPTY_BLOG = { title: '', slug: '', excerpt: '', content: '', tags: '', published: false, coverImage: '' }

function BlogTab() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_BLOG)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const imgRef = useRef()

  const load = () => blogsApi.getAll(true)
    .then(r => setBlogs(r.data.blogs || []))
    .catch(() => setBlogs([]))
    .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY_BLOG); setEditId(null); setShowForm(true) }
  const openEdit = (b) => {
    setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt || '', content: b.content || '', tags: b.tags?.join(', ') || '', published: b.published || false, coverImage: b.coverImage || '' })
    setEditId(b._id); setShowForm(true)
  }

  const handleCoverImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await toBase64(file)
    setForm(f => ({ ...f, coverImage: b64 }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    const payload = { ...form, slug: form.slug || undefined, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editId) await blogsApi.update(editId, payload)
      else await blogsApi.create(payload)
      setShowForm(false); load()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving blog')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await blogsApi.delete(id); setDeleteConfirm(null); load() }
    catch { alert('Failed to delete') }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Blog Posts</h2>
        <button onClick={openCreate} className="btn-primary text-xs py-2 px-4">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New Post
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <Loader /> : blogs.length === 0 ? (
          <div className="card-glass p-10 text-center">
            <p className="text-muted text-sm mb-3">No blog posts yet.</p>
            <button onClick={openCreate} className="btn-ghost text-xs py-2 px-4">Write first post</button>
          </div>
        ) : blogs.map(b => (
          <div key={b._id} className="card-glass p-4 flex items-center gap-4 hover:border-accent/20 transition-all">
            {b.coverImage && <img src={b.coverImage} alt={b.title} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white text-sm font-medium truncate">{b.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${b.published ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                  {b.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-muted text-xs">{new Date(b.createdAt).toLocaleDateString()} · {b.readTime || '?'} min read</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => setDeleteConfirm(b._id)} className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-white text-lg">{editId ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-muted hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">TITLE</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="My blog post title" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">SLUG (auto-generated if empty)</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="my-blog-post" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">EXCERPT</label>
                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={2} placeholder="A brief description..." className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">TAGS (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="React, Tutorial, Web Dev" className="input-field" />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">COVER IMAGE</label>
                <input ref={imgRef} type="file" accept="image/*" onChange={handleCoverImage} className="hidden" />
                {form.coverImage ? (
                  <div className="relative">
                    <img src={form.coverImage} alt="Cover" className="w-full aspect-video object-cover rounded-xl border border-border mb-2" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                      className="absolute top-2 right-2 p-1 rounded-lg bg-void/80 text-red-400 hover:bg-red-400/10 transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => imgRef.current?.click()}
                    className="w-full py-6 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 hover:border-accent/40 hover:bg-accent/3 transition-all text-muted text-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    Upload Cover Image
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">CONTENT (Markdown)</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={12} placeholder="Write your post in **Markdown**..." className="input-field resize-y font-mono text-xs" required />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 rounded border-border bg-card/40 accent-accent" />
                <label htmlFor="pub" className="text-text text-sm">Publish immediately</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? '...' : editId ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-sm p-6 text-center">
            <h3 className="font-semibold text-white mb-2">Delete post?</h3>
            <p className="text-muted text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1 justify-center">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── About Tab ─────────────────────────────────────────────────────────────

function AboutTab() {
  const [form, setForm] = useState({
    name: '', tagline: '', bio: '', location: '', profileImage: '', resumeUrl: '',
    skills: '', tools: '',
    socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
    experience: [],
    education: [],
    githubUsername: '', leetcodeUsername: '', gfgUsername: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    aboutApi.get().then(r => {
      const a = r.data.about
      setForm({
        name: a.name || '', tagline: a.tagline || '', bio: a.bio || '', location: a.location || '',
        profileImage: a.profileImage || '', resumeUrl: a.resumeUrl || '',
        skills: a.skills?.join(', ') || '', tools: a.tools?.join(', ') || '',
        socialLinks: a.socialLinks || { github: '', linkedin: '', twitter: '', website: '' },
        experience: a.experience || [], education: a.education || [],
        githubUsername: a.githubUsername || '', leetcodeUsername: a.leetcodeUsername || '', gfgUsername: a.gfgUsername || '',
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const b64 = await toBase64(file)
    setForm(f => ({ ...f, profileImage: b64 }))
  }

  const addExp = () => setForm(f => ({ ...f, experience: [...f.experience, { role: '', company: '', period: '', desc: '' }] }))
  const removeExp = (i) => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))
  const updateExp = (i, key, val) => setForm(f => ({ ...f, experience: f.experience.map((e, idx) => idx === i ? { ...e, [key]: val } : e) }))

  const addEdu = () => setForm(f => ({ ...f, education: [...f.education, { degree: '', school: '', year: '', note: '' }] }))
  const removeEdu = (i) => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))
  const updateEdu = (i, key, val) => setForm(f => ({ ...f, education: f.education.map((e, idx) => idx === i ? { ...e, [key]: val } : e) }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    const payload = {
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      tools: form.tools.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      await aboutApi.update(payload)
      alert('Profile updated successfully!')
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  if (loading) return <Loader />

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="card-glass p-6 space-y-4">
        <h3 className="text-white font-semibold mb-2">Basic Information</h3>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Profile image */}
          <div className="flex-shrink-0 text-center">
            <input ref={imgRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <div
              onClick={() => imgRef.current?.click()}
              className="w-24 h-24 rounded-full border-2 border-dashed border-border hover:border-accent/40 cursor-pointer overflow-hidden bg-card/40 flex items-center justify-center transition-all"
            >
              {form.profileImage
                ? <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover" />
                : <span className="text-muted text-3xl">{form.name?.charAt(0) || '?'}</span>
              }
            </div>
            <p className="text-muted text-xs mt-2">Click to change</p>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[
              { key: 'name', label: 'NAME', required: true },
              { key: 'tagline', label: 'TAGLINE', placeholder: 'Full-Stack Developer' },
              { key: 'location', label: 'LOCATION', placeholder: 'City, Country' },
              { key: 'resumeUrl', label: 'RESUME URL', placeholder: 'https://...' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="input-field" required={!!f.required} />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">BIO</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={5} placeholder="Tell the world about yourself..." className="input-field resize-y" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">SKILLS (comma-separated)</label>
            <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
              placeholder="React, Node.js, TypeScript" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">TOOLS (comma-separated)</label>
            <input value={form.tools} onChange={e => setForm(f => ({ ...f, tools: e.target.value }))}
              placeholder="Docker, Git, Figma" className="input-field" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="card-glass p-6 space-y-4">
        <h3 className="text-white font-semibold">Social Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['github', 'linkedin', 'twitter', 'website'].map(key => (
            <div key={key}>
              <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider uppercase">{key}</label>
              <input value={form.socialLinks[key]} onChange={e => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: e.target.value } }))}
                placeholder={`https://${key}.com/...`} className="input-field" />
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="card-glass p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Experience</h3>
          <button type="button" onClick={addExp} className="btn-ghost text-xs py-1.5 px-3">+ Add</button>
        </div>
        {form.experience.map((exp, i) => (
          <div key={i} className="border border-border rounded-xl p-4 space-y-3 relative">
            <button type="button" onClick={() => removeExp(i)} className="absolute top-3 right-3 p-1 text-muted hover:text-red-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'role', label: 'ROLE', placeholder: 'Senior Developer' },
                { key: 'company', label: 'COMPANY', placeholder: 'Company Name' },
                { key: 'period', label: 'PERIOD', placeholder: '2022 – Present' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-mono text-muted mb-1 tracking-wider">{f.label}</label>
                  <input value={exp[f.key]} onChange={e => updateExp(i, f.key, e.target.value)}
                    placeholder={f.placeholder} className="input-field py-2 text-sm" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1 tracking-wider">DESCRIPTION</label>
              <textarea value={exp.desc} onChange={e => updateExp(i, 'desc', e.target.value)}
                rows={2} placeholder="What you did..." className="input-field resize-none text-sm" />
            </div>
          </div>
        ))}
        {form.experience.length === 0 && (
          <p className="text-muted text-sm text-center py-4">No experience entries. Click "+ Add" to start.</p>
        )}
      </div>

      {/* Education */}
      <div className="card-glass p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Education</h3>
          <button type="button" onClick={addEdu} className="btn-ghost text-xs py-1.5 px-3">+ Add</button>
        </div>
        {form.education.map((edu, i) => (
          <div key={i} className="border border-border rounded-xl p-4 space-y-3 relative">
            <button type="button" onClick={() => removeEdu(i)} className="absolute top-3 right-3 p-1 text-muted hover:text-red-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'degree', label: 'DEGREE', placeholder: 'B.Sc. Computer Science' },
                { key: 'school', label: 'SCHOOL', placeholder: 'University Name' },
                { key: 'year', label: 'YEAR', placeholder: '2023' },
                { key: 'note', label: 'NOTE', placeholder: 'First Class Honours' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-mono text-muted mb-1 tracking-wider">{f.label}</label>
                  <input value={edu[f.key]} onChange={e => updateEdu(i, f.key, e.target.value)}
                    placeholder={f.placeholder} className="input-field py-2 text-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
        {form.education.length === 0 && (
          <p className="text-muted text-sm text-center py-4">No education entries. Click "+ Add" to start.</p>
        )}
      </div>

      {/* Coding Usernames */}
      <div className="card-glass p-6 space-y-4">
        <h3 className="text-white font-semibold">Coding Platform Usernames</h3>
        <p className="text-muted text-xs">These are used to fetch your live stats on the Coding Portfolio page.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'githubUsername', label: 'GITHUB', placeholder: 'octocat' },
            { key: 'leetcodeUsername', label: 'LEETCODE', placeholder: 'username' },
            { key: 'gfgUsername', label: 'GEEKSFORGEEKS', placeholder: 'username' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} className="input-field" />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}

// ─── Client Projects Tab ─────────────────────────────────────────────────────

const EMPTY_CLIENT_PROJECT = {
  clientName: '', clientRole: '', title: '', description: '',
  techStack: '', projectType: '', year: '', status: 'Shipped', liveLink: '',
}

function ClientProjectsTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_CLIENT_PROJECT)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => clientProjectsApi.getAll()
    .then(r => setItems(r.data.clientProjects || []))
    .catch(() => setItems([]))
    .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY_CLIENT_PROJECT); setEditId(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({
      clientName: p.clientName || '', clientRole: p.clientRole || '',
      title: p.title || '', description: p.description || '',
      techStack: p.techStack?.join(', ') || '',
      projectType: p.projectType || '', year: p.year || '',
      status: p.status || 'Shipped', liveLink: p.liveLink || '',
    })
    setEditId(p._id); setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    const payload = { ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editId) await clientProjectsApi.update(editId, payload)
      else await clientProjectsApi.create(payload)
      setShowForm(false); load()
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving client project')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try { await clientProjectsApi.delete(id); setDeleteConfirm(null); load() }
    catch { alert('Failed to delete') }
  }

  const STATUS_BADGE = {
    Shipped: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Live: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'In Progress': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: items.length },
          { label: 'Live', value: items.filter(p => p.status === 'Live').length },
          { label: 'Shipped', value: items.filter(p => p.status === 'Shipped').length },
        ].map(s => (
          <div key={s.label} className="card-glass p-4 text-center">
            <div className="font-bold text-2xl gradient-text">{s.value}</div>
            <div className="text-muted text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Client Projects</h2>
        <button onClick={openCreate} className="btn-primary text-xs py-2 px-4">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Client Project
        </button>
      </div>

      <div className="space-y-3">
        {loading ? <Loader /> : items.length === 0 ? (
          <div className="card-glass p-10 text-center">
            <p className="text-muted text-sm mb-3">No client projects yet.</p>
            <button onClick={openCreate} className="btn-ghost text-xs py-2 px-4">Add first client project</button>
          </div>
        ) : items.map(p => (
          <div key={p._id} className="card-glass p-4 flex items-center gap-4 hover:border-accent/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white text-xs font-bold font-mono flex-shrink-0">
              {(p.clientName || '??').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-white text-sm font-medium truncate">{p.title}</h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border flex-shrink-0 ${STATUS_BADGE[p.status] || STATUS_BADGE.Shipped}`}>
                  {p.status}
                </span>
              </div>
              <p className="text-muted text-xs font-mono">{p.clientName}{p.clientRole ? ` · ${p.clientRole}` : ''}</p>
            </div>
            <div className="flex flex-wrap gap-1 flex-shrink-0 hidden sm:flex">
              {p.techStack?.slice(0, 2).map(t => <span key={t} className="tech-badge text-xs">{t}</span>)}
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => setDeleteConfirm(p._id)} className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/5 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-white text-lg">{editId ? 'Edit Client Project' : 'New Client Project'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-muted hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">CLIENT NAME</label>
                  <input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                    placeholder="NovaSpark" className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">CLIENT ROLE</label>
                  <input value={form.clientRole} onChange={e => setForm(f => ({ ...f, clientRole: e.target.value }))}
                    placeholder="Founder" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">PROJECT TITLE</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="E-Commerce Platform" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">DESCRIPTION</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="What you built and the impact..." className="input-field resize-none" required />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">TECH STACK (comma-separated)</label>
                <input value={form.techStack} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))}
                  placeholder="React, Node.js, MongoDB" className="input-field" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">PROJECT TYPE</label>
                  <input value={form.projectType} onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                    placeholder="SaaS Dashboard" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">YEAR</label>
                  <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                    placeholder="2024" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">STATUS</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="input-field">
                    <option value="Shipped">Shipped</option>
                    <option value="Live">Live</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">LIVE LINK (optional)</label>
                <input value={form.liveLink} onChange={e => setForm(f => ({ ...f, liveLink: e.target.value }))}
                  placeholder="https://..." className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? '...' : editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <div className="card-glass w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="font-semibold text-white mb-2">Delete client project?</h3>
            <p className="text-muted text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1 justify-center">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Dashboard Root ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'projects', label: 'Projects', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
  { id: 'clientProjects', label: 'Client Projects', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /> },
  { id: 'blog', label: 'Blog', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /> },
  { id: 'about', label: 'About', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('projects')

  return (
    <div className="min-h-screen pt-24">
      <div className="fixed inset-0 bg-grid bg-grid-size pointer-events-none opacity-30" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <span className="section-label mb-2 inline-flex">Admin</span>
          <h1 className="font-bold text-3xl text-white mt-2">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Welcome back, <span className="text-accent">{user?.name}</span></p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>{tab.icon}</svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'clientProjects' && <ClientProjectsTab />}
        {activeTab === 'blog' && <BlogTab />}
        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>
  )
}
