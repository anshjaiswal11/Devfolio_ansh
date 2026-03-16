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
              <span className="text-accent font-mono text-sm font-bold">{'<>'}</span>
            </div>
            <span className="font-display font-semibold text-white text-sm">dev<span className="text-accent">.</span>portfolio</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to your account</p>
        </div>

        <div className="card-glass p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">EMAIL</label>
              <input
                {...register('email', { required: 'Email required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                type="email"
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400/80 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-mono text-muted tracking-wider">PASSWORD</label>
                <a href="#" className="text-xs text-accent/60 hover:text-accent transition-colors">Forgot password?</a>
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
              ) : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-muted text-xs mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
