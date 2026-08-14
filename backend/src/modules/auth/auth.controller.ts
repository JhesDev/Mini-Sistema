import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { loginSchema } from './auth.schema';
import { ok } from '@/shared/response';

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await authService.login(dto);
      ok(res, result);
    } catch (err) {
      next(err);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const user = await authService.getProfile(userId);
      ok(res, user);
    } catch (err) {
      next(err);
    }
  },
};
