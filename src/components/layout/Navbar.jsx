import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-15 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-navy-700 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-bold text-base text-gray-900 tracking-tight">Rozgar</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/businesses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Browse Businesses
          </Link>
          <Link to="/rfq/open" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Open RFQs
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">
                {user?.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-ghost flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary">Join Rozgar</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link to="/businesses" className="block text-sm text-gray-700 py-1" onClick={() => setMobileOpen(false)}>Browse Businesses</Link>
          <Link to="/rfq/open" className="block text-sm text-gray-700 py-1" onClick={() => setMobileOpen(false)}>Open RFQs</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block text-sm text-gray-700 py-1" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="block text-sm text-red-600 py-1">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" className="btn-secondary flex-1 text-center" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/register" className="btn-primary flex-1 text-center" onClick={() => setMobileOpen(false)}>Join</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
