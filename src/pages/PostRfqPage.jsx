import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePostRfq } from '../hooks/useApi'
import { getErrorMessage } from '../lib/utils'
import Spinner from '../components/ui/Spinner'

export default function PostRfqPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const postRfq = usePostRfq()
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    unit: '',
    quantity: '',
    targetPrice: '',
    deliveryLocation: '',
    deadline: '',
    targetSellerBusinessId: searchParams.get('businessId') || '',
    catalogItemId: searchParams.get('itemId') || '',
  })

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        quantity: parseInt(form.quantity),
        targetPrice: form.targetPrice ? parseFloat(form.targetPrice) : undefined,
        targetSellerBusinessId: form.targetSellerBusinessId ? parseInt(form.targetSellerBusinessId) : undefined,
        catalogItemId: form.catalogItemId ? parseInt(form.catalogItemId) : undefined,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
      }
      const rfq = await postRfq.mutateAsync(payload)
      navigate(`/rfq/${rfq.id}`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">Post a requirement</h1>
        <p className="text-sm text-gray-500 mt-1">
          Describe what you need. Verified sellers will respond with their best quote.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">What do you need?</h2>
          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              value={form.title}
              onChange={set('title')}
              placeholder="Need 500 meters of GSM 200 cotton fabric"
              required
              minLength={5}
            />
          </div>
          <div>
            <label className="label">Detailed description *</label>
            <textarea
              className="input"
              rows={4}
              value={form.description}
              onChange={set('description')}
              placeholder="Describe specifications, quality requirements, packaging, any other details..."
              required
              minLength={10}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="label">Quantity *</label>
              <input
                className="input"
                type="number"
                value={form.quantity}
                onChange={set('quantity')}
                placeholder="500"
                required
                min={1}
              />
            </div>
            <div>
              <label className="label">Unit *</label>
              <input
                className="input"
                value={form.unit}
                onChange={set('unit')}
                placeholder="meter, kg..."
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Target price per unit (₹)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.targetPrice}
              onChange={set('targetPrice')}
              placeholder="Optional — your budget per unit"
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Delivery details</h2>
          <div>
            <label className="label">Delivery location</label>
            <input
              className="input"
              value={form.deliveryLocation}
              onChange={set('deliveryLocation')}
              placeholder="Mumbai, Maharashtra"
            />
          </div>
          <div>
            <label className="label">Deadline</label>
            <input
              className="input"
              type="datetime-local"
              value={form.deadline}
              onChange={set('deadline')}
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Targeting
            <span className="text-xs font-normal text-gray-500 ml-2">Optional</span>
          </h2>
          <div>
            <label className="label">Direct to specific seller (business ID)</label>
            <input
              className="input"
              type="number"
              value={form.targetSellerBusinessId}
              onChange={set('targetSellerBusinessId')}
              placeholder="Leave blank to reach all sellers"
            />
            <p className="text-2xs text-gray-400 mt-1">Leave blank to post publicly on the marketplace</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn-primary py-3 flex-1 flex items-center justify-center gap-2"
            disabled={postRfq.isPending}
          >
            {postRfq.isPending && <Spinner size="sm" />}
            Post requirement
          </button>
          <button type="button" className="btn-secondary py-3 px-6" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
