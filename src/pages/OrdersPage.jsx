import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyOrdersAsBuyer, useMyOrdersAsSeller } from '../hooks/useApi'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/ui/StatusBadge'
import { formatCurrency, formatDate } from '../lib/utils'

function OrderRow({ order }) {
  return (
    <Link to={`/orders/${order.id}`} className="card flex items-center justify-between gap-4 hover:border-gray-300 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-gray-900 group-hover:text-navy-700">
            Order #{order.id}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <div className="text-xs text-gray-500">
          {order.quantity} {order.unit} ·{' '}
          <span className="font-medium text-gray-700">{formatCurrency(order.totalAmount)}</span>
          {' · '}{formatDate(order.createdAt)}
        </div>
        {order.deliveryLocation && (
          <div className="text-xs text-gray-400 mt-0.5">→ {order.deliveryLocation}</div>
        )}
      </div>
      <span className="text-xs text-ember-500 group-hover:text-ember-600 font-medium whitespace-nowrap">
        View →
      </span>
    </Link>
  )
}

function OrderList({ data, isLoading, emptyTitle, emptyDesc, page, setPage }) {
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  if (!data?.content?.length) return <EmptyState icon="📦" title={emptyTitle} description={emptyDesc} />
  return (
    <>
      <div className="space-y-2">
        {data.content.map(o => <OrderRow key={o.id} order={o} />)}
      </div>
      {data?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button className="btn-secondary text-xs py-1.5 px-3" disabled={data.first} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span className="text-xs text-gray-500">Page {data.page + 1} of {data.totalPages}</span>
          <button className="btn-secondary text-xs py-1.5 px-3" disabled={data.last} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </>
  )
}

export default function OrdersPage({ role = 'buyer' }) {
  const [page, setPage] = useState(0)
  const buyerData = useMyOrdersAsBuyer(role === 'buyer' ? page : 0)
  const sellerData = useMyOrdersAsSeller(role === 'seller' ? page : 0)

  const isBuyer = role === 'buyer'
  const { data, isLoading } = isBuyer ? buyerData : sellerData

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isBuyer ? 'My orders' : 'Incoming orders'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isBuyer ? 'Orders you placed as a buyer' : 'Orders received as a seller'}
          </p>
        </div>
        {/* Toggle */}
        <div className="flex border border-gray-200 rounded overflow-hidden text-xs">
          <Link
            to="/orders/buyer"
            className={`px-3 py-1.5 font-medium transition-colors ${isBuyer ? 'bg-navy-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            As buyer
          </Link>
          <Link
            to="/orders/seller"
            className={`px-3 py-1.5 font-medium transition-colors ${!isBuyer ? 'bg-navy-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            As seller
          </Link>
        </div>
      </div>

      <OrderList
        data={data}
        isLoading={isLoading}
        emptyTitle={isBuyer ? 'No orders yet' : 'No incoming orders'}
        emptyDesc={
          isBuyer
            ? 'Accept a quote on one of your RFQs to create an order.'
            : 'When buyers accept your quotes, orders will appear here.'
        }
        page={page}
        setPage={setPage}
      />
    </div>
  )
}
