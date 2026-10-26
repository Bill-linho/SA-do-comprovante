import api from './api';

export const listarReservas = (filtros = {}) =>
  api.get('/reservas', { params: filtros });

export const criarReserva = (dados) =>
  api.post('/reservas', dados);

export const atualizarStatusReserva = (id, status) =>
  api.patch(`/reservas/${id}/status`, { status });

export const cancelarReserva = (id) =>
  api.delete(`/reservas/${id}`);
