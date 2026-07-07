import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/utils'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const loginMutation = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await loginMutation.mutateAsync(form)
      login(
        { userId: data.userId, name: data.name, email: data.email, role: data.role },
        data.token
      )
      toast.success(`Welcome back, ${data.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-navy-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Rozgar</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-ember-500 font-medium hover:text-ember-600">
              Join Rozgar
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input
              className="input"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && <Spinner size="sm" />}
            Sign in
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
