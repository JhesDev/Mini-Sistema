import { get } from '@/shared/api/httpClient';

export const seguimientoApi = {
  listByTramite: (tramiteId, params) =>
    get(`/tramites/${tramiteId}/seguimientos`, params),
};
