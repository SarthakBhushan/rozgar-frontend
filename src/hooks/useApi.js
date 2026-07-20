import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../lib/utils'

// ── Auth ─────────────────────────────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: (data) => api.post('/auth/register', data).then(r => r.data.data),
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (data) => api.post('/auth/login', data).then(r => r.data.data),
  })
}

// ── Business ──────────────────────────────────────────────────────────────────

export function useMyBusiness() {
  return useQuery({
    queryKey: ['my-business'],
    queryFn: () => api.get('/businesses/me').then(r => r.data.data),
    retry: false,
  })
}

export function useBusiness(id) {
  return useQuery({
    queryKey: ['business', id],
    queryFn: () => api.get(`/businesses/${id}`).then(r => r.data.data),
    enabled: Boolean(id),
  })
}

export function useBusinesses(params) {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: () => api.get('/businesses', { params }).then(r => r.data.data),
  })
}

export function useCreateBusiness() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/businesses', data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-business'] })
      toast.success('Business registered successfully')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useUpdateBusiness(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.put(`/businesses/${id}`, data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-business'] })
      qc.invalidateQueries({ queryKey: ['business', id] })
      toast.success('Business updated')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

// ── Catalog ───────────────────────────────────────────────────────────────────

export function useMyCatalog(page = 0) {
  return useQuery({
    queryKey: ['my-catalog', page],
    queryFn: () => api.get('/catalog/my', { params: { page } }).then(r => r.data.data),
  })
}

export function useBusinessCatalog(businessId, page = 0) {
  return useQuery({
    queryKey: ['catalog', businessId, page],
    queryFn: () =>
      api.get(`/catalog/business/${businessId}`, { params: { page } }).then(r => r.data.data),
    enabled: Boolean(businessId),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data),
  })
}

export function useAddCatalogItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/catalog', data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-catalog'] })
      toast.success('Item added to catalog')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useUpdateCatalogItem(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.put(`/catalog/${id}`, data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-catalog'] })
      toast.success('Item updated')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useDeleteCatalogItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/catalog/${id}`).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-catalog'] })
      toast.success('Item removed')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

// ── RFQ ───────────────────────────────────────────────────────────────────────

export function useMyRfqs(page = 0) {
  return useQuery({
    queryKey: ['my-rfqs', page],
    queryFn: () => api.get('/rfq/my', { params: { page } }).then(r => r.data.data),
  })
}

export function useOpenRfqs(page = 0) {
  return useQuery({
    queryKey: ['open-rfqs', page],
    queryFn: () => api.get('/rfq/open', { params: { page } }).then(r => r.data.data),
  })
}

export function useRfq(id) {
  return useQuery({
    queryKey: ['rfq', id],
    queryFn: () => api.get(`/rfq/${id}`).then(r => r.data.data),
    enabled: Boolean(id),
  })
}

export function useRfqQuotes(rfqId) {
  return useQuery({
    queryKey: ['rfq-quotes', rfqId],
    queryFn: () => api.get(`/rfq/${rfqId}/quotes`).then(r => r.data.data),
    enabled: Boolean(rfqId),
  })
}

export function usePostRfq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/rfq', data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-rfqs'] })
      qc.invalidateQueries({ queryKey: ['open-rfqs'] })
      toast.success('RFQ posted successfully')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useSubmitQuote(rfqId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post(`/rfq/${rfqId}/quote`, data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rfq', rfqId] })
      qc.invalidateQueries({ queryKey: ['open-rfqs'] })
      toast.success('Quote submitted')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useAcceptQuote(rfqId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (quoteId) =>
      api.put(`/rfq/${rfqId}/quote/${quoteId}/accept`).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rfq', rfqId] })
      qc.invalidateQueries({ queryKey: ['rfq-quotes', rfqId] })
      qc.invalidateQueries({ queryKey: ['my-rfqs'] })
      toast.success('Quote accepted — deal closed!')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useRejectQuote(rfqId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (quoteId) =>
      api.put(`/rfq/${rfqId}/quote/${quoteId}/reject`).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rfq-quotes', rfqId] })
      toast.success('Quote rejected')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useCancelRfq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (rfqId) => api.put(`/rfq/${rfqId}/cancel`).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-rfqs'] })
      toast.success('RFQ cancelled')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export function useMyThreads() {
  return useQuery({
    queryKey: ['my-threads'],
    queryFn: () => api.get('/chat/threads').then(r => r.data.data),
  })
}

export function useChatHistory(threadId, page = 0) {
  return useQuery({
    queryKey: ['chat-history', threadId, page],
    queryFn: () =>
      api.get(`/chat/history/${threadId}`, { params: { page, size: 50 } })
        .then(r => r.data.data),
    enabled: Boolean(threadId),
    refetchInterval: false,
  })
}

export function useUnreadCount(threadId) {
  return useQuery({
    queryKey: ['unread', threadId],
    queryFn: () => api.get(`/chat/unread/${threadId}`).then(r => r.data.data),
    enabled: Boolean(threadId),
    refetchInterval: 10000,
  })
}

export function useGetOrCreateThread() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (rfqId) => api.post(`/chat/thread/${rfqId}`).then(r => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-threads'] }),
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/chat/send', data).then(r => r.data.data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['chat-history', variables.threadId] })
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function useMyOrdersAsBuyer(page = 0) {
  return useQuery({
    queryKey: ['orders-buyer', page],
    queryFn: () =>
      api.get('/transactions/orders/my/buyer', { params: { page } }).then(r => r.data.data),
  })
}

export function useMyOrdersAsSeller(page = 0) {
  return useQuery({
    queryKey: ['orders-seller', page],
    queryFn: () =>
      api.get('/transactions/orders/my/seller', { params: { page } }).then(r => r.data.data),
  })
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/transactions/orders/${id}`).then(r => r.data.data),
    enabled: Boolean(id),
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/transactions/orders', data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders-buyer'] })
      toast.success('Order created successfully')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useUpdateOrderStatus(id) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status) =>
      api.put(`/transactions/orders/${id}/status`, { status }).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', id] })
      qc.invalidateQueries({ queryKey: ['orders-buyer'] })
      qc.invalidateQueries({ queryKey: ['orders-seller'] })
      toast.success('Order status updated')
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
}

export function useOrderInvoice(orderId) {
  return useQuery({
    queryKey: ['invoice', orderId],
    queryFn: () =>
      api.get(`/transactions/orders/${orderId}/invoice`).then(r => r.data.data),
    enabled: Boolean(orderId),
    retry: false,
  })
}


// ── Payment ──────────────────────────────────────────────────────────────
export function useInitiatePayment() {
    return useMutation({
        mutationFn: (orderId) =>
            api.post(`/transactions/orders/${orderId}/payment/initiate`).then(r => r.data.data),
        onError: (e) => toast.error(getErrorMessage(e)),
    })
}

export function useVerifyPayment() {
    return useMutation({
        mutationFn: ({ orderId, ...body }) =>
            api.post(`/transactions/orders/${orderId}/payment/verify`, body).then(r => r.data.data),
        onError: (e) => toast.error(getErrorMessage(e)),
    })
}
