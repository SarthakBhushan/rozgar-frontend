import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMyRfqs, useCancelRfq } from '../hooks/useApi'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/ui/StatusBadge'
import { formatDate, formatCurrency } from '../lib/utils'
import { Plus, MapPin, Package } from 'lucide-react'

export default function MyRfqsPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useMyRfqs(page)
  const cancelRfq = useCancelRfq()

  async function handleCancel(rfqId) {
    if (!confirm('Cancel this RFQ? This cannot be undone.')) return
    await cancelRfq.mutateAsync(rfqId)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My requirements</h1>
          <p className="text-sm text-gray-500 mt-0.5">RFQs you have posted</p>
        </div>
        <Link to="/rfq/post" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New requirement
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : data?.content?.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No requirements yet"
          description="Post a requirement and get quotes from verified sellers within hours."
          action={
            <Link to="/rfq/post" className="btn-primary mt-2">Post first requirement</Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data.content.map(rfq => (
              <div key={rfq.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Link to={`/rfq/${rfq.id}`} className="text-sm font-semibold text-gray-900 hover:text-navy-700 transition-colors leading-snug">
                    {rfq.title}
                  </Link>
                  <StatusBadge status={rfq.status} />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" /> {rfq.quantity} {rfq.unit}
                  </span>
                  {rfq.targetPrice && (
                    <span>Budget: {formatCurrency(rfq.targetPrice)}/{rfq.unit}</span>
                  )}
                  {rfq.deliveryLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {rfq.deliveryLocation}
                    </span>
                  )}
                  <span>Posted {formatDate(rfq.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link to={`/rfq/${rfq.id}`} className="text-xs font-medium text-ember-500 hover:text-ember-600">
                    View quotes ({rfq.quotes?.length ?? 0}) →
                  </Link>
                  {rfq.status === 'OPEN' || rfq.status === 'RESPONDED' || rfq.status === 'NEGOTIATING' ? (
                    <button
                      className="text-xs text-red-500 hover:text-red-700"
                      onClick={() => handleCancel(rfq.id)}
                      disabled={cancelRfq.isPending}
                    >
                      Cancel RFQ
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {data?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button className="btn-secondary text-xs py-1.5 px-3" disabled={data.first} onClick={() => setPage(p => p - 1)}>Previous</button>
              <span className="text-xs text-gray-500">Page {data.page + 1} of {data.totalPages}</span>
              <button className="btn-secondary text-xs py-1.5 px-3" disabled={data.last} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
