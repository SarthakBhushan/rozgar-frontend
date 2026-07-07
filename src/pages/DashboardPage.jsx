import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMyBusiness, useMyRfqs, useMyOrdersAsBuyer, useMyOrdersAsSeller, useMyThreads } from '../hooks/useApi'
import Spinner from '../components/ui/Spinner'
import StatusBadge from '../components/ui/StatusBadge'
import { formatCurrency, formatDate } from '../lib/utils'
import { Building2, Package, MessageSquare, ShoppingBag, Plus, ArrowRight } from 'lucide-react'

function StatCard({ icon, label, value, to }) {
  return (
    <Link to={to} className="card hover:border-navy-700 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="text-gray-400">{icon}</div>
        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-navy-700 transition-colors" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: business, isLoading: bizLoading } = useMyBusiness()
  const { data: rfqs } = useMyRfqs()
  const { data: buyerOrders } = useMyOrdersAsBuyer()
  const { data: sellerOrders } = useMyOrdersAsSeller()
  const { data: threads } = useMyThreads()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your account.</p>
      </div>

      {/* Business status banner */}
      {bizLoading ? null : !business ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-amber-900">Set up your business profile</div>
            <div className="text-xs text-amber-700 mt-0.5">Add your business details to start trading on Rozgar</div>
          </div>
          <Link to="/business/setup" className="btn-primary text-xs py-2 px-4 whitespace-nowrap">
            Set up now
          </Link>
        </div>
      ) : business.status === 'PENDING' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 mb-6">
          <div className="text-sm font-semibold text-blue-900">Business verification in progress</div>
          <div className="text-xs text-blue-700 mt-0.5">
            <strong>{business.name}</strong> — your GST details are being verified. Usually takes 24 hours.
          </div>
        </div>
      ) : business.status === 'VERIFIED' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg px-5 py-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-green-900 flex items-center gap-2">
              ✓ {business.name}
              <span className="badge-verified">Verified</span>
            </div>
            <div className="text-xs text-green-700 mt-0.5">{business.city}, {business.state} · {business.businessType}</div>
          </div>
          <Link to="/business/edit" className="text-xs text-green-700 hover:text-green-900 font-medium">Edit →</Link>
        </div>
      ) : null}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Package className="w-4 h-4" />}
          label="My RFQs"
          value={rfqs?.totalElements ?? '—'}
          to="/rfq/my"
        />
        <StatCard
          icon={<ShoppingBag className="w-4 h-4" />}
          label="Orders as buyer"
          value={buyerOrders?.totalElements ?? '—'}
          to="/orders/buyer"
        />
        <StatCard
          icon={<Building2 className="w-4 h-4" />}
          label="Orders as seller"
          value={sellerOrders?.totalElements ?? '—'}
          to="/orders/seller"
        />
        <StatCard
          icon={<MessageSquare className="w-4 h-4" />}
          label="Active chats"
          value={Array.isArray(threads) ? threads.length : '—'}
          to="/chat"
        />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Link to="/rfq/post" className="card border-dashed hover:border-ember-500 hover:bg-ember-50 transition-all group flex items-center gap-3">
          <div className="w-8 h-8 bg-ember-100 rounded flex items-center justify-center group-hover:bg-ember-200 transition-colors">
            <Plus className="w-4 h-4 text-ember-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Post a requirement</div>
            <div className="text-xs text-gray-500">Get quotes from verified sellers</div>
          </div>
        </Link>
        <Link to="/business/catalog" className="card border-dashed hover:border-navy-700 hover:bg-navy-50 transition-all group flex items-center gap-3">
          <div className="w-8 h-8 bg-navy-100 rounded flex items-center justify-center group-hover:bg-navy-200 transition-colors">
            <Package className="w-4 h-4 text-navy-700" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Manage catalog</div>
            <div className="text-xs text-gray-500">Add products and services</div>
          </div>
        </Link>
        <Link to="/rfq/open" className="card border-dashed hover:border-green-500 hover:bg-green-50 transition-all group flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <ArrowRight className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Browse open RFQs</div>
            <div className="text-xs text-gray-500">Find new business opportunities</div>
          </div>
        </Link>
      </div>

      {/* Recent RFQs */}
      {rfqs?.content?.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent requirements</h2>
            <Link to="/rfq/my" className="text-xs text-ember-500 hover:text-ember-600 font-medium">View all →</Link>
          </div>
          <div className="space-y-2">
            {rfqs.content.slice(0, 3).map(rfq => (
              <Link key={rfq.id} to={`/rfq/${rfq.id}`} className="card flex items-center justify-between hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-medium text-gray-900">{rfq.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {rfq.quantity} {rfq.unit}
                    {rfq.targetPrice && ` · ₹${rfq.targetPrice}/${rfq.unit}`}
                    {' · '}{formatDate(rfq.createdAt)}
                  </div>
                </div>
                <StatusBadge status={rfq.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {buyerOrders?.content?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent orders</h2>
            <Link to="/orders/buyer" className="text-xs text-ember-500 hover:text-ember-600 font-medium">View all →</Link>
          </div>
          <div className="space-y-2">
            {buyerOrders.content.slice(0, 3).map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="card flex items-center justify-between hover:border-gray-300 transition-colors">
                <div>
                  <div className="text-sm font-medium text-gray-900">Order #{order.id}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {order.quantity} {order.unit} · {formatCurrency(order.totalAmount)} · {formatDate(order.createdAt)}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
