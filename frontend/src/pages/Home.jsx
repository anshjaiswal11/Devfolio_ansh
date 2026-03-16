import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projectsApi, blogsApi } from '../services/api'

const STATS = [
  { value: '4+',  label: 'Years of Experience' },
  { value: '30+', label: 'Shipped Projects' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '15k', label: 'GitHub Contributions' },
]

export default function Home() {
  const [featProjects, setFeatProjects] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  
  // Subtle parallax effect for the hero
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 200])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  useEffect(() => {
    projectsApi.getAll().then(r => {
      const all = r.data.projects || r.data
      setFeatProjects(all.filter(p => p.featured).slice(0, 3))
    }).catch(() => {})
    blogsApi.getAll().then(r => {
      setRecentBlogs((r.data.blogs || []).slice(0, 3))
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-void selection:bg-white/20">
      <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />
      
      {/* ── High-Impact Hero ────────────────────────────── */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center pt-20 overflow-hidden">
        {/* Abstract subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          style={{ y: y1, opacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 w-full text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="badge">AVAILABLE FOR WORK</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[100px] font-bold tracking-tighter text-white mb-6 leading-[1.05]"
          >
            Engineering <br className="hidden md:block" />
            <span className="text-muted">the scalable web.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            I build highly crafted, fast, and accessible digital experiences. Focusing on modern JavaScript ecosystems, minimal aesthetics, and flawless execution.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/projects" className="btn-primary py-3 px-8 text-[15px]">
              View Projects
            </Link>
            <Link to="/contact" className="btn-secondary py-3 px-8 text-[15px]">
              Contact Me
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Bento Grid Stats ────────────────────────────── */}
      <section className="relative z-20 py-24 border-t border-border bg-void">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border"
          >
            {STATS.map((stat, i) => (
              <motion.div 
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="bg-surface p-8 lg:p-10 flex flex-col justify-center items-center text-center group hover:bg-card transition-colors"
              >
                <div className="font-bold text-4xl lg:text-5xl text-white tracking-tight mb-2 group-hover:scale-105 transition-transform duration-500">
                  {stat.value}
                </div>
                <div className="text-muted text-xs uppercase tracking-widest font-mono">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Work ───────────────────────────────── */}
      {featProjects.length > 0 && (
        <section className="relative z-20 py-24 bg-void">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Selected Work</h2>
                <p className="text-muted max-w-xl text-[15px]">A showcase of recent products and open source libraries.</p>
              </div>
              <Link to="/projects" className="btn-secondary text-xs h-9">
                View Archive ->
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {featProjects.map((p, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  key={p._id}
                  className={`card-bento group border border-border bg-surface ${i === 0 ? 'md:col-span-2' : ''}`}
                >
                  <Link to={`/projects/${p.slug}`} className="block">
                    <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[21/9]' : 'aspect-video'} bg-card`}>
                      {p.imageUrl ? (
                        <img 
                          src={p.imageUrl} 
                          alt={p.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted font-mono text-sm">
                          no_image.png
                        </div>
                      )}
                      <div className="absolute inset-0 bg-void/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                        <p className="text-muted text-sm line-clamp-1">{p.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {p.techStack?.slice(0, 2).map(t => (
                          <span key={t} className="badge">{t}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Minimalist Call to Action ───────────────────── */}
      <section className="relative z-20 py-32 border-t border-border bg-surface">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Ready to collaborate?
          </h2>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
            Whether you have a specific project in mind or just want to explore possibilities, my inbox is always open.
          </p>
          <Link to="/contact" className="btn-primary py-4 px-10 text-base rounded-full">
            Start a Conversation
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
