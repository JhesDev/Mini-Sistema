import { sequelize } from '@/shared/db';
import { NotFoundError, InvalidTransitionError } from '@/shared/error.middleware';
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
    // Verificar que el cliente existe
    const cliente = await clienteRepository.findById(dto.cliente_id);
    if (!cliente) throw new NotFoundError('Cliente');

    const result = await sequelize.transaction(async (t) => {
      const codigo = await tramiteRepository.nextCodigo();

      const tramite = await tramiteRepository.create(
        {
          codigo,
          cliente_id: dto.cliente_id,
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
