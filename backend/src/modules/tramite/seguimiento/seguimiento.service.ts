import { seguimientoRepository } from './seguimiento.repository';
import { NotFoundError } from '@/shared/error.middleware';
import { tramiteRepository } from '../tramite.repository';
import { ListSeguimientoQuery } from './seguimiento.schema';

export const seguimientoService = {

  listByTramite: async (tramiteId: number, query: ListSeguimientoQuery) => {
    // Verificar que el trámite existe
    const tramite = await tramiteRepository.findByIdRaw(tramiteId);
    if (!tramite) throw new NotFoundError('Trámite');

    const { rows, count } = await seguimientoRepository.findByTramite(tramiteId, query);
    return {
      data: rows.map((s) => s.toJSON()),
      meta: {
        page: query.page,
        limit: query.limit,
        total: count,
        totalPages: Math.ceil(count / query.limit),
      },
    };
  },
};
