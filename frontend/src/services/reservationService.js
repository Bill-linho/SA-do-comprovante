import { apiRequest, jsonBody } from './apiClient';

export const reservationService = {
  list: () => apiRequest('/reservations'),
  create: (reservation) => apiRequest('/reservations', { method: 'POST', body: jsonBody(reservation) }),
  updateStatus: (id, status) => apiRequest(`/reservations/${id}`, { method: 'PATCH', body: jsonBody({ status }) })
};
