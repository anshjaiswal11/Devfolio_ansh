import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { projectsApi } from '../services/api'

const DEMO = {
  'ai-code-reviewer': {
    title: 'AI Code Reviewer', slug: 'ai-code-reviewer',
    description: 'An intelligent code review tool powered by GPT-4 that analyzes pull requests, suggests improvements, and enforces coding standards automatically.',
    techStack: ['React', 'Node.js', 'OpenAI API', 'MongoDB', 'Docker', 'GitHub Actions'],
    githubLink: 'https://github.com', liveDemoLink: 'https://example.com',
    createdAt: '2024-01-15',
    longDescription: `This project automates the code review process by integrating GPT-4 directly into GitHub pull requests. When a PR is opened, the tool analyzes the diff, identifies potential bugs, suggests refactors, and checks for style violations — all within seconds.\n\nThe backend is a Node.js service that listens to GitHub webhooks, processes the code diff, and streams AI responses back. The frontend React dashboard lets teams configure review rules, view analytics, and track code quality over time.\n\nKey features include:\n• Real-time streaming of review comments\n• Configurable review profiles per repository\n• Historical analytics and quality metrics\n• Team management and notification preferences`,
  },
  'chat-application': {
    title: 'Real-Time Chat App', slug: 'chat-application',
    description: 'Full-stack chat application with rooms, direct messages, file sharing, and end-to-end encryption using WebSockets and React.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
    githubLink: 'https://github.com', liveDemoLink: 'https://example.com',
    createdAt: '2023-09-10',
    longDescription: `A production-grade real-time messaging platform built on WebSockets. Supports group rooms, direct messages, file uploads, read receipts, and typing indicators.\n\nThe architecture uses Socket.io for real-time events, MongoDB for message persistence, and JWT for auth. Messages are encrypted client-side before transmission. The frontend is a React SPA with optimistic UI updates for a native-app feel.`,
  },
}

export default function ProjectDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsApi.getBySlug(slug)
      .then(res => setProject(res.data.project || res.data))
      .catch(() => {
        if (DEMO[slug]) setProject(DEMO[slug])
        else navigate('/projects', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Loader fullScreen />

  if (!project) return null

  return (
    <div className="min-h-screen pt-24">
      <div className="fixed inset-0 bg-grid bg-grid-size pointer-events-none opacity-50" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm font-mono transition-colors duration-200 mb-10 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to projects
        </Link>

        {/* Header */}
        <div className="mb-10">
          {project.imageUrl && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-border">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-90" />
            </div>
          )}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <span className="section-label mb-3 inline-flex">
                {new Date(project.createdAt).getFullYear() || '2024'}
              </span>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-white mt-3">
                {project.title}
              </h1>
            </div>
            <div className="flex gap-3">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm py-2 px-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {project.liveDemoLink && (
                <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>
          <p className="text-muted text-base leading-relaxed max-w-2xl">{project.description}</p>
        </div>

        {/* Tech Stack */}
        <div className="card-glass p-6 mb-8">
          <h2 className="font-display font-semibold text-white text-sm mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack?.map(tech => (
              <span key={tech} className="tech-badge text-sm px-3 py-1.5">{tech}</span>
            ))}
          </div>
        </div>

        {/* Long description */}
        {project.longDescription && (
          <div className="card-glass p-6 mb-8">
            <h2 className="font-display font-semibold text-white text-sm mb-4">About this project</h2>
            <div className="prose-custom space-y-4">
              {project.longDescription.split('\n\n').map((para, i) => (
                <p key={i} className="text-muted text-sm leading-7 whitespace-pre-line">{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* URL */}
        <div className="card-glass p-4 flex items-center gap-3">
          <span className="text-muted text-xs font-mono">Route:</span>
          <code className="text-accent text-xs font-mono">/projects/{slug}</code>
        </div>
      </div>
    </div>
  )
}
