import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { blogsApi } from '../services/api'
import Loader from '../components/Loader'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  useEffect(() => {
    blogsApi.getAll()
      .then(r => setBlogs(r.data.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

  const allTags = ['All', ...new Set(blogs.flatMap(b => b.tags || []))]
  const filtered = blogs.filter(b => {
    const matchTag = activeTag === 'All' || b.tags?.includes(activeTag)
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt?.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  return (
    <div className="min-h-screen pt-24 pb-20 bg-void">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="badge mb-4">WRITING</span>
          <h1 className="heading-hero text-4xl md:text-5xl mb-4">
            Notes & <span className="text-muted">Essays</span>
          </h1>
          <p className="text-muted text-lg max-w-xl leading-relaxed">
            Thoughts on software engineering, UI design, and building products.
          </p>
        </motion.div>

        {/* Filters & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-12 border-b border-border pb-6"
        >
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => {
              const isActive = activeTag === tag
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded-full transition-colors border ${
                    isActive
                      ? 'bg-white text-void border-white'
                      : 'bg-surface text-muted border-border hover:border-white/30 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-surface border border-border rounded-md pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </motion.div>

        {/* Blog List */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : (
          <motion.div layout className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((blog, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  key={blog._id}
                  className="group relative bg-surface border border-border p-6 rounded-xl hover:bg-card hover:border-white/20 transition-all block"
                >
                  <Link to={`/blog/${blog.slug}`} className="absolute inset-0 z-10" />
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Date/Meta (Desktop Left Axis) */}
                    <div className="md:w-32 flex-shrink-0 flex flex-col md:border-r border-border md:pr-4">
                      <span className="text-muted font-mono text-xs">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </span>
                      {blog.readTime && <span className="text-muted/60 font-mono text-xs mt-1">{blog.readTime} min read</span>}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2 group-hover:text-neutral-300 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-muted text-sm leading-relaxed max-w-3xl mb-4">
                        {blog.excerpt}
                      </p>
                      {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 relative z-20 pointer-events-none">
                          {blog.tags.map(tag => (
                            <span key={tag} className="text-[11px] font-mono text-muted uppercase tracking-wider">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 border border-dashed border-border rounded-xl bg-surface/50"
              >
                <p className="text-muted mb-4 font-mono text-sm">No writing found matching your criteria.</p>
                <button 
                  onClick={() => { setSearch(''); setActiveTag('All'); }} 
                  className="btn-secondary"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
