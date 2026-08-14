import { useQuery } from '@tanstack/react-query';
import { seguimientoApi } from '../api/seguimiento.api';

export const seguimientoKeys = {
  all: ['seguimientos'],
  byTramite: (tramiteId, params) => [...seguimientoKeys.all, tramiteId, params],
};

export function useSeguimientos(tramiteId, params = { page: 1, limit: 50 }) {
  return useQuery({
    queryKey: seguimientoKeys.byTramite(tramiteId, params),
    queryFn: async () => {
      const response = await seguimientoApi.listByTramite(tramiteId, params);
      return { data: response.data, meta: response.meta };
    },
    enabled: Boolean(tramiteId),
  });
}
