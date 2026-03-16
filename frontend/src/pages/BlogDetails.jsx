import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { blogsApi } from '../services/api'
import Loader from '../components/Loader'

export default function BlogDetails() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    blogsApi.getBySlug(slug)
      .then(r => setBlog(r.data.blog))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-24"><Loader /></div>

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-6">
      <h1 className="text-4xl font-bold text-white mb-4">Post not found</h1>
      <p className="text-muted mb-6">This post may have been removed or doesn't exist.</p>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-24">
      <div className="fixed inset-0 bg-grid bg-grid-size pointer-events-none opacity-30" />

      {/* Cover */}
      {blog?.coverImage && (
        <div className="relative max-w-5xl mx-auto px-6 mb-12">
          <div className="aspect-video rounded-2xl overflow-hidden border border-border">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover opacity-80" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 pb-24">
        {/* Back */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm transition-colors mb-8">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          {blog?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map(tag => <span key={tag} className="tag-badge">{tag}</span>)}
            </div>
          )}
          <h1 className="font-bold text-3xl md:text-5xl text-white mb-4 leading-tight">{blog?.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted font-mono">
            <span>{new Date(blog?.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {blog?.readTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{blog.readTime} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="card-glass p-8 md:p-10">
          <div className="prose-dark">
            <ReactMarkdown>{blog?.content || ''}</ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-border/30 flex items-center justify-between">
          <Link to="/blog" className="btn-ghost text-sm py-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Posts
          </Link>
          <button
            onClick={() => { if (navigator.share) navigator.share({ title: blog?.title, url: window.location.href }) }}
            className="btn-ghost text-sm py-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
