import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projectsApi, blogsApi } from '../services/api'

const STATS = [
  { value: '4+',  label: 'Years of Experience' },
  { value: '30+', label: 'Shipped Projects' },
  { value: '100%', label: 'Client Satisfaction' },
  { value: '15k', label: 'GitHub Contributions' },
]

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ankit Metha',
    role: 'Founder, Gym-pro',
    avatar: 'AM',
    rating: 5,
    text: 'Ansh delivered a stunning gym platform ahead of schedule. His attention to UI detail and clean code architecture blew us away. Highly recommend!',
  },
  {
    id: 2,
    name: 'Niswarth',
    role: 'CTO, StrangeMeet',
    avatar: 'N',
    rating: 5,
    text: 'We hired Ansh to build our SaaS dashboard from scratch. The result was pixel-perfect, fast, and scalable. He communicates exceptionally well throughout the project.',
  },
  {
    id: 3,
    name: 'Navdeep Singh',
    role: 'Founder, Fitness-pro',
    avatar: 'NS',
    rating: 5,
    text: 'Outstanding work on our fintech app. Ansh understood our requirements deeply and translated them into a seamless user experience. Will definitely work again!',
  },
  {
    id: 4,
    name: 'Vishal',
    role: 'CEO, shortsHub',
    avatar: 'V',
    rating: 5,
    text: 'From concept to deployment in 3 weeks! Ansh is the kind of freelancer every startup dreams of — fast, reliable, and genuinely passionate about the craft.',
  },
  {
    id: 5,
    name: 'Ujjwal',
    role: 'Lead Dev, Socialneeds',
    avatar: 'UK',
    rating: 5,
    text: 'Ansh integrated our complex API with a beautiful React frontend. Zero bugs at launch, excellent documentation, and a pleasure to work with throughout.',
  },
]

const FAQS = [
  {
    q: 'What types of projects do you take on?',
    a: 'I work on web apps, SaaS products, REST/GraphQL APIs, AI-powered tools, DevOps pipelines, and more. If it involves modern JavaScript/Python or cloud infrastructure — I can help.',
  },
  {
    q: 'How does your process work?',
    a: "Simple: Discovery call → Proposal & scope → Build in sprints with regular updates → Review → Launch. You always know what's happening and what's next.",
  },
  {
    q: 'How long does a typical project take?',
    a: 'A landing page or simple tool: 3–7 days. A full SaaS MVP: 3–6 weeks. AI or ML integrations: depends on complexity. I give a detailed timeline in the proposal.',
  },
  {
    q: 'Do you work with clients internationally?',
    a: 'Yes. I work with clients across the US, Europe, and the Middle East. Communication happens over email, Slack, or Zoom — fully remote, no problem.',
  },
  {
    q: 'How many revisions are included?',
    a: 'Starter projects include 1 round of revisions. Growth and Enterprise include 3+. I aim to get it right the first time through clear scoping upfront.',
  },
  {
    q: 'What is your pricing model?',
    a: 'I work on fixed-price projects scoped after a discovery call — no surprise hourly bills. Starter from $500, Growth from $1,500, Enterprise is custom. Check the Services page for details.',
  },
  {
    q: 'Do you sign NDAs?',
    a: "Absolutely. I sign NDAs and take confidentiality seriously. Your business ideas and client data are always protected.",
  },
  {
    q: 'Can you join an existing team or project mid-flight?',
    a: 'Yes — I can jump into an existing codebase, review architecture, fix problems, or build specific features. Just share the repo and I\'ll take it from there.',
  },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-border last:border-0"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-white text-[15px] font-medium group-hover:text-white/80 transition-colors">{item.q}</span>
        <div className={`flex-shrink-0 w-5 h-5 text-muted transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '400px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="text-muted text-[14px] leading-relaxed pb-5">{item.a}</p>
      </div>
    </motion.div>
  )
}

function FAQSection() {
  return (
    <section className="relative z-20 py-24 border-t border-border bg-void">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="badge mb-5">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Got <span className="text-muted">questions?</span>
          </h2>
          <p className="text-muted text-[15px] max-w-md mx-auto">
            Everything you need to know before we work together.
          </p>
        </motion.div>

        <div className="bg-surface border border-border rounded-2xl px-6 md:px-8">
          {FAQS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-muted text-sm">
            Still have questions?{' '}
            <Link to="/contact" className="text-white hover:underline underline-offset-2">
              Just ask me directly →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// Star rating component
function Stars({ count = 5 }) {

  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Testimonial card
function TestimonialCard({ t }) {
  return (
    <div
      className="flex-shrink-0 w-[340px] md:w-[380px] bg-surface border border-border rounded-2xl p-7 mx-4 hover:border-white/20 transition-colors duration-300 group"
    >
      <Stars count={t.rating} />
      <p className="text-[15px] text-muted leading-relaxed mb-6 group-hover:text-white/70 transition-colors duration-300">
        "{t.text}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-xs font-bold font-mono flex-shrink-0">
          {t.avatar}
        </div>
        <div>
          <div className="text-white text-sm font-semibold">{t.name}</div>
          <div className="text-muted text-xs font-mono">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

// Auto-scrolling testimonials section
function TestimonialsSection() {
  const track1Ref = useRef(null)
  const track2Ref = useRef(null)

  return (
    <section className="relative z-20 py-24 border-t border-border bg-void overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-void to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-void to-transparent pointer-events-none" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto px-6 mb-14 text-center"
      >
        <span className="badge mb-5">CLIENT TESTIMONIALS</span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          What clients <span className="text-muted">say</span>
        </h2>
        <p className="text-muted max-w-xl mx-auto text-[15px]">
          Trusted by founders, product teams, and CTOs across the globe.
        </p>
      </motion.div>

      {/* Row 1 — scrolls left */}
      <div
        className="flex mb-5 w-max"
        style={{
          animation: 'scroll-left 35s linear infinite',
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <TestimonialCard key={`r1-${t.id}-${i}`} t={t} />
        ))}
      </div>

      {/* Row 2 — scrolls right */}
      <div
        className="flex w-max"
        style={{
          animation: 'scroll-right 40s linear infinite',
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <TestimonialCard key={`r2-${t.id}-${i}`} t={t} />
        ))}
      </div>
    </section>
  )
}

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
                View Archive →
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

      {/* ── Client Testimonials ─────────────────────────── */}
      <TestimonialsSection />

      {/* ── FAQ ─────────────────────────────────────────── */}
      <FAQSection />

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
