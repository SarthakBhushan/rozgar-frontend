import { useParams, Link } from 'react-router-dom'
import { useBusiness, useBusinessCatalog } from '../hooks/useApi'
import Spinner from '../components/ui/Spinner'
import { MapPin, Phone, Globe, ShieldCheck, Package } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

function CatalogCard({ item }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {item.itemType}
        </span>
        {item.category && (
          <span className="text-xs text-gray-400">{item.category.name}</span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.name}</h3>
      {item.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
      )}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-bold text-navy-700">
            {formatCurrency(item.pricePerUnit)}/{item.unit}
          </div>
          <div className="text-xs text-gray-400">Min. {item.minOrderQuantity} {item.unit}</div>
        </div>
        <Link
          to={`/rfq/post?businessId=${item.businessId}&itemId=${item.id}`}
          className="btn-primary text-xs py-1.5 px-3"
        >
          Request quote
        </Link>
      </div>
    </div>
  )
}

export default function BusinessDetailPage() {
  const { id } = useParams()
  const { data: business, isLoading: bizLoading } = useBusiness(id)
  const { data: catalog } = useBusinessCatalog(id)

  if (bizLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!business) return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500">Business not found.</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-16 h-16 bg-navy-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-7 h-7 text-navy-700" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-lg font-bold text-gray-900">{business.name}</h1>
              {business.status === 'VERIFIED' && (
                <span className="badge-verified">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {business.businessType?.replace('_', ' ')}
            </p>
            {business.description && (
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{business.description}</p>
            )}
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {business.address && `${business.address}, `}{business.city}, {business.state} {business.pincode}
              </span>
              {business.phone && (
                <a href={`tel:${business.phone}`} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-ember-500">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {business.phone}
                </a>
              )}
              {business.website && (
                <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-ember-500">
                  <Globe className="w-3.5 h-3.5 text-gray-400" /> Website
                </a>
              )}
            </div>
          </div>
          <Link
            to={`/rfq/post?businessId=${business.id}`}
            className="btn-primary whitespace-nowrap"
          >
            Send requirement
          </Link>
        </div>
      </div>

      {/* Registration info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {business.gstNumber && (
          <div className="bg-warm border border-gray-200 rounded px-4 py-3">
            <div className="text-xs text-gray-500 mb-0.5">GST Number</div>
            <div className="text-xs font-mono font-medium text-gray-900">{business.gstNumber}</div>
          </div>
        )}
        {business.panNumber && (
          <div className="bg-warm border border-gray-200 rounded px-4 py-3">
            <div className="text-xs text-gray-500 mb-0.5">PAN Number</div>
            <div className="text-xs font-mono font-medium text-gray-900">{business.panNumber}</div>
          </div>
        )}
        <div className="bg-warm border border-gray-200 rounded px-4 py-3">
          <div className="text-xs text-gray-500 mb-0.5">Status</div>
          <div className="text-xs font-medium text-gray-900">{business.status}</div>
        </div>
      </div>

      {/* Catalog */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Products & Services {catalog?.content?.length > 0 && `(${catalog.totalElements})`}
        </h2>
        {catalog?.content?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.content.map(item => <CatalogCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="text-center py-10 text-sm text-gray-500 bg-warm border border-gray-100 rounded-lg">
            No catalog items listed yet.
          </div>
        )}
      </div>
    </div>
  )
}
