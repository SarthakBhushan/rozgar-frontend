import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-warm mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-navy-700 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="font-bold text-sm text-gray-900">Rozgar</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              B2B marketplace for Indian businesses. Verified. Transparent. Local.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Platform</p>
            <div className="space-y-2">
              <Link to="/businesses" className="block text-xs text-gray-500 hover:text-gray-900">Browse Businesses</Link>
              <Link to="/rfq/open" className="block text-xs text-gray-500 hover:text-gray-900">Open RFQs</Link>
              <Link to="/register" className="block text-xs text-gray-500 hover:text-gray-900">Join as Seller</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Account</p>
            <div className="space-y-2">
              <Link to="/login" className="block text-xs text-gray-500 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="block text-xs text-gray-500 hover:text-gray-900">Register</Link>
              <Link to="/dashboard" className="block text-xs text-gray-500 hover:text-gray-900">Dashboard</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">Contact</p>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">support@rozgar.in</p>
              <p className="text-xs text-gray-500">+91 98765 43210</p>
              <a href="https://wa.me/919876543210" className="text-xs text-green-600 hover:text-green-700">WhatsApp us</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">© 2024 Rozgar Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-xs text-gray-400">Made in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
