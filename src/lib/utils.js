import {clsx} from 'clsx'

export function cn(...inputs){
    return clsx(inputs)
}

export function formatCurrency(amount){
    if(!amount) return '₹0'
    return new Intl.NumberFormat('en-IN',{
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export function getStatusClass(status) {
  const map = {
    OPEN: 'status-open',
    RESPONDED: 'status-responded',
    NEGOTIATING: 'status-negotiating',
    ACCEPTED: 'status-accepted',
    REJECTED: 'status-rejected',
    EXPIRED: 'status-rejected',
    CONFIRMED: 'status-responded',
    PROCESSING: 'status-negotiating',
    SHIPPED: 'status-open',
    DELIVERED: 'status-accepted',
    CANCELLED: 'status-rejected',
    PENDING: 'status-negotiating',
    SUCCESS: 'status-accepted',
    FAILED: 'status-rejected',
  }
  return map[status] || 'status-open'
}

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors &&
      Object.values(error.response.data.errors).join(', ') ||
    error?.message ||
    'Something went wrong'
  )
}