import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useRfq, useRfqQuotes, useSubmitQuote,
  useAcceptQuote, useRejectQuote, useCreateOrder, useGetOrCreateThread
} from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'
import StatusBadge from '../components/ui/StatusBadge'
import { formatCurrency, formatDate, formatDateTime, getErrorMessage } from '../lib/utils'
import { MapPin, Calendar, Package, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

function QuoteForm({ rfqId, onClose }) {
  const submitQuote = useSubmitQuote(rfqId)
  const [form, setForm] = useState({ pricePerUnit: '', availableQuantity: '', note: '', validUntil: '' })
  const [error, setError] = useState('')

  function set(f) { return e => setForm(p => ({ ...p, [f]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await submitQuote.mutateAsync({
        pricePerUnit: parseFloat(form.pricePerUnit),
        availableQuantity: parseInt(form.availableQuantity),
        note: form.note || undefined,
        validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : undefined,
      })
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="card border-ember-200 bg-ember-50 mt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Submit your quote</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Price per unit (₹) *</label>
            <input className="input" type="number" step="0.01" value={form.pricePerUnit} onChange={set('pricePerUnit')} required placeholder="220.00" />
          </div>
          <div>
            <label className="label">Available quantity *</label>
            <input className="input" type="number" value={form.availableQuantity} onChange={set('availableQuantity')} required placeholder="1000" />
          </div>
        </div>
        <div>
          <label className="label">Note / terms</label>
          <textarea className="input" rows={2} value={form.note} onChange={set('note')} placeholder="Delivery timeline, packaging details, payment terms..." />
        </div>
        <div>
          <label className="label">Quote valid until</label>
          <input className="input" type="datetime-local" value={form.validUntil} onChange={set('validUntil')} />
        </div>
        {error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={submitQuote.isPending}>
            {submitQuote.isPending && <Spinner size="sm" />} Submit quote
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

function QuoteCard({ quote, rfqId, rfqStatus, isBuyer, rfqBuyerUserId }) {
  const acceptQuote = useAcceptQuote(rfqId)
  const rejectQuote = useRejectQuote(rfqId)
  const createOrder = useCreateOrder()
  const getOrCreateThread = useGetOrCreateThread()
  const navigate = useNavigate()
  const { user } = useAuth()

  const canAct = isBuyer && (rfqStatus === 'RESPONDED' || rfqStatus === 'NEGOTIATING') && quote.status === 'PENDING'

  async function handleAccept() {
    if (!confirm('Accept this quote? This will close the RFQ and reject all other quotes.')) return
    await acceptQuote.mutateAsync(quote.id)
  }

  async function handleReject() {
    await rejectQuote.mutateAsync(quote.id)
  }

  async function handleCreateOrder() {
    try {
      const order = await createOrder.mutateAsync({ rfqId: parseInt(rfqId), quoteId: quote.id })
      navigate(`/orders/${order.id}`)
    } catch {}
  }

  async function handleChat() {
    try {
      const thread = await getOrCreateThread.mutateAsync(rfqId)
      navigate(`/chat/${thread.id}`)
    } catch {}
  }

  return (
    <div className={`card ${quote.status === 'ACCEPTED' ? 'border-green-300 bg-green-50' : quote.status === 'REJECTED' ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-sm font-bold text-navy-700">
            {formatCurrency(quote.pricePerUnit)} / unit
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {quote.availableQuantity} units available
            {quote.validUntil && ` · Valid until ${formatDate(quote.validUntil)}`}
          </div>
        </div>
        <StatusBadge status={quote.status} />
      </div>

      {quote.note && (
        <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded px-3 py-2 mb-3 leading-relaxed">
          {quote.note}
        </p>
      )}

      <div className="text-2xs text-gray-400 mb-3">
        From business #{quote.sellerBusinessId} · Submitted {formatDateTime(quote.createdAt)}
      </div>

      <div className="flex gap-2 flex-wrap">
        {canAct && (
          <>
            <button
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              onClick={handleAccept}
              disabled={acceptQuote.isPending}
            >
              {acceptQuote.isPending && <Spinner size="sm" />} Accept quote
            </button>
            <button
              className="btn-secondary text-xs py-1.5 px-3"
              onClick={handleReject}
              disabled={rejectQuote.isPending}
            >
              Reject
            </button>
          </>
        )}
        {quote.status === 'ACCEPTED' && isBuyer && (
          <button
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
            onClick={handleCreateOrder}
            disabled={createOrder.isPending}
          >
            {createOrder.isPending && <Spinner size="sm" />} Create order
          </button>
        )}
        <button
          className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1"
          onClick={handleChat}
          disabled={getOrCreateThread.isPending}
        >
          <MessageSquare className="w-3 h-3" /> Chat
        </button>
      </div>
    </div>
  )
}

export default function RfqDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: rfq, isLoading } = useRfq(id)
  const { data: quotes } = useRfqQuotes(id)
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!rfq) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">RFQ not found.</div>

  const isBuyer = user?.userId === rfq.buyerUserId
  const canQuote = !isBuyer && (rfq.status === 'OPEN' || rfq.status === 'NEGOTIATING')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
        <Link to="/rfq/open" className="hover:text-gray-700">Open RFQs</Link>
        <span>/</span>
        <span className="text-gray-900">#{rfq.id}</span>
      </div>

      {/* RFQ Header */}
      <div className="card mb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-lg font-bold text-gray-900 leading-snug">{rfq.title}</h1>
          <StatusBadge status={rfq.status} />
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-5">{rfq.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div className="bg-warm border border-gray-100 rounded px-3 py-2">
            <div className="text-2xs text-gray-400 mb-0.5">Quantity needed</div>
            <div className="text-sm font-semibold text-gray-900">{rfq.quantity} {rfq.unit}</div>
          </div>
          {rfq.targetPrice && (
            <div className="bg-warm border border-gray-100 rounded px-3 py-2">
              <div className="text-2xs text-gray-400 mb-0.5">Target price</div>
              <div className="text-sm font-semibold text-ember-600">{formatCurrency(rfq.targetPrice)}/{rfq.unit}</div>
            </div>
          )}
          {rfq.deliveryLocation && (
            <div className="bg-warm border border-gray-100 rounded px-3 py-2">
              <div className="text-2xs text-gray-400 mb-0.5">Delivery</div>
              <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" /> {rfq.deliveryLocation}
              </div>
            </div>
          )}
          {rfq.deadline && (
            <div className="bg-warm border border-gray-100 rounded px-3 py-2">
              <div className="text-2xs text-gray-400 mb-0.5">Deadline</div>
              <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" /> {formatDate(rfq.deadline)}
              </div>
            </div>
          )}
        </div>

        <div className="text-2xs text-gray-400">
          Posted {formatDateTime(rfq.createdAt)}
          {rfq.buyerBusinessId && ` · Buyer business #${rfq.buyerBusinessId}`}
        </div>
      </div>

      {/* Quote submission */}
      {canQuote && !showQuoteForm && (
        <button
          className="btn-primary w-full py-3 mb-5 flex items-center justify-center gap-2"
          onClick={() => setShowQuoteForm(true)}
        >
          <Package className="w-4 h-4" /> Submit your quote
        </button>
      )}
      {showQuoteForm && (
        <div className="mb-5">
          <QuoteForm rfqId={id} onClose={() => setShowQuoteForm(false)} />
        </div>
      )}

      {/* Quotes */}
      {isBuyer && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Quotes received {quotes?.length > 0 && `(${quotes.length})`}
          </h2>
          {!quotes || quotes.length === 0 ? (
            <div className="text-center py-10 bg-warm border border-gray-100 rounded-lg text-sm text-gray-500">
              No quotes yet. Sellers will respond here once they see your requirement.
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map(q => (
                <QuoteCard
                  key={q.id}
                  quote={q}
                  rfqId={id}
                  rfqStatus={rfq.status}
                  isBuyer={isBuyer}
                  rfqBuyerUserId={rfq.buyerUserId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seller sees quote count */}
      {!isBuyer && rfq.quotes?.length > 0 && (
        <div className="text-sm text-gray-500 text-center py-6 bg-warm border border-gray-100 rounded-lg">
          {rfq.quotes.length} quote{rfq.quotes.length !== 1 ? 's' : ''} submitted on this RFQ.
          Only the buyer can view individual quotes.
        </div>
      )}
    </div>
  )
}
