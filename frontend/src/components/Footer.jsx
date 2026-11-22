import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  const links = [
    { label: 'Home',     href: '/' },
    { label: 'About',    href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog',     href: '/blog' },
    { label: 'Coding',   href: '/coding' },
    { label: 'Contact',  href: '/contact' },
  ]

  const socials = [
    {
      label: 'GitHub',
      href: 'https://github.com/anshjaiswal11',
      icon: <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/anshjais',
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
    },
  ]

  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                <span className="font-mono font-bold text-accent text-sm">&gt;_</span>
              </div>
              <span className="font-bold text-white text-lg">Ansh <span className="text-accent">Jaiswal</span></span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Full Stack Developer (SDE-I) | Engineering scalable backend architectures and modern web apps.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {links.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-muted text-sm hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials / Status */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Connect</h3>
            <div className="flex gap-3 mb-6">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-card/60 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-all duration-300"
                  aria-label={s.label}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">{s.icon}</svg>
                </a>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/5 border border-green-500/20 rounded-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-mono">Available for work</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted text-xs font-mono">
            © {year} Ansh Jaiswal · Full Stack Software Developer
          </p>
          <p className="text-muted text-xs font-mono">
            Punjab, India · <span className="text-accent">anshjaiswal1804@gmail.com</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
