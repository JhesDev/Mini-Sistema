import { z } from 'zod';
import { TramiteEstadoEnum } from '../tramite.schema';

// ── Schema de creación de seguimiento ─────────────────────────────────────
// (usado internamente por tramite.service al cambiar estado)

export const createSeguimientoSchema = z.object({
  tramite_id: z.number().int().positive(),
  estado_anterior: TramiteEstadoEnum.nullable().optional(),
  estado_nuevo: TramiteEstadoEnum,
  comentario: z.string().max(500).nullable().optional(),
  usuario: z.string().min(1).max(100),
});

/** Query params GET /api/tramites/:tramiteId/seguimientos */
export const listSeguimientoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateSeguimientoDto = z.infer<typeof createSeguimientoSchema>;
export type ListSeguimientoQuery = z.infer<typeof listSeguimientoSchema>;
