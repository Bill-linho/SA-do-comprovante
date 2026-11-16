import { apiRequest, jsonBody } from './apiClient';

export const orderService = {
  list: () => apiRequest('/orders'),
  create: (order) => apiRequest('/orders', { method: 'POST', body: jsonBody(order) }),
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, { method: 'PATCH', body: jsonBody({ status }) }),
  registerPayment: (id, method) => apiRequest(`/orders/${id}/payment`, { method: 'PATCH', body: jsonBody({ method }) }),
  getReceipt: (id) => apiRequest(`/receipts/${id}`)
};
