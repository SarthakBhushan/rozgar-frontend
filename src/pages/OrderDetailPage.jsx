import { useParams, Link } from 'react-router-dom'
import { useOrder, useUpdateOrderStatus, useOrderInvoice } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'
import StatusBadge from '../components/ui/StatusBadge'
import { formatCurrency, formatDate, formatDateTime } from '../lib/utils'
import { FileText, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_FLOW = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

function StatusTimeline({ status }) {
  const idx = STATUS_FLOW.indexOf(status)
  return (
    <div className="flex items-center gap-0 mb-6">
      {STATUS_FLOW.map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2
              ${i <= idx ? 'bg-navy-700 border-navy-700 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span className={`text-2xs mt-1 whitespace-nowrap ${i <= idx ? 'text-navy-700 font-medium' : 'text-gray-400'}`}>
              {s}
            </span>
          </div>
          {i < STATUS_FLOW.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 ${i < idx ? 'bg-navy-700' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: order, isLoading } = useOrder(id)
  const updateStatus = useUpdateOrderStatus(id)
  const { data: invoice } = useOrderInvoice(id)

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Order not found.</div>

  const isBuyer = user?.userId === order.buyerUserId
  const isSeller = user?.userId === order.sellerUserId

  const sellerActions = {
    CONFIRMED: { label: 'Mark as Processing', nextStatus: 'PROCESSING' },
    PROCESSING: { label: 'Mark as Shipped', nextStatus: 'SHIPPED' },
  }

  const buyerActions = {
    SHIPPED: { label: 'Confirm Delivery', nextStatus: 'DELIVERED' },
  }

  const currentSellerAction = isSeller ? sellerActions[order.status] : null
  const currentBuyerAction = isBuyer ? buyerActions[order.status] : null

  const canCancel = (isBuyer || isSeller) &&
    !['DELIVERED', 'CANCELLED'].includes(order.status)

  async function handleStatusUpdate(status) {
    await updateStatus.mutateAsync(status)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
        <Link to={isBuyer ? '/orders/buyer' : '/orders/seller'} className="hover:text-gray-700">
          {isBuyer ? 'My orders' : 'Incoming orders'}
        </Link>
        <span>/</span>
        <span className="text-gray-900">Order #{order.id}</span>
      </div>

      {/* Header card */}
      <div className="card mb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Created {formatDateTime(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Status timeline */}
        {!['CANCELLED'].includes(order.status) && (
          <StatusTimeline status={order.status} />
        )}

        {/* Order details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-warm border border-gray-100 rounded px-3 py-2">
            <div className="text-2xs text-gray-400 mb-0.5">Quantity</div>
            <div className="text-sm font-semibold text-gray-900">{order.quantity} {order.unit}</div>
          </div>
          <div className="bg-warm border border-gray-100 rounded px-3 py-2">
            <div className="text-2xs text-gray-400 mb-0.5">Price per unit</div>
            <div className="text-sm font-semibold text-gray-900">{formatCurrency(order.pricePerUnit)}/{order.unit}</div>
          </div>
          <div className="bg-warm border border-gray-100 rounded px-3 py-2">
            <div className="text-2xs text-gray-400 mb-0.5">Total amount</div>
            <div className="text-sm font-bold text-navy-700">{formatCurrency(order.totalAmount)}</div>
          </div>
          {order.deliveryLocation && (
            <div className="bg-warm border border-gray-100 rounded px-3 py-2 col-span-2">
              <div className="text-2xs text-gray-400 mb-0.5">Delivery to</div>
              <div className="text-sm font-semibold text-gray-900">{order.deliveryLocation}</div>
            </div>
          )}
        </div>

        {/* Party info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 border-t border-gray-100 pt-4">
          <div>
            <span className="text-gray-400">Buyer: </span>
            <span className="font-medium text-gray-700">User #{order.buyerUserId}</span>
          </div>
          <div>
            <span className="text-gray-400">Seller: </span>
            <span className="font-medium text-gray-700">Business #{order.sellerBusinessId}</span>
          </div>
          <div>
            <span className="text-gray-400">RFQ: </span>
            <Link to={`/rfq/${order.rfqId}`} className="font-medium text-ember-500 hover:text-ember-600">
              #{order.rfqId} →
            </Link>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-5">
        {currentSellerAction && (
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => handleStatusUpdate(currentSellerAction.nextStatus)}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending && <Spinner size="sm" />}
            {currentSellerAction.label}
          </button>
        )}
        {currentBuyerAction && (
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => handleStatusUpdate(currentBuyerAction.nextStatus)}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending && <Spinner size="sm" />}
            {currentBuyerAction.label}
          </button>
        )}
        {canCancel && (
          <button
            className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
            onClick={() => {
              if (confirm('Cancel this order?')) handleStatusUpdate('CANCELLED')
            }}
            disabled={updateStatus.isPending}
          >
            Cancel order
          </button>
        )}
        <Link
          to={`/rfq/${order.rfqId}`}
          className="btn-ghost flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" /> View RFQ
        </Link>
      </div>

      {/* Invoice */}
      {invoice ? (
        <div className="card border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Invoice {invoice.invoiceNumber}</div>
                <div className="text-xs text-gray-500">
                  Amount: {formatCurrency(invoice.amount)} + GST {formatCurrency(invoice.gstAmount)} = {formatCurrency(invoice.totalAmount)}
                </div>
              </div>
            </div>
            <span className="text-xs text-green-700 font-medium">Issued {formatDate(invoice.createdAt)}</span>
          </div>
        </div>
      ) : order.status !== 'CANCELLED' && (
        <div className="card border-dashed text-center py-8">
          <FileText className="w-6 h-6 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Invoice will be generated after payment is confirmed.</p>
        </div>
      )}
    </div>
  )
}
