import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────────────

export const TipoDocEnum = z.enum(['DNI', 'CE', 'RUC']);

// ── Schema base del cliente ────────────────────────────────────────────────

const clienteBase = z.object({
  tipo_doc: TipoDocEnum,
  num_doc: z
    .string()
    .min(1, 'El número de documento es obligatorio')
    .max(20, 'Máximo 20 caracteres'),
  nombres: z.string().min(1, 'Los nombres son obligatorios').max(100),
  ap_paterno: z.string().min(1, 'El apellido paterno es obligatorio').max(100),
  ap_materno: z.string().max(100).nullable().optional(),
  email: z
    .string()
    .email('Email inválido')
    .max(150)
    .nullable()
    .optional(),
  telefono: z.string().max(20).nullable().optional(),
  fecha_nac: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha debe ser YYYY-MM-DD')
    .nullable()
    .optional(),
});

// ── Schemas de entrada para cada operación ─────────────────────────────────

/** POST /api/clientes */
export const createClienteSchema = clienteBase;

/** PUT /api/clientes/:id — todos los campos son opcionales */
export const updateClienteSchema = clienteBase.partial();

/** Query params para GET /api/clientes */
export const listClienteSchema = z.object({
  tipo_doc: TipoDocEnum.optional(),
  num_doc: z.string().optional(),
  nombre: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// ── Tipos inferidos ────────────────────────────────────────────────────────

export type CreateClienteDto = z.infer<typeof createClienteSchema>;
export type UpdateClienteDto = z.infer<typeof updateClienteSchema>;
export type ListClienteQuery = z.infer<typeof listClienteSchema>;
