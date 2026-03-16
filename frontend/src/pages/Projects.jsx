import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import Loader from '../components/Loader'
import { projectsApi, clientProjectsApi } from '../services/api'

const FILTERS = ['All', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker', 'Python', 'Go']

const DEMO_PROJECTS = [
  {
    _id: '1', title: 'AI Code Reviewer', slug: 'ai-code-reviewer',
    description: 'An intelligent code review tool powered by GPT-4 that analyzes pull requests, suggests improvements, and enforces coding standards automatically.',
    techStack: ['React', 'Node.js', 'OpenAI', 'MongoDB', 'Docker'],
    githubLink: 'https://github.com', liveDemoLink: 'https://example.com',
  },
  {
    _id: '2', title: 'Real-Time Chat App', slug: 'chat-application',
    description: 'Full-stack chat application with rooms, direct messages, file sharing, and end-to-end encryption using WebSockets and React.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind'],
    githubLink: 'https://github.com', liveDemoLink: 'https://example.com',
  },
  {
    _id: '3', title: 'Dev Portfolio CMS', slug: 'portfolio-cms',
    description: 'Headless CMS built for developers. Manage projects, blog posts, and media from an admin dashboard with Supabase auth.',
    techStack: ['React', 'Supabase', 'TypeScript', 'Tailwind'],
    githubLink: 'https://github.com',
  },
]

const STATUS_COLORS = {
  Shipped: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Live: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'In Progress': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

function ClientProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="card-bento group p-7 flex flex-col gap-5 hover:border-white/20 transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white text-xs font-bold font-mono flex-shrink-0">
            {(project.clientName || '??').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-white text-sm font-semibold">{project.clientName}</div>
            <div className="text-muted text-xs font-mono">{project.clientRole}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${STATUS_COLORS[project.status] || STATUS_COLORS.Live}`}>
            {project.status}
          </span>
          {project.year && <span className="badge">{project.year}</span>}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
          {project.title}
        </h3>
        <p className="text-muted text-[14px] leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-1.5">
          {project.techStack?.slice(0, 3).map(t => (
            <span key={t} className="badge">{t}</span>
          ))}
          {project.techStack?.length > 3 && (
            <span className="badge">+{project.techStack.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-white transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
          {project.projectType && (
            <span className="text-muted text-xs font-mono">{project.projectType}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [clientProjects, setClientProjects] = useState([])
  const [clientLoading, setClientLoading] = useState(true)

  useEffect(() => {
    projectsApi.getAll()
      .then(res => setProjects(res.data.projects || res.data))
      .catch(() => setProjects(DEMO_PROJECTS))
      .finally(() => setLoading(false))

    clientProjectsApi.getAll()
      .then(res => setClientProjects(res.data.clientProjects || []))
      .catch(() => setClientProjects([]))
      .finally(() => setClientLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.techStack?.some(t => t.toLowerCase().includes(filter.toLowerCase())))

  return (
    <div className="min-h-screen pt-24 pb-20 bg-void">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="badge mb-6">PORTFOLIO</span>
          <h1 className="heading-hero">
            Projects <span className="text-muted">& Archive</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
            A comprehensive list of projects, experiments, and open-source contributions I've worked on over the years.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {FILTERS.map(f => {
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono transition-colors duration-200 border ${
                  isActive
                    ? 'border-white text-void bg-white'
                    : 'border-border text-muted hover:border-white/30 hover:text-white bg-surface'
                }`}
              >
                {f}
              </button>
            )
          })}
        </motion.div>

        {/* Project Grid */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader /></div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project._id || project.slug} project={project} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-24 border border-dashed border-border rounded-xl bg-surface/50"
              >
                <p className="text-muted mb-4 font-mono text-sm">No results found for "{filter}"</p>
                <button onClick={() => setFilter('All')} className="btn-secondary">Clear Filter</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Client Projects ──────────────────────────────── */}
      <div className="bg-surface border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="badge mb-5">CLIENT WORK</span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  Projects for <span className="text-muted">clients</span>
                </h2>
                <p className="text-muted text-[15px] max-w-xl leading-relaxed">
                  Real-world products built for businesses and startups as a freelancer — shipped, live, and making impact.
                </p>
              </div>
              {clientProjects.length > 0 && (
                <div className="flex-shrink-0">
                  <div className="text-center px-6 py-3 bg-card border border-border rounded-xl">
                    <div className="text-2xl font-bold text-white">{clientProjects.length}+</div>
                    <div className="text-muted text-xs font-mono uppercase tracking-wider mt-0.5">Shipped</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Cards / states */}
          {clientLoading ? (
            <div className="py-12 flex justify-center"><Loader /></div>
          ) : clientProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-dashed border-border rounded-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-border flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <p className="text-muted text-sm mb-1">No client projects yet.</p>
              <p className="text-muted/60 text-xs">Add them from Dashboard → Client Projects tab.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientProjects.map((project, i) => (
                <ClientProjectCard key={project._id} project={project} index={i} />
              ))}
            </div>
          )}

          {/* CTA */}
          {clientProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 text-center"
            >
              <p className="text-muted text-sm mb-4">Interested in working together?</p>
              <a href="/contact" className="btn-primary">Hire Me for Your Project</a>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
