import { apiRequest, jsonBody } from './apiClient';

export const staffService = {
  list: () => apiRequest('/staff'),
  create: (staff) => apiRequest('/staff', { method: 'POST', body: jsonBody(staff) }),
  update: (id, changes) => apiRequest(`/staff/${id}`, { method: 'PATCH', body: jsonBody(changes) })
};
