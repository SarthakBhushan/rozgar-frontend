import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateBusiness, useMyBusiness, useUpdateBusiness } from '../hooks/useApi'
import { getErrorMessage } from '../lib/utils'
import Spinner from '../components/ui/Spinner'

const BUSINESS_TYPES = [
  'MANUFACTURER', 'WHOLESALER', 'RETAILER',
  'SERVICE_PROVIDER', 'TRADER', 'DISTRIBUTOR',
]

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
]

export default function BusinessSetupPage() {
  const navigate = useNavigate()
  const { data: existing } = useMyBusiness()
  const createBusiness = useCreateBusiness()
  const updateBusiness = useUpdateBusiness(existing?.id)

  const [form, setForm] = useState({
    name: existing?.name || '',
    description: existing?.description || '',
    businessType: existing?.businessType || '',
    gstNumber: existing?.gstNumber || '',
    panNumber: existing?.panNumber || '',
    city: existing?.city || '',
    state: existing?.state || '',
    pincode: existing?.pincode || '',
    address: existing?.address || '',
    phone: existing?.phone || '',
    website: existing?.website || '',
  })
  const [error, setError] = useState('')

  const isEdit = Boolean(existing)

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) {
        await updateBusiness.mutateAsync(form)
      } else {
        await createBusiness.mutateAsync(form)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const isPending = createBusiness.isPending || updateBusiness.isPending

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900">
          {isEdit ? 'Edit business profile' : 'Set up your business'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isEdit
            ? 'Update your business information.'
            : 'Add your business details to start trading. Verification uses your GST number.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Business information</h2>
          <div>
            <label className="label">Business name *</label>
            <input className="input" value={form.name} onChange={set('name')} placeholder="Agarwal Textiles Pvt. Ltd." required />
          </div>
          <div>
            <label className="label">Business type *</label>
            <select className="input" value={form.businessType} onChange={set('businessType')} required>
              <option value="">Select type</option>
              {BUSINESS_TYPES.map(t => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Brief description of your business, products, and services..."
            />
          </div>
        </div>

        {/* GST / PAN */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Registration details
            <span className="text-xs font-normal text-gray-500 ml-2">Used for verification</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">GST number</label>
              <input
                className="input font-mono text-xs"
                value={form.gstNumber}
                onChange={set('gstNumber')}
                placeholder="29AAAAA0000A1Z5"
                maxLength={15}
              />
              <p className="text-2xs text-gray-400 mt-1">15-character GST identification number</p>
            </div>
            <div>
              <label className="label">PAN number</label>
              <input
                className="input font-mono text-xs"
                value={form.panNumber}
                onChange={set('panNumber')}
                placeholder="AAAAA0000A"
                maxLength={10}
              />
              <p className="text-2xs text-gray-400 mt-1">10-character PAN card number</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City *</label>
              <input className="input" value={form.city} onChange={set('city')} placeholder="Surat" required />
            </div>
            <div>
              <label className="label">State *</label>
              <select className="input" value={form.state} onChange={set('state')} required>
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Pincode *</label>
              <input className="input" value={form.pincode} onChange={set('pincode')} placeholder="395001" maxLength={6} required />
            </div>
            <div>
              <label className="label">Phone *</label>
              <input className="input" value={form.phone} onChange={set('phone')} placeholder="9876543210" type="tel" required />
            </div>
          </div>
          <div>
            <label className="label">Address *</label>
            <input className="input" value={form.address} onChange={set('address')} placeholder="Plot 12, GIDC Industrial Area" required />
          </div>
          <div>
            <label className="label">Website</label>
            <input className="input" value={form.website} onChange={set('website')} placeholder="https://yourcompany.com" type="url" />
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
            disabled={isPending}
          >
            {isPending && <Spinner size="sm" />}
            {isEdit ? 'Save changes' : 'Register business'}
          </button>
          <button type="button" className="btn-secondary py-3 px-6" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
