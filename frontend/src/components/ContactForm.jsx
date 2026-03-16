import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { contactApi } from '../services/api'

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setStatus('loading')
    try {
      await contactApi.send(data)
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="card-glass p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-glow/10 border border-glow/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-semibold text-white text-lg mb-2">Message sent!</h3>
        <p className="text-muted text-sm mb-6">I'll get back to you within 24–48 hours.</p>
        <button onClick={() => setStatus('idle')} className="btn-ghost text-sm py-2 px-5">
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">NAME</label>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder="John Doe"
            className="input-field"
          />
          {errors.name && <p className="text-red-400/80 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">EMAIL</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
            })}
            type="email"
            placeholder="john@example.com"
            className="input-field"
          />
          {errors.email && <p className="text-red-400/80 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider">MESSAGE</label>
        <textarea
          {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Message too short' } })}
          rows={5}
          placeholder="Tell me about your project..."
          className="input-field resize-none"
        />
        {errors.message && <p className="text-red-400/80 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {status === 'error' && (
        <p className="text-red-400/80 text-sm text-center">Failed to send. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full justify-center"
      >
        {status === 'loading' ? (
          <>
            <span className="w-4 h-4 border border-void/30 border-t-void rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
