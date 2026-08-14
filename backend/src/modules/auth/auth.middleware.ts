import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '@/shared/error.middleware';
import { UserRole, AuthUserPayload } from './auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'mini_sistema_jwt_secret_key_2026_super_secure';

/**
 * Middleware para validar el token JWT en cabecera Authorization: Bearer <token>
 */
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de autenticación requerido');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('La sesión ha expirado, por favor inicie sesión nuevamente');
    }
    throw new UnauthorizedError('Token de autenticación inválido');
  }
};

/**
 * Middleware para restringir acceso por rol
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (!roles.includes(req.user.rol)) {
      throw new ForbiddenError(`Acceso restringido a roles: ${roles.join(', ')}`);
    }

    next();
  };
};
