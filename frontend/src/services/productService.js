import { apiRequest, jsonBody } from './apiClient';

export const productService = {
  list: (all = false) => apiRequest(`/products${all ? '?all=true' : ''}`),
  listCategories: (all = false) => apiRequest(`/categories${all ? '?all=true' : ''}`),
  create: (product) => apiRequest('/products', { method: 'POST', body: jsonBody(product) }),
  update: (id, changes) => apiRequest(`/products/${id}`, { method: 'PATCH', body: jsonBody(changes) }),
  createCategory: (category) => apiRequest('/categories', { method: 'POST', body: jsonBody(category) }),
  updateCategory: (id, changes) => apiRequest(`/categories/${id}`, { method: 'PATCH', body: jsonBody(changes) })
};
