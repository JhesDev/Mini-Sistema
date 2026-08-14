import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from 'sequelize';

// ── Clases de error de aplicación ─────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: unknown[],
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown[]) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class InvalidTransitionError extends AppError {
  constructor(from: string, to: string) {
    super(
      `Transición de estado inválida: ${from} → ${to}`,
      409,
      'INVALID_TRANSITION',
    );
  }
}

// ── Middleware centralizado ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // 1. Errores propios de la aplicación
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      ok: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // 2. Errores de validación Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los datos enviados no son válidos',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // 3. Errores de validación / unicidad de Sequelize
  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      ok: false,
      error: {
        code: 'CONFLICT',
        message: 'Ya existe un registro con esos datos',
        details: err.errors.map((e) => ({ field: e.path, message: e.message })),
      },
    });
    return;
  }

  if (err instanceof SequelizeValidationError) {
    res.status(400).json({
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación en la base de datos',
        details: err.errors.map((e) => ({ field: e.path, message: e.message })),
      },
    });
    return;
  }

  // 4. Error genérico (no exponer stack en producción)
  console.error('[ERROR]', err);
  res.status(500).json({
    ok: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development' && err instanceof Error
          ? err.message
          : 'Error interno del servidor',
    },
  });
};
