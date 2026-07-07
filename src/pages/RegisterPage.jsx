import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/utils'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const registerMutation = useRegister()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await registerMutation.mutateAsync(form)
      login(
        { userId: data.userId, name: data.name, email: data.email, role: data.role },
        data.token
      )
      toast.success('Account created! Set up your business profile.')
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-navy-700 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Rozgar</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500">
            Already on Rozgar?{' '}
            <Link to="/login" className="text-ember-500 font-medium hover:text-ember-600">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input
              className="input"
              placeholder="Ramesh Agarwal"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
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
            <label className="label">Phone number</label>
            <input
              className="input"
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              minLength={8}
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
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending && <Spinner size="sm" />}
            Create account
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          By registering you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
