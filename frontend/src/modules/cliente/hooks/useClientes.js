import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteApi } from '../api/cliente.api';

export const clienteKeys = {
  all: ['clientes'],
  lists: () => [...clienteKeys.all, 'list'],
  list: (params) => [...clienteKeys.lists(), params],
  details: () => [...clienteKeys.all, 'detail'],
  detail: (id) => [...clienteKeys.details(), id],
};

export function useClientes(params) {
  return useQuery({
    queryKey: clienteKeys.list(params),
    queryFn: async () => {
      const response = await clienteApi.list(params);
      return { data: response.data, meta: response.meta };
    },
  });
}

export function useCliente(id) {
  return useQuery({
    queryKey: clienteKeys.detail(id),
    queryFn: async () => {
      const response = await clienteApi.getById(id);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCrearCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => clienteApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
    },
  });
}

export function useActualizarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => clienteApi.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clienteKeys.detail(id) });
    },
  });
}

export function useEliminarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => clienteApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clienteKeys.lists() });
    },
  });
}
