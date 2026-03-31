import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Coding', href: '/coding' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-void/70 backdrop-blur-xl border-b border-white/10' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-white text-void flex items-center justify-center">
              <span className="font-mono font-bold text-xs">V</span>
            </div>
            <span className="font-medium text-white text-sm tracking-tight hidden sm:block">
              Ansh
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative text-sm transition-colors ${isActive ? 'text-white' : 'text-muted hover:text-white'}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[18px] left-0 right-0 h-[2px] bg-white"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-sm text-muted hover:text-white transition-colors hidden sm:block">
              Contact
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-white hidden sm:block">
                  Dashboard
                </Link>
                <button onClick={logout} className="text-sm text-muted hover:text-red-400 transition-colors hidden sm:block">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-secondary text-xs py-1.5 px-3 hidden sm:inline-flex">
                Sign In
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1 -mr-1 text-muted hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                }
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden pt-14"
          >
            <div className="absolute inset-0 bg-void/90 backdrop-blur-xl" />
            <div className="relative border-b border-border bg-surface flex flex-col p-6 gap-4 shadow-2xl">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === item.href ? 'text-white' : 'text-muted hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-full h-px bg-border my-2" />
              <Link to="/contact" className="text-lg font-medium text-muted hover:text-white transition-colors">
                Contact
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-lg font-medium text-white">Dashboard</Link>
                  <button onClick={logout} className="text-lg font-medium text-red-500 text-left">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="text-lg font-medium text-white">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
