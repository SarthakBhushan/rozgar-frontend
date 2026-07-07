import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBusinesses } from '../hooks/useApi'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { MapPin, ShieldCheck, Building2 } from 'lucide-react'

const TYPES = ['', 'MANUFACTURER', 'WHOLESALER', 'RETAILER', 'SERVICE_PROVIDER', 'TRADER', 'DISTRIBUTOR']

function BusinessCard({ business }) {
  return (
    <Link to={`/businesses/${business.id}`} className="card hover:border-navy-700 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-navy-50 rounded flex items-center justify-center">
          <Building2 className="w-5 h-5 text-navy-700" />
        </div>
        {business.status === 'VERIFIED' && (
          <span className="badge-verified">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-navy-700 transition-colors">
        {business.name}
      </h3>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
        {business.description || 'No description provided.'}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" /> {business.city}, {business.state}
        </span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {business.businessType?.replace('_', ' ')}
        </span>
      </div>
    </Link>
  )
}

export default function BusinessesPage() {
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(0)

  const { data, isLoading } = useBusinesses({
    city: city || undefined,
    type: type || undefined,
    page,
    size: 12,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Browse verified businesses</h1>
        <p className="text-sm text-gray-500 mt-0.5">All businesses are GST-verified before listing.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="input w-auto flex-1 min-w-[150px] max-w-xs"
          placeholder="Filter by city..."
          value={city}
          onChange={e => { setCity(e.target.value); setPage(0) }}
        />
        <select
          className="input w-auto"
          value={type}
          onChange={e => { setType(e.target.value); setPage(0) }}
        >
          {TYPES.map(t => (
            <option key={t} value={t}>{t ? t.replace('_', ' ') : 'All types'}</option>
          ))}
        </select>
        {(city || type) && (
          <button
            className="btn-ghost text-xs"
            onClick={() => { setCity(''); setType(''); setPage(0) }}
          >
            Clear filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : data?.content?.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="No businesses found"
          description="Try adjusting your filters or search in a different city."
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {data?.content?.map(b => <BusinessCard key={b.id} business={b} />)}
          </div>

          {/* Pagination */}
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
