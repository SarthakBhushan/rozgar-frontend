import { useState } from 'react'
import { useMyCatalog, useCategories, useAddCatalogItem, useUpdateCatalogItem, useDeleteCatalogItem } from '../hooks/useApi'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import StatusBadge from '../components/ui/StatusBadge'
import { formatCurrency } from '../lib/utils'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const ITEM_TYPES = ['PRODUCT', 'SERVICE']
const STATUSES = ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']

function ItemForm({ initial, onClose, onSave }) {
  const { data: categories } = useCategories()
  const [form, setForm] = useState(initial || {
    name: '', description: '', itemType: 'PRODUCT',
    categoryId: '', pricePerUnit: '', unit: '', minOrderQuantity: 1,
  })

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      pricePerUnit: parseFloat(form.pricePerUnit),
      minOrderQuantity: parseInt(form.minOrderQuantity) || 1,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            {initial ? 'Edit item' : 'Add catalog item'}
          </h2>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Item name *</label>
            <input className="input" value={form.name} onChange={set('name')} required placeholder="Premium Cotton Fabric" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type *</label>
              <select className="input" value={form.itemType} onChange={set('itemType')} required>
                {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.categoryId} onChange={set('categoryId')}>
                <option value="">No category</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={form.description} onChange={set('description')} placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Price (₹) *</label>
              <input className="input" type="number" step="0.01" value={form.pricePerUnit} onChange={set('pricePerUnit')} required placeholder="250.00" />
            </div>
            <div>
              <label className="label">Unit *</label>
              <input className="input" value={form.unit} onChange={set('unit')} required placeholder="kg, piece, meter" />
            </div>
            <div>
              <label className="label">Min. qty</label>
              <input className="input" type="number" value={form.minOrderQuantity} onChange={set('minOrderQuantity')} min={1} />
            </div>
          </div>
          {initial && (
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={set('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="submit" className="btn-primary flex-1">Save item</button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useMyCatalog(page)
  const addItem = useAddCatalogItem()
  const deleteItem = useDeleteCatalogItem()
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const updateItem = useUpdateCatalogItem(editItem?.id)

  async function handleAdd(formData) {
    await addItem.mutateAsync(formData)
    setShowForm(false)
  }

  async function handleUpdate(formData) {
    await updateItem.mutateAsync(formData)
    setEditItem(null)
  }

  async function handleDelete(id) {
    if (!confirm('Remove this item from your catalog?')) return
    await deleteItem.mutateAsync(id)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My catalog</h1>
          <p className="text-sm text-gray-500 mt-0.5">Products and services your business offers</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : data?.content?.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No items yet"
          description="Add products or services to your catalog so buyers can find and request quotes."
          action={
            <button className="btn-primary mt-2" onClick={() => setShowForm(true)}>
              Add first item
            </button>
          }
        />
      ) : (
        <>
          <div className="space-y-2">
            {data.content.map(item => (
              <div key={item.id} className="card flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.itemType}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatCurrency(item.pricePerUnit)}/{item.unit} · Min. {item.minOrderQuantity} {item.unit}
                    {item.category && ` · ${item.category.name}`}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="p-1.5 text-gray-400 hover:text-navy-700 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setEditItem(item)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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

      {showForm && <ItemForm onClose={() => setShowForm(false)} onSave={handleAdd} />}
      {editItem && (
        <ItemForm
          initial={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  )
}
