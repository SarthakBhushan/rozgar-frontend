import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOpenRfqs } from '../hooks/useApi'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { formatCurrency, formatDate } from '../lib/utils'
import { MapPin, Calendar, Package } from 'lucide-react'

function RfqCard({ rfq }) {
  return (
    <Link
      to={`/rfq/${rfq.id}`}
      className="card hover:border-navy-700 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-navy-700 transition-colors leading-snug">
          {rfq.title}
        </h3>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
          OPEN
        </span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
        {rfq.description}
      </p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          {rfq.quantity} {rfq.unit}
        </span>
        {rfq.targetPrice && (
          <span className="text-ember-600 font-medium">
            Budget: {formatCurrency(rfq.targetPrice)}/{rfq.unit}
          </span>
        )}
        {rfq.deliveryLocation && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {rfq.deliveryLocation}
          </span>
        )}
        {rfq.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> By {formatDate(rfq.deadline)}
          </span>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-2xs text-gray-400">Posted {formatDate(rfq.createdAt)}</span>
        <span className="text-xs font-medium text-ember-500 group-hover:text-ember-600">
          Submit quote →
        </span>
      </div>
    </Link>
  )
}

export default function OpenRfqsPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useOpenRfqs(page)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Open requirements</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Buyers looking for suppliers — submit a quote to win the business.
          </p>
        </div>
        <Link to="/rfq/post" className="btn-primary whitespace-nowrap">
          Post your requirement
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : data?.content?.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No open requirements right now"
          description="Check back later or post your own requirement to get quotes from sellers."
          action={
            <Link to="/rfq/post" className="btn-primary mt-2">
              Post a requirement
            </Link>
          }
        />
      ) : (
        <>
          {data?.totalElements > 0 && (
            <p className="text-xs text-gray-500 mb-4">
              {data.totalElements} open requirement{data.totalElements !== 1 ? 's' : ''}
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {data.content.map(rfq => <RfqCard key={rfq.id} rfq={rfq} />)}
          </div>

          {data?.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                className="btn-secondary text-xs py-1.5 px-3"
                disabled={data.first}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {data.page + 1} of {data.totalPages}
              </span>
              <button
                className="btn-secondary text-xs py-1.5 px-3"
                disabled={data.last}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
