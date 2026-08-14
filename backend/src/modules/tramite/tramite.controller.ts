import { Request, Response, NextFunction } from 'express';
import { tramiteService } from './tramite.service';
import { ok, paginated } from '@/shared/response';
import {
  createTramiteSchema,
  cambiarEstadoSchema,
  listTramiteSchema,
} from './tramite.schema';

export const tramiteController = {

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listTramiteSchema.parse(req.query);
      const { data, meta } = await tramiteService.list(query);
      paginated(res, data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await tramiteService.getById(Number(req.params.id));
      ok(res, data);
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = createTramiteSchema.parse(req.body);
      const data = await tramiteService.create(dto);
      ok(res, data, 201);
    } catch (err) { next(err); }
  },

  cambiarEstado: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = cambiarEstadoSchema.parse(req.body);
      const data = await tramiteService.cambiarEstado(Number(req.params.id), dto);
      ok(res, data);
    } catch (err) { next(err); }
  },
};
