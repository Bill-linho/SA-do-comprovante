import { apiRequest } from './apiClient';

export const tableService = { list: () => apiRequest('/tables') };
