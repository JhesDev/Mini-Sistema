import { z } from 'zod';
import { createClienteSchema } from '@/modules/cliente/cliente.schema';

// ── Enums ──────────────────────────────────────────────────────────────────

export const TramiteEstadoEnum = z.enum([
  'REGISTRADO',
  'EN_FIRMAS',
  'PRESENTADO',
  'OBSERVADO',
  'INSCRITO',
  'CERRADO',
  'ANULADO',
]);

export type TramiteEstado = z.infer<typeof TramiteEstadoEnum>;

// ── Máquina de estados (transiciones permitidas) ───────────────────────────

export const TRANSICIONES_PERMITIDAS: Record<TramiteEstado, TramiteEstado[]> = {
  REGISTRADO: ['EN_FIRMAS', 'ANULADO'],
  EN_FIRMAS: ['PRESENTADO', 'OBSERVADO', 'ANULADO'],
  OBSERVADO: ['EN_FIRMAS', 'PRESENTADO', 'ANULADO'],
  PRESENTADO: ['INSCRITO', 'OBSERVADO'],
  INSCRITO: ['CERRADO'],
  CERRADO: [],
  ANULADO: [],
};

// ── Schema base del trámite ────────────────────────────────────────────────

const currentYear = new Date().getFullYear();

const tramiteBase = z.object({
  cliente_id: z.number().int().positive('cliente_id debe ser un entero positivo'),
  placa: z.string().max(10).nullable().optional(),
  marca: z.string().min(1, 'La marca es obligatoria').max(50),
  modelo: z.string().min(1, 'El modelo es obligatorio').max(50),
  anio: z
    .number()
    .int()
    .min(1990, 'Año mínimo: 1990')
    .max(currentYear + 1, `Año máximo: ${currentYear + 1}`),
  monto: z.number().nonnegative('El monto no puede ser negativo').nullable().optional(),
});

// ── Schemas de entrada ─────────────────────────────────────────────────────

/** POST /api/tramites */
export const createTramiteSchema = tramiteBase
  .extend({
    /** Usuario que registra el trámite (requerido para el primer seguimiento) */
    usuario: z.string().min(1).max(100).default('sistema'),
    cliente_id: z.number().int().positive().optional(),
    cliente: createClienteSchema.optional(),
  })
  .refine((d) => d.cliente_id != null || d.cliente != null, {
    message: 'Se requiere cliente_id o cliente (tipo_doc + num_doc)',
    path: ['cliente_id'],
  });

/** PATCH /api/tramites/:id/estado */
export const cambiarEstadoSchema = z.object({
  estado: TramiteEstadoEnum,
  comentario: z.string().max(500).optional(),
  usuario: z.string().min(1).max(100).default('sistema'),
});

/** Query params para GET /api/tramites */
export const listTramiteSchema = z.object({
  estado: TramiteEstadoEnum.optional(),
  cliente_id: z.coerce.number().int().positive().optional(),
  fecha_desde: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    .optional(),
  fecha_hasta: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ── Tipos inferidos ────────────────────────────────────────────────────────

export const updateTramiteSchema = z.object({
  cliente_id: z.number().int().positive().optional(),
  cliente: createClienteSchema.optional(),
  placa: z.string().max(10).nullable().optional(),
  marca: z.string().max(50).optional(),
  modelo: z.string().max(50).optional(),
  anio: z
    .number()
    .int()
    .min(1990)
    .max(currentYear + 1)
    .optional(),
  monto: z.number().nonnegative().nullable().optional(),
});

export type CreateTramiteDto = z.infer<typeof createTramiteSchema>;
export type UpdateTramiteDto = z.infer<typeof updateTramiteSchema>;
export type CambiarEstadoDto = z.infer<typeof cambiarEstadoSchema>;
export type ListTramiteQuery = z.infer<typeof listTramiteSchema>;

