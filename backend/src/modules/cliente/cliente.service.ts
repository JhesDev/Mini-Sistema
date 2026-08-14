import { clienteRepository } from './cliente.repository';
import { NotFoundError, ConflictError } from '@/shared/error.middleware';
import {
  CreateClienteDto,
  UpdateClienteDto,
  ListClienteQuery,
} from './cliente.schema';

export const clienteService = {

  list: async (query: ListClienteQuery) => {
    const { rows, count } = await clienteRepository.findAll(query);
    return {
      data: rows.map((c) => c.toJSON()),
      meta: {
        page: query.page,
        limit: query.limit,
        total: count,
        totalPages: Math.ceil(count / query.limit),
      },
    };
  },

  getById: async (id: number) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) throw new NotFoundError('Cliente');
    return cliente.toJSON();
  },

  create: async (data: CreateClienteDto) => {
    // Unicidad tipo_doc + num_doc
    const existing = await clienteRepository.findByTipoAndNumDoc(
      data.tipo_doc,
      data.num_doc,
    );
    if (existing) {
      throw new ConflictError(
        `Ya existe un cliente con ${data.tipo_doc} ${data.num_doc}`,
      );
    }
    const cliente = await clienteRepository.create(data);
    return cliente.toJSON();
  },

  update: async (id: number, data: UpdateClienteDto) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) throw new NotFoundError('Cliente');

    // Si se cambia tipo_doc o num_doc, verificar unicidad
    if (data.tipo_doc || data.num_doc) {
      const tipoDoc = data.tipo_doc ?? cliente.tipo_doc;
      const numDoc = data.num_doc ?? cliente.num_doc;
      const existing = await clienteRepository.findByTipoAndNumDoc(tipoDoc, numDoc);
      if (existing && existing.id !== id) {
        throw new ConflictError(
          `Ya existe un cliente con ${tipoDoc} ${numDoc}`,
        );
      }
    }

    await clienteRepository.update(id, data);
    const updated = await clienteRepository.findById(id);
    return updated!.toJSON();
  },

  delete: async (id: number) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) throw new NotFoundError('Cliente');
    await clienteRepository.delete(id);
  },
};
