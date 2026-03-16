import { useReveal } from '../hooks/useReveal'
import ContactForm from '../components/ContactForm'
import { Link } from 'react-router-dom'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com', handle: '@yourhandle', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )},
  { label: 'LinkedIn', href: 'https://linkedin.com', handle: 'yourname', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )},
  { label: 'Twitter', href: 'https://twitter.com', handle: '@yourhandle', icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
]

export default function Contact() {
  const headerRef = useReveal()
  const formRef = useReveal()
  const infoRef = useReveal()

  return (
    <div className="min-h-screen pt-24">
      <div className="fixed inset-0 bg-grid bg-grid-size pointer-events-none opacity-50" />
      <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div ref={headerRef} className="reveal text-center mb-16">
          <span className="section-label mb-4 inline-flex">Contact</span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white mt-4 mb-4">
            Let's <span className="gradient-text">work together</span>
          </h1>
          <p className="text-muted max-w-md mx-auto text-sm leading-relaxed">
            Have a project idea, job opportunity, or just want to say hi?
            I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 max-w-4xl mx-auto">
          {/* Calendly CTA Card */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="card-glass p-6 flex flex-col md:flex-row items-center justify-between gap-5 border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Prefer a quick call?</div>
                  <div className="text-muted text-sm">Book a free 30-min discovery call — no commitment, just conversation.</div>
                </div>
              </div>
              <a
                href="https://calendly.com/anshjaiswal11"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 py-3 px-7 rounded-lg whitespace-nowrap"
              >
                📅 Book a Free Call
              </a>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="reveal md:col-span-3">
            <div className="card-glass p-6 md:p-8">
              <h2 className="font-display font-semibold text-white text-lg mb-6">Send a message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Info sidebar */}
          <div ref={infoRef} className="reveal md:col-span-2 space-y-4">
            {/* Email */}
            <div className="card-glass p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white text-sm font-display font-medium">Email</span>
              </div>
              <a href="mailto:hello@yourdomain.com" className="text-accent text-sm font-mono hover:underline">
                hello@yourdomain.com
              </a>
            </div>

            {/* Response time */}
            <div className="card-glass p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-glow/10 border border-glow/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white text-sm font-display font-medium">Response Time</span>
              </div>
              <p className="text-muted text-sm">Usually within 24–48 hours</p>
            </div>

            {/* Socials */}
            <div className="card-glass p-5">
              <h3 className="text-white text-sm font-display font-medium mb-4">Find me online</h3>
              <div className="space-y-3">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted hover:text-accent transition-colors duration-200 group"
                  >
                    <span className="group-hover:text-accent transition-colors">{s.icon}</span>
                    <div>
                      <div className="text-xs font-display font-medium text-text group-hover:text-accent transition-colors">{s.label}</div>
                      <div className="text-xs font-mono opacity-60">{s.handle}</div>
                    </div>
                    <svg className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
