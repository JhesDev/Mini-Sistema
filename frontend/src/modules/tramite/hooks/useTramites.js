import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tramiteApi } from '../api/tramite.api';
import { seguimientoKeys } from '../seguimiento/hooks/useSeguimientos';

export const tramiteKeys = {
  all: ['tramites'],
  lists: () => [...tramiteKeys.all, 'list'],
  list: (params) => [...tramiteKeys.lists(), params],
  details: () => [...tramiteKeys.all, 'detail'],
  detail: (id) => [...tramiteKeys.details(), id],
};

export function useTramites(params) {
  return useQuery({
    queryKey: tramiteKeys.list(params),
    queryFn: async () => {
      const response = await tramiteApi.list(params);
      return { data: response.data, meta: response.meta };
    },
  });
}

export function useTramite(id) {
  return useQuery({
    queryKey: tramiteKeys.detail(id),
    queryFn: async () => {
      const response = await tramiteApi.getById(id);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCrearTramite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => tramiteApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tramiteKeys.lists() });
    },
  });
}

export function useCambiarEstadoTramite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => tramiteApi.cambiarEstado(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: tramiteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tramiteKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: seguimientoKeys.all });
    },
  });
}
