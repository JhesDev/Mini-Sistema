import { Request, Response, NextFunction } from 'express';
import { seguimientoService } from './seguimiento.service';
import { paginated } from '@/shared/response';
import { listSeguimientoSchema } from './seguimiento.schema';

export const seguimientoController = {

  listByTramite: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tramiteId = Number(req.params.tramiteId);
      const query = listSeguimientoSchema.parse(req.query);
      const { data, meta } = await seguimientoService.listByTramite(tramiteId, query);
      paginated(res, data, meta);
    } catch (err) { next(err); }
  },
};
