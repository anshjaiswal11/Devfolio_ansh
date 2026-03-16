import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SERVICES = [
  {
    id: 'fullstack',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    label: 'Full-Stack Development',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20',
    iconColor: 'text-blue-400',
    description: 'End-to-end web applications from database to UI. React, Next.js, Node.js, Express — production-ready, scalable, and lightning fast.',
    tags: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST', 'GraphQL'],
  },
  {
    id: 'api',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    label: 'API Design & Integration',
    color: 'from-violet-500/20 to-purple-500/10 border-violet-500/20',
    iconColor: 'text-violet-400',
    description: 'Build bulletproof RESTful and GraphQL APIs with proper auth, rate-limiting, docs, and third-party integrations (Stripe, Twilio, etc.).',
    tags: ['REST', 'GraphQL', 'Swagger', 'JWT', 'OAuth2', 'Webhook', 'Stripe', 'Twilio'],
  },
  {
    id: 'devops',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
    label: 'DevOps & Cloud Infrastructure',
    color: 'from-orange-500/20 to-amber-500/10 border-orange-500/20',
    iconColor: 'text-orange-400',
    description: 'Containerize, orchestrate, and deploy your apps with Docker and Kubernetes. CI/CD pipelines, cloud provisioning on AWS/GCP/Azure.',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'AWS', 'GCP', 'Terraform', 'Nginx'],
  },
  {
    id: 'ml',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    label: 'Machine Learning & Data',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    description: 'Predictive models, data pipelines, and ML-powered features integrated into your product. From model training to production serving.',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'FastAPI', 'HuggingFace'],
  },
  {
    id: 'ai',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
    label: 'Generative AI & LLMs',
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/20',
    iconColor: 'text-pink-400',
    description: 'Build AI-powered products with GPT-4, Claude, Gemini, and open-source LLMs. RAG pipelines, fine-tuning, prompt engineering, and AI chatbots.',
    tags: ['OpenAI', 'LangChain', 'LlamaIndex', 'RAG', 'Fine-tuning', 'Prompt Eng.', 'Claude', 'Gemini'],
  },
  {
    id: 'agents',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.311m-2.457 2.457a15.099 15.099 0 01-1.339-1.566 15 15 0 002.126-3.873m-1.92 6.099l.057-.03a15.008 15.008 0 003.906.58" />
      </svg>
    ),
    label: 'Agentic AI Systems',
    color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/20',
    iconColor: 'text-yellow-400',
    description: 'Design and ship autonomous AI agents that reason, plan, and execute multi-step tasks. Workflows with tool use, memory, and human-in-the-loop control.',
    tags: ['LangGraph', 'AutoGen', 'CrewAI', 'Tool Use', 'Memory', 'ReAct', 'OpenAI Agents', 'MCP'],
  },
  {
    id: 'saas',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    label: 'SaaS & Product Development',
    color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/20',
    iconColor: 'text-cyan-400',
    description: 'MVP to production-ready SaaS — auth, billing, multi-tenancy, dashboards, and analytics. Get market-ready faster without cutting corners.',
    tags: ['SaaS', 'Stripe', 'Auth', 'Multi-tenancy', 'Analytics', 'Dashboard', 'Onboarding', 'MVP'],
  },
  {
    id: 'mobile',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    label: 'PWA & Mobile-First Web',
    color: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-400',
    description: 'Build mobile-first, installable Progressive Web Apps that work offline and feel native. Focus on performance, accessibility, and Lighthouse scores.',
    tags: ['PWA', 'Responsive', 'Offline-first', 'Service Workers', 'Lighthouse', 'React Native', 'Expo'],
  },
]

const PROCESS = [
  { step: '01', title: 'Discovery Call', desc: 'We align on goals, scope, timeline, and success metrics before writing a single line of code.' },
  { step: '02', title: 'Proposal & Plan', desc: 'A clear project spec, tech stack recommendation, and milestone-based roadmap delivered within 48h.' },
  { step: '03', title: 'Build & Iterate', desc: 'I build in sprints with regular updates. You see real progress, not a big reveal at the end.' },
  { step: '04', title: 'Review & Launch', desc: 'Full testing, performance audit, and smooth deployment. Zero surprises on launch day.' },
]

