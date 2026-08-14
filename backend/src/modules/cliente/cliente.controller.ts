import { Request, Response, NextFunction } from 'express';
import { clienteService } from './cliente.service';
import { ok, paginated, noContent } from '@/shared/response';
import {
  createClienteSchema,
  updateClienteSchema,
  listClienteSchema,
} from './cliente.schema';

export const clienteController = {

  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listClienteSchema.parse(req.query);
      const { data, meta } = await clienteService.list(query);
      paginated(res, data, meta);
    } catch (err) { next(err); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await clienteService.getById(Number(req.params.id));
      ok(res, data);
    } catch (err) { next(err); }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = createClienteSchema.parse(req.body);
      const data = await clienteService.create(dto);
      ok(res, data, 201);
    } catch (err) { next(err); }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = updateClienteSchema.parse(req.body);
      const data = await clienteService.update(Number(req.params.id), dto);
      ok(res, data);
    } catch (err) { next(err); }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await clienteService.delete(Number(req.params.id));
      noContent(res);
    } catch (err) { next(err); }
  },
};
