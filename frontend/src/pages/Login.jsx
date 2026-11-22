import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="fixed inset-0 bg-grid bg-grid-size pointer-events-none opacity-50" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent font-mono text-sm font-bold">AJ</span>
            </div>
            <span className="font-display font-semibold text-white text-sm">Ansh <span className="text-accent">Jaiswal</span></span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Admin Portal</h1>
          <p className="text-muted text-sm">Sign in to manage portfolio, blogs & projects</p>
        </div>

        <div className="card-glass p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">ADMIN EMAIL</label>
              <input
                {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                type="email"
                placeholder="anshjaiswal1804@gmail.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400/80 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-mono text-muted tracking-wider">PASSWORD</label>
              </div>
              <input
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type="password"
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-400/80 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? (
                <><span className="w-4 h-4 border border-void/30 border-t-void rounded-full animate-spin" />Signing in...</>
              ) : 'Sign in as Admin'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/50 text-center">
            <p className="text-muted text-xs">
              Freelance Client looking for project updates?
            </p>
            <Link to="/client" className="inline-flex items-center gap-1.5 text-accent hover:underline text-xs font-medium mt-1.5">
              <span>Go to Client Portal</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
