import { sequelize } from '@/shared/db';
import { NotFoundError, InvalidTransitionError, ValidationError, ConflictError } from '@/shared/error.middleware';
import { tramiteRepository } from './tramite.repository';
import { seguimientoRepository } from './seguimiento/seguimiento.repository';
import { clienteRepository } from '@/modules/cliente/cliente.repository';
import {
  CreateTramiteDto,
  CambiarEstadoDto,
  ListTramiteQuery,
  TRANSICIONES_PERMITIDAS,
  TramiteEstado,
} from './tramite.schema';

export const tramiteService = {

  list: async (query: ListTramiteQuery) => {
    const { rows, count } = await tramiteRepository.findAll(query);
    return {
      data: rows.map((t) => t.toJSON()),
      meta: {
        page: query.page,
        limit: query.limit,
        total: count,
        totalPages: Math.ceil(count / query.limit),
      },
    };
  },

  getById: async (id: number) => {
    const tramite = await tramiteRepository.findById(id);
    if (!tramite) throw new NotFoundError('Trámite');
    return tramite.toJSON();
  },

  /**
   * Crea un trámite + primer registro de seguimiento en una sola transacción.
   * El código correlativo INM-YYYY-NNNN se genera dentro de la transacción.
   */
  create: async (dto: CreateTramiteDto) => {
    const result = await sequelize.transaction(async (t) => {
      // Resolver/crear cliente dentro de la misma transacción
      let clienteId: number | null = null;

      if (dto.cliente_id) {
        const cliente = await clienteRepository.findById(dto.cliente_id);
        if (!cliente) throw new NotFoundError('Cliente');
        clienteId = cliente.id;
      } else if ((dto as any).cliente) {
        const clienteDto = (dto as any).cliente;
        // Buscar por tipo_doc + num_doc
        let existing = await clienteRepository.findByTipoAndNumDoc(
          clienteDto.tipo_doc,
          clienteDto.num_doc,
        );
        if (!existing) {
          // Crear cliente dentro de la transacción
          const created = await clienteRepository.create(clienteDto, t);
          clienteId = created.id;
        } else {
          clienteId = existing.id;
        }
      } else {
        throw new ValidationError('Se requiere cliente_id o cliente (tipo_doc + num_doc)');
      }

      const codigo = await tramiteRepository.nextCodigo();

      const tramite = await tramiteRepository.create(
        {
          codigo,
          cliente_id: clienteId!,
          placa: dto.placa ?? null,
          marca: dto.marca,
          modelo: dto.modelo,
          anio: dto.anio,
          estado: 'REGISTRADO',
          monto: dto.monto ?? null,
        },
        t,
      );

      // Primer seguimiento en la misma transacción
      await seguimientoRepository.create(
        {
          tramite_id: tramite.id,
          estado_anterior: null,
          estado_nuevo: 'REGISTRADO',
          comentario: 'Trámite registrado correctamente.',
          usuario: dto.usuario,
        },
        t,
      );

      return tramite;
    });

    return result.toJSON();
  },

  update: async (id: number, dto: any) => {
    const tramiteRaw = await tramiteRepository.findByIdRaw(id);
    if (!tramiteRaw) throw new NotFoundError('Trámite');

    const result = await sequelize.transaction(async (t) => {
      // Resolver/crear cliente si es necesario
      let clienteId = tramiteRaw.cliente_id;

      if (dto.cliente_id) {
        const cliente = await clienteRepository.findById(dto.cliente_id);
        if (!cliente) throw new NotFoundError('Cliente');
        clienteId = cliente.id;
      } else if (dto.cliente) {
        const clienteDto = dto.cliente;
        let existing = await clienteRepository.findByTipoAndNumDoc(clienteDto.tipo_doc, clienteDto.num_doc);
        if (!existing) {
          const created = await clienteRepository.create(clienteDto, t);
          clienteId = created.id;
        } else {
          clienteId = existing.id;
        }
      }

      const updateData: any = {
        placa: dto.placa ?? tramiteRaw.placa,
        marca: dto.marca ?? tramiteRaw.marca,
        modelo: dto.modelo ?? tramiteRaw.modelo,
        anio: dto.anio ?? tramiteRaw.anio,
        monto: dto.monto ?? tramiteRaw.monto,
        cliente_id: clienteId,
      };

      await tramiteRepository.update(id, updateData, t);
      const updated = await tramiteRepository.findById(id);
      return updated!.toJSON();
    });

    return result;
  },

  delete: async (id: number) => {
    const tramite = await tramiteRepository.findByIdRaw(id);
    if (!tramite) throw new NotFoundError('Trámite');

    if (tramite.estado === 'INSCRITO' || tramite.estado === 'CERRADO') {
      throw new ConflictError('No se puede eliminar un trámite inscrito o cerrado');
    }

    await sequelize.transaction(async (t) => {
      await tramiteRepository.delete(id, t);
    });
  },

  cambiarEstado: async (id: number, dto: CambiarEstadoDto) => {
    const tramite = await tramiteRepository.findByIdRaw(id);
    if (!tramite) throw new NotFoundError('Trámite');

    const estadoActual = tramite.estado as TramiteEstado;
    const estadoNuevo = dto.estado;

    // Validar transición en la máquina de estados
    const permitidos = TRANSICIONES_PERMITIDAS[estadoActual];
    if (!permitidos.includes(estadoNuevo)) {
      throw new InvalidTransitionError(estadoActual, estadoNuevo);
    }

    await sequelize.transaction(async (t) => {
      await tramiteRepository.updateEstado(id, estadoNuevo, t);

      await seguimientoRepository.create(
        {
          tramite_id: id,
          estado_anterior: estadoActual,
          estado_nuevo: estadoNuevo,
          comentario: dto.comentario ?? null,
          usuario: dto.usuario,
        },
        t,
      );
    });

    const updated = await tramiteRepository.findById(id);
    return updated!.toJSON();
  },
};
