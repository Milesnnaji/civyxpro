import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') || 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('All fields are required')
    if (mode === 'register' && !form.name) return setError('Name is required')

    setLoading(true)
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 font-syne">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #6C63FF18 0%, transparent 70%)' }} />

      <div className="card p-10 w-full max-w-md relative fade-up">
        <button onClick={() => navigate('/')}
          className="absolute top-5 left-5 text-muted hover:text-white text-sm bg-transparent border-none cursor-pointer transition-colors">
          ← Back
        </button>

        <div className="text-center mb-8">
          <div className="text-3xl font-black mb-1">
            <span className="gradient-text">Civyx</span>
            <span style={{ color: '#F5C542' }}>Pro</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-3">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted text-sm mt-1">
            {mode === 'login' ? 'Sign in to continue building' : 'Start building professional resumes today'}
          </p>
        </div>

        <form onSubmit={handle} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="section-title">Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="John Doe" className="input-base" />
            </div>
          )}
          <div>
            <label className="section-title">Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com" className="input-base" />
          </div>
          <div>
            <label className="section-title">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••" className="input-base" />
          </div>

          {error && (
            <div className="bg-[#FF5B5B15] border border-[#FF5B5B44] rounded-xl px-4 py-3 text-[#FF5B5B] text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary py-3 text-base mt-1 glow-accent"
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-5">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-[#A5A0FF] font-semibold ml-1 bg-transparent border-none cursor-pointer text-sm">
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
