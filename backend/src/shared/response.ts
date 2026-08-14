import { Response } from 'express';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── Respuestas de éxito ────────────────────────────────────────────────────

/** 200 / 201 con data */
export const ok = (res: Response, data: unknown, status = 200): Response =>
  res.status(status).json({ ok: true, data });

/** 200 con data + paginación */
export const paginated = (
  res: Response,
  data: unknown,
  meta: PaginationMeta,
): Response => res.status(200).json({ ok: true, data, meta });

/** 204 No Content */
export const noContent = (res: Response): Response =>
  res.status(204).send();
