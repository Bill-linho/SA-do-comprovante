import { apiRequest, jsonBody } from './apiClient';

export const authService = {
  register: (user) => apiRequest('/auth/register', { method: 'POST', body: jsonBody(user) }),
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: jsonBody(credentials) })
};