const PRICING = [
  {
    name: 'Starter',
    price: '$500',
    period: 'per project',
    desc: 'Best for landing pages, simple tools, and small integrations.',
    features: ['Up to 5 pages or endpoints', 'Responsive design', 'Basic SEO setup', '1 revision round', '5-day delivery'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$1,500',
    period: 'per project',
    desc: 'Full-featured apps, SaaS MVPs, and API-heavy products.',
    features: ['Unlimited pages / endpoints', 'Auth + database setup', 'Admin dashboard', '3 revision rounds', 'CI/CD deployment', '30-day support'],
    cta: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'let\'s talk',
    desc: 'AI systems, complex platforms, and long-term partnerships.',
    features: ['Full-stack + AI / ML', 'DevOps & infrastructure', 'Team collaboration', 'Ongoing retainer option', 'Priority support', 'SLA guarantees'],
    cta: 'Contact Me',
    highlight: false,
  },
]

export default function Services() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-void">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center py-16 mb-4"
        >
          <span className="badge mb-6">WHAT I DO</span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Skills that <span className="text-muted">ship products.</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            From zero to production — I bring full-stack dev, cloud infrastructure, machine learning, and cutting-edge AI capabilities under one roof.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary py-3 px-8 text-[15px]">
              Book a Free Call
            </Link>
            <Link to="/projects" className="btn-secondary py-3 px-8 text-[15px]">
              See My Work
            </Link>
          </div>
        </motion.div>

        {/* ── Services Grid ── */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Services</h2>
            <p className="text-muted text-[15px] max-w-xl mx-auto">Everything you need to build, scale, and ship modern software products.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-7 rounded-2xl border bg-gradient-to-br ${svc.color} hover:scale-[1.01] transition-transform duration-300 group`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`mt-0.5 flex-shrink-0 ${svc.iconColor}`}>
                    {svc.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{svc.label}</h3>
                    <p className="text-muted text-[14px] leading-relaxed mt-2">{svc.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                  {svc.tags.map(t => (
                    <span key={t} className="badge text-[11px]">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How I Work ── */}
        <section className="py-16 border-t border-border">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="badge mb-5">MY PROCESS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">How I work</h2>
            <p className="text-muted text-[15px] max-w-md mx-auto">Transparent, milestone-driven, no surprises.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Connector line */}
                {i < PROCESS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                <div className="relative z-10 p-6 bg-surface border border-border rounded-2xl hover:border-white/20 transition-colors">
                  <div className="text-4xl font-bold text-white/10 font-mono mb-3">{p.step}</div>
                  <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                  <p className="text-muted text-[13px] leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-16 border-t border-border">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="badge mb-5">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Simple, transparent pricing</h2>
            <p className="text-muted text-[15px] max-w-md mx-auto">No hidden fees. No hourly surprises. Fixed-scope projects with clear deliverables.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-7 rounded-2xl border flex flex-col ${
                  plan.highlight
                    ? 'bg-white text-void border-white'
                    : 'bg-surface border-border hover:border-white/20'
                } transition-all duration-300`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-void text-white text-[10px] font-mono px-3 py-1 rounded-full border border-white/20">MOST POPULAR</span>
                  </div>
                )}
                <div className="mb-6">
                  <div className={`text-sm font-mono mb-1 ${plan.highlight ? 'text-void/60' : 'text-muted'}`}>{plan.name}</div>
                  <div className={`text-4xl font-bold tracking-tight mb-1 ${plan.highlight ? 'text-void' : 'text-white'}`}>
                    {plan.price}
                  </div>
                  <div className={`text-xs font-mono ${plan.highlight ? 'text-void/50' : 'text-muted'}`}>{plan.period}</div>
                  <p className={`text-sm mt-3 leading-relaxed ${plan.highlight ? 'text-void/70' : 'text-muted'}`}>{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2.5 text-[13px] ${plan.highlight ? 'text-void/80' : 'text-muted'}`}>
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-void' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`text-center py-2.5 px-5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-void text-white hover:bg-void/80'
                      : 'border border-border text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-muted text-xs mt-6 font-mono">All prices are starting estimates. Final quote after discovery call.</p>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 text-center border-t border-border">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">
              Ready to build something great?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-lg mx-auto">
              Let's discuss your project. I respond within 24 hours — no sales calls, just real conversation.
            </p>
            <Link to="/contact" className="btn-primary py-4 px-10 text-base rounded-full">
              Start a Conversation
            </Link>
          </motion.div>
        </section>

      </div>
    </div>
  )
}
