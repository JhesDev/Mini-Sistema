import { get, post, patch } from '@/shared/api/httpClient';

export const tramiteApi = {
  list: (params) => get('/tramites', params),
  getById: (id) => get(`/tramites/${id}`),
  create: (body) => post('/tramites', body),
  cambiarEstado: (id, body) => patch(`/tramites/${id}/estado`, body),
};
