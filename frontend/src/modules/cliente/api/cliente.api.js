import { get, post, put, del } from '@/shared/api/httpClient';

export const clienteApi = {
  list: (params) => get('/clientes', params),
  getById: (id) => get(`/clientes/${id}`),
  create: (body) => post('/clientes', body),
  update: (id, body) => put(`/clientes/${id}`, body),
  delete: (id) => del(`/clientes/${id}`),
};
