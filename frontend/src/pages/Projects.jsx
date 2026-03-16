import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import Loader from '../components/Loader'
import { projectsApi } from '../services/api'

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

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    projectsApi.getAll()
      .then(res => setProjects(res.data.projects || res.data))
      .catch(() => setProjects(DEMO_PROJECTS))
      .finally(() => setLoading(false))
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
          <div className="py-20 flex justify-center">
            <Loader />
          </div>
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
                <button 
                  onClick={() => setFilter('All')} 
                  className="btn-secondary"
                >
                  Clear Filter
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
